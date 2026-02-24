// src/components/public/sections/SolutionSection.tsx
// ============================================================================
// SOLUTION SECTION — Homepage Empire Gold
// ============================================================================
// Seção que apresenta a solução com:
// - Label em gold uppercase
// - H2 com palavra destacada em gold
// - Grid assimétrico: imagem + texto com feature cards
// - Elementos decorativos dourados ao redor da imagem
// - CTA no final
// ============================================================================

'use client'

import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { homeContent } from '@/content/home'
import { splitTitleForGold } from '@/lib/utils/content'
import { Button } from '@/components/ui/button'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export function SolutionSection() {
    const { solution } = homeContent
    const titleParts = splitTitleForGold(solution.title)
    const { ref, isVisible } = useScrollAnimation()

    return (
        <section
            ref={ref}
            className="py-20 lg:py-28 bg-[var(--color-empire-surface)] relative overflow-hidden"
        >
            {/* Gradient decoration on right side */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[var(--color-empire-gold)]/5 to-transparent pointer-events-none" />

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Image with decorative elements */}
                    <div
                        className={`relative transition-all duration-700 ${isVisible
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 -translate-x-8'
                            }`}
                    >
                        {/* Decorative gold elements */}
                        <div className="absolute -top-4 -left-4 w-24 h-24 border-l-2 border-t-2 border-[var(--color-empire-gold)]/30" />
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-[var(--color-empire-gold)]/30" />

                        {/* Main image placeholder */}
                        <div className="relative aspect-[4/3] bg-[var(--color-empire-card)] border border-[var(--color-empire-border)] rounded-sm overflow-hidden">
                            {/* Placeholder gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-empire-gold)]/10 via-transparent to-[var(--color-empire-gold)]/5" />

                            {/* Decorative center element */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full border-2 border-[var(--color-empire-gold)]/20 flex items-center justify-center">
                                    <div className="w-20 h-20 rounded-full border border-[var(--color-empire-gold)]/30 flex items-center justify-center">
                                        <div className="w-8 h-8 rounded-full bg-[var(--color-empire-gold)]/20" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div>
                        {/* Label */}
                        <span
                            className={`inline-block text-sm font-medium tracking-wider uppercase text-[var(--color-empire-gold)] mb-4 transition-all duration-700 ${isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                                }`}
                        >
                            {solution.label}
                        </span>

                        {/* Title */}
                        <h2
                            className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-empire-text)] mb-6 transition-all duration-700 delay-100 ${isVisible
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
                            className={`text-lg text-[var(--color-empire-muted)] mb-10 transition-all duration-700 delay-200 ${isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                                }`}
                        >
                            {solution.subtitle}
                        </p>

                        {/* Feature cards */}
                        <div className="space-y-4 mb-10">
                            {solution.features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`flex items-start gap-4 p-4 bg-[var(--color-empire-card)] border border-[var(--color-empire-border)] rounded-sm hover:border-[var(--color-empire-gold)]/20 transition-all duration-300 ${isVisible
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-8'
                                        }`}
                                    style={{ transitionDelay: `${300 + index * 100}ms` }}
                                >
                                    <div className="flex-shrink-0 mt-1">
                                        <Check className="h-5 w-5 text-[var(--color-empire-gold)]" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-[var(--color-empire-text)] mb-1">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-[var(--color-empire-muted)]">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div
                            className={`transition-all duration-700 delay-700 ${isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                                }`}
                        >
                            <Link href={solution.cta.href}>
                                <Button variant="secondary" size="lg">
                                    {solution.cta.label}
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
