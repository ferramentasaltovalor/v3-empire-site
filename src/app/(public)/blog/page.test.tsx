// src/app/(public)/blog/page.test.tsx
// Tests for Blog listing page

import { render, screen } from '@/test/utils'
import BlogPage from './page'

// Mock blog data
const mockPosts = [
  {
    id: '1',
    title: 'Test Post 1',
    slug: 'test-post-1',
    excerpt: 'Test excerpt 1',
    cover_image_url: '/images/test1.jpg',
    published_at: '2024-01-01',
    posts_categories: [{ post_categories: { id: 'cat1', name: 'Category 1', slug: 'category-1' } }],
  },
  {
    id: '2',
    title: 'Test Post 2',
    slug: 'test-post-2',
    excerpt: 'Test excerpt 2',
    cover_image_url: '/images/test2.jpg',
    published_at: '2024-01-02',
    posts_categories: [{ post_categories: { id: 'cat2', name: 'Category 2', slug: 'category-2' } }],
  },
]

const mockCategories = [
  { id: 'cat1', name: 'Category 1', slug: 'category-1' },
  { id: 'cat2', name: 'Category 2', slug: 'category-2' },
]

// Mock blog functions
jest.mock('@/lib/blog/posts', () => ({
  getPublishedPosts: jest.fn(() => Promise.resolve({ posts: mockPosts })),
  getCategories: jest.fn(() => Promise.resolve(mockCategories)),
}))

// Mock SEO functions
jest.mock('@/lib/seo/metadata', () => ({
  generateBlogMetadata: jest.fn(() => ({ title: 'Blog' })),
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
  CategoryFilter: ({ categories }: { categories: unknown[] }) => (
    <div data-testid="category-filter">{categories.length} categories</div>
  ),
}))

jest.mock('@/components/public/blog/BlogSearch', () => ({
  BlogSearch: () => <div data-testid="blog-search">Search</div>,
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
  },
}))

describe('BlogPage', () => {
  it('renders the page title', async () => {
    const page = await BlogPage()
    render(page)
    
    // Check for h1 with Blog title specifically
    const heading = screen.getByRole('heading', { level: 1, name: 'Blog' })
    expect(heading).toBeInTheDocument()
  })

  it('renders the subtitle', async () => {
    const page = await BlogPage()
    render(page)
    
    expect(screen.getByText('Artigos e insights')).toBeInTheDocument()
  })

  it('renders breadcrumb navigation', async () => {
    const page = await BlogPage()
    render(page)
    
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument()
  })

  it('renders blog search component', async () => {
    const page = await BlogPage()
    render(page)
    
    expect(screen.getByTestId('blog-search')).toBeInTheDocument()
  })

  it('renders category filter with categories', async () => {
    const page = await BlogPage()
    render(page)
    
    expect(screen.getByTestId('category-filter')).toBeInTheDocument()
    expect(screen.getByText('2 categories')).toBeInTheDocument()
  })

  it('renders post grid with posts', async () => {
    const page = await BlogPage()
    render(page)
    
    expect(screen.getByTestId('post-grid')).toBeInTheDocument()
    expect(screen.getByText('2 posts')).toBeInTheDocument()
  })

  it('includes JSON-LD structured data', async () => {
    const page = await BlogPage()
    render(page)
    
    expect(screen.getByTestId('json-ld')).toBeInTheDocument()
  })
})
