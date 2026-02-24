// src/components/public/sections/about/AboutHeroSection.tsx
// ============================================================================
// ABOUT HERO SECTION — Página Sobre
// ============================================================================
// Seção hero da página Sobre com:
// - Label em gold uppercase
// - H1 com gold-highlighted word
// - Subtítulo em text-muted
// - Background com grid pattern
// ============================================================================

'use client'

import { sobreContent } from '@/content/sobre'
import { splitTitleForGold } from '@/lib/utils/content'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export function AboutHeroSection() {
    const { hero } = sobreContent
    const titleParts = splitTitleForGold(hero.title)
    const { ref, isVisible } = useScrollAnimation()

    return (
        <section
            ref={ref}
            className="relative min-h-[60vh] flex items-center justify-center bg-[var(--color-empire-bg)] bg-grid-pattern overflow-hidden"
        >
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-empire-bg)]" />

            {/* Content container */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Label */}
                    <div
                        className={`inline-flex items-center gap-2 mb-8 transition-all duration-700 ${isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                            }`}
                    >
                        <span className="text-sm font-medium tracking-wider uppercase text-[var(--color-empire-gold)]">
                            {hero.label}
                        </span>
                    </div>

                    {/* H1 Title with gold highlight */}
                    <h1
                        className={`font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 transition-all duration-700 delay-100 ${isVisible
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
                        className={`text-lg sm:text-xl text-[var(--color-empire-muted)] max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                            }`}
                    >
                        {hero.subtitle}
                    </p>
                </div>
            </div>
        </section>
    )
}
