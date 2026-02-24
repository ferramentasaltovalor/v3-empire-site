'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Sparkles,
    ChevronRight,
    ChevronLeft,
    Loader2,
    Instagram,
    Youtube,
    RefreshCw,
    Check,
    AlertCircle
} from 'lucide-react'
import { generateContent, scrapeInstagram, scrapeYouTube } from '@/lib/ai/client'
import type { AIGeneratorConfig, ScrapedContent, ToneType, LengthType, GenerateType, SourceType } from '@/types/ai'

interface AIGeneratorPanelProps {
    onInsert: (content: string) => void
    selectedText?: string
    isOpen: boolean
    onToggle: () => void
}

const toneOptions: { value: ToneType; label: string }[] = [
    { value: 'professional', label: 'Profissional' },
    { value: 'casual', label: 'Informal' },
    { value: 'academic', label: 'Acadêmico' },
    { value: 'journalistic', label: 'Jornalístico' },
    { value: 'persuasive', label: 'Persuasivo' },
    { value: 'educational', label: 'Educativo' },
]

const lengthOptions: { value: LengthType; label: string }[] = [
    { value: 'short', label: 'Curto (300-500 palavras)' },
    { value: 'medium', label: 'Médio (700-1000 palavras)' },
    { value: 'long', label: 'Longo (1500-2500 palavras)' },
    { value: 'very-long', label: 'Muito longo (3000-5000 palavras)' },
]

const typeOptions: { value: GenerateType; label: string }[] = [
    { value: 'full', label: 'Artigo completo' },
    { value: 'intro', label: 'Introdução' },
    { value: 'conclusion', label: 'Conclusão' },
    { value: 'rewrite', label: 'Reescrever seleção' },
]

