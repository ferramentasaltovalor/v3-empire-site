import { WebhookConfigList } from './WebhookConfigList'
import { IncomingWebhookList } from './IncomingWebhookList'
import { getWebhookConfigs } from './actions'
import { getIncomingWebhooks } from './incoming-actions'

export const dynamic = 'force-dynamic'

export default async function WebhooksPage() {
  const [outgoingWebhooks, incomingWebhooks] = await Promise.all([
    getWebhookConfigs(),
    getIncomingWebhooks(),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-admin-text)]">
          Webhooks
        </h1>
        <p className="text-[var(--color-admin-muted)] mt-1">
          Configure webhooks de saída e entrada para integração com sistemas externos.
        </p>
      </div>

      {/* Incoming Webhooks Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-medium text-[var(--color-admin-text)]">
            Webhooks de Entrada
          </h2>
          <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
            Receber
          </span>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-purple-800 mb-2">Como funciona</h3>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Receba eventos de serviços externos como Stripe, Make, Zapier e outros.</li>
            <li>• Cada webhook tem uma URL única: <code className="bg-purple-100 px-1 rounded">/api/webhooks/incoming/{'{slug}'}</code></li>
            <li>• Verificação de assinatura para garantir autenticidade das requisições.</li>
            <li>• Suporte a whitelist de IPs para segurança adicional.</li>
            <li>• Rate limiting configurável por webhook.</li>
          </ul>
        </div>

        <IncomingWebhookList initialWebhooks={incomingWebhooks} />
      </section>

      {/* Outgoing Webhooks Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-medium text-[var(--color-admin-text)]">
            Webhooks de Saída
          </h2>
          <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
            Enviar
          </span>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Como funciona</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Quando um evento ocorre (ex: post publicado), enviamos uma requisição POST para as URLs configuradas.</li>
            <li>• O payload inclui dados do evento e uma assinatura HMAC-SHA256 se um secret for definido.</li>
            <li>• Tentativas de entrega são feitas com backoff exponencial em caso de falha.</li>
            <li>• Logs de entrega são mantidos por 30 dias.</li>
          </ul>
        </div>

        <WebhookConfigList initialWebhooks={outgoingWebhooks} />
      </section>
    </div>
  )
}
