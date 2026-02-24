// Recent activity feed component
// Shows activity type, description, and relative timestamp

export interface Activity {
    id: string
    type: 'post' | 'page' | 'media' | 'user' | 'settings'
    action: string
    description: string
    timestamp: string
}

interface ActivityFeedProps {
    activities: Activity[]
    title?: string
    noActivityLabel?: string
    maxItems?: number
}

const activityIcons: Record<Activity['type'], React.ReactNode> = {
    post: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    page: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
    ),
    media: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    user: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    settings: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
}

const activityColors: Record<Activity['type'], string> = {
    post: 'bg-blue-50 text-blue-600',
    page: 'bg-purple-50 text-purple-600',
    media: 'bg-green-50 text-green-600',
    user: 'bg-orange-50 text-orange-600',
    settings: 'bg-gray-50 text-gray-600',
}

function getRelativeTime(timestamp: string): string {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSeconds < 60) {
        return 'Agora mesmo'
    } else if (diffMinutes < 60) {
        return `${diffMinutes} min atrás`
    } else if (diffHours < 24) {
        return `${diffHours}h atrás`
    } else if (diffDays === 1) {
        return 'Ontem'
    } else if (diffDays < 7) {
        return `${diffDays} dias atrás`
    } else {
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
        })
    }
}

export function ActivityFeed({
    activities,
    title = 'Atividade recente',
    noActivityLabel = 'Nenhuma atividade recente',
    maxItems = 10,
}: ActivityFeedProps) {
    const displayedActivities = activities.slice(0, maxItems)

    return (
        <div className="bg-[var(--color-admin-bg)] border border-[var(--color-admin-border)] rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[var(--color-admin-border)]">
                <h2 className="text-lg font-semibold text-[var(--color-admin-text)]">
                    {title}
                </h2>
            </div>

            {/* Content */}
            {displayedActivities.length === 0 ? (
                <div className="px-6 py-8 text-center">
                    <p className="text-sm text-[var(--color-admin-muted)]">{noActivityLabel}</p>
                </div>
            ) : (
                <ul className="divide-y divide-[var(--color-admin-border)]">
                    {displayedActivities.map((activity) => (
                        <li key={activity.id} className="px-6 py-3">
                            <div className="flex items-start gap-3">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${activityColors[activity.type]}`}>
                                    {activityIcons[activity.type]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-[var(--color-admin-text)]">
                                        {activity.description}
                                    </p>
                                    <p className="text-xs text-[var(--color-admin-muted)] mt-0.5">
                                        {getRelativeTime(activity.timestamp)}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
