-- Post categories
CREATE TABLE public.post_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT,
  parent_id UUID REFERENCES public.post_categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX post_categories_slug_idx ON public.post_categories(slug);
CREATE INDEX post_categories_parent_id_idx ON public.post_categories(parent_id);

-- RLS Policies
CREATE POLICY "Categories are viewable by everyone"
  ON public.post_categories FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage categories"
  ON public.post_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
    )
  );

-- Grant permissions
GRANT ALL ON public.post_categories TO authenticated;
GRANT ALL ON public.post_categories TO service_role;
