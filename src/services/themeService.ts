import { Theme, themes } from '@/types/theme';

const THEME_KEY = 'streak_selected_theme';
const DARK_MODE_KEY = 'streak_dark_mode';

export const themeService = {
  getAllThemes(): Theme[] {
    return themes;
  },

  getThemeById(id: string): Theme | undefined {
    return themes.find(t => t.id === id);
  },

  getCurrentTheme(): Theme {
    const savedThemeId = localStorage.getItem(THEME_KEY);
    return this.getThemeById(savedThemeId || 'default') || themes[0];
  },

  setTheme(themeId: string): void {
    const theme = this.getThemeById(themeId);
    if (!theme) return;

    localStorage.setItem(THEME_KEY, themeId);
    this.applyTheme(theme);
  },

  applyTheme(theme: Theme): void {
    const root = document.documentElement;
    
    // Apply light mode colors
    root.style.setProperty('--primary', theme.colors.primary);
    root.style.setProperty('--primary-foreground', theme.colors.primaryForeground);
    root.style.setProperty('--secondary', theme.colors.secondary);
    root.style.setProperty('--secondary-foreground', theme.colors.secondaryForeground);
    root.style.setProperty('--accent', theme.colors.accent);
    root.style.setProperty('--accent-foreground', theme.colors.accentForeground);
    root.style.setProperty('--success', theme.colors.success);
    root.style.setProperty('--success-foreground', theme.colors.successForeground);
  },

  // Dark mode management
  isDarkMode(): boolean {
    const saved = localStorage.getItem(DARK_MODE_KEY);
    if (saved !== null) {
      return saved === 'true';
    }
    // Default to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  },

  setDarkMode(isDark: boolean): void {
    localStorage.setItem(DARK_MODE_KEY, String(isDark));
    this.applyDarkMode(isDark);
  },

  toggleDarkMode(): boolean {
    const newMode = !this.isDarkMode();
    this.setDarkMode(newMode);
    return newMode;
  },

  applyDarkMode(isDark: boolean): void {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  },

  initializeTheme(): void {
    const theme = this.getCurrentTheme();
    this.applyTheme(theme);
    
    // Initialize dark mode
    const isDark = this.isDarkMode();
    this.applyDarkMode(isDark);
  },
};
