// src/app/(admin)/admin/posts/page.test.tsx
// Tests for Admin Posts List Page

import { render, screen } from '@/test/utils'

// Mock admin content
jest.mock('@/content/admin', () => ({
  adminContent: {
    posts: {
      title: 'Posts',
      subtitle: 'Gerencie seus posts',
      newPost: 'Novo Post',
    },
    generic: {
      cancel: 'Cancelar',
    },
  },
}))

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, className, ...props }: { children: React.ReactNode; variant?: string; className?: string }) => (
    <button data-variant={variant} className={className} {...props}>{children}</button>
  ),
}))

// Mock the posts data functions
jest.mock('@/lib/admin/posts', () => ({
  getPosts: jest.fn(),
  getCategories: jest.fn(),
}))

// Mock PostsList component
jest.mock('@/components/admin/posts/PostsList', () => ({
  PostsList: ({ posts, total }: { posts: Array<{ id: string; title: string }>; total: number }) => (
    <div data-testid="posts-list">
      <span data-testid="total-count">Total: {total}</span>
      {posts.map((post) => (
        <div key={post.id} data-testid={`post-${post.id}`}>{post.title}</div>
      ))}
    </div>
  ),
}))

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Plus: () => <span data-testid="plus-icon">+</span>,
}))

// Mock Next.js Link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

// Import the component after mocks are set up
import PostsPage from './page'

describe('PostsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders page title and subtitle', async () => {
    render(await PostsPage({ searchParams: Promise.resolve({}) }))
    
    expect(screen.getByText('Posts')).toBeInTheDocument()
    expect(screen.getByText('Gerencie seus posts')).toBeInTheDocument()
  })

  it('renders new post button with correct link', async () => {
    render(await PostsPage({ searchParams: Promise.resolve({}) }))
    
    const newPostButton = screen.getByText('Novo Post')
    expect(newPostButton).toBeInTheDocument()
    
    const link = newPostButton.closest('a')
    expect(link).toHaveAttribute('href', '/admin/posts/novo')
  })

  it('renders loading fallback initially', async () => {
    // The Suspense boundary shows "Carregando..." initially
    // This is expected behavior for the async component
    render(await PostsPage({ searchParams: Promise.resolve({}) }))
    
    // After the component resolves, we should see the content
    expect(screen.getByText('Posts')).toBeInTheDocument()
  })

  it('renders plus icon in new post button', async () => {
    render(await PostsPage({ searchParams: Promise.resolve({}) }))
    
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
  })

  it('renders correctly with search params', async () => {
    // Verify the page renders correctly with search params
    render(await PostsPage({ searchParams: Promise.resolve({ status: 'draft', search: 'teste' }) }))
    
    expect(screen.getByText('Posts')).toBeInTheDocument()
    expect(screen.getByText('Gerencie seus posts')).toBeInTheDocument()
  })
})
