'use server'

/**
 * Server Actions for Analytics Configuration
 * Handles CRUD operations for analytics providers
 */

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/permissions'
import {
  getAnalyticsConfigs,
  createAnalyticsConfig,
  updateAnalyticsConfig,
  deleteAnalyticsConfig,
  toggleAnalyticsConfig,
} from '@/lib/analytics'
import type { AnalyticsConfig } from '@/lib/analytics/types'

/**
 * Get all analytics configurations
 */
export async function getAllAnalyticsConfigs(): Promise<AnalyticsConfig[]> {
  await requireAdmin()
  return getAnalyticsConfigs()
}

/**
 * Create a new analytics configuration
 */
export async function createAnalyticsConfigAction(
  formData: FormData
): Promise<{ success: boolean; error?: string; data?: AnalyticsConfig }> {
  await requireAdmin()
  
  const name = formData.get('name') as string
  const type = formData.get('type') as AnalyticsConfig['type']
  const trackingId = formData.get('tracking_id') as string
  const customHtml = formData.get('custom_html') as string
  
  // Validation
  if (!name || !type) {
    return { success: false, error: 'Nome e tipo são obrigatórios' }
  }
  
  if (type !== 'custom' && !trackingId) {
    return { success: false, error: 'Tracking ID é obrigatório para este tipo de provider' }
  }
  
  if (type === 'custom' && !customHtml) {
    return { success: false, error: 'HTML personalizado é obrigatório para scripts customizados' }
  }
  
  const result = await createAnalyticsConfig({
    name,
    type,
    tracking_id: type !== 'custom' ? trackingId : null,
    custom_html: type === 'custom' ? customHtml : null,
    active: true,
    apply_to: {},
  })
  
  if (!result) {
    return { success: false, error: 'Erro ao criar configuração de analytics' }
  }
  
  revalidatePath('/admin/configuracoes/analytics')
  return { success: true, data: result }
}

/**
 * Update an analytics configuration
 */
export async function updateAnalyticsConfigAction(
  id: string,
  formData: FormData
): Promise<{ success: boolean; error?: string; data?: AnalyticsConfig }> {
  await requireAdmin()
  
  const name = formData.get('name') as string
  const type = formData.get('type') as AnalyticsConfig['type']
  const trackingId = formData.get('tracking_id') as string
  const customHtml = formData.get('custom_html') as string
  
  // Validation
  if (!name || !type) {
    return { success: false, error: 'Nome e tipo são obrigatórios' }
  }
  
  if (type !== 'custom' && !trackingId) {
    return { success: false, error: 'Tracking ID é obrigatório para este tipo de provider' }
  }
  
  if (type === 'custom' && !customHtml) {
    return { success: false, error: 'HTML personalizado é obrigatório para scripts customizados' }
  }
  
  const result = await updateAnalyticsConfig(id, {
    name,
    type,
    tracking_id: type !== 'custom' ? trackingId : null,
    custom_html: type === 'custom' ? customHtml : null,
  })
  
  if (!result) {
    return { success: false, error: 'Erro ao atualizar configuração de analytics' }
  }
  
  revalidatePath('/admin/configuracoes/analytics')
  return { success: true, data: result }
}

/**
 * Toggle analytics configuration active state
 */
export async function toggleAnalyticsConfigAction(
  id: string
): Promise<{ success: boolean; error?: string; data?: AnalyticsConfig }> {
  await requireAdmin()
  
  const result = await toggleAnalyticsConfig(id)
  
  if (!result) {
    return { success: false, error: 'Erro ao alternar estado da configuração' }
  }
  
  revalidatePath('/admin/configuracoes/analytics')
  return { success: true, data: result }
}

/**
 * Delete an analytics configuration
 */
export async function deleteAnalyticsConfigAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  
  const result = await deleteAnalyticsConfig(id)
  
  if (!result) {
    return { success: false, error: 'Erro ao excluir configuração de analytics' }
  }
  
  revalidatePath('/admin/configuracoes/analytics')
  return { success: true }
}

/**
 * Test analytics connection
 * This validates the tracking ID format and returns provider-specific info
 */
export async function testAnalyticsConnectionAction(
  type: AnalyticsConfig['type'],
  trackingId: string
): Promise<{ success: boolean; error?: string; info?: string }> {
  await requireAdmin()
  
  // Validate tracking ID format based on provider type
  switch (type) {
    case 'ga4':
      if (!trackingId.match(/^G-[A-Z0-9]{10}$/)) {
        return { 
          success: false, 
          error: 'ID do Google Analytics 4 deve ter o formato G-XXXXXXXXXX' 
        }
      }
      return { 
        success: true, 
        info: `Google Analytics 4 ID válido: ${trackingId}` 
      }
      
    case 'gtm':
      if (!trackingId.match(/^GTM-[A-Z0-9]{7}$/)) {
        return { 
          success: false, 
          error: 'ID do Google Tag Manager deve ter o formato GTM-XXXXXXX' 
        }
      }
      return { 
        success: true, 
        info: `Google Tag Manager ID válido: ${trackingId}` 
      }
      
    case 'pixel':
      if (!trackingId.match(/^\d{15,16}$/)) {
        return { 
          success: false, 
          error: 'ID do Meta Pixel deve conter 15-16 dígitos numéricos' 
        }
      }
      return { 
        success: true, 
        info: `Meta Pixel ID válido: ${trackingId}` 
      }
      
    case 'hotjar':
      if (!trackingId.match(/^\d+$/)) {
        return { 
          success: false, 
          error: 'ID do Hotjar deve ser numérico' 
        }
      }
      return { 
        success: true, 
        info: `Hotjar Site ID válido: ${trackingId}` 
      }
      
    case 'clarity':
      if (!trackingId.match(/^[a-z0-9]+$/i)) {
        return { 
          success: false, 
          error: 'ID do Microsoft Clarity deve ser alfanumérico' 
        }
      }
      return { 
        success: true, 
        info: `Microsoft Clarity Project ID válido: ${trackingId}` 
      }
      
    case 'custom':
      return { 
        success: true, 
        info: 'Scripts personalizados não podem ser validados automaticamente' 
      }
      
    default:
      return { success: false, error: 'Tipo de provider desconhecido' }
  }
}
