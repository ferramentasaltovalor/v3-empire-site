// src/components/landing-pages/sections/TestimonialsSection.tsx
// Testimonials section component for landing pages

import { Star } from 'lucide-react'
import type { TestimonialsSection as TestimonialsSectionType } from '@/lib/landing-pages'

interface TestimonialsSectionProps {
  section: TestimonialsSectionType
}

export function TestimonialsSection({ section }: TestimonialsSectionProps) {
  const {
    title,
    subtitle,
    testimonials,
    layout = 'grid',
    columns = 2,
    backgroundColor,
    showRating = true,
  } = section

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }

  const containerStyle: React.CSSProperties = {
    backgroundColor: backgroundColor || undefined,
  }

  const renderStars = (rating?: number) => {
    if (!rating || !showRating) return null
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-[var(--color-empire-gold)] text-[var(--color-empire-gold)]'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    )
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

        {/* Testimonials Grid */}
        <div className={layout === 'grid' ? `grid ${gridClasses[columns]} gap-8` : 'space-y-8'}>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-xl p-6 shadow-lg ${
                layout === 'masonry' ? 'h-fit' : ''
              }`}
            >
              {/* Rating */}
              {renderStars(testimonial.rating)}

              {/* Quote */}
              <blockquote className="text-gray-700 mt-4 mb-6 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                {testimonial.avatarUrl ? (
                  <img
                    src={testimonial.avatarUrl}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-600">
                      {testimonial.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.author}
                  </p>
                  {(testimonial.role || testimonial.company) && (
                    <p className="text-sm text-gray-500">
                      {testimonial.role}
                      {testimonial.role && testimonial.company && ' · '}
                      {testimonial.company}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
