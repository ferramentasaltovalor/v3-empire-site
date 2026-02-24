'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import type { FeaturesSection, FeatureItem } from '@/lib/landing-pages'

interface FeaturesSectionFormProps {
  section: FeaturesSection
  onChange: (section: FeaturesSection) => void
}

function generateFeatureId(): string {
  return `feature-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function FeaturesSectionForm({ section, onChange }: FeaturesSectionFormProps) {
  const updateField = <K extends keyof FeaturesSection>(
    field: K,
    value: FeaturesSection[K]
  ) => {
    onChange({ ...section, [field]: value })
  }

  const addFeature = () => {
    const newFeature: FeatureItem = {
      id: generateFeatureId(),
      title: 'Novo Recurso',
      description: 'Descrição do recurso',
      icon: 'star',
    }
    onChange({
      ...section,
      features: [...section.features, newFeature],
    })
  }

  const updateFeature = (index: number, field: keyof FeatureItem, value: string) => {
    const newFeatures = [...section.features]
    newFeatures[index] = { ...newFeatures[index], [field]: value }
    onChange({ ...section, features: newFeatures })
  }

  const removeFeature = (index: number) => {
    const newFeatures = section.features.filter((_, i) => i !== index)
    onChange({ ...section, features: newFeatures })
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
          Informações Básicas
        </h3>
        
        <div className="space-y-2">
          <Label htmlFor="title">Título da Seção</Label>
          <Input
            id="title"
            value={section.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Nossos Recursos"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtítulo</Label>
          <Input
            id="subtitle"
            value={section.subtitle || ''}
            onChange={(e) => updateField('subtitle', e.target.value)}
            placeholder="Descubra o que nos torna únicos"
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
            <Label htmlFor="columns">Colunas</Label>
            <Select
              value={String(section.columns || 3)}
              onValueChange={(value) => updateField('columns', Number(value) as 2 | 3 | 4)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Colunas</SelectItem>
                <SelectItem value="3">3 Colunas</SelectItem>
                <SelectItem value="4">4 Colunas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="style">Estilo</Label>
            <Select
              value={section.style || 'cards'}
              onValueChange={(value) => updateField('style', value as 'cards' | 'icons' | 'simple')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cards">Cards</SelectItem>
                <SelectItem value="icons">Ícones</SelectItem>
                <SelectItem value="simple">Simples</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="backgroundColor">Cor de Fundo (CSS)</Label>
          <Input
            id="backgroundColor"
            value={section.backgroundColor || ''}
            onChange={(e) => updateField('backgroundColor', e.target.value)}
            placeholder="#f5f5f5 ou transparent"
          />
        </div>
      </div>

      {/* Features List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
            Recursos ({section.features.length})
          </h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addFeature}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>

        <div className="space-y-3">
          {section.features.map((feature, index) => (
            <div
              key={feature.id}
              className="bg-gray-50 rounded-lg border border-[var(--color-admin-border)] p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <GripVertical className="w-4 h-4" />
                  <span className="text-sm font-medium">Recurso {index + 1}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => removeFeature(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Título</Label>
                  <Input
                    value={feature.title}
                    onChange={(e) => updateFeature(index, 'title', e.target.value)}
                    placeholder="Título do recurso"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Ícone</Label>
                  <Select
                    value={feature.icon || 'star'}
                    onValueChange={(value) => updateFeature(index, 'icon', value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="star">Estrela</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="zap">Raio</SelectItem>
                      <SelectItem value="heart">Coração</SelectItem>
                      <SelectItem value="shield">Escudo</SelectItem>
                      <SelectItem value="globe">Globo</SelectItem>
                      <SelectItem value="users">Usuários</SelectItem>
                      <SelectItem value="clock">Relógio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Descrição</Label>
                <Textarea
                  value={feature.description || ''}
                  onChange={(e) => updateFeature(index, 'description', e.target.value)}
                  placeholder="Descrição do recurso..."
                  rows={2}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">URL da Imagem (opcional)</Label>
                <Input
                  value={feature.imageUrl || ''}
                  onChange={(e) => updateFeature(index, 'imageUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          ))}

          {section.features.length === 0 && (
            <div className="text-center py-8 text-[var(--color-admin-muted)]">
              <p className="mb-2">Nenhum recurso adicionado</p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addFeature}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar primeiro recurso
              </Button>
            </div>
          )}
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
