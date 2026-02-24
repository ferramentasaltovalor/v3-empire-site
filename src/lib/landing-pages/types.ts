// src/lib/landing-pages/types.ts
// TypeScript types for landing pages and sections

// ============================================================================
// Landing Page Status
// ============================================================================

export type LandingPageStatus = 'draft' | 'published'

// ============================================================================
// Section Types
// ============================================================================

export type SectionType = 
  | 'hero'
  | 'features'
  | 'testimonials'
  | 'cta'
  | 'form'
  | 'custom_html'
  | 'text'
  | 'image'
  | 'video'
  | 'divider'

// ============================================================================
// Base Section Interface
// ============================================================================

export interface BaseSection {
  id: string
  type: SectionType
  order: number
  visible: boolean
  className?: string
}

// ============================================================================
// Hero Section
// ============================================================================

export interface HeroSection extends BaseSection {
  type: 'hero'
  title: string
  subtitle?: string
  description?: string
  backgroundImage?: string
  backgroundColor?: string
  backgroundGradient?: string
  textColor?: 'light' | 'dark'
  alignment?: 'left' | 'center' | 'right'
  size?: 'sm' | 'md' | 'lg' | 'full'
  primaryCta?: {
    text: string
    href: string
    variant?: 'primary' | 'secondary' | 'outline'
  }
  secondaryCta?: {
    text: string
    href: string
    variant?: 'primary' | 'secondary' | 'outline'
  }
  overlay?: boolean
  overlayOpacity?: number
}

// ============================================================================
// Features Section
// ============================================================================

export interface FeatureItem {
  id: string
  title: string
  description?: string
  icon?: string
  imageUrl?: string
}

export interface FeaturesSection extends BaseSection {
  type: 'features'
  title?: string
  subtitle?: string
  columns?: 2 | 3 | 4
  features: FeatureItem[]
  style?: 'cards' | 'icons' | 'simple'
  backgroundColor?: string
}

// ============================================================================
// Testimonials Section
// ============================================================================

export interface TestimonialItem {
  id: string
  quote: string
  author: string
  role?: string
  company?: string
  avatarUrl?: string
  rating?: 1 | 2 | 3 | 4 | 5
}

export interface TestimonialsSection extends BaseSection {
  type: 'testimonials'
  title?: string
  subtitle?: string
  testimonials: TestimonialItem[]
  layout?: 'carousel' | 'grid' | 'masonry'
  columns?: 1 | 2 | 3
  backgroundColor?: string
  showRating?: boolean
}

// ============================================================================
// CTA Section
// ============================================================================

export interface CTASection extends BaseSection {
  type: 'cta'
  title: string
  description?: string
  buttonText: string
  buttonHref: string
  buttonVariant?: 'primary' | 'secondary' | 'outline'
  backgroundColor?: string
  backgroundGradient?: string
  textColor?: 'light' | 'dark'
  alignment?: 'left' | 'center' | 'right'
}

// ============================================================================
// Form Section
// ============================================================================

export interface FormField {
  id: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio'
  name: string
  label: string
  placeholder?: string
  required: boolean
  options?: Array<{ value: string; label: string }>
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
    message?: string
  }
}

export interface FormSection extends BaseSection {
  type: 'form'
  title?: string
  description?: string
  fields: FormField[]
  submitButtonText: string
  successMessage?: string
  errorMessage?: string
  conversionGoalId?: string
  backgroundColor?: string
  style?: 'boxed' | 'inline' | 'fullwidth'
  webhookUrl?: string
  redirectUrl?: string
}

// ============================================================================
// Custom HTML Section
// ============================================================================

export interface CustomHTMLSection extends BaseSection {
  type: 'custom_html'
  html: string
  sanitize?: boolean
}

// ============================================================================
// Text Section
// ============================================================================

export interface TextSection extends BaseSection {
  type: 'text'
  content: string // HTML content
  alignment?: 'left' | 'center' | 'right' | 'justify'
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  backgroundColor?: string
}

// ============================================================================
// Image Section
// ============================================================================

export interface ImageSection extends BaseSection {
  type: 'image'
  src: string
  alt: string
  caption?: string
  href?: string
  alignment?: 'left' | 'center' | 'right'
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  rounded?: boolean
  shadow?: boolean
}

