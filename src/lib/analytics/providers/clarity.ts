/**
 * Microsoft Clarity Provider
 * Handles Clarity tracking script injection
 */

import type { AnalyticsProvider, PageViewEvent, AnalyticsEvent } from '../types'

export const clarityProvider: AnalyticsProvider = {
  name: 'Microsoft Clarity',
  type: 'clarity',

  /**
   * Initialize Clarity tracking
   */
  init(projectId: string): void {
    if (typeof window === 'undefined') return
    console.debug(`Clarity initialized: ${projectId}`)
  },

  /**
   * Track a page view in Clarity
   * Clarity automatically tracks page views
   */
  trackPageView(_data: PageViewEvent): void {
    // Clarity automatically tracks page views
    // No manual action needed
  },

  /**
   * Track a custom event in Clarity
   */
  trackEvent(event: AnalyticsEvent): void {
    if (typeof window === 'undefined' || !window.clarity) return
    
    window.clarity('set', event.name, event.label || 'true')
  },

  /**
   * Get the Clarity script HTML to inject
   */
  getScript(projectId: string): string {
    return `
<!-- Microsoft Clarity -->
<script type="text/javascript">
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "${projectId}");
</script>
<!-- End Microsoft Clarity -->
`.trim()
  },
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    clarity?: ((command: string, ...args: unknown[]) => void) & {
      q?: unknown[]
    }
  }
}
