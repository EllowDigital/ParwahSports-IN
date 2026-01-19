-- Insert sample news items
INSERT INTO public.news (title, description, status, publish_date) VALUES
('Annual Sports Day 2024 Announced', 'We are excited to announce our Annual Sports Day 2024! Join us for a day filled with competitions, fun activities, and celebration of athletic excellence. All students, parents, and community members are welcome.', 'published', '2024-01-15'),
('New Training Center Opens in Rishikesh', 'Our new state-of-the-art training facility in Rishikesh is now open! The center features modern equipment, dedicated coaching staff, and can accommodate up to 200 athletes at a time.', 'published', '2024-01-10'),
('Partnership with National Sports Foundation', 'We are proud to announce our partnership with the National Sports Foundation to provide better opportunities for young athletes across Uttarakhand.', 'published', '2024-01-05'),
('Winter Training Camp Registration Open', 'Registration is now open for our Winter Training Camp 2024. The camp will focus on skill development, fitness training, and competition preparation.', 'published', '2024-01-01');

-- Insert sample events
INSERT INTO public.events (title, description, event_date, start_time, end_time, location, status, is_featured) VALUES
('Inter-School Taekwondo Championship 2024', 'Annual championship featuring schools from across Uttarakhand. Over 500 athletes expected to participate in various categories.', '2024-03-15', '09:00', '18:00', 'Sports Complex, Dehradun', 'upcoming', true),
('Summer Training Camp', 'Intensive 30-day training program for selected athletes focusing on technique improvement and fitness.', '2024-04-01', '06:00', '12:00', 'Rishikesh Training Center', 'upcoming', true),
('Youth Talent Identification Trial', 'Open trials to identify and nurture young sporting talent from rural areas of Uttarakhand.', '2024-04-20', '08:00', '16:00', 'Multiple Districts', 'upcoming', false),
('Sports Science Workshop', 'Expert-led workshop covering sports nutrition, injury prevention, and recovery techniques.', '2024-05-05', '10:00', '16:00', 'PSCT Main Campus', 'upcoming', false),
('District Level Competition', 'Qualifying event for state championships across multiple sports categories.', '2024-05-15', '09:00', '17:00', 'Haridwar Stadium', 'upcoming', false);

-- Insert sample team members
INSERT INTO public.team_members (name, role, bio, email, linkedin_url, display_order, is_active) VALUES
('Dr. Rajesh Kumar', 'Chairman', 'Former national-level athlete with 25+ years of experience in sports administration. Dedicated to nurturing young talent in Uttarakhand.', 'chairman@psct.org', 'https://linkedin.com', 1, true),
('Mrs. Sunita Sharma', 'Vice Chairperson', 'Sports educator and advocate for women in sports with extensive NGO experience. Pioneer in promoting girls'' participation in martial arts.', 'vicechair@psct.org', 'https://linkedin.com', 2, true),
('Mr. Vikram Singh', 'Secretary', 'Certified sports coach and program management expert. Oversees day-to-day operations and athlete development programs.', 'secretary@psct.org', 'https://linkedin.com', 3, true),
('Ms. Priya Nair', 'Treasurer', 'Chartered accountant with expertise in non-profit financial management. Ensures transparent fund utilization.', 'treasurer@psct.org', 'https://linkedin.com', 4, true),
('Coach Amit Thapa', 'Head Coach', 'National-level Taekwondo coach with international training certifications. Trained over 500 athletes in the past decade.', 'coach@psct.org', null, 5, true),
('Dr. Kavita Joshi', 'Sports Physician', 'Specialized in sports injuries and athlete rehabilitation. Provides medical support during training and competitions.', 'doctor@psct.org', null, 6, true);

-- Insert sample blogs
INSERT INTO public.blogs (title, content, author, featured_image_url, status, publish_date) VALUES
('The Journey of a Young Champion', '<p>Meet Rahul, a 15-year-old from a small village in Uttarakhand who has become a state-level Taekwondo champion...</p><p>His journey began when our scouts discovered his talent during a village sports event. Today, he represents our state at national competitions.</p><p>This is just one of many success stories that fuel our mission to nurture sporting talent from every corner of our region.</p>', 'PSCT Team', null, 'published', '2024-01-12'),
('Importance of Sports in Rural Development', '<p>Sports play a crucial role in the holistic development of communities, especially in rural areas...</p><p>Through our programs, we have seen how sports can transform lives, build confidence, and create opportunities for young people who otherwise had limited options.</p>', 'Dr. Rajesh Kumar', null, 'published', '2024-01-08'),
('Training Tips for Young Athletes', '<p>Whether you are just starting out or looking to improve your performance, these training tips from our expert coaches will help you on your journey...</p><ul><li>Consistency is key - practice regularly</li><li>Focus on fundamentals before advanced techniques</li><li>Proper nutrition and rest are as important as training</li></ul>', 'Coach Amit Thapa', null, 'published', '2024-01-03');

-- Insert sample announcements
INSERT INTO public.announcements (title, message, priority, is_active, start_date, end_date) VALUES
('Summer Camp Registration Now Open!', 'Limited seats available for our intensive summer training camp. Early bird discount of 20% for registrations before March 15th.', 'important', true, '2024-01-15', '2024-03-15'),
('Office Closed for Makar Sankranti', 'Our offices will remain closed on January 14-15 for Makar Sankranti. Emergency contact available at our helpline.', 'normal', true, '2024-01-13', '2024-01-16');

-- Insert sample gallery images (using placeholder URLs)
INSERT INTO public.gallery_images (title, description, image_url, category, is_featured, display_order) VALUES
('Training Session 2024', 'Athletes during morning training session', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800', 'sports', true, 1),
('Championship Winners', 'Our champions at the state competition', 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800', 'achievements', true, 2),
('Community Sports Day', 'Families enjoying our annual sports day event', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800', 'events', false, 3),
('New Training Center', 'Our state-of-the-art facility in Rishikesh', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', 'general', false, 4),
('Youth Athletes', 'Young athletes practicing martial arts', 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800', 'sports', true, 5),
('Award Ceremony', 'Athletes receiving their medals', 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=800', 'achievements', false, 6);