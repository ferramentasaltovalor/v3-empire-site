-- Post tags
CREATE TABLE public.post_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX post_tags_slug_idx ON public.post_tags(slug);

-- RLS Policies
CREATE POLICY "Tags are viewable by everyone"
  ON public.post_tags FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage tags"
  ON public.post_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
    )
  );

-- Grant permissions
GRANT ALL ON public.post_tags TO authenticated;
GRANT ALL ON public.post_tags TO service_role;
