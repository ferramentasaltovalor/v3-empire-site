-- Media folders
CREATE TABLE public.media_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  parent_id UUID REFERENCES public.media_folders(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.media_folders ENABLE ROW LEVEL SECURITY;

-- Index
CREATE INDEX media_folders_parent_id_idx ON public.media_folders(parent_id);

-- RLS Policies
CREATE POLICY "Folders viewable by authenticated users"
  ON public.media_folders FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Folders manageable by editors"
  ON public.media_folders FOR ALL
  USING (public.is_editor());

-- Grant permissions
GRANT ALL ON public.media_folders TO authenticated;
GRANT ALL ON public.media_folders TO service_role;
