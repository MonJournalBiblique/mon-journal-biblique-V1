import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeName = 
  | 'purple'
  | 'orange'
  | 'green'
  | 'orange2'
  | 'bordeaux'
  | 'blue'
  | 'yellow'
  | 'neonBlue'
  | 'bordeauxGray'
  | 'blackAndWhite';

export const themes = {
  purple: {
    primary100: '#6c35de',
    primary200: '#a364ff',
    primary300: '#ffc7ff',
    accent100: '#cb80ff',
    accent200: '#373737',
    text100: '#ffffff',
    text200: '#e0e0e0',
    bg100: '#241b35',
    bg200: '#342a45',
    bg300: '#4d425f',
  },
  orange: {
    primary100: '#2C3A4F',
    primary200: '#56647b',
    primary300: '#b4c2dc',
    accent100: '#FF4D4D',
    accent200: '#ffecda',
    text100: '#FFFFFF',
    text200: '#e0e0e0',
    bg100: '#1A1F2B',
    bg200: '#292e3b',
    bg300: '#414654',
  },
  green: {
    primary100: '#2E8B57',
    primary200: '#61bc84',
    primary300: '#c6ffe6',
    accent100: '#8FBC8F',
    accent200: '#345e37',
    text100: '#FFFFFF',
    text200: '#e0e0e0',
    bg100: '#1E1E1E',
    bg200: '#2d2d2d',
    bg300: '#454545',
  },
  orange2: {
    primary100: '#FF6600',
    primary200: '#ff983f',
    primary300: '#ffffa1',
    accent100: '#F5F5F5',
    accent200: '#929292',
    text100: '#1d1f21',
    text200: '#444648',
    bg100: '#ffffff',
    bg200: '#f5f5f5',
    bg300: '#cccccc',
  },
  bordeaux: {
    primary100: '#bb2649',
    primary200: '#f35d74',
    primary300: '#ffc3d4',
    accent100: '#ffadad',
    accent200: '#ffd6a5',
    text100: '#4b4f5d',
    text200: '#6a738b',
    bg100: '#ffffff',
    bg200: '#f5f5f5',
    bg300: '#cccccc',
  },
  blue: {
    primary100: '#0077C2',
    primary200: '#59a5f5',
    primary300: '#c8ffff',
    accent100: '#00BFFF',
    accent200: '#00619a',
    text100: '#333333',
    text200: '#5c5c5c',
    bg100: '#FFFFFF',
    bg200: '#f5f5f5',
    bg300: '#cccccc',
  },
  yellow: {
    primary100: '#FFD700',
    primary200: '#ddb900',
    primary300: '#917800',
    accent100: '#c49216',
    accent200: '#5e3b00',
    text100: '#dcdcdc',
    text200: '#929292',
    bg100: '#1E1E1E',
    bg200: '#2d2d2d',
    bg300: '#454545',
  },
  neonBlue: {
    primary100: '#FF6B6B',
    primary200: '#dd4d51',
    primary300: '#8f001a',
    accent100: '#00FFFF',
    accent200: '#00999b',
    text100: '#FFFFFF',
    text200: '#e0e0e0',
    bg100: '#0F0F0F',
    bg200: '#1f1f1f',
    bg300: '#353535',
  },
  bordeauxGray: {
    primary100: '#8B0000',
    primary200: '#c2402a',
    primary300: '#feded3',
    accent100: '#FF6347',
    accent200: '#8d0000',
    text100: '#000000',
    text200: '#565656',
    bg100: '#E9E9E9',
    bg200: '#dfdfdf',
    bg300: '#b7b7b7',
  },
  blackAndWhite: {
    primary100: '#FFFFFF',
    primary200: '#e0e0e0',
    primary300: '#9b9b9b',
    accent100: '#7F7F7F',
    accent200: '#ffffff',
    text100: '#FFFFFF',
    text200: '#777777',
    bg100: '#000000',
    bg200: '#161616',
    bg300: '#2c2c2c',
  },
};

// Helper function to convert hex to HSL
const hexToHSL = (hex: string) => {
  // Remove the # if present
  hex = hex.replace('#', '');

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Find max and min values
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    
    h /= 6;
  }

  // Convert to degrees and percentages
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
};

interface ThemeState {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

export const useSiteTheme = create<ThemeState>()(
  persist(
    (set) => ({
      currentTheme: 'purple',
      setTheme: (theme) => {
        set({ currentTheme: theme });
        const selectedTheme = themes[theme];
        
        // Update CSS variables with HSL values
        document.documentElement.style.setProperty('--background', hexToHSL(selectedTheme.bg100));
        document.documentElement.style.setProperty('--foreground', hexToHSL(selectedTheme.text100));
        document.documentElement.style.setProperty('--card', hexToHSL(selectedTheme.bg200));
        document.documentElement.style.setProperty('--card-foreground', hexToHSL(selectedTheme.text100));
        document.documentElement.style.setProperty('--popover', hexToHSL(selectedTheme.bg200));
        document.documentElement.style.setProperty('--popover-foreground', hexToHSL(selectedTheme.text100));
        document.documentElement.style.setProperty('--primary', hexToHSL(selectedTheme.primary100));
        document.documentElement.style.setProperty('--primary-foreground', hexToHSL(selectedTheme.text100));
        document.documentElement.style.setProperty('--secondary', hexToHSL(selectedTheme.bg200));
        document.documentElement.style.setProperty('--secondary-foreground', hexToHSL(selectedTheme.text100));
        document.documentElement.style.setProperty('--muted', hexToHSL(selectedTheme.bg300));
        document.documentElement.style.setProperty('--muted-foreground', hexToHSL(selectedTheme.text200));
        document.documentElement.style.setProperty('--accent', hexToHSL(selectedTheme.accent100));
        document.documentElement.style.setProperty('--accent-foreground', hexToHSL(selectedTheme.text100));
        document.documentElement.style.setProperty('--border', hexToHSL(selectedTheme.bg300));
        document.documentElement.style.setProperty('--input', hexToHSL(selectedTheme.bg200));
        document.documentElement.style.setProperty('--ring', hexToHSL(selectedTheme.primary200));
      },
    }),
    {
      name: 'site-theme',
      onRehydrateStorage: () => (state) => {
        // Apply theme when storage is rehydrated
        if (state) {
          state.setTheme(state.currentTheme);
        }
      },
    }
  )
);