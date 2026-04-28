'use client';

import { useState, useMemo } from 'react';
import { useProject, ExecutionTask, QuotationItem } from '@/context/ProjectContext';
import {
    CheckCircle2,
    Clock,
    AlertCircle,
    User,
    Truck,
    DollarSign,
    Plus,
    ChevronRight,
    PieChart,
    ArrowRightLeft,
    TrendingUp,
    TrendingDown,
    Save,
    Activity,
    Layout,
    Briefcase,
    Trash2,
    Play,
    Pause,
    History,
    Sparkles
} from 'lucide-react';
import { cn, generateId } from '@/lib/utils';
import { toast } from 'sonner';
import { ProgressBar } from '@/components/ui/ProgressBar';
import ManualTimerModal from './ManualTimerModal';

export default function ExecutionManager() {
    const { activeProject, updateProjectExecution, currentTeamRole } = useProject();

    // RBAC Checks
    const canSeeRevenue = ['owner', 'admin', 'accountant', 'sales'].includes(currentTeamRole);
    const canSeeCosts = ['owner', 'admin', 'accountant'].includes(currentTeamRole);
    const canEditProject = ['owner', 'admin'].includes(currentTeamRole);
    const canEditPayout = ['owner', 'admin', 'accountant'].includes(currentTeamRole);
    const canApproveBudget = ['owner', 'admin'].includes(currentTeamRole);

    // UI States
    const [showFlow, setShowFlow] = useState(false);
    const [showDistribution, setShowDistribution] = useState(false);
    const [activeTimerTaskId, setActiveTimerTaskId] = useState<string | null>(null);
    const [timerStartTime, setTimerStartTime] = useState<number | null>(null);
    const [manualTimerTask, setManualTimerTask] = useState<{ id: string, name: string } | null>(null);

    const tasks = activeProject?.executionTasks || [];
    const quoteItems = activeProject?.quotationItems || [];

    // --- Calculations ---
    const calculateTaskCost = (task: ExecutionTask, items: QuotationItem[]) => {
        if (task.splitType === 'percentage' && task.splitValue) {
            const linkedItem = items.find(i => i.id === task.quoteItemId);
            const baseAmount = linkedItem ? (linkedItem.unitPrice * linkedItem.quantity) : totalRevenue;
            return Math.round(baseAmount * (task.splitValue / 100));
        }
        if (task.splitType === 'unit' && task.splitValue) {
            return Math.round(task.splitValue * (task.quantity || 1));
        }
        return task.cost;
    };

    const totalRevenue = useMemo(() =>
        quoteItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
        , [quoteItems]);

    const totalOutsourcedCost = useMemo(() =>
        tasks.filter(t => t.type === 'outsourced' || t.type === 'external')
            .reduce((sum, t) => sum + calculateTaskCost(t, quoteItems), 0)
        , [tasks, quoteItems, totalRevenue]);

    const totalDepositsPaid = useMemo(() =>
        tasks.filter(t => t.type === 'outsourced' || t.type === 'external').reduce((sum, t) => sum + t.depositPaid, 0)
        , [tasks]);

    // --- Tax Calculations (Post-tax Pocket Money) ---
    // 1. Outsourced (Invoice): Can deduct 5% VAT (Assuming cost includes tax)
    // 2. External (Labor): Company part of 2nd Gen NHI 2.11%
    const postTaxCosts = useMemo(() => {
        const taxMode = activeProject?.quotationSettings?.taxMode || 'exclusive';
        
        return tasks.reduce((sum, t) => {
            const currentCost = calculateTaskCost(t, quoteItems);
            if (t.type === 'outsourced') {
                return sum + (currentCost / 1.05); 
            } else if (t.type === 'external') {
                return sum + (currentCost * 1.0211);
            }
            return sum;
        }, 0);
    }, [tasks, quoteItems, activeProject?.quotationSettings?.taxMode]);

    const realRevenue = useMemo(() => {
        const taxMode = activeProject?.quotationSettings?.taxMode || 'exclusive';
        if (taxMode === 'inclusive') return totalRevenue / 1.05;
        return totalRevenue;
    }, [totalRevenue, activeProject?.quotationSettings?.taxMode]);

    // --- Distribution Summary Data ---
    const staffSummary = useMemo(() => {
        const summary: Record<string, { internal: number, outsourced: number, completed: number, total: number, totalOwed: number, totalPaid: number }> = {};
        tasks.forEach(t => {
            const key = t.assignee || '未指派';
            if (!summary[key]) summary[key] = { internal: 0, outsourced: 0, completed: 0, total: 0, totalOwed: 0, totalPaid: 0 };
            const cost = calculateTaskCost(t, quoteItems);
            if (t.type === 'internal') summary[key].internal++;
            else if (t.type === 'outsourced' || t.type === 'external') {
                summary[key].outsourced++;
                summary[key].totalOwed += cost;
                summary[key].totalPaid += t.depositPaid;
            }
            if (t.status === 'completed' || t.status === 'verified') summary[key].completed++;
            summary[key].total++;
        });
        return summary;
    }, [tasks, quoteItems, totalRevenue]);

    if (!activeProject) return null;

    const estimatedNetProfit = totalRevenue - totalOutsourcedCost;
    const realPocketProfit = realRevenue - postTaxCosts;
    const profitMargin = totalRevenue > 0 ? (estimatedNetProfit / totalRevenue) * 100 : 0;
    const pocketMargin = realRevenue > 0 ? (realPocketProfit / realRevenue) * 100 : 0;

    // --- Handlers ---
    const handleAddTask = (quoteItemId?: string) => {
        const newTask: ExecutionTask = {
            id: generateId(),
            quoteItemId,
            name: quoteItemId ? `細部執行: ${quoteItems.find(i => i.id === quoteItemId)?.description || ''}` : '新核定任務',
            description: '',
            type: 'internal',
            assignee: '',
            status: 'pending',
            cost: 0,
            depositPaid: 0,
            splitType: 'fixed',
            splitValue: 0,
            quantity: 1,
            payoutStatus: 'pending'
        };
        updateProjectExecution(activeProject.id, [...tasks, newTask]);
        if (showDistribution) setShowDistribution(false);
    };

    const handleUpdateTask = (id: string, updates: Partial<ExecutionTask>) => {
        const newTasks = tasks.map(t => t.id === id ? { ...t, ...updates } : t);
        updateProjectExecution(activeProject.id, newTasks);
    };

    const handleDeleteTask = (id: string) => {
        const newTasks = tasks.filter(t => t.id !== id);
        updateProjectExecution(activeProject.id, newTasks);
    };

    const handleAddTimeLog = (taskId: string, duration: number, note: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const newLog = {
            id: generateId(),
            date: new Date().toISOString(),
            duration,
            note
        };

        const newTask = {
            ...task,
            timeLogs: [...(task.timeLogs || []), newLog]
        };

        handleUpdateTask(taskId, newTask);
        toast.success(`成功紀錄 ${duration} 分鐘工時`);
    };

    const executeSmartTaskImport = () => {
        if (!activeProject.reportContent) return;

        try {
            const lines = activeProject.reportContent.split('\n');
            let importedTasks: ExecutionTask[] = [];
            let inExecutionSection = false;
            let currentHeaders: string[] = [];

            for (let line of lines) {
                line = line.trim();
                if (line.includes('執行任務拆解') || line.includes('Execution Breakdown')) {
                    inExecutionSection = true;
                    continue;
                }
                if (inExecutionSection && (line.startsWith('## ') || line.startsWith('### ')) && !line.includes('執行任務')) {
                    inExecutionSection = false;
                    continue;
                }

                if (inExecutionSection && line.includes('|')) {
                    const cols = line.split('|').map(c => c.trim()).filter(c => c !== '');
                    if (cols.some(c => c.includes('---'))) continue;
                    
                    if (currentHeaders.length === 0) {
                        currentHeaders = cols;
                        continue;
                    }

                    // Parse Task
                    const name = cols[0]?.replace(/\*\*/g, '') || '';
                    const resourceTypeRaw = cols[1] || '';
                    const splitTypeRaw = cols[2] || '';
                    const splitValueRaw = cols[3] || '';

                    if (name.match(/(項目|任務|名稱|範例)/)) continue;

                    let type: any = 'internal';
                    if (resourceTypeRaw.includes('外包發票')) type = 'outsourced';
                    else if (resourceTypeRaw.includes('勞報單')) type = 'external';

                    let splitType: any = 'fixed';
                    if (splitTypeRaw.includes('比例')) splitType = 'percentage';
                    else if (splitTypeRaw.includes('單位')) splitType = 'unit';

                    let splitValue = 0;
                    const valMatch = splitValueRaw.match(/(\d+)/);
                    if (valMatch) splitValue = parseInt(valMatch[0]);

                    importedTasks.push({
                        id: generateId(),
                        name,
                        description: cols[4] || '',
                        type,
                        assignee: '',
                        status: 'pending',
                        cost: splitType === 'fixed' ? splitValue : 0,
                        depositPaid: 0,
                        splitType,
                        splitValue: splitType !== 'fixed' ? splitValue : 0,
                        quantity: 1,
                        payoutStatus: 'pending'
                    });
                }
            }

            if (importedTasks.length > 0) {
                updateProjectExecution(activeProject.id, [...tasks, ...importedTasks]);
                toast.success(`✅ 已智慧拆解並新增 ${importedTasks.length} 個執行任務`);
            } else {
                toast.error('無法從報告中解析出執行任務，請確認報告格式。');
            }
        } catch (e) {
            console.error(e);
            toast.error('智慧拆解失敗');
        }
    };

    const handleDeleteTimeLog = (taskId: string, logId: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const newTask = {
            ...task,
            timeLogs: (task.timeLogs || []).filter(l => l.id !== logId)
        };

        handleUpdateTask(taskId, newTask);
    };

    return (
        <div className="space-y-8 pb-20 font-sans">
            {/* View Mode Toggles */}
            <div className="flex justify-between items-center">
                <div className="flex w-full max-w-2xl bg-slate-100/50 p-1.5 rounded-2xl">
                    <button
                        onClick={() => { setShowFlow(false); setShowDistribution(false); }}
                        className={cn(
                            "flex-1 py-3 rounded-xl text-sm font-black transition-all flex justify-center items-center h-[54px]",
                            ((!showFlow && !showDistribution) && !activeProject.executionTasks?.some(t => t.payoutStatus))
                                ? "bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/30"
                                : "text-slate-500 hover:text-slate-800 bg-black/20 hover:bg-black/30"
                        )}
                    >
                        <Layout className="w-5 h-5 mr-2" />
                        任務清單
                    </button>
                    {canSeeCosts && (
                        <>
                            <button
                                onClick={() => { setShowFlow(true); setShowDistribution(false); }}
                                className={cn(
                                    "flex-1 py-3 mx-2 rounded-xl text-sm font-black transition-all flex justify-center items-center h-[54px]",
                                    (showFlow && !showDistribution)
                                        ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                                        : "text-slate-500 hover:text-slate-800 bg-black/20 hover:bg-black/30"
                                )}
                            >
                                <ArrowRightLeft className="w-5 h-5 mr-2" />
                                預算流向圖
                            </button>
                            <button
                                onClick={() => { setShowDistribution(true); setShowFlow(false); }}
                                className={cn(
                                    "flex-1 py-3 rounded-xl text-sm font-black transition-all flex justify-center items-center h-[54px]",
                                    (showDistribution && !activeProject.executionTasks?.some(t => t.payoutStatus)) // Simplified check for "Summary" mode vs "Payout" mode
                                        ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30"
                                        : "text-slate-500 hover:text-slate-800 bg-black/20 hover:bg-black/30"
                                )}
                            >
                                <Activity className="w-5 h-5 mr-2" />
                                執行分配
                            </button>
                            <button
                                onClick={() => { setShowDistribution(true); setShowFlow(false); }} // Reusing distribution view but we can filter it
                                className={cn(
                                    "flex-1 py-3 ml-2 rounded-xl text-sm font-black transition-all flex justify-center items-center h-[54px] bg-black/20 text-slate-500 hover:text-slate-800",
                                )}
                            >
                                <Briefcase className="w-5 h-5 mr-2" />
                                對帳結算單
                            </button>
                        </>
                    )}
                </div>
                <div className="text-sm font-black text-slate-500 flex items-center bg-gradient-to-r from-slate-100 to-slate-200 px-5 py-2.5 rounded-2xl border border-black/20 shadow-sm">
                    <AlertCircle className="w-4 h-4 mr-2 text-slate-400" />
                    目前身份: {currentTeamRole.toUpperCase()}
                </div>
            </div>

            {/* 1. Summary Cards (Hidden for members) */}
            {!showDistribution && canSeeRevenue && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 p-8 rounded-3xl shadow-xl shadow-cyan-500/20 flex flex-col justify-between overflow-hidden relative group transition-all hover:shadow-2xl hover:shadow-cyan-500/40 hover:-translate-y-1 cursor-pointer" onClick={() => canSeeCosts && setShowFlow(true)}>
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <DollarSign className="w-24 h-24 text-white" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-xs font-black text-indigo-100 uppercase tracking-widest leading-none mb-3">專案總額</p>
                            <h3 className="text-4xl font-black text-white leading-none tracking-tight">${totalRevenue.toLocaleString()}</h3>
                        </div>
                        {canSeeCosts && (
                            <div className="mt-8 flex items-center text-xs relative z-10">
                                <span className="bg-white/20 text-white px-4 py-1.5 rounded-xl font-black mr-3 shadow-sm border border-white/10">100% REVENUE</span>
                                <span className="text-cyan-50 font-black uppercase tracking-wider">點擊查看流向圖</span>
                            </div>
                        )}
                    </div>

                    {canSeeCosts && (
                        <>
                            <div className="bg-gradient-to-br from-orange-400 to-amber-500 p-8 rounded-3xl shadow-xl shadow-orange-500/20 flex flex-col justify-between overflow-hidden relative group transition-all hover:shadow-2xl hover:shadow-orange-500/40 hover:-translate-y-1">
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Truck className="w-24 h-24 text-white" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-xs font-black text-orange-100 uppercase tracking-widest leading-none mb-3">預計外包成本</p>
                                    <h3 className="text-4xl font-black text-white leading-none tracking-tight">${totalOutsourcedCost.toLocaleString()}</h3>
                                </div>
                                <div className="mt-8 flex justify-between items-center text-xs font-black relative z-10">
                                    <span className="text-white bg-white/20 px-3 py-1.5 rounded-lg border border-white/10 shadow-sm">已付: ${totalDepositsPaid.toLocaleString()}</span>
                                    <span className="text-orange-100 uppercase tracking-widest bg-black/10 px-3 py-1.5 rounded-lg">未付: ${(totalOutsourcedCost - totalDepositsPaid).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className={cn(
                                "p-8 rounded-3xl shadow-xl flex flex-col justify-between overflow-hidden relative group transition-all hover:shadow-2xl hover:-translate-y-1",
                                realPocketProfit < 0
                                    ? "bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/20 hover:shadow-rose-500/40"
                                    : "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20 hover:shadow-emerald-500/40"
                            )}>
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <TrendingUp className="w-24 h-24 text-white" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-sm font-black text-emerald-100 uppercase tracking-widest leading-none mb-2">預估完稅後收益</p>
                                    <h3 className="text-3xl font-black leading-none text-white">
                                        ${Math.round(realPocketProfit).toLocaleString()}
                                    </h3>
                                </div>
                                <div className="mt-8 flex flex-col gap-2 relative z-10">
                                    <ProgressBar
                                        value={pocketMargin}
                                        max={100}
                                        barClassName="bg-white"
                                        className="bg-black/20"
                                    />
                                    <div className="flex justify-between items-center text-sm font-black uppercase tracking-tight">
                                        <span className="text-emerald-100">實質利率: {pocketMargin.toFixed(1)}%</span>
                                        {realPocketProfit < 0 && <span className="text-rose-200 animate-pulse font-black bg-rose-900/50 px-2 py-1 rounded">PROFIT WARNING!</span>}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* View Area */}
            {!showFlow && !showDistribution && (
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-black/20 overflow-hidden">
                    <div className="px-8 py-8 border-b border-black/20 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 flex items-center justify-center mr-5 shadow-lg shadow-cyan-200">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <h4 className="font-black text-2xl text-slate-800 leading-none mb-1">
                                    專案執行內容與分派列表
                                </h4>
                                <span className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">TOTAL {tasks.length} TASKS DEFINED</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            {canEditProject && (
                                <>
                                    <button
                                        onClick={() => handleAddTask()}
                                        className="bg-white border-2 border-cyan-600 text-cyan-600 px-6 py-5 rounded-2xl hover:bg-cyan-50 transition-all font-black text-[17px] flex items-center shadow-md active:scale-95 h-[67px]"
                                    >
                                        <Plus className="w-6 h-6 mr-2" />
                                        手動新增
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (!activeProject.reportContent) {
                                                toast.warning('請先生成 AI 報告');
                                                return;
                                            }
                                            executeSmartTaskImport();
                                        }}
                                        className="bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 text-white px-10 py-5 rounded-2xl hover:brightness-110 transition-all font-black text-[17px] flex items-center shadow-xl shadow-cyan-100 active:scale-95 h-[67px] border border-white/20"
                                    >
                                        <Sparkles className="w-6 h-6 mr-2" />
                                        AI 智慧拆解
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                                    <th className="px-8 py-5 border-b border-black/20 min-w-[300px]">執行內容 & 詳細規格</th>
                                    <th className="px-6 py-5 border-b border-black/20 w-44">資源類型</th>
                                    <th className="px-6 py-5 border-b border-black/20 w-64">進度與工時</th>
                                    {canSeeCosts && <th className="px-6 py-5 border-b border-black/20 w-44 text-right">外包預算</th>}
                                    <th className="px-6 py-5 border-b border-black/20 w-44">任務狀態</th>
                                    <th className="px-6 py-5 border-b border-black/20 w-16"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/20">
                                {tasks.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-24 text-center">
                                            <div className="flex flex-col items-center opacity-30">
                                                <Clock className="w-20 h-20 mb-4" />
                                                <p className="text-[24px] font-black italic">目前尚無執行任務，請開始規劃...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    tasks.map((task) => (
                                        <tr key={task.id} className="group hover:bg-slate-50/70 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-2 relative">
                                                    <textarea
                                                        value={task.name}
                                                        disabled={!canEditProject}
                                                        onChange={(e) => handleUpdateTask(task.id, { name: e.target.value })}
                                                        className={cn(
                                                            "bg-transparent border-none p-1 font-black focus:ring-4 focus:ring-cyan-100 text-[21.5px] w-full resize-none overflow-hidden leading-tight rounded-xl transition-all disabled:opacity-80",
                                                            task.payoutStatus === 'paid' ? "text-slate-400 line-through decoration-emerald-500/50" : "text-slate-900"
                                                        )}
                                                        rows={task.name.length > 25 ? 2 : 1}
                                                        placeholder="任務名稱..."
                                                    />
                                                    {task.payoutStatus === 'paid' && (
                                                        <span className="absolute -left-4 top-2 text-[10px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded-md transform -rotate-12 shadow-sm">CLEARED</span>
                                                    )}
                                                    <textarea
                                                        value={task.description}
                                                        disabled={!canEditProject}
                                                        onChange={(e) => handleUpdateTask(task.id, { description: e.target.value })}
                                                        className="bg-transparent border-none p-1 text-[17px] text-slate-500 font-bold focus:ring-4 focus:ring-indigo-50 w-full resize-none h-14 overflow-hidden rounded-xl disabled:opacity-80"
                                                        placeholder="輸入詳細規格或驗收標準..."
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl w-fit border border-black/20">
                                                    <button
                                                        onClick={() => {
                                                            handleUpdateTask(task.id, { type: 'internal' });
                                                            toast.info('標記為「內部員工執行」，不產生進項抵扣。');
                                                        }}
                                                        className={cn(
                                                            "p-3.5 rounded-lg transition-all",
                                                            task.type === 'internal' ? "bg-white text-cyan-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                                        )}
                                                        title="內部成員"
                                                    >
                                                        <User className="w-6 h-6" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleUpdateTask(task.id, { type: 'outsourced' });
                                                            toast.success('標記為「外包發包 (開發票)」，可抵扣 5% 營業稅。');
                                                        }}
                                                        className={cn(
                                                            "p-3.5 rounded-lg transition-all",
                                                            task.type === 'outsourced' ? "bg-white text-orange-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                                        )}
                                                        title="外部廠商 (開發票)"
                                                    >
                                                        <Truck className="w-6 h-6" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleUpdateTask(task.id, { type: 'external' });
                                                            toast.warning('標記為「外部人才 (勞保單)」，需扣繳 2.11% 二代健保。');
                                                        }}
                                                        className={cn(
                                                            "p-3.5 rounded-lg transition-all",
                                                            task.type === 'external' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                                        )}
                                                        title="外部人才 (勞報單)"
                                                    >
                                                        <Briefcase className="w-6 h-6" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="space-y-4">
                                                    <div className="relative group/input">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                                                        <input
                                                            type="text"
                                                            value={task.assignee}
                                                            disabled={!canEditProject}
                                                            onChange={(e) => handleUpdateTask(task.id, { assignee: e.target.value })}
                                                            className="w-full bg-slate-100 border border-transparent focus:border-cyan-200 focus:bg-white rounded-xl pl-12 py-4 text-[17px] font-black transition-all text-slate-900 placeholder:font-bold disabled:opacity-80"
                                                            placeholder="填寫負責人..."
                                                        />
                                                    </div>

                                                    {/* Time Tracker Row */}
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 bg-slate-50 border border-black/20 rounded-xl px-3 py-2 flex items-center justify-between">
                                                            <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                                <Clock className="w-3 h-3 mr-1.5" />
                                                                {Math.round((task.timeLogs || []).reduce((sum, l) => sum + l.duration, 0) / 6).toFixed(1)}H Logged
                                                            </div>
                                                            <button
                                                                onClick={() => setManualTimerTask({ id: task.id, name: task.name })}
                                                                className="text-cyan-600 hover:text-cyan-800"
                                                                title="手動紀錄工時"
                                                                type="button"
                                                            >
                                                                <Plus className="w-[17px] h-[17px]" />
                                                            </button>
                                                        </div>
                                                        <button
                                                            disabled={activeTimerTaskId !== null && activeTimerTaskId !== task.id}
                                                            onClick={() => {
                                                                if (activeTimerTaskId === task.id) {
                                                                    const duration = Math.round((Date.now() - (timerStartTime || 0)) / 60000);
                                                                    handleAddTimeLog(task.id, duration, '計時紀錄');
                                                                    setActiveTimerTaskId(null);
                                                                    setTimerStartTime(null);
                                                                } else {
                                                                    setActiveTimerTaskId(task.id);
                                                                    setTimerStartTime(Date.now());
                                                                }
                                                            }}
                                                            className={cn(
                                                                "w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-md",
                                                                activeTimerTaskId === task.id
                                                                    ? "bg-gradient-to-br from-rose-500 to-red-600 text-white animate-pulse shadow-rose-200"
                                                                    : "bg-cyan-100 text-cyan-600 hover:bg-white hover:shadow-cyan-100"
                                                            )}
                                                        >
                                                            {activeTimerTaskId === task.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                            {canSeeCosts && (
                                                <td className="px-6 py-6 text-right">
                                                    {(task.type === 'outsourced' || task.type === 'external') ? (
                                                        <div className="flex flex-col gap-3 items-end">
                                                            {/* Approval Status Badge */}
                                                            {task.budgetStatus === 'pending_approval' && (
                                                                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl mb-1 animate-pulse">
                                                                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                                                                    <span className="text-[11px] font-black text-amber-700">待預算審核</span>
                                                                    {canApproveBudget && (
                                                                        <div className="flex gap-1 ml-2">
                                                                            <button 
                                                                                onClick={() => handleUpdateTask(task.id, { budgetStatus: 'approved' })}
                                                                                className="bg-emerald-500 text-white p-1 rounded-md hover:bg-emerald-600 transition-colors"
                                                                                title="批准預算"
                                                                            >
                                                                                <CheckCircle2 className="w-3 h-3" />
                                                                            </button>
                                                                            <button 
                                                                                onClick={() => handleUpdateTask(task.id, { budgetStatus: 'rejected' })}
                                                                                className="bg-rose-500 text-white p-1 rounded-md hover:bg-rose-600 transition-colors"
                                                                                title="駁回"
                                                                            >
                                                                                <Trash2 className="w-3 h-3" />
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                            {task.budgetStatus === 'approved' && (
                                                                <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg mb-1">
                                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                                    <span className="text-[10px] font-black text-emerald-600">預算已核定</span>
                                                                </div>
                                                            )}

                                                            {canEditProject && (
                                                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                                                    <button
                                                                        onClick={() => handleUpdateTask(task.id, { 
                                                                            splitType: 'fixed',
                                                                            budgetStatus: canApproveBudget ? task.budgetStatus : 'pending_approval'
                                                                        })}
                                                                        className={cn("px-2 py-1 text-[10px] font-black rounded", task.splitType === 'fixed' || !task.splitType ? "bg-white shadow-sm text-cyan-600" : "text-slate-400")}
                                                                    >固定</button>
                                                                    <button
                                                                        onClick={() => handleUpdateTask(task.id, { 
                                                                            splitType: 'percentage',
                                                                            budgetStatus: canApproveBudget ? task.budgetStatus : 'pending_approval'
                                                                        })}
                                                                        className={cn("px-2 py-1 text-[10px] font-black rounded mx-1", task.splitType === 'percentage' ? "bg-white shadow-sm text-cyan-600" : "text-slate-400")}
                                                                    >% 抽成</button>
                                                                    <button
                                                                        onClick={() => handleUpdateTask(task.id, { 
                                                                            splitType: 'unit',
                                                                            budgetStatus: canApproveBudget ? task.budgetStatus : 'pending_approval'
                                                                        })}
                                                                        className={cn("px-2 py-1 text-[10px] font-black rounded", task.splitType === 'unit' ? "bg-white shadow-sm text-cyan-600" : "text-slate-400")}
                                                                    >單位</button>
                                                                </div>
                                                            )}

                                                            {task.splitType === 'percentage' ? (
                                                                <div className="flex items-center gap-2">
                                                                    <input
                                                                        type="number"
                                                                        value={task.splitValue || 0}
                                                                        disabled={!canEditProject}
                                                                        onChange={(e) => handleUpdateTask(task.id, { 
                                                                            splitValue: Number(e.target.value),
                                                                            budgetStatus: canApproveBudget ? task.budgetStatus : 'pending_approval'
                                                                        })}
                                                                        className="w-16 text-right bg-indigo-50 font-black text-lg p-2 rounded-lg border-b-2 border-indigo-400 focus:ring-0 placeholder:text-indigo-200 disabled:bg-transparent"
                                                                        placeholder="40"
                                                                    />
                                                                    <span className="text-sm font-black text-indigo-500">%</span>
                                                                </div>
                                                            ) : task.splitType === 'unit' ? (
                                                                <div className="flex flex-col gap-1 items-end">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[10px] font-bold text-slate-400">單價</span>
                                                                        <input
                                                                            type="number"
                                                                            value={task.splitValue || 0}
                                                                            disabled={!canEditProject}
                                                                            onChange={(e) => handleUpdateTask(task.id, { 
                                                                                splitValue: Number(e.target.value),
                                                                                budgetStatus: canApproveBudget ? task.budgetStatus : 'pending_approval'
                                                                            })}
                                                                            className="w-20 text-right bg-slate-50 font-bold text-sm p-1 rounded-md border-b disabled:bg-transparent"
                                                                        />
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[10px] font-bold text-slate-400">數量</span>
                                                                        <input
                                                                            type="number"
                                                                            value={task.quantity || 1}
                                                                            disabled={!canEditProject}
                                                                            onChange={(e) => handleUpdateTask(task.id, { 
                                                                                quantity: Number(e.target.value),
                                                                                budgetStatus: canApproveBudget ? task.budgetStatus : 'pending_approval'
                                                                            })}
                                                                            className="w-20 text-right bg-slate-50 font-bold text-sm p-1 rounded-md border-b disabled:bg-transparent"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <input
                                                                    title="外包預算"
                                                                    type="number"
                                                                    value={task.cost}
                                                                    disabled={!canEditProject}
                                                                    onChange={(e) => handleUpdateTask(task.id, { 
                                                                        cost: Number(e.target.value),
                                                                        budgetStatus: canApproveBudget ? task.budgetStatus : 'pending_approval'
                                                                    })}
                                                                    className="w-24 text-right bg-slate-100 font-black text-lg p-2 rounded-lg border-b-2 border-indigo-400 focus:ring-0 disabled:bg-transparent"
                                                                />
                                                            )}

                                                            <div className="text-[11px] font-black text-slate-500 bg-slate-200/50 px-2 py-1 rounded">
                                                                總額: ${calculateTaskCost(task, quoteItems).toLocaleString()}
                                                            </div>

                                                            <div className="flex items-center gap-2 border-t border-black/10 pt-2 w-full justify-end">
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">已付訂金</span>
                                                                <input
                                                                    title="已付訂金"
                                                                    type="number"
                                                                    value={task.depositPaid}
                                                                    disabled={!canEditPayout || task.budgetStatus !== 'approved'}
                                                                    onChange={(e) => handleUpdateTask(task.id, { depositPaid: Number(e.target.value) })}
                                                                    className="w-16 text-right bg-transparent font-bold text-xs p-1 border-b border-black/20 disabled:border-none"
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Internal Resource</span>
                                                    )}
                                                </td>
                                            )}
                                            <td className="px-6 py-6">
                                                <select
                                                    title="任務進度狀態"
                                                    value={task.status}
                                                    onChange={(e) => handleUpdateTask(task.id, { status: e.target.value as any })}
                                                    className={cn(
                                                        "w-full bg-slate-100 border-2 rounded-2xl px-4 py-4 text-[17px] font-black focus:ring-4 focus:ring-cyan-100 outline-none transition-all cursor-pointer h-[58px]",
                                                        task.status === 'completed' || task.status === 'verified' ? "text-emerald-700 border-emerald-200 bg-emerald-50" :
                                                            task.status === 'in_progress' ? "text-cyan-900 border-cyan-200 bg-cyan-50" : "text-slate-600 border border-black/20"
                                                    )}
                                                >
                                                    <option value="pending">⚪ 待處理</option>
                                                    <option value="in_progress">🟡 執行中</option>
                                                    <option value="completed">✅ 已完成</option>
                                                    <option value="verified">🎖️ 核對通過</option>
                                                </select>

                                                {(task.type === 'outsourced' || task.type === 'external') && canSeeCosts && (
                                                    <div className="relative">
                                                        <select
                                                            title="對帳支付狀態"
                                                            value={task.payoutStatus || 'pending'}
                                                            disabled={!canEditPayout || task.budgetStatus !== 'approved'}
                                                            onChange={(e) => handleUpdateTask(task.id, { payoutStatus: e.target.value as any })}
                                                            className={cn(
                                                                "w-full mt-2 border rounded-xl px-3 py-2 text-[11px] font-black outline-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                                                                task.payoutStatus === 'paid' ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                                                                    task.payoutStatus === 'invoice_received' ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-400 border-black/10"
                                                            )}
                                                        >
                                                            <option value="pending">待領取/未核發</option>
                                                            <option value="invoice_received">已收件/審核中</option>
                                                            <option value="paid">已支付/結清</option>
                                                        </select>
                                                        {task.budgetStatus !== 'approved' && (
                                                            <div className="absolute -top-6 left-0 text-[9px] font-black text-rose-500 uppercase flex items-center bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 shadow-sm">
                                                                <AlertCircle className="w-2.5 h-2.5 mr-1" />
                                                                Budget Not Approved
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                {canEditProject && (
                                                    <button
                                                        onClick={() => handleDeleteTask(task.id)}
                                                        className="opacity-0 group-hover:opacity-100 w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all ml-auto"
                                                        title="刪除任務"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Quick Add Section */}
                    {canEditProject && (
                        <div className="bg-slate-50/80 p-8 border-t border-black/20">
                            <div className="flex flex-col space-y-5">
                                <p className="font-black flex items-center text-cyan-600">
                                    <ArrowRightLeft className="w-5 h-5 mr-2" />
                                    <span className="text-[14.5px]">依據報價明細快速拆解任務</span>
                                    <span className="text-xs ml-2 uppercase tracking-widest text-cyan-600/80">(QUICK BREAKDOWN)</span>
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                    {quoteItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleAddTask(item.id)}
                                            className="bg-white border border-black/20 text-slate-700 p-4 rounded-2xl text-[14.5px] font-black hover:border-indigo-400 hover:text-indigo-600 hover:shadow-xl hover:shadow-indigo-50/50 hover:bg-gradient-to-br hover:from-white hover:to-indigo-50/30 transition-all text-left flex items-start group relative min-h-[96px]"
                                        >
                                            <Plus className="w-5 h-5 mr-2 mt-0.5 shrink-0 text-slate-300 group-hover:text-indigo-500" />
                                            <span className="line-clamp-3 leading-snug">{item.description}</span>
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handleAddTask()}
                                        className="bg-white border border-dashed border-black/20 text-slate-400 p-4 rounded-2xl text-[14.5px] font-black hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all flex items-center justify-center min-h-[96px]"
                                    >
                                        <Plus className="w-7 h-7 mr-2" />
                                        自定義項目
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Visualization Views */}
            {showFlow && !showDistribution && (
                <div className="bg-white p-10 rounded-3xl border border-indigo-50 shadow-sm animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex justify-between items-center mb-12">
                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
                            <PieChart className="w-5 h-5 mr-3 text-indigo-500" />
                            預算流向分析圖 (BUDGET FLOW)
                        </h4>
                        <button onClick={() => setShowFlow(false)} className="text-sm font-black text-indigo-600 bg-indigo-50 px-5 py-2 rounded-full hover:bg-indigo-100 transition-all">
                            返回清單
                        </button>
                    </div>
                    {/* Simplified diagram for space */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-16 py-10 -translate-y-[50px]">
                        <div className="bg-gradient-to-br from-cyan-600 to-blue-700 text-white py-9 px-10 rounded-3xl text-center shadow-xl shadow-cyan-100 w-[330px]">
                            <p className="text-[13px] opacity-70 font-black uppercase mb-2 text-cyan-50 tracking-widest">專案營收</p>
                            <p className="text-[39px] font-black tracking-tight">${totalRevenue.toLocaleString()}</p>
                        </div>
                        <ArrowRightLeft className="w-10 h-10 text-slate-200 rotate-90 md:rotate-0" />
                        <div className="flex flex-col gap-6">
                            <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white py-6 px-8 rounded-3xl text-center shadow-lg shadow-emerald-50 w-[310px]">
                                <p className="text-[13px] opacity-70 font-black mb-1.5 uppercase tracking-widest">預計毛利</p>
                                <p className="text-[26px] font-black">${estimatedNetProfit.toLocaleString()}</p>
                            </div>
                            <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white py-6 px-8 rounded-3xl text-center shadow-lg shadow-orange-50 w-[310px]">
                                <p className="text-[13px] opacity-70 font-black mb-1.5 uppercase tracking-widest">外包支出</p>
                                <p className="text-[26px] font-black">${totalOutsourcedCost.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDistribution && (
                <div className="bg-white p-10 rounded-3xl border border-indigo-50 shadow-sm animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex justify-between items-center mb-10">
                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
                            <Activity className="w-5 h-5 mr-3 text-indigo-500" />
                            執行分配透視 (ASSIGNMENT INSIGHT)
                        </h4>
                        <button onClick={() => setShowDistribution(false)} className="text-sm font-black text-indigo-600 bg-indigo-50 px-5 py-2 rounded-full hover:bg-indigo-100 transition-all">
                            返回清單
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(staffSummary).map(([name, stats]) => (
                            <div key={name} className="bg-white p-8 rounded-[2rem] border border-black/10 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center">
                                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mr-4 shadow-sm", name === '未指派' ? "bg-slate-200" : "bg-indigo-600")}>
                                                <User className={cn("w-8 h-8", name === '未指派' ? "text-slate-400" : "text-white")} />
                                            </div>
                                            <div>
                                                <h5 className="font-black text-xl text-slate-900 leading-tight">{name}</h5>
                                                <p className="text-xs text-slate-400 font-black uppercase tracking-widest">{stats.total} 個專案任務</p>
                                            </div>
                                        </div>
                                        {stats.outsourced > 0 && (
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">應付結算</p>
                                                <p className="text-xl font-black text-indigo-600">${stats.totalOwed.toLocaleString()}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between text-xs font-black uppercase">
                                            <span className="text-slate-400">任務進度</span>
                                            <span className="text-indigo-600 font-black">{Math.round((stats.completed / stats.total) * 100)}%</span>
                                        </div>
                                        <ProgressBar
                                            value={(stats.completed / stats.total) * 100}
                                            barClassName="bg-indigo-600 duration-700"
                                        />
                                        <div className="flex justify-between text-xs font-black text-slate-500">
                                            <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> 後續: {stats.total - stats.completed}</span>
                                            <span className="text-emerald-600 flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> 已完: {stats.completed}</span>
                                        </div>
                                    </div>
                                </div>

                                {stats.outsourced > 0 && (
                                    <div className="bg-slate-50 p-5 rounded-2xl border border-black/5 space-y-3">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-slate-400">已付訂金</span>
                                            <span className="font-black text-slate-600">${stats.totalPaid.toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex justify-between items-center text-sm border-t border-black/5 pt-2">
                                                <span className="font-black text-slate-400">待結餘額</span>
                                                <span className={cn("font-black text-lg", (stats.totalOwed - stats.totalPaid) > 0 ? "text-rose-500" : "text-emerald-500")}>
                                                    ${(stats.totalOwed - stats.totalPaid).toLocaleString()}
                                                </span>
                                            </div>
                                            <ProgressBar 
                                                value={(stats.totalPaid / stats.totalOwed) * 100} 
                                                className="h-1.5 bg-slate-200"
                                                barClassName={cn((stats.totalPaid / stats.totalOwed) >= 1 ? "bg-emerald-500" : "bg-orange-400")}
                                            />
                                        </div>
                                        <button 
                                            disabled={(stats.totalOwed - stats.totalPaid) <= 0}
                                            onClick={() => {
                                                const newTasks = tasks.map(t => 
                                                    t.assignee === name && (t.type === 'outsourced' || t.type === 'external') 
                                                    ? { ...t, payoutStatus: 'paid' as const } 
                                                    : t
                                                );
                                                updateProjectExecution(activeProject.id, newTasks);
                                                toast.success(`已將 ${name} 的所有外包項目標記為已支付`);
                                            }}
                                            className="w-full py-2.5 bg-white border border-black/10 rounded-xl text-[11px] font-black text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all disabled:opacity-30 disabled:hover:bg-white"
                                        >
                                            {(stats.totalOwed - stats.totalPaid) <= 0 ? '✅ 款項已結清' : '批次標記為已支付'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    </div>
                </div>
            )}

            {/* PM Help Card */}
            <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-[2.5rem] py-9 px-10 flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-10 shadow-2xl shadow-cyan-100 relative overflow-hidden">
                <div className="absolute -right-16 -bottom-16 opacity-10">
                    <PieChart className="w-80 h-80 text-white" />
                </div>
                <div className="bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 p-6 rounded-3xl shadow-lg shadow-yellow-500/30 shrink-0">
                    <PieChart className="w-12 h-12 text-white" />
                </div>
                <div className="relative z-10 flex-1">
                    <div className="flex justify-between items-start mb-4">
                        <h5 className="font-black text-white text-2xl tracking-tight">專業 PM 的稅務控帳思維</h5>
                        <div className="hidden md:flex flex-wrap gap-2 justify-end">
                            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-black text-white/60">
                                #營業稅抵扣 #401報表同步 #勞務報酬單 #二代健保
                            </div>
                        </div>
                    </div>
                    <p className="text-indigo-100/80 text-lg leading-relaxed max-w-3xl font-medium">
                        此為內部估算區，發放費用時請務必考量稅務成本。若是 **發票 (公司)** 可抵扣 5% 營業稅；
                        若是 **個人 (勞務)**，請務必確認是否已預留代扣所得稅與二代健保空間。
                    </p>
                    <div className="mt-8 flex md:hidden flex-wrap gap-4">
                        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-black text-white/60">
                            #營業稅抵扣 #401報表同步 #勞務報酬單 #二代健保
                        </div>
                    </div>
                </div>
            </div>
            {/* Manual Timer Modal */}
            <ManualTimerModal
                isOpen={!!manualTimerTask}
                taskName={manualTimerTask?.name || ''}
                onClose={() => setManualTimerTask(null)}
                onConfirm={(minutes, note) => {
                    if (manualTimerTask) {
                        handleAddTimeLog(manualTimerTask.id, minutes, note);
                    }
                }}
            />
        </div>
    );
}
