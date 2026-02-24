// src/components/public/blog/PostHero.tsx
// Hero section for individual post — Design System Empire Gold

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react'
import { blogContent } from '@/content/blog'
import type { PostWithDetails } from '@/lib/blog/posts'

export interface PostHeroProps {
    post: PostWithDetails
}

/**
 * Formats a date string to Brazilian Portuguese format
 */
function formatDate(dateString: string | null): string {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    })
}

/**
 * Get the first category from a post
 */
function getPrimaryCategory(post: PostWithDetails): { name: string; slug: string } | null {
    const categories = post.posts_categories
    if (!categories || categories.length === 0) return null
    return categories[0].post_categories
}

export function PostHero({ post }: PostHeroProps) {
    const category = getPrimaryCategory(post)
    const author = post.profiles
    const { post: content } = blogContent

    return (
        <section className="relative">
            {/* Cover Image */}
            {post.cover_image_url && (
                <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
                    <Image
                        src={post.cover_image_url}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-empire-bg)] via-[var(--color-empire-bg)]/50 to-transparent" />
                </div>
            )}

            {/* Content */}
            <div
                className={`relative ${post.cover_image_url ? '-mt-32' : 'mt-0'} z-10 container mx-auto px-4 sm:px-6 lg:px-8`}
            >
                <div className="max-w-4xl mx-auto">
                    {/* Back link */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm text-[var(--color-empire-muted)] hover:text-[var(--color-empire-gold)] transition-colors mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {content.backToBlog}
                    </Link>

                    {/* Category Badge */}
                    {category && (
                        <Link
                            href={`/blog/categoria/${category.slug}`}
                            className="inline-block text-xs font-medium tracking-wider uppercase text-[var(--color-empire-gold)] bg-[var(--color-empire-card)]/80 backdrop-blur-sm px-4 py-2 rounded-sm mb-6 hover:bg-[var(--color-empire-gold)] hover:text-[var(--color-empire-bg)] transition-all"
                        >
                            {category.name}
                        </Link>
                    )}

                    {/* Title */}
                    <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-empire-text)] mb-6 leading-tight">
                        {post.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--color-empire-muted)]">
                        {/* Author */}
                        {author && (
                            <div className="flex items-center gap-2">
                                {author.avatar_url ? (
                                    <Image
                                        src={author.avatar_url}
                                        alt={author.full_name || 'Author'}
                                        width={40}
                                        height={40}
                                        className="rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-[var(--color-empire-border)] flex items-center justify-center">
                                        <User className="h-5 w-5 text-[var(--color-empire-muted)]" />
                                    </div>
                                )}
                                <div>
                                    <span className="block text-[var(--color-empire-text)] font-medium">
                                        {author.full_name || 'Autor'}
                                    </span>
                                    <span className="text-xs">{content.writtenBy}</span>
                                </div>
                            </div>
                        )}

                        {/* Date */}
                        {post.published_at && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    {content.publishedOn} {formatDate(post.published_at)}
                                </span>
                            </div>
                        )}

                        {/* Reading Time */}
                        {post.reading_time_minutes > 0 && (
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>
                                    {post.reading_time_minutes} {content.readingTime}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
