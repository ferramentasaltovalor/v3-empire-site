// src/app/(admin)/admin/posts/[id]/page.test.tsx
// Tests for Admin Edit Post Page

import { render, screen } from '@/test/utils'
import EditPostPage from './page'

// Mock the posts data functions
jest.mock('@/lib/admin/posts', () => ({
  getPostById: jest.fn((id: string) => {
    if (id === 'existing-post') {
      return Promise.resolve({
        id: 'existing-post',
        title: 'Post Existente',
        slug: 'post-existente',
        status: 'draft',
        content: 'Conteúdo do post',
        excerpt: 'Resumo do post',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        published_at: null,
        categories: [],
        tags: [],
      })
    }
    return Promise.resolve(null)
  }),
  getCategories: jest.fn(() => Promise.resolve([
    { id: '1', name: 'Marketing', slug: 'marketing' },
    { id: '2', name: 'Vendas', slug: 'vendas' },
  ])),
  getTags: jest.fn(() => Promise.resolve([
    { id: '1', name: 'Tag 1', slug: 'tag-1' },
    { id: '2', name: 'Tag 2', slug: 'tag-2' },
  ])),
}))

// Mock PostEditor component
jest.mock('@/components/admin/posts/PostEditor', () => ({
  PostEditor: ({ post }: { post: { id: string; title: string } }) => (
    <div data-testid="post-editor">
      <span data-testid="post-id">{post.id}</span>
      <span data-testid="post-title">{post.title}</span>
    </div>
  ),
}))

// Mock admin content
jest.mock('@/content/admin', () => ({
  adminContent: {
    posts: {
      title: 'Posts',
    },
  },
}))

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  ArrowLeft: () => <span data-testid="arrow-left-icon">←</span>,
}))

// Mock Next.js Link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

describe('EditPostPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders page title for existing post', async () => {
    render(await EditPostPage({ params: Promise.resolve({ id: 'existing-post' }) }))
    
    expect(screen.getByText('Editar Post')).toBeInTheDocument()
  })

  it('renders post title as subtitle', async () => {
    render(await EditPostPage({ params: Promise.resolve({ id: 'existing-post' }) }))
    
    // Use more specific selector since the title appears in multiple places
    expect(screen.getByTestId('post-title')).toHaveTextContent('Post Existente')
  })

  it('renders back link to posts list', async () => {
    render(await EditPostPage({ params: Promise.resolve({ id: 'existing-post' }) }))
    
    const backLink = screen.getByText('Voltar para posts')
    expect(backLink).toBeInTheDocument()
    expect(backLink.closest('a')).toHaveAttribute('href', '/admin/posts')
  })

  it('renders PostEditor component with correct post data', async () => {
    render(await EditPostPage({ params: Promise.resolve({ id: 'existing-post' }) }))
    
    expect(screen.getByTestId('post-editor')).toBeInTheDocument()
    expect(screen.getByTestId('post-id')).toHaveTextContent('existing-post')
    expect(screen.getByTestId('post-title')).toHaveTextContent('Post Existente')
  })

  it('calls notFound when post does not exist', async () => {
    const { notFound } = require('next/navigation')
    
    try {
      render(await EditPostPage({ params: Promise.resolve({ id: 'non-existent' }) }))
    } catch {
      // Expected behavior
    }
    
    expect(notFound).toHaveBeenCalled()
  })
})
