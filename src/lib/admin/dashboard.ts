// Dashboard data fetching functions
// Server-side data layer for admin dashboard

import { createClient } from '@/lib/supabase/server'
import type { StatusType } from '@/components/admin/ui/StatusBadge'

export interface DashboardStats {
    publishedPosts: number
    draftPosts: number
    scheduledPosts: number
    mediaItems: number
    aiGenerations: number
}

export interface RecentPostData {
    id: string
    title: string
    slug: string
    status: StatusType
    updated_at: string
    profiles?: { full_name: string | null } | null
}

/**
 * Get AI generations count for current month
 * Returns 0 if the table doesn't exist or there's an error
 */
async function getAiGenerationsCount(): Promise<number> {
    try {
        const supabase = await createClient()
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0)

        // Check if ai_generation_logs table exists
        const result = await supabase
            .from('ai_generation_logs')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', startOfMonth.toISOString())

        if (result.error) {
            // Table might not exist yet, return 0
            console.error('Error fetching AI generations:', result.error)
            return 0
        }

        return result.count || 0
    } catch {
        return 0
    }
}

/**
 * Get dashboard statistics from Supabase
 */
export async function getDashboardStats(): Promise<DashboardStats> {
    const supabase = await createClient()

    // Get post counts by status - run in parallel
    const [
        publishedResult,
        draftResult,
        scheduledResult,
        mediaResult,
    ] = await Promise.all([
        // Published posts
        supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'published')
            .is('deleted_at', null),
        // Draft posts
        supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'draft')
            .is('deleted_at', null),
        // Scheduled posts
        supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'scheduled')
            .is('deleted_at', null),
        // Media items
        supabase
            .from('media_items')
            .select('*', { count: 'exact', head: true })
            .is('deleted_at', null),
    ])

    // Get AI generations separately (might fail if table doesn't exist)
    const aiGenerations = await getAiGenerationsCount()

    return {
        publishedPosts: publishedResult.count || 0,
        draftPosts: draftResult.count || 0,
        scheduledPosts: scheduledResult.count || 0,
        mediaItems: mediaResult.count || 0,
        aiGenerations,
    }
}

/**
 * Get recent posts for dashboard
 */
export async function getRecentPosts(limit = 5): Promise<RecentPostData[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('posts')
        .select('id, title, slug, status, updated_at, profiles!posts_author_id_fkey(full_name)')
        .is('deleted_at', null)
        .order('updated_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Error fetching recent posts:', error)
        return []
    }

    return (data || []) as RecentPostData[]
}

/**
 * Get recent activity for dashboard
 * This is a placeholder - implement based on your activity tracking needs
 */
export async function getRecentActivity(limit = 10) {
    // For now, return empty array
    // In the future, this could track:
    // - Post creations/updates
    // - Media uploads
    // - User actions
    // - Settings changes
    return []
}
