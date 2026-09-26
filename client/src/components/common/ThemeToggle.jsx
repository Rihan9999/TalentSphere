import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle Light and Dark Mode"
      className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-5 h-5 text-amber-400 transform rotate-0 transition-transform duration-500 hover:scale-110" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-600 transform rotate-0 transition-transform duration-500 hover:scale-110" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
