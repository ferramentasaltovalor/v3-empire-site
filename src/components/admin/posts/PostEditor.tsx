'use client'

import { useState, useTransition, useCallback, Suspense, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { ArrowLeft, Save, Trash2, Eye, Send, Clock, Archive, FileText, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { StatusBadge, StatusType } from '@/components/admin/ui/StatusBadge'
import {
    updatePostAction,
    deletePostAction,
    publishPostAction,
    unpublishPostAction,
    archivePostAction,
} from '@/app/(admin)/admin/posts/actions'
import { adminContent } from '@/content/admin'
import { formatDate, formatRelativeDate } from '@/lib/utils/format'
import { createClient } from '@/lib/supabase/client'
import { AIGeneratorPanel } from '@/components/admin/ai'
import { SEOPanel } from '@/components/admin/seo'
import type { TipTapEditorRef } from '@/components/admin/editor'
import type { PostWithDetails } from '@/lib/admin/posts'
import type { PostCategory, PostTag } from '@/types/database'
import type { JSONContent } from '@tiptap/react'

// Dynamic import for TipTap editor to reduce bundle size
const TipTapEditor = dynamic(
    () => import('@/components/admin/editor/TipTapEditor').then((mod) => mod.TipTapEditor),
    {
        ssr: false,
        loading: () => (
            <div className="border border-[var(--color-admin-border)] rounded-lg p-8 text-center bg-[var(--color-admin-surface)]">
                <Loader2 className="w-8 h-8 mx-auto text-[var(--color-admin-accent)] animate-spin mb-4" />
                <p className="text-[var(--color-admin-muted)]">Carregando editor...</p>
            </div>
        )
    }
)

interface PostEditorProps {
    post: PostWithDetails
    categories: PostCategory[]
    tags: PostTag[]
}

export function PostEditor({ post, categories, tags }: PostEditorProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [title, setTitle] = useState(post.title)
    const [slug, setSlug] = useState(post.slug)
    const [excerpt, setExcerpt] = useState(post.excerpt || '')
    const [seoTitle, setSeoTitle] = useState(post.seo_title || '')
    const [seoDescription, setSeoDescription] = useState(post.seo_description || '')
    const [seoKeywords, setSeoKeywords] = useState<string[]>([])
    const [saved, setSaved] = useState(false)
    const [content, setContent] = useState<object | null>(post.content as JSONContent | null)
    const [isAIPanelOpen, setIsAIPanelOpen] = useState(false)
    const editorRef = useRef<TipTapEditorRef>(null)

    // Handle content changes from TipTap editor
    const handleContentChange = useCallback((newContent: object) => {
        setContent(newContent)
    }, [])

    // Handle image upload to Supabase Storage
    const handleImageUpload = useCallback(async (file: File): Promise<string> => {
        const supabase = createClient()
        const fileExt = file.name.split('.').pop()
        const fileName = `${post.id}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('post-images')
            .upload(fileName, file)

        if (uploadError) {
            console.error('Error uploading image:', uploadError)
            throw new Error('Falha ao fazer upload da imagem')
        }

        const { data: { publicUrl } } = supabase.storage
            .from('post-images')
            .getPublicUrl(fileName)

        return publicUrl
    }, [post.id])

    const handleSave = (formData: FormData) => {
        // Add content as JSON string to form data
        formData.set('content', JSON.stringify(content))

        startTransition(async () => {
            const result = await updatePostAction(post.id, formData)
            if (result.success) {
                setSaved(true)
                setTimeout(() => setSaved(false), 2000)
            } else if (result.error) {
                alert(result.error)
            }
        })
    }

    const handleDelete = () => {
        if (!confirm('Tem certeza que deseja mover este post para a lixeira?')) {
            return
        }

        startTransition(async () => {
            const result = await deletePostAction(post.id)
            if (result.success) {
                router.push('/admin/posts')
            } else if (result.error) {
                alert(result.error)
            }
        })
    }

    const handlePublish = () => {
        if (!confirm('Publicar este post agora?')) {
            return
        }

        startTransition(async () => {
            const result = await publishPostAction(post.id)
            if (result.success) {
                router.refresh()
            } else if (result.error) {
                alert(result.error)
            }
        })
    }

    const handleUnpublish = () => {
        if (!confirm('Voltar para rascunho?')) {
            return
        }

        startTransition(async () => {
            const result = await unpublishPostAction(post.id)
            if (result.success) {
                router.refresh()
            } else if (result.error) {
                alert(result.error)
            }
        })
    }

    const handleArchive = () => {
        if (!confirm('Arquivar este post?')) {
            return
        }

        startTransition(async () => {
            const result = await archivePostAction(post.id)
            if (result.success) {
                router.refresh()
            } else if (result.error) {
                alert(result.error)
            }
        })
    }

    // Handle AI content insertion
    const handleAIInsert = useCallback((aiContent: string) => {
        if (editorRef.current) {
            editorRef.current.insertContent(aiContent)
        }
    }, [])

    // Get selected text from editor for AI context
    const getSelectedText = useCallback(() => {
        if (editorRef.current) {
            return editorRef.current.getSelectedText()
        }
        return ''
    }, [])

    // Extract plain text from TipTap JSON content for SEO analysis
    const getPlainTextContent = useCallback((jsonContent: object | null): string => {
        if (!jsonContent) return ''

        const extractText = (node: unknown): string => {
            if (typeof node === 'string') return node
            if (!node || typeof node !== 'object') return ''

            const nodeObj = node as Record<string, unknown>
            let text = ''

            // If node has text property
            if (nodeObj.text && typeof nodeObj.text === 'string') {
                text = nodeObj.text
            }

            // If node has content array, recursively extract
            if (Array.isArray(nodeObj.content)) {
                text += nodeObj.content.map(extractText).join(' ')
            }

            return text
        }

        return extractText(jsonContent)
    }, [])

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-6">
                <form action={handleSave} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input
                            id="title"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Título do post"
                            className="text-lg"
                        />
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-[var(--color-admin-muted)]">/blog/</span>
                            <Input
                                id="slug"
                                name="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="slug-do-post"
                                className="flex-1"
                            />
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                        <Label htmlFor="excerpt">Resumo</Label>
                        <Textarea
                            id="excerpt"
                            name="excerpt"
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="Breve descrição do post (aparece nas listagens e SEO)"
                            rows={3}
                        />
                        <p className="text-xs text-[var(--color-admin-muted)]">
                            {excerpt.length}/160 caracteres (recomendado para SEO)
                        </p>
                    </div>

                    {/* Content Editor */}
                    <div className="space-y-2">
                        <Label>Conteúdo</Label>
                        <TipTapEditor
                            ref={editorRef}
                            content={content}
                            onChange={handleContentChange}
                            onImageUpload={handleImageUpload}
                            placeholder="Comece a escrever seu post aqui..."
                        />
                    </div>

                    {/* SEO Panel with AI */}
                    <SEOPanel
                        title={title}
                        content={getPlainTextContent(content)}
                        keywords={seoKeywords}
                        onTitleChange={setSeoTitle}
                        onDescriptionChange={setSeoDescription}
                        onKeywordsChange={setSeoKeywords}
                        metaTitle={seoTitle}
                        metaDescription={seoDescription}
                    />

                    {/* Hidden fields for form submission */}
                    <input type="hidden" name="seo_title" value={seoTitle} />
                    <input type="hidden" name="seo_description" value={seoDescription} />

                    {/* Actions */}
                    <div className="flex flex-wrap gap-4">
                        <Button type="submit" variant="premium" disabled={isPending}>
                            <Save className="w-4 h-4 mr-2" />
                            {saved ? 'Salvo!' : 'Salvar'}
                        </Button>
                        {post.status === 'published' && (
                            <a
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button type="button" variant="secondary" disabled={isPending}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Ver post
                                </Button>
                            </a>
                        )}
                    </div>
                </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {/* Status Card */}
                <div className="bg-[var(--color-admin-surface)] border border-[var(--color-admin-border)] rounded-xl p-4 space-y-4">
                    <h3 className="font-medium text-[var(--color-admin-text)]">Status</h3>
                    <StatusBadge status={post.status as StatusType} />
                    <div className="text-sm text-[var(--color-admin-muted)] space-y-1">
                        <p>
                            <span className="font-medium">Criado:</span>{' '}
                            {formatRelativeDate(post.created_at)}
                        </p>
                        <p>
                            <span className="font-medium">Atualizado:</span>{' '}
                            {formatRelativeDate(post.updated_at)}
                        </p>
                        {post.published_at && (
                            <p>
                                <span className="font-medium">Publicado:</span>{' '}
                                {formatDate(post.published_at)}
                            </p>
                        )}
                        {post.scheduled_at && (
                            <p>
                                <span className="font-medium">Agendado para:</span>{' '}
                                {formatDate(post.scheduled_at)}
                            </p>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[var(--color-admin-surface)] border border-[var(--color-admin-border)] rounded-xl p-4 space-y-4">
                    <h3 className="font-medium text-[var(--color-admin-text)]">Ações Rápidas</h3>
                    <div className="space-y-2">
                        <Button
                            variant="secondary"
                            className="w-full justify-start"
                            onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            {isAIPanelOpen ? 'Fechar IA' : 'Assistente IA'}
                        </Button>
                        {post.status === 'draft' && (
                            <Button
                                variant="secondary"
                                className="w-full justify-start"
                                onClick={handlePublish}
                                disabled={isPending}
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Publicar agora
                            </Button>
                        )}
                        {post.status === 'published' && (
                            <Button
                                variant="secondary"
                                className="w-full justify-start"
                                onClick={handleUnpublish}
                                disabled={isPending}
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Voltar para rascunho
                            </Button>
                        )}
                        {post.status !== 'archived' && (
                            <Button
                                variant="secondary"
                                className="w-full justify-start"
                                onClick={handleArchive}
                                disabled={isPending}
                            >
                                <Archive className="w-4 h-4 mr-2" />
                                Arquivar
                            </Button>
                        )}
                    </div>
                </div>

                {/* Categories */}
                <div className="bg-[var(--color-admin-surface)] border border-[var(--color-admin-border)] rounded-xl p-4 space-y-4">
                    <h3 className="font-medium text-[var(--color-admin-text)]">Categorias</h3>
                    {categories.length === 0 ? (
                        <p className="text-sm text-[var(--color-admin-muted)]">
                            Nenhuma categoria cadastrada
                        </p>
                    ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {categories.map((category) => {
                                const isSelected = post.posts_categories?.some(
                                    (pc) => pc.post_categories.id === category.id
                                )
                                return (
                                    <label
                                        key={category.id}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            name="categories"
                                            value={category.id}
                                            defaultChecked={isSelected}
                                            className="rounded border-[var(--color-admin-border)]"
                                        />
                                        <span className="text-sm text-[var(--color-admin-text)]">
                                            {category.name}
                                        </span>
                                    </label>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Tags */}
                <div className="bg-[var(--color-admin-surface)] border border-[var(--color-admin-border)] rounded-xl p-4 space-y-4">
                    <h3 className="font-medium text-[var(--color-admin-text)]">Tags</h3>
                    {tags.length === 0 ? (
                        <p className="text-sm text-[var(--color-admin-muted)]">
                            Nenhuma tag cadastrada
                        </p>
                    ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {tags.map((tag) => {
                                const isSelected = post.posts_tags?.some(
                                    (pt) => pt.post_tags.id === tag.id
                                )
                                return (
                                    <label
                                        key={tag.id}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            name="tags"
                                            value={tag.id}
                                            defaultChecked={isSelected}
                                            className="rounded border-[var(--color-admin-border)]"
                                        />
                                        <span className="text-sm text-[var(--color-admin-text)]">
                                            {tag.name}
                                        </span>
                                    </label>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="bg-[var(--color-admin-surface)] border border-[var(--color-admin-border)] rounded-xl p-4 space-y-4">
                    <h3 className="font-medium text-[var(--color-admin-text)]">Navegação</h3>
                    <div className="space-y-2">
                        <Link href="/admin/posts">
                            <Button variant="ghost" className="w-full justify-start">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Voltar para lista
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={handleDelete}
                            disabled={isPending}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Mover para lixeira
                        </Button>
                    </div>
                </div>
            </div>

            {/* AI Generator Panel */}
            <AIGeneratorPanel
                onInsert={handleAIInsert}
                selectedText={getSelectedText()}
                isOpen={isAIPanelOpen}
                onToggle={() => setIsAIPanelOpen(!isAIPanelOpen)}
            />
        </div>
    )
}
