// src/types/users.ts

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'author' | 'viewer'

export interface UserProfile {
    id: string
    full_name: string | null
    avatar_url: string | null
    role: UserRole
    bio: string | null
    created_at: string
    updated_at: string
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
    super_admin: ['*'],
    admin: ['posts.*', 'media.*', 'users.*', 'settings.*', 'landing_pages.*', 'analytics.*', 'webhooks.*'],
    editor: ['posts.*', 'media.*', 'landing_pages.read', 'landing_pages.write'],
    author: ['posts.own.*', 'media.upload'],
    viewer: ['posts.read', 'media.read'],
}

export const ROLE_LABELS: Record<UserRole, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    editor: 'Editor',
    author: 'Autor',
    viewer: 'Visualizador',
}
