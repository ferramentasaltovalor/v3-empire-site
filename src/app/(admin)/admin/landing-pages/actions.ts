'use server'

// src/app/(admin)/admin/landing-pages/actions.ts
// Server actions for landing pages management

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'
import {
  getLandingPages,
  getLandingPageById,
  createLandingPage,
  updateLandingPage,
  deleteLandingPage,
  duplicateLandingPage,
  publishLandingPage,
  unpublishLandingPage,
  generateUniqueSlug,
  isSlugAvailable,
} from '@/lib/landing-pages'
import type { LandingPageStatus, CreateLandingPageDTO, UpdateLandingPageDTO } from '@/lib/landing-pages'

// ============================================================================
// Queries
// ============================================================================

export async function listLandingPages(options?: {
  status?: LandingPageStatus
  limit?: number
  offset?: number
}) {
  return getLandingPages(options)
}

export async function getLandingPage(id: string) {
  return getLandingPageById(id)
}

export async function checkSlugAvailability(slug: string, excludeId?: string) {
  return isSlugAvailable(slug, excludeId)
}

export async function generateSlug(name: string, excludeId?: string) {
  return generateUniqueSlug(name, excludeId)
}

// ============================================================================
// Mutations
// ============================================================================

export async function createNewLandingPage(data: {
  name: string
  slug?: string
}) {
  const user = await getUser()
  if (!user) {
    throw new Error('Não autorizado')
  }

  const slug = data.slug || await generateUniqueSlug(data.name)

  const dto: CreateLandingPageDTO = {
    name: data.name,
    slug,
    status: 'draft',
  }

  const lp = await createLandingPage(dto, user.id)
  
  revalidatePath('/admin/landing-pages')
  
  return lp
}

export async function updateLandingPageData(
  id: string,
  data: UpdateLandingPageDTO
) {
  await updateLandingPage(id, data)
  
  revalidatePath('/admin/landing-pages')
  revalidatePath(`/admin/landing-pages/${id}`)
  revalidatePath(`/lp/${data.slug}`, 'page')
}

export async function deleteLandingPageAction(id: string) {
  await deleteLandingPage(id)
  
  revalidatePath('/admin/landing-pages')
}

export async function duplicateLandingPageAction(id: string) {
  const user = await getUser()
  if (!user) {
    throw new Error('Não autorizado')
  }

  const newLp = await duplicateLandingPage(id, user.id)
  
  revalidatePath('/admin/landing-pages')
  
  return newLp
}

export async function publishLandingPageAction(id: string) {
  await publishLandingPage(id)
  
  revalidatePath('/admin/landing-pages')
  revalidatePath(`/admin/landing-pages/${id}`)
}

export async function unpublishLandingPageAction(id: string) {
  await unpublishLandingPage(id)
  
  revalidatePath('/admin/landing-pages')
  revalidatePath(`/admin/landing-pages/${id}`)
}

// ============================================================================
// Form Actions
// ============================================================================

export async function createLandingPageFormAction(formData: FormData): Promise<void> {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string | undefined

  if (!name?.trim()) {
    throw new Error('Nome é obrigatório')
  }

  const lp = await createNewLandingPage({ name, slug })
  
  redirect(`/admin/landing-pages/${lp.id}`)
}

export async function deleteLandingPageFormAction(formData: FormData) {
  const id = formData.get('id') as string
  
  if (!id) {
    throw new Error('ID é obrigatório')
  }

  await deleteLandingPageAction(id)
  
  redirect('/admin/landing-pages')
}

export async function duplicateLandingPageFormAction(formData: FormData) {
  const id = formData.get('id') as string
  
  if (!id) {
    throw new Error('ID é obrigatório')
  }

  const newLp = await duplicateLandingPageAction(id)
  
  redirect(`/admin/landing-pages/${newLp.id}`)
}

export async function togglePublishFormAction(formData: FormData) {
  const id = formData.get('id') as string
  const currentStatus = formData.get('status') as LandingPageStatus
  
  if (!id) {
    throw new Error('ID é obrigatório')
  }

  if (currentStatus === 'published') {
    await unpublishLandingPageAction(id)
  } else {
    await publishLandingPageAction(id)
  }
}
