import { cn } from '@/lib/utils';
import React from 'react';

interface ProgressBarProps {
    value: number;
    max?: number;
    className?: string;
    barClassName?: string;
    showLabel?: boolean;
}

export function ProgressBar({ value, max = 100, className, barClassName }: ProgressBarProps) {
    const percentage = Math.max(0, Math.min(100, (value / max) * 100));

    return (
        <div className={cn("w-full bg-slate-200 rounded-full h-3 overflow-hidden", className)}>
            <div
                className={cn("h-full transition-all duration-500 ease-out", barClassName)}
                // eslint-disable-next-line
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
