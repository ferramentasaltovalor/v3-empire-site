/**
 * Incoming Webhook Utility Functions
 * Pure functions that don't require server-side only imports
 */

/**
 * Get webhook URL for display
 */
export function getIncomingWebhookUrl(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'
  return `${baseUrl}/api/webhooks/incoming/${slug}`
}
