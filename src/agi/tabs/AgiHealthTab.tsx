'use client';

import { useAgi } from '../context/AgiContext';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { HealthStatus } from '@/hooks/useAgiHealthCheck';

const STATUS_CFG: Record<HealthStatus, { dot: string; badge: string; label: string }> = {
    green:  { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: '正常' },
    yellow: { dot: 'bg-amber-400',   badge: 'bg-amber-50 text-amber-700 border-amber-200',     label: '注意' },
    red:    { dot: 'bg-red-500',     badge: 'bg-red-50 text-red-700 border-red-200',            label: '風險' },
};

export default function AgiHealthTab() {
    const { healthReport, openWindow } = useAgi();
    const { dimensions, overallScore, blockingCount, warningCount } = healthReport;
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const ringColor = blockingCount > 0 ? '#ef4444' : overallScore >= 80 ? '#10b981' : '#f59e0b';
    const radius = 26;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (overallScore / 100) * circumference;

    return (
        <div className="h-full overflow-y-auto p-4 space-y-3">
            {/* Score summary */}
            <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 rounded-2xl p-4">
                {/* SVG ring */}
                <div className="relative w-14 h-14 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r={radius} fill="none" stroke="currentColor"
                            className="text-slate-200 dark:text-slate-700" strokeWidth="5" />
                        <circle cx="32" cy="32" r={radius} fill="none" stroke={ringColor}
                            strokeWidth="5" strokeLinecap="round"
                            strokeDasharray={circumference} strokeDashoffset={dashOffset}
                            style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[12px] font-black text-slate-800 dark:text-white leading-none">{overallScore}</span>
                        <span className="text-[7px] text-slate-400">/ 100</span>
                    </div>
                </div>
                <div className="flex-1 space-y-1">
                    <p className="text-xs font-black text-slate-700 dark:text-slate-200">專案健康分數</p>
                    {blockingCount > 0 && (
                        <p className="text-[11px] text-red-600 font-bold">🔴 {blockingCount} 個高風險問題</p>
                    )}
                    {warningCount > 0 && (
                        <p className="text-[11px] text-amber-600 font-bold">🟡 {warningCount} 個待補強項目</p>
                    )}
                    {blockingCount === 0 && warningCount === 0 && (
                        <p className="text-[11px] text-emerald-600 font-bold">✅ 所有維度通過審查</p>
                    )}
                </div>
            </div>

            {/* Dimension list */}
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">六位 AGI 顧問審查結果</p>
            {dimensions.map((dim) => {
                const cfg = STATUS_CFG[dim.status];
                const isExpanded = expandedId === dim.id;
                return (
                    <div key={dim.id} className={cn(
                        'rounded-xl border transition-all',
                        dim.status === 'red' ? 'border-red-200 dark:border-red-800/40' :
                            dim.status === 'yellow' ? 'border-amber-200 dark:border-amber-800/40' :
                                'border-slate-200 dark:border-slate-700'
                    )}>
                        <button
                            onClick={() => setExpandedId(isExpanded ? null : dim.id)}
                            className="w-full flex items-center gap-2.5 p-3 text-left"
                        >
                            <span className="relative flex h-2 w-2 shrink-0">
                                {dim.status !== 'green' && (
                                    <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-50', cfg.dot)} />
                                )}
                                <span className={cn('relative inline-flex rounded-full h-2 w-2', cfg.dot)} />
                            </span>
                            <span className="text-sm">{dim.icon}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-black text-slate-700 dark:text-slate-200 truncate">{dim.label}</p>
                            </div>
                            <span className={cn('text-[8px] font-black px-1.5 py-0.5 rounded-full border', cfg.badge)}>
                                {cfg.label}
                            </span>
                            {isExpanded ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
                        </button>

                        {isExpanded && (
                            <div className="px-3 pb-3 space-y-1.5 animate-in fade-in duration-200">
                                <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{dim.summary}</p>
                                {dim.suggestions.map((s, i) => (
                                    <div key={i} className="flex items-start gap-1.5">
                                        <span className="text-slate-400 shrink-0 text-[10px] mt-0.5">›</span>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{s}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
