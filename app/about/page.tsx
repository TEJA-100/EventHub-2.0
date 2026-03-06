'use client';

import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="container" style={{ padding: 'var(--space-16) var(--space-4)', flex: 1 }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: 'var(--space-6)', fontWeight: 800 }}>
                    About EH <span className="gradient-text">EventHUB</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-12)' }}>
                    EventHUB is the premier campus engagement platform designed to bridge the gap between students and university organizers.
                    We believe that university life is more than just academics—it's about the connections, experiences, and memories you build.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-8)', textAlign: 'left' }}>
                    <div className="glass-panel" style={{ padding: 'var(--space-6)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: 'var(--space-4)' }}>🚀</div>
                        <h3 style={{ marginBottom: 'var(--space-2)' }}>Our Mission</h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                            To empower student communities by providing a seamless, modern platform for event discovery and organization.
                        </p>
                    </div>
                    <div className="glass-panel" style={{ padding: 'var(--space-6)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: 'var(--space-4)' }}>✨</div>
                        <h3 style={{ marginBottom: 'var(--space-2)' }}>Premium Experience</h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                            We prioritize aesthetics and usability, ensuring that finding your next event is as enjoyable as attending it.
                        </p>
                    </div>
                    <div className="glass-panel" style={{ padding: 'var(--space-6)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: 'var(--space-4)' }}>🛡️</div>
                        <h3 style={{ marginBottom: 'var(--space-2)' }}>Secure & Inclusive</h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                            Built with enterprise-grade security and role-based access to keep our campus communities safe and organized.
                        </p>
                    </div>
                </div>

                <div style={{ marginTop: 'var(--space-16)' }}>
                    <h2 style={{ marginBottom: 'var(--space-6)' }}>Join the Pulse of Campus Life</h2>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
                        <Link href="/explore" className="btn-primary" style={{ padding: 'var(--space-3) var(--space-8)' }}>Explore Events</Link>
                        <Link href="/signup" className="btn-secondary" style={{ padding: 'var(--space-3) var(--space-8)' }}>Get Started</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
