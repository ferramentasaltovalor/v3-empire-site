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
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import type { HeroSection } from '@/lib/landing-pages'

interface HeroSectionFormProps {
  section: HeroSection
  onChange: (section: HeroSection) => void
}

export function HeroSectionForm({ section, onChange }: HeroSectionFormProps) {
  const updateField = <K extends keyof HeroSection>(
    field: K,
    value: HeroSection[K]
  ) => {
    onChange({ ...section, [field]: value })
  }

  const updatePrimaryCta = (field: string, value: string) => {
    onChange({
      ...section,
      primaryCta: section.primaryCta
        ? { ...section.primaryCta, [field]: value }
        : { text: '', href: '', variant: 'primary', [field]: value },
    })
  }

  const updateSecondaryCta = (field: string, value: string) => {
    onChange({
      ...section,
      secondaryCta: section.secondaryCta
        ? { ...section.secondaryCta, [field]: value }
        : { text: '', href: '', variant: 'outline', [field]: value },
    })
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
          Informações Básicas
        </h3>
        
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={section.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Título principal da seção"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtítulo</Label>
          <Input
            id="subtitle"
            value={section.subtitle || ''}
            onChange={(e) => updateField('subtitle', e.target.value)}
            placeholder="Subtítulo atrativo"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={section.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Descrição detalhada..."
            rows={3}
          />
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
            <Label htmlFor="size">Tamanho</Label>
            <Select
              value={section.size || 'lg'}
              onValueChange={(value) =>
                updateField('size', value as 'sm' | 'md' | 'lg' | 'full')
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Pequeno</SelectItem>
                <SelectItem value="md">Médio</SelectItem>
                <SelectItem value="lg">Grande</SelectItem>
                <SelectItem value="full">Tela Cheia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
      </div>

      {/* Background Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
          Fundo
        </h3>

        <div className="space-y-2">
          <Label htmlFor="backgroundImage">URL da Imagem de Fundo</Label>
          <Input
            id="backgroundImage"
            value={section.backgroundImage || ''}
            onChange={(e) => updateField('backgroundImage', e.target.value)}
            placeholder="https://..."
          />
        </div>

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
            placeholder="linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="overlay">Overlay</Label>
          <Switch
            id="overlay"
            checked={section.overlay || false}
            onCheckedChange={(checked: boolean) => updateField('overlay', checked)}
          />
        </div>

        {section.overlay && (
          <div className="space-y-2">
            <Label>Opacidade do Overlay: {section.overlayOpacity || 0.5}</Label>
            <Slider
              value={[section.overlayOpacity || 0.5]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={(values: number[]) => updateField('overlayOpacity', values[0])}
            />
          </div>
        )}
      </div>

      {/* Primary CTA */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
          Botão Principal (CTA)
        </h3>

        <div className="space-y-2">
          <Label htmlFor="primaryCtaText">Texto do Botão</Label>
          <Input
            id="primaryCtaText"
            value={section.primaryCta?.text || ''}
            onChange={(e) => updatePrimaryCta('text', e.target.value)}
            placeholder="Começar Agora"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="primaryCtaHref">Link (URL)</Label>
          <Input
            id="primaryCtaHref"
            value={section.primaryCta?.href || ''}
            onChange={(e) => updatePrimaryCta('href', e.target.value)}
            placeholder="# ou https://..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="primaryCtaVariant">Estilo do Botão</Label>
          <Select
            value={section.primaryCta?.variant || 'primary'}
            onValueChange={(value) =>
              updatePrimaryCta('variant', value as 'primary' | 'secondary' | 'outline')
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

      {/* Secondary CTA */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
          Botão Secundário (CTA)
        </h3>

        <div className="space-y-2">
          <Label htmlFor="secondaryCtaText">Texto do Botão</Label>
          <Input
            id="secondaryCtaText"
            value={section.secondaryCta?.text || ''}
            onChange={(e) => updateSecondaryCta('text', e.target.value)}
            placeholder="Saiba Mais"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondaryCtaHref">Link (URL)</Label>
          <Input
            id="secondaryCtaHref"
            value={section.secondaryCta?.href || ''}
            onChange={(e) => updateSecondaryCta('href', e.target.value)}
            placeholder="# ou https://..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondaryCtaVariant">Estilo do Botão</Label>
          <Select
            value={section.secondaryCta?.variant || 'outline'}
            onValueChange={(value) =>
              updateSecondaryCta('variant', value as 'primary' | 'secondary' | 'outline')
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
