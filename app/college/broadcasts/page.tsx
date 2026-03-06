'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BroadcastsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'ANNOUNCEMENT'
    });
    const router = useRouter();

    useEffect(() => {
        // Fetch college events to show in info (optional, but keep UI clean)
        fetch('/api/auth/me')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && data.college) {
                    setEvents(data.college.events || []);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        try {
            const res = await fetch('/api/broadcasts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Broadcast sent successfully! 🚀');
                setFormData({ title: '', message: '', type: 'ANNOUNCEMENT' });
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to send broadcast');
            }
        } catch (err) {
            alert('An error occurred. Please try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="container" style={{ padding: 'var(--space-8) var(--space-4)', flex: 1, display: 'flex', gap: 'var(--space-8)' }}>
            {/* Sidebar Navigation */}
            <aside style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="glass-panel" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: 'var(--space-2)', color: 'var(--color-primary)' }}>
                        Admin Portal
                    </div>
                    <Link href="/college" className="sidebar-link">Dashboard Overview</Link>
                    <Link href="/college/create" className="sidebar-link">Create Event</Link>
                    <Link href="/college/registrations" className="sidebar-link">Registrations</Link>
                    <Link href="/college/broadcasts" className="sidebar-link active">Announcements</Link>
                </div>
            </aside>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-1)' }}>Broadcast Announcements</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Send mass updates directly to all students of your college.</p>
                </div>

                <div className="glass-panel" style={{ padding: 'var(--space-8)' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>New Broadcast</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem', fontWeight: 500 }}>Broadcast Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                style={inputStyle}
                            >
                                <option value="ANNOUNCEMENT">📢 General Announcement</option>
                                <option value="URGENT">🚨 Urgent Alert</option>
                                <option value="UPDATE">🔄 Event Update</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem', fontWeight: 500 }}>Subject Line *</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Venue Change for Hackathon"
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem', fontWeight: 500 }}>Message Content *</label>
                            <textarea
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Write your announcement..."
                                rows={6}
                                style={{ ...inputStyle, resize: 'vertical' }}
                            ></textarea>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                            <button
                                type="submit"
                                disabled={sending}
                                className="btn-primary"
                                style={{ flex: 1, height: '50px', fontSize: '1.1rem' }}
                            >
                                {sending ? 'Sending...' : 'Send Broadcast Now 🚀'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sent History */}
                <div>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>Sent History</h2>
                    <div className="glass-panel" style={{ padding: 'var(--space-4)' }}>
                        <RecentBroadcastsList key={sending ? 'sending' : 'idle'} />
                    </div>
                </div>

                <style jsx>{`
                    .sidebar-link {
                        padding: var(--space-2) var(--space-4);
                        border-radius: var(--radius-md);
                        color: var(--color-text-muted);
                        transition: all 0.2s;
                    }
                    .sidebar-link:hover {
                        background: var(--color-surface-hover);
                        color: var(--color-text);
                    }
                    .sidebar-link.active {
                        background: var(--color-surface-hover);
                        color: var(--color-text);
                        font-weight: 600;
                    }
                `}</style>
            </main>
        </div>
    );
}

function RecentBroadcastsList() {
    const [broadcasts, setBroadcasts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/broadcasts')
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                setBroadcasts(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading sent history...</p>;
    if (broadcasts.length === 0) return <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-4)' }}>No broadcasts sent yet.</p>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {broadcasts.map(b => (
                <div key={b.id} style={{ padding: 'var(--space-3)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{b.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{new Date(b.createdAt).toLocaleString()}</div>
                    </div>
                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'var(--color-surface-hover)' }}>{b.type}</span>
                </div>
            ))}
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: 'var(--space-3)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    background: 'var(--color-bg)',
    color: 'var(--color-text)',
    outline: 'none'
};
