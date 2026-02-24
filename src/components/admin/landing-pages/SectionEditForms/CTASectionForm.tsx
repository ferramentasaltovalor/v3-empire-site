'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CTASection } from '@/lib/landing-pages'

interface CTASectionFormProps {
  section: CTASection
  onChange: (section: CTASection) => void
}

export function CTASectionForm({ section, onChange }: CTASectionFormProps) {
  const updateField = <K extends keyof CTASection>(
    field: K,
    value: CTASection[K]
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
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={section.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Pronto para começar?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={section.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Junte-se a milhares de clientes satisfeitos."
            rows={3}
          />
        </div>
      </div>

      {/* Button Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
          Botão
        </h3>

        <div className="space-y-2">
          <Label htmlFor="buttonText">Texto do Botão</Label>
          <Input
            id="buttonText"
            value={section.buttonText}
            onChange={(e) => updateField('buttonText', e.target.value)}
            placeholder="Começar Agora"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="buttonHref">Link (URL)</Label>
          <Input
            id="buttonHref"
            value={section.buttonHref}
            onChange={(e) => updateField('buttonHref', e.target.value)}
            placeholder="# ou https://..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="buttonVariant">Estilo do Botão</Label>
          <Select
            value={section.buttonVariant || 'primary'}
            onValueChange={(value) =>
              updateField('buttonVariant', value as 'primary' | 'secondary' | 'outline')
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primary">Primário</SelectItem>
              <SelectItem value="secondary">Secundário</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Layout Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
          Layout
        </h3>

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
          <Label htmlFor="textColor">Cor do Texto</Label>
          <Select
            value={section.textColor || 'light'}
            onValueChange={(value) =>
              updateField('textColor', value as 'light' | 'dark')
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Claro</SelectItem>
              <SelectItem value="dark">Escuro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Background Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
          Fundo
        </h3>

        <div className="space-y-2">
          <Label htmlFor="backgroundColor">Cor de Fundo (CSS)</Label>
          <Input
            id="backgroundColor"
            value={section.backgroundColor || ''}
            onChange={(e) => updateField('backgroundColor', e.target.value)}
            placeholder="#000000 ou rgba(0,0,0,0.5)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="backgroundGradient">Gradiente (CSS)</Label>
          <Input
            id="backgroundGradient"
            value={section.backgroundGradient || ''}
            onChange={(e) => updateField('backgroundGradient', e.target.value)}
            placeholder="linear-gradient(135deg, #b8860b 0%, #daa520 100%)"
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
