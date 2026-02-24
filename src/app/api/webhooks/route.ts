/**
 * API Route: /api/webhooks
 * Manage outgoing webhook configurations
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/permissions'
import { createClient } from '@/lib/supabase/server'
import type { WebhookInput } from '@/lib/webhooks/types'

/**
 * GET /api/webhooks
 * List all webhook configurations
 */
export async function GET() {
  try {
    await requireAdmin()

    const supabase = await createClient()
    const { data: webhooks, error } = await supabase
      .from('webhook_configs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching webhooks:', error)
      return NextResponse.json({ error: 'Failed to fetch webhooks' }, { status: 500 })
    }

    return NextResponse.json({ webhooks })
  } catch (error) {
    console.error('Error in GET /api/webhooks:', error)
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/webhooks
 * Create a new webhook configuration
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json() as WebhookInput

    // Validation
    if (!body.name || !body.url) {
      return NextResponse.json({ error: 'Name and URL are required' }, { status: 400 })
    }

    if (!body.events || body.events.length === 0) {
      return NextResponse.json({ error: 'At least one event is required' }, { status: 400 })
    }

    // Validate URL
    try {
      new URL(body.url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: webhook, error } = await supabase
      .from('webhook_configs')
      .insert({
        name: body.name,
        url: body.url,
        events: body.events,
        headers: body.headers || {},
        secret: body.secret || null,
        active: body.active ?? true,
      } as never)
      .select()
      .single()

    if (error) {
      console.error('Error creating webhook:', error)
      return NextResponse.json({ error: 'Failed to create webhook' }, { status: 500 })
    }

    return NextResponse.json({ webhook }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/webhooks:', error)
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
