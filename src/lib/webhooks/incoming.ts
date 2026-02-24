/**
 * Incoming Webhook Handling System
 * Receives and processes webhooks from external services with signature verification
 */

import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// Supported webhook sources
export type IncomingWebhookSource = 
  | 'stripe'
  | 'make'
  | 'zapier'
  | 'generic'
  | 'custom';

// Human-readable labels for sources
export const INCOMING_WEBHOOK_SOURCE_LABELS: Record<IncomingWebhookSource, string> = {
  stripe: 'Stripe',
  make: 'Make.com',
  zapier: 'Zapier',
  generic: 'Genérico',
  custom: 'Personalizado',
};

// Incoming webhook configuration from database
export interface IncomingWebhookConfig {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  source: IncomingWebhookSource;
  secret_key: string | null;
  allowed_ips: string[];
  enabled: boolean;
  rate_limit: number;
  rate_limit_window: number;
  verify_signature: boolean;
  accepted_events: string[];
  last_received_at: string | null;
  total_requests: number;
  created_at: string;
  updated_at: string;
}

// Incoming webhook log from database
export interface IncomingWebhookLog {
  id: string;
  webhook_id: string;
  event_type: string | null;
  source: string;
  ip_address: string | null;
  headers: Record<string, string>;
  payload: Record<string, unknown>;
  status: 'received' | 'processing' | 'processed' | 'failed';
  error_message: string | null;
  response_status: number;
  response_body: string | null;
  processing_time_ms: number | null;
  created_at: string;
}

// Input for creating/updating incoming webhooks
export interface IncomingWebhookInput {
  slug?: string;
  name: string;
  description?: string;
  source: IncomingWebhookSource;
  secret_key?: string;
  allowed_ips?: string[];
  enabled?: boolean;
  rate_limit?: number;
  rate_limit_window?: number;
  verify_signature?: boolean;
  accepted_events?: string[];
}

// Result of incoming webhook processing
export interface IncomingWebhookResult {
  success: boolean;
  statusCode: number;
  error?: string;
  eventType?: string;
  logId?: string;
}

// Request context for webhook processing
export interface WebhookRequestContext {
  ip: string;
  headers: Record<string, string>;
  body: string;
  contentType: string;
}

// Rate limit tracking (in-memory cache, should use Redis in production)
const rateLimitCache = new Map<string, { count: number; resetAt: number }>();

/**
 * Verify Stripe webhook signature
 * Stripe uses HMAC-SHA256 with timestamp and payload
 */
export function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string,
  tolerance: number = 300 // 5 minutes default tolerance
): { valid: boolean; error?: string } {
  try {
    // Stripe signature format: t=timestamp,v1=signature
    const elements = signature.split(',');
    const timestamp = elements.find(e => e.startsWith('t='))?.slice(2);
    const v1Signature = elements.find(e => e.startsWith('v1='))?.slice(3);

    if (!timestamp || !v1Signature) {
      return { valid: false, error: 'Invalid signature format' };
    }

    const timestampNum = parseInt(timestamp, 10);
    const now = Math.floor(Date.now() / 1000);

    // Check timestamp is within tolerance
    if (Math.abs(now - timestampNum) > tolerance) {
      return { valid: false, error: 'Signature timestamp too old' };
    }

    // Construct signed payload
    const signedPayload = `${timestamp}.${payload}`;

    // Calculate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex');

    // Compare signatures
    const valid = crypto.timingSafeEqual(
      Buffer.from(v1Signature),
      Buffer.from(expectedSignature)
    );

    return { valid, error: valid ? undefined : 'Signature mismatch' };
  } catch (error) {
    return { valid: false, error: 'Signature verification failed' };
  }
}

/**
 * Verify Make.com webhook signature
 * Make uses a simple secret key in header
 */
export function verifyMakeSignature(
  payload: string,
  signature: string,
  secret: string
): { valid: boolean; error?: string } {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const valid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    return { valid, error: valid ? undefined : 'Signature mismatch' };
  } catch (error) {
    return { valid: false, error: 'Signature verification failed' };
  }
}

