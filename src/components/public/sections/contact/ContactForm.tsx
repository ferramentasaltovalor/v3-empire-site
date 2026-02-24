// src/components/public/sections/contact/ContactForm.tsx
// ============================================================================
// CONTACT FORM COMPONENT — Página Contato
// ============================================================================
// Formulário de contato com:
// - Campos: nome, email, empresa, telefone, mensagem
// - Validação de campos
// - Estados: idle, submitting, success, error
// - Animações de transição
// ============================================================================

'use client'

import { useState } from 'react'
import { Loader2, CheckCircle, AlertCircle, Send } from 'lucide-react'
import { contatoContent } from '@/content/contato'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export function ContactForm() {
    const content = contatoContent.form
    const [formState, setFormState] = useState<FormState>('idle')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    // Form field values
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: '',
    })

    // Validation errors
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Handle input changes
    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    // Validate form
    function validateForm(): boolean {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'E-mail é obrigatório'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'E-mail inválido'
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Mensagem é obrigatória'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle form submission
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!validateForm()) return

        setFormState('submitting')
        setErrorMessage(null)

        try {
            // TODO: Implement actual form submission (API route or email service)
            // For now, simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500))

            // Simulate random success/error for demo
            // In production, replace with actual API call
            setFormState('success')
            setFormData({
                name: '',
                email: '',
                company: '',
                phone: '',
                message: '',
            })
        } catch (err) {
            setFormState('error')
            setErrorMessage(content.errorMessage)
        }
    }

    // Success state
    if (formState === 'success') {
        return (
            <div className="text-center py-12 px-6 rounded-2xl bg-[var(--color-empire-bg)] border border-[var(--color-empire-gold)]/30">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-empire-gold)]/10 mb-6">
                    <CheckCircle className="h-8 w-8 text-[var(--color-empire-gold)]" />
                </div>
                <h3 className="text-2xl font-display text-[var(--color-empire-gold)] mb-4">
                    Mensagem enviada!
                </h3>
                <p className="text-[var(--color-empire-muted)] max-w-md mx-auto">
                    {content.successMessage}
                </p>
                <Button
                    variant="secondary"
                    className="mt-6"
                    onClick={() => setFormState('idle')}
                >
                    Enviar nova mensagem
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
                <Label
                    htmlFor="name"
                    className="text-[var(--color-empire-text)]"
                >
                    {content.fields.name.label}{' '}
                    <span className="text-[var(--color-empire-gold)]">*</span>
                </Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={content.fields.name.placeholder}
                    className={`bg-[var(--color-empire-bg)] border-[var(--color-empire-border)] text-[var(--color-empire-text)] placeholder:text-[var(--color-empire-muted)] focus:border-[var(--color-empire-gold)] ${errors.name
                        ? 'border-red-500 focus:border-red-500'
                        : ''
                        }`}
                    disabled={formState === 'submitting'}
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
                <Label
                    htmlFor="email"
                    className="text-[var(--color-empire-text)]"
                >
                    {content.fields.email.label}{' '}
                    <span className="text-[var(--color-empire-gold)]">*</span>
                </Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={content.fields.email.placeholder}
                    className={`bg-[var(--color-empire-bg)] border-[var(--color-empire-border)] text-[var(--color-empire-text)] placeholder:text-[var(--color-empire-muted)] focus:border-[var(--color-empire-gold)] ${errors.email
                        ? 'border-red-500 focus:border-red-500'
                        : ''
                        }`}
                    disabled={formState === 'submitting'}
                />
                {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                )}
            </div>

            {/* Company and Phone - Two columns */}
            <div className="grid sm:grid-cols-2 gap-6">
                {/* Company Field */}
                <div className="space-y-2">
                    <Label
                        htmlFor="company"
                        className="text-[var(--color-empire-text)]"
                    >
                        {content.fields.company.label}
                    </Label>
                    <Input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder={content.fields.company.placeholder}
                        className="bg-[var(--color-empire-bg)] border-[var(--color-empire-border)] text-[var(--color-empire-text)] placeholder:text-[var(--color-empire-muted)] focus:border-[var(--color-empire-gold)]"
                        disabled={formState === 'submitting'}
                    />
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                    <Label
                        htmlFor="phone"
                        className="text-[var(--color-empire-text)]"
                    >
                        {content.fields.phone.label}
                    </Label>
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={content.fields.phone.placeholder}
                        className="bg-[var(--color-empire-bg)] border-[var(--color-empire-border)] text-[var(--color-empire-text)] placeholder:text-[var(--color-empire-muted)] focus:border-[var(--color-empire-gold)]"
                        disabled={formState === 'submitting'}
                    />
                </div>
            </div>

            {/* Message Field */}
            <div className="space-y-2">
                <Label
                    htmlFor="message"
                    className="text-[var(--color-empire-text)]"
                >
                    {content.fields.message.label}{' '}
                    <span className="text-[var(--color-empire-gold)]">*</span>
                </Label>
                <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={content.fields.message.placeholder}
                    rows={5}
                    className={`bg-[var(--color-empire-bg)] border-[var(--color-empire-border)] text-[var(--color-empire-text)] placeholder:text-[var(--color-empire-muted)] focus:border-[var(--color-empire-gold)] resize-none ${errors.message
                        ? 'border-red-500 focus:border-red-500'
                        : ''
                        }`}
                    disabled={formState === 'submitting'}
                />
                {errors.message && (
                    <p className="text-sm text-red-500">{errors.message}</p>
                )}
            </div>

            {/* Error Message */}
            {formState === 'error' && errorMessage && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-500">{errorMessage}</p>
                </div>
            )}

            {/* Submit Button */}
            <Button
                type="submit"
                variant="premium"
                size="lg"
                className="w-full"
                disabled={formState === 'submitting'}
            >
                {formState === 'submitting' ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {content.submittingLabel}
                    </>
                ) : (
                    <>
                        <Send className="h-5 w-5" />
                        {content.submitLabel}
                    </>
                )}
            </Button>
        </form>
    )
}
