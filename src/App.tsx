import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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
import MemberLogin from "./pages/member/MemberLogin";
import MemberDashboard from "./pages/member/MemberDashboard";
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
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/member/login" element={<MemberLogin />} />
            <Route path="/member/dashboard" element={<MemberDashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/gallery" element={<GalleryManager />} />
            <Route path="/admin/events" element={<EventsManager />} />
            <Route path="/admin/team" element={<TeamManager />} />
            <Route path="/admin/donations" element={<DonationsManager />} />
            <Route path="/admin/members" element={<MembersManager />} />
            <Route path="/admin/subscriptions" element={<SubscriptionsManager />} />
            <Route path="/admin/plans" element={<PlansManager />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
