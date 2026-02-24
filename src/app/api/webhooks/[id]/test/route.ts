/**
 * API Route: /api/webhooks/[id]/test
 * Test a webhook endpoint
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/permissions'
import { createClient } from '@/lib/supabase/server'
import { testWebhook } from '@/lib/webhooks'
import type { WebhookConfig } from '@/lib/webhooks/types'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/webhooks/[id]/test
 * Send a test payload to the webhook endpoint
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
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

    const result = await testWebhook(webhook as WebhookConfig)

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: `Webhook delivered successfully (Status: ${result.statusCode}, Duration: ${result.duration}ms)` 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error || `Delivery failed with status ${result.statusCode}`,
        statusCode: result.statusCode,
        duration: result.duration
      })
    }
  } catch (error) {
    console.error('Error in POST /api/webhooks/[id]/test:', error)
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
