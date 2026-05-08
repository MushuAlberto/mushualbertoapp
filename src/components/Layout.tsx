
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import BottomNavBar from "@/components/BottomNavBar";
import FloatingMushuWidget from "@/components/FloatingMushuWidget";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { User, Menu } from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <header className="sticky top-0 px-4 py-3 flex items-center justify-between bg-background/80 backdrop-blur z-40 border-b border-border md:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <Link to="/" className="font-bold text-xl md:text-2xl tracking-tight bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
                Mushu
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <ThemeSwitcher />
              </div>
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </header>

          <main key={location.pathname} className="flex-1 overflow-y-auto pb-20 md:pb-6 p-4 md:p-6 max-w-7xl mx-auto w-full animate-fade-in">
            {children}
          </main>

          <FloatingMushuWidget />
          <div className="md:hidden">
            <BottomNavBar />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
