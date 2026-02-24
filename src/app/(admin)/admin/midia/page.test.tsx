// src/app/(admin)/admin/midia/page.test.tsx
// Tests for Admin Media Manager Page

import { render, screen } from '@/test/utils'
import MidiaPage from './page'

// Mock the media data functions
jest.mock('@/lib/admin/media', () => ({
  getMediaItems: jest.fn(() => Promise.resolve({
    items: [
      {
        id: '1',
        name: 'image1.jpg',
        url: 'https://example.com/image1.jpg',
        mime_type: 'image/jpeg',
        size: 1024,
        created_at: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        name: 'image2.png',
        url: 'https://example.com/image2.png',
        mime_type: 'image/png',
        size: 2048,
        created_at: '2024-01-02T00:00:00Z',
      },
    ],
    total: 2,
  })),
  getMediaFolders: jest.fn(() => Promise.resolve([
    { id: '1', name: 'Uploads', parent_id: null },
    { id: '2', name: 'Blog', parent_id: null },
  ])),
}))

// Mock admin content
jest.mock('@/content/admin', () => ({
  adminContent: {
    media: {
      title: 'Mídia',
      subtitle: 'Gerencie seus arquivos',
    },
  },
}))

// Mock MediaLibrary component
jest.mock('@/components/admin/media/MediaLibrary', () => ({
  MediaLibrary: ({ initialItems, total }: { initialItems: Array<{ id: string; name: string }>; total: number }) => (
    <div data-testid="media-library">
      <span data-testid="total-count">Total: {total}</span>
      {initialItems.map((item) => (
        <div key={item.id} data-testid={`media-${item.id}`}>{item.name}</div>
      ))}
    </div>
  ),
}))

describe('MidiaPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders page title and subtitle', async () => {
    render(await MidiaPage({ searchParams: Promise.resolve({}) }))
    
    expect(screen.getByText('Mídia')).toBeInTheDocument()
    expect(screen.getByText('Gerencie seus arquivos')).toBeInTheDocument()
  })

  it('renders MediaLibrary component', async () => {
    render(await MidiaPage({ searchParams: Promise.resolve({}) }))
    
    expect(screen.getByTestId('media-library')).toBeInTheDocument()
  })

  it('displays media items from the API', async () => {
    render(await MidiaPage({ searchParams: Promise.resolve({}) }))
    
    expect(screen.getByTestId('media-1')).toHaveTextContent('image1.jpg')
    expect(screen.getByTestId('media-2')).toHaveTextContent('image2.png')
  })

  it('displays total count', async () => {
    render(await MidiaPage({ searchParams: Promise.resolve({}) }))
    
    expect(screen.getByTestId('total-count')).toHaveTextContent('Total: 2')
  })

  it('passes search params to getMediaItems', async () => {
    const { getMediaItems } = require('@/lib/admin/media')
    
    render(await MidiaPage({ searchParams: Promise.resolve({ folder: 'root', search: 'image', type: 'image/jpeg' }) }))
    
    expect(getMediaItems).toHaveBeenCalledWith({
      folderId: null,
      search: 'image',
      mimeType: 'image/jpeg',
    })
  })

  it('handles folder parameter correctly', async () => {
    const { getMediaItems, getMediaFolders } = require('@/lib/admin/media')
    
    render(await MidiaPage({ searchParams: Promise.resolve({ folder: 'folder-123' }) }))
    
    expect(getMediaItems).toHaveBeenCalledWith({
      folderId: 'folder-123',
      search: undefined,
      mimeType: undefined,
    })
    expect(getMediaFolders).toHaveBeenCalledWith('folder-123')
  })
})
