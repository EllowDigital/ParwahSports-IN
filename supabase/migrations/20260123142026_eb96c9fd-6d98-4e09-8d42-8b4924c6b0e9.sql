-- Add finance role for admin refund permissions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
      AND t.typname = 'app_role'
      AND e.enumlabel = 'finance'
  ) THEN
    ALTER TYPE public.app_role ADD VALUE 'finance';
  END IF;
END $$;

-- Add more granular payment statuses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
      AND t.typname = 'payment_status'
      AND e.enumlabel = 'refund_pending'
  ) THEN
    ALTER TYPE public.payment_status ADD VALUE 'refund_pending';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
      AND t.typname = 'payment_status'
      AND e.enumlabel = 'cancelled'
  ) THEN
    ALTER TYPE public.payment_status ADD VALUE 'cancelled';
  END IF;
END $$;

-- Add refund metadata + retry linkage columns
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS refund_id text,
  ADD COLUMN IF NOT EXISTS refund_requested_at timestamptz,
  ADD COLUMN IF NOT EXISTS refunded_at timestamptz,
  ADD COLUMN IF NOT EXISTS retry_of_payment_id uuid;

ALTER TABLE public.donations
  ADD COLUMN IF NOT EXISTS refund_id text,
  ADD COLUMN IF NOT EXISTS refund_requested_at timestamptz,
  ADD COLUMN IF NOT EXISTS refunded_at timestamptz,
  ADD COLUMN IF NOT EXISTS retry_of_donation_id uuid;

-- Helpful indexes for admin and troubleshooting
CREATE INDEX IF NOT EXISTS idx_payments_member_created_at ON public.payments(member_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_created_at ON public.payments(subscription_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_email_created_at ON public.donations(donor_email, created_at DESC);
