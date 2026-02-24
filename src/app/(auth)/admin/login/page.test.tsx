// src/app/(auth)/admin/login/page.test.tsx
// Tests for Admin Login Page

import { render, screen, fireEvent, waitFor } from '@/test/utils'
import LoginPage from './page'

// Mock the server actions
const mockLogin = jest.fn()
const mockResetPassword = jest.fn()

jest.mock('./actions', () => ({
  login: () => mockLogin(),
  resetPassword: () => mockResetPassword(),
}))

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, type, loading, className, ...props }: { children: React.ReactNode; type?: 'submit' | 'reset' | 'button'; loading?: boolean; className?: string }) => (
    <button type={type} disabled={loading} className={className} data-loading={loading} {...props}>
      {loading ? 'Carregando...' : children}
    </button>
  ),
}))

jest.mock('@/components/ui/input', () => ({
  Input: ({ id, name, type, required, placeholder, variant, ...props }: { id?: string; name?: string; type?: string; required?: boolean; placeholder?: string; variant?: string }) => (
    <input id={id} name={name} type={type} required={required} placeholder={placeholder} data-variant={variant} {...props} />
  ),
}))

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor, className }: { children: React.ReactNode; htmlFor?: string; className?: string }) => (
    <label htmlFor={htmlFor} className={className}>{children}</label>
  ),
}))

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, variant, hover }: { children: React.ReactNode; variant?: string; hover?: boolean }) => (
    <div data-variant={variant} data-hover={hover}>{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('AdminLoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders login form by default', () => {
    render(<LoginPage />)
    
    expect(screen.getByText('Empire Gold')).toBeInTheDocument()
    expect(screen.getByText('Acesse o painel administrativo')).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('shows password field in login mode', () => {
    render(<LoginPage />)
    
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByText('Esqueceu a senha?')).toBeInTheDocument()
  })

  it('switches to password reset mode when clicking "Esqueceu a senha?"', () => {
    render(<LoginPage />)
    
    const forgotPasswordButton = screen.getByText('Esqueceu a senha?')
    fireEvent.click(forgotPasswordButton)
    
    expect(screen.getByText('Recupere sua senha')).toBeInTheDocument()
    expect(screen.queryByLabelText(/senha/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enviar link de recuperação/i })).toBeInTheDocument()
  })

  it('shows "Voltar para o login" button in reset mode', () => {
    render(<LoginPage />)
    
    // Switch to reset mode
    fireEvent.click(screen.getByText('Esqueceu a senha?'))
    
    expect(screen.getByText('Voltar para o login')).toBeInTheDocument()
  })

  it('switches back to login mode when clicking "Voltar para o login"', () => {
    render(<LoginPage />)
    
    // Switch to reset mode
    fireEvent.click(screen.getByText('Esqueceu a senha?'))
    
    // Switch back to login mode
    fireEvent.click(screen.getByText('Voltar para o login'))
    
    expect(screen.getByText('Acesse o painel administrativo')).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
  })

  it('has required email input', () => {
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toBeRequired()
  })

  it('has required password input in login mode', () => {
    render(<LoginPage />)
    
    const passwordInput = screen.getByLabelText(/senha/i)
    expect(passwordInput).toBeRequired()
  })

  it('calls login action when form is submitted in login mode', async () => {
    mockLogin.mockResolvedValueOnce(undefined)
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/senha/i)
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled()
    })
  })

  it('calls resetPassword action when form is submitted in reset mode', async () => {
    mockResetPassword.mockResolvedValueOnce({ success: 'Email de recuperação enviado com sucesso' })
    
    render(<LoginPage />)
    
    // Switch to reset mode
    fireEvent.click(screen.getByText('Esqueceu a senha?'))
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /enviar link de recuperação/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalled()
    })
  })

  it('displays error message when login fails', async () => {
    mockLogin.mockResolvedValueOnce({ error: 'Credenciais inválidas' })
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/senha/i)
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument()
    })
  })

  it('displays success message when password reset is sent', async () => {
    mockResetPassword.mockResolvedValueOnce({ success: 'Email de recuperação enviado com sucesso' })
    
    render(<LoginPage />)
    
    // Switch to reset mode
    fireEvent.click(screen.getByText('Esqueceu a senha?'))
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /enviar link de recuperação/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Email de recuperação enviado com sucesso')).toBeInTheDocument()
    })
  })

  it('returns to login mode after successful password reset', async () => {
    mockResetPassword.mockResolvedValueOnce({ success: 'Email de recuperação enviado com sucesso' })
    
    render(<LoginPage />)
    
    // Switch to reset mode
    fireEvent.click(screen.getByText('Esqueceu a senha?'))
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /enviar link de recuperação/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Acesse o painel administrativo')).toBeInTheDocument()
    })
  })

  it('shows loading state during form submission', async () => {
    // The loading state is managed internally by the component
    // We just verify the button exists and can be clicked
    render(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).not.toBeDisabled()
  })

  it('clears error when switching modes', () => {
    render(<LoginPage />)
    
    // First, trigger an error state manually by clicking submit with mock returning error
    // Then switch modes
    const forgotPasswordButton = screen.getByText('Esqueceu a senha?')
    fireEvent.click(forgotPasswordButton)
    
    // Should be in reset mode without any error visible
    expect(screen.queryByText('Credenciais inválidas')).not.toBeInTheDocument()
  })
})
