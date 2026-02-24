// Quick action buttons for dashboard
// Grid of action links with icons

import Link from 'next/link'

export interface QuickAction {
    label: string
    icon: React.ReactNode
    href: string
}

interface QuickActionsProps {
    actions: QuickAction[]
    title?: string
}

export function QuickActions({
    actions,
    title = 'Ações rápidas',
}: QuickActionsProps) {
    return (
        <div className="bg-[var(--color-admin-bg)] border border-[var(--color-admin-border)] rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[var(--color-admin-border)]">
                <h2 className="text-lg font-semibold text-[var(--color-admin-text)]">
                    {title}
                </h2>
            </div>

            {/* Actions grid */}
            <div className="grid grid-cols-2 gap-px bg-[var(--color-admin-border)]">
                {actions.map((action, index) => (
                    <Link
                        key={index}
                        href={action.href}
                        className="flex flex-col items-center justify-center gap-2 p-4 bg-[var(--color-admin-bg)] hover:bg-[var(--color-admin-surface)] group transition-colors"
                    >
                        <div className="w-10 h-10 rounded-lg bg-[var(--color-admin-accent)]/10 flex items-center justify-center text-[var(--color-admin-muted)] group-hover:text-[var(--color-admin-accent)] group-hover:bg-[var(--color-admin-accent)]/20 transition-colors">
                            {action.icon}
                        </div>
                        <span className="text-sm font-medium text-[var(--color-admin-text)] text-center">
                            {action.label}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
