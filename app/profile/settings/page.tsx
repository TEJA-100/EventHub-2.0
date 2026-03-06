'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const router = useRouter();

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) setFormData({ firstName: data.firstName, lastName: data.lastName, email: data.email });
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/auth/me', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setTimeout(() => router.push('/profile'), 1500);
            } else {
                setMessage({ type: 'error', text: data.error || 'Update failed' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred' });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm('Are you absolutely sure? This action cannot be undone and all your data will be permanently deleted.')) {
            return;
        }

        try {
            const res = await fetch('/api/auth/delete-account', {
                method: 'DELETE'
            });

            if (res.ok) {
                alert('Your account has been deleted.');
                router.push('/login');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete account');
            }
        } catch (error) {
            alert('An error occurred during account deletion');
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: 'var(--space-16) 0', textAlign: 'center', flex: 1 }}>
                <p>Loading setting parameters...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: 'var(--space-8) var(--space-4)', flex: 1 }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <Link href="/profile" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                    marginBottom: 'var(--space-6)',
                    transition: 'color var(--transition-fast)'
                }}>
                    ← Back to Profile
                </Link>

                <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-8)' }}>Settings</h1>

                <div className="glass-panel" style={{ padding: 'var(--space-8)' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-6)' }}>Edit Personal Information</h2>

                    {message.text && (
                        <div style={{
                            padding: 'var(--space-4)',
                            borderRadius: 'var(--radius-md)',
                            background: message.type === 'success' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                            color: message.type === 'success' ? '#4ade80' : '#f87171',
                            marginBottom: 'var(--space-6)',
                            fontWeight: 600,
                            textAlign: 'center'
                        }}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>First Name</label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: 'var(--space-3) var(--space-4)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border)',
                                        background: 'var(--color-bg)',
                                        color: 'var(--color-text)',
                                        outline: 'none'
                                    }}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Last Name</label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: 'var(--space-3) var(--space-4)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border)',
                                        background: 'var(--color-bg)',
                                        color: 'var(--color-text)',
                                        outline: 'none'
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Email Address</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: 'var(--space-3) var(--space-4)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)',
                                    background: 'var(--color-bg)',
                                    color: 'var(--color-text)',
                                    outline: 'none'
                                }}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={saving}
                            style={{ padding: 'var(--space-4)', fontSize: '1rem', marginTop: 'var(--space-4)', width: '100%' }}
                        >
                            {saving ? 'Saving Changes...' : 'Save Profile Changes'}
                        </button>
                    </form>
                </div>

                <div className="glass-panel" style={{ padding: 'var(--space-8)', marginTop: 'var(--space-6)', border: '1px solid rgba(248, 113, 113, 0.2)' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-4)', color: '#f87171' }}>Danger Zone</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>Permanently delete your account and all associated event data.</p>
                    <button
                        className="btn-secondary"
                        style={{ color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.3)', width: '100%', cursor: 'pointer' }}
                        onClick={handleDeleteAccount}
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}
