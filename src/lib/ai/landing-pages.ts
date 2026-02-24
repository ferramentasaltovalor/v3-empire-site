// src/lib/ai/landing-pages.ts
// AI functions specifically for landing page content generation

import { createClient } from '@/lib/supabase/client'
import type { 
  SectionType, 
  LandingPageSection,
  HeroSection,
  FeaturesSection,
  TestimonialsSection,
  CTASection,
  FormSection,
  TextSection,
} from '@/lib/landing-pages'
import { 
  generateSectionId,
  generateFeatureId,
  generateTestimonialId,
  generateFieldId,
} from '@/lib/landing-pages'

// ============================================================================
// Types
// ============================================================================

export type LPTone = 'professional' | 'casual' | 'urgent' | 'luxury' | 'friendly'
export type LPGoal = 'lead_generation' | 'sales' | 'webinar' | 'product_launch' | 'brand_awareness'

export interface LPGenerationConfig {
  model?: string
  tone: LPTone
  goal: LPGoal
  productName?: string
  productDescription?: string
  targetAudience?: string
  keywords?: string[]
  customInstructions?: string
}

export interface TitleGenerationResult {
  titles: string[]
  usage: TokenUsage
}

export interface SectionContentResult {
  content: LandingPageSection
  usage: TokenUsage
}

export interface FullLPResult {
  sections: LandingPageSection[]
  seoTitle: string
  seoDescription: string
  usage: TokenUsage
}

export interface HeadlineVariants {
  headlines: Array<{
    text: string
    type: 'question' | 'statement' | 'how-to' | 'benefit' | 'fear'
  }>
  usage: TokenUsage
}

export interface CTASuggestions {
  suggestions: Array<{
    text: string
    urgency: 'low' | 'medium' | 'high'
    reasoning: string
  }>
  usage: TokenUsage
}

export interface SEOGenerationResult {
  title: string
  description: string
  keywords: string[]
  usage: TokenUsage
}

export interface ConversionOptimization {
  suggestions: Array<{
    section: string
    current: string
    suggested: string
    reasoning: string
    impact: 'low' | 'medium' | 'high'
  }>
  usage: TokenUsage
}

export interface TokenUsage {
  prompt: number
  completion: number
  total: number
}

// ============================================================================
// LP AI Functions
// ============================================================================

const supabase = createClient()

/**
 * Generate compelling LP titles based on product/service
 */
export async function generateLPTitle(
  config: LPGenerationConfig
): Promise<TitleGenerationResult> {
  const { data, error } = await supabase.functions.invoke('ai-lp-generate', {
    body: {
      action: 'generate_titles',
      config: {
        tone: config.tone,
        goal: config.goal,
        productName: config.productName,
        productDescription: config.productDescription,
        targetAudience: config.targetAudience,
        keywords: config.keywords,
        customInstructions: config.customInstructions,
      },
      model: config.model || 'anthropic/claude-sonnet-4',
    },
  })

  if (error) throw error
  return data
}

/**
 * Generate content for a specific section type
 */
export async function generateSectionContent(
  sectionType: SectionType,
  config: LPGenerationConfig,
  context?: {
    previousSections?: LandingPageSection[]
    lpTitle?: string
  }
): Promise<SectionContentResult> {
  const { data, error } = await supabase.functions.invoke('ai-lp-generate', {
    body: {
      action: 'generate_section',
      sectionType,
      config: {
        tone: config.tone,
        goal: config.goal,
        productName: config.productName,
        productDescription: config.productDescription,
        targetAudience: config.targetAudience,
        keywords: config.keywords,
        customInstructions: config.customInstructions,
      },
      context: context ? {
        previousSections: context.previousSections?.map(s => ({
          type: s.type,
          // Only include relevant fields for context
          ...(s.type === 'hero' && { title: (s as HeroSection).title }),
          ...(s.type === 'features' && { features: (s as FeaturesSection).features.map(f => f.title) }),
        })),
        lpTitle: context.lpTitle,
      } : undefined,
      model: config.model || 'anthropic/claude-sonnet-4',
    },
  })

  if (error) throw error
  
  // Transform the AI response into a proper section
  const section = transformAIResponseToSection(data.content, sectionType)
  
  return {
    content: section,
    usage: data.usage,
  }
}

