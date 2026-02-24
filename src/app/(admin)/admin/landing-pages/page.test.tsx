// src/app/(admin)/admin/landing-pages/page.test.tsx
// Tests for Admin Landing Pages List Page

import { render, screen } from '@/test/utils'
import LandingPagesPage from './page'

// Mock the actions
jest.mock('./actions', () => ({
  listLandingPages: jest.fn().mockResolvedValue({
    data: [],
    total: 0,
  }),
}))

describe('LandingPagesPage', () => {
  it('renders page title', async () => {
    render(<LandingPagesPage searchParams={Promise.resolve({})} />)
    
    expect(screen.getByText('Landing Pages')).toBeInTheDocument()
  })

  it('renders page description', async () => {
    render(<LandingPagesPage searchParams={Promise.resolve({})} />)
    
    expect(screen.getByText('Gerencie suas landing pages e capture leads')).toBeInTheDocument()
  })

  it('renders new landing page button', async () => {
    render(<LandingPagesPage searchParams={Promise.resolve({})} />)
    
    expect(screen.getByText('Nova Landing Page')).toBeInTheDocument()
  })

  it('renders empty state when no landing pages', async () => {
    render(<LandingPagesPage searchParams={Promise.resolve({})} />)
    
    // The empty state is rendered asynchronously
    expect(await screen.findByText('Nenhuma landing page encontrada')).toBeInTheDocument()
  })
})
