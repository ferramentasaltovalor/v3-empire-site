/**
 * Incoming Webhook Types and Constants
 * Can be safely imported in Client Components
 */

// Supported webhook sources
export type IncomingWebhookSource = 
  | 'stripe'
  | 'make'
  | 'zapier'
  | 'generic'
  | 'custom'

// Human-readable labels for sources
export const INCOMING_WEBHOOK_SOURCE_LABELS: Record<IncomingWebhookSource, string> = {
  stripe: 'Stripe',
  make: 'Make.com',
  zapier: 'Zapier',
  generic: 'Genérico',
  custom: 'Personalizado',
}

// Incoming webhook configuration from database
export interface IncomingWebhookConfig {
  id: string
  slug: string
  name: string
  description: string | null
  source: IncomingWebhookSource
  secret_key: string | null
  allowed_ips: string[]
  enabled: boolean
  rate_limit: number
  rate_limit_window: number
  verify_signature: boolean
  accepted_events: string[]
  last_received_at: string | null
  total_requests: number
  created_at: string
  updated_at: string
}

// Incoming webhook log from database
export interface IncomingWebhookLog {
  id: string
  webhook_id: string
  event_type: string | null
  source: string
  ip_address: string | null
  headers: Record<string, string>
  payload: Record<string, unknown>
  status: 'received' | 'processing' | 'processed' | 'failed'
  error_message: string | null
  response_status: number
  response_body: string | null
  processing_time_ms: number | null
  created_at: string
}

// Input for creating/updating incoming webhooks
export interface IncomingWebhookInput {
  slug?: string
  name: string
  description?: string
  source: IncomingWebhookSource
  secret_key?: string
  allowed_ips?: string[]
  enabled?: boolean
  rate_limit?: number
  rate_limit_window?: number
  verify_signature?: boolean
  accepted_events?: string[]
}

// Result of incoming webhook processing
export interface IncomingWebhookResult {
  success: boolean
  statusCode: number
  error?: string
  eventType?: string
  logId?: string
}

// Request context for webhook processing
export interface WebhookRequestContext {
  ip: string
  headers: Record<string, string>
  body: string
  contentType: string
}
