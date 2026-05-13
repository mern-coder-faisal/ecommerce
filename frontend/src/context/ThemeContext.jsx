import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../utils/api';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem('ng_theme');
    const defaultTheme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(defaultTheme);
    
    // Fetch settings to get custom colors
    api.getSettings().then(res => {
      if (res) setSettings(res);
    }).catch(err => console.error('Failed to load settings in theme', err));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('ng_theme', theme);
    
    // Apply custom colors if they exist
    if (theme === 'light') {
      if (settings.lightPrimary) document.documentElement.style.setProperty('--accent', settings.lightPrimary);
      if (settings.lightBg) document.documentElement.style.setProperty('--bg', settings.lightBg);
    } else {
      if (settings.darkPrimary) document.documentElement.style.setProperty('--accent', settings.darkPrimary);
      if (settings.darkBg) document.documentElement.style.setProperty('--bg', settings.darkBg);
    }
  }, [theme, settings]);

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, settings }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
