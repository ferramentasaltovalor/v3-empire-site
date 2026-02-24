// src/components/landing-pages/sections/CustomHTMLSection.tsx
// Custom HTML section component for landing pages

import type { CustomHTMLSection as CustomHTMLSectionType } from '@/lib/landing-pages'

interface CustomHTMLSectionProps {
  section: CustomHTMLSectionType
}

export function CustomHTMLSection({ section }: CustomHTMLSectionProps) {
  const { html, sanitize = true } = section

  // Basic sanitization (in production, use a proper sanitization library like DOMPurify)
  const sanitizeHTML = (html: string): string => {
    if (!sanitize) return html
    
    // Remove script tags (basic protection)
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  }

  return (
    <section className="py-8">
      <div 
        className="container mx-auto px-4"
        dangerouslySetInnerHTML={{ __html: sanitizeHTML(html) }}
      />
    </section>
  )
}
