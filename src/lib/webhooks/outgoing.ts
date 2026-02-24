/**
 * Outgoing Webhook Delivery System
 * Handles sending webhooks to external endpoints with retry logic and security
 */

import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';
import {
  WebhookConfig,
  WebhookPayload,
  WebhookDeliveryResult,
  WebhookDeliveryOptions,
  WebhookEventType,
  DEFAULT_DELIVERY_OPTIONS,
} from './types';

/**
 * Generate HMAC-SHA256 signature for webhook payload
 */
export function generateSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay
 */
function calculateBackoff(attempt: number, baseDelay: number): number {
  // Exponential backoff with jitter: baseDelay * 2^attempt + random jitter
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 1000; // Add up to 1 second of jitter
  return Math.min(exponentialDelay + jitter, 60000); // Cap at 60 seconds
}

/**
 * Deliver a webhook to an external endpoint
 */
export async function deliverWebhook(
  webhook: WebhookConfig,
  event: WebhookEventType,
  data: Record<string, unknown>,
  options: WebhookDeliveryOptions = {}
): Promise<WebhookDeliveryResult> {
  const { maxRetries, timeout, retryDelay } = { ...DEFAULT_DELIVERY_OPTIONS, ...options };
  
  const payloadId = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  
  const payload: WebhookPayload = {
    id: payloadId,
    event,
    timestamp,
    data,
  };

  const payloadString = JSON.stringify(payload);
  
  // Generate signature if secret is configured
  let signature: string | undefined;
  if (webhook.secret) {
    signature = generateSignature(payloadString, webhook.secret);
    payload.signature = `sha256=${signature}`;
  }

  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Webhook-ID': webhook.id,
    'X-Webhook-Event': event,
    'X-Webhook-Timestamp': timestamp,
    'User-Agent': 'EmpireSite-Webhook/1.0',
    ...webhook.headers,
  };

  if (signature) {
    headers['X-Webhook-Signature'] = `sha256=${signature}`;
  }

  let lastError: string | undefined;
  let attempts = 0;
  const startTime = Date.now();

  // Retry loop
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    attempts = attempt + 1;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers,
        body: payloadString,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const duration = Date.now() - startTime;

      if (response.ok) {
        // Update last_triggered_at
        await updateWebhookLastTriggered(webhook.id);
        
        return {
          success: true,
          statusCode: response.status,
          duration,
        };
      }

      // Non-2xx response
      const responseBody = await response.text().catch(() => '');
      lastError = `HTTP ${response.status}: ${responseBody.slice(0, 500)}`;

      // Don't retry on client errors (4xx) except 429 (rate limit)
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        return {
          success: false,
          statusCode: response.status,
          error: lastError,
          duration,
        };
      }

    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error';
      
      // Don't retry on certain errors
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          lastError = `Request timed out after ${timeout}ms`;
        }
      }
    }

    // Wait before retrying (except on last attempt)
    if (attempt < maxRetries) {
      const delay = calculateBackoff(attempt, retryDelay);
      await sleep(delay);
    }
  }

  const duration = Date.now() - startTime;
  
  return {
    success: false,
    error: lastError,
    duration,
  };
}

/**
 * Update webhook's last_triggered_at timestamp
 */
async function updateWebhookLastTriggered(webhookId: string): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase
      .from('webhook_configs')
      .update({ last_triggered_at: new Date().toISOString() } as never)
      .eq('id', webhookId);
  } catch (error) {
    console.error('Failed to update webhook last_triggered_at:', error);
  }
}

/**
 * Log webhook delivery attempt
 */
export async function logWebhookDelivery(
  webhookId: string,
  event: WebhookEventType,
  payload: Record<string, unknown>,
  statusCode: number | null,
  responseBody: string | null,
  attempts: number
): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.from('webhook_logs').insert({
      webhook_id: webhookId,
      event,
      payload,
      status_code: statusCode,
      response_body: responseBody?.slice(0, 10000), // Limit response body size
      attempts,
    } as never);
  } catch (error) {
    console.error('Failed to log webhook delivery:', error);
  }
}

/**
 * Deliver webhook and log the result
 */
export async function deliverAndLogWebhook(
  webhook: WebhookConfig,
  event: WebhookEventType,
  data: Record<string, unknown>,
  options?: WebhookDeliveryOptions
): Promise<WebhookDeliveryResult> {
  const result = await deliverWebhook(webhook, event, data, options);
  
  await logWebhookDelivery(
    webhook.id,
    event,
    { event, data },
    result.statusCode ?? null,
    result.error ?? null,
    result.success ? 1 : (options?.maxRetries ?? DEFAULT_DELIVERY_OPTIONS.maxRetries) + 1
  );

  return result;
}

/**
 * Trigger webhooks for a specific event
 * Finds all active webhooks subscribed to the event and delivers them
 */
export async function triggerWebhooks(
  event: WebhookEventType,
  data: Record<string, unknown>,
  options?: WebhookDeliveryOptions
): Promise<void> {
  try {
    const supabase = await createClient();
    
    // Get all active webhooks that subscribe to this event
    const { data: webhooks, error } = await supabase
      .from('webhook_configs')
      .select('*')
      .eq('active', true)
      .contains('events', [event]);

    if (error) {
      console.error('Failed to fetch webhooks:', error);
      return;
    }

    if (!webhooks || webhooks.length === 0) {
      return;
    }

    // Deliver to all matching webhooks in parallel
    const deliveryPromises = webhooks.map(webhook =>
      deliverAndLogWebhook(webhook as WebhookConfig, event, data, options)
        .catch(error => {
          console.error(`Webhook delivery failed for ${(webhook as WebhookConfig).id}:`, error);
        })
    );

    await Promise.allSettled(deliveryPromises);
  } catch (error) {
    console.error('Failed to trigger webhooks:', error);
  }
}

/**
 * Clean up old webhook logs (retention policy)
 * Should be called periodically (e.g., via cron job)
 */
export async function cleanupOldWebhookLogs(retentionDays: number = 30): Promise<number> {
  try {
    const supabase = await createClient();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const { data, error } = await supabase
      .from('webhook_logs')
      .delete()
      .lt('created_at', cutoffDate.toISOString())
      .select('id');

    if (error) {
      console.error('Failed to cleanup webhook logs:', error);
      return 0;
    }

    return data?.length ?? 0;
  } catch (error) {
    console.error('Failed to cleanup webhook logs:', error);
    return 0;
  }
}

/**
 * Test a webhook endpoint
 * Sends a test payload to verify the webhook is working
 */
export async function testWebhook(
  webhook: WebhookConfig
): Promise<WebhookDeliveryResult> {
  return deliverWebhook(
    webhook,
    'test' as WebhookEventType,
    {
      message: 'This is a test webhook from Empire Site',
      timestamp: new Date().toISOString(),
    },
    { maxRetries: 0, timeout: 10000 }
  );
}
