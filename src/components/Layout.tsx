
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
  return (
    <div className="min-h-screen bg-background p-4">
      {children}
    </div>
  );
};

export default Layout;
