
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import BottomNavBar from "@/components/BottomNavBar";
import FloatingMushuWidget from "@/components/FloatingMushuWidget";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col pb-14 md:pb-0">
      <header className="px-4 py-3 flex items-center justify-between bg-background bg-opacity-80 backdrop-blur z-50">
        <nav>
          <Link to="/" className="font-bold text-xl">Mushu</Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          {user ? (
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm">
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <FloatingMushuWidget />
      <BottomNavBar />
    </div>
  );
};

export default Layout;
