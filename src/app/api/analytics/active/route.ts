/**
 * Analytics Active API Route
 * GET: Fetch active analytics configurations for client-side injection
 * This endpoint is public (needed for the AnalyticsProvider component)
 * Returns only the necessary data for script injection
 */

import { NextResponse } from 'next/server'
import { getActiveAnalyticsConfigs } from '@/lib/analytics'

/**
 * GET /api/analytics/active
 * Fetch active analytics configurations
 * Public endpoint - returns minimal data for script injection
 */
export async function GET() {
  try {
    const configs = await getActiveAnalyticsConfigs()
    
    // Return only the data needed for client-side script injection
    const activeConfigs = configs.map(config => ({
      id: config.id,
      type: config.type,
      tracking_id: config.tracking_id,
      custom_html: config.custom_html,
    }))
    
    return NextResponse.json({ configs: activeConfigs })
  } catch (error) {
    console.error('Error fetching active analytics configs:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