/**
 * Verify Zapier webhook signature
 * Zapier can use a secret key in header or basic auth
 */
export function verifyZapierSignature(
  signature: string,
  secret: string
): { valid: boolean; error?: string } {
  try {
    // Zapier typically passes the secret directly
    const valid = signature === secret;
    return { valid, error: valid ? undefined : 'Invalid secret' };
  } catch (error) {
    return { valid: false, error: 'Signature verification failed' };
  }
}

/**
 * Verify generic webhook signature (HMAC-SHA256)
 */
export function verifyGenericSignature(
  payload: string,
  signature: string,
  secret: string
): { valid: boolean; error?: string } {
  try {
    // Support both raw signature and sha256= prefix
    const cleanSignature = signature.startsWith('sha256=') 
      ? signature.slice(7) 
      : signature;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const valid = crypto.timingSafeEqual(
      Buffer.from(cleanSignature),
      Buffer.from(expectedSignature)
    );

    return { valid, error: valid ? undefined : 'Signature mismatch' };
  } catch (error) {
    return { valid: false, error: 'Signature verification failed' };
  }
}

/**
 * Verify IP address against whitelist
 */
export function verifyIpWhitelist(
  ip: string,
  allowedIps: string[]
): { valid: boolean; error?: string } {
  if (!allowedIps || allowedIps.length === 0) {
    return { valid: true }; // No whitelist means all IPs allowed
  }

  // Support CIDR notation and exact matches
  const valid = allowedIps.some(allowed => {
    if (allowed.includes('/')) {
      return isIpInCidrRange(ip, allowed);
    }
    return ip === allowed;
  });

  return { valid, error: valid ? undefined : 'IP not in whitelist' };
}

/**
 * Check if IP is in CIDR range
 */
function isIpInCidrRange(ip: string, cidr: string): boolean {
  try {
    const [range, bits] = cidr.split('/');
    const mask = parseInt(bits, 10);
    
    // Simple IPv4 check
    const ipNum = ipToNumber(ip);
    const rangeNum = ipToNumber(range);
    const maskNum = ~((1 << (32 - mask)) - 1);
    
    return (ipNum & maskNum) === (rangeNum & maskNum);
  } catch {
    return false;
  }
}

/**
 * Convert IPv4 to number
 */
function ipToNumber(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

/**
 * Check rate limit for webhook
 */
export function checkRateLimit(
  webhookId: string,
  limit: number,
  windowSeconds: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const cacheKey = webhookId;
  
  let entry = rateLimitCache.get(cacheKey);
  
  // Initialize or reset if window expired
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + (windowSeconds * 1000),
    };
  }
  
  entry.count++;
  rateLimitCache.set(cacheKey, entry);
  
  const remaining = Math.max(0, limit - entry.count);
  const allowed = entry.count <= limit;
  
  return {
    allowed,
    remaining,
    resetAt: entry.resetAt,
  };
}

/**
 * Sanitize headers for logging (remove sensitive info)
 */
export function sanitizeHeaders(
  headers: Record<string, string>
): Record<string, string> {
  const sensitiveHeaders = [
    'authorization',
    'cookie',
    'set-cookie',
    'x-api-key',
    'x-auth-token',
  ];
  
  const sanitized: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(headers)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveHeaders.includes(lowerKey)) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Extract event type from payload based on source
 */
export function extractEventType(
  source: IncomingWebhookSource,
  payload: Record<string, unknown>
): string | null {
  switch (source) {
    case 'stripe':
      // Stripe sends event type in 'type' field
      return (payload.type as string) || null;
    
    case 'make':
      // Make.com can send custom event types
      return (payload.event as string) || (payload.event_type as string) || null;
    
    case 'zapier':
      // Zapier typically sends event in 'event' field
      return (payload.event as string) || (payload.action as string) || null;
    
    case 'generic':
    case 'custom':
      // Check common field names
      return (
        (payload.event as string) ||
        (payload.event_type as string) ||
        (payload.type as string) ||
        (payload.action as string) ||
        null
      );
    
    default:
      return null;
  }
}

