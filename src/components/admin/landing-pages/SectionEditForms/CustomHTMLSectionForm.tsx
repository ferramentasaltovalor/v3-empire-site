'use client'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import type { CustomHTMLSection } from '@/lib/landing-pages'

interface CustomHTMLSectionFormProps {
  section: CustomHTMLSection
  onChange: (section: CustomHTMLSection) => void
}

export function CustomHTMLSectionForm({ section, onChange }: CustomHTMLSectionFormProps) {
  const updateField = <K extends keyof CustomHTMLSection>(
    field: K,
    value: CustomHTMLSection[K]
  ) => {
    onChange({ ...section, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* HTML Content */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
          Código HTML
        </h3>
        
        <div className="space-y-2">
          <Label htmlFor="html">HTML Personalizado</Label>
          <Textarea
            id="html"
            value={section.html}
            onChange={(e) => updateField('html', e.target.value)}
            placeholder="<div>Seu HTML aqui</div>"
            rows={12}
            className="font-mono text-sm bg-gray-900 text-green-400"
          />
          <p className="text-xs text-[var(--color-admin-muted)]">
            Insira código HTML personalizado. Tenha cuidado com scripts e estilos.
          </p>
        </div>
      </div>

      {/* Security Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
          Segurança
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="sanitize">Sanitizar HTML</Label>
            <p className="text-xs text-[var(--color-admin-muted)]">
              Remove scripts e tags perigosas automaticamente
            </p>
          </div>
          <Switch
            id="sanitize"
            checked={section.sanitize !== false}
            onCheckedChange={(checked: boolean) => updateField('sanitize', checked)}
          />
        </div>
      </div>

      {/* Custom CSS Class */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
          Avançado
        </h3>

        <div className="space-y-2">
          <Label htmlFor="className">Classe CSS Personalizada</Label>
          <input
            id="className"
            type="text"
            value={section.className || ''}
            onChange={(e) => updateField('className', e.target.value)}
            placeholder="minha-classe outra-classe"
            className="w-full h-10 px-3 rounded-md border border-[var(--color-admin-border)] bg-white text-sm"
          />
        </div>
      </div>
    </div>
  )
}
