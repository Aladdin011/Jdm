import { motion } from "framer-motion";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();

  const themes = [
    {
      value: "light" as const,
      label: "Light",
      icon: Sun,
      description: "Light mode",
    },
    {
      value: "dark" as const,
      label: "Dark",
      icon: Moon,
      description: "Dark mode",
    },
    {
      value: "system" as const,
      label: "System",
      icon: Monitor,
      description: "Follow system preference",
    },
  ];

  const currentTheme = themes.find((t) => t.value === theme);
  const CurrentIcon = currentTheme?.icon || Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 transition-all duration-300 group"
        >
          <motion.div
            key={theme}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <CurrentIcon className="h-4 w-4 text-slate-600 dark:text-slate-300 group-hover:scale-110 transition-transform duration-300" />
          </motion.div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-semibold">
          Theme Preference
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          const isSelected = theme === themeOption.value;

          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className="cursor-pointer flex items-center gap-3 px-3 py-2"
            >
              <div className="flex items-center gap-3 flex-1">
                <Icon className="h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">{themeOption.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {themeOption.description}
                  </span>
                </div>
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="h-4 w-4 text-orange-500" />
                </motion.div>
              )}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-current opacity-60" />
            <span>
              Currently: {actualTheme === "dark" ? "Dark" : "Light"} mode
            </span>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Simple toggle button version (cycles through themes)
export function SimpleThemeToggle() {
  const { theme, setTheme } = useTheme();

  const getNextTheme = (currentTheme: string) => {
    switch (currentTheme) {
      case "light":
        return "dark";
      case "dark":
        return "system";
      default:
        return "light";
    }
  };

  const toggleTheme = () => {
    setTheme(getNextTheme(theme) as "light" | "dark" | "system");
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return Sun;
      case "dark":
        return Moon;
      default:
        return Monitor;
    }
  };

  const Icon = getIcon();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 transition-all duration-300 group"
      title={`Current: ${theme}. Click to switch to ${getNextTheme(theme)}`}
    >
      <motion.div
        key={theme}
        initial={{ scale: 0.8, opacity: 0, rotate: -45 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Icon className="h-4 w-4 text-slate-600 dark:text-slate-300 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
