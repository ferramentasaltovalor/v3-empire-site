'use client'

import { useCallback } from 'react'
import { SectionEditor } from '@/components/admin/landing-pages/SectionEditor'
import { updateLandingPageSections } from './actions'
import type { LandingPageSection } from '@/lib/landing-pages'

interface SectionEditorClientProps {
  landingPageId: string
  initialSections: LandingPageSection[]
}

export function SectionEditorClient({
  landingPageId,
  initialSections,
}: SectionEditorClientProps) {
  const handleSave = useCallback(
    async (sections: LandingPageSection[]) => {
      await updateLandingPageSections(landingPageId, sections)
    },
    [landingPageId]
  )

  return (
    <SectionEditor
      landingPageId={landingPageId}
      initialSections={initialSections}
      onSave={handleSave}
    />
  )
}
