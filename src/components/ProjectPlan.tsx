'use client';

import { useProject, Milestone } from '@/context/ProjectContext';
import {
    Paperclip,
    CheckSquare,
    Check,
    Clock,
    Flag,
    ChevronRight,
    Workflow,
    AlertCircle,
    Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ProgressBar } from '@/components/ui/ProgressBar';

export default function ProjectPlan() {
    const { activeProject, currentIndustry, updateProjectExecution } = useProject();

    if (!activeProject) return null;

    const flow = activeProject.projectFlow || {
        milestones: currentIndustry.workflow.milestones.map((m: any, i: number) => ({
            id: `m-${i}`,
            label: m,
            isCompleted: false
        }))
    };

    const handleToggleMilestone = (milestoneId: string) => {
        const newMilestones = flow.milestones.map((m: Milestone) =>
            m.id === milestoneId ? { ...m, isCompleted: !m.isCompleted } : m
        );

        // Find current milestone (first uncompleted)
        const firstUncompleted = newMilestones.find((m: Milestone) => !m.isCompleted);

        updateProjectExecution(activeProject.id, activeProject.executionTasks || [], activeProject.paymentSchedule, {
            currentMilestoneId: firstUncompleted?.id,
            milestones: newMilestones
        });

        const m = newMilestones.find((m: Milestone) => m.id === milestoneId);
        if (m?.isCompleted) {
            toast.success(`里程碑已達成：${m.label}`);
        }
    };

    const completionRate = Math.round((flow.milestones.filter((m: Milestone) => m.isCompleted).length / flow.milestones.length) * 100);

    const gradients = [
        "from-indigo-500 to-blue-600",
        "from-emerald-500 to-teal-600",
        "from-violet-500 to-purple-600",
        "from-rose-500 to-pink-600",
        "from-cyan-500 to-blue-600",
        "from-orange-500 to-amber-600"
    ];

    return (
        <div className="space-y-8 pb-20 font-sans">
            {/* 1. Planning Header & Progress */}
            <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl py-6 px-10 text-white relative overflow-hidden shadow-2xl shadow-cyan-900/20 mb-10">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Workflow className="w-48 h-48" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-amber-400 text-amber-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest leading-none">Execution Planning</span>
                            <span className="text-white text-base font-bold opacity-80">專案執行與標準化前導企劃</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tight leading-tight mb-0">
                            {currentIndustry.name} <br />
                            <span className="text-cyan-100 font-bold text-xl">標準化執行流程 (Standard Workflow)</span>
                        </h2>
                    </div>

                    <div className="w-full md:w-1/3 min-w-[300px]">
                        <div className="flex justify-between items-end mb-3">
                            <span className="text-sm font-black text-cyan-50 uppercase tracking-widest">整體企劃完成進度</span>
                            <span className="text-2xl font-black">{completionRate}%</span>
                        </div>
                        <ProgressBar
                            value={completionRate}
                            className="bg-white/10 border border-white/5 h-4 backdrop-blur-md"
                            barClassName="bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)] duration-1000"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* 2. Milestone Checklist */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-black/20 overflow-hidden">
                        <div className="px-10 py-8 border-b border-black/20 flex justify-between items-center bg-slate-50/50">
                            <h4 className="font-black text-xl text-slate-800 flex items-center">
                                <CheckSquare className="w-6 h-6 mr-4 text-indigo-600" />
                                執行里程碑檢核表 (MILESTONES)
                            </h4>
                            <span className="text-xs font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-lg uppercase tracking-widest shrink-0">CHECKLIST</span>
                        </div>

                        <div className="p-10 space-y-6">
                            {flow.milestones.map((m: any, index: number) => (
                                <div
                                    key={m.id}
                                    onClick={() => handleToggleMilestone(m.id)}
                                    className={cn(
                                        "group flex items-center p-6 rounded-3xl border transition-all cursor-pointer active:scale-[0.98]",
                                        m.isCompleted
                                            ? "border-black/10 bg-slate-50/50"
                                            : "border-black/20 bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50"
                                    )}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center mr-6 shrink-0 transition-all duration-300",
                                        m.isCompleted ? `bg-gradient-to-br ${gradients[index % 6]} text-white shadow-lg scale-110 border-transparent` : "bg-white text-slate-400 border border-black/20 group-hover:bg-slate-50 group-hover:border-black/30"
                                    )}>
                                        {m.isCompleted ? <Check className="w-6 h-6 stroke-[3]" /> : <span className="text-sm font-black">{index + 1}</span>}
                                    </div>

                                    <div className="flex-1">
                                        <h5 className={cn(
                                            "font-black text-lg transition-all decoration-[1.5px]",
                                            m.isCompleted ? "text-slate-400 line-through opacity-60" : "text-slate-600"
                                        )}>
                                            {m.label}
                                        </h5>
                                        {!m.isCompleted && index === flow.milestones.findIndex((x: Milestone) => !x.isCompleted) && (
                                            <span className="inline-flex items-center text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md uppercase tracking-widest animate-pulse mt-1">
                                                <Clock className="w-3 h-3 mr-1" /> NEXT STEP
                                            </span>
                                        )}
                                    </div>

                                    <div className={cn(
                                        "w-8 h-8 rounded-full border flex items-center justify-center transition-all",
                                        m.isCompleted ? `bg-gradient-to-br ${gradients[index % 6]} border-transparent text-white shadow-md` : "border-black/20 bg-white group-hover:border-black/30 group-hover:bg-slate-50"
                                    )}>
                                        <ChevronRight className={cn("w-5 h-5 transition-transform", m.isCompleted ? "rotate-90" : "group-hover:translate-x-1")} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Workflow Diagram Sidebar & ERP Tips */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-black/20 p-8">
                        <h4 className="font-black text-xl text-slate-800 mb-6 flex items-center">
                            <Workflow className="w-6 h-6 mr-3 text-indigo-600" />
                            執行邏輯圖 (Workflow)
                        </h4>

                        <div className="bg-slate-50 rounded-2xl p-6 border border-black/20 relative group">
                            <pre className="text-[12px] font-mono whitespace-pre-wrap text-slate-500">
                                {currentIndustry.workflow.diagram}
                            </pre>
                            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center rounded-2xl text-center p-6">
                                <p className="text-white text-sm font-bold leading-relaxed">
                                    此流程圖代表該產業的標準作業程序 (SOP)。<br />
                                    請依據各節點進行人員分派。
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                                    <Flag className="w-4 h-4 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-700">對應報價項目</p>
                                    <p className="text-xs text-slate-500">確保每個里程碑都有對應的報價預算支撐。</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                                    <AlertCircle className="w-4 h-4 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-700">風險控制</p>
                                    <p className="text-xs text-slate-500">若前期企劃延宕，會直接影響後續工期進度。</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ERP Tips Card - Moved here */}
                    <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl p-6 text-white flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 relative overflow-hidden shadow-2xl shadow-cyan-900/20">
                        <div className="absolute right-0 top-0 p-8 opacity-5">
                            <Info className="w-64 h-64" />
                        </div>
                        <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md shrink-0">
                            <Workflow className="w-10 h-10 text-amber-400" />
                        </div>
                        <div className="relative z-10">
                            <h5 className="font-black text-xl mb-2 tracking-tight">💡 執行企劃：資源分配的核心價值</h5>
                            <p className="text-white/90 text-base leading-relaxed font-medium">
                                完成此里程碑規劃後，建議在「執行管理」階段針對每個任務進行細部資源定義。
                                您可以透過不同的資源標籤來優化專案利潤：
                            </p>
                            <div className="mt-4 flex flex-col gap-3">
                                <div className="bg-sky-400/20 border border-sky-400/30 px-4 py-3 rounded-xl text-sm font-black text-sky-100 flex items-center">
                                    🏢 內部正職 (固定成本)
                                </div>
                                <div className="bg-sky-400/20 border border-sky-400/30 px-4 py-3 rounded-xl text-sm font-black text-sky-100 flex items-center">
                                    🚚 外包發票 (可扣抵 5% 稅額)
                                </div>
                                <div className="bg-sky-400/20 border border-sky-400/30 px-4 py-3 rounded-xl text-sm font-black text-sky-100 flex items-center">
                                    🤝 外部勞報 (需扣 2.11% 健保)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
