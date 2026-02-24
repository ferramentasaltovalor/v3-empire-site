/**
 * Analytics Library
 * Main entry point for multi-provider analytics system
 */

// Re-export types
export * from './types'

// Re-export providers
export * from './providers'

// Import dependencies
import { createClient } from '@/lib/supabase/server'
import type { AnalyticsConfig, AnalyticsEvent, PageViewEvent } from './types'
import { getProvider, getCustomScript } from './providers'

// Re-export the database type
export type { AnalyticsConfig as DBAnalyticsConfig } from '@/types/database'

/**
 * Get all analytics configurations (server-side)
 */
export async function getAnalyticsConfigs(): Promise<AnalyticsConfig[]> {
  const supabase = await createClient()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('analytics_configs')
    .select('*')
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching analytics configs:', error)
    return []
  }
  
  return (data || []) as AnalyticsConfig[]
}

/**
 * Get active analytics configurations (server-side)
 */
export async function getActiveAnalyticsConfigs(): Promise<AnalyticsConfig[]> {
  const supabase = await createClient()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('analytics_configs')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching active analytics configs:', error)
    return []
  }
  
  return (data || []) as AnalyticsConfig[]
}

/**
 * Get a single analytics configuration by ID (server-side)
 */
export async function getAnalyticsConfig(id: string): Promise<AnalyticsConfig | null> {
  const supabase = await createClient()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('analytics_configs')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching analytics config:', error)
    return null
  }
  
  return data as AnalyticsConfig
}

/**
 * Create a new analytics configuration (server-side)
 */
export async function createAnalyticsConfig(
  input: Omit<AnalyticsConfig, 'id' | 'created_at'>
): Promise<AnalyticsConfig | null> {
  const supabase = await createClient()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('analytics_configs')
    .insert(input)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating analytics config:', error)
    return null
  }
  
  return data as AnalyticsConfig
}

/**
 * Update an analytics configuration (server-side)
 */
export async function updateAnalyticsConfig(
  id: string,
  input: Partial<Omit<AnalyticsConfig, 'id' | 'created_at'>>
): Promise<AnalyticsConfig | null> {
  const supabase = await createClient()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('analytics_configs')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating analytics config:', error)
    return null
  }
  
  return data as AnalyticsConfig
}

/**
 * Delete an analytics configuration (server-side)
 */
export async function deleteAnalyticsConfig(id: string): Promise<boolean> {
  const supabase = await createClient()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('analytics_configs')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting analytics config:', error)
    return false
  }
  
  return true
}

/**
 * Toggle analytics configuration active state (server-side)
 */
export async function toggleAnalyticsConfig(id: string): Promise<AnalyticsConfig | null> {
  const supabase = await createClient()
  
  // First get current state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: current, error: fetchError } = await (supabase as any)
    .from('analytics_configs')
    .select('active')
    .eq('id', id)
    .single()
  
  if (fetchError || !current) {
    console.error('Error fetching current analytics config state:', fetchError)
    return null
  }
  
  // Toggle the state
  const newActiveState = !current.active
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('analytics_configs')
    .update({ active: newActiveState })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error toggling analytics config:', error)
    return null
  }
  
  return data as AnalyticsConfig
}

/**
 * Generate script HTML for an analytics configuration
 */
export function generateAnalyticsScript(config: AnalyticsConfig): string {
  if (config.type === 'custom' && config.custom_html) {
    return getCustomScript(config.custom_html)
  }
  
  const provider = getProvider(config.type)
  if (!provider || !config.tracking_id) {
    return ''
  }
  
  return provider.getScript(config.tracking_id)
}

/**
 * Generate all scripts for active analytics configurations
 */
export async function generateAllActiveScripts(): Promise<string> {
  const configs = await getActiveAnalyticsConfigs()
  
  return configs
    .map(config => generateAnalyticsScript(config))
    .filter(script => script.length > 0)
    .join('\n\n')
}

/**
 * Get scripts for client-side injection (returns array for React components)
 */
export function getScriptsForClient(configs: AnalyticsConfig[]): Array<{
  id: string
  type: AnalyticsConfig['type']
  script: string
}> {
  return configs
    .filter(config => config.active)
    .map(config => ({
      id: config.id,
      type: config.type,
      script: generateAnalyticsScript(config),
    }))
    .filter(item => item.script.length > 0)
}

/**
 * Client-side analytics tracking functions
 */

/**
 * Track a page view across all active providers
 * Call this from client components
 */
export function trackPageView(data: PageViewEvent): void {
  if (typeof window === 'undefined') return
  
  // Track in GA4/GTM
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: data.path,
      page_title: data.title,
      page_referrer: data.referrer,
    })
  }
  
  // Track in Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'PageView')
  }
}

/**
 * Track a custom event across all active providers
 * Call this from client components
 */
export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return
  
  // Track in GA4/GTM
  if (window.gtag) {
    window.gtag('event', event.name, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
    })
  }
  
  // Track in Meta Pixel
  if (window.fbq) {
    window.fbq('trackCustom', event.name, {
      content_category: event.category,
      content_name: event.label,
      value: event.value,
    })
  }
  
  // Track in Hotjar
  if (window.hj) {
    window.hj('event', event.name)
  }
  
  // Track in Clarity
  if (window.clarity) {
    window.clarity('set', event.name, event.label || 'true')
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    fbq?: ((command: string, action: string, params?: Record<string, unknown>) => void) & {
      callMethod?: () => void
      queue?: unknown[]
    }
    hj?: ((command: string, ...args: unknown[]) => void) & {
      q?: unknown[]
    }
    clarity?: ((command: string, ...args: unknown[]) => void) & {
      q?: unknown[]
    }
  }
}
