-- Create team-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-images', 'team-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for team-images bucket
CREATE POLICY "Admins can upload team images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'team-images' AND EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Anyone can view team images"
ON storage.objects FOR SELECT
USING (bucket_id = 'team-images');

CREATE POLICY "Admins can delete team images"
ON storage.objects FOR DELETE
USING (bucket_id = 'team-images' AND EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
));