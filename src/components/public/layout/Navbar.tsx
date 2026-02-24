'use client'
// src/components/public/layout/Navbar.tsx
// Navbar do site público — Design System Empire Gold

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { navigationContent } from '@/content/navigation'
import { useScrolled } from '@/hooks/useScrolled'
import { Button } from '@/components/ui'

export function Navbar() {
    const scrolled = useScrolled(20)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Close mobile menu on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setMobileMenuOpen(false)
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [mobileMenuOpen])

    return (
        <>
            <header
                className={[
                    'fixed top-0 left-0 right-0 z-50',
                    'h-20',
                    'border-b border-[var(--color-empire-border)]',
                    'transition-all duration-300',
                    scrolled
                        ? 'bg-[var(--color-empire-bg)]/95 backdrop-blur-md'
                        : 'bg-[var(--color-empire-bg)]/80 backdrop-blur-md',
                ].join(' ')}
            >
                <nav className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="font-display text-2xl font-semibold tracking-tight"
                    >
                        <span className="text-[var(--color-empire-text)]">Empire</span>
                        <span className="text-[var(--color-empire-gold)]">.</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navigationContent.mainLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={[
                                    'text-sm font-medium',
                                    'text-[var(--color-empire-muted)]',
                                    'hover:text-[var(--color-empire-gold)]',
                                    'transition-colors duration-200',
                                ].join(' ')}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:block">
                        <Button variant="secondary" size="sm" asChild>
                            <Link href={navigationContent.cta.href}>
                                {navigationContent.cta.label}
                            </Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        className="md:hidden p-2 text-[var(--color-empire-text)]"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-expanded={mobileMenuOpen}
                        aria-label={mobileMenuOpen ? navigationContent.mobileMenuClose : navigationContent.mobileMenuOpen}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            {mobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </nav>
            </header>

            {/* Mobile Menu Drawer */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Drawer */}
                    <div
                        className={[
                            'absolute right-0 top-0 bottom-0',
                            'w-72',
                            'bg-[var(--color-empire-bg)]',
                            'border-l border-[var(--color-empire-border)]',
                            'pt-24 px-6 pb-6',
                            'flex flex-col',
                        ].join(' ')}
                    >
                        {/* Mobile Links */}
                        <div className="flex flex-col gap-4">
                            {navigationContent.mainLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={[
                                        'text-base font-medium py-2',
                                        'text-[var(--color-empire-muted)]',
                                        'hover:text-[var(--color-empire-gold)]',
                                        'transition-colors duration-200',
                                    ].join(' ')}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile CTA */}
                        <div className="mt-auto">
                            <Button
                                variant="secondary"
                                size="md"
                                className="w-full"
                                asChild
                            >
                                <Link
                                    href={navigationContent.cta.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {navigationContent.cta.label}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
