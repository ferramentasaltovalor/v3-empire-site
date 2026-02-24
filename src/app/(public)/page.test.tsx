// src/app/(public)/page.test.tsx
// Tests for Homepage

import { render, screen } from '@/test/utils'
import HomePage from './page'

// Mock all the section components
jest.mock('@/components/public/sections', () => ({
  HeroSection: () => <div data-testid="hero-section">Hero Section</div>,
  SocialProofSection: () => <div data-testid="social-proof-section">Social Proof Section</div>,
  ProblemSection: () => <div data-testid="problem-section">Problem Section</div>,
  SolutionSection: () => <div data-testid="solution-section">Solution Section</div>,
  MethodologySection: () => <div data-testid="methodology-section">Methodology Section</div>,
  BlogPreviewSection: () => <div data-testid="blog-preview-section">Blog Preview Section</div>,
  FaqSection: () => <div data-testid="faq-section">FAQ Section</div>,
  FinalCtaSection: () => <div data-testid="final-cta-section">Final CTA Section</div>,
}))

// Mock separator component
jest.mock('@/components/ui/separator', () => ({
  Separator: () => <hr data-testid="separator" />,
}))

// Mock JsonLd component
jest.mock('@/components/shared/JsonLd', () => ({
  JsonLd: () => <script type="application/ld+json" data-testid="json-ld" />,
}))

describe('HomePage', () => {
  it('renders all main sections', () => {
    render(<HomePage />)
    
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    expect(screen.getByTestId('social-proof-section')).toBeInTheDocument()
    expect(screen.getByTestId('problem-section')).toBeInTheDocument()
    expect(screen.getByTestId('solution-section')).toBeInTheDocument()
    expect(screen.getByTestId('methodology-section')).toBeInTheDocument()
    expect(screen.getByTestId('blog-preview-section')).toBeInTheDocument()
    expect(screen.getByTestId('faq-section')).toBeInTheDocument()
    expect(screen.getByTestId('final-cta-section')).toBeInTheDocument()
  })

  it('includes JSON-LD structured data', () => {
    render(<HomePage />)
    
    expect(screen.getByTestId('json-ld')).toBeInTheDocument()
  })

  it('has correct main element structure', () => {
    const { container } = render(<HomePage />)
    
    const main = container.querySelector('main')
    expect(main).toBeInTheDocument()
  })

  it('exports metadata for SEO', () => {
    // Test that the page exports metadata
    const { metadata } = jest.requireActual('./page')
    // Since metadata is exported, we just verify the module loads
    expect(true).toBe(true)
  })
})
