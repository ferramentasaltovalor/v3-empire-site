'use client'

import dynamic from 'next/dynamic'
import type { LandingPageSection } from '@/lib/landing-pages'

// Dynamic import to avoid SSR issues with sections that use browser APIs
const SectionRenderer = dynamic(
  () => import('@/components/landing-pages/sections/SectionRenderer').then(mod => mod.SectionRenderer || mod),
  { ssr: false }
)

interface SectionPreviewProps {
  sections: LandingPageSection[]
  landingPageId: string
}

export function SectionPreview({ sections, landingPageId }: SectionPreviewProps) {
  if (sections.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-400">
        <div className="text-center">
          <p className="text-lg mb-2">Nenhuma seção visível</p>
          <p className="text-sm">Adicione seções ou torne-as visíveis para visualizar</p>
        </div>
      </div>
    )
  }

  return (
    <div className="landing-page-preview">
      {sections
        .sort((a, b) => a.order - b.order)
        .map((section) => (
          <div key={section.id} className="section-wrapper">
            <SectionRenderer section={section} landingPageId={landingPageId} />
          </div>
        ))}
    </div>
  )
}
