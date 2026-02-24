// src/app/(admin)/admin/configuracoes/page.test.tsx
// Tests for Admin Settings Pages

import { render, screen } from '@/test/utils'
import AnalyticsPage from './analytics/page'
import GeralPage from './geral/page'
import IntegracoesPage from './integracoes/page'
import SeoPage from './seo/page'
import WebhooksPage from './webhooks/page'

describe('Settings Pages', () => {
  describe('AnalyticsPage', () => {
    it('renders page title', () => {
      render(<AnalyticsPage />)
      
      expect(screen.getByText('Analytics')).toBeInTheDocument()
    })

    it('renders under construction message', () => {
      render(<AnalyticsPage />)
      
      expect(screen.getByText('Em construção...')).toBeInTheDocument()
    })
  })

  describe('GeralPage', () => {
    it('renders page title', () => {
      render(<GeralPage />)
      
      expect(screen.getByText('Configurações Gerais')).toBeInTheDocument()
    })

    it('renders under construction message', () => {
      render(<GeralPage />)
      
      expect(screen.getByText('Em construção...')).toBeInTheDocument()
    })
  })

  describe('IntegracoesPage', () => {
    it('renders page title', () => {
      render(<IntegracoesPage />)
      
      expect(screen.getByText('Integrações')).toBeInTheDocument()
    })

    it('renders under construction message', () => {
      render(<IntegracoesPage />)
      
      expect(screen.getByText('Em construção...')).toBeInTheDocument()
    })
  })

  describe('SeoPage', () => {
    it('renders page title', () => {
      render(<SeoPage />)
      
      expect(screen.getByText('SEO')).toBeInTheDocument()
    })

    it('renders under construction message', () => {
      render(<SeoPage />)
      
      expect(screen.getByText('Em construção...')).toBeInTheDocument()
    })
  })

  describe('WebhooksPage', () => {
    it('renders page title', () => {
      render(<WebhooksPage />)
      
      expect(screen.getByText('Webhooks')).toBeInTheDocument()
    })

    it('renders under construction message', () => {
      render(<WebhooksPage />)
      
      expect(screen.getByText('Em construção...')).toBeInTheDocument()
    })
  })
})
