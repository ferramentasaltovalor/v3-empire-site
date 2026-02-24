/**
 * API Route: /api/webhooks/[id]
 * Manage individual webhook configuration
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/permissions'
import { createClient } from '@/lib/supabase/server'
import { testWebhook } from '@/lib/webhooks'
import type { WebhookInput } from '@/lib/webhooks/types'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/webhooks/[id]
 * Get a single webhook configuration
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin()
    
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: webhook, error } = await supabase
      .from('webhook_configs')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Webhook not found' }, { status: 404 })
      }
      console.error('Error fetching webhook:', error)
      return NextResponse.json({ error: 'Failed to fetch webhook' }, { status: 500 })
    }

    return NextResponse.json({ webhook })
  } catch (error) {
    console.error('Error in GET /api/webhooks/[id]:', error)
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PUT /api/webhooks/[id]
 * Update a webhook configuration
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin()
    
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const body = await request.json() as Partial<WebhookInput>

    // Validate URL if provided
    if (body.url) {
      try {
        new URL(body.url)
      } catch {
        return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
      }
    }

    const supabase = await createClient()
    const { data: webhook, error } = await supabase
      .from('webhook_configs')
      .update({
        ...(body.name !== undefined && { name: body.name }),
        ...(body.url !== undefined && { url: body.url }),
        ...(body.events !== undefined && { events: body.events }),
        ...(body.headers !== undefined && { headers: body.headers }),
        ...(body.secret !== undefined && { secret: body.secret }),
        ...(body.active !== undefined && { active: body.active }),
      } as never)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating webhook:', error)
      return NextResponse.json({ error: 'Failed to update webhook' }, { status: 500 })
    }

    return NextResponse.json({ webhook })
  } catch (error) {
    console.error('Error in PUT /api/webhooks/[id]:', error)
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/webhooks/[id]
 * Delete a webhook configuration
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin()
    
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('webhook_configs')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting webhook:', error)
      return NextResponse.json({ error: 'Failed to delete webhook' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/webhooks/[id]:', error)
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
