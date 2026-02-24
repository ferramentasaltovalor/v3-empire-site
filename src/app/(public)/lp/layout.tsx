// Layout isolado para Landing Pages
// Sem Navbar/Footer — permite layouts customizados por LP

export default function LPLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[var(--color-empire-bg)] text-[var(--color-empire-text)]">
            {children}
        </div>
    )
}
