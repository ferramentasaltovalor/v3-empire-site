-- Site settings (key-value store)
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_by UUID REFERENCES public.profiles(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Settings readable by admins"
  ON public.site_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Settings writable by super_admin"
  ON public.site_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Insert default settings
INSERT INTO public.site_settings (key, value) VALUES
  ('site_name', '"Empire"'::jsonb),
  ('site_description', '"Consultoria de estratégia e crescimento para negócios de alto impacto."'::jsonb),
  ('posts_per_page', '10'::jsonb),
  ('enable_ai_generation', 'true'::jsonb),
  ('enable_landing_pages', 'true'::jsonb),
  ('enable_api_rest', 'true'::jsonb);

-- Grant permissions
GRANT ALL ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
