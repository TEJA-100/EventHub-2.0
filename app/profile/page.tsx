'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Registration {
    id: string;
    status: string;
    event: {
        id: string;
        title: string;
        category: string;
        date: string;
        location: string;
    };
}

interface CollegeEvent {
    id: string;
    title: string;
    category: string;
    date: string;
    location: string;
    capacity: number;
    _count: { attendees: number };
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    college?: {
        name: string,
        events: CollegeEvent[],
        broadcasts: any[]
    };
    registrations: Registration[];
    broadcasts?: any[];
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                setUser(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="container" style={{ padding: 'var(--space-16) 0', textAlign: 'center', flex: 1 }}>
                <p>Loading your profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container" style={{ padding: 'var(--space-16) 0', textAlign: 'center', flex: 1 }}>
                <h3>Please log in to view your profile</h3>
                <Link href="/login" className="btn-primary" style={{ marginTop: 'var(--space-4)', display: 'inline-block' }}>Log In</Link>
            </div>
        );
    }

    const isAdmin = user.role === 'COLLEGE_ADMIN' || user.role === 'SYSTEM_ADMIN';
    const upcomingItems = isAdmin
        ? (user.college?.events || []).filter(e => new Date(e.date) >= new Date())
        : user.registrations.filter(r => new Date(r.event.date) >= new Date());

    const pastItems = isAdmin
        ? (user.college?.events || []).filter(e => new Date(e.date) < new Date())
        : user.registrations.filter(r => new Date(r.event.date) < new Date());

    const handleDownloadCertificate = async (registrationId: string) => {
        try {
            const res = await fetch(`/api/certificates?registrationId=${registrationId}`);
            if (!res.ok) {
                const error = await res.json();
                alert(error.error || 'Failed to download certificate');
                return;
            }
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Certificate_${registrationId.slice(0, 8)}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download error:', error);
            alert('An error occurred while downloading the certificate.');
        }
    };

    return (
        <div className="container" style={{ padding: 'var(--space-8) var(--space-4)', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>My Profile</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
                        {!isAdmin ? 'Manage your registrations and certificates.' : 'Your administrative account details.'}
                    </p>
                </div>
                <Link href="/profile/settings" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span>⚙️</span> Settings
                </Link>
            </div>

            <div className="resp-flex-stack" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: 'var(--space-8)', alignItems: 'start' }}>
                {/* Left Column: Profile Identity */}
                <div className="glass-panel" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{
                        width: '120px', height: '120px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '3rem', color: 'white', marginBottom: 'var(--space-4)'
                    }}>
                        {!isAdmin ? '👨‍🎓' : '💼'}
                    </div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-1)' }}>{user.firstName} {user.lastName}</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
                        {user.college?.name || 'Independent Member'} • {user.role.replace('_', ' ')}
                    </p>

                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', padding: 'var(--space-4) 0', borderTop: '1px solid var(--color-border)' }}>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>
                                {isAdmin ? (user.college?.events.length || 0) : user.registrations.length}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Events</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{upcomingItems.length}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Upcoming</div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Content Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)', minWidth: 0 }}>

                    {/* Notifications / Broadcasts */}
                    {user.broadcasts && user.broadcasts.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                    🔔 Campus Announcements
                                </h3>
                                <Link href="/notifications" className="nav-link" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                                    View All →
                                </Link>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                {user.broadcasts.map((msg: any) => (
                                    <div key={msg.id} className="glass-panel" style={{
                                        padding: 'var(--space-4)',
                                        borderLeft: `4px solid ${msg.type === 'URGENT' ? '#ef4444' : 'var(--color-primary)'}`,
                                        background: msg.type === 'URGENT' ? 'rgba(239, 68, 68, 0.05)' : 'var(--color-surface)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                                            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{msg.title}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                                {new Date(msg.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                                            {msg.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upcoming Events */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            {!isAdmin ? '🎟️ Upcoming Tickets' : '🗓️ My Managed Events'}
                        </h3>

                        {upcomingItems.length > 0 ? (
                            upcomingItems.map((item: any) => {
                                const event = isAdmin ? item : item.event;
                                const status = isAdmin ? (new Date(event.date) >= new Date() ? 'ACTIVE' : 'PAST') : item.status;
                                return (
                                    <div key={item.id} className="glass-panel hover-elevate resp-flex-stack" style={{ display: 'flex', overflow: 'hidden' }}>
                                        <div style={{ background: event.category === 'Tech' ? 'var(--color-primary)' : 'var(--color-secondary)', width: '8px', minHeight: '8px' }}></div>
                                        <div style={{ padding: 'var(--space-4) var(--space-6)', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                                            <div>
                                                <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', background: 'var(--color-bg)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>{event.category}</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-accent)', background: 'var(--color-bg)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>{status}</span>
                                                </div>
                                                <h4 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-1)' }}>{event.title}</h4>
                                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                                    {new Date(event.date).toLocaleDateString()} • {event.location}
                                                </p>
                                            </div>
                                            <div style={{ width: '100%', maxWidth: '200px' }}>
                                                {isAdmin ? (
                                                    <Link href={`/college/events/${event.id}/manage`} className="btn-primary" style={{ padding: 'var(--space-2) var(--space-4)', fontSize: '0.875rem', width: '100%', display: 'block', textAlign: 'center' }}>
                                                        Manage
                                                    </Link>
                                                ) : item.status === 'ATTENDED' ? (
                                                    <button
                                                        onClick={() => handleDownloadCertificate(item.id)}
                                                        className="btn-primary"
                                                        style={{ padding: 'var(--space-2) var(--space-4)', fontSize: '0.875rem', border: 'none', width: '100%' }}
                                                    >
                                                        Download Certificate
                                                    </button>
                                                ) : (
                                                    <Link href={`/explore/${event.id}`} className="btn-primary" style={{ padding: 'var(--space-2) var(--space-4)', fontSize: '0.875rem', width: '100%', display: 'block', textAlign: 'center' }}>
                                                        View Info
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="glass-panel" style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                <p>{!isAdmin ? 'No upcoming registrations.' : 'No upcoming events.'}</p>
                            </div>
                        )}
                    </div>

                    {/* Past Events & Certificates */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            📜 Past Events & Certificates
                        </h3>

                        {pastItems.length > 0 ? (
                            pastItems.map((item: any) => {
                                const event = isAdmin ? item : item.event;
                                const isAttended = !isAdmin && item.status === 'ATTENDED';
                                const isAbsent = !isAdmin && item.status === 'ABSENT';

                                return (
                                    <div key={item.id} className="glass-panel resp-flex-stack" style={{ display: 'flex', overflow: 'hidden', opacity: 0.8 }}>
                                        <div style={{ background: 'var(--color-text-muted)', width: '8px', minHeight: '8px' }}></div>
                                        <div style={{ padding: 'var(--space-4) var(--space-6)', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                                            <div>
                                                <h4 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-1)' }}>{event.title}</h4>
                                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                                    {new Date(event.date).toLocaleDateString()} • {isAttended ? '✅ Attended' : isAbsent ? '❌ Absent' : 'Completed'}
                                                </p>
                                            </div>

                                            <div style={{ width: '100%', maxWidth: '200px' }}>
                                                {isAttended ? (
                                                    <button
                                                        onClick={() => handleDownloadCertificate(item.id)}
                                                        className="btn-primary"
                                                        style={{ padding: 'var(--space-2) var(--space-4)', fontSize: '0.875rem', border: 'none', width: '100%' }}
                                                    >
                                                        Download Certificate
                                                    </button>
                                                ) : isAbsent ? (
                                                    <span style={{ fontSize: '0.875rem', color: '#ef4444', fontWeight: 600 }}>No Certificate (Absent)</span>
                                                ) : (
                                                    <Link href={`/explore/${event.id}`} className="btn-primary" style={{ padding: 'var(--space-2) var(--space-4)', fontSize: '0.875rem', width: '100%', display: 'block', textAlign: 'center' }}>
                                                        View Info
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="glass-panel" style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                <p>No past events found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
