// src/app/(admin)/admin/page.test.tsx
// Tests for Admin Dashboard Page

import { render, screen } from '@/test/utils'
import AdminDashboardPage from './page'

// Mock the dashboard data functions
jest.mock('@/lib/admin/dashboard', () => ({
  getDashboardStats: jest.fn(() => Promise.resolve({
    publishedPosts: 10,
    draftPosts: 5,
    scheduledPosts: 2,
    mediaItems: 25,
    aiGenerations: 50,
  })),
  getRecentPosts: jest.fn(() => Promise.resolve([
    {
      id: '1',
      title: 'Post 1',
      slug: 'post-1',
      status: 'published',
      created_at: '2024-01-01T00:00:00Z',
      published_at: '2024-01-01T00:00:00Z',
      categories: [{ name: 'Categoria 1' }],
    },
    {
      id: '2',
      title: 'Post 2',
      slug: 'post-2',
      status: 'draft',
      created_at: '2024-01-02T00:00:00Z',
      published_at: null,
      categories: [],
    },
  ])),
  getRecentActivity: jest.fn(() => Promise.resolve([
    {
      id: '1',
      type: 'post_created',
      description: 'Post criado',
      created_at: '2024-01-01T00:00:00Z',
    },
  ])),
}))

// Mock admin content
jest.mock('@/content/admin', () => ({
  adminContent: {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Visão geral do seu site',
      stats: {
        publishedPosts: 'Posts Publicados',
        draftPosts: 'Rascunhos',
        scheduledPosts: 'Agendados',
        mediaItems: 'Itens de Mídia',
        aiGenerations: 'Gerações IA',
      },
      quickActions: {
        title: 'Ações Rápidas',
        newPost: 'Novo Post',
        newLandingPage: 'Nova Landing Page',
        uploadMedia: 'Upload de Mídia',
        viewSite: 'Ver Site',
      },
      recentPosts: {
        title: 'Posts Recentes',
        viewAll: 'Ver todos',
        noPosts: 'Nenhum post ainda',
        createFirst: 'Criar primeiro post',
      },
      activity: {
        title: 'Atividade Recente',
        noActivity: 'Sem atividade recente',
      },
    },
  },
}))

// Mock dashboard components
jest.mock('@/components/admin/dashboard', () => ({
  StatsGrid: ({ stats }: { stats: Array<{ title: string; value: number }> }) => (
    <div data-testid="stats-grid">
      {stats.map((stat) => (
        <div key={stat.title} data-testid={`stat-${stat.title}`}>
          {stat.title}: {stat.value}
        </div>
      ))}
    </div>
  ),
  RecentPostsList: ({ posts, title }: { posts: Array<{ id: string; title: string }>; title: string }) => (
    <div data-testid="recent-posts-list">
      <h2>{title}</h2>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  ),
  QuickActions: ({ actions, title }: { actions: Array<{ label: string }>; title: string }) => (
    <div data-testid="quick-actions">
      <h2>{title}</h2>
      {actions.map((action, index) => (
        <div key={index}>{action.label}</div>
      ))}
    </div>
  ),
  ActivityFeed: ({ activities, title }: { activities: Array<{ id: string; description: string }>; title: string }) => (
    <div data-testid="activity-feed">
      <h2>{title}</h2>
      {activities.map((activity) => (
        <div key={activity.id}>{activity.description}</div>
      ))}
    </div>
  ),
  StatItem: {},
  RecentPost: {},
  QuickAction: {},
  Activity: {},
}))

describe('AdminDashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders dashboard title and subtitle', async () => {
    render(await AdminDashboardPage())
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Visão geral do seu site')).toBeInTheDocument()
  })

  it('renders stats grid with correct values', async () => {
    render(await AdminDashboardPage())
    
    expect(screen.getByTestId('stats-grid')).toBeInTheDocument()
    expect(screen.getByTestId('stat-Posts Publicados')).toHaveTextContent('Posts Publicados: 10')
    expect(screen.getByTestId('stat-Rascunhos')).toHaveTextContent('Rascunhos: 5')
    expect(screen.getByTestId('stat-Agendados')).toHaveTextContent('Agendados: 2')
    expect(screen.getByTestId('stat-Itens de Mídia')).toHaveTextContent('Itens de Mídia: 25')
    expect(screen.getByTestId('stat-Gerações IA')).toHaveTextContent('Gerações IA: 50')
  })

  it('renders recent posts list', async () => {
    render(await AdminDashboardPage())
    
    expect(screen.getByTestId('recent-posts-list')).toBeInTheDocument()
    expect(screen.getByText('Posts Recentes')).toBeInTheDocument()
    expect(screen.getByText('Post 1')).toBeInTheDocument()
    expect(screen.getByText('Post 2')).toBeInTheDocument()
  })

  it('renders quick actions', async () => {
    render(await AdminDashboardPage())
    
    expect(screen.getByTestId('quick-actions')).toBeInTheDocument()
    expect(screen.getByText('Ações Rápidas')).toBeInTheDocument()
    expect(screen.getByText('Novo Post')).toBeInTheDocument()
    expect(screen.getByText('Nova Landing Page')).toBeInTheDocument()
    expect(screen.getByText('Upload de Mídia')).toBeInTheDocument()
    expect(screen.getByText('Ver Site')).toBeInTheDocument()
  })

  it('renders activity feed', async () => {
    render(await AdminDashboardPage())
    
    expect(screen.getByTestId('activity-feed')).toBeInTheDocument()
    expect(screen.getByText('Atividade Recente')).toBeInTheDocument()
    expect(screen.getByText('Post criado')).toBeInTheDocument()
  })
})
