'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { common, createLowlight } from 'lowlight'
import { TipTapToolbar } from './TipTapToolbar'
import { TipTapBubbleMenu } from './TipTapBubbleMenu'
import { forwardRef, useImperativeHandle } from 'react'

const lowlight = createLowlight(common)

export interface TipTapEditorRef {
    insertContent: (content: string) => void
    getSelectedText: () => string
}

interface TipTapEditorProps {
    content: object | null
    onChange: (content: object) => void
    onImageUpload?: (file: File) => Promise<string>
    placeholder?: string
    editable?: boolean
}

export const TipTapEditor = forwardRef<TipTapEditorRef, TipTapEditorProps>(
    function TipTapEditor(
        {
            content,
            onChange,
            onImageUpload,
            placeholder = 'Comece a escrever seu conteúdo aqui...',
            editable = true,
        },
        ref
    ) {
        const editor = useEditor({
            extensions: [
                StarterKit.configure({
                    codeBlock: false, // We'll use CodeBlockLowlight instead
                }),
                Underline,
                TextAlign.configure({
                    types: ['heading', 'paragraph'],
                }),
                Highlight.configure({
                    multicolor: true,
                }),
                Link.configure({
                    openOnClick: false,
                    HTMLAttributes: {
                        class: 'text-admin-accent underline hover:text-admin-accentHover',
                    },
                }),
                Image.configure({
                    HTMLAttributes: {
                        class: 'rounded-lg max-w-full',
                    },
                }),
                CodeBlockLowlight.configure({
                    defaultLanguage: 'plaintext',
                    lowlight,
                }),
                Placeholder.configure({
                    placeholder,
                }),
                CharacterCount,
            ],
            content: content || '',
            editable,
            onUpdate: ({ editor }) => {
                onChange(editor.getJSON())
            },
        })

        useImperativeHandle(ref, () => ({
            insertContent: (newContent: string) => {
                if (editor) {
                    editor.chain().focus().insertContent(newContent).run()
                }
            },
            getSelectedText: () => {
                if (editor) {
                    return editor.state.doc.textBetween(
                        editor.state.selection.from,
                        editor.state.selection.to,
                        ' '
                    )
                }
                return ''
            },
        }), [editor])

        if (!editor) {
            return null
        }

        return (
            <div className="border border-[var(--color-admin-border)] rounded-lg overflow-hidden">
                <TipTapToolbar editor={editor} onImageUpload={onImageUpload} />
                <TipTapBubbleMenu editor={editor} />
                <EditorContent
                    editor={editor}
                    className="prose prose-sm max-w-none p-4 min-h-[400px] focus:outline-none bg-white"
                />
                <div className="border-t border-[var(--color-admin-border)] px-4 py-2 text-sm text-[var(--color-admin-muted)] flex justify-between bg-[var(--color-admin-surface)]">
                    <span>
                        {editor.storage.characterCount.characters()} caracteres
                    </span>
                    <span>
                        {editor.storage.characterCount.words()} palavras
                    </span>
                </div>
            </div>
        )
    }
)
