'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { DividerSection } from '@/lib/landing-pages'

interface DividerSectionFormProps {
  section: DividerSection
  onChange: (section: DividerSection) => void
}

export function DividerSectionForm({ section, onChange }: DividerSectionFormProps) {
  const updateField = <K extends keyof DividerSection>(
    field: K,
    value: DividerSection[K]
  ) => {
    onChange({ ...section, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Divider Style */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
          Estilo do Divisor
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="style">Tipo de Linha</Label>
            <Select
              value={section.style || 'solid'}
              onValueChange={(value) =>
                updateField('style', value as 'solid' | 'dashed' | 'dotted' | 'gradient')
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Sólida</SelectItem>
                <SelectItem value="dashed">Tracejada</SelectItem>
                <SelectItem value="dotted">Pontilhada</SelectItem>
                <SelectItem value="gradient">Gradiente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thickness">Espessura</Label>
            <Select
              value={String(section.thickness || 1)}
              onValueChange={(value) => updateField('thickness', Number(value) as 1 | 2 | 3 | 4)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1px (Fina)</SelectItem>
                <SelectItem value="2">2px (Normal)</SelectItem>
                <SelectItem value="3">3px (Média)</SelectItem>
                <SelectItem value="4">4px (Grossa)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="width">Largura</Label>
            <Select
              value={section.width || 'full'}
              onValueChange={(value) =>
                updateField('width', value as 'full' | 'md' | 'sm')
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">100% (Total)</SelectItem>
                <SelectItem value="md">50% (Média)</SelectItem>
                <SelectItem value="sm">25% (Pequena)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="margin">Margem Vertical</Label>
            <Select
              value={section.margin || 'md'}
              onValueChange={(value) =>
                updateField('margin', value as 'sm' | 'md' | 'lg')
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Pequena</SelectItem>
                <SelectItem value="md">Média</SelectItem>
                <SelectItem value="lg">Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Cor (CSS)</Label>
          <Input
            id="color"
            value={section.color || ''}
            onChange={(e) => updateField('color', e.target.value)}
            placeholder="#e5e7eb ou rgba(0,0,0,0.1)"
          />
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
          Pré-visualização
        </h3>
        <div className="bg-white border border-[var(--color-admin-border)] rounded-lg p-8">
          <hr
            style={{
              borderColor: section.color || '#e5e7eb',
              borderWidth: section.thickness || 1,
              borderStyle: section.style || 'solid',
              width: section.width === 'sm' ? '25%' : section.width === 'md' ? '50%' : '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
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
          <Input
            id="className"
            value={section.className || ''}
            onChange={(e) => updateField('className', e.target.value)}
            placeholder="minha-classe outra-classe"
          />
        </div>
      </div>
    </div>
  )
}
