'use client'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { TextSection } from '@/lib/landing-pages'

interface TextSectionFormProps {
  section: TextSection
  onChange: (section: TextSection) => void
}

export function TextSectionForm({ section, onChange }: TextSectionFormProps) {
  const updateField = <K extends keyof TextSection>(
    field: K,
    value: TextSection[K]
  ) => {
    onChange({ ...section, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Content */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
          Conteúdo
        </h3>
        
        <div className="space-y-2">
          <Label htmlFor="content">Conteúdo HTML</Label>
          <Textarea
            id="content"
            value={section.content}
            onChange={(e) => updateField('content', e.target.value)}
            placeholder="<h2>Título</h2><p>Seu texto aqui...</p>"
            rows={10}
            className="font-mono text-sm"
          />
          <p className="text-xs text-[var(--color-admin-muted)]">
            Você pode usar HTML para formatar o conteúdo.
          </p>
        </div>
      </div>

      {/* Layout Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
          Layout
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="alignment">Alinhamento</Label>
            <Select
              value={section.alignment || 'left'}
              onValueChange={(value) =>
                updateField('alignment', value as 'left' | 'center' | 'right' | 'justify')
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Esquerda</SelectItem>
                <SelectItem value="center">Centro</SelectItem>
                <SelectItem value="right">Direita</SelectItem>
                <SelectItem value="justify">Justificado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxWidth">Largura Máxima</Label>
            <Select
              value={section.maxWidth || 'lg'}
              onValueChange={(value) =>
                updateField('maxWidth', value as 'sm' | 'md' | 'lg' | 'xl' | 'full')
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Pequena</SelectItem>
                <SelectItem value="md">Média</SelectItem>
                <SelectItem value="lg">Grande</SelectItem>
                <SelectItem value="xl">Extra Grande</SelectItem>
                <SelectItem value="full">Total</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="backgroundColor">Cor de Fundo (CSS)</Label>
          <input
            id="backgroundColor"
            type="text"
            value={section.backgroundColor || ''}
            onChange={(e) => updateField('backgroundColor', e.target.value)}
            placeholder="#ffffff ou transparent"
            className="w-full h-10 px-3 rounded-md border border-[var(--color-admin-border)] bg-white text-sm"
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
