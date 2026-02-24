// src/components/public/blog/PostGrid.tsx
// Grid of PostCards with stagger animation — Design System Empire Gold

'use client'

import React from 'react'
import { PostCard } from './PostCard'
import { blogContent } from '@/content/blog'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import type { PostWithAuthor } from '@/lib/blog/posts'

export interface PostGridProps {
    posts: PostWithAuthor[]
}

export function PostGrid({ posts }: PostGridProps) {
    const { ref, isVisible } = useScrollAnimation()
    const { listing } = blogContent

    if (posts.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-[var(--color-empire-muted)] text-lg">{listing.noPosts}</p>
            </div>
        )
    }

    return (
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {posts.map((post, index) => (
                <div
                    key={post.id}
                    className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                >
                    <PostCard post={post} />
                </div>
            ))}
        </div>
    )
}
