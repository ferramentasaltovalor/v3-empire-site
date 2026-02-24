// src/components/public/layout/Breadcrumb.tsx
// Breadcrumb do site público — Design System Empire Gold

import React from 'react'
import Link from 'next/link'

export interface BreadcrumbItem {
    label: string
    href?: string
}

export interface BreadcrumbProps {
    items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <>
            <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex items-center gap-2 text-sm">
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1

                        return (
                            <li key={index} className="flex items-center gap-2">
                                {/* Separator */}
                                {index > 0 && (
                                    <span className="text-[var(--color-empire-gold)]" aria-hidden="true">
                                        /
                                    </span>
                                )}

                                {/* Link or Text */}
                                {item.href && !isLast ? (
                                    <Link
                                        href={item.href}
                                        className={[
                                            'text-[var(--color-empire-muted)]',
                                            'hover:text-[var(--color-empire-gold)]',
                                            'transition-colors duration-200',
                                        ].join(' ')}
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span
                                        className={isLast ? 'text-[var(--color-empire-text)]' : 'text-[var(--color-empire-muted)]'}
                                        aria-current={isLast ? 'page' : undefined}
                                    >
                                        {item.label}
                                    </span>
                                )}
                            </li>
                        )
                    })}
                </ol>
            </nav>

            {/* JSON-LD BreadcrumbList schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: items.map((item, index) => ({
                            '@type': 'ListItem',
                            position: index + 1,
                            name: item.label,
                            item: item.href ? `${process.env.NEXT_PUBLIC_SITE_URL || ''}${item.href}` : undefined,
                        })),
                    }),
                }}
            />
        </>
    )
}
