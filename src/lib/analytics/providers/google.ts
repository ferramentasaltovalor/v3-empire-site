/**
 * Google Analytics 4 Provider
 * Handles GA4 tracking script injection and event tracking
 */

import type { AnalyticsProvider, AnalyticsEvent, PageViewEvent } from '../types'

export const googleAnalyticsProvider: AnalyticsProvider = {
  name: 'Google Analytics 4',
  type: 'ga4',

  /**
   * Initialize GA4 tracking
   * Note: This is called client-side after script loads
   */
  init(trackingId: string): void {
    if (typeof window === 'undefined') return
    
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || []
    
    // Push config
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args)
    }
    
    window.gtag('js', new Date())
    window.gtag('config', trackingId, {
      send_page_view: false, // We'll manually send page views
    })
  },

  /**
   * Track a page view in GA4
   */
  trackPageView(data: PageViewEvent): void {
    if (typeof window === 'undefined' || !window.gtag) return
    
    window.gtag('event', 'page_view', {
      page_path: data.path,
      page_title: data.title,
      page_referrer: data.referrer,
    })
  },

  /**
   * Track a custom event in GA4
   */
  trackEvent(event: AnalyticsEvent): void {
    if (typeof window === 'undefined' || !window.gtag) return
    
    window.gtag('event', event.name, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event,
    })
  },

  /**
   * Get the GA4 script HTML to inject
   */
  getScript(trackingId: string): string {
    return `
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${trackingId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${trackingId}', { send_page_view: false });
</script>
<!-- End Google Analytics 4 -->
`.trim()
  },
}

/**
 * Google Tag Manager Provider
 * Handles GTM container script injection
 */
export const googleTagManagerProvider: AnalyticsProvider = {
  name: 'Google Tag Manager',
  type: 'gtm',

  init(containerId: string): void {
    if (typeof window === 'undefined') return
    
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    })
  },

  trackPageView(data: PageViewEvent): void {
    if (typeof window === 'undefined' || !window.dataLayer) return
    
    window.dataLayer.push({
      event: 'page_view',
      page_path: data.path,
      page_title: data.title,
    })
  },

  trackEvent(event: AnalyticsEvent): void {
    if (typeof window === 'undefined' || !window.dataLayer) return
    
    window.dataLayer.push({
      event: event.name,
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event,
    })
  },

  getScript(containerId: string): string {
    return `
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${containerId}');</script>
<!-- End Google Tag Manager -->
`.trim()
  },
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}
