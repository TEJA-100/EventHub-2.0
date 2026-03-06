'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const t = searchParams.get('token');
        if (t) setToken(t);
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            });
            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Password reset successfully! Redirecting to login...' });
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setMessage({ type: 'error', text: data.error || 'Reset failed.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Connection failed.' });
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#ef4444', marginBottom: 'var(--space-4)' }}>Invalid or missing token.</p>
                <Link href="/login" className="btn-secondary">Back to Login</Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem', fontWeight: 500 }}>New Password</label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                        width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                        color: 'var(--color-text)', outline: 'none'
                    }}
                />
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem', fontWeight: 500 }}>Confirm New Password</label>
                <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                        width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                        color: 'var(--color-text)', outline: 'none'
                    }}
                />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 'var(--space-2)', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            {message.text && (
                <div style={{
                    marginTop: 'var(--space-4)',
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    background: message.type === 'success' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: message.type === 'success' ? '#4ade80' : '#ef4444',
                    fontSize: '0.875rem',
                    textAlign: 'center'
                }}>
                    {message.text}
                </div>
            )}
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)' }}>
            <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-8)' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>Reset Password</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Set your new secure password</p>
                </div>

                <Suspense fallback={<p>Loading...</p>}>
                    <ResetPasswordForm />
                </Suspense>

                <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
                    <Link href="/login" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Back to Login</Link>
                </div>
            </div>
        </div>
    );
}
