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
import { Switch } from '@/components/ui/switch'
import type { ImageSection } from '@/lib/landing-pages'

interface ImageSectionFormProps {
  section: ImageSection
  onChange: (section: ImageSection) => void
}

export function ImageSectionForm({ section, onChange }: ImageSectionFormProps) {
  const updateField = <K extends keyof ImageSection>(
    field: K,
    value: ImageSection[K]
  ) => {
    onChange({ ...section, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Image Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
          Imagem
        </h3>
        
        <div className="space-y-2">
          <Label htmlFor="src">URL da Imagem</Label>
          <Input
            id="src"
            value={section.src}
            onChange={(e) => updateField('src', e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="alt">Texto Alternativo (Alt)</Label>
          <Input
            id="alt"
            value={section.alt}
            onChange={(e) => updateField('alt', e.target.value)}
            placeholder="Descrição da imagem"
          />
          <p className="text-xs text-[var(--color-admin-muted)]">
            Importante para acessibilidade e SEO
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="caption">Legenda (opcional)</Label>
          <Input
            id="caption"
            value={section.caption || ''}
            onChange={(e) => updateField('caption', e.target.value)}
            placeholder="Legenda da imagem"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="href">Link (opcional)</Label>
          <Input
            id="href"
            value={section.href || ''}
            onChange={(e) => updateField('href', e.target.value)}
            placeholder="https://..."
          />
          <p className="text-xs text-[var(--color-admin-muted)]">
            Se preenchido, a imagem será clicável
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
              value={section.alignment || 'center'}
              onValueChange={(value) =>
                updateField('alignment', value as 'left' | 'center' | 'right')
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Esquerda</SelectItem>
                <SelectItem value="center">Centro</SelectItem>
                <SelectItem value="right">Direita</SelectItem>
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

        <div className="flex items-center justify-between">
          <Label htmlFor="rounded">Bordas Arredondadas</Label>
          <Switch
            id="rounded"
            checked={section.rounded || false}
            onCheckedChange={(checked: boolean) => updateField('rounded', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="shadow">Sombra</Label>
          <Switch
            id="shadow"
            checked={section.shadow || false}
            onCheckedChange={(checked: boolean) => updateField('shadow', checked)}
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
