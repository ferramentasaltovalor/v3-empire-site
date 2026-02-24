// src/components/public/sections/SocialProofSection.tsx
// ============================================================================
// SOCIAL PROOF SECTION — Homepage Empire Gold
// ============================================================================
// Seção de prova social com:
// - Grid de estatísticas (números grandes em dourado)
// - Labels em muted
// - Optional: logo grid abaixo das stats
// ============================================================================

'use client'

import { homeContent } from '@/content/home'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export function SocialProofSection() {
    const { socialProof } = homeContent
    const { ref, isVisible } = useScrollAnimation()

    return (
        <section
            ref={ref}
            className="py-16 lg:py-24 bg-[var(--color-empire-surface)] border-y border-[var(--color-empire-border)]"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {socialProof.stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`text-center transition-all duration-700 ${isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                                }`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            {/* Large gold number */}
                            <div className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-gold-gradient mb-2">
                                {stat.number}
                            </div>
                            {/* Muted label */}
                            <div className="text-[var(--color-empire-muted)] text-sm sm:text-base uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Logo Grid - Only shown if logos exist */}
                {socialProof.logos && socialProof.logos.length > 0 && (
                    <div
                        className={`mt-16 pt-12 border-t border-[var(--color-empire-border)] transition-all duration-700 delay-500 ${isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                            }`}
                    >
                        <p className="text-center text-[var(--color-empire-muted)] text-sm uppercase tracking-wider mb-8">
                            {socialProof.logosTitle}
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
                            {socialProof.logos.map((logo, index) => (
                                <div
                                    key={index}
                                    className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={logo.src}
                                        alt={logo.alt}
                                        className="h-8 lg:h-10 w-auto"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
