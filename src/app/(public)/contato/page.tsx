// src/app/(public)/contato/page.tsx
// ============================================================================
// PÁGINA CONTATO — Empire Site
// ============================================================================
// Página de contato com:
// - Hero com introdução
// - Formulário de contato
// - Informações de contato
// - FAQ rápido
// ============================================================================

import { ContactHeroSection } from '@/components/public/sections/contact/ContactHeroSection'
import { ContactFormSection } from '@/components/public/sections/contact/ContactFormSection'
import { ContactFaqSection } from '@/components/public/sections/contact/ContactFaqSection'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb } from '@/components/public/layout/Breadcrumb'
import { JsonLd } from '@/components/shared/JsonLd'
import { webPageSchema, breadcrumbSchema } from '@/lib/seo/jsonld'
import { generatePageMetadata } from '@/lib/seo/metadata'

export const metadata = generatePageMetadata(
  'Contato',
  'Entre em contato com a Empire. Preencha o formulário e um especialista entrará em contato em até 24 horas.',
  '/contato'
)

export default function ContatoPage() {
  const webPageJsonLd = webPageSchema(
    'Contato',
    'Entre em contato com a Empire. Preencha o formulário e um especialista entrará em contato em até 24 horas.',
    '/contato'
  )

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: 'Contato', url: '/contato' },
  ])

  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLd data={[webPageJsonLd, breadcrumbJsonLd]} />

      <Breadcrumb items={[{ label: 'Contato', href: '/contato' }]} />
      <ContactHeroSection />
      <Separator className="bg-[var(--color-empire-border)]" />
      <ContactFormSection />
      <Separator className="bg-[var(--color-empire-border)]" />
      <ContactFaqSection />
    </>
  )
}
