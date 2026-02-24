/**
 * Analytics [id] API Route
 * GET: Fetch a single analytics configuration (admin only)
 * PUT: Update an analytics configuration (admin only)
 * DELETE: Delete an analytics configuration (admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/permissions'
import {
  getAnalyticsConfig,
  updateAnalyticsConfig,
  deleteAnalyticsConfig,
} from '@/lib/analytics'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/analytics/[id]
 * Fetch a single analytics configuration
 * Admin only
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin()
    
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }
    
    const config = await getAnalyticsConfig(id)
    
    if (!config) {
      return NextResponse.json(
        { error: 'Analytics configuration not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ config })
  } catch (error) {
    console.error('Error fetching analytics config:', error)
    
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
 * PUT /api/analytics/[id]
 * Update an analytics configuration
 * Admin only
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin()
    
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }
    
    const body = await request.json()
    
    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {}
    
    if (body.name !== undefined) updateData.name = body.name
    if (body.type !== undefined) updateData.type = body.type
    if (body.tracking_id !== undefined) updateData.tracking_id = body.tracking_id
    if (body.custom_html !== undefined) updateData.custom_html = body.custom_html
    if (body.active !== undefined) updateData.active = body.active
    if (body.apply_to !== undefined) updateData.apply_to = body.apply_to
    
    // Validate tracking_id for non-custom types
    if (body.type && body.type !== 'custom' && !body.tracking_id) {
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
    
    const config = await updateAnalyticsConfig(id, updateData)
    
    if (!config) {
      return NextResponse.json(
        { error: 'Failed to update analytics configuration' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ config })
  } catch (error) {
    console.error('Error updating analytics config:', error)
    
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
 * DELETE /api/analytics/[id]
 * Delete an analytics configuration
 * Admin only
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin()
    
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }
    
    const success = await deleteAnalyticsConfig(id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete analytics configuration' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting analytics config:', error)
    
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
