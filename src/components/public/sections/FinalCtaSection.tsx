// src/components/public/sections/FinalCtaSection.tsx
// ============================================================================
// FINAL CTA SECTION — Homepage Empire Gold
// ============================================================================
// Última seção antes do footer com:
// - Background empire-surface com gradiente decorativo
// - H2 com palavra destacada em gold
// - Subtítulo persuasivo
// - Botão CTA grande e premium
// ============================================================================

'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { homeContent } from '@/content/home'
import { splitTitleForGold } from '@/lib/utils/content'
import { Button } from '@/components/ui/button'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export function FinalCtaSection() {
    const { finalCta } = homeContent
    const titleParts = splitTitleForGold(finalCta.title)
    const { ref, isVisible } = useScrollAnimation()

    return (
        <section
            ref={ref}
            className="py-24 lg:py-32 bg-[var(--color-empire-surface)] relative overflow-hidden"
        >
            {/* Centered gradient decoration */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[600px] h-[600px] bg-[var(--color-empire-gold)]/5 rounded-full blur-3xl" />
            </div>

            {/* Additional decorative elements */}
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[var(--color-empire-gold)]/10 to-transparent" />
            <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-[var(--color-empire-gold)]/10 to-transparent" />

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Title */}
                    <h2
                        className={`font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[var(--color-empire-text)] mb-6 transition-all duration-700 ${isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                            }`}
                    >
                        {titleParts.map((part, index) => (
                            <span
                                key={index}
                                className={part.isGold ? 'text-gold-gradient' : ''}
                            >
                                {part.text}
                            </span>
                        ))}
                    </h2>

                    {/* Subtitle */}
                    <p
                        className={`text-lg sm:text-xl text-[var(--color-empire-muted)] mb-10 max-w-2xl mx-auto transition-all duration-700 delay-100 ${isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                            }`}
                    >
                        {finalCta.subtitle}
                    </p>

                    {/* CTA Button */}
                    <div
                        className={`transition-all duration-700 delay-200 ${isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                            }`}
                    >
                        <Link href={finalCta.cta.primary.href}>
                            <Button variant="premium" size="lg" pulseRing>
                                {finalCta.cta.primary.label}
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
