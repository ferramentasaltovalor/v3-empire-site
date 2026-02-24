'use server'

/**
 * Server Actions for Webhook Configuration
 * Handles CRUD operations for outgoing webhooks
 */

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/permissions'
import { createClient } from '@/lib/supabase/server'
import { testWebhook } from '@/lib/webhooks'
import type { WebhookConfig, WebhookEventType, WebhookInput, WebhookLog } from '@/lib/webhooks/types'

/**
 * Get all webhook configurations
 */
export async function getWebhookConfigs(): Promise<WebhookConfig[]> {
  await requireAdmin()
  
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('webhook_configs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching webhook configs:', error)
    throw new Error('Erro ao buscar configurações de webhook')
  }

  return (data as WebhookConfig[]) || []
}

/**
 * Get a single webhook configuration by ID
 */
export async function getWebhookConfig(id: string): Promise<WebhookConfig | null> {
  await requireAdmin()
  
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('webhook_configs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching webhook config:', error)
    throw new Error('Erro ao buscar configuração de webhook')
  }

  return data as WebhookConfig
}

/**
 * Create a new webhook configuration
 */
export async function createWebhookConfig(
  input: WebhookInput
): Promise<{ success: boolean; error?: string; data?: WebhookConfig }> {
  await requireAdmin()
  
  // Validation
  if (!input.name || !input.url) {
    return { success: false, error: 'Nome e URL são obrigatórios' }
  }

  if (!input.events || input.events.length === 0) {
    return { success: false, error: 'Selecione pelo menos um evento' }
  }

  // Validate URL
  try {
    new URL(input.url)
  } catch {
    return { success: false, error: 'URL inválida' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('webhook_configs')
    .insert({
      name: input.name,
      url: input.url,
      events: input.events,
      headers: input.headers || {},
      secret: input.secret || null,
      active: input.active ?? true,
    } as never)
    .select()
    .single()

  if (error) {
    console.error('Error creating webhook config:', error)
    return { success: false, error: 'Erro ao criar webhook' }
  }

  revalidatePath('/admin/configuracoes/webhooks')
  return { success: true, data: data as WebhookConfig }
}

/**
 * Update an existing webhook configuration
 */
export async function updateWebhookConfig(
  id: string,
  input: Partial<WebhookInput>
): Promise<{ success: boolean; error?: string; data?: WebhookConfig }> {
  await requireAdmin()
  
  // Validate URL if provided
  if (input.url) {
    try {
      new URL(input.url)
    } catch {
      return { success: false, error: 'URL inválida' }
    }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('webhook_configs')
    .update({
      ...(input.name !== undefined && { name: input.name }),
      ...(input.url !== undefined && { url: input.url }),
      ...(input.events !== undefined && { events: input.events }),
      ...(input.headers !== undefined && { headers: input.headers }),
      ...(input.secret !== undefined && { secret: input.secret }),
      ...(input.active !== undefined && { active: input.active }),
    } as never)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating webhook config:', error)
    return { success: false, error: 'Erro ao atualizar webhook' }
  }

  revalidatePath('/admin/configuracoes/webhooks')
  return { success: true, data: data as WebhookConfig }
}

/**
 * Toggle webhook active status
 */
export async function toggleWebhookConfig(
  id: string
): Promise<{ success: boolean; error?: string; data?: WebhookConfig }> {
  await requireAdmin()
  
  const supabase = await createClient()
  
  // Get current status
  const { data: current, error: fetchError } = await supabase
    .from('webhook_configs')
    .select('active')
    .eq('id', id)
    .single()

  if (fetchError || !current) {
    return { success: false, error: 'Webhook não encontrado' }
  }

  const currentStatus = (current as { active: boolean }).active

  // Toggle status
  const { data, error } = await supabase
    .from('webhook_configs')
    .update({ active: !currentStatus } as never)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error toggling webhook config:', error)
    return { success: false, error: 'Erro ao alternar status do webhook' }
  }

  revalidatePath('/admin/configuracoes/webhooks')
  return { success: true, data: data as WebhookConfig }
}

/**
 * Delete a webhook configuration
 */
export async function deleteWebhookConfig(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  
  const supabase = await createClient()
  const { error } = await supabase
    .from('webhook_configs')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting webhook config:', error)
    return { success: false, error: 'Erro ao excluir webhook' }
  }

  revalidatePath('/admin/configuracoes/webhooks')
  return { success: true }
}

/**
 * Test a webhook endpoint
 */
export async function testWebhookConfig(
  id: string
): Promise<{ success: boolean; error?: string; info?: string }> {
  await requireAdmin()
  
  const webhook = await getWebhookConfig(id)
  if (!webhook) {
    return { success: false, error: 'Webhook não encontrado' }
  }

  try {
    const result = await testWebhook(webhook)
    
    if (result.success) {
      return { 
        success: true, 
        info: `Webhook testado com sucesso! Status: ${result.statusCode} (${result.duration}ms)` 
      }
    } else {
      return { 
        success: false, 
        error: result.error || `Falha na requisição (Status: ${result.statusCode})` 
      }
    }
  } catch (error) {
    console.error('Error testing webhook:', error)
    return { success: false, error: 'Erro ao testar webhook' }
  }
}

/**
 * Get delivery logs for a webhook
 */
export async function getWebhookLogs(
  webhookId: string,
  limit: number = 50
): Promise<WebhookLog[]> {
  await requireAdmin()
  
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('webhook_logs')
    .select('*')
    .eq('webhook_id', webhookId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching webhook logs:', error)
    throw new Error('Erro ao buscar logs do webhook')
  }

  return (data as WebhookLog[]) || []
}

/**
 * Get recent delivery logs for all webhooks
 */
export async function getRecentWebhookLogs(limit: number = 100): Promise<(WebhookLog & { webhook_name?: string })[]> {
  await requireAdmin()
  
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('webhook_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent webhook logs:', error)
    throw new Error('Erro ao buscar logs de webhooks')
  }

  // Get webhook names separately
  const logs = (data || []) as WebhookLog[]
  if (logs.length === 0) return []

  const webhookIds = [...new Set(logs.map(l => l.webhook_id))]
  const { data: webhooks } = await supabase
    .from('webhook_configs')
    .select('id, name')
    .in('id', webhookIds)

  const webhookList = (webhooks || []) as { id: string; name: string }[]
  const webhookNames = new Map(webhookList.map(w => [w.id, w.name]))

  return logs.map(log => ({
    ...log,
    webhook_name: webhookNames.get(log.webhook_id),
  }))
}

/**
 * Clean up old webhook logs (admin action)
 */
export async function cleanupWebhookLogs(
  retentionDays: number = 30
): Promise<{ success: boolean; error?: string; deleted?: number }> {
  await requireAdmin()
  
  const { cleanupOldWebhookLogs } = await import('@/lib/webhooks')
  
  try {
    const deleted = await cleanupOldWebhookLogs(retentionDays)
    return { success: true, deleted }
  } catch (error) {
    console.error('Error cleaning up webhook logs:', error)
    return { success: false, error: 'Erro ao limpar logs antigos' }
  }
}
