export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    success: string;
    successForeground: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Classic indigo and orange',
    colors: {
      primary: '250 84% 67%', // #5E5CE6
      primaryForeground: '0 0% 100%',
      secondary: '240 5% 96%',
      secondaryForeground: '240 6% 10%',
      accent: '25 95% 53%', // #FF9500
      accentForeground: '0 0% 100%',
      success: '142 71% 45%',
      successForeground: '0 0% 100%',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Calm blues and teals',
    colors: {
      primary: '199 89% 48%', // #0EA5E9
      primaryForeground: '0 0% 100%',
      secondary: '210 40% 96%',
      secondaryForeground: '222 47% 11%',
      accent: '173 80% 40%', // #14B8A6
      accentForeground: '0 0% 100%',
      success: '160 84% 39%',
      successForeground: '0 0% 100%',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural greens and earth tones',
    colors: {
      primary: '142 76% 36%', // #16A34A
      primaryForeground: '0 0% 100%',
      secondary: '120 20% 95%',
      secondaryForeground: '120 10% 10%',
      accent: '84 81% 44%', // #84CC16
      accentForeground: '0 0% 100%',
      success: '142 71% 45%',
      successForeground: '0 0% 100%',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm oranges and pinks',
    colors: {
      primary: '24 95% 53%', // #F97316
      primaryForeground: '0 0% 100%',
      secondary: '30 40% 96%',
      secondaryForeground: '30 10% 10%',
      accent: '330 81% 60%', // #F472B6
      accentForeground: '0 0% 100%',
      success: '142 71% 45%',
      successForeground: '0 0% 100%',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep purples and blues',
    colors: {
      primary: '258 90% 66%', // #8B5CF6
      primaryForeground: '0 0% 100%',
      secondary: '240 10% 96%',
      secondaryForeground: '240 10% 10%',
      accent: '217 91% 60%', // #3B82F6
      accentForeground: '0 0% 100%',
      success: '142 71% 45%',
      successForeground: '0 0% 100%',
    },
  },
  {
    id: 'cherry',
    name: 'Cherry',
    description: 'Bold reds and pinks',
    colors: {
      primary: '0 84% 60%', // #EF4444
      primaryForeground: '0 0% 100%',
      secondary: '0 20% 96%',
      secondaryForeground: '0 10% 10%',
      accent: '340 82% 52%', // #EC4899
      accentForeground: '0 0% 100%',
      success: '142 71% 45%',
      successForeground: '0 0% 100%',
    },
  },
];
