'use client';

import { useAgi } from '../context/AgiContext';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertCircle, AlertTriangle, ArrowRight, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AgiOnboardingTab() {
    const { onboardingItems, completedItems, markComplete } = useAgi();
    const router = useRouter();

    const total = onboardingItems.length;
    const done = onboardingItems.filter(i => completedItems.has(i.id) || i.priority === 'green').length;
    const pct = Math.round((done / total) * 100);

    return (
        <div className="h-full overflow-y-auto p-4 space-y-4">
            {/* Progress header */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-800/30">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <p className="text-xs font-black text-indigo-700 dark:text-indigo-300">公司建置完整度</p>
                        <p className="text-[10px] text-indigo-400 mt-0.5">完成設定，讓每份文件都專業可信</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{pct}%</p>
                    </div>
                </div>
                <div className="h-2 bg-indigo-100 dark:bg-indigo-800/40 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                    />
                </div>
                {pct === 100 && (
                    <div className="flex items-center gap-2 mt-2">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <p className="text-[10px] font-black text-amber-600">公司資料完整！您已具備完整的商業門面。</p>
                    </div>
                )}
            </div>

            {/* Checklist */}
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">建置清單</p>
            <div className="space-y-2">
                {onboardingItems.map((item) => {
                    const isDone = completedItems.has(item.id) || item.priority === 'green';

                    const PriorityIcon = isDone
                        ? CheckCircle2
                        : item.priority === 'red'
                            ? AlertCircle
                            : AlertTriangle;

                    const iconClass = isDone
                        ? 'text-emerald-500'
                        : item.priority === 'red'
                            ? 'text-red-500'
                            : 'text-amber-500';

                    return (
                        <div
                            key={item.id}
                            className={cn(
                                'rounded-xl border p-3 transition-all',
                                isDone
                                    ? 'border-emerald-200 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-900/10'
                                    : item.priority === 'red'
                                        ? 'border-red-200 dark:border-red-800/30 bg-red-50/50 dark:bg-red-900/10'
                                        : 'border-amber-200 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-900/10'
                            )}
                        >
                            <div className="flex items-start gap-2.5">
                                <PriorityIcon className={cn('w-4 h-4 shrink-0 mt-0.5', iconClass)} />
                                <div className="flex-1 min-w-0">
                                    <p className={cn('text-xs font-black', isDone ? 'text-emerald-700 dark:text-emerald-400 line-through opacity-70' : 'text-slate-700 dark:text-slate-200')}>
                                        {item.label}
                                    </p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                                        {item.description}
                                    </p>
                                    {!isDone && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => {
                                                    router.push(item.actionPath);
                                                }}
                                                className={cn(
                                                    'flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all',
                                                    item.priority === 'red'
                                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                                        : 'bg-amber-500 text-white hover:bg-amber-600'
                                                )}
                                            >
                                                {item.actionLabel}
                                                <ArrowRight className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => markComplete(item.id)}
                                                className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                已完成
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
