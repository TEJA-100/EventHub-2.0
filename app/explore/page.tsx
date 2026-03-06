'use client';

import { useEffect, useState } from 'react';
import EventCard, { EventProps } from '@/components/EventCard';

const CATEGORIES = ['All', 'Tech', 'Cultural', 'Sports', 'Arts'];

export default function ExplorePage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('/api/events')
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                setEvents(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredEvents = events.filter(event => {
        const matchesCategory = activeTab === 'All' || event.category === activeTab;
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (event.college?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <div className="container" style={{ padding: 'var(--space-16) 0', textAlign: 'center', flex: 1 }}>
                <p>Loading events...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: 'var(--space-8) var(--space-4)', flex: 1 }}>
            <div style={{ marginBottom: 'var(--space-8)' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>Discover Events</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>Find your next big opportunity on campus.</p>
            </div>

            {/* Search and Filter Bar */}
            <div className="glass-panel" style={{
                padding: 'var(--space-4)',
                marginBottom: 'var(--space-8)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
                position: 'sticky',
                top: '80px',
                zIndex: 10
            }}>
                <input
                    type="text"
                    placeholder="Search by event name or organizer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%',
                        padding: 'var(--space-3) var(--space-4)',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-bg)',
                        color: 'var(--color-text)',
                        outline: 'none',
                        fontSize: '1rem'
                    }}
                />

                <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', paddingBottom: 'var(--space-2)' }} className="hide-scrollbar">
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveTab(category)}
                            style={{
                                padding: 'var(--space-2) var(--space-4)',
                                borderRadius: 'var(--radius-full)',
                                border: '1px solid',
                                borderColor: activeTab === category ? 'var(--color-primary)' : 'var(--color-border)',
                                background: activeTab === category ? 'rgba(var(--hue-primary), 80%, 50%, 0.1)' : 'transparent',
                                color: activeTab === category ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                fontWeight: activeTab === category ? 600 : 500,
                                whiteSpace: 'nowrap',
                                transition: 'all var(--transition-fast)'
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Event Grid */}
            {filteredEvents.length > 0 ? (
                <div className="resp-grid">
                    {filteredEvents.map(event => (
                        <div key={event.id} style={{ position: 'relative' }}>
                            {event.isRegistered && (
                                <div style={{
                                    position: 'absolute',
                                    top: 'var(--space-4)',
                                    right: 'var(--space-4)',
                                    zIndex: 2,
                                    background: 'var(--color-accent)',
                                    color: 'white',
                                    padding: '2px 10px',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    boxShadow: 'var(--shadow-sm)'
                                }}>
                                    ✓ Registered
                                </div>
                            )}
                            <EventCard event={{
                                ...event,
                                organizer: event.college?.name || 'Unknown Organizer',
                                date: new Date(event.date).toLocaleDateString()
                            }} />
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: 'var(--space-16) 0', color: 'var(--color-text-muted)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🔍</div>
                    <h3>No events found</h3>
                    <p>Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
}
