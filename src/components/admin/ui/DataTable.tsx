// Reusable data table for admin
// Features: sortable columns, pagination, row actions, empty/loading states

'use client'

import { useState } from 'react'

export interface Column<T> {
    key: keyof T | string
    label: string
    sortable?: boolean
    render?: (item: T) => React.ReactNode
    className?: string
}

export interface PaginationState {
    page: number
    pageSize: number
    total: number
}

interface DataTableProps<T> {
    columns: Column<T>[]
    data: T[]
    keyField: keyof T
    pagination?: PaginationState
    onPageChange?: (page: number) => void
    actions?: (item: T) => React.ReactNode
    emptyMessage?: string
    loading?: boolean
    loadingRows?: number
}

function ChevronUpIcon() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
    )
}

function ChevronDownIcon() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    )
}

function ChevronLeftIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
    )
}

function ChevronRightIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    )
}

function LoadingSkeleton({ rows, columns }: { rows: number; columns: number }) {
    return (
        <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b border-[var(--color-admin-border)]">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <td key={colIndex} className="px-6 py-4">
                            <div className="h-4 bg-[var(--color-admin-surface)] rounded animate-pulse" />
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    )
}

export function DataTable<T extends Record<string, unknown>>({
    columns,
    data,
    keyField,
    pagination,
    onPageChange,
    actions,
    emptyMessage = 'Nenhum resultado encontrado',
    loading = false,
    loadingRows = 5,
}: DataTableProps<T>) {
    const [sortKey, setSortKey] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortKey(key)
            setSortDirection('asc')
        }
    }

    const sortedData = [...data].sort((a, b) => {
        if (!sortKey) return 0
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        if (aVal === bVal) return 0
        if (aVal === null || aVal === undefined) return 1
        if (bVal === null || bVal === undefined) return -1
        const comparison = aVal < bVal ? -1 : 1
        return sortDirection === 'asc' ? comparison : -comparison
    })

    const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1

    const renderPagination = () => {
        if (!pagination || !onPageChange) return null

        const pages = []
        const maxVisiblePages = 5
        let startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2))
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i)
        }

        return (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--color-admin-border)]">
                <p className="text-sm text-[var(--color-admin-muted)]">
                    Mostrando {((pagination.page - 1) * pagination.pageSize) + 1} a{' '}
                    {Math.min(pagination.page * pagination.pageSize, pagination.total)} de {pagination.total} resultados
                </p>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="p-2 rounded-lg hover:bg-[var(--color-admin-surface)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeftIcon />
                    </button>
                    {startPage > 1 && (
                        <>
                            <button
                                onClick={() => onPageChange(1)}
                                className="px-3 py-1 rounded-lg hover:bg-[var(--color-admin-surface)] text-sm"
                            >
                                1
                            </button>
                            {startPage > 2 && <span className="px-2 text-[var(--color-admin-muted)]">...</span>}
                        </>
                    )}
                    {pages.map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${page === pagination.page
                                    ? 'bg-[var(--color-admin-accent)] text-white'
                                    : 'hover:bg-[var(--color-admin-surface)]'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <span className="px-2 text-[var(--color-admin-muted)]">...</span>}
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className="px-3 py-1 rounded-lg hover:bg-[var(--color-admin-surface)] text-sm"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => onPageChange(pagination.page + 1)}
                        disabled={pagination.page === totalPages}
                        className="p-2 rounded-lg hover:bg-[var(--color-admin-surface)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRightIcon />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[var(--color-admin-bg)] border border-[var(--color-admin-border)] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[var(--color-admin-surface)] border-b border-[var(--color-admin-border)]">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={String(column.key)}
                                    className={`px-6 py-3 text-left text-xs font-medium text-[var(--color-admin-muted)] uppercase tracking-wider ${column.className || ''}`}
                                >
                                    {column.sortable ? (
                                        <button
                                            onClick={() => handleSort(String(column.key))}
                                            className="flex items-center gap-1 hover:text-[var(--color-admin-text)] transition-colors"
                                        >
                                            {column.label}
                                            <span className="flex flex-col">
                                                <span className={`${sortKey === column.key && sortDirection === 'asc' ? 'text-[var(--color-admin-accent)]' : ''}`}>
                                                    <ChevronUpIcon />
                                                </span>
                                                <span className={`${sortKey === column.key && sortDirection === 'desc' ? 'text-[var(--color-admin-accent)]' : ''}`}>
                                                    <ChevronDownIcon />
                                                </span>
                                            </span>
                                        </button>
                                    ) : (
                                        column.label
                                    )}
                                </th>
                            ))}
                            {actions && (
                                <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-admin-muted)] uppercase tracking-wider">
                                    Ações
                                </th>
                            )}
                        </tr>
                    </thead>
                    {loading ? (
                        <LoadingSkeleton rows={loadingRows} columns={columns.length + (actions ? 1 : 0)} />
                    ) : sortedData.length === 0 ? (
                        <tbody>
                            <tr>
                                <td
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                    className="px-6 py-12 text-center text-[var(--color-admin-muted)]"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody className="divide-y divide-[var(--color-admin-border)]">
                            {sortedData.map((item) => (
                                <tr
                                    key={String(item[keyField])}
                                    className="hover:bg-[var(--color-admin-surface)] transition-colors"
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={String(column.key)}
                                            className={`px-6 py-4 text-sm text-[var(--color-admin-text)] ${column.className || ''}`}
                                        >
                                            {column.render
                                                ? column.render(item)
                                                : String(item[column.key as keyof T] ?? '')}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-6 py-4 text-right">
                                            {actions(item)}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>
            {renderPagination()}
        </div>
    )
}
