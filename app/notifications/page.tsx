'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Broadcast {
    id: string;
    title: string;
    message: string;
    type: string;
    createdAt: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Broadcast[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/broadcasts')
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                setNotifications(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'URGENT': return '🚨';
            case 'UPDATE': return '🔄';
            default: return '📢';
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: 'var(--space-16) 0', textAlign: 'center', flex: 1 }}>
                <p>Loading notifications...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: 'var(--space-8) var(--space-4)', flex: 1 }}>
            <div style={{ marginBottom: 'var(--space-8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>Campus Notifications</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>Stay updated with the latest announcements from your college.</p>
                </div>
                <Link href="/profile" className="btn-secondary" style={{ padding: '10px 20px' }}>
                    Back to Profile
                </Link>
            </div>

            {notifications.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {notifications.map((msg) => (
                        <div key={msg.id} className="glass-panel hover-elevate" style={{
                            padding: 'var(--space-6)',
                            borderLeft: `5px solid ${msg.type === 'URGENT' ? '#ef4444' : 'var(--color-primary)'}`,
                            background: msg.type === 'URGENT' ? 'rgba(239, 68, 68, 0.05)' : 'var(--color-surface)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                    <span style={{ fontSize: '1.5rem' }}>{getIcon(msg.type)}</span>
                                    <span style={{ fontWeight: 800, fontSize: '1.25rem', color: msg.type === 'URGENT' ? '#ef4444' : 'inherit' }}>{msg.title}</span>
                                </div>
                                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                    {new Date(msg.createdAt).toLocaleString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                            <p style={{
                                fontSize: '1rem',
                                color: 'var(--color-text)',
                                lineHeight: 1.6,
                                whiteSpace: 'pre-wrap',
                                marginLeft: 'calc(1.5rem + var(--space-2))'
                            }}>
                                {msg.message}
                            </p>
                            <div style={{ marginTop: 'var(--space-4)', textAlign: 'right' }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    padding: '2px 10px',
                                    borderRadius: 'var(--radius-full)',
                                    background: msg.type === 'URGENT' ? 'rgba(239,68,68,0.2)' : 'var(--color-surface-hover)',
                                    color: msg.type === 'URGENT' ? '#ef4444' : 'var(--color-primary)'
                                }}>
                                    {msg.type}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-panel" style={{ padding: 'var(--space-16)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>📭</div>
                    <h3>No notifications yet</h3>
                    <p>When administrators send updates to your college, they will appear here.</p>
                </div>
            )}
        </div>
    );
}
