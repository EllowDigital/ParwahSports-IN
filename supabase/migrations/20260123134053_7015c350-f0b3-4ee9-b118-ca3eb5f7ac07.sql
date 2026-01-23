-- Student self-signup support (allow users to create their own student row, initially inactive)

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'students'
      AND policyname = 'Authenticated users can create own student profile'
  ) THEN
    EXECUTE 'CREATE POLICY "Authenticated users can create own student profile" ON public.students FOR INSERT WITH CHECK (auth.uid() = user_id AND is_active = false)';
  END IF;
END $$;