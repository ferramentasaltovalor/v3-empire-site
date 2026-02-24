/**
 * Analytics API Route
 * GET: Fetch all analytics configurations (admin only)
 * POST: Create a new analytics configuration (admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/permissions'
import {
  getAnalyticsConfigs,
  createAnalyticsConfig,
} from '@/lib/analytics'
import type { AnalyticsConfig } from '@/lib/analytics/types'

/**
 * GET /api/analytics
 * Fetch all analytics configurations
 * Admin only
 */
export async function GET() {
  try {
    await requireAdmin()
    
    const configs = await getAnalyticsConfigs()
    
    return NextResponse.json({ configs })
  } catch (error) {
    console.error('Error fetching analytics configs:', error)
    
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/analytics
 * Create a new analytics configuration
 * Admin only
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      )
    }
    
    // Validate tracking_id for non-custom types
    if (body.type !== 'custom' && !body.tracking_id) {
      return NextResponse.json(
        { error: 'Tracking ID is required for this provider type' },
        { status: 400 }
      )
    }
    
    // Validate custom_html for custom type
    if (body.type === 'custom' && !body.custom_html) {
      return NextResponse.json(
        { error: 'Custom HTML is required for custom provider type' },
        { status: 400 }
      )
    }
    
    const config = await createAnalyticsConfig({
      name: body.name,
      type: body.type,
      tracking_id: body.type !== 'custom' ? body.tracking_id : null,
      custom_html: body.type === 'custom' ? body.custom_html : null,
      active: body.active ?? true,
      apply_to: body.apply_to ?? {},
    })
    
    if (!config) {
      return NextResponse.json(
        { error: 'Failed to create analytics configuration' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ config }, { status: 201 })
  } catch (error) {
    console.error('Error creating analytics config:', error)
    
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
