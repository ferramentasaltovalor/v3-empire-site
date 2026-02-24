'use server'

import { revalidatePath } from 'next/cache'
import { updateLandingPage } from '@/lib/landing-pages'
import type { LandingPageSection } from '@/lib/landing-pages'

export async function updateLandingPageSections(
  id: string,
  sections: LandingPageSection[]
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateLandingPage(id, { sections })

    revalidatePath(`/admin/landing-pages/${id}`)
    revalidatePath(`/admin/landing-pages/${id}/secoes`)
    revalidatePath(`/lp/[slug]`, 'page')

    return { success: true }
  } catch (error) {
    console.error('Error updating sections:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
