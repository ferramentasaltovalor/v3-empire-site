-- AI generation logs
CREATE TABLE public.ai_generation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model TEXT NOT NULL,
  prompt TEXT NOT NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  source_type TEXT CHECK (source_type IN ('manual', 'instagram', 'youtube')),
  source_url TEXT,
  post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ai_generation_logs ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX ai_generation_logs_created_by_idx ON public.ai_generation_logs(created_by);
CREATE INDEX ai_generation_logs_created_at_idx ON public.ai_generation_logs(created_at DESC);

-- RLS Policies
CREATE POLICY "AI logs viewable by admins"
  ON public.ai_generation_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Users can create AI logs"
  ON public.ai_generation_logs FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Grant permissions
GRANT ALL ON public.ai_generation_logs TO authenticated;
GRANT ALL ON public.ai_generation_logs TO service_role;
