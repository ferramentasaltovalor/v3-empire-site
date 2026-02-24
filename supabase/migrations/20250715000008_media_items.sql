-- Media items
CREATE TABLE public.media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  width INTEGER,
  height INTEGER,
  folder_id UUID REFERENCES public.media_folders(id) ON DELETE SET NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  alt_text TEXT,
  title TEXT,
  description TEXT,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX media_items_folder_id_idx ON public.media_items(folder_id);
CREATE INDEX media_items_uploaded_by_idx ON public.media_items(uploaded_by);
CREATE INDEX media_items_deleted_at_idx ON public.media_items(deleted_at);

-- RLS Policies
CREATE POLICY "Media viewable by authenticated users"
  ON public.media_items FOR SELECT
  USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

CREATE POLICY "Authors can upload media"
  ON public.media_items FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update own uploads"
  ON public.media_items FOR UPDATE
  USING (
    auth.uid() = uploaded_by 
    OR public.is_editor()
  );

CREATE POLICY "Editors can soft delete media"
  ON public.media_items FOR UPDATE
  USING (public.is_editor());

-- Grant permissions
GRANT ALL ON public.media_items TO authenticated;
GRANT ALL ON public.media_items TO service_role;
