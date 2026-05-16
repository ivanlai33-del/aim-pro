'use client';

import { useState } from 'react';
import { useAgi, AgiTab } from '../context/AgiContext';
import { ShieldCheck, Users, CheckSquare, X, Sparkles, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Chat bubble tail SVG
function BubbleTail({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 20 12"
            className={cn('absolute w-5 h-3', className)}
            fill="currentColor"
        >
            <path d="M20 0 Q12 0 8 12 Q4 6 0 6 Q6 4 20 0Z" />
        </svg>
    );
}

const QUICK_ACTIONS: { id: AgiTab; icon: React.ReactNode; label: string; color: string }[] = [
    {
        id: 'health',
        icon: <ShieldCheck className="w-4 h-4" />,
        label: '健診',
        color: 'hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600',
    },
    {
        id: 'meeting',
        icon: <Users className="w-4 h-4" />,
        label: '顧問室',
        color: 'hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600',
    },
    {
        id: 'onboarding',
        icon: <CheckSquare className="w-4 h-4" />,
        label: '建置',
        color: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600',
    },
];

export default function AgiFloatingButton() {
    const { isOpen, openWindow, healthReport, onboardingItems, completedItems } = useAgi();
    const [isExpanded, setIsExpanded] = useState(false);

    const urgentCount = healthReport.blockingCount;
    const pendingOnboarding = onboardingItems.filter(
        item => item.priority !== 'green' && !completedItems.has(item.id)
    ).length;
    const totalAlerts = urgentCount + pendingOnboarding;

    // Hide when window is open
    if (isOpen) return null;

    return (
        <div 
            className="fixed bottom-6 right-6 flex flex-col items-end gap-2"
            style={{ zIndex: 999999 }}
        >

            {/* Quick action pills — shown when expanded */}
            {isExpanded && (
                <div className="flex flex-col items-end gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200 mb-1">
                    {QUICK_ACTIONS.map((action) => (
                        <button
                            key={action.id}
                            onClick={() => {
                                setIsExpanded(false);
                                openWindow(action.id);
                            }}
                            className={cn(
                                'flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300',
                                'px-3.5 py-2 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700',
                                'text-xs font-bold transition-all active:scale-95',
                                'hover:bg-cyan-50 dark:hover:bg-cyan-900/30 hover:text-cyan-600'
                            )}
                        >
                            {action.icon}
                            {action.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Chat bubble button */}
            <div className="relative flex flex-col items-end">
                {/* Alert tooltip above bubble */}
                {totalAlerts > 0 && !isExpanded && (
                    <div className="relative mb-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
                        <div className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-2xl rounded-br-none shadow-lg text-white text-xs font-bold',
                            urgentCount > 0
                                ? 'bg-gradient-to-r from-red-500 to-orange-500'
                                : 'bg-gradient-to-r from-cyan-400 via-cyan-500 to-emerald-500'
                        )}>
                            {urgentCount > 0
                                ? <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                : <Sparkles className="w-3.5 h-3.5 shrink-0" />
                            }
                            <span>
                                {urgentCount > 0
                                    ? `${urgentCount} 個高風險警示`
                                    : `${pendingOnboarding} 個建置項目待完成`
                                }
                            </span>
                        </div>
                        {/* Bubble tail pointing right-bottom */}
                        <div className={cn(
                            'absolute -bottom-2 right-4 w-4 h-2 overflow-hidden',
                        )}>
                            <div className={cn(
                                'w-4 h-4 rotate-45 translate-y-[-50%] translate-x-1',
                                urgentCount > 0 ? 'bg-orange-500' : 'bg-emerald-500'
                            )} />
                        </div>
                    </div>
                )}

                {/* Main chat bubble button */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={cn(
                        'relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 active:scale-95',
                        urgentCount > 0
                            ? 'bg-gradient-to-br from-red-500 to-orange-500 shadow-red-500/40'
                            : 'bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 shadow-cyan-500/40',
                        isExpanded && 'rotate-12 scale-95'
                    )}
                    title="AGI 顧問室"
                >
                    {/* Pulse ring for urgent issues */}
                    {urgentCount > 0 && !isExpanded && (
                        <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-30" />
                    )}

                    {/* Icon */}
                    {isExpanded
                        ? <X className="w-6 h-6 text-white" />
                        : urgentCount > 0
                            ? <AlertTriangle className="w-6 h-6 text-white" />
                            : <Sparkles className="w-6 h-6 text-white" />
                    }

                    {/* Alert badge */}
                    {totalAlerts > 0 && !isExpanded && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-red-600 text-[9px] font-black shadow border-2 border-red-100 dark:border-red-900">
                            {totalAlerts > 9 ? '9+' : totalAlerts}
                        </span>
                    )}
                </button>

                {/* Bubble tail shape below button */}
                <div className={cn(
                    'w-4 h-3 mr-2 overflow-hidden mt-[-2px]',
                    urgentCount > 0 ? 'text-orange-500' : 'text-emerald-500'
                )}>
                    <div className={cn(
                        'w-4 h-4 rotate-45 translate-y-[-50%] translate-x-1',
                        urgentCount > 0 ? 'bg-orange-500' : 'bg-emerald-500'
                    )} />
                </div>
            </div>
        </div>
    );
}