/**
 * Verify webhook signature based on source
 */
export function verifySignature(
  source: IncomingWebhookSource,
  payload: string,
  headers: Record<string, string>,
  secret: string
): { valid: boolean; error?: string } {
  switch (source) {
    case 'stripe': {
      const signature = headers['stripe-signature'] || headers['Stripe-Signature'];
      if (!signature) {
        return { valid: false, error: 'Missing Stripe signature header' };
      }
      return verifyStripeSignature(payload, signature, secret);
    }
    
    case 'make': {
      const signature = headers['x-make-signature'] || headers['X-Make-Signature'];
      if (!signature) {
        return { valid: false, error: 'Missing Make signature header' };
      }
      return verifyMakeSignature(payload, signature, secret);
    }
    
    case 'zapier': {
      const signature = headers['x-zapier-secret'] || headers['X-Zapier-Secret'];
      if (!signature) {
        return { valid: false, error: 'Missing Zapier secret header' };
      }
      return verifyZapierSignature(signature, secret);
    }
    
    case 'generic':
    case 'custom': {
      const signature = 
        headers['x-webhook-signature'] ||
        headers['X-Webhook-Signature'] ||
        headers['x-signature'] ||
        headers['X-Signature'];
      if (!signature) {
        return { valid: false, error: 'Missing signature header' };
      }
      return verifyGenericSignature(payload, signature, secret);
    }
    
    default:
      return { valid: false, error: 'Unknown source' };
  }
}

/**
 * Get incoming webhook configuration by slug
 */
export async function getIncomingWebhookBySlug(
  slug: string
): Promise<IncomingWebhookConfig | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('incoming_webhooks')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching incoming webhook:', error);
      return null;
    }

    return data as IncomingWebhookConfig;
  } catch (error) {
    console.error('Error fetching incoming webhook:', error);
    return null;
  }
}

/**
 * Log incoming webhook request
 */
export async function logIncomingWebhook(
  webhookId: string,
  source: string,
  payload: Record<string, unknown>,
  headers: Record<string, string>,
  ipAddress: string | null,
  eventType: string | null,
  status: 'received' | 'processing' | 'processed' | 'failed',
  errorMessage?: string | null,
  responseStatus?: number,
  responseBody?: string | null,
  processingTimeMs?: number
): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('incoming_webhook_logs')
      .insert({
        webhook_id: webhookId,
        source,
        payload,
        headers: sanitizeHeaders(headers),
        ip_address: ipAddress,
        event_type: eventType,
        status,
        error_message: errorMessage || null,
        response_status: responseStatus || 200,
        response_body: responseBody || null,
        processing_time_ms: processingTimeMs || null,
      } as never)
      .select('id')
      .single();

    if (error) {
      console.error('Error logging incoming webhook:', error);
      return null;
    }

    return (data as { id: string } | null)?.id || null;
  } catch (error) {
    console.error('Error logging incoming webhook:', error);
    return null;
  }
}

/**
 * Update webhook statistics after receiving
 */
export async function updateIncomingWebhookStats(
  webhookId: string
): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase
      .from('incoming_webhooks')
      .update({
        last_received_at: new Date().toISOString(),
        total_requests: 1, // This will be handled by a trigger or increment
      } as never)
      .eq('id', webhookId);
  } catch (error) {
    console.error('Error updating incoming webhook stats:', error);
  }
}

/**
 * Process incoming webhook
 * Main entry point for handling incoming webhooks
 */
