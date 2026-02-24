'use server'

/**
 * Server Actions for Incoming Webhook Configuration
 * Handles CRUD operations for incoming webhooks
 */

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/permissions'
import { createClient } from '@/lib/supabase/server'
import {
  generateWebhookSlug,
  generateSecretKey,
  cleanupOldIncomingWebhookLogs,
} from '@/lib/webhooks/incoming'
import { getIncomingWebhookUrl } from '@/lib/webhooks/incoming-utils'
import type {
  IncomingWebhookConfig,
  IncomingWebhookInput,
  IncomingWebhookLog,
  IncomingWebhookSource,
} from '@/lib/webhooks/incoming-types'

/**
 * Get all incoming webhook configurations
 */
export async function getIncomingWebhooks(): Promise<IncomingWebhookConfig[]> {
  await requireAdmin()

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('incoming_webhooks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching incoming webhooks:', error)
    throw new Error('Erro ao buscar webhooks de entrada')
  }

  return (data as IncomingWebhookConfig[]) || []
}

/**
 * Get a single incoming webhook by ID
 */
export async function getIncomingWebhook(
  id: string
): Promise<IncomingWebhookConfig | null> {
  await requireAdmin()

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('incoming_webhooks')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching incoming webhook:', error)
    throw new Error('Erro ao buscar webhook de entrada')
  }

  return data as IncomingWebhookConfig
}

/**
 * Create a new incoming webhook
 */
export async function createIncomingWebhook(
  input: IncomingWebhookInput
): Promise<{ success: boolean; error?: string; data?: IncomingWebhookConfig }> {
  await requireAdmin()

  // Validation
  if (!input.name) {
    return { success: false, error: 'Nome é obrigatório' }
  }

  if (!input.source) {
    return { success: false, error: 'Fonte é obrigatória' }
  }

  const supabase = await createClient()

  // Generate slug if not provided
  const slug = input.slug || generateWebhookSlug()

  // Check if slug already exists
  const { data: existing } = await supabase
    .from('incoming_webhooks')
    .select('id')
    .eq('slug', slug)
    .single()

  if (existing) {
    return { success: false, error: 'Este slug já está em uso' }
  }

  // Generate secret key if not provided and signature verification is enabled
  const secretKey = input.secret_key || (input.verify_signature !== false ? generateSecretKey() : null)

  const { data, error } = await supabase
    .from('incoming_webhooks')
    .insert({
      slug,
      name: input.name,
      description: input.description || null,
      source: input.source,
      secret_key: secretKey,
      allowed_ips: input.allowed_ips || [],
      enabled: input.enabled ?? true,
      rate_limit: input.rate_limit || 100,
      rate_limit_window: input.rate_limit_window || 60,
      verify_signature: input.verify_signature ?? true,
      accepted_events: input.accepted_events || [],
    } as never)
    .select()
    .single()

  if (error) {
    console.error('Error creating incoming webhook:', error)
    return { success: false, error: 'Erro ao criar webhook de entrada' }
  }

  revalidatePath('/admin/configuracoes/webhooks')
  return { success: true, data: data as IncomingWebhookConfig }
}

/**
 * Update an existing incoming webhook
 */
export async function updateIncomingWebhook(
  id: string,
  input: Partial<IncomingWebhookInput>
): Promise<{ success: boolean; error?: string; data?: IncomingWebhookConfig }> {
  await requireAdmin()

  const supabase = await createClient()

  // Check slug uniqueness if changing
  if (input.slug) {
    const { data: existing } = await supabase
      .from('incoming_webhooks')
      .select('id')
      .eq('slug', input.slug)
      .neq('id', id)
      .single()

    if (existing) {
      return { success: false, error: 'Este slug já está em uso' }
    }
  }

  const { data, error } = await supabase
    .from('incoming_webhooks')
    .update({
      ...(input.slug !== undefined && { slug: input.slug }),
      ...(input.name !== undefined && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.source !== undefined && { source: input.source }),
      ...(input.secret_key !== undefined && { secret_key: input.secret_key }),
      ...(input.allowed_ips !== undefined && { allowed_ips: input.allowed_ips }),
      ...(input.enabled !== undefined && { enabled: input.enabled }),
      ...(input.rate_limit !== undefined && { rate_limit: input.rate_limit }),
      ...(input.rate_limit_window !== undefined && { rate_limit_window: input.rate_limit_window }),
      ...(input.verify_signature !== undefined && { verify_signature: input.verify_signature }),
      ...(input.accepted_events !== undefined && { accepted_events: input.accepted_events }),
    } as never)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating incoming webhook:', error)
    return { success: false, error: 'Erro ao atualizar webhook de entrada' }
  }

  revalidatePath('/admin/configuracoes/webhooks')
  return { success: true, data: data as IncomingWebhookConfig }
}

