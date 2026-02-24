// src/components/public/sections/contact/ContactFaqSection.tsx
// ============================================================================
// CONTACT FAQ SECTION — Página Contato
// ============================================================================
// Seção de FAQ rápido com:
// - Background: empire-bg
// - 3-4 perguntas comuns
// - Accordion ou lista simples
// ============================================================================

'use client'

import { ChevronDown } from 'lucide-react'
import { contatoContent } from '@/content/contato'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useState } from 'react'

export function ContactFaqSection() {
    const { quickFaq } = contatoContent
    const { ref, isVisible } = useScrollAnimation()
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    function toggleFaq(index: number) {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section
            ref={ref}
            className="py-20 lg:py-32 bg-[var(--color-empire-bg)]"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2
                            className={`font-display text-3xl sm:text-4xl font-bold text-[var(--color-empire-text)] mb-4 transition-all duration-700 ${isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                                }`}
                        >
                            {quickFaq.title}
                        </h2>
                    </div>

                    {/* FAQ Items */}
                    <div className="space-y-4">
                        {quickFaq.items.map((item, index) => (
                            <div
                                key={index}
                                className={`rounded-xl bg-[var(--color-empire-surface)] border border-[var(--color-empire-border)] overflow-hidden transition-all duration-700 ${isVisible
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-8'
                                    }`}
                                style={{
                                    transitionDelay: isVisible
                                        ? `${(index + 1) * 100}ms`
                                        : '0ms',
                                }}
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-[var(--color-empire-gold)]/5 transition-colors"
                                >
                                    <span className="font-medium text-[var(--color-empire-text)] pr-4">
                                        {item.question}
                                    </span>
                                    <ChevronDown
                                        className={`h-5 w-5 text-[var(--color-empire-gold)] flex-shrink-0 transition-transform duration-300 ${openIndex === index
                                                ? 'rotate-180'
                                                : ''
                                            }`}
                                    />
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${openIndex === index
                                            ? 'max-h-48'
                                            : 'max-h-0'
                                        }`}
                                >
                                    <p className="px-6 pb-6 text-[var(--color-empire-muted)] leading-relaxed">
                                        {item.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
