// src/components/public/blog/RelatedPosts.tsx
// Related posts section — Design System Empire Gold

'use client'

import React from 'react'
import { blogContent } from '@/content/blog'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { PostCard } from './PostCard'
import type { PostWithAuthor } from '@/lib/blog/posts'

export interface RelatedPostsProps {
    posts: PostWithAuthor[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
    const { ref, isVisible } = useScrollAnimation()
    const { post: content } = blogContent

    if (!posts || posts.length === 0) {
        return null
    }

    return (
        <section ref={ref} className="py-16 bg-[var(--color-empire-surface)]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section title */}
                <h2
                    className={`font-display text-2xl sm:text-3xl font-bold text-[var(--color-empire-text)] mb-8 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                >
                    {content.relatedPosts}
                </h2>

                {/* Posts grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {posts.map((post, index) => (
                        <div
                            key={post.id}
                            className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                            style={{ transitionDelay: `${200 + index * 100}ms` }}
                        >
                            <PostCard post={post} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
