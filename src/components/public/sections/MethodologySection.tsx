// src/components/public/sections/MethodologySection.tsx
// ============================================================================
// METHODOLOGY SECTION — Homepage Empire Gold
// ============================================================================
// Seção que explica o processo de trabalho com:
// - Timeline de fases numeradas (01, 02, 03...)
// - Cada fase: número gold grande, badge com tempo, título, descrição
// - Cards abaixo de cada fase com atividades
// ============================================================================

'use client'

import { homeContent } from '@/content/home'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export function MethodologySection() {
    const { methodology } = homeContent
    const { ref, isVisible } = useScrollAnimation()

    return (
        <section
            ref={ref}
            className="py-20 lg:py-28 bg-[var(--color-empire-bg)] relative overflow-hidden"
        >
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30" />

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    {/* Label */}
                    <span
                        className={`inline-block text-sm font-medium tracking-wider uppercase text-[var(--color-empire-gold)] mb-4 transition-all duration-700 ${isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                            }`}
                    >
                        {methodology.label}
                    </span>

                    {/* Title */}
                    <h2
                        className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-empire-text)] transition-all duration-700 delay-100 ${isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                            }`}
                    >
                        {methodology.title}
                    </h2>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Connecting line */}
                    <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-empire-gold)]/30 to-transparent" />

                    {/* Phases */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {methodology.phases.map((phase, index) => (
                            <div
                                key={index}
                                className={`relative transition-all duration-700 ${isVisible
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-8'
                                    }`}
                                style={{ transitionDelay: `${200 + index * 150}ms` }}
                            >
                                {/* Phase number */}
                                <div className="text-center mb-6">
                                    <div className="relative inline-block">
                                        {/* Large gold number */}
                                        <span className="font-display text-7xl sm:text-8xl font-bold text-gold-gradient opacity-20 absolute -inset-x-4 -top-2">
                                            {phase.number}
                                        </span>
                                        {/* Visible number */}
                                        <span className="relative font-display text-5xl sm:text-6xl font-bold text-gold-gradient">
                                            {phase.number}
                                        </span>
                                    </div>
                                </div>

                                {/* Phase content */}
                                <div className="bg-[var(--color-empire-card)] border border-[var(--color-empire-border)] rounded-sm p-6 lg:p-8">
                                    {/* Badge with week */}
                                    <span className="inline-block text-xs font-medium tracking-wider uppercase text-[var(--color-empire-gold)] bg-[var(--color-empire-gold)]/10 px-3 py-1 rounded-sm mb-4">
                                        {phase.badge}
                                    </span>

                                    {/* Title */}
                                    <h3 className="font-display text-2xl font-semibold text-[var(--color-empire-text)] mb-3">
                                        {phase.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-[var(--color-empire-muted)] text-sm leading-relaxed mb-6">
                                        {phase.description}
                                    </p>

                                    {/* Activity cards */}
                                    <div className="space-y-2">
                                        {phase.cards.map((card, cardIndex) => (
                                            <div
                                                key={cardIndex}
                                                className="flex items-center gap-3 text-sm text-[var(--color-empire-text)]"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-empire-gold)]" />
                                                <span>{card}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
