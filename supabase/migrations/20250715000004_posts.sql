-- Posts table
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  content_html TEXT,
  excerpt TEXT,
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived', 'trashed')),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  
  -- SEO fields
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[] DEFAULT '{}',
  og_image_url TEXT,
  canonical_url TEXT,
  noindex BOOLEAN DEFAULT FALSE,
  
  -- Content metadata
  reading_time_minutes INTEGER DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  
  -- AI SEO analysis
  ai_seo_score INTEGER,
  ai_seo_suggestions JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX posts_slug_idx ON public.posts(slug);
CREATE INDEX posts_status_idx ON public.posts(status);
CREATE INDEX posts_author_id_idx ON public.posts(author_id);
CREATE INDEX posts_published_at_idx ON public.posts(published_at DESC);
CREATE INDEX posts_deleted_at_idx ON public.posts(deleted_at);
CREATE INDEX posts_scheduled_at_idx ON public.posts(scheduled_at);

-- Full-text search index
CREATE INDEX posts_content_search_idx ON public.posts USING GIN(to_tsvector('portuguese', title || ' ' || COALESCE(excerpt, '')));

-- Trigger for updated_at
CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Helper function to check if user has editor+ role
CREATE OR REPLACE FUNCTION public.is_editor()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
  );
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper function to check if user is author or editor
CREATE OR REPLACE FUNCTION public.is_author_or_editor(post_author_id UUID)
RETURNS BOOLEAN AS $$
  SELECT 
    auth.uid() = post_author_id
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
    );
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RLS Policies
-- Published posts are viewable by everyone
CREATE POLICY "Published posts are viewable by everyone"
  ON public.posts FOR SELECT
  USING (status = 'published' AND deleted_at IS NULL);

-- Authors can view their own posts (any status)
CREATE POLICY "Authors can view own posts"
  ON public.posts FOR SELECT
  USING (auth.uid() = author_id AND deleted_at IS NULL);

-- Editors can view all posts
CREATE POLICY "Editors can view all posts"
  ON public.posts FOR SELECT
  USING (public.is_editor() AND deleted_at IS NULL);

-- Authors and editors can create posts
CREATE POLICY "Authors can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (public.is_author_or_editor(author_id));

-- Authors can update own posts, editors can update all
CREATE POLICY "Authors can update own posts"
  ON public.posts FOR UPDATE
  USING (public.is_author_or_editor(author_id) AND deleted_at IS NULL);

-- Only admins can soft delete (set deleted_at)
CREATE POLICY "Only editors can soft delete"
  ON public.posts FOR UPDATE
  USING (public.is_editor());

-- Grant permissions
GRANT ALL ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;
