'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Footer() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => setIsLoggedIn(res.ok))
            .catch(() => setIsLoggedIn(false));
    }, []);

    return (
        <footer style={{
            borderTop: '1px solid var(--color-border)',
            padding: 'var(--space-12) var(--space-4) var(--space-6) var(--space-4)',
            marginTop: 'auto',
            background: 'var(--color-surface)',
        }}>
            <div className="container" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--space-8)',
                marginBottom: 'var(--space-12)'
            }}>
                <div>
                    <div style={{ fontWeight: 800, fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-4)' }}>
                        EH <span className="gradient-text">EventHub</span>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        The ultimate campus engagement platform.
                    </p>
                </div>

                <div>
                    <h4 style={{ marginBottom: 'var(--space-4)' }}>Navigation</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        <li><Link href="/explore" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Explore Events</Link></li>
                        {isLoggedIn && <li><Link href="/profile" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>My Profile</Link></li>}
                        <li><Link href="/about" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>About Us</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ marginBottom: 'var(--space-4)' }}>Portals</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        <li><Link href="/college" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Admin Dashboard</Link></li>
                        {!isLoggedIn && <li><Link href="/login" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Member Login</Link></li>}
                    </ul>
                </div>

                <div>
                    <h4 style={{ marginBottom: 'var(--space-4)' }}>Legal</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        <li><Link href="#" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Privacy Policy</Link></li>
                        <li><Link href="#" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Terms of Service</Link></li>
                    </ul>
                </div>
            </div>

            <div className="container" style={{
                borderTop: '1px solid var(--color-border)',
                paddingTop: 'var(--space-6)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 'var(--space-4)',
                color: 'var(--color-text-muted)',
                fontSize: '0.875rem'
            }}>
                <p>&copy; {new Date().getFullYear()} EventHUB. All rights reserved.</p>
                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                    <span>Campus Engagement Platform</span>
                </div>
            </div>
        </footer>
    );
}
