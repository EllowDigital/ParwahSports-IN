-- Fix permissive INSERT policies flagged by linter while keeping public forms working

-- donations: replace WITH CHECK (true)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'donations'
      AND policyname = 'Anyone can create donations'
  ) THEN
    EXECUTE 'DROP POLICY "Anyone can create donations" ON public.donations';
  END IF;

  EXECUTE 'CREATE POLICY "Anyone can create donations" ON public.donations FOR INSERT WITH CHECK (auth.role() IN (''anon'', ''authenticated''))';
END $$;

-- volunteers: replace WITH CHECK (true)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'volunteers'
      AND policyname = 'Anyone can submit volunteer form'
  ) THEN
    EXECUTE 'DROP POLICY "Anyone can submit volunteer form" ON public.volunteers';
  END IF;

  EXECUTE 'CREATE POLICY "Anyone can submit volunteer form" ON public.volunteers FOR INSERT WITH CHECK (auth.role() IN (''anon'', ''authenticated''))';
END $$;