/**
 * Generate a complete landing page from a prompt
 */
export async function generateFullLP(
  config: LPGenerationConfig & {
    sections?: SectionType[]
  }
): Promise<FullLPResult> {
  const { data, error } = await supabase.functions.invoke('ai-lp-generate', {
    body: {
      action: 'generate_full_lp',
      config: {
        tone: config.tone,
        goal: config.goal,
        productName: config.productName,
        productDescription: config.productDescription,
        targetAudience: config.targetAudience,
        keywords: config.keywords,
        customInstructions: config.customInstructions,
      },
      sections: config.sections || ['hero', 'features', 'testimonials', 'cta', 'form'],
      model: config.model || 'anthropic/claude-sonnet-4',
    },
  })

  if (error) throw error

  // Transform all sections
  const sections = data.sections.map((s: { type: SectionType; content: Record<string, unknown> }, index: number) => {
    const section = transformAIResponseToSection(s.content, s.type)
    section.order = index
    return section
  })

  return {
    sections,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    usage: data.usage,
  }
}

/**
 * Generate A/B test headline variants
 */
export async function generateHeadlineVariants(
  baseHeadline: string,
  config: LPGenerationConfig,
  count: number = 5
): Promise<HeadlineVariants> {
  const { data, error } = await supabase.functions.invoke('ai-lp-generate', {
    body: {
      action: 'generate_headlines',
      baseHeadline,
      count,
      config: {
        tone: config.tone,
        goal: config.goal,
        targetAudience: config.targetAudience,
      },
      model: config.model || 'anthropic/claude-sonnet-4',
    },
  })

  if (error) throw error
  return data
}

/**
 * Generate optimized CTA text suggestions
 */
export async function generateCTASuggestions(
  context: {
    sectionType: string
    buttonText?: string
    headline?: string
    description?: string
  },
  config: LPGenerationConfig
): Promise<CTASuggestions> {
  const { data, error } = await supabase.functions.invoke('ai-lp-generate', {
    body: {
      action: 'generate_ctas',
      context,
      config: {
        tone: config.tone,
        goal: config.goal,
        productName: config.productName,
      },
      model: config.model || 'anthropic/claude-sonnet-4',
    },
  })

  if (error) throw error
  return data
}

/**
 * Generate SEO meta title and description
 */
export async function generateSEOMeta(
  lpName: string,
  sections: LandingPageSection[],
  config: LPGenerationConfig
): Promise<SEOGenerationResult> {
  // Extract text content from sections for SEO analysis
  const content = extractTextFromSections(sections)
  
  const { data, error } = await supabase.functions.invoke('ai-lp-generate', {
    body: {
      action: 'generate_seo',
      lpName,
      content,
      config: {
        keywords: config.keywords,
        targetAudience: config.targetAudience,
      },
      model: config.model || 'anthropic/claude-sonnet-4',
    },
  })

  if (error) throw error
  return data
}

/**
 * Get AI suggestions for conversion rate optimization
 */
export async function optimizeForConversion(
  sections: LandingPageSection[],
  config: LPGenerationConfig
): Promise<ConversionOptimization> {
  const { data, error } = await supabase.functions.invoke('ai-lp-generate', {
    body: {
      action: 'optimize_conversion',
      sections: sections.map(s => ({
        id: s.id,
        type: s.type,
        content: extractSectionContent(s),
      })),
      config: {
        tone: config.tone,
        goal: config.goal,
        targetAudience: config.targetAudience,
      },
      model: config.model || 'anthropic/claude-sonnet-4',
    },
  })

  if (error) throw error
  return data
}

