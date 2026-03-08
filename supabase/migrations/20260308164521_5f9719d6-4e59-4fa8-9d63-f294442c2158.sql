
-- Remove private email/phone from team_members since they're duplicated
-- in team_member_private_contacts. Set them to NULL for all rows.
-- (We can't DROP columns easily without breaking admin code, so nullify them)
-- Actually, let's just restrict the public SELECT to admins and use RPC for public
DROP POLICY IF EXISTS "Public can view active team members" ON public.team_members;

-- Only admins can directly query team_members table (they already have ALL policy)
-- Public users must use get_public_team_members() RPC
-- No public SELECT policy needed since the RPC is SECURITY DEFINER
