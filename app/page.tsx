'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/SplashScreen';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
      // Redirect to login for faster initial user experience
      router.push('/login');
    }, 1800); // Reduced delay for snappier feel

    return () => clearTimeout(timer);
  }, [router]);

  if (!showContent) {
    return <SplashScreen />;
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Dynamic Background Elements */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)',
        opacity: 0.15, filter: 'blur(80px)', zIndex: -1, borderRadius: '50%'
      }}></div>
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw',
        background: 'radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)',
        opacity: 0.1, filter: 'blur(100px)', zIndex: -1, borderRadius: '50%'
      }}></div>

      {/* Hero Section */}
      <section className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 'var(--space-12) var(--space-4)' }}>
        <div style={{ maxWidth: '800px' }}>
          <div className="glass-panel animate-fade-in" style={{ display: 'inline-block', padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-6)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-primary)' }}>
            ✨ Goodbye WhatsApp forwards. Hello centralized discovery.
          </div>

          <h1 className="animate-fade-in delay-100" style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', letterSpacing: '-2px', marginBottom: 'var(--space-6)' }}>
            The Pulse of <br />
            <span className="gradient-text">Campus Life.</span>
          </h1>

          <p className="animate-fade-in delay-200" style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)', maxWidth: '600px', margin: '0 auto var(--space-8) auto' }}>
            Where every student finds their stage and every college manages events effortlessly. Welcome to your single, sleek digital ecosystem.
          </p>

          <div className="animate-fade-in delay-300" style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/explore" className="btn-primary" style={{ padding: 'var(--space-4) var(--space-8)', fontSize: '1.125rem' }}>
              Explore Events
            </Link>
            <Link href="/college" className="btn-secondary" style={{ padding: 'var(--space-4) var(--space-8)', fontSize: '1.125rem' }}>
              For Organizers
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="container" style={{ padding: 'var(--space-16) var(--space-4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-8)' }}>
          <div className="glass-panel hover-elevate" style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(var(--hue-primary), 80%, 50%, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              🧭
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0' }}>Smart Discovery</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>Clean event feed, intelligent filters, and personalized recommendations for the explorer in you.</p>
          </div>

          <div className="glass-panel hover-elevate" style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(var(--hue-secondary), 80%, 50%, 0.1)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              ⚡
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0' }}>1-Click Registration</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>Never fill out another tedious Google form.Unified profile, instant signup, zero friction.</p>
          </div>

          <div className="glass-panel hover-elevate" style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(var(--hue-accent), 90%, 45%, 0.1)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              📊
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0' }}>Admin Control</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>Digital event management, real-time broadcasts, and participant insights for organizers.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
