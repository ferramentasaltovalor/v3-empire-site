// src/app/(admin)/admin/midia/page.tsx
// Media library page - Gerenciador de Mídia

import { getMediaItems, getMediaFolders } from '@/lib/admin/media'
import { MediaLibrary } from '@/components/admin/media/MediaLibrary'
import { adminContent } from '@/content/admin'

export const dynamic = 'force-dynamic'

interface MidiaPageProps {
  searchParams: Promise<{ folder?: string; search?: string; type?: string }>
}

export default async function MidiaPage({ searchParams }: MidiaPageProps) {
  const params = await searchParams
  const folderId = params.folder || null
  const { items, total } = await getMediaItems({
    folderId: folderId === 'root' ? null : folderId,
    search: params.search,
    mimeType: params.type,
  })
  const folders = await getMediaFolders(folderId === 'root' ? null : folderId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text">
            {adminContent.media.title}
          </h1>
          <p className="text-admin-muted">{adminContent.media.subtitle}</p>
        </div>
      </div>

      <MediaLibrary
        initialItems={items}
        initialFolders={folders}
        total={total}
        currentFolderId={folderId}
        searchQuery={params.search}
        mimeType={params.type}
      />
    </div>
  )
}
