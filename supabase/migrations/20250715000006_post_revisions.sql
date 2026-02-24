-- Post revisions for history
CREATE TABLE public.post_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  version_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(post_id, version_number)
);

-- Enable RLS
ALTER TABLE public.post_revisions ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX post_revisions_post_id_idx ON public.post_revisions(post_id);
CREATE INDEX post_revisions_created_at_idx ON public.post_revisions(created_at DESC);

-- RLS Policies
CREATE POLICY "Revisions viewable by post authors"
  ON public.post_revisions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = post_revisions.post_id
      AND public.is_author_or_editor(posts.author_id)
    )
  );

CREATE POLICY "Authors can create revisions"
  ON public.post_revisions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = post_revisions.post_id
      AND public.is_author_or_editor(posts.author_id)
    )
  );

-- Grant permissions
GRANT ALL ON public.post_revisions TO authenticated;
GRANT ALL ON public.post_revisions TO service_role;
