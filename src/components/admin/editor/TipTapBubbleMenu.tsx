'use client'

import { BubbleMenu } from '@tiptap/react/menus'
import type { Editor } from '@tiptap/react'
import { Bold, Italic, Underline, Link } from 'lucide-react'

interface TipTapBubbleMenuProps {
    editor: Editor
}

export function TipTapBubbleMenu({ editor }: TipTapBubbleMenuProps) {
    const BubbleButton = ({
        onClick,
        isActive = false,
        children
    }: {
        onClick: () => void
        isActive?: boolean
        children: React.ReactNode
    }) => (
        <button
            type="button"
            onClick={onClick}
            className={`p-1.5 rounded hover:bg-[var(--color-admin-border)] ${isActive ? 'text-[var(--color-admin-accent)]' : 'text-white'
                } transition-colors`}
        >
            {children}
        </button>
    )

    return (
        <BubbleMenu
            editor={editor}
            className="bg-[var(--color-admin-text)] text-white px-1 py-0.5 rounded-lg shadow-lg flex gap-0.5"
        >
            <BubbleButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
            >
                <Bold className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
            >
                <Italic className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
            >
                <Underline className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
                onClick={() => {
                    const url = window.prompt('URL')
                    if (url) {
                        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
                    }
                }}
                isActive={editor.isActive('link')}
            >
                <Link className="w-4 h-4" />
            </BubbleButton>
        </BubbleMenu>
    )
}
