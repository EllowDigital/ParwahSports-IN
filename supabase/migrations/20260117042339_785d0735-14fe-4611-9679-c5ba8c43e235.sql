-- Add 'student' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'student';

-- =====================
-- NEWS TABLE
-- =====================
CREATE TABLE public.news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published news" ON public.news
FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage news" ON public.news
FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON public.news
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================
-- BLOGS TABLE
-- =====================
CREATE TABLE public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    featured_image_url TEXT,
    author TEXT,
    publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blogs" ON public.blogs
FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage blogs" ON public.blogs
FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_blogs_updated_at
    BEFORE UPDATE ON public.blogs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================
-- ANNOUNCEMENTS TABLE
-- =====================
CREATE TYPE public.announcement_priority AS ENUM ('normal', 'important', 'urgent');

CREATE TABLE public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority announcement_priority NOT NULL DEFAULT 'normal',
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active announcements" ON public.announcements
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage announcements" ON public.announcements
FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_announcements_updated_at
    BEFORE UPDATE ON public.announcements
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================
-- COMPETITIONS TABLE
-- =====================
CREATE TABLE public.competitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    is_participation_open BOOLEAN NOT NULL DEFAULT true,
    cover_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view competitions" ON public.competitions
FOR SELECT USING (true);

CREATE POLICY "Admins can manage competitions" ON public.competitions
FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_competitions_updated_at
    BEFORE UPDATE ON public.competitions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================
-- STUDENTS TABLE
-- =====================
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    student_id TEXT UNIQUE,
    phone TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own data" ON public.students
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage students" ON public.students
FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================
-- PARTICIPATIONS TABLE
-- =====================
CREATE TYPE public.participation_status AS ENUM ('registered', 'participated', 'winner', 'runner_up', 'disqualified');

CREATE TABLE public.participations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    position TEXT,
    status participation_status NOT NULL DEFAULT 'registered',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(student_id, competition_id)
);

ALTER TABLE public.participations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own participations" ON public.participations
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.students 
        WHERE students.id = participations.student_id 
        AND students.user_id = auth.uid()
    )
);

CREATE POLICY "Admins can manage participations" ON public.participations
FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_participations_updated_at
    BEFORE UPDATE ON public.participations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================
-- CERTIFICATES TABLE
-- =====================
CREATE TABLE public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    competition_id UUID REFERENCES public.competitions(id) ON DELETE SET NULL,
    participation_id UUID REFERENCES public.participations(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    certificate_url TEXT NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own certificates" ON public.certificates
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.students 
        WHERE students.id = certificates.student_id 
        AND students.user_id = auth.uid()
    )
);

CREATE POLICY "Admins can manage certificates" ON public.certificates
FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_certificates_updated_at
    BEFORE UPDATE ON public.certificates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================
-- STORAGE BUCKETS
-- =====================
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery-images', 'gallery-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('competition-images', 'competition-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', false);

-- Storage policies for event-images
CREATE POLICY "Anyone can view event images" ON storage.objects
FOR SELECT USING (bucket_id = 'event-images');

CREATE POLICY "Admins can upload event images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'event-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update event images" ON storage.objects
FOR UPDATE USING (bucket_id = 'event-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete event images" ON storage.objects
FOR DELETE USING (bucket_id = 'event-images' AND has_role(auth.uid(), 'admin'));

-- Storage policies for gallery-images
CREATE POLICY "Anyone can view gallery images" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery-images');

CREATE POLICY "Admins can upload gallery images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'gallery-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update gallery images" ON storage.objects
FOR UPDATE USING (bucket_id = 'gallery-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete gallery images" ON storage.objects
FOR DELETE USING (bucket_id = 'gallery-images' AND has_role(auth.uid(), 'admin'));

-- Storage policies for blog-images
CREATE POLICY "Anyone can view blog images" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Admins can upload blog images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update blog images" ON storage.objects
FOR UPDATE USING (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete blog images" ON storage.objects
FOR DELETE USING (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'));

-- Storage policies for competition-images
CREATE POLICY "Anyone can view competition images" ON storage.objects
FOR SELECT USING (bucket_id = 'competition-images');

CREATE POLICY "Admins can upload competition images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'competition-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update competition images" ON storage.objects
FOR UPDATE USING (bucket_id = 'competition-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete competition images" ON storage.objects
FOR DELETE USING (bucket_id = 'competition-images' AND has_role(auth.uid(), 'admin'));

-- Storage policies for certificates (private bucket - only owner can view)
CREATE POLICY "Students can view own certificates" ON storage.objects
FOR SELECT USING (
    bucket_id = 'certificates' AND (
        has_role(auth.uid(), 'admin') OR
        EXISTS (
            SELECT 1 FROM public.students 
            WHERE students.user_id = auth.uid()
            AND (storage.foldername(name))[1] = students.id::text
        )
    )
);

CREATE POLICY "Admins can upload certificates" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'certificates' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update certificates" ON storage.objects
FOR UPDATE USING (bucket_id = 'certificates' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete certificates" ON storage.objects
FOR DELETE USING (bucket_id = 'certificates' AND has_role(auth.uid(), 'admin'));