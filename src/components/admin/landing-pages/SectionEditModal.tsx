'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { HeroSectionForm } from './SectionEditForms/HeroSectionForm'
import { FeaturesSectionForm } from './SectionEditForms/FeaturesSectionForm'
import { TestimonialsSectionForm } from './SectionEditForms/TestimonialsSectionForm'
import { CTASectionForm } from './SectionEditForms/CTASectionForm'
import { FormSectionForm } from './SectionEditForms/FormSectionForm'
import { CustomHTMLSectionForm } from './SectionEditForms/CustomHTMLSectionForm'
import { TextSectionForm } from './SectionEditForms/TextSectionForm'
import { ImageSectionForm } from './SectionEditForms/ImageSectionForm'
import { VideoSectionForm } from './SectionEditForms/VideoSectionForm'
import { DividerSectionForm } from './SectionEditForms/DividerSectionForm'
import type { LandingPageSection } from '@/lib/landing-pages'

interface SectionEditModalProps {
  section: LandingPageSection
  isOpen: boolean
  onClose: () => void
  onSave: (section: LandingPageSection) => void
}

export function SectionEditModal({
  section,
  isOpen,
  onClose,
  onSave,
}: SectionEditModalProps) {
  const [editedSection, setEditedSection] = useState<LandingPageSection>(section)

  // Reset form when section changes
  useEffect(() => {
    setEditedSection(section)
  }, [section])

  const handleSave = () => {
    onSave(editedSection)
  }

  const renderForm = () => {
    switch (editedSection.type) {
      case 'hero':
        return (
          <HeroSectionForm
            section={editedSection}
            onChange={setEditedSection}
          />
        )
      case 'features':
        return (
          <FeaturesSectionForm
            section={editedSection}
            onChange={setEditedSection}
          />
        )
      case 'testimonials':
        return (
          <TestimonialsSectionForm
            section={editedSection}
            onChange={setEditedSection}
          />
        )
      case 'cta':
        return (
          <CTASectionForm
            section={editedSection}
            onChange={setEditedSection}
          />
        )
      case 'form':
        return (
          <FormSectionForm
            section={editedSection}
            onChange={setEditedSection}
          />
        )
      case 'custom_html':
        return (
          <CustomHTMLSectionForm
            section={editedSection}
            onChange={setEditedSection}
          />
        )
      case 'text':
        return (
          <TextSectionForm
            section={editedSection}
            onChange={setEditedSection}
          />
        )
      case 'image':
        return (
          <ImageSectionForm
            section={editedSection}
            onChange={setEditedSection}
          />
        )
      case 'video':
        return (
          <VideoSectionForm
            section={editedSection}
            onChange={setEditedSection}
          />
        )
      case 'divider':
        return (
          <DividerSectionForm
            section={editedSection}
            onChange={setEditedSection}
          />
        )
      default:
        return <p>Tipo de seção não suportado</p>
    }
  }

  const getSectionTitle = () => {
    const titles: Record<string, string> = {
      hero: 'Seção Hero',
      features: 'Seção de Recursos',
      testimonials: 'Seção de Depoimentos',
      cta: 'Seção CTA',
      form: 'Seção de Formulário',
      custom_html: 'HTML Personalizado',
      text: 'Seção de Texto',
      image: 'Seção de Imagem',
      video: 'Seção de Vídeo',
      divider: 'Divisor',
    }
    return titles[editedSection.type] || 'Editar Seção'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{getSectionTitle()}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 max-h-[60vh] pr-4">
          {renderForm()}
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="premium" onClick={handleSave}>
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
