// src/app/(public)/sobre/page.tsx
// ============================================================================
// PÁGINA SOBRE — Empire Site
// ============================================================================
// Página institucional sobre a empresa com:
// - Hero com introdução
// - Missão e Visão
// - Valores
// - CTA para contato
// ============================================================================

import { AboutHeroSection } from '@/components/public/sections/about/AboutHeroSection'
import { MissionSection } from '@/components/public/sections/about/MissionSection'
import { ValuesSection } from '@/components/public/sections/about/ValuesSection'
import { AboutCtaSection } from '@/components/public/sections/about/AboutCtaSection'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb } from '@/components/public/layout/Breadcrumb'
import { JsonLd } from '@/components/shared/JsonLd'
import { webPageSchema, breadcrumbSchema } from '@/lib/seo/jsonld'
import { generatePageMetadata } from '@/lib/seo/metadata'

export const metadata = generatePageMetadata(
  'Sobre',
  'Conheça a Empire e nossa missão de transformar negócios através de estratégia, método e execução de alto impacto.',
  '/sobre'
)

export default function SobrePage() {
  const webPageJsonLd = webPageSchema(
    'Sobre',
    'Conheça a Empire e nossa missão de transformar negócios através de estratégia, método e execução de alto impacto.',
    '/sobre'
  )

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: 'Sobre', url: '/sobre' },
  ])

  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLd data={[webPageJsonLd, breadcrumbJsonLd]} />

      <Breadcrumb items={[{ label: 'Sobre', href: '/sobre' }]} />
      <AboutHeroSection />
      <Separator className="bg-[var(--color-empire-border)]" />
      <MissionSection />
      <Separator className="bg-[var(--color-empire-border)]" />
      <ValuesSection />
      <Separator className="bg-[var(--color-empire-border)]" />
      <AboutCtaSection />
    </>
  )
}
