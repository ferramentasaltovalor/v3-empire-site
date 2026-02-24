'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/(admin)/actions'

// Page title mapping based on pathname
const pageTitles: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/posts': 'Posts',
    '/admin/posts/novo': 'Novo Post',
    '/admin/midia': 'Mídia',
    '/admin/landing-pages': 'Landing Pages',
    '/admin/landing-pages/nova': 'Nova Landing Page',
    '/admin/usuarios': 'Usuários',
    '/admin/configuracoes/geral': 'Configurações Gerais',
    '/admin/configuracoes/seo': 'Configurações de SEO',
    '/admin/configuracoes/analytics': 'Configurações de Analytics',
    '/admin/configuracoes/integracoes': 'Integrações',
    '/admin/configuracoes/webhooks': 'Webhooks',
}

function getPageTitle(pathname: string): string {
    // Check for exact match first
    if (pageTitles[pathname]) {
        return pageTitles[pathname]
    }

    // Check for edit pages (dynamic routes)
    if (pathname.match(/\/admin\/posts\/[^/]+$/)) {
        return 'Editar Post'
    }
    if (pathname.match(/\/admin\/landing-pages\/[^/]+$/)) {
        return 'Editar Landing Page'
    }

    // Default fallback
    return 'Admin'
}

function ChevronDownIcon() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    )
}

function UserIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    )
}

function LogoutIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    )
}

export function AdminHeader() {
    const pathname = usePathname()
    const pageTitle = getPageTitle(pathname)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    return (
        <header className="sticky top-0 z-30 bg-[var(--color-admin-bg)] border-b border-[var(--color-admin-border)]">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Page title */}
                <h1 className="text-xl font-semibold text-[var(--color-admin-text)]">
                    {pageTitle}
                </h1>

                {/* User menu */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--color-admin-surface)] transition-colors"
                        aria-expanded={dropdownOpen}
                        aria-haspopup="true"
                    >
                        <div className="w-8 h-8 rounded-full bg-[var(--color-admin-accent)]/20 flex items-center justify-center">
                            <UserIcon />
                        </div>
                        <span className="text-sm font-medium text-[var(--color-admin-text)] hidden sm:block">
                            Admin
                        </span>
                        <ChevronDownIcon />
                    </button>

                    {/* Dropdown menu */}
                    {dropdownOpen && (
                        <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setDropdownOpen(false)}
                            />

                            {/* Menu */}
                            <div className="absolute right-0 mt-2 w-48 z-20 bg-[var(--color-admin-bg)] border border-[var(--color-admin-border)] rounded-lg shadow-lg overflow-hidden">
                                <div className="px-4 py-3 border-b border-[var(--color-admin-border)]">
                                    <p className="text-sm font-medium text-[var(--color-admin-text)]">Administrador</p>
                                    <p className="text-xs text-[var(--color-admin-muted)]">admin@empire.com</p>
                                </div>
                                <form action={logout}>
                                    <button
                                        type="submit"
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[var(--color-admin-text)] hover:bg-[var(--color-admin-surface)] transition-colors"
                                    >
                                        <LogoutIcon />
                                        <span>Sair</span>
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
