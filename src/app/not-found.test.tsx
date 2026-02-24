// src/app/not-found.test.tsx
// Tests for 404 Not Found page

import { render, screen } from '@/test/utils'
import NotFound from './not-found'

describe('NotFound Page', () => {
  it('renders 404 heading', () => {
    render(<NotFound />)
    
    // There are two 404 elements (background and foreground)
    const elements404 = screen.getAllByText('404')
    expect(elements404.length).toBeGreaterThanOrEqual(1)
  })

  it('displays "Página não encontrada" message', () => {
    render(<NotFound />)
    
    expect(screen.getByText('Página não encontrada')).toBeInTheDocument()
  })

  it('shows descriptive error message', () => {
    render(<NotFound />)
    
    expect(screen.getByText(/A página que você está procurando não existe ou foi movida/i)).toBeInTheDocument()
  })

  it('has a link back to homepage', () => {
    render(<NotFound />)
    
    const homeLink = screen.getByRole('link', { name: /voltar para o início/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
  })
})
