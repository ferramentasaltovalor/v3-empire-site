'use client'

/**
 * Analytics Configuration List Component
 * Displays and manages analytics provider configurations
 */

import { useState } from 'react'
import type { AnalyticsConfig, AnalyticsProviderType } from '@/lib/analytics/types'
import {
  providerDisplayNames,
  providerDescriptions,
  providerTrackingIdExamples,
} from '@/lib/analytics/providers'
import {
  createAnalyticsConfigAction,
  updateAnalyticsConfigAction,
  toggleAnalyticsConfigAction,
  deleteAnalyticsConfigAction,
  testAnalyticsConnectionAction,
} from './actions'

interface AnalyticsConfigListProps {
  initialConfigs: AnalyticsConfig[]
}

export function AnalyticsConfigList({ initialConfigs }: AnalyticsConfigListProps) {
  const [configs, setConfigs] = useState<AnalyticsConfig[]>(initialConfigs)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const handleToggle = async (id: string) => {
    clearMessages()
    setLoading(true)
    
    const result = await toggleAnalyticsConfigAction(id)
    
    if (result.success && result.data) {
      setConfigs(configs.map(c => c.id === id ? result.data! : c))
      setSuccess(`Configuração ${result.data.active ? 'ativada' : 'desativada'} com sucesso`)
    } else {
      setError(result.error || 'Erro ao alternar configuração')
    }
    
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta configuração?')) return
    
    clearMessages()
    setLoading(true)
    
    const result = await deleteAnalyticsConfigAction(id)
    
    if (result.success) {
      setConfigs(configs.filter(c => c.id !== id))
      setSuccess('Configuração excluída com sucesso')
    } else {
      setError(result.error || 'Erro ao excluir configuração')
    }
    
    setLoading(false)
  }

  const handleTest = async (type: AnalyticsProviderType, trackingId: string) => {
    clearMessages()
    setLoading(true)
    
    const result = await testAnalyticsConnectionAction(type, trackingId)
    
    if (result.success) {
      setSuccess(result.info || 'Conexão testada com sucesso')
    } else {
      setError(result.error || 'Erro ao testar conexão')
    }
    
    setLoading(false)
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
          Adicionar Provider
        </button>
      )}

      {/* Add New Form */}
      {isAddingNew && (
        <ConfigForm
          onSave={async (formData) => {
            clearMessages()
            setLoading(true)
            
            const result = await createAnalyticsConfigAction(formData)
            
            if (result.success && result.data) {
              setConfigs([...configs, result.data])
              setIsAddingNew(false)
              setSuccess('Configuração criada com sucesso')
            } else {
              setError(result.error || 'Erro ao criar configuração')
            }
            
            setLoading(false)
          }}
          onCancel={() => setIsAddingNew(false)}
          loading={loading}
        />
      )}

      {/* Config List */}
      <div className="bg-white rounded-lg border border-[var(--color-admin-border)] overflow-hidden">
        {configs.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-admin-muted)]">
            Nenhuma configuração de analytics cadastrada.
            <br />
            Clique em "Adicionar Provider" para começar.
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-admin-border)]">
            {configs.map(config => (
              <div key={config.id} className="p-4">
                {editingId === config.id ? (
                  <ConfigForm
                    initialData={config}
                    onSave={async (formData) => {
                      clearMessages()
                      setLoading(true)
                      
                      const result = await updateAnalyticsConfigAction(config.id, formData)
                      
                      if (result.success && result.data) {
                        setConfigs(configs.map(c => c.id === config.id ? result.data! : c))
                        setEditingId(null)
                        setSuccess('Configuração atualizada com sucesso')
                      } else {
                        setError(result.error || 'Erro ao atualizar configuração')
                      }
                      
                      setLoading(false)
                    }}
                    onCancel={() => setEditingId(null)}
                    loading={loading}
                  />
                ) : (
                  <ConfigItem
                    config={config}
                    onToggle={() => handleToggle(config.id)}
                    onEdit={() => setEditingId(config.id)}
                    onDelete={() => handleDelete(config.id)}
                    onTest={() => handleTest(config.type, config.tracking_id || '')}
                    loading={loading}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface ConfigItemProps {
  config: AnalyticsConfig
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
  onTest: () => void
  loading: boolean
}

function ConfigItem({ config, onToggle, onEdit, onDelete, onTest, loading }: ConfigItemProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-[var(--color-admin-text)]">
            {config.name}
          </h3>
          <span className={`px-2 py-0.5 text-xs rounded-full ${
            config.active 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {config.active ? 'Ativo' : 'Inativo'}
          </span>
        </div>
        <p className="text-sm text-[var(--color-admin-muted)] mt-1">
          {providerDisplayNames[config.type]}
          {config.tracking_id && ` • ${config.tracking_id}`}
        </p>
        <p className="text-xs text-[var(--color-admin-muted)] mt-1">
          {providerDescriptions[config.type]}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        {config.tracking_id && (
          <button
            onClick={onTest}
            disabled={loading}
            className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
          >
            Testar
          </button>
        )}
        <button
          onClick={onToggle}
          disabled={loading}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors disabled:opacity-50 ${
            config.active
              ? 'text-orange-600 hover:bg-orange-50'
              : 'text-green-600 hover:bg-green-50'
          }`}
        >
          {config.active ? 'Desativar' : 'Ativar'}
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
  )
}

interface ConfigFormProps {
  initialData?: AnalyticsConfig
  onSave: (formData: FormData) => Promise<void>
  onCancel: () => void
  loading: boolean
}

function ConfigForm({ initialData, onSave, onCancel, loading }: ConfigFormProps) {
  const [type, setType] = useState<AnalyticsProviderType>(initialData?.type || 'ga4')
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await onSave(formData)
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
            name="name"
            defaultValue={initialData?.name || ''}
            required
            className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
            placeholder="Ex: Google Analytics Principal"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-1">
            Tipo de Provider *
          </label>
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as AnalyticsProviderType)}
            required
            className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
          >
            {(Object.keys(providerDisplayNames) as AnalyticsProviderType[]).map(key => (
              <option key={key} value={key}>
                {providerDisplayNames[key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {type !== 'custom' ? (
        <div>
          <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-1">
            Tracking ID *
          </label>
          <input
            type="text"
            name="tracking_id"
            defaultValue={initialData?.tracking_id || ''}
            required
            className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)]"
            placeholder={providerTrackingIdExamples[type]}
          />
          <p className="text-xs text-[var(--color-admin-muted)] mt-1">
            Formato esperado: {providerTrackingIdExamples[type]}
          </p>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-1">
            HTML Personalizado *
          </label>
          <textarea
            name="custom_html"
            defaultValue={initialData?.custom_html || ''}
            required={type === 'custom'}
            rows={6}
            className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)] font-mono text-sm"
            placeholder="<!-- Cole aqui o código do script -->"
          />
          <p className="text-xs text-[var(--color-admin-muted)] mt-1">
            Cole o código HTML completo do script de tracking
          </p>
        </div>
      )}

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
          disabled={loading}
          className="px-4 py-2 text-sm bg-[var(--color-admin-primary)] text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  )
}
