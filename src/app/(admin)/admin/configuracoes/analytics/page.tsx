// Analytics Settings Page
// Manage analytics providers (GA4, GTM, Meta Pixel, etc.)

import { requireAdmin } from '@/lib/auth/permissions'
import { getAllAnalyticsConfigs } from './actions'
import { AnalyticsConfigList } from './AnalyticsConfigList'

export default async function AnalyticsSettingsPage() {
  await requireAdmin()
  
  const configs = await getAllAnalyticsConfigs()
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-admin-text)]">
            Analytics
          </h1>
          <p className="text-[var(--color-admin-muted)]">
            Configure provedores de analytics para rastreamento do site
          </p>
        </div>
      </div>
      
      <AnalyticsConfigList initialConfigs={configs} />
    </div>
  )
}
