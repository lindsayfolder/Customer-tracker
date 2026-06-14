import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Theme {
  bg: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  codeEditor: string;
  codeText: string;
  tabBar: string;
  inputBg: string;
}

const lightTheme: Theme = {
  bg: '#f8f9fa',
  card: '#ffffff',
  text: '#1a1a2e',
  subtext: '#666666',
  border: '#eeeeee',
  codeEditor: '#1e1e2e',
  codeText: '#cdd6f4',
  tabBar: '#ffffff',
  inputBg: '#f0f0f0',
};

const darkTheme: Theme = {
  bg: '#0f0f1a',
  card: '#1e1e2e',
  text: '#cdd6f4',
  subtext: '#888888',
  border: '#2a2a3e',
  codeEditor: '#11111b',
  codeText: '#cdd6f4',
  tabBar: '#1e1e2e',
  inputBg: '#2a2a3e',
};

const STORAGE_KEY = '@mit_cs_dark_mode';

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value === 'true') {
        setIsDark(true);
      }
    });
  }, []);

  function toggleTheme() {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
