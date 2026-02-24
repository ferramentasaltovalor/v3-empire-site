// List of recent posts with status badges
// Click to edit functionality

import Link from 'next/link'
import { StatusBadge, type StatusType } from '@/components/admin/ui/StatusBadge'

export interface RecentPost {
    id: string
    title: string
    slug: string
    status: StatusType
    updated_at: string
    profiles?: { full_name: string | null } | null
}

interface RecentPostsListProps {
    posts: RecentPost[]
    title?: string
    viewAllLabel?: string
    viewAllHref?: string
    noPostsLabel?: string
    createFirstLabel?: string
    createFirstHref?: string
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
        return 'Hoje'
    } else if (diffDays === 1) {
        return 'Ontem'
    } else if (diffDays < 7) {
        return `${diffDays} dias atrás`
    } else {
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
        })
    }
}

export function RecentPostsList({
    posts,
    title = 'Posts recentes',
    viewAllLabel = 'Ver todos',
    viewAllHref = '/admin/posts',
    noPostsLabel = 'Nenhum post ainda',
    createFirstLabel = 'Criar primeiro post',
    createFirstHref = '/admin/posts/novo',
}: RecentPostsListProps) {
    return (
        <div className="bg-[var(--color-admin-bg)] border border-[var(--color-admin-border)] rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-admin-border)]">
                <h2 className="text-lg font-semibold text-[var(--color-admin-text)]">
                    {title}
                </h2>
                <Link
                    href={viewAllHref}
                    className="text-sm font-medium text-[var(--color-admin-accent)] hover:text-[var(--color-admin-accent-hover)] transition-colors"
                >
                    {viewAllLabel} →
                </Link>
            </div>

            {/* Content */}
            {posts.length === 0 ? (
                <div className="px-6 py-12 text-center">
                    <p className="text-[var(--color-admin-muted)] mb-4">{noPostsLabel}</p>
                    <Link
                        href={createFirstHref}
                        className="inline-flex items-center px-4 py-2 bg-[var(--color-admin-accent)] text-white rounded-lg font-medium hover:bg-[var(--color-admin-accent-hover)] transition-colors"
                    >
                        {createFirstLabel}
                    </Link>
                </div>
            ) : (
                <ul className="divide-y divide-[var(--color-admin-border)]">
                    {posts.map((post) => (
                        <li key={post.id}>
                            <Link
                                href={`/admin/posts/${post.id}`}
                                className="flex items-center justify-between px-6 py-4 hover:bg-[var(--color-admin-surface)] transition-colors"
                            >
                                <div className="flex-1 min-w-0 mr-4">
                                    <p className="text-sm font-medium text-[var(--color-admin-text)] truncate">
                                        {post.title}
                                    </p>
                                    <p className="text-xs text-[var(--color-admin-muted)] mt-0.5">
                                        {post.profiles?.full_name || 'Autor desconhecido'} • {formatDate(post.updated_at)}
                                    </p>
                                </div>
                                <StatusBadge status={post.status} />
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
