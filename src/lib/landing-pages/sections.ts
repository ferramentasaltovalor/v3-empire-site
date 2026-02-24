// src/lib/landing-pages/sections.ts
// Section type definitions, helpers, and default configurations

import type {
  BaseSection,
  LandingPageSection,
  HeroSection,
  FeaturesSection,
  TestimonialsSection,
  CTASection,
  FormSection,
  CustomHTMLSection,
  TextSection,
  ImageSection,
  VideoSection,
  DividerSection,
  SectionType,
  FeatureItem,
  TestimonialItem,
  FormField,
} from './types'

// ============================================================================
// Section Type Guards
// ============================================================================

export function isHeroSection(section: LandingPageSection): section is HeroSection {
  return section.type === 'hero'
}

export function isFeaturesSection(section: LandingPageSection): section is FeaturesSection {
  return section.type === 'features'
}

export function isTestimonialsSection(section: LandingPageSection): section is TestimonialsSection {
  return section.type === 'testimonials'
}

export function isCTASection(section: LandingPageSection): section is CTASection {
  return section.type === 'cta'
}

export function isFormSection(section: LandingPageSection): section is FormSection {
  return section.type === 'form'
}

export function isCustomHTMLSection(section: LandingPageSection): section is CustomHTMLSection {
  return section.type === 'custom_html'
}

export function isTextSection(section: LandingPageSection): section is TextSection {
  return section.type === 'text'
}

export function isImageSection(section: LandingPageSection): section is ImageSection {
  return section.type === 'image'
}

export function isVideoSection(section: LandingPageSection): section is VideoSection {
  return section.type === 'video'
}

export function isDividerSection(section: LandingPageSection): section is DividerSection {
  return section.type === 'divider'
}

// ============================================================================
// ID Generation
// ============================================================================

