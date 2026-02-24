-- Landing pages
CREATE TABLE public.landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- SEO
  seo_title TEXT,
  seo_description TEXT,
  og_image_url TEXT,
  
  -- Integration
  custom_analytics_id TEXT,
  webhook_id UUID,
  
  -- Metadata
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX landing_pages_slug_idx ON public.landing_pages(slug);
CREATE INDEX landing_pages_status_idx ON public.landing_pages(status);

-- Trigger for updated_at
CREATE TRIGGER landing_pages_updated_at
  BEFORE UPDATE ON public.landing_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies
CREATE POLICY "Published LPs viewable by everyone"
  ON public.landing_pages FOR SELECT
  USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "LPs manageable by editors"
  ON public.landing_pages FOR ALL
  USING (public.is_editor() AND deleted_at IS NULL);

-- Grant permissions
GRANT ALL ON public.landing_pages TO authenticated;
GRANT ALL ON public.landing_pages TO service_role;
