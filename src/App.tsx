import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MemberAuthProvider } from "@/contexts/memberAuth";
import { StudentAuthProvider } from "@/contexts/studentAuth";
import Index from "./pages/Index";
import About from "./pages/About";
import WhatWeDo from "./pages/WhatWeDo";
import Projects from "./pages/Projects";
import Resources from "./pages/Resources";
import Calendar from "./pages/Calendar";
import Team from "./pages/Team";
import GetInvolved from "./pages/GetInvolved";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Donate from "./pages/Donate";
import Membership from "./pages/Membership";
import ShippingPolicy from "./pages/ShippingPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import RefundPolicy from "./pages/RefundPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import MemberLogin from "./pages/member/MemberLogin";
import MemberDashboard from "./pages/member/MemberDashboard";
import StudentLogin from "./pages/student/StudentLogin";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import GalleryManager from "./pages/admin/GalleryManager";
import EventsManager from "./pages/admin/EventsManager";
import TeamManager from "./pages/admin/TeamManager";
import AdminSettings from "./pages/admin/Settings";
import DonationsManager from "./pages/admin/DonationsManager";
import MembersManager from "./pages/admin/MembersManager";
import SubscriptionsManager from "./pages/admin/SubscriptionsManager";
import PlansManager from "./pages/admin/PlansManager";
import NewsManager from "./pages/admin/NewsManager";
import BlogsManager from "./pages/admin/BlogsManager";
import AnnouncementsManager from "./pages/admin/AnnouncementsManager";
import CompetitionsManager from "./pages/admin/CompetitionsManager";
import StudentsManager from "./pages/admin/StudentsManager";
import ParticipationsManager from "./pages/admin/ParticipationsManager";
import CertificatesManager from "./pages/admin/CertificatesManager";
import VolunteersManager from "./pages/admin/VolunteersManager";
import ProjectsManager from "./pages/admin/ProjectsManager";
import News from "./pages/News";
import Blogs from "./pages/Blogs";
import Announcements from "./pages/Announcements";
import Events from "./pages/Events";
import Volunteer from "./pages/Volunteer";
import Competitions from "./pages/Competitions";
import Portals from "./pages/Portals";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/what-we-do" element={<WhatWeDo />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/team" element={<Team />} />
            <Route path="/news" element={<News />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/events" element={<Events />} />
            <Route path="/competitions" element={<Competitions />} />
            <Route path="/portals" element={<Portals />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/donate" element={<Donate />} />
            <Route
              path="/membership"
              element={
                <MemberAuthProvider>
                  <Membership />
                </MemberAuthProvider>
              }
            />
            <Route
              path="/member/login"
              element={
                <MemberAuthProvider>
                  <MemberLogin />
                </MemberAuthProvider>
              }
            />
            <Route
              path="/member/dashboard"
              element={
                <MemberAuthProvider>
                  <MemberDashboard />
                </MemberAuthProvider>
              }
            />
            <Route
              path="/student/login"
              element={
                <StudentAuthProvider>
                  <StudentLogin />
                </StudentAuthProvider>
              }
            />
            <Route
              path="/student/dashboard"
              element={
                <StudentAuthProvider>
                  <StudentDashboard />
                </StudentAuthProvider>
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/gallery" element={<GalleryManager />} />
            <Route path="/admin/events" element={<EventsManager />} />
            <Route path="/admin/team" element={<TeamManager />} />
            <Route path="/admin/donations" element={<DonationsManager />} />
            <Route path="/admin/members" element={<MembersManager />} />
            <Route path="/admin/subscriptions" element={<SubscriptionsManager />} />
            <Route path="/admin/plans" element={<PlansManager />} />
            <Route path="/admin/news" element={<NewsManager />} />
            <Route path="/admin/blogs" element={<BlogsManager />} />
            <Route path="/admin/announcements" element={<AnnouncementsManager />} />
            <Route path="/admin/competitions" element={<CompetitionsManager />} />
            <Route path="/admin/students" element={<StudentsManager />} />
            <Route path="/admin/participations" element={<ParticipationsManager />} />
            <Route path="/admin/certificates" element={<CertificatesManager />} />
            <Route path="/admin/volunteers" element={<VolunteersManager />} />
            <Route path="/admin/projects" element={<ProjectsManager />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
