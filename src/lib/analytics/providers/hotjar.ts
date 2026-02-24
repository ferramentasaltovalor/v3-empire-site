/**
 * Hotjar Provider
 * Handles Hotjar tracking script injection
 */

import type { AnalyticsProvider, PageViewEvent, AnalyticsEvent } from '../types'

export const hotjarProvider: AnalyticsProvider = {
  name: 'Hotjar',
  type: 'hotjar',

  /**
   * Initialize Hotjar tracking
   */
  init(siteId: string): void {
    if (typeof window === 'undefined') return
    console.debug(`Hotjar initialized: ${siteId}`)
  },

  /**
   * Track a page view in Hotjar
   * Hotjar automatically tracks page views
   */
  trackPageView(_data: PageViewEvent): void {
    // Hotjar automatically tracks page views
    // No manual action needed
  },

  /**
   * Track a custom event in Hotjar
   */
  trackEvent(event: AnalyticsEvent): void {
    if (typeof window === 'undefined' || !window.hj) return
    
    window.hj('event', event.name)
  },

  /**
   * Get the Hotjar script HTML to inject
   */
  getScript(siteId: string): string {
    return `
<!-- Hotjar Tracking Code -->
<script>
  (function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:${siteId},hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
<!-- End Hotjar Tracking Code -->
`.trim()
  },
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    hj?: ((command: string, ...args: unknown[]) => void) & {
      q?: unknown[]
    }
    _hjSettings?: {
      hjid: string | number
      hjsv: number
    }
  }
}
