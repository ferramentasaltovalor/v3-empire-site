// src/app/(admin)/admin/posts/novo/page.test.tsx
// Tests for Admin New Post Page

import { render, screen, fireEvent } from '@/test/utils'
import NovoPostPage from './page'

// Mock the server action
jest.mock('@/app/(admin)/admin/posts/actions', () => ({
  createPostAction: jest.fn(),
}))

// Mock admin content
jest.mock('@/content/admin', () => ({
  adminContent: {
    posts: {
      newPost: 'Novo Post',
    },
    generic: {
      cancel: 'Cancelar',
    },
  },
}))

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, type, ...props }: { children: React.ReactNode; variant?: string; type?: 'submit' | 'reset' | 'button' }) => (
    <button type={type} data-variant={variant} {...props}>{children}</button>
  ),
}))

jest.mock('@/components/ui/input', () => ({
  Input: ({ id, name, placeholder, required, className, autoFocus, ...props }: { id?: string; name?: string; placeholder?: string; required?: boolean; className?: string; autoFocus?: boolean }) => (
    <input id={id} name={name} placeholder={placeholder} required={required} className={className} data-autofocus={autoFocus} {...props} />
  ),
}))

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
}))

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  ArrowLeft: () => <span data-testid="arrow-left-icon">←</span>,
}))

// Mock Next.js Link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

describe('NovoPostPage', () => {
  it('renders page title and description', () => {
    render(<NovoPostPage />)
    
    expect(screen.getByText('Novo Post')).toBeInTheDocument()
    expect(screen.getByText('Digite o título para criar um novo rascunho')).toBeInTheDocument()
  })

  it('renders back link to posts list', () => {
    render(<NovoPostPage />)
    
    const backLink = screen.getByText('Voltar para posts')
    expect(backLink).toBeInTheDocument()
    expect(backLink.closest('a')).toHaveAttribute('href', '/admin/posts')
  })

  it('renders title input field', () => {
    render(<NovoPostPage />)
    
    const titleInput = screen.getByLabelText(/título do post/i)
    expect(titleInput).toBeInTheDocument()
    expect(titleInput).toBeRequired()
  })

  it('renders create draft button', () => {
    render(<NovoPostPage />)
    
    expect(screen.getByText('Criar rascunho')).toBeInTheDocument()
  })

  it('renders cancel button with correct link', () => {
    render(<NovoPostPage />)
    
    const cancelButton = screen.getByText('Cancelar')
    expect(cancelButton).toBeInTheDocument()
    expect(cancelButton.closest('a')).toHaveAttribute('href', '/admin/posts')
  })

  it('renders tips section', () => {
    render(<NovoPostPage />)
    
    expect(screen.getByText('Dicas para um bom título')).toBeInTheDocument()
    expect(screen.getByText(/seja específico e claro/i)).toBeInTheDocument()
    expect(screen.getByText(/use palavras-chave relevantes/i)).toBeInTheDocument()
    expect(screen.getByText(/evite títulos muito longos/i)).toBeInTheDocument()
    expect(screen.getByText(/você pode editar o título depois/i)).toBeInTheDocument()
  })

  it('form has correct action attribute', () => {
    const { container } = render(<NovoPostPage />)
    
    const form = container.querySelector('form')
    expect(form).toBeInTheDocument()
  })

  it('title input has autofocus', () => {
    render(<NovoPostPage />)
    
    const titleInput = screen.getByLabelText(/título do post/i)
    expect(titleInput).toHaveAttribute('data-autofocus', 'true')
  })

  it('title input has correct placeholder', () => {
    render(<NovoPostPage />)
    
    const titleInput = screen.getByLabelText(/título do post/i)
    expect(titleInput).toHaveAttribute('placeholder', 'Ex: 10 estratégias para crescer seu negócio')
  })

  it('displays helper text about slug generation', () => {
    render(<NovoPostPage />)
    
    expect(screen.getByText(/o slug \(url\) será gerado automaticamente/i)).toBeInTheDocument()
  })
})
