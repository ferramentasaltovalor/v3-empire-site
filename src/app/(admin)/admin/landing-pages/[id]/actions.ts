'use server'

// src/app/(admin)/admin/landing-pages/[id]/actions.ts
// Server actions for individual landing page management

import { revalidatePath } from 'next/cache'
import { updateLandingPageData, publishLandingPageAction, unpublishLandingPageAction } from '../actions'
import type { LandingPageStatus } from '@/lib/landing-pages'

export async function updateLandingPageFormAction(formData: FormData): Promise<void> {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const seoTitle = formData.get('seoTitle') as string
  const seoDescription = formData.get('seoDescription') as string
  const cssCustom = formData.get('cssCustom') as string
  
  if (!name?.trim()) {
    throw new Error('Nome é obrigatório')
  }
  
  await updateLandingPageData(id, {
    name,
    slug,
    seoTitle: seoTitle || undefined,
    seoDescription: seoDescription || undefined,
    cssCustom: cssCustom || undefined,
  })
  
  revalidatePath(`/admin/landing-pages/${id}`)
}

export async function togglePublishFormAction(formData: FormData): Promise<void> {
  const id = formData.get('id') as string
  const status = formData.get('status') as LandingPageStatus
  
  if (status === 'published') {
    await unpublishLandingPageAction(id)
  } else {
    await publishLandingPageAction(id)
  }
}
