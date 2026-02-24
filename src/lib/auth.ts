import { createClient } from '@/lib/supabase/server'
import { UserRole } from '@/types/users'
import { Profile } from '@/types/database'

export async function getUser() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return null
    }

    return user
}

export async function getUserProfile() {
    const user = await getUser()

    if (!user) {
        return null
    }

    const supabase = await createClient()
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error || !profile) {
        return null
    }

    return profile as Profile
}

export async function hasRole(allowedRoles: UserRole[]) {
    const profile = await getUserProfile()

    if (!profile) {
        return false
    }

    return allowedRoles.includes(profile.role as UserRole)
}

export async function requireRole(allowedRoles: UserRole[]) {
    const hasAccess = await hasRole(allowedRoles)

    if (!hasAccess) {
        throw new Error('Unauthorized')
    }
}
