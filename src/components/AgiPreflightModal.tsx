'use client';

import { AlertTriangle, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AgiHealthReport, HealthStatus } from '@/hooks/useAgiHealthCheck';

interface AgiPreflightModalProps {
    isOpen: boolean;
    report: AgiHealthReport;
    onFix: () => void;    // Return to form
    onIgnore: () => void; // Proceed anyway
    onClose: () => void;
}

const STATUS_ICON: Record<HealthStatus, JSX.Element> = {
    red: <span className="flex h-2 w-2 rounded-full bg-red-500 mt-1 shrink-0" />,
    yellow: <span className="flex h-2 w-2 rounded-full bg-amber-400 mt-1 shrink-0" />,
    green: <span className="flex h-2 w-2 rounded-full bg-emerald-500 mt-1 shrink-0" />,
};

export default function AgiPreflightModal({
    isOpen,
    report,
    onFix,
    onIgnore,
    onClose,
}: AgiPreflightModalProps) {
    if (!isOpen) return null;

    const redDims = report.dimensions.filter(d => d.status === 'red');
    const yellowDims = report.dimensions.filter(d => d.status === 'yellow');
    const allClear = redDims.length === 0 && yellowDims.length === 0;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
                {/* Header */}
                <div className={cn(
                    "px-6 pt-6 pb-5 flex items-start gap-4",
                    redDims.length > 0
                        ? "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20"
                        : yellowDims.length > 0
                            ? "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20"
                            : "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20"
                )}>
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-2xl shadow-sm",
                        redDims.length > 0 ? "bg-red-100 dark:bg-red-800/30" :
                            yellowDims.length > 0 ? "bg-amber-100 dark:bg-amber-800/30" :
                                "bg-emerald-100 dark:bg-emerald-800/30"
                    )}>
                        {allClear ? '✅' : redDims.length > 0 ? '🚨' : '⚠️'}
                    </div>

                    <div className="flex-1">
                        <h2 className="text-lg font-black text-slate-800 dark:text-white">
                            {allClear
                                ? 'AGI 顧問快報：一切就緒！'
                                : `AGI 顧問快報：發現 ${redDims.length + yellowDims.length} 個待確認項目`
                            }
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            {allClear
                                ? '所有維度均通過審查，建議直接生成報告。'
                                : '以下是生成正式報告前，AGI 顧問建議您注意的事項。'
                            }
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white/70 transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Issues List */}
                {!allClear && (
                    <div className="px-6 py-4 space-y-4 max-h-72 overflow-y-auto">
                        {/* Red issues first */}
                        {redDims.map((dim) => (
                            <div key={dim.id} className="flex gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30">
                                <span className="text-lg leading-none mt-0.5">{dim.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-wider">{dim.label}</span>
                                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                        <span className="text-[9px] font-bold text-red-500">高風險</span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-1">{dim.summary}</p>
                                    {dim.suggestions.slice(0, 1).map((s, i) => (
                                        <div key={i} className="flex items-start gap-1">
                                            <ArrowRight className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400">{s}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Yellow issues */}
                        {yellowDims.map((dim) => (
                            <div key={dim.id} className="flex gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30">
                                <span className="text-lg leading-none mt-0.5">{dim.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">{dim.label}</span>
                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                        <span className="text-[9px] font-bold text-amber-500">建議補強</span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-1">{dim.summary}</p>
                                    {dim.suggestions.slice(0, 1).map((s, i) => (
                                        <div key={i} className="flex items-start gap-1">
                                            <ArrowRight className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400">{s}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Score bar */}
                <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">整體健康分數</span>
                        <span className={cn(
                            "text-[11px] font-black",
                            report.overallScore >= 80 ? "text-emerald-600" :
                                report.overallScore >= 50 ? "text-amber-600" : "text-red-600"
                        )}>
                            {report.overallScore} / 100
                        </span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-700",
                                report.overallScore >= 80 ? "bg-emerald-500" :
                                    report.overallScore >= 50 ? "bg-amber-400" : "bg-red-500"
                            )}
                            style={{ width: `${report.overallScore}%` }}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 pt-3 flex gap-3">
                    {allClear ? (
                        <button
                            onClick={onIgnore}
                            className="flex-1 py-3 bg-gradient-to-br from-cyan-400 to-emerald-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-cyan-500/25 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            立即生成報告
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={onFix}
                                className="flex-1 py-3 bg-gradient-to-br from-cyan-400 to-emerald-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-cyan-500/25 hover:brightness-105 active:scale-[0.98] transition-all"
                            >
                                立即補強資料
                            </button>
                            <button
                                onClick={onIgnore}
                                className="py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-sm rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                title="忽略警告，直接生成（報告將標注待補欄位）"
                            >
                                忽略，直接生成
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
