// src/components/admin/users/UsersList.tsx
// Client component for displaying and filtering users list

'use client'

import { useState, useEffect } from 'react'
import { DataTable, Column } from '@/components/admin/ui/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils/format'
import { adminContent } from '@/content/admin'
import { UserRole } from '@/lib/admin/users'
import { updateUserRoleAction } from '@/app/(admin)/admin/usuarios/actions'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Edit, Shield, User, Eye, Pen, PenTool, Loader2 } from 'lucide-react'

type Profile = {
    id: string
    full_name: string | null
    avatar_url: string | null
    role: UserRole
    bio: string | null
    created_at: string
    updated_at: string
}

const roleConfig: Record<UserRole, { label: string; color: string; icon: typeof Shield }> = {
    super_admin: { label: 'Super Admin', color: 'bg-purple-100 text-purple-800', icon: Shield },
    admin: { label: 'Admin', color: 'bg-blue-100 text-blue-800', icon: Shield },
    editor: { label: 'Editor', color: 'bg-green-100 text-green-800', icon: Pen },
    author: { label: 'Autor', color: 'bg-yellow-100 text-yellow-800', icon: PenTool },
    viewer: { label: 'Visualizador', color: 'bg-gray-100 text-gray-800', icon: Eye },
}

interface UsersListProps {
    users: Profile[]
    total: number
    currentRole?: string
    searchQuery?: string
    currentUserRole?: UserRole
}

export function UsersList({ users, total, currentRole, searchQuery, currentUserRole }: UsersListProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [search, setSearch] = useState(searchQuery || '')
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)

    const canChangeRole = currentUserRole === 'super_admin'

    useEffect(() => {
        const debounce = setTimeout(() => {
            if (search !== searchQuery) {
                const params = new URLSearchParams(searchParams.toString())
                if (search) {
                    params.set('search', search)
                } else {
                    params.delete('search')
                }
                router.push(`/admin/usuarios?${params.toString()}`)
            }
        }, 300)

        return () => clearTimeout(debounce)
    }, [search, searchQuery, router, searchParams])

    const handleRoleChange = async (userId: string, newRole: UserRole) => {
        if (!canChangeRole) return

        setUpdatingUserId(userId)
        try {
            const result = await updateUserRoleAction(userId, newRole)
            if (result.error) {
                alert(result.error)
            } else {
                router.refresh()
            }
        } catch (error) {
            console.error('Error updating role:', error)
            alert('Erro ao atualizar função')
        } finally {
            setUpdatingUserId(null)
        }
    }

    const columns: Column<Profile>[] = [
        {
            key: 'user',
            label: adminContent.users.table.name,
            render: (user) => (
                <div className="flex items-center gap-3">
                    {user.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt={user.full_name || ''}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-[var(--color-admin-surface)] flex items-center justify-center">
                            <User className="w-5 h-5 text-[var(--color-admin-muted)]" />
                        </div>
                    )}
                    <div>
                        <div className="font-medium text-[var(--color-admin-text)]">{user.full_name || 'Sem nome'}</div>
                        <div className="text-sm text-[var(--color-admin-muted)]">{user.id}</div>
                    </div>
                </div>
            ),
        },
        {
            key: 'role',
            label: adminContent.users.table.role,
            render: (user) => {
                const config = roleConfig[user.role as UserRole] || roleConfig.viewer
                const Icon = config.icon

                if (canChangeRole && updatingUserId !== user.id) {
                    return (
                        <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${config.color}`}
                        >
                            {Object.entries(roleConfig).map(([role, cfg]) => (
                                <option key={role} value={role}>{cfg.label}</option>
                            ))}
                        </select>
                    )
                }

                if (updatingUserId === user.id) {
                    return (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1">
                            <Loader2 className="w-4 h-4 animate-spin text-[var(--color-admin-muted)]" />
                        </span>
                    )
                }

                return (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {config.label}
                    </span>
                )
            },
        },
        {
            key: 'created_at',
            label: 'Membro desde',
            render: (user) => (
                <span className="text-sm text-[var(--color-admin-muted)]">
                    {formatDate(user.created_at)}
                </span>
            ),
        },
        {
            key: 'actions',
            label: '',
            render: (user) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/admin/usuarios/${user.id}`}
                        className="p-2 text-[var(--color-admin-muted)] hover:text-[var(--color-admin-accent)] transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                    </Link>
                </div>
            ),
        },
    ]

    const roleFilters = [
        { label: 'Todos', value: '' },
        { label: 'Super Admin', value: 'super_admin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Autor', value: 'author' },
        { label: 'Visualizador', value: 'viewer' },
    ]

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Input
                    placeholder={adminContent.generic.search}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
                <div className="flex flex-wrap gap-2">
                    {roleFilters.map((filter) => (
                        <Link
                            key={filter.value}
                            href={`/admin/usuarios${filter.value ? `?role=${filter.value}` : ''}`}
                            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${currentRole === filter.value || (!currentRole && !filter.value)
                                    ? 'bg-[var(--color-admin-accent)] text-white'
                                    : 'bg-[var(--color-admin-surface)] text-[var(--color-admin-muted)] hover:text-[var(--color-admin-text)]'
                                }`}
                        >
                            {filter.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-[var(--color-admin-muted)]">
                {total} {total === 1 ? adminContent.users.userFound : adminContent.users.usersFound}
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={users}
                keyField="id"
                emptyMessage={adminContent.users.noUsers}
            />
        </div>
    )
}
