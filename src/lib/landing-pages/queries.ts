// src/lib/landing-pages/queries.ts
// Database queries for landing pages — Server-side only

import { createClient } from '@/lib/supabase/server'
import type {
  LandingPage,
  LandingPageListItem,
  LandingPageLead,
  LandingPageSection,
  ConversionGoal,
  GetLandingPagesOptions,
  CreateLandingPageDTO,
  UpdateLandingPageDTO,
  FormSubmissionData,
} from './types'

// ============================================================================
// Helper Functions
// ============================================================================

function dbToLandingPage(row: Record<string, unknown>): LandingPage {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    status: row.status as 'draft' | 'published',
    sections: (row.sections as LandingPageSection[]) || [],
    cssCustom: (row.css_custom as string) || '',
    conversionGoals: (row.conversion_goals as ConversionGoal[]) || [],
    seoTitle: row.seo_title as string | null,
    seoDescription: row.seo_description as string | null,
    ogImageUrl: row.og_image_url as string | null,
    customAnalyticsId: row.custom_analytics_id as string | null,
    webhookId: row.webhook_id as string | null,
    createdBy: row.created_by as string,
    publishedAt: row.published_at as string | null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    deletedAt: row.deleted_at as string | null,
  }
}

function dbToLandingPageListItem(row: Record<string, unknown>): LandingPageListItem {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    status: row.status as 'draft' | 'published',
    seoTitle: row.seo_title as string | null,
    publishedAt: row.published_at as string | null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    createdBy: row.created_by as string,
    profiles: row.profiles as { full_name: string | null } | null,
    _count: row._count as { leads: number } | undefined,
  }
}

function dbToLead(row: Record<string, unknown>): LandingPageLead {
  return {
    id: row.id as string,
    landingPageId: row.landing_page_id as string,
    name: row.name as string | null,
    email: row.email as string,
    phone: row.phone as string | null,
    company: row.company as string | null,
    message: row.message as string | null,
    customFields: (row.custom_fields as Record<string, unknown>) || {},
    source: row.source as string | null,
    medium: row.medium as string | null,
    campaign: row.campaign as string | null,
    utmParams: (row.utm_params as Record<string, string>) || {},
    referrer: row.referrer as string | null,
    userAgent: row.user_agent as string | null,
    ipAddress: row.ip_address as string | null,
    conversionGoalId: row.conversion_goal_id as string | null,
    convertedAt: row.converted_at as string | null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

// ============================================================================
// Landing Pages CRUD
// ============================================================================

/**
 * Get all landing pages (admin view - includes drafts)
 */
export async function getLandingPages(
  options: GetLandingPagesOptions = {}
): Promise<{ data: LandingPageListItem[]; total: number }> {
  const supabase = await createClient()
  
  const {
    status,
    limit = 20,
    offset = 0,
    orderBy = 'updated_at',
    orderDirection = 'desc',
  } = options

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from('landing_pages')
    .select(`
      id,
      name,
      slug,
      status,
      seo_title,
      published_at,
      created_at,
      updated_at,
      created_by,
      profiles:created_by (full_name)
    `, { count: 'exact' })
    .is('deleted_at', null)
    .order(orderBy, { ascending: orderDirection === 'asc' })
    .range(offset, offset + limit - 1)

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching landing pages:', error)
    throw new Error(`Failed to fetch landing pages: ${error.message}`)
  }

  return {
    data: (data || []).map(dbToLandingPageListItem),
    total: count || 0,
  }
}

/**
 * Get a single landing page by ID
 */
export async function getLandingPageById(id: string): Promise<LandingPage | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching landing page:', error)
    throw new Error(`Failed to fetch landing page: ${error.message}`)
  }

  return data ? dbToLandingPage(data) : null
}

/**
 * Get a landing page by slug (public view - only published)
 */
export async function getLandingPageBySlug(slug: string): Promise<LandingPage | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .is('deleted_at', null)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching landing page by slug:', error)
    throw new Error(`Failed to fetch landing page: ${error.message}`)
  }

  return data ? dbToLandingPage(data) : null
}

/**
 * Create a new landing page
 */
