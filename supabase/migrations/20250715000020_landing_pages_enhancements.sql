-- Landing pages enhancements - adds css_custom, conversion_goals, and leads table

-- Add new columns to landing_pages
ALTER TABLE public.landing_pages 
  ADD COLUMN IF NOT EXISTS css_custom TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS conversion_goals JSONb DEFAULT '[]'::jsonb;

-- Create landing_page_leads table for form submissions
CREATE TABLE IF NOT EXISTS public.landing_page_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landing_page_id UUID NOT NULL REFERENCES public.landing_pages(id) ON DELETE CASCADE,
  
  -- Lead data
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT,
  custom_fields JSONB DEFAULT '{}'::jsonb,
  
  -- Tracking
  source TEXT,
  medium TEXT,
  campaign TEXT,
  utm_params JSONB DEFAULT '{}'::jsonb,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  
  -- Conversion tracking
  conversion_goal_id TEXT,
  converted_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.landing_page_leads ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS landing_page_leads_lp_idx ON public.landing_page_leads(landing_page_id);
CREATE INDEX IF NOT EXISTS landing_page_leads_email_idx ON public.landing_page_leads(email);
CREATE INDEX IF NOT EXISTS landing_page_leads_created_idx ON public.landing_page_leads(created_at);

-- Trigger for updated_at
CREATE TRIGGER landing_page_leads_updated_at
  BEFORE UPDATE ON public.landing_page_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies
CREATE POLICY "LP leads manageable by editors"
  ON public.landing_page_leads FOR ALL
  USING (public.is_editor());

CREATE POLICY "LP leads insertable by anyone"
  ON public.landing_page_leads FOR INSERT
  WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.landing_page_leads TO authenticated;
GRANT ALL ON public.landing_page_leads TO service_role;
GRANT INSERT ON public.landing_page_leads TO anon;

-- Comment on tables
COMMENT ON TABLE public.landing_pages IS 'Landing pages with dynamic sections';
COMMENT ON TABLE public.landing_page_leads IS 'Lead submissions from landing page forms';
COMMENT ON COLUMN public.landing_pages.css_custom IS 'Custom CSS for the landing page';
COMMENT ON COLUMN public.landing_pages.conversion_goals IS 'Array of conversion goal configurations';
