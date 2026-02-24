/**
 * Custom Analytics Provider
 * Handles custom HTML tracking scripts
 */

import type { AnalyticsProvider, PageViewEvent, AnalyticsEvent } from '../types'

export const customProvider: AnalyticsProvider = {
  name: 'Custom Script',
  type: 'custom',

  /**
   * Initialize custom tracking
   */
  init(_trackingId: string): void {
    // Custom scripts are initialized via the injected HTML
    console.debug('Custom analytics script initialized')
  },

  /**
   * Track a page view - not supported for custom scripts
   */
  trackPageView(_data: PageViewEvent): void {
    // Custom scripts handle their own tracking
  },

  /**
   * Track a custom event - not supported for custom scripts
   */
  trackEvent(_event: AnalyticsEvent): void {
    // Custom scripts handle their own tracking
  },

  /**
   * Get the custom script HTML
   * For custom scripts, the tracking_id is not used, custom_html is used instead
   */
  getScript(_trackingId: string): string {
    // This should not be called for custom scripts
    // The custom_html field should be used directly
    return ''
  },
}

/**
 * Get the custom HTML script
 */
export function getCustomScript(customHtml: string): string {
  return customHtml.trim()
}
