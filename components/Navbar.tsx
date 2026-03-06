"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

interface User {
    id: string;
    firstName: string;
    lastName?: string;
    role: string;
}

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = () => {
        fetch('/api/auth/me')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                setUser(data);
                setLoading(false);
            })
            .catch(() => {
                setUser(null);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUser();
    }, [pathname]); // Re-fetch when navigating to ensure sync

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        router.push('/login');
        router.refresh();
    };

    const getInitials = (firstName: string, lastName?: string) => {
        return (firstName[0] + (lastName ? lastName[0] : '')).toUpperCase();
    };

    const getAvatarColor = (name: string) => {
        const colors = [
            '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="navbar glass-panel">
            <div className="container navbar-content">
                <Link href="/" className="navbar-brand">
                    EH<span className="gradient-text">EventHUB</span>
                </Link>

                <nav className={`navbar-links ${isMenuOpen ? 'mobile-open' : ''}`}>
                    <Link href="/explore" className="nav-link" onClick={() => setIsMenuOpen(false)}>Explore</Link>
                    {user && (
                        <Link href="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                    )}
                    {user && (user.role === 'COLLEGE_ADMIN' || user.role === 'SYSTEM_ADMIN') && (
                        <Link href="/college" className="nav-link" onClick={() => setIsMenuOpen(false)}>Management</Link>
                    )}
                    <Link href="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About</Link>
                </nav>

                <div className="navbar-actions">
                    <ThemeToggle />
                    {!loading && (
                        user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                    <Link
                                        href="/notifications"
                                        className="nav-link notification-bell"
                                        style={{
                                            padding: '8px',
                                            borderRadius: '50%',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            lineHeight: 1,
                                            fontSize: '1.25rem',
                                            position: 'relative',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            marginRight: 'var(--space-2)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)'
                                        }}
                                        title="Notifications"
                                    >
                                        🔔
                                        <span style={{
                                            position: 'absolute',
                                            top: '6px',
                                            right: '6px',
                                            width: '8px',
                                            height: '8px',
                                            background: 'var(--color-accent)',
                                            borderRadius: '50%',
                                            border: '2px solid var(--color-bg)',
                                            display: 'block'
                                        }}></span>
                                    </Link>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: getAvatarColor(user.firstName),
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}>
                                            {getInitials(user.firstName, user.lastName)}
                                        </div>
                                        <span className="user-greeting" style={{ fontWeight: 600 }}>
                                            {user.firstName}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={handleLogout} className="btn-secondary logout-btn" style={{ padding: '4px 12px', fontSize: '0.8125rem' }}>
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link href="/login" className="nav-link login-link" style={{ fontSize: '0.875rem' }}>Log In</Link>
                                <Link href="/signup" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>Get Started</Link>
                            </div>
                        )
                    )}

                    <button
                        className="mobile-menu-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>
        </header>
    );
}
