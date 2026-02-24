// src/components/public/sections/contact/ContactFormSection.tsx
// ============================================================================
// CONTACT FORM SECTION — Página Contato
// ============================================================================
// Seção com formulário de contato e informações de contato com:
// - Layout duas colunas: formulário + info
// - Background: empire-surface
// - Cards de contato com ícones
// - Horário de atendimento
// ============================================================================

'use client'

import { Mail, Phone, MessageCircle, MapPin, Clock } from 'lucide-react'
import { contatoContent } from '@/content/contato'
import { ContactForm } from './ContactForm'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

// Mapa de ícones para contato
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    mail: Mail,
    phone: Phone,
    'message-circle': MessageCircle,
    'map-pin': MapPin,
}

export function ContactFormSection() {
    const { info, businessHours } = contatoContent
    const { ref, isVisible } = useScrollAnimation()

    return (
        <section
            ref={ref}
            className="py-20 lg:py-32 bg-[var(--color-empire-surface)]"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
                        {/* Form Column - 3/5 */}
                        <div
                            className={`lg:col-span-3 transition-all duration-700 ${isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                                }`}
                        >
                            <div className="p-6 lg:p-10 rounded-2xl bg-[var(--color-empire-bg)] border border-[var(--color-empire-border)]">
                                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--color-empire-text)] mb-2">
                                    Envie sua mensagem
                                </h2>
                                <p className="text-[var(--color-empire-muted)] mb-8">
                                    Preencha o formulário abaixo e entraremos em contato.
                                </p>
                                <ContactForm />
                            </div>
                        </div>

                        {/* Info Column - 2/5 */}
                        <div
                            className={`lg:col-span-2 space-y-6 transition-all duration-700 delay-100 ${isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                                }`}
                        >
                            {/* Contact Info Title */}
                            <div>
                                <h3 className="font-display text-xl font-semibold text-[var(--color-empire-text)] mb-4">
                                    {info.title}
                                </h3>
                            </div>

                            {/* Contact Cards */}
                            <div className="space-y-4">
                                {info.cards.map((card, index) => {
                                    const Icon = iconMap[card.icon] || Mail
                                    const isClickable = card.link !== null

                                    const CardContent = (
                                        <div
                                            className={`flex items-start gap-4 p-4 rounded-xl bg-[var(--color-empire-bg)] border border-[var(--color-empire-border)] ${isClickable
                                                    ? 'hover:border-[var(--color-empire-gold)]/50 hover:bg-[var(--color-empire-gold)]/5 transition-colors cursor-pointer'
                                                    : ''
                                                }`}
                                        >
                                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--color-empire-gold)]/10 flex items-center justify-center">
                                                <Icon className="h-5 w-5 text-[var(--color-empire-gold)]" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-[var(--color-empire-text)] mb-1">
                                                    {card.title}
                                                </h4>
                                                <p className="text-sm text-[var(--color-empire-muted)]">
                                                    {card.description}
                                                </p>
                                            </div>
                                        </div>
                                    )

                                    if (isClickable) {
                                        return (
                                            <a
                                                key={index}
                                                href={card.link!}
                                                target={
                                                    card.link.startsWith('http')
                                                        ? '_blank'
                                                        : undefined
                                                }
                                                rel={
                                                    card.link.startsWith('http')
                                                        ? 'noopener noreferrer'
                                                        : undefined
                                                }
                                            >
                                                {CardContent}
                                            </a>
                                        )
                                    }

                                    return <div key={index}>{CardContent}</div>
                                })}
                            </div>

                            {/* Business Hours */}
                            <div
                                className={`p-4 rounded-xl bg-[var(--color-empire-bg)] border border-[var(--color-empire-border)] transition-all duration-700 delay-200 ${isVisible
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-8'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--color-empire-gold)]/10 flex items-center justify-center">
                                        <Clock className="h-5 w-5 text-[var(--color-empire-gold)]" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-[var(--color-empire-text)] mb-1">
                                            {businessHours.title}
                                        </h4>
                                        <p className="text-sm text-[var(--color-empire-muted)]">
                                            {businessHours.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
