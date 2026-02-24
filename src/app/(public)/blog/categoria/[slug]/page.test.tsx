// src/app/(public)/blog/categoria/[slug]/page.test.tsx
// Tests for Blog category page

import { render, screen } from '@/test/utils'
import CategoryPage from './page'

// Mock category data
const mockCategory = {
  id: 'cat1',
  name: 'Marketing',
  slug: 'marketing',
  description: 'Artigos sobre marketing',
}

const mockPosts = [
  {
    id: '1',
    title: 'Marketing Post 1',
    slug: 'marketing-post-1',
    excerpt: 'Excerpt 1',
    cover_image_url: '/images/1.jpg',
    published_at: '2024-01-01',
  },
]

const mockCategories = [
  { id: 'cat1', name: 'Marketing', slug: 'marketing' },
  { id: 'cat2', name: 'Vendas', slug: 'vendas' },
]

// Mock blog functions
jest.mock('@/lib/blog/posts', () => ({
  getPublishedPosts: jest.fn(() => Promise.resolve({ posts: mockPosts })),
  getCategories: jest.fn(() => Promise.resolve(mockCategories)),
  getCategoryBySlug: jest.fn((slug: string) => {
    if (slug === 'marketing') return Promise.resolve(mockCategory)
    return Promise.resolve(null)
  }),
}))

// Mock next/navigation
const mockNotFound = jest.fn()
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  notFound: () => mockNotFound(),
}))

// Mock SEO functions
jest.mock('@/lib/seo/metadata', () => ({
  generateCategoryMetadata: jest.fn(() => ({ title: 'Marketing' })),
}))

jest.mock('@/lib/seo/jsonld', () => ({
  breadcrumbSchema: jest.fn(() => ({})),
}))

// Mock components
jest.mock('@/components/public/blog/PostGrid', () => ({
  PostGrid: ({ posts }: { posts: unknown[] }) => (
    <div data-testid="post-grid">{posts.length} posts</div>
  ),
}))

jest.mock('@/components/public/blog/CategoryFilter', () => ({
  CategoryFilter: ({ categories, activeCategory }: { categories: unknown[]; activeCategory?: string }) => (
    <div data-testid="category-filter">
      {categories.length} categories - Active: {activeCategory || 'none'}
    </div>
  ),
}))

jest.mock('@/components/public/layout/Breadcrumb', () => ({
  Breadcrumb: ({ items }: { items: { label: string }[] }) => (
    <nav data-testid="breadcrumb">{items.map(i => i.label).join(' > ')}</nav>
  ),
}))

jest.mock('@/components/ui/separator', () => ({
  Separator: () => <hr data-testid="separator" />,
}))

jest.mock('@/components/shared/JsonLd', () => ({
  JsonLd: () => <script type="application/ld+json" data-testid="json-ld" />,
}))

jest.mock('@/content/blog', () => ({
  blogContent: {
    listing: {
      title: 'Blog',
      subtitle: 'Artigos e insights',
    },
    category: {
      postsIn: 'Posts em',
      noPosts: 'Nenhum post encontrado nesta categoria.',
    },
  },
}))

describe('CategoryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders category name in title', async () => {
    const page = await CategoryPage({ params: Promise.resolve({ slug: 'marketing' }) })
    render(page)
    
    expect(screen.getByText('Marketing')).toBeInTheDocument()
  })

  it('renders category description', async () => {
    const page = await CategoryPage({ params: Promise.resolve({ slug: 'marketing' }) })
    render(page)
    
    expect(screen.getByText('Artigos sobre marketing')).toBeInTheDocument()
  })

  it('renders breadcrumb navigation', async () => {
    const page = await CategoryPage({ params: Promise.resolve({ slug: 'marketing' }) })
    render(page)
    
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument()
  })

  it('renders category filter with active category', async () => {
    const page = await CategoryPage({ params: Promise.resolve({ slug: 'marketing' }) })
    render(page)
    
    expect(screen.getByTestId('category-filter')).toBeInTheDocument()
    expect(screen.getByText(/Active: marketing/)).toBeInTheDocument()
  })

  it('renders post grid with posts', async () => {
    const page = await CategoryPage({ params: Promise.resolve({ slug: 'marketing' }) })
    render(page)
    
    expect(screen.getByTestId('post-grid')).toBeInTheDocument()
    expect(screen.getByText('1 posts')).toBeInTheDocument()
  })

  it('includes JSON-LD structured data', async () => {
    const page = await CategoryPage({ params: Promise.resolve({ slug: 'marketing' }) })
    render(page)
    
    expect(screen.getByTestId('json-ld')).toBeInTheDocument()
  })

  it('calls notFound when category does not exist', async () => {
    try {
      await CategoryPage({ params: Promise.resolve({ slug: 'non-existent' }) })
    } catch {
      // notFound() throws in Next.js
    }
    
    expect(mockNotFound).toHaveBeenCalled()
  })
})
