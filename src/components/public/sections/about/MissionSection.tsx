// src/components/public/sections/about/MissionSection.tsx
// ============================================================================
// MISSION SECTION — Página Sobre
// ============================================================================
// Seção de missão e visão com:
// - Background: empire-surface
// - Layout centralizado
// - Ícone em gold
// - Missão e visão lado a lado ou empilhados
// ============================================================================

'use client'

import { Target, Eye } from 'lucide-react'
import { sobreContent } from '@/content/sobre'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export function MissionSection() {
    const { mission, vision } = sobreContent
    const { ref, isVisible } = useScrollAnimation()

    return (
        <section
            ref={ref}
            className="py-20 lg:py-32 bg-[var(--color-empire-surface)]"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
                        {/* Mission Card */}
                        <div
                            className={`text-center p-8 lg:p-12 rounded-2xl bg-[var(--color-empire-bg)] border border-[var(--color-empire-border)] transition-all duration-700 ${isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                                }`}
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-empire-gold)]/10 mb-6">
                                <Target className="h-8 w-8 text-[var(--color-empire-gold)]" />
                            </div>
                            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--color-empire-text)] mb-4">
                                {mission.title}
                            </h2>
                            <p className="text-lg text-[var(--color-empire-muted)] leading-relaxed">
                                {mission.description}
                            </p>
                        </div>

                        {/* Vision Card */}
                        <div
                            className={`text-center p-8 lg:p-12 rounded-2xl bg-[var(--color-empire-bg)] border border-[var(--color-empire-border)] transition-all duration-700 delay-100 ${isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                                }`}
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-empire-gold)]/10 mb-6">
                                <Eye className="h-8 w-8 text-[var(--color-empire-gold)]" />
                            </div>
                            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--color-empire-text)] mb-4">
                                {vision.title}
                            </h2>
                            <p className="text-lg text-[var(--color-empire-muted)] leading-relaxed">
                                {vision.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
