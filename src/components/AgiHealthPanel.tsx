'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, ShieldCheck, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AgiHealthReport, DimensionResult, HealthStatus } from '@/hooks/useAgiHealthCheck';

interface AgiHealthPanelProps {
    report: AgiHealthReport;
    /** Subscription tier — 'free' only sees score bubble, not suggestions */
    userTier: string;
}

const STATUS_CONFIG: Record<HealthStatus, { color: string; bg: string; border: string; dot: string; label: string }> = {
    green: {
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        border: 'border-emerald-200 dark:border-emerald-700/40',
        dot: 'bg-emerald-500',
        label: '正常',
    },
    yellow: {
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        border: 'border-amber-200 dark:border-amber-700/40',
        dot: 'bg-amber-400',
        label: '注意',
    },
    red: {
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-700/40',
        dot: 'bg-red-500',
        label: '風險',
    },
};

function ScoreRing({ score, blockingCount }: { score: number; blockingCount: number }) {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (score / 100) * circumference;
    const ringColor = blockingCount > 0 ? '#ef4444' : score >= 80 ? '#10b981' : '#f59e0b';

    return (
        <div className="relative w-16 h-16 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r={radius} fill="none" stroke="currentColor"
                    className="text-slate-200 dark:text-slate-700" strokeWidth="6" />
                <circle cx="36" cy="36" r={radius} fill="none" stroke={ringColor} strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[13px] font-black text-slate-800 dark:text-white leading-none">{score}</span>
                <span className="text-[8px] text-slate-400 font-bold">/ 100</span>
            </div>
        </div>
    );
}

function DimensionRow({
    dim,
    isLocked,
    isExpanded,
    onToggle,
}: {
    dim: DimensionResult;
    isLocked: boolean;
    isExpanded: boolean;
    onToggle: () => void;
}) {
    const cfg = STATUS_CONFIG[dim.status];

    return (
        <div className={cn(
            'rounded-xl border transition-all duration-200',
            cfg.border,
            isExpanded ? cfg.bg : 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/30'
        )}>
            <button
                onClick={onToggle}
                className="w-full flex items-center gap-2.5 p-3 text-left"
            >
                {/* Traffic light dot */}
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                    {dim.status !== 'green' && (
                        <span className={cn(
                            'animate-ping absolute inline-flex h-full w-full rounded-full opacity-60',
                            cfg.dot
                        )} />
                    )}
                    <span className={cn('relative inline-flex rounded-full h-2.5 w-2.5', cfg.dot)} />
                </span>

                <span className="text-base leading-none">{dim.icon}</span>

                <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-slate-700 dark:text-slate-200 truncate">{dim.label}</p>
                    <p className="text-[10px] text-slate-400 truncate">{dim.role}</p>
                </div>

                <span className={cn(
                    'text-[9px] font-black px-1.5 py-0.5 rounded-full border shrink-0',
                    cfg.color, cfg.bg, cfg.border
                )}>
                    {cfg.label}
                </span>

                {isLocked ? (
                    <span className="text-[9px] text-slate-300 shrink-0">🔒</span>
                ) : (
                    isExpanded
                        ? <ChevronUp className="w-3 h-3 text-slate-400 shrink-0" />
                        : <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                )}
            </button>

            {/* Expanded suggestions */}
            {isExpanded && !isLocked && (
                <div className="px-3 pb-3 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className={cn('text-[10px] font-bold mb-2', cfg.color)}>{dim.summary}</p>
                    {dim.suggestions.map((s, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                            <span className="text-[10px] mt-0.5 shrink-0 text-slate-400">›</span>
                            <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed">{s}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Locked state teaser */}
            {isExpanded && isLocked && (
                <div className="px-3 pb-3 animate-in fade-in duration-200">
                    <p className="text-[10px] text-slate-400 italic">升級至 Starter 以上方案，解鎖 AGI 顧問建議詳情。</p>
                </div>
            )}
        </div>
    );
}

export default function AgiHealthPanel({ report, userTier }: AgiHealthPanelProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const isFree = userTier === 'free';
    const { dimensions, overallScore, blockingCount, warningCount } = report;

    const toggleDimension = (id: string) => {
        if (isFree) return; // free sees locked
        setExpandedId(prev => (prev === id ? null : id));
    };

    // Collapsed: just a floating bubble showing the score ring
    if (isCollapsed) {
        return (
            <div className="flex flex-col items-center gap-2">
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="group relative"
                    title="展開 AGI 公司健診"
                >
                    <ScoreRing score={overallScore} blockingCount={blockingCount} />
                    {blockingCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[8px] font-black shadow">
                            {blockingCount}
                        </span>
                    )}
                </button>
                <span className="text-[9px] font-bold text-slate-400 text-center leading-tight">AGI<br />健診</span>
            </div>
        );
    }

    return (
        <div className="w-[220px] shrink-0 flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-indigo-500" />
                        <span className="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                            AGI 公司健診
                        </span>
                    </div>
                    <button
                        onClick={() => setIsCollapsed(true)}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="收合面板"
                    >
                        <X className="w-3 h-3 text-slate-400" />
                    </button>
                </div>

                {/* Score row */}
                <div className="flex items-center gap-3 px-4 pb-4">
                    <ScoreRing score={overallScore} blockingCount={blockingCount} />
                    <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-[10px] font-bold text-slate-500">整體健康分數</p>
                        {blockingCount > 0 && (
                            <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                                <span className="text-[10px] text-red-600 font-bold">{blockingCount} 個高風險</span>
                            </div>
                        )}
                        {warningCount > 0 && (
                            <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                                <span className="text-[10px] text-amber-600 font-bold">{warningCount} 個需注意</span>
                            </div>
                        )}
                        {blockingCount === 0 && warningCount === 0 && (
                            <div className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-emerald-500" />
                                <span className="text-[10px] text-emerald-600 font-bold">準備就緒！</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Dimension list */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-3 space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 mb-1">
                    六大顧問審查
                </p>
                {dimensions.map((dim) => {
                    // Free tier can see Finance + Legal + Execution (3 dims); rest are locked
                    const FREE_VISIBLE = ['finance', 'legal', 'execution'];
                    const isLocked = isFree && !FREE_VISIBLE.includes(dim.id);

                    return (
                        <DimensionRow
                            key={dim.id}
                            dim={dim}
                            isLocked={isLocked}
                            isExpanded={expandedId === dim.id}
                            onToggle={() => toggleDimension(isLocked ? '' : dim.id)}
                        />
                    );
                })}
            </div>

            {/* Free tier upsell note */}
            {isFree && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700/40 p-3 text-center">
                    <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                        升級解鎖全部 6 位 AGI 顧問意見
                    </p>
                </div>
            )}
        </div>
    );
}
