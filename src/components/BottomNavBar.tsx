import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  CheckSquare,
  BookOpen,
  DollarSign,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Inicio", path: "/", icon: Home },
  { label: "Enfoque", path: "/productivity", icon: CheckSquare },
  { label: "Diario", path: "/diary", icon: BookOpen },
  { label: "Finanzas", path: "/expenses", icon: DollarSign },
  { label: "Bienestar", path: "/wellbeing", icon: Heart },
];

const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      className="fixed z-40 bottom-0 left-0 w-full bg-background/80 backdrop-blur-lg border-t border-border flex md:hidden"
      role="navigation"
    >
      <ul className="flex flex-row w-full">
        {NAV_ITEMS.map((item) => {
          const active =
            location.pathname === item.path ||
            (item.path === "/" && location.pathname === "/dashboard");
          return (
            <li key={item.path} className="flex-1">
              <button
                type="button"
                aria-label={item.label}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center w-full py-2.5 text-xs transition-all duration-200",
                  active
                    ? "text-violet-600 dark:text-violet-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "p-1 rounded-xl mb-0.5 transition-all duration-200",
                    active
                      ? "bg-violet-500/10 dark:bg-violet-500/20"
                      : ""
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-all",
                      active ? "stroke-[2.5px]" : "stroke-[1.5px]"
                    )}
                    aria-hidden="true"
                  />
                </div>
                <span className="text-[10px] tracking-tight leading-none">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNavBar;
