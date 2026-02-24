// src/components/landing-pages/sections/SectionRenderer.tsx
// Dynamic section renderer for landing pages

import type { LandingPageSection } from '@/lib/landing-pages'
import {
  isHeroSection,
  isFeaturesSection,
  isTestimonialsSection,
  isCTASection,
  isFormSection,
  isCustomHTMLSection,
  isTextSection,
  isImageSection,
  isVideoSection,
  isDividerSection,
} from '@/lib/landing-pages'
import { HeroSection } from './HeroSection'
import { FeaturesSection } from './FeaturesSection'
import { TestimonialsSection } from './TestimonialsSection'
import { CTASection } from './CTASection'
import { FormSection } from './FormSection'
import { CustomHTMLSection } from './CustomHTMLSection'

interface SectionRendererProps {
  section: LandingPageSection
  landingPageId: string
}

export function SectionRenderer({ section, landingPageId }: SectionRendererProps) {
  // Skip invisible sections
  if (!section.visible) {
    return null
  }

  // Render based on section type
  if (isHeroSection(section)) {
    return <HeroSection section={section} />
  }

  if (isFeaturesSection(section)) {
    return <FeaturesSection section={section} />
  }

  if (isTestimonialsSection(section)) {
    return <TestimonialsSection section={section} />
  }

  if (isCTASection(section)) {
    return <CTASection section={section} />
  }

  if (isFormSection(section)) {
    return <FormSection section={section} landingPageId={landingPageId} />
  }

  if (isCustomHTMLSection(section)) {
    return <CustomHTMLSection section={section} />
  }

  if (isTextSection(section)) {
    return (
      <section className="py-8" style={{ backgroundColor: section.backgroundColor || undefined }}>
        <div 
          className={`container mx-auto px-4 ${getMaxWidthClass(section.maxWidth)}`}
          style={{ textAlign: section.alignment || 'left' }}
        >
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </div>
      </section>
    )
  }

  if (isImageSection(section)) {
    return (
      <section className="py-8">
        <div className={`container mx-auto px-4 ${getMaxWidthClass(section.maxWidth)}`}>
          <div className={`flex ${getAlignmentClass(section.alignment)}`}>
            {section.href ? (
              <a href={section.href} target="_blank" rel="noopener noreferrer">
                <img
                  src={section.src}
                  alt={section.alt}
                  className={`max-w-full ${section.rounded ? 'rounded-lg' : ''} ${section.shadow ? 'shadow-lg' : ''}`}
                />
              </a>
            ) : (
              <img
                src={section.src}
                alt={section.alt}
                className={`max-w-full ${section.rounded ? 'rounded-lg' : ''} ${section.shadow ? 'shadow-lg' : ''}`}
              />
            )}
          </div>
          {section.caption && (
            <p className="text-center text-sm text-gray-500 mt-2">{section.caption}</p>
          )}
        </div>
      </section>
    )
  }

  if (isVideoSection(section)) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className={`relative ${getAspectRatioClass(section.aspectRatio)}`}>
            {section.provider === 'youtube' ? (
              <iframe
                src={getYouTubeEmbedUrl(section.src)}
                className="absolute inset-0 w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : section.provider === 'vimeo' ? (
              <iframe
                src={getVimeoEmbedUrl(section.src)}
                className="absolute inset-0 w-full h-full rounded-lg"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={section.src}
                poster={section.poster}
                autoPlay={section.autoplay}
                loop={section.loop}
                muted={section.muted}
                controls={section.controls}
                className="w-full h-full rounded-lg"
              />
            )}
          </div>
        </div>
      </section>
    )
  }

  if (isDividerSection(section)) {
    return (
      <div className={`py-${getMarginClass(section.margin)}`}>
        <hr 
          className={`${getWidthClass(section.width)} mx-auto border-${section.thickness || 1} ${getBorderStyle(section.style)}`}
          style={{ borderColor: section.color || '#e5e7eb' }}
        />
      </div>
    )
  }

  // Fallback for unknown section types
  return null
}

// Helper functions
function getMaxWidthClass(maxWidth?: string): string {
  switch (maxWidth) {
    case 'sm': return 'max-w-sm'
    case 'md': return 'max-w-2xl'
    case 'lg': return 'max-w-4xl'
    case 'xl': return 'max-w-6xl'
    case 'full': return 'max-w-full'
    default: return 'max-w-4xl'
  }
}

function getAlignmentClass(alignment?: string): string {
  switch (alignment) {
    case 'left': return 'justify-start'
    case 'center': return 'justify-center'
    case 'right': return 'justify-end'
    default: return 'justify-center'
  }
}

function getAspectRatioClass(ratio?: string): string {
  switch (ratio) {
    case '4:3': return 'aspect-[4/3]'
    case '1:1': return 'aspect-square'
    case '21:9': return 'aspect-[21/9]'
    default: return 'aspect-video' // 16:9
  }
}

function getYouTubeEmbedUrl(url: string): string {
  // Extract video ID from various YouTube URL formats
  const videoId = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1]
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url
}

function getVimeoEmbedUrl(url: string): string {
  // Extract video ID from Vimeo URL
  const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1]
  return videoId ? `https://player.vimeo.com/video/${videoId}` : url
}

function getMarginClass(margin?: string): string {
  switch (margin) {
    case 'sm': return '4'
    case 'md': return '8'
    case 'lg': return '16'
    default: return '8'
  }
}

function getWidthClass(width?: string): string {
  switch (width) {
    case 'sm': return 'w-1/4'
    case 'md': return 'w-1/2'
    case 'full': return 'w-full'
    default: return 'w-full'
  }
}

function getBorderStyle(style?: string): string {
  switch (style) {
    case 'dashed': return 'border-dashed'
    case 'dotted': return 'border-dotted'
    case 'gradient': return 'border-solid' // Gradient would need custom CSS
    default: return 'border-solid'
  }
}
