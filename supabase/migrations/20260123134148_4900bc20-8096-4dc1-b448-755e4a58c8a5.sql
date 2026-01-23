-- Allow authenticated users to view their own donations by matching auth email claim

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'donations'
      AND policyname = 'Donors can view own donations'
  ) THEN
    EXECUTE 'CREATE POLICY "Donors can view own donations" ON public.donations FOR SELECT USING (donor_email = (auth.jwt() ->> ''email''))';
  END IF;
END $$;