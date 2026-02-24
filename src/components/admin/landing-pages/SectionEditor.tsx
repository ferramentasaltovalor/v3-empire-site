'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  Plus,
  Monitor,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SectionListItem } from './SectionListItem'
import { SectionPreview } from './SectionPreview'
import { SectionEditModal } from './SectionEditModal'
import type {
  LandingPageSection,
  SectionType,
} from '@/lib/landing-pages'
import { createDefaultSection } from '@/lib/landing-pages/defaults'

interface SectionEditorProps {
  landingPageId: string
  initialSections: LandingPageSection[]
  onSave: (sections: LandingPageSection[]) => Promise<void>
}

type PreviewMode = 'desktop' | 'mobile'

const SECTION_TYPES: { value: SectionType; label: string; description: string }[] = [
  { value: 'hero', label: 'Hero', description: 'Seção de destaque com título e CTAs' },
  { value: 'features', label: 'Recursos', description: 'Lista de características ou benefícios' },
  { value: 'testimonials', label: 'Depoimentos', description: 'Avaliações de clientes' },
  { value: 'cta', label: 'CTA', description: 'Chamada para ação' },
  { value: 'form', label: 'Formulário', description: 'Formulário de captura de leads' },
  { value: 'text', label: 'Texto', description: 'Bloco de texto rico' },
  { value: 'image', label: 'Imagem', description: 'Imagem com legenda opcional' },
  { value: 'video', label: 'Vídeo', description: 'Vídeo do YouTube, Vimeo ou nativo' },
  { value: 'divider', label: 'Divisor', description: 'Linha divisória entre seções' },
  { value: 'custom_html', label: 'HTML Personalizado', description: 'Código HTML customizado' },
]