export function AIGeneratorPanel({ onInsert, selectedText, isOpen, onToggle }: AIGeneratorPanelProps) {
    const [config, setConfig] = useState<AIGeneratorConfig>({
        model: 'anthropic/claude-sonnet-4',
        tone: 'professional',
        length: 'medium',
        type: 'full',
        sourceType: 'manual',
        sourceUrl: '',
        topic: '',
        targetAudience: '',
        keywords: [],
        customInstructions: '',
    })

    const [keywordInput, setKeywordInput] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [isScraping, setIsScraping] = useState(false)
    const [generatedContent, setGeneratedContent] = useState('')
    const [scrapedContent, setScrapedContent] = useState<ScrapedContent | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleAddKeyword = () => {
        if (keywordInput.trim() && !config.keywords.includes(keywordInput.trim())) {
            setConfig(prev => ({
                ...prev,
                keywords: [...prev.keywords, keywordInput.trim()],
            }))
            setKeywordInput('')
        }
    }

    const handleRemoveKeyword = (keyword: string) => {
        setConfig(prev => ({
            ...prev,
            keywords: prev.keywords.filter(k => k !== keyword),
        }))
    }

    const handleScrape = async () => {
        if (!config.sourceUrl) return

        setIsScraping(true)
        setError(null)

        try {
            let result: ScrapedContent
            if (config.sourceType === 'instagram') {
                result = await scrapeInstagram(config.sourceUrl)
            } else if (config.sourceType === 'youtube') {
                result = await scrapeYouTube(config.sourceUrl)
            } else {
                throw new Error('Invalid source type')
            }

            setScrapedContent(result)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao extrair conteúdo')
        } finally {
            setIsScraping(false)
        }
    }

    const handleGenerate = async () => {
        setIsGenerating(true)
        setError(null)

        try {
            const result = await generateContent({
                ...config,
                sourceContent: scrapedContent?.content,
            })

            setGeneratedContent(result.text)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao gerar conteúdo')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleInsert = () => {
        if (generatedContent) {
            onInsert(generatedContent)
            setGeneratedContent('')
        }
    }

    const handleRegenerate = () => {
        handleGenerate()
    }

    return (
        <div
            className={`fixed right-0 top-0 h-full bg-admin-bg border-l border-admin-border shadow-lg transition-all duration-300 z-40 ${isOpen ? 'w-96' : 'w-12'
                }`}
        >
            {/* Toggle button */}
            <button
                onClick={onToggle}
                className="absolute -left-10 top-4 w-10 h-10 bg-admin-surface border border-admin-border rounded-l-lg flex items-center justify-center hover:bg-admin-border transition-colors"
                aria-label={isOpen ? 'Fechar painel' : 'Abrir painel'}
            >
                {isOpen ? (
                    <ChevronRight className="w-5 h-5 text-admin-muted" />
                ) : (
                    <ChevronLeft className="w-5 h-5 text-admin-muted" />
                )}
            </button>

            {isOpen && (
                <div className="h-full overflow-y-auto p-4 space-y-6">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-admin-accent" />
                        <h2 className="text-lg font-semibold text-admin-text">
                            Gerador de IA
                        </h2>
                    </div>

                    {/* Source Type Selection */}
                    <div className="space-y-2">
                        <Label>Fonte de conteúdo</Label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={config.sourceType === 'manual' ? 'premium' : 'secondary'}
                                size="sm"
                                onClick={() => setConfig(prev => ({ ...prev, sourceType: 'manual', sourceUrl: '' }))}
                            >
                                Manual
                            </Button>
                            <Button
                                type="button"
                                variant={config.sourceType === 'instagram' ? 'premium' : 'secondary'}
                                size="sm"
                                onClick={() => setConfig(prev => ({ ...prev, sourceType: 'instagram' }))}
                            >
                                <Instagram className="w-4 h-4 mr-1" />
                                Instagram
                            </Button>
                            <Button
                                type="button"
                                variant={config.sourceType === 'youtube' ? 'premium' : 'secondary'}
                                size="sm"
                                onClick={() => setConfig(prev => ({ ...prev, sourceType: 'youtube' }))}
                            >
                                <Youtube className="w-4 h-4 mr-1" />
                                YouTube
                            </Button>
                        </div>
                    </div>

                    {/* Source URL (for Instagram/YouTube) */}
                    {config.sourceType !== 'manual' && (
                        <div className="space-y-2">
                            <Label>URL do {config.sourceType === 'instagram' ? 'Instagram' : 'YouTube'}</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={config.sourceUrl}
                                    onChange={(e) => setConfig(prev => ({ ...prev, sourceUrl: e.target.value }))}
                                    placeholder={`https://${config.sourceType === 'instagram' ? 'instagram.com/p/...' : 'youtube.com/watch?v=...'}`}
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleScrape}
                                    disabled={!config.sourceUrl || isScraping}
                                >
                                    {isScraping ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Check className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                            {scrapedContent && (
                                <div className="p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                                    ✓ Conteúdo extraído com sucesso
                                </div>
                            )}
                        </div>
                    )}

                    {/* Topic */}
                    <div className="space-y-2">
                        <Label>Assunto / Tema</Label>
                        <Textarea
                            value={config.topic}
                            onChange={(e) => setConfig(prev => ({ ...prev, topic: e.target.value }))}
                            placeholder="Descreva o assunto do artigo..."
                            rows={3}
                        />
                    </div>

                    {/* Content Type */}
                    <div className="space-y-2">
                        <Label>Tipo de conteúdo</Label>
                        <select
                            value={config.type}
                            onChange={(e) => setConfig(prev => ({ ...prev, type: e.target.value as GenerateType }))}
                            className="w-full px-3 py-2 border border-admin-border rounded-md bg-white text-admin-text"
                        >
                            {typeOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tone */}
                    <div className="space-y-2">
                        <Label>Tom de voz</Label>
                        <select
                            value={config.tone}
                            onChange={(e) => setConfig(prev => ({ ...prev, tone: e.target.value as ToneType }))}
                            className="w-full px-3 py-2 border border-admin-border rounded-md bg-white text-admin-text"
                        >
                            {toneOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Length */}
                    <div className="space-y-2">
                        <Label>Tamanho</Label>
                        <select
                            value={config.length}
                            onChange={(e) => setConfig(prev => ({ ...prev, length: e.target.value as LengthType }))}
                            className="w-full px-3 py-2 border border-admin-border rounded-md bg-white text-admin-text"
                        >
                            {lengthOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Target Audience */}
                    <div className="space-y-2">
                        <Label>Público-alvo</Label>
                        <Input
                            value={config.targetAudience}
                            onChange={(e) => setConfig(prev => ({ ...prev, targetAudience: e.target.value }))}
                            placeholder="Ex: Empreendedores, gestores de TI..."
                        />
                    </div>

                    {/* Keywords */}
                    <div className="space-y-2">
                        <Label>Palavras-chave</Label>
                        <div className="flex gap-2">
                            <Input
                                value={keywordInput}
                                onChange={(e) => setKeywordInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                                placeholder="Adicionar palavra-chave"
                            />
                            <Button type="button" variant="secondary" onClick={handleAddKeyword}>
                                Adicionar
                            </Button>
                        </div>
                        {config.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {config.keywords.map(keyword => (
                                    <span
                                        key={keyword}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-admin-surface rounded-full text-sm"
                                    >
                                        {keyword}
                                        <button
                                            onClick={() => handleRemoveKeyword(keyword)}
                                            className="text-admin-muted hover:text-admin-text"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Custom Instructions */}
                    <div className="space-y-2">
                        <Label>Instruções adicionais</Label>
                        <Textarea
                            value={config.customInstructions}
                            onChange={(e) => setConfig(prev => ({ ...prev, customInstructions: e.target.value }))}
                            placeholder="Quaisquer instruções extras para a IA..."
                            rows={2}
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Generate Button */}
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || (!config.topic && !scrapedContent)}
                        className="w-full"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Gerando...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Gerar conteúdo
                            </>
                        )}
                    </Button>

                    {/* Generated Content Preview */}
                    {generatedContent && (
                        <div className="space-y-3 border-t border-admin-border pt-4">
                            <h3 className="font-medium text-admin-text">Conteúdo gerado</h3>
                            <div className="p-3 bg-admin-surface rounded-lg max-h-64 overflow-y-auto text-sm text-admin-text whitespace-pre-wrap">
                                {generatedContent}
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleInsert} className="flex-1">
                                    <Check className="w-4 h-4 mr-2" />
                                    Inserir no editor
                                </Button>
                                <Button onClick={handleRegenerate} variant="secondary" disabled={isGenerating}>
                                    <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
