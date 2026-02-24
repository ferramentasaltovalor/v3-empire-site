-- Incoming Webhook configurations
-- Stores registered external webhooks that can send events to our system
CREATE TABLE public.incoming_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE, -- URL-friendly identifier for the webhook endpoint
  name TEXT NOT NULL,
  description TEXT,
  source TEXT NOT NULL, -- 'stripe', 'make', 'zapier', 'generic', 'custom'
  secret_key TEXT, -- For signature verification
  allowed_ips TEXT[] DEFAULT '{}', -- IP whitelist for sources without signatures
  enabled BOOLEAN DEFAULT TRUE,
  
  -- Rate limiting
  rate_limit INTEGER DEFAULT 100, -- Max requests per minute
  rate_limit_window INTEGER DEFAULT 60, -- Window in seconds
  
  -- Configuration
  verify_signature BOOLEAN DEFAULT TRUE, -- Whether to verify signatures
  accepted_events TEXT[] DEFAULT '{}', -- List of accepted event types (empty = all)
  
  -- Metadata
  last_received_at TIMESTAMPTZ,
  total_requests INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.incoming_webhooks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Incoming webhooks manageable by admins"
  ON public.incoming_webhooks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Index for slug lookups (used in API routes)
CREATE INDEX incoming_webhooks_slug_idx ON public.incoming_webhooks(slug);
CREATE INDEX incoming_webhooks_enabled_idx ON public.incoming_webhooks(enabled);

-- Grant permissions
GRANT ALL ON public.incoming_webhooks TO authenticated;
GRANT ALL ON public.incoming_webhooks TO service_role;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_incoming_webhooks_updated_at
  BEFORE UPDATE ON public.incoming_webhooks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comment
COMMENT ON TABLE public.incoming_webhooks IS 'Registered external webhooks that can send events to our system';
COMMENT ON COLUMN public.incoming_webhooks.slug IS 'URL-friendly identifier used in the webhook URL: /api/webhooks/incoming/{slug}';
COMMENT ON COLUMN public.incoming_webhooks.source IS 'Type of external service: stripe, make, zapier, generic, custom';
COMMENT ON COLUMN public.incoming_webhooks.secret_key IS 'Secret key for HMAC signature verification';
COMMENT ON COLUMN public.incoming_webhooks.allowed_ips IS 'IP addresses allowed to send webhooks (for sources without signatures)';
