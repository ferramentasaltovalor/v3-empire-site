// src/app/(public)/lp/[slug]/page.test.tsx
// Tests for Public Landing Page

import { render, screen } from '@/test/utils'
import LandingPage, { generateMetadata } from './page'

// Mock the landing pages library
jest.mock('@/lib/landing-pages', () => ({
  getLandingPageBySlug: jest.fn(),
  getVisibleSections: jest.fn().mockReturnValue([]),
}))

const mockGetLandingPageBySlug = getLandingPageBySlug as jest.MockedFunction<typeof getLandingPageBySlug>

describe('LandingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders landing page when found', async () => {
    mockGetLandingPageBySlug.mockResolvedValueOnce({
      id: '1',
      name: 'Test Landing Page',
      slug: 'test-lp',
      status: 'published',
      sections: [],
      cssCustom: '',
      conversionGoals: [],
      seoTitle: 'Test LP Title',
      seoDescription: 'Test LP Description',
      ogImageUrl: null,
      customAnalyticsId: null,
      webhookId: null,
      createdBy: 'user1',
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    })

    render(<LandingPage params={Promise.resolve({ slug: 'test-lp' })} />)
    
    // Since there are no sections, we just verify the page doesn't crash
  })

  it('calls notFound when landing page does not exist', async () => {
    mockGetLandingPageBySlug.mockResolvedValueOnce(null)

    // notFound() throws an error in Next.js
    await expect(async () => {
      render(<LandingPage params={Promise.resolve({ slug: 'non-existent' })} />)
    }).rejects.toThrow()
  })
})

describe('generateMetadata', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns correct metadata when landing page exists', async () => {
    mockGetLandingPageBySlug.mockResolvedValueOnce({
      id: '1',
      name: 'Test Landing Page',
      slug: 'test-lp',
      status: 'published',
      sections: [],
      cssCustom: '',
      conversionGoals: [],
      seoTitle: 'Custom SEO Title',
      seoDescription: 'Custom SEO Description',
      ogImageUrl: 'https://example.com/image.jpg',
      customAnalyticsId: null,
      webhookId: null,
      createdBy: 'user1',
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    })

    const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'test-lp' }) })

    expect(metadata.title).toBe('Custom SEO Title')
    expect(metadata.description).toBe('Custom SEO Description')
  })

  it('returns default metadata when landing page does not exist', async () => {
    mockGetLandingPageBySlug.mockResolvedValueOnce(null)

    const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'non-existent' }) })

    expect(metadata.title).toBe('Página não encontrada')
  })
})

// Import the mocked functions
import { getLandingPageBySlug } from '@/lib/landing-pages'