/**
 * Stream section content generation for better UX
 */
export async function* streamSectionContent(
  sectionType: SectionType,
  config: LPGenerationConfig,
  onToken?: (token: string) => void
): AsyncGenerator<string, SectionContentResult, unknown> {
  // For now, this uses the non-streaming version
  // In production, you'd implement actual streaming with SSE
  const result = await generateSectionContent(sectionType, config)
  
  // Simulate streaming by yielding chunks
  const content = JSON.stringify(result.content)
  const chunkSize = 50
  
  for (let i = 0; i < content.length; i += chunkSize) {
    const chunk = content.slice(i, i + chunkSize)
    onToken?.(chunk)
    yield chunk
  }
  
  return result
}

// ============================================================================
// Helper Functions
// ============================================================================

function transformAIResponseToSection(
  aiContent: Record<string, unknown>,
  sectionType: SectionType
): LandingPageSection {
  const baseId = generateSectionId()
  
  switch (sectionType) {
    case 'hero':
      return {
        id: baseId,
        type: 'hero',
        order: 0,
        visible: true,
        title: (aiContent.title as string) || '',
        subtitle: aiContent.subtitle as string,
        description: aiContent.description as string,
        primaryCta: aiContent.primaryCta as HeroSection['primaryCta'],
        secondaryCta: aiContent.secondaryCta as HeroSection['secondaryCta'],
        alignment: (aiContent.alignment as HeroSection['alignment']) || 'center',
        textColor: (aiContent.textColor as HeroSection['textColor']) || 'light',
        size: (aiContent.size as HeroSection['size']) || 'lg',
      } as HeroSection
      
    case 'features':
      return {
        id: baseId,
        type: 'features',
        order: 0,
        visible: true,
        title: aiContent.title as string,
        subtitle: aiContent.subtitle as string,
        columns: (aiContent.columns as FeaturesSection['columns']) || 3,
        features: ((aiContent.features as Array<{ title: string; description?: string; icon?: string }>) || []).map(f => ({
          id: generateFeatureId(),
          title: f.title,
          description: f.description,
          icon: f.icon,
        })),
        style: (aiContent.style as FeaturesSection['style']) || 'icons',
      } as FeaturesSection
      
    case 'testimonials':
      return {
        id: baseId,
        type: 'testimonials',
        order: 0,
        visible: true,
        title: aiContent.title as string,
        subtitle: aiContent.subtitle as string,
        layout: (aiContent.layout as TestimonialsSection['layout']) || 'carousel',
        testimonials: ((aiContent.testimonials as Array<{ quote: string; author: string; role?: string; company?: string }>) || []).map(t => ({
          id: generateTestimonialId(),
          quote: t.quote,
          author: t.author,
          role: t.role,
          company: t.company,
          rating: 5,
        })),
        showRating: true,
      } as TestimonialsSection
      
    case 'cta':
      return {
        id: baseId,
        type: 'cta',
        order: 0,
        visible: true,
        title: (aiContent.title as string) || '',
        description: aiContent.description as string,
        buttonText: (aiContent.buttonText as string) || 'Saiba Mais',
        buttonHref: (aiContent.buttonHref as string) || '#',
        buttonVariant: (aiContent.buttonVariant as CTASection['buttonVariant']) || 'primary',
        alignment: (aiContent.alignment as CTASection['alignment']) || 'center',
      } as CTASection
      
    case 'form':
      return {
        id: baseId,
        type: 'form',
        order: 0,
        visible: true,
        title: aiContent.title as string,
        description: aiContent.description as string,
        submitButtonText: (aiContent.submitButtonText as string) || 'Enviar',
        successMessage: aiContent.successMessage as string,
        fields: ((aiContent.fields as Array<{ type: string; name: string; label: string; required: boolean }>) || [
          { type: 'text', name: 'name', label: 'Nome', required: true },
          { type: 'email', name: 'email', label: 'E-mail', required: true },
        ]).map(f => ({
          id: generateFieldId(),
          type: f.type as FormField['type'],
          name: f.name,
          label: f.label,
          required: f.required,
        })),
        style: 'boxed',
      } as FormSection
      
    case 'text':
      return {
        id: baseId,
        type: 'text',
        order: 0,
        visible: true,
        content: (aiContent.content as string) || '',
        alignment: (aiContent.alignment as TextSection['alignment']) || 'left',
      } as TextSection
      
    case 'image':
      return {
        id: baseId,
        type: 'image',
        order: 0,
        visible: true,
        src: (aiContent.src as string) || '',
        alt: (aiContent.alt as string) || '',
        caption: aiContent.caption as string,
      }
      
    case 'video':
      return {
        id: baseId,
        type: 'video',
        order: 0,
        visible: true,
        src: (aiContent.src as string) || '',
        provider: (aiContent.provider as 'youtube' | 'vimeo' | 'self') || 'youtube',
      }
      
    case 'divider':
      return {
        id: baseId,
        type: 'divider',
        order: 0,
        visible: true,
        style: 'solid',
      }
      
    case 'custom_html':
      return {
        id: baseId,
        type: 'custom_html',
        order: 0,
        visible: true,
        html: (aiContent.html as string) || '',
      }
      
    default:
      throw new Error(`Unknown section type: ${sectionType}`)
  }
}

