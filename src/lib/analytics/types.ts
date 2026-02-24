/**
 * Analytics Types
 * Type definitions for multi-provider analytics system
 */

/**
 * Supported analytics provider types
 */
export type AnalyticsProviderType = 'ga4' | 'gtm' | 'pixel' | 'hotjar' | 'clarity' | 'custom'

/**
 * Analytics configuration stored in database
 */
export interface AnalyticsConfig {
  id: string
  name: string
  type: AnalyticsProviderType
  tracking_id: string | null
  custom_html: string | null
  active: boolean
  apply_to: Record<string, unknown>
  created_at: string
}

/**
 * Input type for creating/updating analytics config
 */
export interface AnalyticsConfigInput {
  name: string
  type: AnalyticsProviderType
  tracking_id?: string | null
  custom_html?: string | null
  active?: boolean
  apply_to?: Record<string, unknown>
}

/**
 * Analytics event for tracking
 */
export interface AnalyticsEvent {
  name: string
  category?: string
  label?: string
  value?: number
  [key: string]: unknown
}

/**
 * Page view event data
 */
export interface PageViewEvent {
  path: string
  title?: string
  referrer?: string
}

/**
 * User consent preferences for analytics
 */
export interface AnalyticsConsent {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

/**
 * Provider interface that all analytics providers must implement
 */
export interface AnalyticsProvider {
  /** Provider name */
  name: string
  /** Provider type */
  type: AnalyticsProviderType
  /** Initialize the provider with tracking ID */
  init(trackingId: string): void
  /** Track a page view */
  trackPageView(data: PageViewEvent): void
  /** Track a custom event */
  trackEvent(event: AnalyticsEvent): void
  /** Get the script HTML to inject */
  getScript(trackingId: string): string
}

/**
 * Google Analytics 4 configuration
 */
export interface GA4Config {
  measurementId: string // Format: G-XXXXXXXXXX
}

/**
 * Google Tag Manager configuration
 */
export interface GTMConfig {
  containerId: string // Format: GTM-XXXXXXX
}

/**
 * Meta (Facebook) Pixel configuration
 */
export interface MetaPixelConfig {
  pixelId: string // Format: 123456789012345
}

/**
 * Hotjar configuration
 */
export interface HotjarConfig {
  siteId: string // Numeric ID
}

/**
 * Microsoft Clarity configuration
 */
export interface ClarityConfig {
  projectId: string // Alphanumeric ID
}

/**
 * Provider-specific configurations
 */
export type ProviderConfig = GA4Config | GTMConfig | MetaPixelConfig | HotjarConfig | ClarityConfig | { customHtml: string }
