/**
 * Incoming Webhook API Endpoint
 * Receives webhooks from external services at /api/webhooks/incoming/[slug]
 */

import { NextRequest, NextResponse } from 'next/server';
import { processIncomingWebhook } from '@/lib/webhooks/incoming';

/**
 * Extract client IP from request
 */
function getClientIp(request: NextRequest): string {
  // Check various headers for the real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  // Cloudflare specific
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp;
  }
  
  // Default to localhost if no IP found
  return '127.0.0.1';
}

/**
 * Convert headers to plain object
 */
function getHeadersObject(request: NextRequest): Record<string, string> {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  return headers;
}

/**
 * POST /api/webhooks/incoming/[slug]
 * Receive and process incoming webhooks
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  try {
    // Get request body as text
    const body = await request.text();
    
    // Get request context
    const context = {
      ip: getClientIp(request),
      headers: getHeadersObject(request),
      body,
      contentType: request.headers.get('content-type') || 'application/json',
    };
    
    // Process the webhook
    const result = await processIncomingWebhook(slug, context);
    
    // Return appropriate response
    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: 'Webhook received successfully',
          eventType: result.eventType,
          logId: result.logId,
        },
        { status: result.statusCode }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: result.statusCode }
      );
    }
  } catch (error) {
    console.error('Error processing incoming webhook:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhooks/incoming/[slug]
 * Return webhook info (for testing/verification)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  // Only return basic info - don't expose sensitive data
  return NextResponse.json({
    success: true,
    message: 'Webhook endpoint is active',
    slug,
    hint: 'Send a POST request to this URL to trigger the webhook',
  });
}

/**
 * HEAD /api/webhooks/incoming/[slug]
 * Health check for webhook endpoint
 */
export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Just return 200 OK
  return new NextResponse(null, { status: 200 });
}
