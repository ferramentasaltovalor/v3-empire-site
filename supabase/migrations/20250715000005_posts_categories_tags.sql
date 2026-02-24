-- Pivot table: posts <-> categories
CREATE TABLE public.posts_categories (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.post_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Pivot table: posts <-> tags
CREATE TABLE public.posts_tags (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.post_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Enable RLS
ALTER TABLE public.posts_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies (inherit from posts)
CREATE POLICY "Posts categories viewable by everyone"
  ON public.posts_categories FOR SELECT
  USING (true);

CREATE POLICY "Posts tags viewable by everyone"
  ON public.posts_tags FOR SELECT
  USING (true);

-- Only editors and authors can manage relationships
CREATE POLICY "Editors can manage posts categories"
  ON public.posts_categories FOR ALL
  USING (public.is_editor());

CREATE POLICY "Editors can manage posts tags"
  ON public.posts_tags FOR ALL
  USING (public.is_editor());

-- Grant permissions
GRANT ALL ON public.posts_categories TO authenticated;
GRANT ALL ON public.posts_categories TO service_role;
GRANT ALL ON public.posts_tags TO authenticated;
GRANT ALL ON public.posts_tags TO service_role;
