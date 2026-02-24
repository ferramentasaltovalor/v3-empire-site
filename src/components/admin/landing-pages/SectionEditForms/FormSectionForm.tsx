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
import { Plus, Trash2, GripVertical } from 'lucide-react'
import type { FormSection, FormField } from '@/lib/landing-pages'

interface FormSectionFormProps {
  section: FormSection
  onChange: (section: FormSection) => void
}

function generateFieldId(): string {
  return `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function FormSectionForm({ section, onChange }: FormSectionFormProps) {
  const updateField = <K extends keyof FormSection>(
    field: K,
    value: FormSection[K]
  ) => {
    onChange({ ...section, [field]: value })
  }

  const addField = () => {
    const newField: FormField = {
      id: generateFieldId(),
      type: 'text',
      name: `field_${section.fields.length + 1}`,
      label: 'Novo Campo',
      placeholder: '',
      required: false,
    }
    onChange({
      ...section,
      fields: [...section.fields, newField],
    })
  }

  const updateFormField = (index: number, field: keyof FormField, value: string | boolean | FormField['options']) => {
    const newFields = [...section.fields]
    newFields[index] = { ...newFields[index], [field]: value }
    onChange({ ...section, fields: newFields })
  }

  const removeField = (index: number) => {
    const newFields = section.fields.filter((_, i) => i !== index)
    onChange({ ...section, fields: newFields })
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
          Informações Básicas
        </h3>
        
        <div className="space-y-2">
          <Label htmlFor="title">Título do Formulário</Label>
          <Input
            id="title"
            value={section.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Entre em Contato"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={section.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Preencha o formulário abaixo..."
            rows={2}
          />
        </div>
      </div>

      {/* Form Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
          Configurações do Formulário
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="style">Estilo</Label>
            <Select
              value={section.style || 'boxed'}
              onValueChange={(value) => updateField('style', value as 'boxed' | 'inline' | 'fullwidth')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="boxed">Boxed</SelectItem>
                <SelectItem value="inline">Inline</SelectItem>
                <SelectItem value="fullwidth">Full Width</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Cor de Fundo</Label>
            <Input
              id="backgroundColor"
              value={section.backgroundColor || ''}
              onChange={(e) => updateField('backgroundColor', e.target.value)}
              placeholder="#f5f5f5"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="submitButtonText">Texto do Botão de Envio</Label>
          <Input
            id="submitButtonText"
            value={section.submitButtonText}
            onChange={(e) => updateField('submitButtonText', e.target.value)}
            placeholder="Enviar"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="successMessage">Mensagem de Sucesso</Label>
          <Input
            id="successMessage"
            value={section.successMessage || ''}
            onChange={(e) => updateField('successMessage', e.target.value)}
            placeholder="Mensagem enviada com sucesso!"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="errorMessage">Mensagem de Erro</Label>
          <Input
            id="errorMessage"
            value={section.errorMessage || ''}
            onChange={(e) => updateField('errorMessage', e.target.value)}
            placeholder="Erro ao enviar. Tente novamente."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="redirectUrl">URL de Redirecionamento (opcional)</Label>
          <Input
            id="redirectUrl"
            value={section.redirectUrl || ''}
            onChange={(e) => updateField('redirectUrl', e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="webhookUrl">Webhook URL (opcional)</Label>
          <Input
            id="webhookUrl"
            value={section.webhookUrl || ''}
            onChange={(e) => updateField('webhookUrl', e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Fields List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--color-admin-text)] uppercase tracking-wide">
            Campos ({section.fields.length})
          </h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addField}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Campo
          </Button>
        </div>

        <div className="space-y-3">
          {section.fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-gray-50 rounded-lg border border-[var(--color-admin-border)] p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <GripVertical className="w-4 h-4" />
                  <span className="text-sm font-medium">{field.label}</span>
                  <span className="text-xs text-gray-400">({field.type})</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => removeField(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Tipo</Label>
                  <Select
                    value={field.type}
                    onValueChange={(value) => updateFormField(index, 'type', value as FormField['type'])}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="tel">Telefone</SelectItem>
                      <SelectItem value="textarea">Texto Longo</SelectItem>
                      <SelectItem value="select">Seleção</SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                      <SelectItem value="radio">Radio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Nome (name)</Label>
                  <Input
                    value={field.name}
                    onChange={(e) => updateFormField(index, 'name', e.target.value)}
                    placeholder="field_name"
                    className="h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Label</Label>
                  <Input
                    value={field.label}
                    onChange={(e) => updateFormField(index, 'label', e.target.value)}
                    placeholder="Rótulo do campo"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Placeholder</Label>
                  <Input
                    value={field.placeholder || ''}
                    onChange={(e) => updateFormField(index, 'placeholder', e.target.value)}
                    placeholder="Placeholder..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs">Obrigatório</Label>
                <Switch
                  checked={field.required}
                  onCheckedChange={(checked: boolean) => updateFormField(index, 'required', checked)}
                />
              </div>

              {(field.type === 'select' || field.type === 'radio') && (
                <div className="space-y-1">
                  <Label className="text-xs">Opções (uma por linha: valor|label)</Label>
                  <Textarea
                    value={field.options?.map(o => `${o.value}|${o.label}`).join('\n') || ''}
                    onChange={(e) => {
                      const options = e.target.value.split('\n').map(line => {
                        const [value, label] = line.split('|')
                        return { value: value || '', label: label || value || '' }
                      })
                      updateFormField(index, 'options', options)
                    }}
                    placeholder="valor1|Opção 1&#10;valor2|Opção 2"
                    rows={3}
                  />
                </div>
              )}
            </div>
          ))}

          {section.fields.length === 0 && (
            <div className="text-center py-8 text-[var(--color-admin-muted)]">
              <p className="mb-2">Nenhum campo adicionado</p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addField}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar primeiro campo
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
