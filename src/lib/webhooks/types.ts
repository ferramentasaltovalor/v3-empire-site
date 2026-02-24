/**
 * Webhook Types
 * Type definitions for the outgoing webhooks system
 */

// Webhook event types that can be triggered
export type WebhookEventType =
  // Post events
  | 'post.published'
  | 'post.updated'
  | 'post.deleted'
  | 'post.drafted'
  // Form events
  | 'form.submitted'
  | 'contact.created'
  // User events
  | 'user.registered'
  | 'user.updated'
  | 'user.deleted'
  // Media events
  | 'media.uploaded'
  | 'media.deleted'
  // Landing page events
  | 'lp.created'
  | 'lp.published'
  | 'lp.updated'
  | 'lp.deleted';

// Event category groups for UI
export const WEBHOOK_EVENT_CATEGORIES = {
  posts: {
    label: 'Posts',
    events: ['post.published', 'post.updated', 'post.deleted', 'post.drafted'] as WebhookEventType[],
  },
  forms: {
    label: 'Formulários',
    events: ['form.submitted', 'contact.created'] as WebhookEventType[],
  },
  users: {
    label: 'Usuários',
    events: ['user.registered', 'user.updated', 'user.deleted'] as WebhookEventType[],
  },
  media: {
    label: 'Mídia',
    events: ['media.uploaded', 'media.deleted'] as WebhookEventType[],
  },
  landingPages: {
    label: 'Landing Pages',
    events: ['lp.created', 'lp.published', 'lp.updated', 'lp.deleted'] as WebhookEventType[],
  },
} as const;

// Human-readable labels for events
export const WEBHOOK_EVENT_LABELS: Record<WebhookEventType, string> = {
  'post.published': 'Post publicado',
  'post.updated': 'Post atualizado',
  'post.deleted': 'Post excluído',
  'post.drafted': 'Post salvo como rascunho',
  'form.submitted': 'Formulário enviado',
  'contact.created': 'Contato criado',
  'user.registered': 'Usuário registrado',
  'user.updated': 'Usuário atualizado',
  'user.deleted': 'Usuário excluído',
  'media.uploaded': 'Mídia enviada',
  'media.deleted': 'Mídia excluída',
  'lp.created': 'Landing Page criada',
  'lp.published': 'Landing Page publicada',
  'lp.updated': 'Landing Page atualizada',
  'lp.deleted': 'Landing Page excluída',
};

// Webhook configuration from database
export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: WebhookEventType[];
  headers: Record<string, string>;
  secret: string | null;
  active: boolean;
  last_triggered_at: string | null;
  created_at: string;
}

// Payload sent to webhook endpoints
export interface WebhookPayload {
  id: string;
  event: WebhookEventType;
  timestamp: string;
  data: Record<string, unknown>;
  signature?: string;
}

// Webhook delivery log from database
export interface WebhookLog {
  id: string;
  webhook_id: string;
  event: WebhookEventType;
  payload: Record<string, unknown>;
  status_code: number | null;
  response_body: string | null;
  attempts: number;
  created_at: string;
}

// Input for creating/updating webhooks
export interface WebhookInput {
  name: string;
  url: string;
  events: WebhookEventType[];
  headers?: Record<string, string>;
  secret?: string;
  active?: boolean;
}

// Result of webhook delivery attempt
export interface WebhookDeliveryResult {
  success: boolean;
  statusCode?: number;
  error?: string;
  duration: number;
}

// Options for webhook delivery
export interface WebhookDeliveryOptions {
  maxRetries?: number;
  timeout?: number;
  retryDelay?: number;
}

// Default delivery options
export const DEFAULT_DELIVERY_OPTIONS: Required<WebhookDeliveryOptions> = {
  maxRetries: 3,
  timeout: 30000, // 30 seconds
  retryDelay: 1000, // 1 second base delay
};
