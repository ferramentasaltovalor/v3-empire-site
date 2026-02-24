// src/app/(public)/blog/[slug]/page.test.tsx
// Tests for Blog post detail page

import { render, screen } from '@/test/utils'
import PostPage from './page'

// Mock post data
const mockPost = {
  id: 'post-1',
  title: 'Test Post Title',
  slug: 'test-post',
  excerpt: 'This is a test post excerpt',
  content: '<p>Test content</p>',
  content_html: '<p>Test content HTML</p>',
  cover_image_url: '/images/cover.jpg',
  published_at: '2024-01-01',
  updated_at: '2024-01-02',
  seo_title: 'SEO Title',
  seo_description: 'SEO Description',
  posts_categories: [
    { post_categories: { id: 'cat1', name: 'Category 1', slug: 'category-1' } },
  ],
  posts_tags: [
    { post_tags: { id: 'tag1', name: 'Tag 1', slug: 'tag-1' } },
  ],
  profiles: { full_name: 'Author Name' },
}

// Mock blog functions
jest.mock('@/lib/blog/posts', () => ({
  getPostBySlug: jest.fn((slug: string) => {
    if (slug === 'test-post') return Promise.resolve(mockPost)
    return Promise.resolve(null)
  }),
  getRelatedPosts: jest.fn(() => Promise.resolve([])),
}))

// Mock next/navigation
const mockNotFound = jest.fn()
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  notFound: () => mockNotFound(),
}))

// Mock SEO functions
jest.mock('@/lib/seo/metadata', () => ({
  generateMetadata: jest.fn(() => ({ title: 'Test Post' })),
}))

jest.mock('@/lib/seo/jsonld', () => ({
  blogPostingSchema: jest.fn(() => ({})),
  breadcrumbSchema: jest.fn(() => ({})),
}))

// Mock components
jest.mock('@/components/public/blog/PostHero', () => ({
  PostHero: ({ post }: { post: { title: string } }) => (
    <div data-testid="post-hero">{post.title}</div>
  ),
}))

jest.mock('@/components/public/blog/PostContent', () => ({
  PostContent: () => <div data-testid="post-content">Content</div>,
}))

jest.mock('@/components/public/blog/PostShare', () => ({
  PostShare: () => <div data-testid="post-share">Share</div>,
}))

jest.mock('@/components/public/blog/PostTags', () => ({
  PostTags: () => <div data-testid="post-tags">Tags</div>,
}))

jest.mock('@/components/public/blog/RelatedPosts', () => ({
  RelatedPosts: () => <div data-testid="related-posts">Related</div>,
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

describe('PostPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders post hero with title', async () => {
    const page = await PostPage({ params: Promise.resolve({ slug: 'test-post' }) })
    render(page)
    
    expect(screen.getByTestId('post-hero')).toBeInTheDocument()
    expect(screen.getByText('Test Post Title')).toBeInTheDocument()
  })

  it('renders breadcrumb navigation', async () => {
    const page = await PostPage({ params: Promise.resolve({ slug: 'test-post' }) })
    render(page)
    
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument()
  })

  it('renders post content', async () => {
    const page = await PostPage({ params: Promise.resolve({ slug: 'test-post' }) })
    render(page)
    
    expect(screen.getByTestId('post-content')).toBeInTheDocument()
  })

  it('renders share component', async () => {
    const page = await PostPage({ params: Promise.resolve({ slug: 'test-post' }) })
    render(page)
    
    expect(screen.getByTestId('post-share')).toBeInTheDocument()
  })

  it('renders tags component', async () => {
    const page = await PostPage({ params: Promise.resolve({ slug: 'test-post' }) })
    render(page)
    
    expect(screen.getByTestId('post-tags')).toBeInTheDocument()
  })

  it('renders related posts section', async () => {
    const page = await PostPage({ params: Promise.resolve({ slug: 'test-post' }) })
    render(page)
    
    expect(screen.getByTestId('related-posts')).toBeInTheDocument()
  })

  it('includes JSON-LD structured data', async () => {
    const page = await PostPage({ params: Promise.resolve({ slug: 'test-post' }) })
    render(page)
    
    expect(screen.getByTestId('json-ld')).toBeInTheDocument()
  })

  it('calls notFound when post does not exist', async () => {
    try {
      await PostPage({ params: Promise.resolve({ slug: 'non-existent' }) })
    } catch {
      // notFound() throws in Next.js
    }
    
    expect(mockNotFound).toHaveBeenCalled()
  })
})
