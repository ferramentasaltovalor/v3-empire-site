// src/components/public/blog/PostContent.tsx
// Post content renderer — Design System Empire Gold

import React from 'react'

export interface PostContentProps {
    content: Record<string, unknown> | null
    contentHtml: string | null
}

export function PostContent({ contentHtml }: PostContentProps) {
    // For now, we render the HTML content directly
    // In the future, we can implement a TipTap JSON renderer for more control

    if (!contentHtml) {
        return (
            <div className="text-center py-8">
                <p className="text-[var(--color-empire-muted)]">Conteúdo não disponível.</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div
                className="prose prose-invert prose-lg max-w-none
          prose-headings:font-display prose-headings:text-[var(--color-empire-text)] prose-headings:font-bold
          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-[var(--color-empire-border)]
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
          prose-p:text-[var(--color-empire-text)] prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-[var(--color-empire-gold)] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-[var(--color-empire-text)] prose-strong:font-semibold
          prose-blockquote:border-l-[var(--color-empire-gold)] prose-blockquote:bg-[var(--color-empire-card)] prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-sm prose-blockquote:not-italic prose-blockquote:text-[var(--color-empire-muted)]
          prose-ul:text-[var(--color-empire-text)] prose-ul:my-6 prose-ul:space-y-2
          prose-ol:text-[var(--color-empire-text)] prose-ol:my-6 prose-ol:space-y-2
          prose-li:marker:text-[var(--color-empire-gold)]
          prose-code:text-[var(--color-empire-gold)] prose-code:bg-[var(--color-empire-card)] prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-[var(--color-empire-card)] prose-pre:border prose-pre:border-[var(--color-empire-border)] prose-pre:rounded-sm
          prose-hr:border-[var(--color-empire-border)] prose-hr:my-12
          prose-img:rounded-sm prose-img:shadow-lg
        "
                dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
        </div>
    )
}
