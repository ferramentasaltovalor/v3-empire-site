'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical,
  Pencil,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Layout,
  Grid3X3,
  MessageCircle,
  MousePointerClick,
  FileInput,
  Code,
  Type,
  Image,
  Video,
  Minus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LandingPageSection, SectionType } from '@/lib/landing-pages'

interface SectionListItemProps {
  section: LandingPageSection
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
  onToggleVisibility: () => void
}

function getSectionIcon(type: SectionType) {
  const icons: Record<SectionType, React.ElementType> = {
    hero: Layout,
    features: Grid3X3,
    testimonials: MessageCircle,
    cta: MousePointerClick,
    form: FileInput,
    custom_html: Code,
    text: Type,
    image: Image,
    video: Video,
    divider: Minus,
  }
  return icons[type] || Layout
}

function getSectionTitle(section: LandingPageSection): string {
  switch (section.type) {
    case 'hero':
      return section.title || 'Hero'
    case 'features':
      return section.title || 'Recursos'
    case 'testimonials':
      return section.title || 'Depoimentos'
    case 'cta':
      return section.title || 'CTA'
    case 'form':
      return section.title || 'Formulário'
    case 'custom_html':
      return 'HTML Personalizado'
    case 'text':
      return 'Texto'
    case 'image':
      return section.alt || 'Imagem'
    case 'video':
      return 'Vídeo'
    case 'divider':
      return 'Divisor'
    default:
      return 'Seção'
  }
}

function getSectionTypeLabel(type: SectionType): string {
  const labels: Record<SectionType, string> = {
    hero: 'Hero',
    features: 'Recursos',
    testimonials: 'Depoimentos',
    cta: 'CTA',
    form: 'Formulário',
    custom_html: 'HTML',
    text: 'Texto',
    image: 'Imagem',
    video: 'Vídeo',
    divider: 'Divisor',
  }
  return labels[type] || type
}

export function SectionListItem({
  section,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleVisibility,
}: SectionListItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const Icon = getSectionIcon(section.type)
  const title = getSectionTitle(section)
  const typeLabel = getSectionTypeLabel(section.type)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-white rounded-lg border border-[var(--color-admin-border)] shadow-sm',
        isDragging && 'shadow-lg z-50 opacity-90',
        !section.visible && 'opacity-60'
      )}
    >
      <div className="flex items-center p-3 gap-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--color-empire-gold)]/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[var(--color-empire-gold)]" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-[var(--color-admin-text)] truncate">
            {title}
          </h4>
          <p className="text-xs text-[var(--color-admin-muted)]">
            {typeLabel} • Ordem: {section.order + 1}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onToggleVisibility}
            title={section.visible ? 'Ocultar' : 'Mostrar'}
          >
            {section.visible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onDuplicate}
            title="Duplicar"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onEdit}
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={onDelete}
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