export async function processIncomingWebhook(
  slug: string,
  context: WebhookRequestContext
): Promise<IncomingWebhookResult> {
  const startTime = Date.now();
  let logId: string | null = null;
  
  // Get webhook configuration
  const webhook = await getIncomingWebhookBySlug(slug);
  
  if (!webhook) {
    return {
      success: false,
      statusCode: 404,
      error: 'Webhook not found',
    };
  }
  
  // Check if webhook is enabled
  if (!webhook.enabled) {
    return {
      success: false,
      statusCode: 503,
      error: 'Webhook is disabled',
    };
  }
  
  // Check rate limit
  const rateCheck = checkRateLimit(
    webhook.id,
    webhook.rate_limit,
    webhook.rate_limit_window
  );
  
  if (!rateCheck.allowed) {
    return {
      success: false,
      statusCode: 429,
      error: 'Rate limit exceeded',
    };
  }
  
  // Parse payload
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(context.body);
  } catch {
    return {
      success: false,
      statusCode: 400,
      error: 'Invalid JSON payload',
    };
  }
  
  // Verify IP whitelist
  if (webhook.allowed_ips && webhook.allowed_ips.length > 0) {
    const ipCheck = verifyIpWhitelist(context.ip, webhook.allowed_ips);
    if (!ipCheck.valid) {
      // Log the failed attempt
      await logIncomingWebhook(
        webhook.id,
        webhook.source,
        payload,
        context.headers,
        context.ip,
        null,
        'failed',
        ipCheck.error,
        403
      );
      
      return {
        success: false,
        statusCode: 403,
        error: ipCheck.error,
      };
    }
  }
  
  // Verify signature if required
  if (webhook.verify_signature && webhook.secret_key) {
    const sigCheck = verifySignature(
      webhook.source,
      context.body,
      context.headers,
      webhook.secret_key
    );
    
    if (!sigCheck.valid) {
      // Log the failed attempt
      await logIncomingWebhook(
        webhook.id,
        webhook.source,
        payload,
        context.headers,
        context.ip,
        null,
        'failed',
        sigCheck.error,
        401
      );
      
      return {
        success: false,
        statusCode: 401,
        error: sigCheck.error,
      };
    }
  }
  
  // Extract event type
  const eventType = extractEventType(webhook.source, payload);
  
  // Check if event is accepted
  if (webhook.accepted_events && webhook.accepted_events.length > 0) {
    if (eventType && !webhook.accepted_events.includes(eventType)) {
      await logIncomingWebhook(
        webhook.id,
        webhook.source,
        payload,
        context.headers,
        context.ip,
        eventType,
        'failed',
        'Event type not accepted',
        400
      );
      
      return {
        success: false,
        statusCode: 400,
        error: 'Event type not accepted',
        eventType,
      };
    }
  }
  
  // Log as received
  logId = await logIncomingWebhook(
    webhook.id,
    webhook.source,
    payload,
    context.headers,
    context.ip,
    eventType,
    'received'
  );
  
  // Update webhook stats
  await updateIncomingWebhookStats(webhook.id);
  
  // Process the webhook asynchronously
  // For now, we just log it and return success
  // In a real implementation, you would trigger actions based on the webhook
  const processingTime = Date.now() - startTime;
  
  // Update log to processed
  if (logId) {
    try {
      const supabase = await createClient();
      await supabase
        .from('incoming_webhook_logs')
        .update({
          status: 'processed',
          processing_time_ms: processingTime,
        } as never)
        .eq('id', logId);
    } catch (error) {
      console.error('Error updating webhook log:', error);
    }
  }
  
  return {
    success: true,
    statusCode: 200,
    eventType: eventType || undefined,
    logId: logId || undefined,
  };
}

/**
 * Clean up old incoming webhook logs
 */
export async function cleanupOldIncomingWebhookLogs(
  retentionDays: number = 30
): Promise<number> {
  try {
    const supabase = await createClient();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const { data, error } = await supabase
      .from('incoming_webhook_logs')
      .delete()
      .lt('created_at', cutoffDate.toISOString())
      .select('id');

    if (error) {
      console.error('Failed to cleanup incoming webhook logs:', error);
      return 0;
    }

    return data?.length ?? 0;
  } catch (error) {
    console.error('Failed to cleanup incoming webhook logs:', error);
    return 0;
  }
}

/**
 * Generate a secure slug for new webhooks
 */
export function generateWebhookSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let slug = 'wh_';
  for (let i = 0; i < 16; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}

/**
 * Generate a secure secret key for webhooks
 */
export function generateSecretKey(): string {
  return crypto.randomBytes(32).toString('hex');
}
