// src/components/public/sections/FaqSection.tsx
// ============================================================================
// FAQ SECTION — Homepage Empire Gold
// ============================================================================
// Seção de perguntas frequentes com:
// - Accordion style FAQ
// - Border bottom gold/10 entre itens
// - Question hover: gold
// - Icon rotate 180° when open
// ============================================================================

'use client'

import { homeContent } from '@/content/home'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export function FaqSection() {
    const { faq } = homeContent
    const { ref, isVisible } = useScrollAnimation()

    return (
        <section
            ref={ref}
            className="py-20 lg:py-28 bg-[var(--color-empire-bg)]"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Left: Header */}
                    <div className="lg:sticky lg:top-32 lg:self-start">
                        {/* Label */}
                        <span
                            className={`inline-block text-sm font-medium tracking-wider uppercase text-[var(--color-empire-gold)] mb-4 transition-all duration-700 ${isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                                }`}
                        >
                            {faq.label}
                        </span>

                        {/* Title */}
                        <h2
                            className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-empire-text)] mb-6 transition-all duration-700 delay-100 ${isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                                }`}
                        >
                            {faq.title}
                        </h2>

                        {/* Subtitle */}
                        <p
                            className={`text-lg text-[var(--color-empire-muted)] transition-all duration-700 delay-200 ${isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                                }`}
                        >
                            {faq.subtitle}
                        </p>
                    </div>

                    {/* Right: Accordion */}
                    <div
                        className={`transition-all duration-700 delay-300 ${isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                            }`}
                    >
                        <Accordion type="single" defaultValue="item-0">
                            {faq.items.map((item, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger>
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-base leading-relaxed">
                                            {item.answer}
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    )
}
