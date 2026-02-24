// src/components/public/layout/Footer.tsx
// Footer do site público — Design System Empire Gold

import React from 'react'
import Link from 'next/link'
import { footerContent } from '@/content/footer'
import { siteContent } from '@/content/site'

export function Footer() {
    return (
        <footer className="bg-[var(--color-empire-bg)] border-t border-[var(--color-empire-border)]">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    {/* Logo + Description */}
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/"
                            className="font-display text-2xl font-semibold tracking-tight"
                        >
                            <span className="text-[var(--color-empire-text)]">{footerContent.brand.name}</span>
                            <span className="text-[var(--color-empire-gold)]">.</span>
                        </Link>
                        <p className="text-sm text-[var(--color-empire-muted)] max-w-xs">
                            {footerContent.brand.description}
                        </p>
                    </div>

                    {/* Links */}
                    <nav className="flex flex-wrap gap-6">
                        {footerContent.navigation.main.links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={[
                                    'text-sm',
                                    'text-[var(--color-empire-muted)]',
                                    'hover:text-[var(--color-empire-gold)]',
                                    'transition-colors duration-200',
                                ].join(' ')}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Copyright */}
                    <div className="flex flex-col items-start md:items-end gap-2">
                        <p className="text-xs text-[var(--color-empire-muted)]">
                            {footerContent.legal.copyright}
                        </p>
                        <div className="flex gap-4">
                            {footerContent.legal.links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={[
                                        'text-xs',
                                        'text-[var(--color-empire-muted)]',
                                        'hover:text-[var(--color-empire-gold)]',
                                        'transition-colors duration-200',
                                    ].join(' ')}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
