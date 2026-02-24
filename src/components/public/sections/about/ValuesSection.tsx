// src/components/public/sections/about/ValuesSection.tsx
// ============================================================================
// VALUES SECTION — Página Sobre
// ============================================================================
// Seção de valores com:
// - Background: empire-bg
// - Grid de cards de valores (2-4 colunas)
// - Cada card: ícone, título, descrição
// - Gold accent on hover
// ============================================================================

'use client'

import { Star, Shield, TrendingUp, Users } from 'lucide-react'
import { sobreContent } from '@/content/sobre'
import { useStaggeredAnimation } from '@/hooks/useScrollAnimation'

// Mapa de ícones para valores (baseado no título)
const valueIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    'Excelência': Star,
    'Transparência': Shield,
    'Resultado': TrendingUp,
    'Parceria': Users,
}

// Ícone padrão se não encontrar
const DefaultIcon = Star

export function ValuesSection() {
    const { values } = sobreContent
    const { ref, isVisible } = useStaggeredAnimation(values.length, 100)

    return (
        <section
            ref={ref}
            className="py-20 lg:py-32 bg-[var(--color-empire-bg)]"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <h2
                            className={`font-display text-3xl sm:text-4xl font-bold text-[var(--color-empire-text)] mb-4 transition-all duration-700 ${isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                                }`}
                        >
                            Nossos <span className="text-gold-gradient">Valores</span>
                        </h2>
                        <p
                            className={`text-lg text-[var(--color-empire-muted)] max-w-2xl mx-auto transition-all duration-700 delay-100 ${isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                                }`}
                        >
                            Princípios que guiam cada decisão e entrega.
                        </p>
                    </div>

                    {/* Values Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {values.map((value, index) => {
                            const Icon = valueIcons[value.title] || DefaultIcon
                            return (
                                <div
                                    key={value.title}
                                    className={`group p-6 lg:p-8 rounded-2xl bg-[var(--color-empire-surface)] border border-[var(--color-empire-border)] hover:border-[var(--color-empire-gold)]/50 transition-all duration-500 ${isVisible
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-8'
                                        }`}
                                    style={{
                                        transitionDelay: isVisible
                                            ? `${(index + 2) * 100}ms`
                                            : '0ms',
                                    }}
                                >
                                    {/* Icon */}
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-empire-gold)]/10 mb-4 group-hover:bg-[var(--color-empire-gold)]/20 transition-colors duration-300">
                                        <Icon className="h-6 w-6 text-[var(--color-empire-gold)]" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-display text-xl font-semibold text-[var(--color-empire-text)] mb-2 group-hover:text-[var(--color-empire-gold)] transition-colors duration-300">
                                        {value.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-[var(--color-empire-muted)] leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
