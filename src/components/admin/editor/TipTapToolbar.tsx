'use client'

import type { Editor } from '@tiptap/react'
import {
    Bold, Italic, Underline, Strikethrough, Code,
    Heading1, Heading2, Heading3,
    List, ListOrdered, Quote, Code2,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Link, Image, Undo, Redo, Highlighter
} from 'lucide-react'
import { useState, useRef } from 'react'

interface TipTapToolbarProps {
    editor: Editor
    onImageUpload?: (file: File) => Promise<string>
}

export function TipTapToolbar({ editor, onImageUpload }: TipTapToolbarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [linkUrl, setLinkUrl] = useState('')

    const setLink = () => {
        const url = window.prompt('URL', linkUrl)
        if (url === null) return
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (onImageUpload) {
            const url = await onImageUpload(file)
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const ToolbarButton = ({
        onClick,
        isActive = false,
        disabled = false,
        children
    }: {
        onClick: () => void
        isActive?: boolean
        disabled?: boolean
        children: React.ReactNode
    }) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`p-2 rounded hover:bg-[var(--color-admin-surface)] ${isActive ? 'bg-[var(--color-admin-surface)] text-[var(--color-admin-accent)]' : 'text-[var(--color-admin-muted)]'
                } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            title={typeof children === 'object' ? undefined : String(children)}
        >
            {children}
        </button>
    )

    const ToolbarDivider = () => (
        <div className="w-px h-6 bg-[var(--color-admin-border)] mx-1" />
    )

    return (
        <div className="border-b border-[var(--color-admin-border)] p-2 flex flex-wrap gap-1 bg-[var(--color-admin-surface)]">
            {/* History */}
            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                <Undo className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                <Redo className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Headings */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
            >
                <Heading1 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
            >
                <Heading2 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive('heading', { level: 3 })}
            >
                <Heading3 className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Text formatting */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
            >
                <Bold className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
            >
                <Italic className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
            >
                <Underline className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
            >
                <Strikethrough className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                isActive={editor.isActive('highlight')}
            >
                <Highlighter className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                isActive={editor.isActive('code')}
            >
                <Code className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Alignment */}
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                isActive={editor.isActive({ textAlign: 'left' })}
            >
                <AlignLeft className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                isActive={editor.isActive({ textAlign: 'center' })}
            >
                <AlignCenter className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                isActive={editor.isActive({ textAlign: 'right' })}
            >
                <AlignRight className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                isActive={editor.isActive({ textAlign: 'justify' })}
            >
                <AlignJustify className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Lists and blocks */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
            >
                <List className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
            >
                <ListOrdered className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
            >
                <Quote className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editor.isActive('codeBlock')}
            >
                <Code2 className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Link and Image */}
            <ToolbarButton onClick={setLink} isActive={editor.isActive('link')}>
                <Link className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => fileInputRef.current?.click()}>
                <Image className="w-4 h-4" />
            </ToolbarButton>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
            />
        </div>
    )
}
