// src/components/public/sections/ProblemSection.tsx
// ============================================================================
// PROBLEM SECTION — Homepage Empire Gold
// ============================================================================
// Seção que identifica as dores do público-alvo com:
// - Label em gold uppercase
// - H2 com palavra destacada em gold
// - Grid de cards de pain points (3 colunas em desktop)
// - Cada card: ícone, título, descrição, citação
// ============================================================================

'use client'

import { Target, BarChart3, Users, Lightbulb, Rocket, TrendingUp } from 'lucide-react'
import { homeContent } from '@/content/home'
import { splitTitleForGold } from '@/lib/utils/content'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    target: Target,
    chart: BarChart3,
    team: Users,
    lightbulb: Lightbulb,
    rocket: Rocket,
    trending: TrendingUp,
}

export function ProblemSection() {
    const { problem } = homeContent
    const titleParts = splitTitleForGold(problem.title)
    const { ref, isVisible } = useScrollAnimation()

    return (
        <section
            ref={ref}
            className="py-20 lg:py-28 bg-[var(--color-empire-bg)] relative overflow-hidden"
        >
            {/* Grid pattern at 50% opacity */}
            <div className="absolute inset-0 bg-grid-pattern opacity-50" />

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
                        {problem.label}
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
                        className={`text-lg text-[var(--color-empire-muted)] transition-all duration-700 delay-200 ${isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                            }`}
                    >
                        {problem.subtitle}
                    </p>
                </div>

                {/* Pain points grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {problem.painPoints.map((painPoint, index) => {
                        const IconComponent = iconMap[painPoint.icon] || Target

                        return (
                            <div
                                key={index}
                                className={`group relative bg-[var(--color-empire-card)] border border-[var(--color-empire-border)] rounded-sm p-6 lg:p-8 hover:border-[var(--color-empire-gold)]/30 transition-all duration-500 ${isVisible
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-8'
                                    }`}
                                style={{ transitionDelay: `${300 + index * 100}ms` }}
                            >
                                {/* Icon */}
                                <div className="mb-6">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-[var(--color-empire-gold)]/10 border border-[var(--color-empire-gold)]/20">
                                        <IconComponent className="h-6 w-6 text-[var(--color-empire-gold)]" />
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="font-display text-xl font-semibold text-[var(--color-empire-text)] mb-3">
                                    {painPoint.title}
                                </h3>

                                {/* Description */}
                                <p className="text-[var(--color-empire-muted)] text-sm leading-relaxed mb-6">
                                    {painPoint.description}
                                </p>

                                {/* Quote */}
                                <div className="pt-4 border-t border-[var(--color-empire-border)]">
                                    <p className="text-sm italic text-[var(--color-empire-gold)]/80">
                                        {painPoint.quote}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
