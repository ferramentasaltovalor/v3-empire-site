// src/app/(admin)/layout.test.tsx
// Tests for Admin Layout

import { render, screen } from '@/test/utils'
import AdminLayout from './layout'

// Mock admin components
jest.mock('@/components/admin/layout/AdminSidebar', () => ({
  AdminSidebar: () => <div data-testid="admin-sidebar">Sidebar</div>,
}))

jest.mock('@/components/admin/layout/AdminHeader', () => ({
  AdminHeader: () => <div data-testid="admin-header">Header</div>,
}))

describe('AdminLayout', () => {
  it('renders sidebar', () => {
    render(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    )
    
    expect(screen.getByTestId('admin-sidebar')).toBeInTheDocument()
  })

  it('renders header', () => {
    render(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    )
    
    expect(screen.getByTestId('admin-header')).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    )
    
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders footer with current year', () => {
    render(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    )
    
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`Empire Admin © ${currentYear}`))).toBeInTheDocument()
  })

  it('has correct main container structure', () => {
    const { container } = render(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    )
    
    const main = container.querySelector('main')
    expect(main).toBeInTheDocument()
  })

  it('applies correct CSS classes for layout', () => {
    const { container } = render(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    )
    
    // Check for the main wrapper div with min-h-screen
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('min-h-screen')
  })
})
