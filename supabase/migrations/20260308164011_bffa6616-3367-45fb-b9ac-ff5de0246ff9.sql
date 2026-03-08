
-- ============================================
-- 1. CRITICAL: Fix subscription self-promotion
-- Drop existing permissive UPDATE policy and replace with restrictive one
-- Members should only be able to cancel, not promote/modify plans
-- ============================================
DROP POLICY IF EXISTS "Members can update own subscriptions" ON public.subscriptions;

CREATE POLICY "Members can update own subscriptions"
ON public.subscriptions
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM members
    WHERE members.id = subscriptions.member_id
    AND members.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM members
    WHERE members.id = subscriptions.member_id
    AND members.user_id = auth.uid()
  )
  -- Members can only cancel, not change plan or reactivate
  AND (
    status = 'cancelled'::subscription_status
    AND cancelled_at IS NOT NULL
  )
);

-- ============================================
-- 2. Fix members self-modify active status
-- Members should only update personal contact fields
-- ============================================
DROP POLICY IF EXISTS "Members can update own data" ON public.members;

CREATE POLICY "Members can update own data"
ON public.members
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  -- Ensure is_active cannot be changed by the member
  AND is_active = (SELECT m.is_active FROM members m WHERE m.id = id)
);

-- ============================================
-- 3. Restrict team member private data exposure
-- Create a view that excludes private columns for public access
-- Then update the SELECT policy to hide email/phone
-- ============================================

-- We can't easily hide columns with RLS, so we create a security definer
-- function that returns only public fields
CREATE OR REPLACE FUNCTION public.get_public_team_members()
RETURNS TABLE (
  id uuid,
  name text,
  role text,
  bio text,
  image_url text,
  public_email text,
  public_phone text,
  linkedin_url text,
  twitter_url text,
  is_active boolean,
  display_order integer,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id, name, role, bio, image_url, 
    public_email, public_phone, 
    linkedin_url, twitter_url,
    is_active, display_order, 
    created_at, updated_at
  FROM public.team_members
  WHERE is_active = true
  ORDER BY display_order ASC, created_at ASC;
$$;

-- ============================================
-- 4. Add user_id to donations for proper identity verification
-- ============================================
ALTER TABLE public.donations
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Update the donor viewing policy to prefer user_id
DROP POLICY IF EXISTS "Donors can view own donations" ON public.donations;

CREATE POLICY "Donors can view own donations"
ON public.donations
FOR SELECT
TO authenticated
USING (
  (user_id IS NOT NULL AND auth.uid() = user_id)
  OR
  (user_id IS NULL AND donor_email = (auth.jwt() ->> 'email'))
);
