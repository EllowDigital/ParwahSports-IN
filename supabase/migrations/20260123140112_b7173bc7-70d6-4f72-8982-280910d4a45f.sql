-- Admin student password reset audit log (DB only)

CREATE TABLE IF NOT EXISTS public.student_password_reset_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  student_user_id uuid,
  actor_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.student_password_reset_audit ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'student_password_reset_audit'
      AND policyname = 'Admins can view student password reset audit'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can view student password reset audit" ON public.student_password_reset_audit FOR SELECT USING (public.has_role(auth.uid(), ''admin''::public.app_role))';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_student_password_reset_audit_student_id
  ON public.student_password_reset_audit(student_id);

CREATE INDEX IF NOT EXISTS idx_student_password_reset_audit_created_at
  ON public.student_password_reset_audit(created_at DESC);