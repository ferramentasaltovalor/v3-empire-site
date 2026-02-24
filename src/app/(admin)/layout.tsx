// Layout do painel admin — light mode
// Inclui Sidebar e Header admin
// Responsivo: sidebar fixa no desktop, overlay no mobile

import { AdminSidebar } from '@/components/admin/layout/AdminSidebar'
import { AdminHeader } from '@/components/admin/layout/AdminHeader'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[var(--color-admin-bg)] text-[var(--color-admin-text)]">
            {/* Sidebar - fixed on desktop, overlay on mobile */}
            <AdminSidebar />

            {/* Main content area - offset by sidebar width on desktop */}
            <div className="lg:pl-72 min-h-screen flex flex-col">
                {/* Header - sticky at top */}
                <AdminHeader />

                {/* Main content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                {/* Footer - optional */}
                <footer className="py-4 px-6 border-t border-[var(--color-admin-border)] text-center text-xs text-[var(--color-admin-muted)]">
                    <span>Empire Admin © {new Date().getFullYear()}</span>
                </footer>
            </div>
        </div>
    )
}
