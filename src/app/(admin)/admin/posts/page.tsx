import { Suspense } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getPosts, getCategories } from '@/lib/admin/posts'
import { PostsList } from '@/components/admin/posts/PostsList'
import { Button } from '@/components/ui/button'
import { adminContent } from '@/content/admin'
import type { PostStatus } from '@/types/database'

interface PostsPageProps {
  searchParams: Promise<{ status?: string; search?: string }>
}

async function PostsContent({ searchParams }: PostsPageProps) {
  const params = await searchParams
  const { posts, total } = await getPosts({
    status: params.status as PostStatus | undefined,
    search: params.search,
  })
  const categories = await getCategories()

  return (
    <PostsList
      posts={posts}
      categories={categories}
      total={total}
      currentStatus={params.status}
      searchQuery={params.search}
    />
  )
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-admin-text)]">
            {adminContent.posts.title}
          </h1>
          <p className="text-[var(--color-admin-muted)]">
            {adminContent.posts.subtitle}
          </p>
        </div>
        <Link href="/admin/posts/novo">
          <Button variant="premium">
            <Plus className="w-4 h-4 mr-2" />
            {adminContent.posts.newPost}
          </Button>
        </Link>
      </div>

      {/* Posts List */}
      <Suspense fallback={<div className="text-[var(--color-admin-muted)]">Carregando...</div>}>
        <PostsContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
