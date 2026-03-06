"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        accountType: 'student',
        collegeName: '',
        password: '',
        adminSecret: '',
    });
    const [showAdminSecretModal, setShowAdminSecretModal] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitData = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.error === 'Invalid or missing Admin Secret Password') {
                    setShowAdminSecretModal(true);
                }
                throw new Error(data.error || 'Failed to sign up');
            }

            // Redirect to login on success
            setShowAdminSecretModal(false);
            router.push('/login?registered=true');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.accountType === 'college' && !formData.adminSecret && !showAdminSecretModal) {
            setShowAdminSecretModal(true);
            return;
        }

        await submitData();
    };

    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)' }}>
            {/* Background decoration */}
            <div style={{
                position: 'absolute', top: '10%', right: '20%', width: '50vw', height: '50vw',
                background: 'radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)',
                opacity: 0.1, filter: 'blur(100px)', zIndex: -1, borderRadius: '50%'
            }}></div>

            <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: 'var(--space-8)', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>Create an Account</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Join your centralized campus ecosystem</p>
                </div>

                {error && (
                    <div style={{ padding: 'var(--space-3)', marginBottom: 'var(--space-4)', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem', fontWeight: 500 }}>First Name</label>
                            <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} placeholder="Jane" style={{
                                width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                                color: 'var(--color-text)', outline: 'none'
                            }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem', fontWeight: 500 }}>Last Name</label>
                            <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} placeholder="Doe" style={{
                                width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                                color: 'var(--color-text)', outline: 'none'
                            }} />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem', fontWeight: 500 }}>University/College Email</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="you@university.edu" style={{
                            width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                            color: 'var(--color-text)', outline: 'none'
                        }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem', fontWeight: 500 }}>Account Type</label>
                        <select name="accountType" value={formData.accountType} onChange={handleChange} style={{
                            width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                            color: 'var(--color-text)', outline: 'none', appearance: 'none'
                        }}>
                            <option value="student">Student (Explorer)</option>
                            <option value="college">College Admin (Organizer)</option>
                        </select>
                    </div>

                    <div className="animate-fade-in">
                        <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem', fontWeight: 500 }}>University/Institution Name</label>
                        <input type="text" name="collegeName" required value={formData.collegeName} onChange={handleChange} placeholder="e.g. State University" style={{
                            width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                            color: 'var(--color-text)', outline: 'none'
                        }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
                        <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="Create a strong password" style={{
                            width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                            color: 'var(--color-text)', outline: 'none'
                        }} />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 'var(--space-4)', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Creating...' : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    Already have an account? <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign in</Link>
                </p>
            </div>
            {showAdminSecretModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div className="glass-panel" style={{ padding: 'var(--space-6)', width: '100%', maxWidth: '400px' }}>
                        <h2 style={{ marginBottom: 'var(--space-2)' }}>Admin Verification</h2>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)', fontSize: '0.875rem' }}>
                            Please enter the secret password to register as a College Admin.
                        </p>
                        <input
                            type="password"
                            name="adminSecret"
                            value={formData.adminSecret}
                            onChange={handleChange}
                            placeholder="Secret Password"
                            required
                            style={{
                                width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                                color: 'var(--color-text)', outline: 'none', marginBottom: 'var(--space-4)'
                            }}
                        />
                        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                            <button className="btn-secondary" type="button" onClick={() => setShowAdminSecretModal(false)} style={{ flex: 1, padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', color: 'var(--color-text)', cursor: 'pointer' }}>Cancel</button>
                            <button className="btn-primary" type="button" onClick={submitData} disabled={loading} style={{ flex: 1 }}>
                                {loading ? 'Verifying...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
