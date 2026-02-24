'use client'

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
import { Switch } from '@/components/ui/switch'
import { Plus, Trash2, GripVertical, Star } from 'lucide-react'
import type { TestimonialsSection, TestimonialItem } from '@/lib/landing-pages'

interface TestimonialsSectionFormProps {
  section: TestimonialsSection
  onChange: (section: TestimonialsSection) => void
}

function generateTestimonialId(): string {
  return `testimonial-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function TestimonialsSectionForm({ section, onChange }: TestimonialsSectionFormProps) {
  const updateField = <K extends keyof TestimonialsSection>(
    field: K,
    value: TestimonialsSection[K]
  ) => {
    onChange({ ...section, [field]: value })
  }

  const addTestimonial = () => {
    const newTestimonial: TestimonialItem = {
      id: generateTestimonialId(),
      quote: 'Excelente produto!',
      author: 'Nome do Cliente',
      role: 'Cargo',
      company: 'Empresa',
      rating: 5,
    }
    onChange({
      ...section,
      testimonials: [...section.testimonials, newTestimonial],
    })
  }

  const updateTestimonial = (index: number, field: keyof TestimonialItem, value: string | number) => {
    const newTestimonials = [...section.testimonials]
    newTestimonials[index] = { ...newTestimonials[index], [field]: value }
    onChange({ ...section, testimonials: newTestimonials })
  }

  const removeTestimonial = (index: number) => {
    const newTestimonials = section.testimonials.filter((_, i) => i !== index)
    onChange({ ...section, testimonials: newTestimonials })
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
            placeholder="O que nossos clientes dizem"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtítulo</Label>
          <Input
            id="subtitle"
            value={section.subtitle || ''}
            onChange={(e) => updateField('subtitle', e.target.value)}
            placeholder="Depoimentos reais de clientes satisfeitos"
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
            <Label htmlFor="layout">Tipo de Layout</Label>
            <Select
              value={section.layout || 'grid'}
              onValueChange={(value) => updateField('layout', value as 'carousel' | 'grid' | 'masonry')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="carousel">Carrossel</SelectItem>
                <SelectItem value="masonry">Masonry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="columns">Colunas</Label>
            <Select
              value={String(section.columns || 2)}
              onValueChange={(value) => updateField('columns', Number(value) as 1 | 2 | 3)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Coluna</SelectItem>
                <SelectItem value="2">2 Colunas</SelectItem>
                <SelectItem value="3">3 Colunas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="showRating">Mostrar Avaliação</Label>
            <Switch
              id="showRating"
              checked={section.showRating || false}
              onCheckedChange={(checked: boolean) => updateField('showRating', checked)}
            />
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

      {/* Testimonials List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
            Depoimentos ({section.testimonials.length})
          </h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addTestimonial}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>

        <div className="space-y-3">
          {section.testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-lg border border-[var(--color-admin-border)] p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <GripVertical className="w-4 h-4" />
                  <span className="text-sm font-medium">Depoimento {index + 1}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => removeTestimonial(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Citação</Label>
                <Textarea
                  value={testimonial.quote}
                  onChange={(e) => updateTestimonial(index, 'quote', e.target.value)}
                  placeholder="O que o cliente disse..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Autor</Label>
                  <Input
                    value={testimonial.author}
                    onChange={(e) => updateTestimonial(index, 'author', e.target.value)}
                    placeholder="Nome do cliente"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Cargo</Label>
                  <Input
                    value={testimonial.role || ''}
                    onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                    placeholder="CEO, Diretor, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Empresa</Label>
                  <Input
                    value={testimonial.company || ''}
                    onChange={(e) => updateTestimonial(index, 'company', e.target.value)}
                    placeholder="Nome da empresa"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Avaliação</Label>
                  <Select
                    value={String(testimonial.rating || 5)}
                    onValueChange={(value) => updateTestimonial(index, 'rating', Number(value) as 1 | 2 | 3 | 4 | 5)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">⭐⭐⭐⭐⭐ (5)</SelectItem>
                      <SelectItem value="4">⭐⭐⭐⭐ (4)</SelectItem>
                      <SelectItem value="3">⭐⭐⭐ (3)</SelectItem>
                      <SelectItem value="2">⭐⭐ (2)</SelectItem>
                      <SelectItem value="1">⭐ (1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">URL do Avatar (opcional)</Label>
                <Input
                  value={testimonial.avatarUrl || ''}
                  onChange={(e) => updateTestimonial(index, 'avatarUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          ))}

          {section.testimonials.length === 0 && (
            <div className="text-center py-8 text-[var(--color-admin-muted)]">
              <p className="mb-2">Nenhum depoimento adicionado</p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addTestimonial}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar primeiro depoimento
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
