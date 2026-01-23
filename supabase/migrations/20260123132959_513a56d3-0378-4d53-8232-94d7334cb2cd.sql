-- Security + privacy updates (retry with corrected dynamic SQL)

-- 1) Lock down payments INSERT (remove permissive policy)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'payments'
      AND policyname = 'System can insert payments'
  ) THEN
    EXECUTE 'DROP POLICY "System can insert payments" ON public.payments';
  END IF;
END $$;

-- 2) Add public-only contact fields for team members (safe to expose)
ALTER TABLE public.team_members
  ADD COLUMN IF NOT EXISTS public_email text,
  ADD COLUMN IF NOT EXISTS public_phone text;

-- 3) Create admin-only private contacts table and migrate existing private data
CREATE TABLE IF NOT EXISTS public.team_member_private_contacts (
  team_member_id uuid PRIMARY KEY REFERENCES public.team_members(id) ON DELETE CASCADE,
  email text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.team_member_private_contacts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'team_member_private_contacts'
      AND policyname = 'Admins can manage team member private contacts'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can manage team member private contacts" ON public.team_member_private_contacts FOR ALL USING (public.has_role(auth.uid(), ''admin''::public.app_role)) WITH CHECK (public.has_role(auth.uid(), ''admin''::public.app_role))';
  END IF;
END $$;

-- Migrate any existing private contact data out of the public table
INSERT INTO public.team_member_private_contacts (team_member_id, email, phone)
SELECT id, email, phone
FROM public.team_members
WHERE (email IS NOT NULL AND email <> '''') OR (phone IS NOT NULL AND phone <> '''')
ON CONFLICT (team_member_id)
DO UPDATE SET
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = now();

-- Null out public exposure columns (keep columns for backward compatibility)
UPDATE public.team_members
SET email = NULL,
    phone = NULL
WHERE email IS NOT NULL OR phone IS NOT NULL;