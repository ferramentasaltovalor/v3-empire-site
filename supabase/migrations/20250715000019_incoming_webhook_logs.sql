-- Incoming Webhook Logs
-- Stores logs of all received webhook requests for debugging and auditing
CREATE TABLE public.incoming_webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID NOT NULL REFERENCES public.incoming_webhooks(id) ON DELETE CASCADE,
  
  -- Request details
  event_type TEXT, -- Type of event from the payload (e.g., 'payment.succeeded')
  source TEXT NOT NULL, -- Where the webhook came from
  ip_address TEXT, -- Client IP address
  
  -- Payload
  headers JSONB DEFAULT '{}'::jsonb, -- Request headers (sanitized)
  payload JSONB NOT NULL, -- The received payload
  
  -- Processing
  status TEXT NOT NULL DEFAULT 'received', -- 'received', 'processing', 'processed', 'failed'
  error_message TEXT, -- Error if processing failed
  
  -- Response
  response_status INTEGER DEFAULT 200, -- HTTP status returned to sender
  response_body TEXT, -- Response body sent back
  
  -- Timing
  processing_time_ms INTEGER, -- Time to process the webhook
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.incoming_webhook_logs ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX incoming_webhook_logs_webhook_id_idx ON public.incoming_webhook_logs(webhook_id);
CREATE INDEX incoming_webhook_logs_created_at_idx ON public.incoming_webhook_logs(created_at DESC);
CREATE INDEX incoming_webhook_logs_status_idx ON public.incoming_webhook_logs(status);
CREATE INDEX incoming_webhook_logs_event_type_idx ON public.incoming_webhook_logs(event_type);

-- RLS Policies
CREATE POLICY "Incoming webhook logs viewable by admins"
  ON public.incoming_webhook_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Grant permissions
GRANT ALL ON public.incoming_webhook_logs TO authenticated;
GRANT ALL ON public.incoming_webhook_logs TO service_role;

-- Function to cleanup old logs
CREATE OR REPLACE FUNCTION cleanup_incoming_webhook_logs(retention_days INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.incoming_webhook_logs
  WHERE created_at < NOW() - (retention_days || ' days')::INTERVAL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comment
COMMENT ON TABLE public.incoming_webhook_logs IS 'Logs of all received incoming webhook requests';
COMMENT ON COLUMN public.incoming_webhook_logs.status IS 'Processing status: received, processing, processed, failed';
COMMENT ON COLUMN public.incoming_webhook_logs.event_type IS 'Event type extracted from payload (e.g., payment.succeeded)';
