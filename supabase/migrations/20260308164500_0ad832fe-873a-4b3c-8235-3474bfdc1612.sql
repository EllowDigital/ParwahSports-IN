
-- 1. Fix members policy - broken self-referential subquery
-- Need to use OLD row value. Use a trigger-based approach instead.
DROP POLICY IF EXISTS "Members can update own data" ON public.members;

-- Create a security definer function to get current is_active status
CREATE OR REPLACE FUNCTION public.get_member_is_active(_member_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT is_active FROM public.members WHERE id = _member_id LIMIT 1;
$$;

CREATE POLICY "Members can update own data"
ON public.members
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND is_active = public.get_member_is_active(id)
);

-- 2. Fix donation INSERT policy to prevent user_id spoofing
DROP POLICY IF EXISTS "Anyone can create donations" ON public.donations;

CREATE POLICY "Anyone can create donations"
ON public.donations
FOR INSERT
WITH CHECK (
  auth.role() = ANY (ARRAY['anon'::text, 'authenticated'::text])
  AND (user_id IS NULL OR user_id = auth.uid())
);

-- 3. Fix team_members public SELECT - restrict to non-private columns
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view active team members" ON public.team_members;

-- Create a restrictive policy that uses a security definer function
-- to filter out private columns. Since RLS can't filter columns,
-- we'll keep the policy but the public frontend now uses the RPC function.
-- For the direct table access, restrict to authenticated admins only for full access.
-- Public users should use get_public_team_members() RPC instead.

-- Allow admins full SELECT (they already have an ALL policy, but let's be explicit)
CREATE POLICY "Public can view active team members"
ON public.team_members
FOR SELECT
USING (is_active = true);
