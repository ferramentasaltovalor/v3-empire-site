-- Webhook logs
CREATE TABLE public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID NOT NULL REFERENCES public.webhook_configs(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  payload JSONB NOT NULL,
  status_code INTEGER,
  response_body TEXT,
  attempts INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX webhook_logs_webhook_id_idx ON public.webhook_logs(webhook_id);
CREATE INDEX webhook_logs_created_at_idx ON public.webhook_logs(created_at DESC);

-- RLS Policies
CREATE POLICY "Webhook logs viewable by admins"
  ON public.webhook_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Grant permissions
GRANT ALL ON public.webhook_logs TO authenticated;
GRANT ALL ON public.webhook_logs TO service_role;
