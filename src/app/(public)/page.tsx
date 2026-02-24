// src/app/(public)/page.tsx
// ============================================================================
// HOMEPAGE — Empire Gold Design System
// ============================================================================
// Página principal do site público com todas as seções:
// 1. HeroSection — Badge, título, benefícios, CTAs
// 2. SocialProofSection — Estatísticas e logos
// 3. ProblemSection — Pontos de dor do cliente
// 4. SolutionSection — Como a Empire resolve
// 5. MethodologySection — Processo em fases
// 6. BlogPreviewSection — Preview de artigos
// 7. FaqSection — Perguntas frequentes
// 8. FinalCtaSection — Chamada final para ação
// ============================================================================

import type { Metadata } from 'next'
import {
    HeroSection,
    SocialProofSection,
    ProblemSection,
    SolutionSection,
    MethodologySection,
    BlogPreviewSection,
    FaqSection,
    FinalCtaSection,
} from '@/components/public/sections'
import { Separator } from '@/components/ui/separator'
import { JsonLd } from '@/components/shared/JsonLd'
import { organizationSchema, websiteSchema } from '@/lib/seo/jsonld'
import { generateHomeMetadata } from '@/lib/seo/metadata'

// SEO Metadata for homepage
export const metadata: Metadata = generateHomeMetadata({
    description: 'Empire — Consultoria de estratégia e crescimento para negócios de alto impacto. Transformamos visão em resultados extraordinários.',
    canonical: '/',
})

export default function HomePage() {
    return (
        <>
            {/* JSON-LD Structured Data */}
            <JsonLd data={[organizationSchema(), websiteSchema()]} />

            <main className="bg-[var(--color-empire-bg)] text-[var(--color-empire-text)]">
                {/* Hero - Full viewport height with main CTA */}
                <HeroSection />

                {/* Social Proof - Stats and logos */}
                <Separator />
                <SocialProofSection />

                {/* Problem - Pain points */}
                <Separator />
                <ProblemSection />

                {/* Solution - How we solve */}
                <Separator />
                <SolutionSection />

                {/* Methodology - Process phases */}
                <Separator />
                <MethodologySection />

                {/* Blog Preview - Latest articles */}
                <Separator />
                <BlogPreviewSection />

                {/* FAQ - Common questions */}
                <Separator />
                <FaqSection />

                {/* Final CTA - Last call to action */}
                <Separator />
                <FinalCtaSection />
            </main>
        </>
    )
}