export function SectionEditor({
  landingPageId,
  initialSections,
  onSave,
}: SectionEditorProps) {
  const [sections, setSections] = useState<LandingPageSection[]>(initialSections)
  const [originalSections, setOriginalSections] = useState<LandingPageSection[]>(initialSections)
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop')
  const [showPreview, setShowPreview] = useState(true)
  const [editingSection, setEditingSection] = useState<LandingPageSection | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedSectionType, setSelectedSectionType] = useState<SectionType>('hero')
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Detect changes
  useEffect(() => {
    const changed = JSON.stringify(sections) !== JSON.stringify(originalSections)
    setHasChanges(changed)
  }, [sections, originalSections])

  // Auto-save with debounce
  const debouncedSave = useCallback(async (sectionsToSave: LandingPageSection[]) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      if (hasChanges) {
        setIsSaving(true)
        try {
          await onSave(sectionsToSave)
          setOriginalSections(sectionsToSave)
        } catch (error) {
          console.error('Error auto-saving:', error)
        } finally {
          setIsSaving(false)
        }
      }
    }, 2000)
  }, [hasChanges, onSave])

  useEffect(() => {
    if (hasChanges) {
      debouncedSave(sections)
    }
  }, [sections, hasChanges, debouncedSave])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex)
        // Update order property
        return newItems.map((item, index) => ({ ...item, order: index }))
      })
    }
  }

  // Add new section
  const handleAddSection = () => {
    const newSection = createDefaultSection(selectedSectionType, sections.length)
    setSections([...sections, newSection])
    setIsAddModalOpen(false)
    setSelectedSectionType('hero')
    // Open edit modal for the new section
    setEditingSection(newSection)
  }

  // Edit section
  const handleEditSection = (section: LandingPageSection) => {
    setEditingSection(section)
  }

  // Save edited section
  const handleSaveSection = (updatedSection: LandingPageSection) => {
    setSections((prev) =>
      prev.map((s) => (s.id === updatedSection.id ? updatedSection : s))
    )
    setEditingSection(null)
  }

  // Delete section
  const handleDeleteSection = (sectionId: string) => {
    setSections((prev) => {
      const filtered = prev.filter((s) => s.id !== sectionId)
      // Update order property
      return filtered.map((item, index) => ({ ...item, order: index }))
    })
    setDeleteConfirm(null)
  }

  // Duplicate section
  const handleDuplicateSection = (section: LandingPageSection) => {
    const duplicated: LandingPageSection = {
      ...section,
      id: `${section.id}-copy-${Date.now()}`,
      order: sections.length,
    }
    setSections((prev) => {
      const newSections = [...prev]
      const index = prev.findIndex((s) => s.id === section.id)
      newSections.splice(index + 1, 0, duplicated)
      // Update order property
      return newSections.map((item, idx) => ({ ...item, order: idx }))
    })
  }

  // Toggle visibility
  const handleToggleVisibility = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, visible: !s.visible } : s
      )
    )
  }

  // Manual save
  const handleManualSave = async () => {
    setIsSaving(true)
    try {
      await onSave(sections)
      setOriginalSections(sections)
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Discard changes
  const handleDiscardChanges = () => {
    setSections(originalSections)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-admin-border)] bg-white">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            variant="premium"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Seção
          </Button>
        </div>

        <div className="flex items-center gap-4">
          {/* Preview mode toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`p-2 rounded-md transition-colors ${
                previewMode === 'desktop'
                  ? 'bg-white shadow-sm text-[var(--color-empire-gold)]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Visualização Desktop"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`p-2 rounded-md transition-colors ${
                previewMode === 'mobile'
                  ? 'bg-white shadow-sm text-[var(--color-empire-gold)]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Visualização Mobile"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle preview visibility */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Ocultar Preview
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Mostrar Preview
              </>
            )}
          </Button>

          {/* Save status */}
          <div className="flex items-center gap-2 text-sm text-[var(--color-admin-muted)]">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : hasChanges ? (
              <>
                <span className="text-amber-600">Alterações não salvas</span>
              </>
            ) : (
              <>
                <span className="text-green-600">Salvo</span>
              </>
            )}
          </div>

          {/* Discard / Save buttons */}
          {hasChanges && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDiscardChanges}
                disabled={isSaving}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Descartar
              </Button>
              <Button
                variant="premium"
                size="sm"
                onClick={handleManualSave}
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Section list */}
        <div className="w-80 border-r border-[var(--color-admin-border)] overflow-y-auto bg-gray-50">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="p-4 space-y-2">
                {sections.length === 0 ? (
                  <div className="text-center py-8 text-[var(--color-admin-muted)]">
                    <p className="mb-4">Nenhuma seção adicionada</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddModalOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar primeira seção
                    </Button>
                  </div>
                ) : (
                  sections.map((section) => (
                    <SectionListItem
                      key={section.id}
                      section={section}
                      onEdit={() => handleEditSection(section)}
                      onDelete={() => setDeleteConfirm(section.id)}
                      onDuplicate={() => handleDuplicateSection(section)}
                      onToggleVisibility={() => handleToggleVisibility(section.id)}
                    />
                  ))
                )}
                </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Preview area */}
        {showPreview && (
          <div className="flex-1 overflow-y-auto bg-gray-200 p-4">
            <div
              className={`mx-auto bg-white shadow-lg overflow-hidden transition-all duration-300 ${
                previewMode === 'mobile' ? 'max-w-sm' : 'max-w-5xl'
              }`}
            >
              <SectionPreview
                sections={sections.filter((s) => s.visible)}
                landingPageId={landingPageId}
              />
            </div>
          </div>
        )}
      </div>

      {/* Add Section Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Seção</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Tipo de Seção
            </label>
            <Select
              value={selectedSectionType}
              onValueChange={(value) => setSelectedSectionType(value as SectionType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de seção" />
              </SelectTrigger>
              <SelectContent>
                {SECTION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{type.label}</span>
                      <span className="text-xs text-gray-500">
                        {type.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="premium" onClick={handleAddSection}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Section Modal */}
      {editingSection && (
        <SectionEditModal
          section={editingSection}
          isOpen={!!editingSection}
          onClose={() => setEditingSection(null)}
          onSave={handleSaveSection}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-[var(--color-admin-muted)]">
            Tem certeza que deseja excluir esta seção? Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDeleteSection(deleteConfirm)}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
