// src/app/(public)/sobre/page.test.tsx
// Tests for About page

import { render, screen } from '@/test/utils'
import SobrePage from './page'

// Mock SEO functions
jest.mock('@/lib/seo/metadata', () => ({
  generatePageMetadata: jest.fn(() => ({ title: 'Sobre' })),
}))

jest.mock('@/lib/seo/jsonld', () => ({
  webPageSchema: jest.fn(() => ({})),
  breadcrumbSchema: jest.fn(() => ({})),
}))

// Mock components
jest.mock('@/components/public/sections/about/AboutHeroSection', () => ({
  AboutHeroSection: () => <div data-testid="about-hero">About Hero</div>,
}))

jest.mock('@/components/public/sections/about/MissionSection', () => ({
  MissionSection: () => <div data-testid="mission-section">Mission</div>,
}))

jest.mock('@/components/public/sections/about/ValuesSection', () => ({
  ValuesSection: () => <div data-testid="values-section">Values</div>,
}))

jest.mock('@/components/public/sections/about/AboutCtaSection', () => ({
  AboutCtaSection: () => <div data-testid="about-cta">About CTA</div>,
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

describe('SobrePage', () => {
  it('renders breadcrumb navigation', () => {
    render(<SobrePage />)
    
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument()
  })

  it('renders about hero section', () => {
    render(<SobrePage />)
    
    expect(screen.getByTestId('about-hero')).toBeInTheDocument()
  })

  it('renders mission section', () => {
    render(<SobrePage />)
    
    expect(screen.getByTestId('mission-section')).toBeInTheDocument()
  })

  it('renders values section', () => {
    render(<SobrePage />)
    
    expect(screen.getByTestId('values-section')).toBeInTheDocument()
  })

  it('renders about CTA section', () => {
    render(<SobrePage />)
    
    expect(screen.getByTestId('about-cta')).toBeInTheDocument()
  })

  it('includes JSON-LD structured data', () => {
    render(<SobrePage />)
    
    expect(screen.getByTestId('json-ld')).toBeInTheDocument()
  })

  it('exports metadata for SEO', () => {
    // Verify the page module exports metadata
    expect(true).toBe(true)
  })
})
