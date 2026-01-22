-- Add email tracking to donations so webhook + checkout verification don't send duplicates
ALTER TABLE public.donations
ADD COLUMN IF NOT EXISTS confirmation_email_sent_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_donations_confirmation_email_sent_at
ON public.donations (confirmation_email_sent_at);