// ============================================================================
// Video Section
// ============================================================================

export interface VideoSection extends BaseSection {
  type: 'video'
  src: string // URL to video
  provider?: 'youtube' | 'vimeo' | 'self'
  poster?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  aspectRatio?: '16:9' | '4:3' | '1:1' | '21:9'
}

// ============================================================================
// Divider Section
// ============================================================================

export interface DividerSection extends BaseSection {
  type: 'divider'
  style?: 'solid' | 'dashed' | 'dotted' | 'gradient'
  color?: string
  thickness?: 1 | 2 | 3 | 4
  width?: 'full' | 'md' | 'sm'
  margin?: 'sm' | 'md' | 'lg'
}

// ============================================================================
// Union Type for All Sections
// ============================================================================

export type LandingPageSection =
  | HeroSection
  | FeaturesSection
  | TestimonialsSection
  | CTASection
  | FormSection
  | CustomHTMLSection
  | TextSection
  | ImageSection
  | VideoSection
  | DividerSection

// ============================================================================
// Conversion Goals
// ============================================================================

export interface ConversionGoal {
  id: string
  name: string
  type: 'form_submit' | 'click' | 'scroll' | 'time_on_page'
  target?: string // CSS selector or percentage
  value?: number // Monetary value
}

// ============================================================================
// Landing Page (Database)
// ============================================================================

export interface LandingPage {
  id: string
  name: string
  slug: string
  status: LandingPageStatus
  sections: LandingPageSection[]
  cssCustom: string
  conversionGoals: ConversionGoal[]
  
  // SEO
  seoTitle: string | null
  seoDescription: string | null
  ogImageUrl: string | null
  
  // Integration
  customAnalyticsId: string | null
  webhookId: string | null
  
  // Metadata
  createdBy: string
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

// ============================================================================
// Landing Page Lead
// ============================================================================

export interface LandingPageLead {
  id: string
  landingPageId: string
  name: string | null
  email: string
  phone: string | null
  company: string | null
  message: string | null
  customFields: Record<string, unknown>
  
  // Tracking
  source: string | null
  medium: string | null
  campaign: string | null
  utmParams: Record<string, string>
  referrer: string | null
  userAgent: string | null
  ipAddress: string | null
  
  // Conversion tracking
  conversionGoalId: string | null
  convertedAt: string | null
  
  // Metadata
  createdAt: string
  updatedAt: string
}

// ============================================================================
// Landing Page List Item (for admin listing)
// ============================================================================

export interface LandingPageListItem {
  id: string
  name: string
  slug: string
  status: LandingPageStatus
  seoTitle: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  createdBy: string
  profiles?: {
    full_name: string | null
  } | null
  _count?: {
    leads: number
  }
}

// ============================================================================
// Form Submission Data
// ============================================================================

export interface FormSubmissionData {
  landingPageId: string
  sectionId: string
  fields: Record<string, string | boolean>
  utmParams?: Record<string, string>
  referrer?: string
  userAgent?: string
  ipAddress?: string
}

// ============================================================================
// Query Options
// ============================================================================

export interface GetLandingPagesOptions {
  status?: LandingPageStatus
  limit?: number
  offset?: number
  orderBy?: 'created_at' | 'updated_at' | 'name'
  orderDirection?: 'asc' | 'desc'
}

// ============================================================================
// Create/Update DTOs
// ============================================================================

export interface CreateLandingPageDTO {
  name: string
  slug: string
  status?: LandingPageStatus
  sections?: LandingPageSection[]
  cssCustom?: string
  conversionGoals?: ConversionGoal[]
  seoTitle?: string
  seoDescription?: string
  ogImageUrl?: string
  customAnalyticsId?: string
  webhookId?: string
}

export interface UpdateLandingPageDTO {
  name?: string
  slug?: string
  status?: LandingPageStatus
  sections?: LandingPageSection[]
  cssCustom?: string
  conversionGoals?: ConversionGoal[]
  seoTitle?: string
  seoDescription?: string
  ogImageUrl?: string
  customAnalyticsId?: string
  webhookId?: string
}
