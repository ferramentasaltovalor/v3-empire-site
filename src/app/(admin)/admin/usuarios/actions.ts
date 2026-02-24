// src/app/(admin)/admin/usuarios/actions.ts
// Server actions for user management

'use server'

import { revalidatePath } from 'next/cache'
import { updateUserRole, updateUserProfile, getCurrentUserProfile } from '@/lib/admin/users'
import { requireSuperAdmin } from '@/lib/auth/permissions'
import type { UserRole } from '@/lib/admin/users'

export async function updateUserRoleAction(id: string, role: UserRole) {
    // Only super_admin can change roles
    const currentUser = await requireSuperAdmin()

    // Prevent self-demotion from super_admin
    if (currentUser.id === id && currentUser.role === 'super_admin' && role !== 'super_admin') {
        return { error: 'Você não pode remover sua própria função de Super Admin' }
    }

    const user = await updateUserRole(id, role)

    if (user) {
        revalidatePath('/admin/usuarios')
        return { success: true, user }
    }

    return { error: 'Erro ao atualizar função do usuário' }
}

export async function updateProfileAction(id: string, data: {
    full_name?: string
    avatar_url?: string
    bio?: string
}) {
    const currentUser = await getCurrentUserProfile()

    // Users can only update their own profile unless they're admin+
    if (!currentUser || (currentUser.id !== id && !['super_admin', 'admin'].includes(currentUser.role))) {
        return { error: 'Sem permissão para atualizar este perfil' }
    }

    const profile = await updateUserProfile(id, data)

    if (profile) {
        revalidatePath('/admin/usuarios')
        revalidatePath(`/admin/usuarios/${id}`)
        return { success: true, profile }
    }

    return { error: 'Erro ao atualizar perfil' }
}

export async function getCurrentUser() {
    return getCurrentUserProfile()
}
