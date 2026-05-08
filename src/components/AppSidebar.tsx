
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  CheckSquare,
  BookOpen,
  DollarSign,
  Heart,
  User,
  Trophy,
  FileText,
  LogOut,
  Brain,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MAIN_NAV = [
  { label: "Inicio", path: "/", icon: Home },
  { label: "Enfoque", path: "/productivity", icon: CheckSquare },
  { label: "Mi Diario", path: "/diary", icon: BookOpen },
  { label: "Finanzas", path: "/expenses", icon: DollarSign },
  { label: "Bienestar", path: "/wellbeing", icon: Heart },
];

const SECONDARY_NAV = [
  { label: "Mis Logros", path: "/rewards", icon: Trophy },
  { label: "Notas Rápidas", path: "/quick-notes", icon: FileText },
];

export function AppSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/" || location.pathname === "/dashboard";
    return location.pathname === path;
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center gap-2 px-4 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 text-white shadow-lg">
          <Brain className="h-5 w-5" />
        </div>
        <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
          <span className="font-bold text-lg bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">Mushu</span>
          <span className="text-[11px] text-muted-foreground">Asistente Personal</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-xs uppercase tracking-wider text-muted-foreground">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MAIN_NAV.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={item.label}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-xs uppercase tracking-wider text-muted-foreground">
            Más
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SECONDARY_NAV.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={item.label}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:hidden">
                  <ThemeSwitcher />
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/profile")}
              tooltip="Mi Perfil"
              className="h-12"
            >
              <Link to="/profile">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300">
                    {(user.email?.charAt(0) || 'I').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
                  <span className="font-medium text-sm truncate max-w-[120px]">
                    {user.user_metadata?.full_name || user.email?.split("@")[0]}
                  </span>
                  <span className="text-xs text-muted-foreground">Mi Perfil</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
