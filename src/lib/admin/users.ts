// src/lib/admin/users.ts
// User data access layer for Supabase operations

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
export type UserRole = Database['public']['Enums']['user_role']

export async function getUsers(options?: {
    role?: UserRole
    search?: string
    limit?: number
    offset?: number
}) {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
        .from('profiles')
        .select('*', { count: 'exact' })

    if (options?.role) {
        query = query.eq('role', options.role)
    }

    if (options?.search) {
        query = query.or(`full_name.ilike.%${options.search}%,email.ilike.%${options.search}%`)
    }

    if (options?.limit) {
        query = query.limit(options.limit)
    }

    if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 50) - 1)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) {
        console.error('Error fetching users:', error)
        return { users: [], total: 0 }
    }

    return { users: data as Profile[], total: count || 0 }
}

export async function getUserById(id: string) {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching user:', error)
        return null
    }

    return data as Profile
}

export async function updateUserRole(id: string, role: UserRole) {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
        .from('profiles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating user role:', error)
        return null
    }

    return data as Profile
}

export async function updateUserProfile(id: string, updateData: {
    full_name?: string
    avatar_url?: string
    bio?: string
}) {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile, error } = await (supabase as any)
        .from('profiles')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating profile:', error)
        return null
    }

    return profile as Profile
}

export async function getCurrentUserProfile() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        console.error('Error fetching current user profile:', error)
        return null
    }

    return profile as Profile
}

// Permission checking functions
export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy: UserRole[] = ['viewer', 'author', 'editor', 'admin', 'super_admin']
    const userLevel = roleHierarchy.indexOf(userRole)
    const requiredLevel = roleHierarchy.indexOf(requiredRole)
    return userLevel >= requiredLevel
}

export function canManageUsers(userRole: UserRole): boolean {
    return userRole === 'super_admin' || userRole === 'admin'
}

export function canPublishPosts(userRole: UserRole): boolean {
    return hasPermission(userRole, 'editor')
}

export function canEditAnyPost(userRole: UserRole): boolean {
    return hasPermission(userRole, 'editor')
}

export function canAccessSettings(userRole: UserRole): boolean {
    return userRole === 'super_admin' || userRole === 'admin'
}

export function canManageApiKeys(userRole: UserRole): boolean {
    return userRole === 'super_admin'
}
