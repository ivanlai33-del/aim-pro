'use client';

import { useEffect, useRef } from 'react';

interface TurnstileProps {
    onVerify: (token: string) => void;
    className?: string;
}

declare global {
    interface Window {
        turnstile: {
            render: (
                element: string | HTMLElement,
                options: {
                    sitekey: string;
                    callback: (token: string) => void;
                    'expired-callback'?: () => void;
                    'error-callback'?: () => void;
                    theme?: 'light' | 'dark' | 'auto';
                }
            ) => string;
            reset: (widgetId: string) => void;
        };
    }
}

export default function Turnstile({ onVerify, className }: TurnstileProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    // Using Cloudflare's always-pass testing key by default
    // Replace with your real site key in production
    const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

    useEffect(() => {
        const renderWidget = () => {
            if (window.turnstile && containerRef.current && !widgetIdRef.current) {
                widgetIdRef.current = window.turnstile.render(containerRef.current, {
                    sitekey: SITE_KEY,
                    callback: (token: string) => {
                        onVerify(token);
                    },
                    theme: 'auto',
                });
            }
        };

        if (window.turnstile) {
            renderWidget();
        } else {
            // Wait for script to load if not ready
            const interval = setInterval(() => {
                if (window.turnstile) {
                    renderWidget();
                    clearInterval(interval);
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, [onVerify, SITE_KEY]);

    return (
        <div ref={containerRef} className={className} />
    );
}
