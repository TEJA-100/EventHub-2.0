import Link from 'next/link';

export interface EventProps {
    id: string;
    title: string;
    category: string;
    date: string;
    location: string;
    organizer: string;
    imageUrl?: string;
    isPaid?: boolean;
    price?: number;
}

export default function EventCard({ event }: { event: EventProps }) {
    return (
        <Link href={`/explore/${event.id}`} style={{ display: 'block' }}>
            <div className="glass-panel hover-elevate" style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}>
                {/* Event Image or Placeholder */}
                <div style={{
                    height: '160px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid var(--color-border)',
                    overflow: 'hidden',
                    background: event.imageUrl ? 'none' : `linear-gradient(45deg, var(--color-surface), rgba(var(--hue-primary), 50%, 50%, 0.1))`
                }}>
                    {event.imageUrl ? (
                        <img
                            src={event.imageUrl}
                            alt={event.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <div style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>
                            {event.category === 'Tech' ? '💻' : event.category === 'Cultural' ? '🎭' : '📅'}
                        </div>
                    )}
                </div>

                <div style={{ padding: 'var(--space-4)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                        <div style={{
                            display: 'inline-block',
                            padding: 'var(--space-1) var(--space-2)',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--color-surface-hover)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--color-primary)',
                        }}>
                            {event.category}
                        </div>
                        {event.isPaid ? (
                            <div style={{
                                fontSize: '0.875rem',
                                fontWeight: 700,
                                color: 'var(--color-accent)',
                                background: 'rgba(var(--hue-accent), 100%, 50%, 0.1)',
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                ₹{event.price}
                            </div>
                        ) : (
                            <div style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#10b981',
                                background: 'rgba(16, 185, 129, 0.1)',
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                FREE
                            </div>
                        )}
                    </div>

                    <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-2)' }}>{event.title}</h3>

                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <span>🗓️</span> {event.date}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <span>📍</span> {event.location}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <span>🎓</span> {event.organizer}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
