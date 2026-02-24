// src/components/public/sections/HeroSection.tsx
// ============================================================================
// HERO SECTION — Homepage Empire Gold
// ============================================================================
// Seção principal da homepage com:
// - Badge com pulse dourado
// - H1 com parte em gold gradient
// - Subtítulo
// - Benefícios com checkmarks dourados
// - CTAs primário e secundário
// - Scroll indicator animado
// ============================================================================

'use client'

import Link from 'next/link'
import { Check, ChevronDown, ArrowRight } from 'lucide-react'
import { homeContent } from '@/content/home'
import { splitTitleForGold } from '@/lib/utils/content'
import { Button } from '@/components/ui/button'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export function HeroSection() {
    const { hero } = homeContent
    const titleParts = splitTitleForGold(hero.title)
    const { ref, isVisible } = useScrollAnimation()

    return (
        <section
            ref={ref}
            className="relative min-h-screen flex items-center justify-center bg-[var(--color-empire-bg)] bg-grid-pattern overflow-hidden"
        >
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-empire-bg)]" />

            {/* Content container */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge with gold pulse */}
                    <div
                        className={`inline-flex items-center gap-2 mb-8 transition-all duration-700 ${isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                            }`}
                    >
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-empire-gold)] opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-empire-gold)]" />
                        </span>
                        <span className="text-sm font-medium tracking-wider uppercase text-[var(--color-empire-gold)]">
                            {hero.badge}
                        </span>
                    </div>

                    {/* H1 Title with gold highlight */}
                    <h1
                        className={`font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 transition-all duration-700 delay-100 ${isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                            }`}
                    >
                        <span className="text-[var(--color-empire-text)]">
                            {titleParts.map((part, index) => (
                                <span
                                    key={index}
                                    className={part.isGold ? 'text-gold-gradient' : ''}
                                >
                                    {part.text}
                                </span>
                            ))}
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p
                        className={`text-lg sm:text-xl text-[var(--color-empire-muted)] max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                            }`}
                    >
                        {hero.subtitle}
                    </p>

                    {/* Benefits with gold checkmarks */}
                    <div
                        className={`flex flex-wrap items-center justify-center gap-6 mb-12 transition-all duration-700 delay-300 ${isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                            }`}
                    >
                        {hero.benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 text-[var(--color-empire-text)]"
                            >
                                <Check className="h-5 w-5 text-[var(--color-empire-gold)]" />
                                <span className="text-sm sm:text-base">{benefit}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTAs */}
                    <div
                        className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-400 ${isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                            }`}
                    >
                        <Link href={hero.cta.primary.href}>
                            <Button variant="premium" size="lg" pulseRing>
                                {hero.cta.primary.label}
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href={hero.cta.secondary.href}>
                            <Button variant="secondary" size="lg">
                                {hero.cta.secondary.label}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div
                className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 delay-500 ${isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }`}
            >
                <div className="flex flex-col items-center gap-2 text-[var(--color-empire-muted)]">
                    <span className="text-xs uppercase tracking-widest">Scroll</span>
                    <ChevronDown className="h-5 w-5 animate-bounce text-[var(--color-empire-gold)]" />
                </div>
            </div>
        </section>
    )
}
