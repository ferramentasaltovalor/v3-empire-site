// Dashboard do admin - G03-T01
// Server Component que busca dados do Supabase

import { StatsGrid, type StatItem } from '@/components/admin/dashboard'
import { RecentPostsList, type RecentPost } from '@/components/admin/dashboard'
import { QuickActions, type QuickAction } from '@/components/admin/dashboard'
import { ActivityFeed, type Activity } from '@/components/admin/dashboard'
import { getDashboardStats, getRecentPosts, getRecentActivity } from '@/lib/admin/dashboard'
import { adminContent } from '@/content/admin'

// Icons for stats
function PublishedIcon() {
    return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    )
}

function DraftIcon() {
    return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    )
}

function ScheduledIcon() {
    return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    )
}

function MediaIcon() {
    return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    )
}

function AIIcon() {
    return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
    )
}

// Icons for quick actions
function NewPostIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    )
}

function NewPageIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    )
}

function UploadIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
    )
}

function ViewSiteIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
    )
}

export default async function AdminDashboardPage() {
    // Fetch data from Supabase
    const stats = await getDashboardStats()
    const recentPosts = await getRecentPosts(5)
    const activities = await getRecentActivity(10)

    // Prepare stats for display
    const statsItems: StatItem[] = [
        {
            title: adminContent.dashboard.stats.publishedPosts,
            value: stats.publishedPosts,
            icon: <PublishedIcon />,
        },
        {
            title: adminContent.dashboard.stats.draftPosts,
            value: stats.draftPosts,
            icon: <DraftIcon />,
        },
        {
            title: adminContent.dashboard.stats.scheduledPosts,
            value: stats.scheduledPosts,
            icon: <ScheduledIcon />,
        },
        {
            title: adminContent.dashboard.stats.mediaItems,
            value: stats.mediaItems,
            icon: <MediaIcon />,
        },
        {
            title: adminContent.dashboard.stats.aiGenerations,
            value: stats.aiGenerations,
            icon: <AIIcon />,
        },
    ]

    // Quick actions
    const quickActions: QuickAction[] = [
        {
            label: adminContent.dashboard.quickActions.newPost,
            icon: <NewPostIcon />,
            href: '/admin/posts/novo',
        },
        {
            label: adminContent.dashboard.quickActions.newLandingPage,
            icon: <NewPageIcon />,
            href: '/admin/landing-pages/nova',
        },
        {
            label: adminContent.dashboard.quickActions.uploadMedia,
            icon: <UploadIcon />,
            href: '/admin/midia',
        },
        {
            label: adminContent.dashboard.quickActions.viewSite,
            icon: <ViewSiteIcon />,
            href: '/',
        },
    ]

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-semibold text-[var(--color-admin-text)]">
                    {adminContent.dashboard.title}
                </h1>
                <p className="text-[var(--color-admin-muted)]">
                    {adminContent.dashboard.subtitle}
                </p>
            </div>

            {/* Stats grid */}
            <StatsGrid stats={statsItems} />

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent posts - takes 2 columns on desktop */}
                <div className="lg:col-span-2">
                    <RecentPostsList
                        posts={recentPosts as RecentPost[]}
                        title={adminContent.dashboard.recentPosts.title}
                        viewAllLabel={adminContent.dashboard.recentPosts.viewAll}
                        noPostsLabel={adminContent.dashboard.recentPosts.noPosts}
                        createFirstLabel={adminContent.dashboard.recentPosts.createFirst}
                    />
                </div>

                {/* Sidebar - quick actions and activity */}
                <div className="space-y-8">
                    <QuickActions
                        actions={quickActions}
                        title={adminContent.dashboard.quickActions.title}
                    />
                    <ActivityFeed
                        activities={activities as Activity[]}
                        title={adminContent.dashboard.activity.title}
                        noActivityLabel={adminContent.dashboard.activity.noActivity}
                    />
                </div>
            </div>
        </div>
    )
}