interface FormField {
  id: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio'
  name: string
  label: string
  required: boolean
}

function extractTextFromSections(sections: LandingPageSection[]): string {
  const texts: string[] = []
  
  for (const section of sections) {
    switch (section.type) {
      case 'hero':
        texts.push((section as HeroSection).title)
        if ((section as HeroSection).subtitle) texts.push((section as HeroSection).subtitle!)
        if ((section as HeroSection).description) texts.push((section as HeroSection).description!)
        break
      case 'features':
        if ((section as FeaturesSection).title) texts.push((section as FeaturesSection).title!)
        for (const f of (section as FeaturesSection).features) {
          texts.push(f.title)
          if (f.description) texts.push(f.description)
        }
        break
      case 'testimonials':
        if ((section as TestimonialsSection).title) texts.push((section as TestimonialsSection).title!)
        for (const t of (section as TestimonialsSection).testimonials) {
          texts.push(t.quote)
        }
        break
      case 'cta':
        texts.push((section as CTASection).title)
        if ((section as CTASection).description) texts.push((section as CTASection).description!)
        break
      case 'text':
        // Strip HTML tags for text content
        texts.push((section as TextSection).content.replace(/<[^>]*>/g, ' '))
        break
    }
  }
  
  return texts.join(' ').slice(0, 3000) // Limit for API
}

function extractSectionContent(section: LandingPageSection): Record<string, unknown> {
  switch (section.type) {
    case 'hero':
      return {
        title: (section as HeroSection).title,
        subtitle: (section as HeroSection).subtitle,
        description: (section as HeroSection).description,
        primaryCta: (section as HeroSection).primaryCta,
      }
    case 'features':
      return {
        title: (section as FeaturesSection).title,
        features: (section as FeaturesSection).features,
      }
    case 'testimonials':
      return {
        title: (section as TestimonialsSection).title,
        testimonials: (section as TestimonialsSection).testimonials,
      }
    case 'cta':
      return {
        title: (section as CTASection).title,
        description: (section as CTASection).description,
        buttonText: (section as CTASection).buttonText,
      }
    case 'form':
      return {
        title: (section as FormSection).title,
        fields: (section as FormSection).fields,
      }
    default:
      return { type: section.type }
  }
}

// ============================================================================
// Default Export
// ============================================================================

export const lpAI = {
  generateLPTitle,
  generateSectionContent,
  generateFullLP,
  generateHeadlineVariants,
  generateCTASuggestions,
  generateSEOMeta,
  optimizeForConversion,
  streamSectionContent,
}
