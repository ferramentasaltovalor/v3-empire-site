// src/components/landing-pages/sections/FeaturesSection.tsx
// Features section component for landing pages

import { Check } from 'lucide-react'
import type { FeaturesSection as FeaturesSectionType } from '@/lib/landing-pages'

interface FeaturesSectionProps {
  section: FeaturesSectionType
}

export function FeaturesSection({ section }: FeaturesSectionProps) {
  const {
    title,
    subtitle,
    columns = 3,
    features,
    style = 'icons',
    backgroundColor,
  } = section

  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  const containerStyle: React.CSSProperties = {
    backgroundColor: backgroundColor || undefined,
  }

  return (
    <section className="py-16 md:py-24" style={containerStyle}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {subtitle && (
              <p className="text-sm uppercase tracking-wider text-[var(--color-empire-gold)] mb-2">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {title}
              </h2>
            )}
          </div>
        )}

        {/* Features Grid */}
        <div className={`grid ${gridClasses[columns]} gap-8`}>
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`${
                style === 'cards'
                  ? 'bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow'
                  : 'text-center'
              }`}
            >
              {/* Icon/Image */}
              {style === 'icons' && (
                <div className="w-12 h-12 bg-[var(--color-empire-gold)]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {feature.icon ? (
                    <span className="text-2xl">{feature.icon}</span>
                  ) : (
                    <Check className="w-6 h-6 text-[var(--color-empire-gold)]" />
                  )}
                </div>
              )}

              {style === 'cards' && feature.imageUrl && (
                <div className="mb-4 -mx-6 -mt-6">
                  <img
                    src={feature.imageUrl}
                    alt={feature.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                </div>
              )}

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              {feature.description && (
                <p className="text-gray-600">{feature.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
