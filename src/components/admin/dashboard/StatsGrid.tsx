// Grid of StatsCards - responsive layout
// 1 col mobile, 2 cols tablet, 4 cols desktop

import { StatsCard } from './StatsCard'

export interface StatItem {
    title: string
    value: string | number
    icon: React.ReactNode
    trend?: 'up' | 'down' | 'neutral'
    trendLabel?: string
}

interface StatsGridProps {
    stats: StatItem[]
}

export function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
                <StatsCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    trend={stat.trend}
                    trendLabel={stat.trendLabel}
                />
            ))}
        </div>
    )
}
