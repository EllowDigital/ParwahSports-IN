-- Create projects table to store projects/initiatives
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  location TEXT,
  year TEXT,
  participants TEXT,
  category TEXT,
  status TEXT DEFAULT 'upcoming',
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view projects" 
ON public.projects 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage projects" 
ON public.projects 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert sample projects
INSERT INTO public.projects (title, description, location, year, participants, category, status, is_featured) VALUES
('Inter-School Taekwondo Championship 2024', 'Annual championship bringing together schools from across Uttarakhand for competitive martial arts events.', 'Dehradun, Uttarakhand', '2024', '500+', 'Championship', 'upcoming', true),
('Summer Sports Camp', 'Intensive 30-day training camp for talented young athletes covering multiple sports disciplines.', 'Rishikesh', '2024', '120', 'Training Camp', 'completed', true),
('State-Level Talent Trials', 'Talent identification program to scout promising athletes from rural and underserved areas.', 'Multiple Districts', '2024', '800+', 'Talent Trial', 'ongoing', true),
('National Sports Day Celebration', 'Community event celebrating sports with exhibitions, workshops, and awareness programs.', 'Haridwar', '2023', '1000+', 'Community Event', 'completed', false),
('Youth Fitness Workshop Series', 'Monthly workshops teaching fitness fundamentals, nutrition, and healthy lifestyle habits to youth.', 'Dehradun Schools', '2024', '300+', 'Workshop', 'ongoing', false),
('Rural Sports Outreach Program', 'Taking sports equipment and training to remote villages to promote sports participation.', 'Tehri, Pauri, Chamoli', '2024', '450+', 'Outreach', 'ongoing', true);