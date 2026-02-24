import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getPostById, getCategories, getTags } from '@/lib/admin/posts'
import { PostEditor } from '@/components/admin/posts/PostEditor'
import { adminContent } from '@/content/admin'

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params

  const post = await getPostById(id)

  if (!post) {
    notFound()
  }

  const categories = await getCategories()
  const tags = await getTags()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-admin-muted)] hover:text-[var(--color-admin-text)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para posts
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-admin-text)]">
            Editar Post
          </h1>
          <p className="text-[var(--color-admin-muted)]">
            {post.title}
          </p>
        </div>
      </div>

      {/* Editor */}
      <PostEditor
        post={post}
        categories={categories}
        tags={tags}
      />
    </div>
  )
}
