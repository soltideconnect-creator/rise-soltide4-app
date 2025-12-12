import React, { useEffect, useState } from "react";
import { Toaster as Sonner, ToasterProps } from "sonner";
import { themeService } from "@/services/themeService";

const Toaster = ({ ...props }: ToasterProps) => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">(
    themeService.isDarkMode() ? "dark" : "light"
  );

  useEffect(() => {
    // Listen for theme changes
    const updateTheme = () => {
      setTheme(themeService.isDarkMode() ? "dark" : "light");
    };

    // Update theme on mount
    updateTheme();

    // Listen for storage changes (theme changes in other tabs)
    window.addEventListener("storage", updateTheme);
    
    return () => {
      window.removeEventListener("storage", updateTheme);
    };
  }, []);

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
