'use client'

/**
 * Analytics Provider Component
 * Injects analytics tracking scripts into the page
 * Only loads in production and respects user consent
 */

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import type { AnalyticsConfig, AnalyticsConsent } from '@/lib/analytics/types'
import { trackPageView } from '@/lib/analytics'

interface AnalyticsProviderProps {
  /** Analytics configurations to load */
  configs: AnalyticsConfig[]
  /** User consent preferences - if not provided, defaults to all enabled */
  consent?: AnalyticsConsent
  /** Whether to track page views automatically */
  trackPageViews?: boolean
}

/**
 * Get consent from localStorage
 */
function getStoredConsent(): AnalyticsConsent | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem('analytics-consent')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parsing errors
  }
  
  return null
}

/**
 * Check if we're in production mode
 */
function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * Analytics Provider Component
 */
export function AnalyticsProvider({
  configs,
  consent,
  trackPageViews = true,
}: AnalyticsProviderProps) {
  const [mounted, setMounted] = useState(false)
  const [effectiveConsent, setEffectiveConsent] = useState<AnalyticsConsent | null>(null)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Handle mounting and consent
  useEffect(() => {
    setMounted(true)
    
    if (consent) {
      setEffectiveConsent(consent)
    } else {
      const stored = getStoredConsent()
      if (stored) {
        setEffectiveConsent(stored)
      } else {
        // Default to all enabled if no consent stored
        setEffectiveConsent({
          necessary: true,
          analytics: true,
          marketing: true,
          preferences: true,
        })
      }
    }
  }, [consent])

  // Track page views on route change
  useEffect(() => {
    if (!mounted || !isProduction() || !trackPageViews) return
    if (!effectiveConsent?.analytics) return
    
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    
    trackPageView({
      path: url,
      title: document.title,
      referrer: document.referrer,
    })
  }, [mounted, pathname, searchParams, trackPageViews, effectiveConsent])

  // Don't render in development or if not mounted
  if (!isProduction() || !mounted || !effectiveConsent) {
    return null
  }

  // Filter configs based on consent
  const enabledConfigs = configs.filter(config => {
    if (!config.active) return false
    
    // Check consent based on provider type
    switch (config.type) {
      case 'ga4':
      case 'gtm':
      case 'hotjar':
      case 'clarity':
        return effectiveConsent.analytics
      case 'pixel':
        return effectiveConsent.marketing
      case 'custom':
        return effectiveConsent.analytics || effectiveConsent.marketing
      default:
        return false
    }
  })

  return (
    <>
      {enabledConfigs.map(config => (
        <AnalyticsScript key={config.id} config={config} />
      ))}
    </>
  )
}

/**
 * Individual Analytics Script Component
 */
function AnalyticsScript({ config }: { config: AnalyticsConfig }) {
  const [loaded, setLoaded] = useState(false)

  // For custom scripts, we need to inject raw HTML
  if (config.type === 'custom' && config.custom_html) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: config.custom_html }}
        suppressHydrationWarning
      />
    )
  }

  // For GA4, GTM, Pixel, etc. - use Next.js Script component
  const scriptSrc = getScriptSrc(config)
  const scriptContent = getScriptContent(config)

  if (!scriptSrc && !scriptContent) {
    return null
  }

  // External script (GA4, GTM, etc.)
  if (scriptSrc) {
    return (
      <>
        <Script
          src={scriptSrc}
          strategy="afterInteractive"
          onLoad={() => setLoaded(true)}
        />
        {scriptContent && loaded && (
          <script
            dangerouslySetInnerHTML={{ __html: scriptContent }}
            suppressHydrationWarning
          />
        )}
        {scriptContent && !loaded && (
          <script
            dangerouslySetInnerHTML={{ __html: scriptContent }}
            suppressHydrationWarning
          />
        )}
      </>
    )
  }

  // Inline script only
  if (scriptContent) {
    return (
      <script
        dangerouslySetInnerHTML={{ __html: scriptContent }}
        suppressHydrationWarning
      />
    )
  }

  return null
}

/**
 * Get the external script source URL for a config
 */
function getScriptSrc(config: AnalyticsConfig): string | null {
  if (!config.tracking_id) return null

  switch (config.type) {
    case 'ga4':
      return `https://www.googletagmanager.com/gtag/js?id=${config.tracking_id}`
    case 'gtm':
      return null // GTM uses inline script with dynamic insertion
    case 'pixel':
      return 'https://connect.facebook.net/en_US/fbevents.js'
    case 'hotjar':
      return null // Hotjar uses inline script with dynamic insertion
    case 'clarity':
      return null // Clarity uses inline script with dynamic insertion
    default:
      return null
  }
}

/**
 * Get the inline script content for a config
 */
function getScriptContent(config: AnalyticsConfig): string | null {
  if (!config.tracking_id) return null

  switch (config.type) {
    case 'ga4':
      return `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${config.tracking_id}', { send_page_view: false });
      `
    case 'gtm':
      return `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${config.tracking_id}');
      `
    case 'pixel':
      return `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${config.tracking_id}');
        fbq('track', 'PageView');
      `
    case 'hotjar':
      return `
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${config.tracking_id},hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `
    case 'clarity':
      return `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${config.tracking_id}");
      `
    default:
      return null
  }
}

export default AnalyticsProvider
