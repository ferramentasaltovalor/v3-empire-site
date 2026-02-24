'use client'

/**
 * Webhook Configuration List Component
 * Displays and manages outgoing webhook configurations
 */

import { useState } from 'react'
import type { WebhookConfig, WebhookEventType, WebhookLog } from '@/lib/webhooks/types'
import { WEBHOOK_EVENT_CATEGORIES, WEBHOOK_EVENT_LABELS } from '@/lib/webhooks/types'
import {
  createWebhookConfig,
  updateWebhookConfig,
  toggleWebhookConfig,
  deleteWebhookConfig,
  testWebhookConfig,
  getWebhookLogs,
} from './actions'

interface WebhookConfigListProps {
  initialWebhooks: WebhookConfig[]
}

export function WebhookConfigList({ initialWebhooks }: WebhookConfigListProps) {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(initialWebhooks)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [viewingLogsId, setViewingLogsId] = useState<string | null>(null)
  const [logs, setLogs] = useState<WebhookLog[]>([])
  const [loading, setLoading] = useState(false)
  const [logsLoading, setLogsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const handleToggle = async (id: string) => {
    clearMessages()
    setLoading(true)
    
    const result = await toggleWebhookConfig(id)
    
    if (result.success && result.data) {
      setWebhooks(webhooks.map(w => w.id === id ? result.data! : w))
      setSuccess(`Webhook ${result.data.active ? 'ativado' : 'desativado'} com sucesso`)
    } else {
      setError(result.error || 'Erro ao alternar webhook')
    }
    
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este webhook?')) return
    
    clearMessages()
    setLoading(true)
    
    const result = await deleteWebhookConfig(id)
    
    if (result.success) {
      setWebhooks(webhooks.filter(w => w.id !== id))
      setSuccess('Webhook excluído com sucesso')
    } else {
      setError(result.error || 'Erro ao excluir webhook')
    }
    
    setLoading(false)
  }

  const handleTest = async (id: string) => {
    clearMessages()
    setLoading(true)
    
    const result = await testWebhookConfig(id)
    
    if (result.success) {
      setSuccess(result.info || 'Webhook testado com sucesso')
    } else {
      setError(result.error || 'Erro ao testar webhook')
    }
    
    setLoading(false)
  }

  const handleViewLogs = async (id: string) => {
    if (viewingLogsId === id) {
      setViewingLogsId(null)
      setLogs([])
      return
    }

    setLogsLoading(true)
    setViewingLogsId(id)
    
    try {
      const logsData = await getWebhookLogs(id)
      setLogs(logsData)
    } catch (err) {
      setError('Erro ao carregar logs')
      setViewingLogsId(null)
    }
    
    setLogsLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Add New Button */}
      {!isAddingNew && (
        <button
          onClick={() => setIsAddingNew(true)}
          className="inline-flex items-center px-4 py-2 bg-[var(--color-admin-primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Adicionar Webhook
        </button>
      )}

      {/* Add New Form */}
      {isAddingNew && (
        <WebhookForm
          onSave={async (input) => {
            clearMessages()
            setLoading(true)
            
            const result = await createWebhookConfig(input)
            
            if (result.success && result.data) {
              setWebhooks([...webhooks, result.data])
              setIsAddingNew(false)
              setSuccess('Webhook criado com sucesso')
            } else {
              setError(result.error || 'Erro ao criar webhook')
            }
            
            setLoading(false)
          }}
          onCancel={() => setIsAddingNew(false)}
          loading={loading}
        />
      )}

      {/* Webhook List */}
      <div className="bg-white rounded-lg border border-[var(--color-admin-border)] overflow-hidden">
        {webhooks.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-admin-muted)]">
            Nenhum webhook configurado.
            <br />
            Clique em "Adicionar Webhook" para começar.
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-admin-border)]">
            {webhooks.map(webhook => (
              <div key={webhook.id} className="p-4">
                {editingId === webhook.id ? (
                  <WebhookForm
                    initialData={webhook}
                    onSave={async (input) => {
                      clearMessages()
                      setLoading(true)
                      
                      const result = await updateWebhookConfig(webhook.id, input)
                      
                      if (result.success && result.data) {
                        setWebhooks(webhooks.map(w => w.id === webhook.id ? result.data! : w))
                        setEditingId(null)
                        setSuccess('Webhook atualizado com sucesso')
                      } else {
                        setError(result.error || 'Erro ao atualizar webhook')
                      }
                      
                      setLoading(false)
                    }}
                    onCancel={() => setEditingId(null)}
                    loading={loading}
                  />
                ) : (
                  <>
                    <WebhookItem
                      webhook={webhook}
                      onToggle={() => handleToggle(webhook.id)}
                      onEdit={() => setEditingId(webhook.id)}
                      onDelete={() => handleDelete(webhook.id)}
                      onTest={() => handleTest(webhook.id)}
                      onViewLogs={() => handleViewLogs(webhook.id)}
                      showingLogs={viewingLogsId === webhook.id}
                      loading={loading}
                    />
                    {viewingLogsId === webhook.id && (
                      <WebhookLogs logs={logs} loading={logsLoading} />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface WebhookItemProps {
  webhook: WebhookConfig
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
  onTest: () => void
  onViewLogs: () => void
  showingLogs: boolean
  loading: boolean
}

function WebhookItem({ webhook, onToggle, onEdit, onDelete, onTest, onViewLogs, showingLogs, loading }: WebhookItemProps) {
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-medium text-[var(--color-admin-text)]">
              {webhook.name}
            </h3>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              webhook.active 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {webhook.active ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          <p className="text-sm text-[var(--color-admin-muted)] mt-1 font-mono truncate max-w-lg">
            {webhook.url}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {webhook.events.map(event => (
              <span 
                key={event} 
                className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded"
              >
                {WEBHOOK_EVENT_LABELS[event] || event}
              </span>
            ))}
          </div>
          {webhook.last_triggered_at && (
            <p className="text-xs text-[var(--color-admin-muted)] mt-2">
              Último disparo: {new Date(webhook.last_triggered_at).toLocaleString('pt-BR')}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onTest}
            disabled={loading}
            className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
          >
            Testar
          </button>
          <button
            onClick={onViewLogs}
            disabled={loading}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors disabled:opacity-50 ${
              showingLogs 
                ? 'text-white bg-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Logs
          </button>
          <button
            onClick={onToggle}
            disabled={loading}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors disabled:opacity-50 ${
              webhook.active
                ? 'text-orange-600 hover:bg-orange-50'
                : 'text-green-600 hover:bg-green-50'
            }`}
          >
            {webhook.active ? 'Desativar' : 'Ativar'}
          </button>
          <button
            onClick={onEdit}
            disabled={loading}
            className="px-3 py-1.5 text-sm text-[var(--color-admin-muted)] hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
          >
            Editar
          </button>
          <button
            onClick={onDelete}
            disabled={loading}
            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}

interface WebhookLogsProps {
  logs: WebhookLog[]
  loading: boolean
}

function WebhookLogs({ logs, loading }: WebhookLogsProps) {
  if (loading) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-[var(--color-admin-muted)]">Carregando logs...</p>
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-[var(--color-admin-muted)]">Nenhum log disponível.</p>
      </div>
    )
  }

  return (
    <div className="mt-4 bg-gray-50 rounded-lg overflow-hidden">
      <div className="p-3 border-b border-gray-200 bg-gray-100">
        <h4 className="text-sm font-medium text-[var(--color-admin-text)]">Logs de Entrega</h4>
      </div>
      <div className="max-h-64 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-[var(--color-admin-muted)]">Data</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-[var(--color-admin-muted)]">Evento</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-[var(--color-admin-muted)]">Status</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-[var(--color-admin-muted)]">Tentativas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.map(log => (
              <tr key={log.id}>
                <td className="px-3 py-2 text-[var(--color-admin-text)]">
                  {new Date(log.created_at).toLocaleString('pt-BR')}
                </td>
                <td className="px-3 py-2 text-[var(--color-admin-text)]">
                  {WEBHOOK_EVENT_LABELS[log.event as WebhookEventType] || log.event}
                </td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 text-xs rounded ${
                    log.status_code && log.status_code >= 200 && log.status_code < 300
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {log.status_code || 'Falhou'}
                  </span>
                </td>
                <td className="px-3 py-2 text-[var(--color-admin-text)]">
                  {log.attempts}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface WebhookFormProps {
  initialData?: WebhookConfig
  onSave: (input: {
    name: string
    url: string
    events: WebhookEventType[]
    headers?: Record<string, string>
    secret?: string
    active?: boolean
  }) => Promise<void>
  onCancel: () => void
  loading: boolean
}

function WebhookForm({ initialData, onSave, onCancel, loading }: WebhookFormProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [url, setUrl] = useState(initialData?.url || '')
  const [secret, setSecret] = useState(initialData?.secret || '')
  const [selectedEvents, setSelectedEvents] = useState<WebhookEventType[]>(initialData?.events || [])
  const [customHeaderKey, setCustomHeaderKey] = useState('')
  const [customHeaderValue, setCustomHeaderValue] = useState('')
  const [headers, setHeaders] = useState<Record<string, string>>(initialData?.headers || {})

  const handleEventToggle = (event: WebhookEventType) => {
    setSelectedEvents(prev => 
      prev.includes(event) 
        ? prev.filter(e => e !== event)
        : [...prev, event]
    )
  }

  const handleCategoryToggle = (categoryEvents: WebhookEventType[]) => {
    const allSelected = categoryEvents.every(e => selectedEvents.includes(e))
    if (allSelected) {
      setSelectedEvents(prev => prev.filter(e => !categoryEvents.includes(e)))
    } else {
      setSelectedEvents(prev => [...new Set([...prev, ...categoryEvents])])
    }
  }

  const handleAddHeader = () => {
    if (customHeaderKey && customHeaderValue) {
      setHeaders(prev => ({ ...prev, [customHeaderKey]: customHeaderValue }))
      setCustomHeaderKey('')
      setCustomHeaderValue('')
    }
  }

  const handleRemoveHeader = (key: string) => {
    setHeaders(prev => {
      const newHeaders = { ...prev }
      delete newHeaders[key]
      return newHeaders
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave({
      name,
      url,
      events: selectedEvents,
      headers: Object.keys(headers).length > 0 ? headers : undefined,
      secret: secret || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-1">
            Nome *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
            placeholder="Ex: Notificar Zapier"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-1">
            URL do Endpoint *
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
            placeholder="https://api.exemplo.com/webhook"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-1">
          Secret (opcional)
        </label>
        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
          placeholder="Chave secreta para assinatura HMAC-SHA256"
        />
        <p className="text-xs text-[var(--color-admin-muted)] mt-1">
          Se definido, payloads serão assinados com HMAC-SHA256
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-2">
          Eventos *
        </label>
        <div className="space-y-3 p-3 bg-white border border-[var(--color-admin-border)] rounded-md">
          {Object.entries(WEBHOOK_EVENT_CATEGORIES).map(([key, category]) => (
            <div key={key}>
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  id={`category-${key}`}
                  checked={category.events.every(e => selectedEvents.includes(e))}
                  onChange={() => handleCategoryToggle(category.events as WebhookEventType[])}
                  className="rounded border-gray-300 text-[var(--color-admin-primary)] focus:ring-[var(--color-admin-primary)]"
                />
                <label htmlFor={`category-${key}`} className="text-sm font-medium text-[var(--color-admin-text)]">
                  {category.label}
                </label>
              </div>
              <div className="ml-6 flex flex-wrap gap-2">
                {category.events.map(event => (
                  <label key={event} className="inline-flex items-center gap-1 text-xs">
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(event)}
                      onChange={() => handleEventToggle(event)}
                      className="rounded border-gray-300 text-[var(--color-admin-primary)] focus:ring-[var(--color-admin-primary)]"
                    />
                    {WEBHOOK_EVENT_LABELS[event]}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        {selectedEvents.length === 0 && (
          <p className="text-xs text-red-500 mt-1">Selecione pelo menos um evento</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-1">
          Headers Personalizados (opcional)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={customHeaderKey}
            onChange={(e) => setCustomHeaderKey(e.target.value)}
            className="flex-1 px-3 py-2 border border-[var(--color-admin-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
            placeholder="Header Name"
          />
          <input
            type="text"
            value={customHeaderValue}
            onChange={(e) => setCustomHeaderValue(e.target.value)}
            className="flex-1 px-3 py-2 border border-[var(--color-admin-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
            placeholder="Header Value"
          />
          <button
            type="button"
            onClick={handleAddHeader}
            className="px-3 py-2 text-sm bg-gray-200 text-[var(--color-admin-text)] rounded-md hover:bg-gray-300 transition-colors"
          >
            Adicionar
          </button>
        </div>
        {Object.keys(headers).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(headers).map(([key, value]) => (
              <span 
                key={key} 
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-200 text-sm rounded"
              >
                <span className="font-medium">{key}:</span> {value}
                <button
                  type="button"
                  onClick={() => handleRemoveHeader(key)}
                  className="text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-sm text-[var(--color-admin-muted)] hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || selectedEvents.length === 0}
          className="px-4 py-2 text-sm bg-[var(--color-admin-primary)] text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  )
}