export function generateSectionId(): string {
  return `section_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export function generateFeatureId(): string {
  return `feature_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export function generateTestimonialId(): string {
  return `testimonial_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export function generateFieldId(): string {
  return `field_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// ============================================================================
// Default Section Factories
// ============================================================================

export function createDefaultHeroSection(order: number = 0): HeroSection {
  return {
    id: generateSectionId(),
    type: 'hero',
    order,
    visible: true,
    title: 'Título da Seção Hero',
    subtitle: 'Subtítulo atrativo para sua landing page',
    alignment: 'center',
    size: 'lg',
    textColor: 'light',
    overlay: true,
    overlayOpacity: 0.5,
    primaryCta: {
      text: 'Começar Agora',
      href: '#',
      variant: 'primary',
    },
  }
}

export function createDefaultFeaturesSection(order: number = 0): FeaturesSection {
  return {
    id: generateSectionId(),
    type: 'features',
    order,
    visible: true,
    title: 'Nossos Diferenciais',
    columns: 3,
    style: 'icons',
    features: [
      {
        id: generateFeatureId(),
        title: 'Recurso 1',
        description: 'Descrição do primeiro recurso',
      },
      {
        id: generateFeatureId(),
        title: 'Recurso 2',
        description: 'Descrição do segundo recurso',
      },
      {
        id: generateFeatureId(),
        title: 'Recurso 3',
        description: 'Descrição do terceiro recurso',
      },
    ],
  }
}

export function createDefaultTestimonialsSection(order: number = 0): TestimonialsSection {
  return {
    id: generateSectionId(),
    type: 'testimonials',
    order,
    visible: true,
    title: 'O que nossos clientes dizem',
    layout: 'grid',
    columns: 2,
    showRating: true,
    testimonials: [
      {
        id: generateTestimonialId(),
        quote: 'Excelente produto! Recomendo para todos.',
        author: 'Maria Silva',
        role: 'CEO',
        company: 'Empresa ABC',
        rating: 5,
      },
      {
        id: generateTestimonialId(),
        quote: 'Transformou nossa forma de trabalhar.',
        author: 'João Santos',
        role: 'Diretor',
        company: 'Empresa XYZ',
        rating: 5,
      },
    ],
  }
}

export function createDefaultCTASection(order: number = 0): CTASection {
  return {
    id: generateSectionId(),
    type: 'cta',
    order,
    visible: true,
    title: 'Pronto para começar?',
    description: 'Junte-se a milhares de clientes satisfeitos',
    buttonText: 'Fale Conosco',
    buttonHref: '#',
    buttonVariant: 'primary',
    alignment: 'center',
    textColor: 'light',
  }
}

export function createDefaultFormSection(order: number = 0): FormSection {
  return {
    id: generateSectionId(),
    type: 'form',
    order,
    visible: true,
    title: 'Entre em Contato',
    description: 'Preencha o formulário abaixo',
    style: 'boxed',
    fields: [
      {
        id: generateFieldId(),
        type: 'text',
        name: 'name',
        label: 'Nome',
        placeholder: 'Seu nome completo',
        required: true,
      },
      {
        id: generateFieldId(),
        type: 'email',
        name: 'email',
        label: 'E-mail',
        placeholder: 'seu@email.com',
        required: true,
      },
      {
        id: generateFieldId(),
        type: 'tel',
        name: 'phone',
        label: 'Telefone',
        placeholder: '(00) 00000-0000',
        required: false,
      },
      {
        id: generateFieldId(),
        type: 'textarea',
        name: 'message',
        label: 'Mensagem',
        placeholder: 'Sua mensagem...',
        required: false,
      },
    ],
    submitButtonText: 'Enviar',
    successMessage: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
    errorMessage: 'Erro ao enviar mensagem. Tente novamente.',
  }
}

export function createDefaultCustomHTMLSection(order: number = 0): CustomHTMLSection {
  return {
    id: generateSectionId(),
    type: 'custom_html',
    order,
    visible: true,
    html: '<div class="custom-content">\n  <!-- Seu HTML personalizado aqui -->\n</div>',
    sanitize: true,
  }
}

export function createDefaultTextSection(order: number = 0): TextSection {
  return {
    id: generateSectionId(),
    type: 'text',
    order,
    visible: true,
    content: '<p>Adicione seu conteúdo de texto aqui.</p>',
    alignment: 'left',
    maxWidth: 'md',
  }
}

export function createDefaultImageSection(order: number = 0): ImageSection {
  return {
    id: generateSectionId(),
    type: 'image',
    order,
    visible: true,
    src: '/images/placeholder.jpg',
    alt: 'Imagem descritiva',
    alignment: 'center',
    maxWidth: 'lg',
    rounded: false,
    shadow: true,
  }
}

export function createDefaultVideoSection(order: number = 0): VideoSection {
  return {
    id: generateSectionId(),
    type: 'video',
    order,
    visible: true,
    src: '',
    provider: 'youtube',
    controls: true,
    aspectRatio: '16:9',
  }
}

export function createDefaultDividerSection(order: number = 0): DividerSection {
  return {
    id: generateSectionId(),
    type: 'divider',
    order,
    visible: true,
    style: 'solid',
    width: 'full',
    margin: 'md',
  }
}

// ============================================================================
// Section Factory Map
// ============================================================================

const sectionFactories: Record<SectionType, (order: number) => LandingPageSection> = {
  hero: createDefaultHeroSection,
  features: createDefaultFeaturesSection,
  testimonials: createDefaultTestimonialsSection,
  cta: createDefaultCTASection,
  form: createDefaultFormSection,
  custom_html: createDefaultCustomHTMLSection,
  text: createDefaultTextSection,
  image: createDefaultImageSection,
  video: createDefaultVideoSection,
  divider: createDefaultDividerSection,
}

export function createDefaultSection(type: SectionType, order: number = 0): LandingPageSection {
  const factory = sectionFactories[type]
  if (!factory) {
    throw new Error(`Unknown section type: ${type}`)
  }
  return factory(order)
}

// ============================================================================
// Section Metadata
// ============================================================================

export interface SectionMetadata {
  type: SectionType
  name: string
  description: string
  icon: string
  category: 'content' | 'media' | 'conversion' | 'layout'
}

export const sectionMetadata: Record<SectionType, SectionMetadata> = {
  hero: {
    type: 'hero',
    name: 'Hero',
    description: 'Seção de destaque com título, subtítulo e CTAs',
    icon: 'hero',
    category: 'content',
  },
  features: {
    type: 'features',
    name: 'Recursos',
    description: 'Grade de recursos ou diferenciais',
    icon: 'grid',
    category: 'content',
  },
  testimonials: {
    type: 'testimonials',
    name: 'Depoimentos',
    description: 'Avaliações e depoimentos de clientes',
    icon: 'quote',
    category: 'content',
  },
  cta: {
    type: 'cta',
    name: 'Chamada para Ação',
    description: 'Seção de CTA destacada',
    icon: 'mouse-pointer-click',
    category: 'conversion',
  },
  form: {
    type: 'form',
    name: 'Formulário',
    description: 'Formulário de captura de leads',
    icon: 'form',
    category: 'conversion',
  },
  custom_html: {
    type: 'custom_html',
    name: 'HTML Personalizado',
    description: 'Seção com HTML customizado',
    icon: 'code',
    category: 'content',
  },
  text: {
    type: 'text',
    name: 'Texto',
    description: 'Bloco de texto rico',
    icon: 'text',
    category: 'content',
  },
  image: {
    type: 'image',
    name: 'Imagem',
    description: 'Imagem com legenda opcional',
    icon: 'image',
    category: 'media',
  },
  video: {
    type: 'video',
    name: 'Vídeo',
    description: 'Player de vídeo (YouTube, Vimeo, etc)',
    icon: 'video',
    category: 'media',
  },
  divider: {
    type: 'divider',
    name: 'Divisor',
    description: 'Linha divisória entre seções',
    icon: 'minus',
    category: 'layout',
  },
}

export function getSectionTypesByCategory(category: SectionMetadata['category']): SectionType[] {
  return Object.values(sectionMetadata)
    .filter((meta) => meta.category === category)
    .map((meta) => meta.type)
}

// ============================================================================
// Section Helpers
// ============================================================================

/**
 * Sort sections by order
 */
export function sortSections(sections: LandingPageSection[]): LandingPageSection[] {
  return [...sections].sort((a, b) => a.order - b.order)
}

/**
 * Reorder sections after insertion/deletion
 */
export function reorderSections(sections: LandingPageSection[]): LandingPageSection[] {
  return sortSections(sections).map((section, index) => ({
    ...section,
    order: index,
  }))
}

/**
 * Insert a section at a specific position
 */
export function insertSection(
  sections: LandingPageSection[],
  newSection: LandingPageSection,
  position: number
): LandingPageSection[] {
  const sorted = sortSections(sections)
  const insertIndex = Math.min(position, sorted.length)
  sorted.splice(insertIndex, 0, newSection)
  return reorderSections(sorted)
}

/**
 * Remove a section by ID
 */
export function removeSection(
  sections: LandingPageSection[],
  sectionId: string
): LandingPageSection[] {
  return reorderSections(sections.filter((s) => s.id !== sectionId))
}

/**
 * Move a section to a new position
 */
export function moveSection(
  sections: LandingPageSection[],
  sectionId: string,
  newPosition: number
): LandingPageSection[] {
  const sorted = sortSections(sections)
  const currentIndex = sorted.findIndex((s) => s.id === sectionId)
  
  if (currentIndex === -1) return sections
  
  const [section] = sorted.splice(currentIndex, 1)
  const insertIndex = Math.min(newPosition, sorted.length)
  sorted.splice(insertIndex, 0, section)
  
  return reorderSections(sorted)
}

/**
 * Update a section by ID
 */
export function updateSection<T extends LandingPageSection>(
  sections: LandingPageSection[],
  sectionId: string,
  updates: Partial<T>
): LandingPageSection[] {
  return sections.map((section) =>
    section.id === sectionId
      ? { ...section, ...updates } as LandingPageSection
      : section
  )
}

/**
 * Duplicate a section
 */
export function duplicateSection(
  sections: LandingPageSection[],
  sectionId: string
): LandingPageSection[] {
  const sectionIndex = sections.findIndex((s) => s.id === sectionId)
  if (sectionIndex === -1) return sections
  
  const section = sections[sectionIndex]
  const newSection = {
    ...section,
    id: generateSectionId(),
  }
  
  return insertSection(sections, newSection, sectionIndex + 1)
}

/**
 * Get visible sections only
 */
export function getVisibleSections(sections: LandingPageSection[]): LandingPageSection[] {
  return sortSections(sections.filter((s) => s.visible))
}

// ============================================================================
// Feature Helpers
// ============================================================================

export function addFeature(
  section: FeaturesSection,
  feature?: Partial<FeatureItem>
): FeaturesSection {
  return {
    ...section,
    features: [
      ...section.features,
      {
        id: generateFeatureId(),
        title: feature?.title || 'Novo Recurso',
        description: feature?.description,
        icon: feature?.icon,
        imageUrl: feature?.imageUrl,
      },
    ],
  }
}

export function removeFeature(section: FeaturesSection, featureId: string): FeaturesSection {
  return {
    ...section,
    features: section.features.filter((f) => f.id !== featureId),
  }
}

export function updateFeature(
  section: FeaturesSection,
  featureId: string,
  updates: Partial<FeatureItem>
): FeaturesSection {
  return {
    ...section,
    features: section.features.map((f) =>
      f.id === featureId ? { ...f, ...updates } : f
    ),
  }
}

// ============================================================================
// Testimonial Helpers
// ============================================================================

export function addTestimonial(
  section: TestimonialsSection,
  testimonial?: Partial<TestimonialItem>
): TestimonialsSection {
  return {
    ...section,
    testimonials: [
      ...section.testimonials,
      {
        id: generateTestimonialId(),
        quote: testimonial?.quote || 'Novo depoimento',
        author: testimonial?.author || 'Nome do Cliente',
        role: testimonial?.role,
        company: testimonial?.company,
        avatarUrl: testimonial?.avatarUrl,
        rating: testimonial?.rating,
      },
    ],
  }
}

export function removeTestimonial(
  section: TestimonialsSection,
  testimonialId: string
): TestimonialsSection {
  return {
    ...section,
    testimonials: section.testimonials.filter((t) => t.id !== testimonialId),
  }
}

export function updateTestimonial(
  section: TestimonialsSection,
  testimonialId: string,
  updates: Partial<TestimonialItem>
): TestimonialsSection {
  return {
    ...section,
    testimonials: section.testimonials.map((t) =>
      t.id === testimonialId ? { ...t, ...updates } : t
    ),
  }
}

// ============================================================================
// Form Field Helpers
// ============================================================================

export function addField(section: FormSection, field?: Partial<FormField>): FormSection {
  return {
    ...section,
    fields: [
      ...section.fields,
      {
        id: generateFieldId(),
        type: field?.type || 'text',
        name: field?.name || `field_${section.fields.length + 1}`,
        label: field?.label || 'Novo Campo',
        placeholder: field?.placeholder,
        required: field?.required ?? false,
        options: field?.options,
        validation: field?.validation,
      },
    ],
  }
}

export function removeField(section: FormSection, fieldId: string): FormSection {
  return {
    ...section,
    fields: section.fields.filter((f) => f.id !== fieldId),
  }
}

export function updateField(
  section: FormSection,
  fieldId: string,
  updates: Partial<FormField>
): FormSection {
  return {
    ...section,
    fields: section.fields.map((f) =>
      f.id === fieldId ? { ...f, ...updates } : f
    ),
  }
}

// ============================================================================
// Export All Types
// ============================================================================

export type {
  BaseSection,
  LandingPageSection,
  HeroSection,
  FeaturesSection,
  TestimonialsSection,
  CTASection,
  FormSection,
  CustomHTMLSection,
  TextSection,
  ImageSection,
  VideoSection,
  DividerSection,
  SectionType,
}
