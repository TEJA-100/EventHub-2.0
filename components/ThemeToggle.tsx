'use client';

import { useTheme } from './ThemeContext';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle Theme"
            style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
                transition: 'all var(--transition-fast)',
                cursor: 'pointer',
                fontSize: '1.25rem',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div
                style={{
                    transform: theme === 'light' ? 'translateY(0)' : 'translateY(40px)',
                    transition: 'transform var(--transition-normal) ease-in-out',
                    position: 'absolute'
                }}
            >
                ☀️
            </div>
            <div
                style={{
                    transform: theme === 'dark' ? 'translateY(0)' : 'translateY(-40px)',
                    transition: 'transform var(--transition-normal) ease-in-out',
                    position: 'absolute'
                }}
            >
                🌙
            </div>
        </button>
    );
}
