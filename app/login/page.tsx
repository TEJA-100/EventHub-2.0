"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const contentType = res.headers.get("content-type");
            let data: any = {};
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await res.json();
            } else {
                data = { error: 'An unexpected server error occurred. Please check network logs.' };
            }

            if (!res.ok) {
                throw new Error(data.error || 'Failed to login');
            }

            // Redirect based on role
            if (data.user.role === 'COLLEGE_ADMIN') {
                router.push('/college');
            } else if (data.user.role === 'SYSTEM_ADMIN') {
                router.push('/admin');
            } else {
                router.push('/explore');
            }

            // Note: In Next.js App Router, router.push does not trigger a hard reload. 
            // We might want to use router.refresh() if global state depends on it,
            // but for now, just navigating is fine.
            router.refresh();

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)' }}>
            {/* Background decoration */}
            <div style={{
                position: 'absolute', top: '20%', left: '30%', width: '40vw', height: '40vw',
                background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)',
                opacity: 0.1, filter: 'blur(80px)', zIndex: -1, borderRadius: '50%'
            }}></div>

            <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-8)', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Sign in to continue to EventHUB</p>
                </div>

                {error && (
                    <div style={{ padding: 'var(--space-3)', marginBottom: 'var(--space-4)', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem', fontWeight: 500 }}>Email Address</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="you@university.edu" style={{
                            width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                            color: 'var(--color-text)', outline: 'none', transition: 'border-color var(--transition-fast)'
                        }} />
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
                            <Link href="/forgot-password" style={{ fontSize: '0.875rem', color: 'var(--color-primary)' }}>Forgot Password?</Link>
                        </div>
                        <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" style={{
                            width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                            color: 'var(--color-text)', outline: 'none', transition: 'border-color var(--transition-fast)'
                        }} />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 'var(--space-4)', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    Don&apos;t have an account? <Link href="/signup" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
}