export async function createLandingPage(
  dto: CreateLandingPageDTO,
  userId: string
): Promise<LandingPage> {
  const supabase = await createClient()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabaseAny = supabase as any
  
  const { data, error } = await supabaseAny
    .from('landing_pages')
    .insert({
      name: dto.name,
      slug: dto.slug,
      status: dto.status || 'draft',
      sections: dto.sections || [],
      css_custom: dto.cssCustom || '',
      conversion_goals: dto.conversionGoals || [],
      seo_title: dto.seoTitle || null,
      seo_description: dto.seoDescription || null,
      og_image_url: dto.ogImageUrl || null,
      custom_analytics_id: dto.customAnalyticsId || null,
      webhook_id: dto.webhookId || null,
      created_by: userId,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating landing page:', error)
    throw new Error(`Failed to create landing page: ${error.message}`)
  }

  return dbToLandingPage(data)
}

/**
 * Update a landing page
 */
export async function updateLandingPage(
  id: string,
  dto: UpdateLandingPageDTO
): Promise<LandingPage> {
  const supabase = await createClient()
  
  const updateData: Record<string, unknown> = {}
  
  if (dto.name !== undefined) updateData.name = dto.name
  if (dto.slug !== undefined) updateData.slug = dto.slug
  if (dto.status !== undefined) {
    updateData.status = dto.status
    if (dto.status === 'published') {
      updateData.published_at = new Date().toISOString()
    }
  }
  if (dto.sections !== undefined) updateData.sections = dto.sections
  if (dto.cssCustom !== undefined) updateData.css_custom = dto.cssCustom
  if (dto.conversionGoals !== undefined) updateData.conversion_goals = dto.conversionGoals
  if (dto.seoTitle !== undefined) updateData.seo_title = dto.seoTitle
  if (dto.seoDescription !== undefined) updateData.seo_description = dto.seoDescription
  if (dto.ogImageUrl !== undefined) updateData.og_image_url = dto.ogImageUrl
  if (dto.customAnalyticsId !== undefined) updateData.custom_analytics_id = dto.customAnalyticsId
  if (dto.webhookId !== undefined) updateData.webhook_id = dto.webhookId

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabaseAny = supabase as any

  const { data, error } = await supabaseAny
    .from('landing_pages')
    .update(updateData)
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single()

  if (error) {
    console.error('Error updating landing page:', error)
    throw new Error(`Failed to update landing page: ${error.message}`)
  }

  return dbToLandingPage(data)
}

/**
 * Soft delete a landing page
 */
export async function deleteLandingPage(id: string): Promise<void> {
  const supabase = await createClient()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabaseAny = supabase as any

  const { error } = await supabaseAny
    .from('landing_pages')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .is('deleted_at', null)

  if (error) {
    console.error('Error deleting landing page:', error)
    throw new Error(`Failed to delete landing page: ${error.message}`)
  }
}

/**
 * Duplicate a landing page
 */
export async function duplicateLandingPage(
  id: string,
  userId: string
): Promise<LandingPage> {
  const original = await getLandingPageById(id)
  if (!original) {
    throw new Error('Landing page not found')
  }

  const newSlug = `${original.slug}-copy-${Date.now()}`
  
  return createLandingPage(
    {
      name: `${original.name} (Cópia)`,
      slug: newSlug,
      status: 'draft',
      sections: original.sections,
      cssCustom: original.cssCustom,
      conversionGoals: original.conversionGoals,
      seoTitle: original.seoTitle ?? undefined,
      seoDescription: original.seoDescription ?? undefined,
      ogImageUrl: original.ogImageUrl ?? undefined,
      customAnalyticsId: original.customAnalyticsId ?? undefined,
      webhookId: original.webhookId ?? undefined,
    },
    userId
  )
}

/**
 * Publish a landing page
 */
export async function publishLandingPage(id: string): Promise<LandingPage> {
  return updateLandingPage(id, { status: 'published' })
}

/**
 * Unpublish a landing page (set to draft)
 */
export async function unpublishLandingPage(id: string): Promise<LandingPage> {
  return updateLandingPage(id, { status: 'draft' })
}

// ============================================================================
// Leads Management
// ============================================================================

/**
 * Get leads for a landing page
 */
export async function getLandingPageLeads(
  landingPageId: string,
  options: { limit?: number; offset?: number } = {}
): Promise<{ data: LandingPageLead[]; total: number }> {
  const supabase = await createClient()
  
  const { limit = 50, offset = 0 } = options

  const { data, error, count } = await supabase
    .from('landing_page_leads')
    .select('*', { count: 'exact' })
    .eq('landing_page_id', landingPageId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching leads:', error)
    throw new Error(`Failed to fetch leads: ${error.message}`)
  }

  return {
    data: (data || []).map(dbToLead),
    total: count || 0,
  }
}

/**
 * Submit a form (create a lead)
 */
export async function submitForm(submission: FormSubmissionData): Promise<LandingPageLead> {
  const supabase = await createClient()
  
  // Extract standard fields
  const { name, email, phone, company, message, ...customFields } = submission.fields as Record<string, unknown>
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabaseAny = supabase as any

  const { data, error } = await supabaseAny
    .from('landing_page_leads')
    .insert({
      landing_page_id: submission.landingPageId,
      name: name as string | null,
      email: email as string,
      phone: phone as string | null,
      company: company as string | null,
      message: message as string | null,
      custom_fields: customFields,
      utm_params: submission.utmParams || {},
      referrer: submission.referrer || null,
      user_agent: submission.userAgent || null,
      ip_address: submission.ipAddress || null,
      converted_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error submitting form:', error)
    throw new Error(`Failed to submit form: ${error.message}`)
  }

  return dbToLead(data)
}

/**
 * Get lead count for a landing page
 */
export async function getLandingPageLeadCount(landingPageId: string): Promise<number> {
  const supabase = await createClient()
  
  const { count, error } = await supabase
    .from('landing_page_leads')
    .select('*', { count: 'exact', head: true })
    .eq('landing_page_id', landingPageId)

  if (error) {
    console.error('Error counting leads:', error)
    return 0
  }

  return count || 0
}

// ============================================================================
// Slug Helpers
// ============================================================================

/**
 * Generate a unique slug for a landing page
 */
export async function generateUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  const supabase = await createClient()
  
  let slug = baseSlug
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  let counter = 1
  let uniqueSlug = slug

  while (true) {
    let query = supabase
      .from('landing_pages')
      .select('id')
      .eq('slug', uniqueSlug)
      .is('deleted_at', null)
    
    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data } = await query.maybeSingle()
    
    if (!data) break
    
    counter++
    uniqueSlug = `${slug}-${counter}`
  }

  return uniqueSlug
}

/**
 * Check if a slug is available
 */
export async function isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = await createClient()
  
  let query = supabase
    .from('landing_pages')
    .select('id')
    .eq('slug', slug)
    .is('deleted_at', null)
  
  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data } = await query.maybeSingle()
  
  return !data
}
