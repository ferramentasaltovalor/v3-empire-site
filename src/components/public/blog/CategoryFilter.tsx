// src/components/public/blog/CategoryFilter.tsx
// Category filter pills — Design System Empire Gold

'use client'

import React from 'react'
import Link from 'next/link'
import { blogContent } from '@/content/blog'
import type { PostCategory } from '@/types/database'

export interface CategoryFilterProps {
    categories: PostCategory[]
    activeCategory?: string
}

export function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
    const { listing } = blogContent

    return (
        <div className="mb-8">
            <label className="block text-sm text-[var(--color-empire-muted)] mb-3">
                {listing.categoriesLabel}
            </label>
            <div className="flex flex-wrap gap-2">
                {/* "All" button */}
                <Link
                    href="/blog"
                    className={`px-4 py-2 text-sm font-medium rounded-sm transition-all duration-300 ${!activeCategory
                            ? 'bg-[var(--color-empire-gold)] text-[var(--color-empire-bg)]'
                            : 'bg-[var(--color-empire-card)] text-[var(--color-empire-text)] border border-[var(--color-empire-border)] hover:border-[var(--color-empire-gold)]/50'
                        }`}
                >
                    {listing.allCategories}
                </Link>

                {/* Category buttons */}
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/blog/categoria/${category.slug}`}
                        className={`px-4 py-2 text-sm font-medium rounded-sm transition-all duration-300 ${activeCategory === category.slug
                                ? 'bg-[var(--color-empire-gold)] text-[var(--color-empire-bg)]'
                                : 'bg-[var(--color-empire-card)] text-[var(--color-empire-text)] border border-[var(--color-empire-border)] hover:border-[var(--color-empire-gold)]/50'
                            }`}
                    >
                        {category.name}
                    </Link>
                ))}
            </div>
        </div>
    )
}
