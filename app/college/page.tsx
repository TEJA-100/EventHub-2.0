'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminAnalytics from '@/components/AdminAnalytics';

interface DashboardData {
    activeEvents: number;
    totalRegistrations: number;
    collegeName: string;
    events: {
        id: string;
        title: string;
        date: string;
        category: string;
        attendeeCount: number;
        capacity: number;
        status: string;
    }[];
}

export default function CollegeDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/college/stats')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="container" style={{ padding: 'var(--space-16) 0', textAlign: 'center', flex: 1 }}>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="container" style={{ padding: 'var(--space-16) 0', textAlign: 'center', flex: 1 }}>
                <h3>Unauthorized</h3>
                <p>You do not have permission to view this portal.</p>
                <Link href="/login" className="btn-primary" style={{ marginTop: 'var(--space-4)', display: 'inline-block' }}>Back to Login</Link>
            </div>
        );
    }

    return (
        <div className="container resp-flex-stack" style={{ padding: 'var(--space-8) var(--space-4)', flex: 1, display: 'flex', gap: 'var(--space-8)' }}>
            {/* Sidebar Navigation */}
            <aside style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', position: 'sticky', top: '100px', height: 'fit-content' }}>
                <div className="glass-panel" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: 'var(--space-2)', fontFamily: 'var(--font-display)' }}>
                        <span className="gradient-text">Admin</span> Portal
                    </div>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        <Link href="/college" style={{
                            padding: 'var(--space-3) var(--space-4)',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--color-primary)',
                            color: 'white',
                            fontWeight: 600,
                            boxShadow: 'var(--shadow-glow)'
                        }}>
                            📊 Overview
                        </Link>
                        <Link href="/college/create" style={{ padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)', transition: 'all var(--transition-fast)' }} className="hover-elevate">
                            ✨ Create Event
                        </Link>
                        <Link href="/college/registrations" style={{ padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)', transition: 'all var(--transition-fast)' }} className="hover-elevate">
                            👥 Registrations
                        </Link>
                        <Link href="/college/broadcasts" style={{ padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)', transition: 'all var(--transition-fast)' }} className="hover-elevate">
                            📢 Announcements
                        </Link>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-1)' }}>{data.collegeName} Dashboard</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Welcome back. Here&apos;s what&apos;s happening tonight.</p>
                    </div>
                    <Link href="/college/create" className="btn-primary">
                        + New Event
                    </Link>
                </div>

                {/* Quick Stats Grid */}
                <div className="resp-grid">
                    <div className="glass-panel" style={{ padding: 'var(--space-6)' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Active Events</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{data.activeEvents}</div>
                    </div>
                    <div className="glass-panel" style={{ padding: 'var(--space-6)' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Total Registrations</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-secondary)' }}>{data.totalRegistrations}</div>
                    </div>
                </div>

                {/* Recent Events List */}
                <div>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>Your Events</h2>
                    <div className="glass-panel table-container">
                        {data.events.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                                <thead>
                                    <tr style={{ background: 'var(--color-surface-hover)', borderBottom: '1px solid var(--color-border)' }}>
                                        <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Event Name</th>
                                        <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Date</th>
                                        <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Registrations</th>
                                        <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Status</th>
                                        <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.events.map(event => (
                                        <tr key={event.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: 'var(--space-4)' }}><Link href={`/events/${event.id}`} style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{event.title}</Link></td>
                                            <td style={{ padding: 'var(--space-4)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{new Date(event.date).toLocaleDateString()}</td>
                                            <td style={{ padding: 'var(--space-4)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                    <span style={{ fontWeight: 600 }}>{event.attendeeCount}</span>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>/ {event.capacity}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: 'var(--space-4)' }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    padding: '2px 8px',
                                                    borderRadius: 'var(--radius-full)',
                                                    background: event.status === 'Published' ? 'rgba(var(--hue-accent), 45%, 0.1)' : 'var(--color-surface)',
                                                    color: event.status === 'Published' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600
                                                }}>{event.status}</span>
                                            </td>
                                            <td style={{ padding: 'var(--space-4)' }}>
                                                <Link href={`/college/events/${event.id}/manage`} style={{ color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 600 }}>Manage</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                <p>You haven&apos;t hosted any events yet.</p>
                                <Link href="/college/create" style={{ color: 'var(--color-primary)', display: 'block', marginTop: 'var(--space-4)' }}>Create your first event</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Analytics Dashboard */}
                <div className="table-container">
                    <AdminAnalytics />
                </div>
            </main>
        </div>
    );
}