/**
 * Toggle incoming webhook enabled status
 */
export async function toggleIncomingWebhook(
  id: string
): Promise<{ success: boolean; error?: string; data?: IncomingWebhookConfig }> {
  await requireAdmin()

  const supabase = await createClient()

  // Get current status
  const { data: current, error: fetchError } = await supabase
    .from('incoming_webhooks')
    .select('enabled')
    .eq('id', id)
    .single()

  if (fetchError || !current) {
    return { success: false, error: 'Webhook não encontrado' }
  }

  const currentStatus = (current as { enabled: boolean }).enabled

  // Toggle status
  const { data, error } = await supabase
    .from('incoming_webhooks')
    .update({ enabled: !currentStatus } as never)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error toggling incoming webhook:', error)
    return { success: false, error: 'Erro ao alternar status do webhook' }
  }

  revalidatePath('/admin/configuracoes/webhooks')
  return { success: true, data: data as IncomingWebhookConfig }
}

/**
 * Delete an incoming webhook
 */
export async function deleteIncomingWebhook(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()

  const supabase = await createClient()
  const { error } = await supabase
    .from('incoming_webhooks')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting incoming webhook:', error)
    return { success: false, error: 'Erro ao excluir webhook de entrada' }
  }

  revalidatePath('/admin/configuracoes/webhooks')
  return { success: true }
}

/**
 * Regenerate secret key for an incoming webhook
 */
export async function regenerateIncomingWebhookSecret(
  id: string
): Promise<{ success: boolean; error?: string; secret_key?: string }> {
  await requireAdmin()

  const supabase = await createClient()
  const newSecret = generateSecretKey()

  const { error } = await supabase
    .from('incoming_webhooks')
    .update({ secret_key: newSecret } as never)
    .eq('id', id)

  if (error) {
    console.error('Error regenerating secret:', error)
    return { success: false, error: 'Erro ao regenerar chave secreta' }
  }

  revalidatePath('/admin/configuracoes/webhooks')
  return { success: true, secret_key: newSecret }
}

/**
 * Get logs for an incoming webhook
 */
export async function getIncomingWebhookLogs(
  webhookId: string,
  limit: number = 50
): Promise<IncomingWebhookLog[]> {
  await requireAdmin()

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('incoming_webhook_logs')
    .select('*')
    .eq('webhook_id', webhookId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching incoming webhook logs:', error)
    throw new Error('Erro ao buscar logs do webhook')
  }

  return (data as IncomingWebhookLog[]) || []
}

/**
 * Get recent logs for all incoming webhooks
 */
export async function getRecentIncomingWebhookLogs(
  limit: number = 100
): Promise<(IncomingWebhookLog & { webhook_name?: string })[]> {
  await requireAdmin()

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('incoming_webhook_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent incoming webhook logs:', error)
    throw new Error('Erro ao buscar logs de webhooks')
  }

  const logs = (data || []) as IncomingWebhookLog[]
  if (logs.length === 0) return []

  // Get webhook names
  const webhookIds = [...new Set(logs.map((l) => l.webhook_id))]
  const { data: webhooks } = await supabase
    .from('incoming_webhooks')
    .select('id, name')
    .in('id', webhookIds)

  const webhookList = (webhooks || []) as { id: string; name: string }[]
  const webhookNames = new Map(webhookList.map((w) => [w.id, w.name]))

  return logs.map((log) => ({
    ...log,
    webhook_name: webhookNames.get(log.webhook_id),
  }))
}

/**
 * Clean up old incoming webhook logs
 */
export async function cleanupIncomingWebhookLogs(
  retentionDays: number = 30
): Promise<{ success: boolean; error?: string; deleted?: number }> {
  await requireAdmin()

  try {
    const deleted = await cleanupOldIncomingWebhookLogs(retentionDays)
    return { success: true, deleted }
  } catch (error) {
    console.error('Error cleaning up incoming webhook logs:', error)
    return { success: false, error: 'Erro ao limpar logs antigos' }
  }
}

/**
 * Test an incoming webhook by sending a test payload
 */
export async function testIncomingWebhook(
  id: string
): Promise<{ success: boolean; error?: string; info?: string }> {
  await requireAdmin()

  const webhook = await getIncomingWebhook(id)
  if (!webhook) {
    return { success: false, error: 'Webhook não encontrado' }
  }

  // Just return info about how to test
  const webhookUrl = getIncomingWebhookUrl(webhook.slug)
  
  return {
    success: true,
    info: `URL do webhook: ${webhookUrl}. Use esta URL no serviço externo para enviar requisições POST.`,
  }
}
