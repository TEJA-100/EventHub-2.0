'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ShareButtons from '@/components/ShareButtons';

interface EventData {
    id: string;
    title: string;
    category: string;
    date: string;
    location: string;
    description: string;
    capacity: number;
    attendeeCount: number;
    isRegistered: boolean;
    isPaid: boolean;
    price: number;
    college: {
        name: string;
    };
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function EventDetailsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise);
    const [event, setEvent] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch(`/api/events/${params.id}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                setEvent(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [params.id]);

    const handleRegister = async () => {
        if (!event) return;
        setRegistering(true);

        try {
            if (event.isPaid) {
                // 1. Create Razorpay Order
                const orderRes = await fetch('/api/razorpay/order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: event.price, eventId: event.id })
                });

                if (!orderRes.ok) {
                    const data = await orderRes.json();
                    if (orderRes.status === 401) {
                        router.push('/login');
                        return;
                    }
                    throw new Error(data.error || 'Failed to create payment order');
                }
                const orderData = await orderRes.json();

                // 2. Open Razorpay Checkout
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: "EventHUB",
                    description: `Registration for ${event.title}`,
                    order_id: orderData.orderId,
                    handler: async function (response: any) {
                        try {
                            const verifyRes = await fetch('/api/razorpay/verify', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    ...response,
                                    eventId: event.id
                                })
                            });

                            if (verifyRes.ok) {
                                setEvent(prev => prev ? { ...prev, isRegistered: true, attendeeCount: prev.attendeeCount + 1 } : null);
                                alert('Payment successful! You are now registered.');
                            } else {
                                alert('Payment verification failed.');
                            }
                        } catch (err) {
                            console.error('Verification error:', err);
                            alert('An error occurred during verification.');
                        }
                    },
                    prefill: {
                        name: "", // Can be filled if we have user info
                        email: "",
                    },
                    theme: {
                        color: "#6366f1",
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                // Free Registration
                const res = await fetch(`/api/events/${params.id}`, { method: 'POST' });
                if (res.ok) {
                    setEvent(prev => prev ? { ...prev, isRegistered: true, attendeeCount: prev.attendeeCount + 1 } : null);
                } else {
                    const data = await res.json();
                    if (res.status === 401) {
                        router.push('/login');
                    } else {
                        alert(data.error || 'Failed to register');
                    }
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setRegistering(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: 'var(--space-16) 0', textAlign: 'center', flex: 1 }}>
                <p>Loading event details...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="container" style={{ padding: 'var(--space-16) 0', textAlign: 'center', flex: 1 }}>
                <h2>Event Not Found</h2>
                <Link href="/explore" className="btn-primary" style={{ marginTop: 'var(--space-4)', display: 'inline-block' }}>Back to Explore</Link>
            </div>
        );
    }

    const spotsLeft = Math.max(0, event.capacity - event.attendeeCount);

    return (
        <div className="container" style={{ padding: 'var(--space-8) var(--space-4)', flex: 1 }}>
            <Link href="/explore" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                color: 'var(--color-primary)',
                fontWeight: 600,
                marginBottom: 'var(--space-6)',
                transition: 'color var(--transition-fast)'
            }}>
                ← Back to Explore
            </Link>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
                gap: 'var(--space-8)',
                alignItems: 'start'
            }}>
                {/* Left Column: Main Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                    <div>
                        <div style={{
                            display: 'inline-block',
                            padding: 'var(--space-1) var(--space-3)',
                            borderRadius: 'var(--radius-full)',
                            background: 'rgba(var(--hue-primary), 80%, 50%, 0.1)',
                            color: 'var(--color-primary)',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            marginBottom: 'var(--space-4)'
                        }}>
                            {event.category}
                        </div>

                        <h1 style={{ fontSize: '3rem', marginBottom: 'var(--space-4)', lineHeight: 1.1 }}>{event.title}</h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>Hosted by <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>{event.college.name}</span></p>
                    </div>

                    <div className="glass-panel" style={{
                        height: '300px',
                        background: 'linear-gradient(45deg, var(--color-surface), rgba(var(--hue-secondary), 50%, 50%, 0.1))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-secondary)',
                        fontSize: '4rem'
                    }}>
                        {event.category === 'Tech' ? '💻' : event.category === 'Music' ? '🎵' : '📅'}
                    </div>

                    <section>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-4)' }}>About this Event</h2>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', lineHeight: 1.8 }}>
                            {event.description}
                        </p>
                    </section>
                </div>

                {/* Right Column: Registration Card */}
                <div className="glass-panel" style={{
                    padding: 'var(--space-6)',
                    position: 'sticky',
                    top: '100px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-6)'
                }}>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
                            Registration Details
                        </h3>

                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', color: 'var(--color-text-muted)' }}>
                            <li style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                <span>🗓️</span>
                                <div>
                                    <strong style={{ display: 'block', color: 'var(--color-text)' }}>Date</strong>
                                    {new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                </div>
                            </li>
                            <li style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                <span>📍</span>
                                <div>
                                    <strong style={{ display: 'block', color: 'var(--color-text)' }}>Location</strong>
                                    {event.location}
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div style={{ background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                            <span style={{ fontWeight: 600 }}>Spots Remaining</span>
                            <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{spotsLeft} / {event.capacity}</span>
                        </div>
                        {/* Progress Bar */}
                        <div style={{ width: '100%', height: '8px', background: 'var(--color-bg)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                            <div style={{ width: `${(event.attendeeCount / event.capacity) * 100}%`, height: '100%', background: 'var(--color-primary)' }}></div>
                        </div>
                    </div>

                    {event.isRegistered ? (
                        <div style={{ textAlign: 'center', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', background: 'rgba(var(--hue-accent), 45%, 0.1)', color: 'var(--color-accent)', fontWeight: 700 }}>
                            ✓ You are Registered
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            {event.isPaid && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2) var(--space-1)' }}>
                                    <span style={{ fontWeight: 600 }}>Registration Fee</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>₹{event.price}</span>
                                </div>
                            )}
                            <button
                                onClick={handleRegister}
                                disabled={registering || spotsLeft === 0}
                                className="btn-primary"
                                style={{
                                    width: '100%',
                                    fontSize: '1.125rem',
                                    padding: 'var(--space-4)',
                                    opacity: (registering || spotsLeft === 0) ? 0.7 : 1,
                                    background: event.isPaid ? 'var(--color-accent)' : 'var(--color-primary)'
                                }}
                            >
                                {registering ? 'Processing...' : spotsLeft === 0 ? 'Waitlist Only' : event.isPaid ? `Pay ₹${event.price} & Register` : 'Register Now (Free)'}
                            </button>
                        </div>
                    )}

                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-6)', marginTop: 'var(--space-2)' }}>
                        <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={event.title} />
                    </div>

                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        By registering, you agree to the EventHUB terms and campus guidelines.
                    </p>
                </div>
            </div>
        </div>
    );
}
