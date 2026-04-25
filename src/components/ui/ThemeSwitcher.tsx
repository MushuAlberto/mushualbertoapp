import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";

const themes = [
  { value: "light", label: "Claro", icon: <Sun className="mr-2 h-4 w-4" /> },
  { value: "dark", label: "Oscuro", icon: <Moon className="mr-2 h-4 w-4" /> },
  { value: "system", label: "Sistema", icon: <Monitor className="mr-2 h-4 w-4" /> },
];

type ThemeValue = "light" | "dark" | "system";

function isThemeValue(value: unknown): value is ThemeValue {
  return value === "light" || value === "dark" || value === "system";
}

export const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = React.useState<ThemeValue>("system");

  React.useEffect(() => {
    const local = localStorage.getItem("mushu_theme");
    let themeToSet: ThemeValue = "system";
    
    if (local && isThemeValue(local)) {
      themeToSet = local;
      setTheme(themeToSet);
    }
    handleDocumentTheme(themeToSet);
  }, []);

  const handleAnimatedBg = (theme: ThemeValue) => {
    const el = document.body;
    el.classList.remove("bg-mushu-light", "bg-mushu-dark");
    if (theme === "dark") {
      el.classList.add("bg-mushu-dark");
    } else if (theme === "light") {
      el.classList.add("bg-mushu-light");
    }
  };

  const handleDocumentTheme = (selected: ThemeValue) => {
    document.documentElement.classList.remove("light", "dark");
    if (selected === "dark") document.documentElement.classList.add("dark");
    else if (selected === "light") document.documentElement.classList.add("light");
    handleAnimatedBg(selected);
  };

  const onChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    const value = ev.target.value;
    if (isThemeValue(value)) {
      setTheme(value);
      localStorage.setItem("mushu_theme", value);
      handleDocumentTheme(value);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="theme-select" className="font-medium text-sm">Tema:</label>
      <select
        id="theme-select"
        className="rounded border px-2 py-1 bg-background text-foreground"
        value={theme}
        onChange={onChange}
      >
        {themes.map(opt =>
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        )}
      </select>
    </div>
  );
};