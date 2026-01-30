import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = "" }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme === 'dark'
                    ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                } ${className}`}
            aria-label="Toggle Dark Mode"
        >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
};

export default ThemeToggle;
