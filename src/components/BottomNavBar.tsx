import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  List,
  FileText,
  DollarSign,
  Heart,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Inicio",
    path: "/",
    icon: Home,
  },
  {
    label: "Productividad",
    path: "/productivity",
    icon: List,
  },
  {
    label: "Notas",
    path: "/quick-notes",
    icon: FileText,
  },
  {
    label: "Finanzas",
    path: "/expenses",
    icon: DollarSign,
  },
  {
    label: "Terapia",
    path: "/therapy",
    icon: Brain,
  },
  {
    label: "Bienestar",
    path: "/wellbeing",
    icon: Heart,
  },
];

const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      className="fixed z-40 bottom-0 left-0 w-full bg-background border-t border-border shadow-md md:rounded-t-xl md:w-auto md:left-1/2 md:transform md:-translate-x-1/2 md:bottom-4 md:max-w-xl flex md:mx-auto"
      role="navigation"
    >
      <ul className="flex flex-row w-full justify-between md:justify-center md:gap-1">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          return (
            <li key={item.path} className="flex-1">
              <button
                type="button"
                aria-label={item.label}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center w-full py-2 md:py-3 text-xs transition-colors",
                  active
                    ? "text-primary font-semibold bg-accent/50"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <item.icon
                  className={cn(
                    "h-6 w-6 mb-0.5",
                    active ? "stroke-2" : "stroke-1"
                  )}
                  aria-hidden="true"
                />
                <span className="text-[11px] tracking-tight">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNavBar;
