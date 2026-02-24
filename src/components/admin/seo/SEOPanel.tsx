'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ChevronDown, ChevronUp, Sparkles, Loader2, Check, AlertTriangle, X, RefreshCw } from 'lucide-react'
import { analyzeSEO } from '@/lib/ai/client'
import type { SEOAnalysisResult } from '@/types/ai'

interface SEOPanelProps {
    title: string
    content: string
    keywords: string[]
    onTitleChange: (title: string) => void
    onDescriptionChange: (description: string) => void
    onKeywordsChange: (keywords: string[]) => void
    metaTitle: string
    metaDescription: string
}

export function SEOPanel({
    title,
    content,
    keywords,
    onTitleChange,
    onDescriptionChange,
    onKeywordsChange,
    metaTitle,
    metaDescription,
}: SEOPanelProps) {
    const [isOpen, setIsOpen] = useState(true)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysis, setAnalysis] = useState<SEOAnalysisResult | null>(null)
    const [keywordInput, setKeywordInput] = useState('')

    // Debounced analysis
    const runAnalysis = useCallback(async () => {
        if (!content || content.length < 100) return

        setIsAnalyzing(true)
        try {
            const result = await analyzeSEO(content, title, keywords)
            setAnalysis(result)
        } catch (error) {
            console.error('SEO analysis failed:', error)
        } finally {
            setIsAnalyzing(false)
        }
    }, [content, title, keywords])

    // Auto-analyze when content changes (debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (content && content.length > 100) {
                runAnalysis()
            }
        }, 2000)

        return () => clearTimeout(timer)
    }, [content, runAnalysis])

    const handleGenerateMeta = async () => {
        setIsAnalyzing(true)
        try {
            const result = await analyzeSEO(content, title, keywords)
            setAnalysis(result)

            // Auto-fill generated meta if available
            if (result.title?.value) {
                onTitleChange(result.title.value)
            }
            if (result.metaDescription?.value) {
                onDescriptionChange(result.metaDescription.value)
            }
            if (result.keywords?.suggested?.length) {
                onKeywordsChange([...keywords, ...result.keywords.suggested.slice(0, 5)])
            }
        } catch (error) {
            console.error('SEO generation failed:', error)
        } finally {
            setIsAnalyzing(false)
        }
    }

    const handleAddKeyword = () => {
        if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
            onKeywordsChange([...keywords, keywordInput.trim()])
            setKeywordInput('')
        }
    }

    const handleRemoveKeyword = (keyword: string) => {
        onKeywordsChange(keywords.filter(k => k !== keyword))
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600'
        if (score >= 60) return 'text-yellow-600'
        return 'text-red-600'
    }

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'bg-green-100'
        if (score >= 60) return 'bg-yellow-100'
        return 'bg-red-100'
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pass':
                return <Check className="w-4 h-4 text-green-600" />
            case 'warning':
                return <AlertTriangle className="w-4 h-4 text-yellow-600" />
            case 'fail':
                return <X className="w-4 h-4 text-red-600" />
            default:
                return null
        }
    }

    return (
        <div className="border border-[var(--color-admin-border)] rounded-lg overflow-hidden">
            {/* Header */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-[var(--color-admin-surface)] hover:bg-[var(--color-admin-border)] transition-colors"
            >
                <div className="flex items-center gap-3">
                    <h3 className="font-medium text-[var(--color-admin-text)]">SEO</h3>
                    {analysis?.score !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full text-sm font-medium ${getScoreBg(analysis.score)} ${getScoreColor(analysis.score)}`}>
                            {analysis.score}/100
                        </span>
                    )}
                </div>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[var(--color-admin-muted)]" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-[var(--color-admin-muted)]" />
                )}
            </button>

            {isOpen && (
                <div className="p-4 space-y-6">
                    {/* Meta Title */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Título SEO</Label>
                            <span className={`text-xs ${metaTitle.length > 60 ? 'text-red-500' : 'text-[var(--color-admin-muted)]'}`}>
                                {metaTitle.length}/60
                            </span>
                        </div>
                        <Input
                            value={metaTitle}
                            onChange={(e) => onTitleChange(e.target.value)}
                            placeholder="Título para mecanismos de busca"
                        />
                        {analysis?.title?.suggestion && (
                            <p className="text-xs text-[var(--color-admin-muted)]">{analysis.title.suggestion}</p>
                        )}
                    </div>

                    {/* Meta Description */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Meta Description</Label>
                            <span className={`text-xs ${metaDescription.length > 160 ? 'text-red-500' : 'text-[var(--color-admin-muted)]'}`}>
                                {metaDescription.length}/160
                            </span>
                        </div>
                        <Textarea
                            value={metaDescription}
                            onChange={(e) => onDescriptionChange(e.target.value)}
                            placeholder="Descrição para mecanismos de busca"
                            rows={3}
                        />
                        {analysis?.metaDescription?.suggestion && (
                            <p className="text-xs text-[var(--color-admin-muted)]">{analysis.metaDescription.suggestion}</p>
                        )}
                    </div>

                    {/* Keywords */}
                    <div className="space-y-2">
                        <Label>Palavras-chave focais</Label>
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
                        {keywords.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {keywords.map(keyword => (
                                    <span
                                        key={keyword}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-admin-surface)] rounded-full text-sm"
                                    >
                                        {keyword}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveKeyword(keyword)}
                                            className="text-[var(--color-admin-muted)] hover:text-[var(--color-admin-text)]"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                        {analysis?.keywords?.suggested && analysis.keywords.suggested.length > 0 && (
                            <div className="mt-2">
                                <p className="text-xs text-[var(--color-admin-muted)] mb-1">Sugestões:</p>
                                <div className="flex flex-wrap gap-1">
                                    {analysis.keywords.suggested.map(keyword => (
                                        <button
                                            key={keyword}
                                            type="button"
                                            onClick={() => !keywords.includes(keyword) && onKeywordsChange([...keywords, keyword])}
                                            className={`px-2 py-0.5 text-xs rounded ${keywords.includes(keyword)
                                                ? 'bg-[var(--color-admin-accent)]/20 text-[var(--color-admin-accent)]'
                                                : 'bg-[var(--color-admin-surface)] text-[var(--color-admin-muted)] hover:text-[var(--color-admin-text)]'
                                                }`}
                                        >
                                            + {keyword}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* AI Generate Button */}
                    <Button
                        type="button"
                        onClick={handleGenerateMeta}
                        disabled={isAnalyzing || !content}
                        variant="secondary"
                        className="w-full"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Analisando...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Gerar SEO com IA
                            </>
                        )}
                    </Button>

                    {/* Analysis Results */}
                    {analysis && (
                        <div className="border-t border-[var(--color-admin-border)] pt-4 space-y-4">
                            {/* Score Circle */}
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getScoreBg(analysis.score)}`}>
                                    <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                                        {analysis.score}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-[var(--color-admin-text)]">Pontuação SEO</p>
                                    <p className="text-sm text-[var(--color-admin-muted)]">
                                        {analysis.score >= 80 ? 'Excelente!' : analysis.score >= 60 ? 'Bom, mas pode melhorar' : 'Precisa de melhorias'}
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={runAnalysis}
                                    disabled={isAnalyzing}
                                >
                                    <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>

                            {/* Checks */}
                            {analysis.checks && (
                                <div className="space-y-2">
                                    <h4 className="font-medium text-[var(--color-admin-text)]">Verificações</h4>
                                    {Object.entries(analysis.checks).map(([key, check]) => (
                                        <div key={key} className="flex items-start gap-2">
                                            {getStatusIcon(check.status)}
                                            <div>
                                                <p className="text-sm text-[var(--color-admin-text)]">{check.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Readability */}
                            {analysis.readability && (
                                <div className="space-y-2">
                                    <h4 className="font-medium text-[var(--color-admin-text)]">Legibilidade</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-[var(--color-admin-muted)]">Pontuação:</span>
                                            <span className="ml-2 text-[var(--color-admin-text)]">{analysis.readability.score}/100</span>
                                        </div>
                                        <div>
                                            <span className="text-[var(--color-admin-muted)]">Sentenças médias:</span>
                                            <span className="ml-2 text-[var(--color-admin-text)]">{analysis.readability.avgSentenceLength || '-'} palavras</span>
                                        </div>
                                    </div>
                                    {analysis.readability.suggestions && analysis.readability.suggestions.length > 0 && (
                                        <ul className="text-xs text-[var(--color-admin-muted)] space-y-1">
                                            {analysis.readability.suggestions.map((suggestion, i) => (
                                                <li key={i}>• {suggestion}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                            {/* Keyword Density */}
                            {analysis.keywords?.density && (
                                <div className="space-y-2">
                                    <h4 className="font-medium text-[var(--color-admin-text)]">Densidade de palavras-chave</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(analysis.keywords.density).map(([keyword, density]) => (
                                            <span
                                                key={keyword}
                                                className="px-2 py-1 bg-[var(--color-admin-surface)] rounded text-sm"
                                            >
                                                {keyword}: {(density as number).toFixed(1)}%
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Google Preview */}
                    <div className="border-t border-[var(--color-admin-border)] pt-4">
                        <h4 className="font-medium text-[var(--color-admin-text)] mb-2">Preview no Google</h4>
                        <div className="p-3 bg-white rounded border border-gray-200">
                            <p className="text-blue-600 text-lg hover:underline cursor-pointer truncate">
                                {metaTitle || 'Título da página'}
                            </p>
                            <p className="text-green-700 text-sm truncate">
                                {`https://empire.com.br/blog/${title.toLowerCase().replace(/\s+/g, '-')}`}
                            </p>
                            <p className="text-gray-600 text-sm line-clamp-2">
                                {metaDescription || 'Descrição da página aparecerá aqui...'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
