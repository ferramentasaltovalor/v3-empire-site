// Status badge for posts, landing pages, etc.
// Visual variants based on status type

export type StatusType = 'draft' | 'published' | 'scheduled' | 'archived' | 'trashed'

interface StatusBadgeProps {
    status: StatusType
    label?: string
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
    draft: {
        label: 'Rascunho',
        className: 'bg-gray-100 text-gray-700 border-gray-200',
    },
    published: {
        label: 'Publicado',
        className: 'bg-green-50 text-green-700 border-green-200',
    },
    scheduled: {
        label: 'Agendado',
        className: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    archived: {
        label: 'Arquivado',
        className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    },
    trashed: {
        label: 'Lixeira',
        className: 'bg-red-50 text-red-700 border-red-200',
    },
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
    const config = statusConfig[status]
    const displayLabel = label || config.label

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
        >
            {displayLabel}
        </span>
    )
}
