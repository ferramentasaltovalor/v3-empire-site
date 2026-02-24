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
import type { VideoSection } from '@/lib/landing-pages'

interface VideoSectionFormProps {
  section: VideoSection
  onChange: (section: VideoSection) => void
}

export function VideoSectionForm({ section, onChange }: VideoSectionFormProps) {
  const updateField = <K extends keyof VideoSection>(
    field: K,
    value: VideoSection[K]
  ) => {
    onChange({ ...section, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Video Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
          Vídeo
        </h3>
        
        <div className="space-y-2">
          <Label htmlFor="src">URL do Vídeo</Label>
          <Input
            id="src"
            value={section.src}
            onChange={(e) => updateField('src', e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <p className="text-xs text-[var(--color-admin-muted)]">
            Cole a URL do YouTube, Vimeo ou vídeo direto
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="provider">Provedor</Label>
          <Select
            value={section.provider || 'youtube'}
            onValueChange={(value) =>
              updateField('provider', value as 'youtube' | 'vimeo' | 'self')
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="vimeo">Vimeo</SelectItem>
              <SelectItem value="self">Self-Hosted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="poster">Imagem de Capa (opcional)</Label>
          <Input
            id="poster"
            value={section.poster || ''}
            onChange={(e) => updateField('poster', e.target.value)}
            placeholder="https://..."
          />
          <p className="text-xs text-[var(--color-admin-muted)]">
            Imagem exibida antes do vídeo começar
          </p>
        </div>
      </div>

      {/* Layout Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
          Layout
        </h3>

        <div className="space-y-2">
          <Label htmlFor="aspectRatio">Proporção</Label>
          <Select
            value={section.aspectRatio || '16:9'}
            onValueChange={(value) =>
              updateField('aspectRatio', value as '16:9' | '4:3' | '1:1' | '21:9')
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
              <SelectItem value="4:3">4:3 (Tradicional)</SelectItem>
              <SelectItem value="1:1">1:1 (Quadrado)</SelectItem>
              <SelectItem value="21:9">21:9 (Ultrawide)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Playback Options */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
          Opções de Reprodução
        </h3>

        <div className="flex items-center justify-between">
          <Label htmlFor="controls">Mostrar Controles</Label>
          <Switch
            id="controls"
            checked={section.controls !== false}
            onCheckedChange={(checked: boolean) => updateField('controls', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="autoplay">Reprodução Automática</Label>
          <Switch
            id="autoplay"
            checked={section.autoplay || false}
            onCheckedChange={(checked: boolean) => updateField('autoplay', checked)}
          />
          <p className="text-xs text-[var(--color-admin-muted)] ml-auto">
            Requer muted para funcionar
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="muted">Sem Som (Muted)</Label>
          <Switch
            id="muted"
            checked={section.muted || false}
            onCheckedChange={(checked: boolean) => updateField('muted', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="loop">Repetir (Loop)</Label>
          <Switch
            id="loop"
            checked={section.loop || false}
            onCheckedChange={(checked: boolean) => updateField('loop', checked)}
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
