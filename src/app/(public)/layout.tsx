// Layout do site público — dark mode Empire Gold
// Inclui Navbar e Footer

import { Navbar } from '@/components/public/layout/Navbar'
import { Footer } from '@/components/public/layout/Footer'

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[var(--color-empire-bg)] text-[var(--color-empire-text)]">
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    )
}
