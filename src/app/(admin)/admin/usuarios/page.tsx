// src/app/(admin)/admin/usuarios/page.tsx
// Users management page - list all users with role filtering

import { getUsers, UserRole } from '@/lib/admin/users'
import { requireAdmin } from '@/lib/auth/permissions'
import { getCurrentUserProfile } from '@/lib/admin/users'
import { UsersList } from '@/components/admin/users/UsersList'
import { adminContent } from '@/content/admin'

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; search?: string }>
}) {
  await requireAdmin()

  const currentUser = await getCurrentUserProfile()
  const params = await searchParams

  const { users, total } = await getUsers({
    role: params.role as UserRole,
    search: params.search,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-admin-text)]">
            {adminContent.users.title}
          </h1>
          <p className="text-[var(--color-admin-muted)]">{adminContent.users.subtitle}</p>
        </div>
      </div>

      <UsersList
        users={users}
        total={total}
        currentRole={params.role}
        searchQuery={params.search}
        currentUserRole={currentUser?.role as UserRole}
      />
    </div>
  )
}
