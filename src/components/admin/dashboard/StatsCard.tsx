// Dashboard stat card component
// Displays a metric with optional trend indicator

interface StatsCardProps {
    title: string
    value: string | number
    icon: React.ReactNode
    trend?: 'up' | 'down' | 'neutral'
    trendLabel?: string
}

function TrendUpIcon() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
    )
}

function TrendDownIcon() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
    )
}

function TrendNeutralIcon() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
        </svg>
    )
}

export function StatsCard({ title, value, icon, trend, trendLabel }: StatsCardProps) {
    const getTrendStyles = () => {
        switch (trend) {
            case 'up':
                return 'text-green-600 bg-green-50'
            case 'down':
                return 'text-red-600 bg-red-50'
            case 'neutral':
                return 'text-[var(--color-admin-muted)] bg-[var(--color-admin-surface)]'
            default:
                return ''
        }
    }

    const getTrendIcon = () => {
        switch (trend) {
            case 'up':
                return <TrendUpIcon />
            case 'down':
                return <TrendDownIcon />
            case 'neutral':
                return <TrendNeutralIcon />
            default:
                return null
        }
    }

    return (
        <div className="bg-[var(--color-admin-bg)] border border-[var(--color-admin-border)] rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--color-admin-muted)] mb-1">
                        {title}
                    </p>
                    <p className="text-3xl font-semibold text-[var(--color-admin-text)] font-display">
                        {value}
                    </p>
                    {trend && trendLabel && (
                        <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${getTrendStyles()}`}>
                            {getTrendIcon()}
                            <span>{trendLabel}</span>
                        </div>
                    )}
                </div>
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[var(--color-admin-accent)]/10 flex items-center justify-center text-[var(--color-admin-accent)]">
                    {icon}
                </div>
            </div>
        </div>
    )
}
