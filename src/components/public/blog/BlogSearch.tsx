// src/components/public/blog/BlogSearch.tsx
// Search input for blog — Design System Empire Gold
// Placeholder for future implementation

'use client'

import React, { useState } from 'react'
import { Search, X } from 'lucide-react'
import { blogContent } from '@/content/blog'

export interface BlogSearchProps {
    placeholder?: string
    onSearch?: (query: string) => void
}

export function BlogSearch({ placeholder, onSearch }: BlogSearchProps) {
    const [query, setQuery] = useState('')
    const { listing } = blogContent

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (onSearch && query.trim()) {
            onSearch(query.trim())
        }
    }

    const handleClear = () => {
        setQuery('')
        if (onSearch) {
            onSearch('')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="relative max-w-md">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-empire-muted)]" />

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder || listing.searchPlaceholder}
                    className="w-full pl-12 pr-10 py-3 bg-[var(--color-empire-card)] border border-[var(--color-empire-border)] rounded-sm text-[var(--color-empire-text)] placeholder:text-[var(--color-empire-muted)] focus:outline-none focus:border-[var(--color-empire-gold)] transition-colors"
                />

                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-empire-muted)] hover:text-[var(--color-empire-text)] transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>
        </form>
    )
}
