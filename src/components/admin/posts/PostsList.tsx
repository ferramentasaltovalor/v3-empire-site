'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Edit, Eye, Trash2, Plus, Search } from 'lucide-react'
import { DataTable, Column } from '@/components/admin/ui/DataTable'
import { StatusBadge, StatusType } from '@/components/admin/ui/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { adminContent } from '@/content/admin'
import { formatRelativeDate } from '@/lib/utils/format'
import { deletePostAction } from '@/app/(admin)/admin/posts/actions'
import type { PostWithAuthor } from '@/lib/admin/posts'
import type { PostCategory } from '@/types/database'

interface PostsListProps {
    posts: PostWithAuthor[]
    categories: PostCategory[]
    total: number
    currentStatus?: string
    searchQuery?: string
}

const statusFilters = [
    { label: 'Todos', value: '' },
    { label: 'Rascunhos', value: 'draft' },
    { label: 'Publicados', value: 'published' },
    { label: 'Agendados', value: 'scheduled' },
    { label: 'Arquivados', value: 'archived' },
]

export function PostsList({ posts, categories, total, currentStatus, searchQuery }: PostsListProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [search, setSearch] = useState(searchQuery || '')
    const [deleting, setDeleting] = useState<string | null>(null)

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams(searchParams.toString())
        if (search) {
            params.set('search', search)
        } else {
            params.delete('search')
        }
        router.push(`/admin/posts?${params.toString()}`)
    }, [search, searchParams, router])

    const handleStatusFilter = (status: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (status) {
            params.set('status', status)
        } else {
            params.delete('status')
        }
        if (search) {
            params.set('search', search)
        }
        router.push(`/admin/posts?${params.toString()}`)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja mover este post para a lixeira?')) {
            return
        }

        setDeleting(id)
        try {
            await deletePostAction(id)
            router.refresh()
        } catch (error) {
            console.error('Error deleting post:', error)
            alert('Erro ao excluir post')
        } finally {
            setDeleting(null)
        }
    }

    const columns: Column<PostWithAuthor>[] = [
        {
            key: 'title',
            label: adminContent.posts.table.title,
            render: (post) => (
                <div className="flex items-center gap-3">
                    {post.cover_image_url ? (
                        <img
                            src={post.cover_image_url}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-lg bg-[var(--color-admin-surface)] flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-semibold text-[var(--color-admin-muted)]">
                                {post.title.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                    <div className="min-w-0">
                        <div className="font-medium text-[var(--color-admin-text)] truncate">
                            {post.title}
                        </div>
                        <div className="text-sm text-[var(--color-admin-muted)] truncate">
                            /blog/{post.slug}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'status',
            label: adminContent.posts.table.status,
            render: (post) => <StatusBadge status={post.status as StatusType} />,
        },
        {
            key: 'author',
            label: adminContent.posts.table.author,
            render: (post) => (
                <span className="text-[var(--color-admin-text)]">
                    {post.profiles?.full_name || '—'}
                </span>
            ),
        },
        {
            key: 'updated_at',
            label: adminContent.posts.table.date,
            render: (post) => (
                <span className="text-sm text-[var(--color-admin-muted)]">
                    {formatRelativeDate(post.updated_at)}
                </span>
            ),
        },
    ]

    const actions = (post: PostWithAuthor) => (
        <div className="flex items-center justify-end gap-1">
            {post.status === 'published' && (
                <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-[var(--color-admin-muted)] hover:text-[var(--color-admin-accent)] transition-colors"
                    title="Ver post"
                >
                    <Eye className="w-4 h-4" />
                </a>
            )}
            <Link
                href={`/admin/posts/${post.id}`}
                className="p-2 text-[var(--color-admin-muted)] hover:text-[var(--color-admin-accent)] transition-colors"
                title="Editar"
            >
                <Edit className="w-4 h-4" />
            </Link>
            <button
                onClick={() => handleDelete(post.id)}
                disabled={deleting === post.id}
                className="p-2 text-[var(--color-admin-muted)] hover:text-red-600 transition-colors disabled:opacity-50"
                title="Mover para lixeira"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    )

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-admin-muted)]" />
                        <Input
                            type="search"
                            placeholder={adminContent.generic.search}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 w-full sm:w-64"
                        />
                    </div>
                    <Button type="submit" variant="secondary">
                        Buscar
                    </Button>
                </form>

                <div className="flex flex-wrap gap-2">
                    {statusFilters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => handleStatusFilter(filter.value)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentStatus === filter.value || (!currentStatus && !filter.value)
                                ? 'bg-[var(--color-admin-accent)] text-white'
                                : 'bg-[var(--color-admin-surface)] text-[var(--color-admin-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-border)]'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-[var(--color-admin-muted)]">
                {total} {total === 1 ? 'post encontrado' : 'posts encontrados'}
            </div>

            {/* Table */}
            {posts.length === 0 ? (
                <div className="bg-[var(--color-admin-bg)] border border-[var(--color-admin-border)] rounded-xl p-12 text-center">
                    <div className="max-w-md mx-auto space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-admin-surface)] flex items-center justify-center">
                            <Plus className="w-8 h-8 text-[var(--color-admin-muted)]" />
                        </div>
                        <h3 className="text-lg font-medium text-[var(--color-admin-text)]">
                            {adminContent.posts.empty.title}
                        </h3>
                        <p className="text-[var(--color-admin-muted)]">
                            {adminContent.posts.empty.description}
                        </p>
                        <Link href="/admin/posts/novo">
                            <Button variant="premium">
                                <Plus className="w-4 h-4 mr-2" />
                                {adminContent.posts.empty.action}
                            </Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <DataTable
                    columns={columns as unknown as Column<Record<string, unknown>>[]}
                    data={posts as unknown as Record<string, unknown>[]}
                    keyField="id"
                    actions={actions as unknown as (item: Record<string, unknown>) => React.ReactNode}
                    emptyMessage={adminContent.posts.empty.title}
                />
            )}
        </div>
    )
}
