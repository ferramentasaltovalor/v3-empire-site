// src/components/landing-pages/sections/HeroSection.tsx
// Hero section component for landing pages

import Link from 'next/link'
import type { HeroSection as HeroSectionType } from '@/lib/landing-pages'

interface HeroSectionProps {
  section: HeroSectionType
}

export function HeroSection({ section }: HeroSectionProps) {
  const {
    title,
    subtitle,
    description,
    backgroundImage,
    backgroundColor,
    backgroundGradient,
    textColor = 'light',
    alignment = 'center',
    size = 'lg',
    primaryCta,
    secondaryCta,
    overlay = false,
    overlayOpacity = 0.5,
  } = section

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }

  const sizeClasses = {
    sm: 'py-16 md:py-20',
    md: 'py-24 md:py-32',
    lg: 'py-32 md:py-40',
    full: 'min-h-screen',
  }

  const textColorClasses = {
    light: 'text-white',
    dark: 'text-gray-900',
  }

  const containerStyle: React.CSSProperties = {
    backgroundColor: backgroundColor || undefined,
    backgroundImage: backgroundGradient
      ? backgroundGradient
      : backgroundImage
      ? `url(${backgroundImage})`
      : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const getButtonClasses = (variant?: 'primary' | 'secondary' | 'outline') => {
    const baseClasses = 'inline-flex items-center justify-center px-8 py-3 text-sm font-semibold rounded-lg transition-all duration-200'
    
    switch (variant) {
      case 'secondary':
        return `${baseClasses} bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm`
      case 'outline':
        return `${baseClasses} border-2 border-white text-white hover:bg-white hover:text-gray-900`
      default:
        return `${baseClasses} bg-[var(--color-empire-gold)] text-gray-900 hover:bg-[var(--color-empire-gold-dark)]`
    }
  }

  return (
    <section 
      className={`relative ${sizeClasses[size]} ${textColorClasses[textColor]} flex flex-col justify-center`}
      style={containerStyle}
    >
      {/* Overlay */}
      {overlay && backgroundImage && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className={`flex flex-col gap-6 ${alignmentClasses[alignment]}`}>
          {subtitle && (
            <p className="text-sm md:text-base uppercase tracking-wider opacity-80">
              {subtitle}
            </p>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl">
            {title}
          </h1>
          
          {description && (
            <p className="text-lg md:text-xl opacity-90 max-w-2xl">
              {description}
            </p>
          )}

          {(primaryCta || secondaryCta) && (
            <div className="flex flex-wrap gap-4 mt-4">
              {primaryCta && (
                <Link href={primaryCta.href} className={getButtonClasses(primaryCta.variant)}>
                  {primaryCta.text}
                </Link>
              )}
              {secondaryCta && (
                <Link href={secondaryCta.href} className={getButtonClasses(secondaryCta.variant)}>
                  {secondaryCta.text}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
