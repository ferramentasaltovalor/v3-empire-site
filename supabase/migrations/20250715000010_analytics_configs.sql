-- Analytics configurations
CREATE TABLE public.analytics_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('ga4', 'gtm', 'pixel', 'hotjar', 'clarity', 'custom')),
  tracking_id TEXT,
  custom_html TEXT,
  active BOOLEAN DEFAULT TRUE,
  apply_to JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.analytics_configs ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX analytics_configs_type_idx ON public.analytics_configs(type);

-- RLS Policies
CREATE POLICY "Analytics configs manageable by admins"
  ON public.analytics_configs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Analytics configs readable by admins"
  ON public.analytics_configs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Grant permissions
GRANT ALL ON public.analytics_configs TO authenticated;
GRANT ALL ON public.analytics_configs TO service_role;
