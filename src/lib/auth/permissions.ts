// src/lib/auth/permissions.ts
// Permission middleware helpers for server-side access control

import { getCurrentUserProfile } from '@/lib/admin/users'
import { redirect } from 'next/navigation'
import type { UserRole } from '@/lib/admin/users'

export type { UserRole }

export async function requireAuth() {
    const profile = await getCurrentUserProfile()
    if (!profile) {
        redirect('/admin/login')
    }
    return profile
}

export async function requireRole(requiredRole: UserRole) {
    const profile = await requireAuth()

    const roleHierarchy: UserRole[] = ['viewer', 'author', 'editor', 'admin', 'super_admin']
    const userLevel = roleHierarchy.indexOf(profile.role as UserRole)
    const requiredLevel = roleHierarchy.indexOf(requiredRole)

    if (userLevel < requiredLevel) {
        redirect('/admin?error=unauthorized')
    }

    return profile
}

export async function requireAdmin() {
    return requireRole('admin')
}

export async function requireSuperAdmin() {
    return requireRole('super_admin')
}

export async function requireEditor() {
    return requireRole('editor')
}

// Non-redirecting check for conditional rendering
export async function checkPermission(requiredRole: UserRole): Promise<boolean> {
    const profile = await getCurrentUserProfile()
    if (!profile) return false

    const roleHierarchy: UserRole[] = ['viewer', 'author', 'editor', 'admin', 'super_admin']
    const userLevel = roleHierarchy.indexOf(profile.role as UserRole)
    const requiredLevel = roleHierarchy.indexOf(requiredRole)

    return userLevel >= requiredLevel
}
