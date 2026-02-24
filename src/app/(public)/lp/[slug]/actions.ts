'use server'

// src/app/(public)/lp/[slug]/actions.ts
// Server actions for public landing pages

import { submitForm } from '@/lib/landing-pages'

export async function submitFormAction(
  landingPageId: string,
  sectionId: string,
  fields: Record<string, string>
): Promise<void> {
  // Get UTM params from headers if available
  const utmParams: Record<string, string> = {}
  
  // Get referrer and user agent (these would come from headers in a real implementation)
  const referrer = undefined
  const userAgent = undefined
  const ipAddress = undefined

  await submitForm({
    landingPageId,
    sectionId,
    fields,
    utmParams,
    referrer,
    userAgent,
    ipAddress,
  })
}
