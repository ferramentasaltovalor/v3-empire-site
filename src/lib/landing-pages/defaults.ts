// src/lib/landing-pages/defaults.ts
// Factory functions to create default sections

import type {
  SectionType,
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
} from './types'

function generateId(): string {
  return `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function createDefaultSection(
  type: SectionType,
  order: number
): LandingPageSection {
  switch (type) {
    case 'hero':
      return createDefaultHeroSection(order)
    case 'features':
      return createDefaultFeaturesSection(order)
    case 'testimonials':
      return createDefaultTestimonialsSection(order)
    case 'cta':
      return createDefaultCTASection(order)
    case 'form':
      return createDefaultFormSection(order)
    case 'custom_html':
      return createDefaultCustomHTMLSection(order)
    case 'text':
      return createDefaultTextSection(order)
    case 'image':
      return createDefaultImageSection(order)
    case 'video':
      return createDefaultVideoSection(order)
    case 'divider':
      return createDefaultDividerSection(order)
    default:
      throw new Error(`Unknown section type: ${type}`)
  }
}

function createDefaultHeroSection(order: number): HeroSection {
  return {
    id: generateId(),
    type: 'hero',
    order,
    visible: true,
    title: 'Título da Seção Hero',
    subtitle: 'Subtítulo atrativo',
    description: 'Descrição opcional que aparece abaixo do subtítulo.',
    alignment: 'center',
    size: 'lg',
    textColor: 'light',
    primaryCta: {
      text: 'Começar Agora',
      href: '#',
      variant: 'primary',
    },
    secondaryCta: {
      text: 'Saiba Mais',
      href: '#',
      variant: 'outline',
    },
    backgroundGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    overlay: true,
    overlayOpacity: 0.5,
  }
}

function createDefaultFeaturesSection(order: number): FeaturesSection {
  return {
    id: generateId(),
    type: 'features',
    order,
    visible: true,
    title: 'Nossos Recursos',
    subtitle: 'Descubra o que nos torna únicos',
    columns: 3,
    style: 'cards',
    features: [
      {
        id: `feature-${Date.now()}-1`,
        title: 'Recurso 1',
        description: 'Descrição do primeiro recurso.',
        icon: 'star',
      },
      {
        id: `feature-${Date.now()}-2`,
        title: 'Recurso 2',
        description: 'Descrição do segundo recurso.',
        icon: 'check',
      },
      {
        id: `feature-${Date.now()}-3`,
        title: 'Recurso 3',
        description: 'Descrição do terceiro recurso.',
        icon: 'zap',
      },
    ],
  }
}

function createDefaultTestimonialsSection(order: number): TestimonialsSection {
  return {
    id: generateId(),
    type: 'testimonials',
    order,
    visible: true,
    title: 'O que nossos clientes dizem',
    subtitle: 'Depoimentos reais de clientes satisfeitos',
    layout: 'grid',
    columns: 2,
    showRating: true,
    testimonials: [
      {
        id: `testimonial-${Date.now()}-1`,
        quote: 'Excelente produto! Recomendo para todos.',
        author: 'Maria Silva',
        role: 'CEO',
        company: 'Empresa ABC',
        rating: 5,
      },
      {
        id: `testimonial-${Date.now()}-2`,
        quote: 'Transformou a forma como trabalhamos.',
        author: 'João Santos',
        role: 'Diretor',
        company: 'Empresa XYZ',
        rating: 5,
      },
    ],
  }
}

function createDefaultCTASection(order: number): CTASection {
  return {
    id: generateId(),
    type: 'cta',
    order,
    visible: true,
    title: 'Pronto para começar?',
    description: 'Junte-se a milhares de clientes satisfeitos.',
    buttonText: 'Começar Agora',
    buttonHref: '#',
    buttonVariant: 'primary',
    backgroundGradient: 'linear-gradient(135deg, #b8860b 0%, #daa520 100%)',
    textColor: 'light',
    alignment: 'center',
  }
}

function createDefaultFormSection(order: number): FormSection {
  return {
    id: generateId(),
    type: 'form',
    order,
    visible: true,
    title: 'Entre em Contato',
    description: 'Preencha o formulário abaixo e entraremos em contato.',
    style: 'boxed',
    submitButtonText: 'Enviar',
    successMessage: 'Mensagem enviada com sucesso!',
    errorMessage: 'Erro ao enviar mensagem. Tente novamente.',
    fields: [
      {
        id: `field-${Date.now()}-name`,
        type: 'text',
        name: 'name',
        label: 'Nome',
        placeholder: 'Seu nome completo',
        required: true,
      },
      {
        id: `field-${Date.now()}-email`,
        type: 'email',
        name: 'email',
        label: 'E-mail',
        placeholder: 'seu@email.com',
        required: true,
      },
      {
        id: `field-${Date.now()}-message`,
        type: 'textarea',
        name: 'message',
        label: 'Mensagem',
        placeholder: 'Sua mensagem...',
        required: false,
      },
    ],
  }
}

function createDefaultCustomHTMLSection(order: number): CustomHTMLSection {
  return {
    id: generateId(),
    type: 'custom_html',
    order,
    visible: true,
    html: '<div class="p-4 bg-gray-100 rounded-lg text-center">\n  <p>Seu HTML personalizado aqui</p>\n</div>',
    sanitize: true,
  }
}

function createDefaultTextSection(order: number): TextSection {
  return {
    id: generateId(),
    type: 'text',
    order,
    visible: true,
    content: '<h2>Título da Seção</h2><p>Escreva seu conteúdo aqui. Você pode usar <strong>HTML</strong> para formatar o texto.</p>',
    alignment: 'left',
    maxWidth: 'lg',
  }
}

function createDefaultImageSection(order: number): ImageSection {
  return {
    id: generateId(),
    type: 'image',
    order,
    visible: true,
    src: '/images/placeholder.jpg',
    alt: 'Imagem descritiva',
    alignment: 'center',
    maxWidth: 'lg',
    rounded: true,
    shadow: true,
  }
}

function createDefaultVideoSection(order: number): VideoSection {
  return {
    id: generateId(),
    type: 'video',
    order,
    visible: true,
    src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    provider: 'youtube',
    controls: true,
    aspectRatio: '16:9',
  }
}

function createDefaultDividerSection(order: number): DividerSection {
  return {
    id: generateId(),
    type: 'divider',
    order,
    visible: true,
    style: 'solid',
    color: '#e5e7eb',
    thickness: 1,
    width: 'full',
    margin: 'md',
  }
}

// Helper function to get section type label
export function getSectionTypeLabel(type: SectionType): string {
  const labels: Record<SectionType, string> = {
    hero: 'Hero',
    features: 'Recursos',
    testimonials: 'Depoimentos',
    cta: 'CTA',
    form: 'Formulário',
    custom_html: 'HTML Personalizado',
    text: 'Texto',
    image: 'Imagem',
    video: 'Vídeo',
    divider: 'Divisor',
  }
  return labels[type] || type
}

// Helper function to get section type icon name
export function getSectionTypeIcon(type: SectionType): string {
  const icons: Record<SectionType, string> = {
    hero: 'layout',
    features: 'grid',
    testimonials: 'message-circle',
    cta: 'mouse-pointer-click',
    form: 'file-input',
    custom_html: 'code',
    text: 'type',
    image: 'image',
    video: 'video',
    divider: 'minus',
  }
  return icons[type] || 'box'
}
