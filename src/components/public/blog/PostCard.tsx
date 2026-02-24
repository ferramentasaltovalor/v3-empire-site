// src/components/public/blog/PostCard.tsx
// Blog post card for grid display — Design System Empire Gold

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, User } from 'lucide-react'
import { blogContent } from '@/content/blog'
import type { PostWithAuthor } from '@/lib/blog/posts'

export interface PostCardProps {
    post: PostWithAuthor
}

/**
 * Formats a date string to Brazilian Portuguese format
 */
function formatDate(dateString: string | null): string {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

/**
 * Get the first category from a post
 */
function getPrimaryCategory(post: PostWithAuthor): { name: string; slug: string } | null {
    const categories = post.posts_categories
    if (!categories || categories.length === 0) return null
    return categories[0].post_categories
}

export function PostCard({ post }: PostCardProps) {
    const category = getPrimaryCategory(post)
    const author = post.profiles
    const { listing } = blogContent

    return (
        <Link href={`/blog/${post.slug}`} className="group block h-full">
            <article className="h-full bg-[var(--color-empire-card)] border border-[var(--color-empire-border)] rounded-sm overflow-hidden transition-all duration-300 hover:border-[var(--color-empire-gold)]/50 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                {/* Cover Image */}
                <div className="aspect-[16/9] relative overflow-hidden bg-gradient-to-br from-[var(--color-empire-gold)]/10 to-transparent">
                    {post.cover_image_url ? (
                        <Image
                            src={post.cover_image_url}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs uppercase tracking-wider text-[var(--color-empire-gold)]/50">
                                Imagem
                            </span>
                        </div>
                    )}

                    {/* Category Badge */}
                    {category && (
                        <span className="absolute top-4 left-4 text-xs font-medium tracking-wider uppercase text-[var(--color-empire-gold)] bg-[var(--color-empire-bg)]/80 backdrop-blur-sm px-3 py-1 rounded-sm">
                            {category.name}
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-[var(--color-empire-muted)] mb-4">
                        {post.published_at && (
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(post.published_at)}
                            </span>
                        )}
                        {post.reading_time_minutes > 0 && (
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {post.reading_time_minutes} {listing.readMore === 'Ler mais' ? 'min' : 'min'}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-xl font-semibold text-[var(--color-empire-text)] mb-3 group-hover:text-[var(--color-empire-gold)] transition-colors line-clamp-2">
                        {post.title}
                    </h3>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className="text-sm text-[var(--color-empire-muted)] leading-relaxed line-clamp-2 mb-4">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Author */}
                    {author && (
                        <div className="flex items-center gap-2 pt-4 border-t border-[var(--color-empire-border)]">
                            {author.avatar_url ? (
                                <Image
                                    src={author.avatar_url}
                                    alt={author.full_name || 'Author'}
                                    width={32}
                                    height={32}
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-[var(--color-empire-border)] flex items-center justify-center">
                                    <User className="h-4 w-4 text-[var(--color-empire-muted)]" />
                                </div>
                            )}
                            <span className="text-sm text-[var(--color-empire-muted)]">
                                {author.full_name || 'Autor'}
                            </span>
                        </div>
                    )}
                </div>
            </article>
        </Link>
    )
}
