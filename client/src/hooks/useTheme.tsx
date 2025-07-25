import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  hyperMode: boolean;
  toggleHyperMode: () => void;
  language: string;
  changeLanguage: (lang: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [hyperMode, setHyperMode] = useState(false);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedHyperMode = localStorage.getItem('hyperMode') === 'true';
    const savedLanguage = localStorage.getItem('language') || 'en';
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setHyperMode(savedHyperMode);
    setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark', 'hyper-mode');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Add hyper mode class if enabled
    if (hyperMode) {
      root.classList.add('hyper-mode');
    }
    
    // Update body classes for backward compatibility
    document.body.className = '';
    document.body.classList.add(`${theme}-mode`);
    if (hyperMode) {
      document.body.classList.add('hyper-mode');
    }
    
    localStorage.setItem('theme', theme);
    localStorage.setItem('hyperMode', hyperMode.toString());
  }, [theme, hyperMode]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const toggleHyperMode = () => {
    setHyperMode(prev => !prev);
  };

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      hyperMode,
      toggleHyperMode,
      language,
      changeLanguage
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
