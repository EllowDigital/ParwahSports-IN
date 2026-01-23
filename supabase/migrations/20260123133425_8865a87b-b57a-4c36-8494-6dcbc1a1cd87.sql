-- Admin-only audit log for private contact changes

-- 1) Audit table
CREATE TABLE IF NOT EXISTS public.team_member_private_contact_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id uuid NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  actor_user_id uuid,
  action text NOT NULL CHECK (action IN ('insert','update')),
  old_email text,
  new_email text,
  old_phone text,
  new_phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_team_member_private_contact_audit_team_member_id
  ON public.team_member_private_contact_audit(team_member_id);

CREATE INDEX IF NOT EXISTS idx_team_member_private_contact_audit_created_at
  ON public.team_member_private_contact_audit(created_at DESC);

ALTER TABLE public.team_member_private_contact_audit ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'team_member_private_contact_audit'
      AND policyname = 'Admins can view private contact audit'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can view private contact audit" ON public.team_member_private_contact_audit FOR SELECT USING (public.has_role(auth.uid(), ''admin''::public.app_role))';
  END IF;
END $$;

-- 2) Trigger function
CREATE OR REPLACE FUNCTION public.log_team_member_private_contact_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid;
BEGIN
  -- actor may be null for service-role initiated writes
  v_actor := auth.uid();

  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.team_member_private_contact_audit (
      team_member_id,
      actor_user_id,
      action,
      old_email,
      new_email,
      old_phone,
      new_phone
    ) VALUES (
      NEW.team_member_id,
      v_actor,
      'insert',
      NULL,
      NEW.email,
      NULL,
      NEW.phone
    );
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    -- Only log when relevant fields change
    IF (COALESCE(OLD.email, '') IS DISTINCT FROM COALESCE(NEW.email, ''))
       OR (COALESCE(OLD.phone, '') IS DISTINCT FROM COALESCE(NEW.phone, '')) THEN
      INSERT INTO public.team_member_private_contact_audit (
        team_member_id,
        actor_user_id,
        action,
        old_email,
        new_email,
        old_phone,
        new_phone
      ) VALUES (
        NEW.team_member_id,
        v_actor,
        'update',
        OLD.email,
        NEW.email,
        OLD.phone,
        NEW.phone
      );
    END IF;

    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

-- 3) Trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_log_team_member_private_contact_change'
  ) THEN
    CREATE TRIGGER trg_log_team_member_private_contact_change
    AFTER INSERT OR UPDATE ON public.team_member_private_contacts
    FOR EACH ROW
    EXECUTE FUNCTION public.log_team_member_private_contact_change();
  END IF;
END $$;