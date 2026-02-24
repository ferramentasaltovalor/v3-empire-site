'use client'

/**
 * Incoming Webhook Configuration List Component
 * Displays and manages incoming webhook configurations
 */

import { useState } from 'react'
import type { IncomingWebhookConfig, IncomingWebhookLog, IncomingWebhookSource } from '@/lib/webhooks/incoming'
import { INCOMING_WEBHOOK_SOURCE_LABELS } from '@/lib/webhooks/incoming'
import {
  createIncomingWebhook,
  updateIncomingWebhook,
  toggleIncomingWebhook,
  deleteIncomingWebhook,
  regenerateIncomingWebhookSecret,
  getIncomingWebhookLogs,
  getIncomingWebhookUrl,
} from './incoming-actions'

interface IncomingWebhookListProps {
  initialWebhooks: IncomingWebhookConfig[]
}

export function IncomingWebhookList({ initialWebhooks }: IncomingWebhookListProps) {
  const [webhooks, setWebhooks] = useState<IncomingWebhookConfig[]>(initialWebhooks)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [viewingLogsId, setViewingLogsId] = useState<string | null>(null)
  const [logs, setLogs] = useState<IncomingWebhookLog[]>([])
  const [loading, setLoading] = useState(false)
  const [logsLoading, setLogsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showingUrl, setShowingUrl] = useState<string | null>(null)

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const handleToggle = async (id: string) => {
    clearMessages()
    setLoading(true)

    const result = await toggleIncomingWebhook(id)

    if (result.success && result.data) {
      setWebhooks(webhooks.map((w) => (w.id === id ? result.data! : w)))
      setSuccess(`Webhook ${result.data.enabled ? 'ativado' : 'desativado'} com sucesso`)
    } else {
      setError(result.error || 'Erro ao alternar webhook')
    }

    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este webhook?')) return

    clearMessages()
    setLoading(true)

    const result = await deleteIncomingWebhook(id)

    if (result.success) {
      setWebhooks(webhooks.filter((w) => w.id !== id))
      setSuccess('Webhook excluído com sucesso')
    } else {
      setError(result.error || 'Erro ao excluir webhook')
    }

    setLoading(false)
  }

  const handleRegenerateSecret = async (id: string) => {
    if (!confirm('Tem certeza? A chave anterior deixará de funcionar.')) return

    clearMessages()
    setLoading(true)

    const result = await regenerateIncomingWebhookSecret(id)

    if (result.success && result.secret_key) {
      setWebhooks(
        webhooks.map((w) => (w.id === id ? { ...w, secret_key: result.secret_key! } : w))
      )
      setSuccess('Nova chave secreta gerada. Copie-a agora!')
    } else {
      setError(result.error || 'Erro ao regenerar chave')
    }

    setLoading(false)
  }

  const handleCopyUrl = (slug: string) => {
    const url = getIncomingWebhookUrl(slug)
    navigator.clipboard.writeText(url)
    setSuccess('URL copiada para a área de transferência')
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
      const logsData = await getIncomingWebhookLogs(id)
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
          Adicionar Webhook de Entrada
        </button>
      )}

      {/* Add New Form */}
      {isAddingNew && (
        <IncomingWebhookForm
          onSave={async (input) => {
            clearMessages()
            setLoading(true)

            const result = await createIncomingWebhook(input)

            if (result.success && result.data) {
              setWebhooks([...webhooks, result.data])
              setIsAddingNew(false)
              setSuccess('Webhook criado com sucesso!')
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
            Nenhum webhook de entrada configurado.
            <br />
            Clique em "Adicionar Webhook de Entrada" para começar.
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-admin-border)]">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="p-4">
                {editingId === webhook.id ? (
                  <IncomingWebhookForm
                    initialData={webhook}
                    onSave={async (input) => {
                      clearMessages()
                      setLoading(true)

                      const result = await updateIncomingWebhook(webhook.id, input)

                      if (result.success && result.data) {
                        setWebhooks(
                          webhooks.map((w) => (w.id === webhook.id ? result.data! : w))
                        )
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
                    <IncomingWebhookItem
                      webhook={webhook}
                      onToggle={() => handleToggle(webhook.id)}
                      onEdit={() => setEditingId(webhook.id)}
                      onDelete={() => handleDelete(webhook.id)}
                      onRegenerateSecret={() => handleRegenerateSecret(webhook.id)}
                      onCopyUrl={() => handleCopyUrl(webhook.slug)}
                      onViewLogs={() => handleViewLogs(webhook.id)}
                      showingLogs={viewingLogsId === webhook.id}
                      showingUrl={showingUrl === webhook.id}
                      onToggleUrl={() =>
                        setShowingUrl(showingUrl === webhook.id ? null : webhook.id)
                      }
                      loading={loading}
                    />
                    {viewingLogsId === webhook.id && (
                      <IncomingWebhookLogs logs={logs} loading={logsLoading} />
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

interface IncomingWebhookItemProps {
  webhook: IncomingWebhookConfig
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
  onRegenerateSecret: () => void
  onCopyUrl: () => void
  onViewLogs: () => void
  showingLogs: boolean
  showingUrl: boolean
  onToggleUrl: () => void
  loading: boolean
}

function IncomingWebhookItem({
  webhook,
  onToggle,
  onEdit,
  onDelete,
  onRegenerateSecret,
  onCopyUrl,
  onViewLogs,
  showingLogs,
  showingUrl,
  onToggleUrl,
  loading,
}: IncomingWebhookItemProps) {
  const webhookUrl = getIncomingWebhookUrl(webhook.slug)

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-medium text-[var(--color-admin-text)]">{webhook.name}</h3>
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${
                webhook.enabled
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {webhook.enabled ? 'Ativo' : 'Inativo'}
            </span>
            <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
              {INCOMING_WEBHOOK_SOURCE_LABELS[webhook.source] || webhook.source}
            </span>
          </div>
          {webhook.description && (
            <p className="text-sm text-[var(--color-admin-muted)] mt-1">
              {webhook.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
              /api/webhooks/incoming/{webhook.slug}
            </code>
            <button
              onClick={onCopyUrl}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Copiar URL
            </button>
          </div>
          {webhook.last_received_at && (
            <p className="text-xs text-[var(--color-admin-muted)] mt-2">
              Último recebimento: {new Date(webhook.last_received_at).toLocaleString('pt-BR')} |
              Total de requisições: {webhook.total_requests}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onToggleUrl}
            disabled={loading}
            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
          >
            {showingUrl ? 'Ocultar' : 'Detalhes'}
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
              webhook.enabled
                ? 'text-orange-600 hover:bg-orange-50'
                : 'text-green-600 hover:bg-green-50'
            }`}
          >
            {webhook.enabled ? 'Desativar' : 'Ativar'}
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

      {/* Expanded Details */}
      {showingUrl && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
          <div>
            <label className="block text-xs font-medium text-[var(--color-admin-muted)] mb-1">
              URL do Webhook
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm bg-white px-3 py-2 border rounded font-mono break-all">
                {webhookUrl}
              </code>
              <button
                onClick={onCopyUrl}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Copiar
              </button>
            </div>
          </div>

          {webhook.secret_key && (
            <div>
              <label className="block text-xs font-medium text-[var(--color-admin-muted)] mb-1">
                Chave Secreta (para verificação de assinatura)
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-white px-3 py-2 border rounded font-mono break-all">
                  {webhook.secret_key}
                </code>
                <button
                  onClick={onRegenerateSecret}
                  className="px-3 py-2 text-sm bg-orange-600 text-white rounded hover:bg-orange-700"
                >
                  Regenerar
                </button>
              </div>
              <p className="text-xs text-orange-600 mt-1">
                ⚠️ Mantenha esta chave segura! Use-a para configurar o serviço externo.
              </p>
            </div>
          )}

          {webhook.allowed_ips && webhook.allowed_ips.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-[var(--color-admin-muted)] mb-1">
                IPs Permitidos
              </label>
              <div className="flex flex-wrap gap-1">
                {webhook.allowed_ips.map((ip) => (
                  <span
                    key={ip}
                    className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded"
                  >
                    {ip}
                  </span>
                ))}
              </div>
            </div>
          )}

          {webhook.accepted_events && webhook.accepted_events.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-[var(--color-admin-muted)] mb-1">
                Eventos Aceitos
              </label>
              <div className="flex flex-wrap gap-1">
                {webhook.accepted_events.map((event) => (
                  <span
                    key={event}
                    className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded"
                  >
                    {event}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[var(--color-admin-muted)]">Verificar Assinatura:</span>{' '}
              <span className={webhook.verify_signature ? 'text-green-600' : 'text-gray-500'}>
                {webhook.verify_signature ? 'Sim' : 'Não'}
              </span>
            </div>
            <div>
              <span className="text-[var(--color-admin-muted)]">Rate Limit:</span>{' '}
              <span>{webhook.rate_limit} req/{webhook.rate_limit_window}s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface IncomingWebhookLogsProps {
  logs: IncomingWebhookLog[]
  loading: boolean
}

function IncomingWebhookLogs({ logs, loading }: IncomingWebhookLogsProps) {
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
        <p className="text-sm text-[var(--color-admin-muted)]">
          Nenhum log disponível. O webhook ainda não recebeu requisições.
        </p>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    received: 'bg-blue-100 text-blue-700',
    processing: 'bg-yellow-100 text-yellow-700',
    processed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  }

  return (
    <div className="mt-4 bg-gray-50 rounded-lg overflow-hidden">
      <div className="p-3 border-b border-gray-200 bg-gray-100">
        <h4 className="text-sm font-medium text-[var(--color-admin-text)]">
          Logs de Recepção ({logs.length})
        </h4>
      </div>
      <div className="max-h-64 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-[var(--color-admin-muted)]">
                Data
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-[var(--color-admin-muted)]">
                Evento
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-[var(--color-admin-muted)]">
                Status
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-[var(--color-admin-muted)]">
                IP
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-[var(--color-admin-muted)]">
                Tempo
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-3 py-2 text-[var(--color-admin-text)]">
                  {new Date(log.created_at).toLocaleString('pt-BR')}
                </td>
                <td className="px-3 py-2 text-[var(--color-admin-text)]">
                  {log.event_type || '-'}
                </td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 text-xs rounded ${statusColors[log.status]}`}>
                    {log.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-[var(--color-admin-text)] font-mono text-xs">
                  {log.ip_address || '-'}
                </td>
                <td className="px-3 py-2 text-[var(--color-admin-text)]">
                  {log.processing_time_ms ? `${log.processing_time_ms}ms` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface IncomingWebhookFormProps {
  initialData?: IncomingWebhookConfig
  onSave: (input: {
    slug?: string
    name: string
    description?: string
    source: IncomingWebhookSource
    secret_key?: string
    allowed_ips?: string[]
    enabled?: boolean
    rate_limit?: number
    rate_limit_window?: number
    verify_signature?: boolean
    accepted_events?: string[]
  }) => Promise<void>
  onCancel: () => void
  loading: boolean
}

function IncomingWebhookForm({
  initialData,
  onSave,
  onCancel,
  loading,
}: IncomingWebhookFormProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [source, setSource] = useState<IncomingWebhookSource>(initialData?.source || 'generic')
  const [secretKey, setSecretKey] = useState(initialData?.secret_key || '')
  const [verifySignature, setVerifySignature] = useState(initialData?.verify_signature ?? true)
  const [allowedIps, setAllowedIps] = useState(initialData?.allowed_ips?.join(', ') || '')
  const [acceptedEvents, setAcceptedEvents] = useState(
    initialData?.accepted_events?.join(', ') || ''
  )
  const [rateLimit, setRateLimit] = useState(initialData?.rate_limit?.toString() || '100')
  const [rateLimitWindow, setRateLimitWindow] = useState(
    initialData?.rate_limit_window?.toString() || '60'
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await onSave({
      slug: slug || undefined,
      name,
      description: description || undefined,
      source,
      secret_key: secretKey || undefined,
      verify_signature: verifySignature,
      allowed_ips: allowedIps
        .split(',')
        .map((ip) => ip.trim())
        .filter(Boolean),
      accepted_events: acceptedEvents
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean),
      rate_limit: parseInt(rateLimit, 10) || undefined,
      rate_limit_window: parseInt(rateLimitWindow, 10) || undefined,
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
            placeholder="Ex: Stripe Payments"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-1">
            Slug (identificador da URL)
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
            className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)] font-mono"
            placeholder="Deixe vazio para gerar automaticamente"
          />
          {slug && (
            <p className="text-xs text-[var(--color-admin-muted)] mt-1">
              URL: /api/webhooks/incoming/{slug}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-1">
          Descrição
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
          placeholder="Descrição opcional do webhook"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-1">
            Fonte *
          </label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as IncomingWebhookSource)}
            required
            className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
          >
            {Object.entries(INCOMING_WEBHOOK_SOURCE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-1">
            Chave Secreta
          </label>
          <input
            type="text"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)] font-mono text-sm"
            placeholder="Deixe vazio para gerar automaticamente"
          />
          <p className="text-xs text-[var(--color-admin-muted)] mt-1">
            Usada para verificar assinatura do webhook
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-1">
            Rate Limit (req/min)
          </label>
          <input
            type="number"
            value={rateLimit}
            onChange={(e) => setRateLimit(e.target.value)}
            min="1"
            className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-1">
            Janela (segundos)
          </label>
          <input
            type="number"
            value={rateLimitWindow}
            onChange={(e) => setRateLimitWindow(e.target.value)}
            min="1"
            className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-1">
          IPs Permitidos (whitelist)
        </label>
        <input
          type="text"
          value={allowedIps}
          onChange={(e) => setAllowedIps(e.target.value)}
          className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
          placeholder="Deixe vazio para aceitar todos. Separado por vírgula: 192.168.1.1, 10.0.0.0/24"
        />
        <p className="text-xs text-[var(--color-admin-muted)] mt-1">
          Suporta IPs individuais e notação CIDR
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-1">
          Eventos Aceitos
        </label>
        <input
          type="text"
          value={acceptedEvents}
          onChange={(e) => setAcceptedEvents(e.target.value)}
          className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
          placeholder="Deixe vazio para aceitar todos. Separado por vírgula: payment.succeeded, payment.failed"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="verifySignature"
          checked={verifySignature}
          onChange={(e) => setVerifySignature(e.target.checked)}
          className="rounded border-[var(--color-admin-border)]"
        />
        <label htmlFor="verifySignature" className="text-sm text-[var(--color-admin-text)]">
          Verificar assinatura das requisições (recomendado)
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-admin-border)]">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-sm text-[var(--color-admin-muted)] hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || !name}
          className="px-4 py-2 text-sm bg-[var(--color-admin-primary)] text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  )
}
