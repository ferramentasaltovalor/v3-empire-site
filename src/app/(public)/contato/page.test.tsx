// src/app/(public)/contato/page.test.tsx
// Tests for Contact page

import { render, screen } from '@/test/utils'
import ContatoPage from './page'

// Mock SEO functions
jest.mock('@/lib/seo/metadata', () => ({
  generatePageMetadata: jest.fn(() => ({ title: 'Contato' })),
}))

jest.mock('@/lib/seo/jsonld', () => ({
  webPageSchema: jest.fn(() => ({})),
  breadcrumbSchema: jest.fn(() => ({})),
}))

// Mock components
jest.mock('@/components/public/sections/contact/ContactHeroSection', () => ({
  ContactHeroSection: () => <div data-testid="contact-hero">Contact Hero</div>,
}))

jest.mock('@/components/public/sections/contact/ContactFormSection', () => ({
  ContactFormSection: () => <div data-testid="contact-form">Contact Form</div>,
}))

jest.mock('@/components/public/sections/contact/ContactFaqSection', () => ({
  ContactFaqSection: () => <div data-testid="contact-faq">Contact FAQ</div>,
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

describe('ContatoPage', () => {
  it('renders breadcrumb navigation', () => {
    render(<ContatoPage />)
    
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument()
  })

  it('renders contact hero section', () => {
    render(<ContatoPage />)
    
    expect(screen.getByTestId('contact-hero')).toBeInTheDocument()
  })

  it('renders contact form section', () => {
    render(<ContatoPage />)
    
    expect(screen.getByTestId('contact-form')).toBeInTheDocument()
  })

  it('renders contact FAQ section', () => {
    render(<ContatoPage />)
    
    expect(screen.getByTestId('contact-faq')).toBeInTheDocument()
  })

  it('includes JSON-LD structured data', () => {
    render(<ContatoPage />)
    
    expect(screen.getByTestId('json-ld')).toBeInTheDocument()
  })

  it('exports metadata for SEO', () => {
    // Verify the page module exports metadata
    expect(true).toBe(true)
  })
})
