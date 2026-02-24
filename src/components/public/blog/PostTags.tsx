// src/components/public/blog/PostTags.tsx
// Tag list for blog posts — Design System Empire Gold

import React from 'react'
import { blogContent } from '@/content/blog'

export interface Tag {
    id: string
    name: string
    slug: string
}

export interface PostTagsProps {
    tags: Tag[]
}

export function PostTags({ tags }: PostTagsProps) {
    const { post: content } = blogContent

    if (!tags || tags.length === 0) {
        return null
    }

    return (
        <div className="max-w-4xl mx-auto mt-8 pt-6 border-t border-[var(--color-empire-border)]">
            <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-medium text-[var(--color-empire-text)]">{content.tags}:</span>
                {tags.map((tag) => (
                    <span
                        key={tag.id}
                        className="px-3 py-1 text-sm text-[var(--color-empire-gold)] border border-[var(--color-empire-gold)]/30 rounded-sm hover:border-[var(--color-empire-gold)] hover:bg-[var(--color-empire-gold)]/10 transition-all duration-300"
                    >
                        {tag.name}
                    </span>
                ))}
            </div>
        </div>
    )
}
