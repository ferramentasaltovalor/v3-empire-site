import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createPostAction } from '@/app/(admin)/admin/posts/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { adminContent } from '@/content/admin'

export default function NovoPostPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
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
            {adminContent.posts.newPost}
          </h1>
          <p className="text-[var(--color-admin-muted)]">
            Digite o título para criar um novo rascunho
          </p>
        </div>
      </div>

      {/* Form */}
      <form action={createPostAction} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título do post</Label>
          <Input
            id="title"
            name="title"
            placeholder="Ex: 10 estratégias para crescer seu negócio"
            required
            className="text-lg"
            autoFocus
          />
          <p className="text-sm text-[var(--color-admin-muted)]">
            O slug (URL) será gerado automaticamente a partir do título
          </p>
        </div>

        <div className="flex gap-4">
          <Button type="submit" variant="premium">
            Criar rascunho
          </Button>
          <Link href="/admin/posts">
            <Button type="button" variant="ghost">
              {adminContent.generic.cancel}
            </Button>
          </Link>
        </div>
      </form>

      {/* Tips */}
      <div className="bg-[var(--color-admin-surface)] border border-[var(--color-admin-border)] rounded-xl p-6 space-y-4">
        <h3 className="font-medium text-[var(--color-admin-text)]">
          Dicas para um bom título
        </h3>
        <ul className="space-y-2 text-sm text-[var(--color-admin-muted)]">
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-admin-accent)]">•</span>
            Seja específico e claro sobre o assunto do post
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-admin-accent)]">•</span>
            Use palavras-chave relevantes para SEO
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-admin-accent)]">•</span>
            Evite títulos muito longos (ideal: 50-60 caracteres)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-admin-accent)]">•</span>
            Você pode editar o título depois de criar o rascunho
          </li>
        </ul>
      </div>
    </div>
  )
}
