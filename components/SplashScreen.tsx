'use client';

import { useEffect, useState } from 'react';

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 1500); // Reduced from 3s to 1.5s for faster experience

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'var(--color-bg)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            overflow: 'hidden'
        }}>
            {/* Animated Logo */}
            <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '120px',
                height: '120px',
            }}>
                {/* Pulsing circles */}
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    opacity: 0.2,
                    animation: 'pulse 2s infinite ease-out'
                }}></div>
                <div style={{
                    position: 'absolute',
                    width: '140%',
                    height: '140%',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    opacity: 0.1,
                    animation: 'pulse 2s infinite ease-out 0.5s'
                }}></div>

                {/* Main Logo Text/Icon */}
                <div style={{
                    fontSize: '3rem',
                    fontWeight: 800,
                    color: 'var(--color-primary)',
                    zIndex: 1,
                    animation: 'float 3s infinite ease-in-out'
                }}>
                    EH
                </div>
            </div>

            <div style={{
                marginTop: 'var(--space-6)',
                fontSize: '1.5rem',
                fontWeight: 600,
                letterSpacing: '4px',
                color: 'var(--color-text)',
                textTransform: 'uppercase',
                animation: 'fadeInOut 2s infinite'
            }}>
                EventHUB
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0% { transform: scale(0.8); opacity: 0.4; }
                    100% { transform: scale(2); opacity: 0; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes fadeInOut {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                }
            `}</style>
        </div>
    );
}
