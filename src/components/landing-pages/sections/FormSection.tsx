'use client'

// src/components/landing-pages/sections/FormSection.tsx
// Form section component for landing pages (lead capture)

import { useState } from 'react'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { submitFormAction } from '@/app/(public)/lp/[slug]/actions'
import type { FormSection as FormSectionType } from '@/lib/landing-pages'

interface FormSectionProps {
  section: FormSectionType
  landingPageId: string
}

export function FormSection({ section, landingPageId }: FormSectionProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const {
    title,
    description,
    fields,
    submitButtonText,
    successMessage,
    errorMessage,
    backgroundColor,
    style = 'boxed',
  } = section

  const containerStyle: React.CSSProperties = {
    backgroundColor: backgroundColor || undefined,
  }

  const styleClasses = {
    boxed: 'bg-white rounded-xl p-8 shadow-lg',
    inline: 'bg-transparent',
    fullwidth: 'bg-white p-8',
  }

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      await submitFormAction(landingPageId, section.id, formData)
      setStatus('success')
      setMessage(successMessage || 'Formulário enviado com sucesso!')
      setFormData({})
    } catch (error) {
      setStatus('error')
      setMessage(errorMessage || 'Erro ao enviar formulário. Tente novamente.')
    }
  }

  const renderField = (field: typeof fields[0]) => {
    const baseInputClasses = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-empire-gold)] focus:border-transparent outline-none transition-all'

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.id}
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            rows={4}
            className={baseInputClasses}
          />
        )

      case 'select':
        return (
          <select
            id={field.id}
            name={field.name}
            required={field.required}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={baseInputClasses}
          >
            <option value="">Selecione...</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'checkbox':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              id={field.id}
              name={field.name}
              required={field.required}
              checked={formData[field.name] === 'true'}
              onChange={(e) => handleInputChange(field.name, e.target.checked ? 'true' : '')}
              className="w-5 h-5 rounded border-gray-300 text-[var(--color-empire-gold)] focus:ring-[var(--color-empire-gold)]"
            />
            <span className="text-gray-700">{field.label}</span>
          </label>
        )

      default:
        return (
          <input
            type={field.type}
            id={field.id}
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={baseInputClasses}
          />
        )
    }
  }

  if (status === 'success') {
    return (
      <section className="py-16 md:py-24" style={containerStyle}>
        <div className="container mx-auto px-4 max-w-xl">
          <div className={`${styleClasses[style]} text-center`}>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Enviado!
            </h3>
            <p className="text-gray-600">{message}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24" style={containerStyle}>
      <div className="container mx-auto px-4 max-w-xl">
        <form onSubmit={handleSubmit} className={styleClasses[style]}>
          {/* Header */}
          {(title || description) && (
            <div className="text-center mb-8">
              {title && (
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-gray-600">{description}</p>
              )}
            </div>
          )}

          {/* Fields */}
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.id}>
                {field.type !== 'checkbox' && (
                  <label
                    htmlFor={field.id}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                )}
                {renderField(field)}
              </div>
            ))}
          </div>

          {/* Error Message */}
          {status === 'error' && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{message}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full mt-6 px-8 py-4 bg-[var(--color-empire-gold)] text-gray-900 font-semibold rounded-lg hover:bg-[var(--color-empire-gold-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando...
              </>
            ) : (
              submitButtonText
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
