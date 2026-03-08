import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PageTransition } from "./PageTransition";
import { AnnouncementsBanner } from "@/components/home/AnnouncementsBanner";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <AnnouncementsBanner />
      <main className={`flex-1 ${isHome ? "" : "pt-16 lg:pt-20"}`}>
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;