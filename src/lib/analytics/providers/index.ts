/**
 * Analytics Providers Index
 * Exports all available analytics providers
 */

export { googleAnalyticsProvider, googleTagManagerProvider } from './google'
export { metaPixelProvider } from './meta'
export { hotjarProvider } from './hotjar'
export { clarityProvider } from './clarity'
export { customProvider, getCustomScript } from './custom'

import { googleAnalyticsProvider, googleTagManagerProvider } from './google'
import { metaPixelProvider } from './meta'
import { hotjarProvider } from './hotjar'
import { clarityProvider } from './clarity'
import { customProvider } from './custom'
import type { AnalyticsProvider, AnalyticsProviderType } from '../types'

/**
 * Registry of all available providers
 */
export const providers: Record<AnalyticsProviderType, AnalyticsProvider> = {
  ga4: googleAnalyticsProvider,
  gtm: googleTagManagerProvider,
  pixel: metaPixelProvider,
  hotjar: hotjarProvider,
  clarity: clarityProvider,
  custom: customProvider,
}

/**
 * Get a provider by type
 */
export function getProvider(type: AnalyticsProviderType): AnalyticsProvider | undefined {
  return providers[type]
}

/**
 * Get all available provider types
 */
export function getAvailableProviderTypes(): AnalyticsProviderType[] {
  return Object.keys(providers) as AnalyticsProviderType[]
}

/**
 * Provider display names for UI
 */
export const providerDisplayNames: Record<AnalyticsProviderType, string> = {
  ga4: 'Google Analytics 4',
  gtm: 'Google Tag Manager',
  pixel: 'Meta (Facebook) Pixel',
  hotjar: 'Hotjar',
  clarity: 'Microsoft Clarity',
  custom: 'Custom Script',
}

/**
 * Provider descriptions for UI
 */
export const providerDescriptions: Record<AnalyticsProviderType, string> = {
  ga4: 'Google Analytics 4 - Web analytics and measurement',
  gtm: 'Google Tag Manager - Tag management system for tracking codes',
  pixel: 'Meta Pixel - Facebook/Meta advertising conversion tracking',
  hotjar: 'Hotjar - Heatmaps, recordings, and user feedback',
  clarity: 'Microsoft Clarity - Free heatmaps and session recordings',
  custom: 'Custom Script - Add your own tracking code',
}

/**
 * Tracking ID placeholders/examples for each provider
 */
export const providerTrackingIdExamples: Record<AnalyticsProviderType, string> = {
  ga4: 'G-XXXXXXXXXX',
  gtm: 'GTM-XXXXXXX',
  pixel: '123456789012345',
  hotjar: '1234567',
  clarity: 'abcdefghijklmnop',
  custom: 'N/A (use custom HTML)',
}
