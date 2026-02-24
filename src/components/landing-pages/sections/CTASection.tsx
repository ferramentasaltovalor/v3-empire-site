// src/components/landing-pages/sections/CTASection.tsx
// Call-to-action section component for landing pages

import Link from 'next/link'
import type { CTASection as CTASectionType } from '@/lib/landing-pages'

interface CTASectionProps {
  section: CTASectionType
}

export function CTASection({ section }: CTASectionProps) {
  const {
    title,
    description,
    buttonText,
    buttonHref,
    buttonVariant = 'primary',
    backgroundColor,
    backgroundGradient,
    textColor = 'light',
    alignment = 'center',
  } = section

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }

  const textColorClasses = {
    light: 'text-white',
    dark: 'text-gray-900',
  }

  const containerStyle: React.CSSProperties = {
    backgroundColor: backgroundGradient ? undefined : backgroundColor || '#0a0a0b',
    backgroundImage: backgroundGradient || undefined,
  }

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg transition-all duration-200'
    
    switch (buttonVariant) {
      case 'secondary':
        return `${baseClasses} bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm`
      case 'outline':
        return `${baseClasses} border-2 border-current hover:bg-white/10`
      default:
        return `${baseClasses} bg-[var(--color-empire-gold)] text-gray-900 hover:bg-[var(--color-empire-gold-dark)]`
    }
  }

  return (
    <section 
      className={`py-16 md:py-24 ${textColorClasses[textColor]}`}
      style={containerStyle}
    >
      <div className="container mx-auto px-4">
        <div className={`flex flex-col gap-6 ${alignmentClasses[alignment]}`}>
          <h2 className="text-3xl md:text-4xl font-bold max-w-2xl">
            {title}
          </h2>
          
          {description && (
            <p className="text-lg opacity-90 max-w-xl">
              {description}
            </p>
          )}

          <Link href={buttonHref} className={getButtonClasses()}>
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  )
}
