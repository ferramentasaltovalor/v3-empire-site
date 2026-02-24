// src/app/(admin)/admin/usuarios/page.test.tsx
// Tests for Admin Users Management Page

import { render, screen } from '@/test/utils'
import UsuariosPage from './page'

// Mock the users data functions
jest.mock('@/lib/admin/users', () => ({
  getUsers: jest.fn(() => Promise.resolve({
    users: [
      {
        id: '1',
        email: 'admin@example.com',
        full_name: 'Admin User',
        role: 'admin',
        created_at: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        email: 'editor@example.com',
        full_name: 'Editor User',
        role: 'editor',
        created_at: '2024-01-02T00:00:00Z',
      },
    ],
    total: 2,
  })),
  getCurrentUserProfile: jest.fn(() => Promise.resolve({
    id: '1',
    email: 'admin@example.com',
    full_name: 'Admin User',
    role: 'admin',
  })),
  UserRole: {
    ADMIN: 'admin',
    EDITOR: 'editor',
    VIEWER: 'viewer',
  },
}))

// Mock auth permissions
jest.mock('@/lib/auth/permissions', () => ({
  requireAdmin: jest.fn(() => Promise.resolve()),
}))

// Mock admin content
jest.mock('@/content/admin', () => ({
  adminContent: {
    users: {
      title: 'Usuários',
      subtitle: 'Gerencie os usuários do sistema',
    },
  },
}))

// Mock UsersList component
jest.mock('@/components/admin/users/UsersList', () => ({
  UsersList: ({ users, total }: { users: Array<{ id: string; email: string }>; total: number }) => (
    <div data-testid="users-list">
      <span data-testid="total-count">Total: {total}</span>
      {users.map((user) => (
        <div key={user.id} data-testid={`user-${user.id}`}>{user.email}</div>
      ))}
    </div>
  ),
}))

describe('UsuariosPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders page title and subtitle', async () => {
    render(await UsuariosPage({ searchParams: Promise.resolve({}) }))
    
    expect(screen.getByText('Usuários')).toBeInTheDocument()
    expect(screen.getByText('Gerencie os usuários do sistema')).toBeInTheDocument()
  })

  it('requires admin access', async () => {
    const { requireAdmin } = require('@/lib/auth/permissions')
    
    render(await UsuariosPage({ searchParams: Promise.resolve({}) }))
    
    expect(requireAdmin).toHaveBeenCalled()
  })

  it('renders UsersList component', async () => {
    render(await UsuariosPage({ searchParams: Promise.resolve({}) }))
    
    expect(screen.getByTestId('users-list')).toBeInTheDocument()
  })

  it('displays users from the API', async () => {
    render(await UsuariosPage({ searchParams: Promise.resolve({}) }))
    
    expect(screen.getByTestId('user-1')).toHaveTextContent('admin@example.com')
    expect(screen.getByTestId('user-2')).toHaveTextContent('editor@example.com')
  })

  it('displays total count', async () => {
    render(await UsuariosPage({ searchParams: Promise.resolve({}) }))
    
    expect(screen.getByTestId('total-count')).toHaveTextContent('Total: 2')
  })

  it('passes search params to getUsers', async () => {
    const { getUsers } = require('@/lib/admin/users')
    
    render(await UsuariosPage({ searchParams: Promise.resolve({ role: 'editor', search: 'user' }) }))
    
    expect(getUsers).toHaveBeenCalledWith({
      role: 'editor',
      search: 'user',
    })
  })
})
