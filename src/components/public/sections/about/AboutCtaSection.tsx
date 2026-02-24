// src/components/public/sections/about/AboutCtaSection.tsx
// ============================================================================
// ABOUT CTA SECTION — Página Sobre
// ============================================================================
// Seção de CTA final da página Sobre com:
// - Background: empire-surface
// - Layout centralizado
// - Título com gold highlight
// - Botão para página de contato
// ============================================================================

'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { sobreContent } from '@/content/sobre'
import { splitTitleForGold } from '@/lib/utils/content'
import { Button } from '@/components/ui/button'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export function AboutCtaSection() {
    const { cta } = sobreContent
    const titleParts = splitTitleForGold(cta.title)
    const { ref, isVisible } = useScrollAnimation()

    return (
        <section
            ref={ref}
            className="py-20 lg:py-32 bg-[var(--color-empire-surface)]"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Title with gold highlight */}
                    <h2
                        className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-empire-text)] mb-6 transition-all duration-700 ${isVisible
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
                        className={`text-lg sm:text-xl text-[var(--color-empire-muted)] mb-10 leading-relaxed transition-all duration-700 delay-100 ${isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                            }`}
                    >
                        {cta.subtitle}
                    </p>

                    {/* CTA Button */}
                    <div
                        className={`transition-all duration-700 delay-200 ${isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                            }`}
                    >
                        <Link href={cta.button.href}>
                            <Button variant="premium" size="lg" pulseRing>
                                {cta.button.label}
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
