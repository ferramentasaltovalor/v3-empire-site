/**
 * Meta (Facebook) Pixel Provider
 * Handles Meta Pixel tracking script injection and event tracking
 */

import type { AnalyticsProvider, AnalyticsEvent, PageViewEvent } from '../types'

export const metaPixelProvider: AnalyticsProvider = {
  name: 'Meta Pixel',
  type: 'pixel',

  /**
   * Initialize Meta Pixel tracking
   */
  init(pixelId: string): void {
    if (typeof window === 'undefined') return
    
    // Meta Pixel is initialized via the script
    // This method can be used for additional configuration
    console.debug(`Meta Pixel initialized: ${pixelId}`)
  },

  /**
   * Track a page view in Meta Pixel
   */
  trackPageView(_data: PageViewEvent): void {
    if (typeof window === 'undefined' || !window.fbq) return
    
    // Meta Pixel automatically tracks page views, but we can force one
    window.fbq('track', 'PageView')
  },

  /**
   * Track a custom event in Meta Pixel
   */
  trackEvent(event: AnalyticsEvent): void {
    if (typeof window === 'undefined' || !window.fbq) return
    
    // Map common GA4 events to Meta standard events
    const eventName = mapToMetaEvent(event.name)
    
    window.fbq('trackCustom', eventName, {
      content_category: event.category,
      content_name: event.label,
      value: event.value,
      ...event,
    })
  },

  /**
   * Get the Meta Pixel script HTML to inject
   */
  getScript(pixelId: string): string {
    return `
<!-- Meta Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '${pixelId}');
  fbq('track', 'PageView');
</script>
<noscript>
  <img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"/>
</noscript>
<!-- End Meta Pixel Code -->
`.trim()
  },
}

/**
 * Map common event names to Meta standard events
 */
function mapToMetaEvent(eventName: string): string {
  const eventMap: Record<string, string> = {
    'purchase': 'Purchase',
    'add_to_cart': 'AddToCart',
    'add_to_wishlist': 'AddToWishlist',
    'complete_registration': 'CompleteRegistration',
    'initiate_checkout': 'InitiateCheckout',
    'search': 'Search',
    'view_content': 'ViewContent',
    'lead': 'Lead',
    'contact': 'Contact',
    'subscribe': 'Subscribe',
    'download': 'Download',
  }
  
  return eventMap[eventName.toLowerCase()] || eventName
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    fbq?: ((command: string, action: string, params?: Record<string, unknown>) => void) & {
      callMethod?: () => void
      queue?: unknown[]
    }
  }
}
