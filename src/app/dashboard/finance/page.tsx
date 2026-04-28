'use client';

import { useState, useEffect, useMemo } from 'react';
import { useProject, Expense } from '@/context/ProjectContext';
import { Copy, Plus, Trash2, Calendar, Wallet, Receipt, ArrowUpRight, ArrowDownLeft, FileText, CheckCircle2, ExternalLink, Clock, AlertTriangle, Info, Download, Upload, X, Globe, Building2, TrendingUp, BarChart3, Calculator, ChevronRight, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { PRICING_CONFIG } from '@/config/subscription';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const TOOLTIP_STYLE = {
    borderRadius: '12px',
    border: 'none',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    fontWeight: 700
};

const FINANCE_GRADIENTS = [
    "from-indigo-600 to-blue-700",
    "from-emerald-500 to-teal-600",
    "from-violet-600 to-purple-700",
    "from-rose-500 to-pink-600",
    "from-cyan-500 to-blue-600",
    "from-orange-500 to-amber-600"
];

export default function FinancePage() {
    const { projects, expenses, addExpense, deleteExpense, updateProjectInvoiceStatus, importExpenses, userTier } = useProject();
    const router = useRouter();

    const plan = PRICING_CONFIG[userTier as keyof typeof PRICING_CONFIG];

    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [period, setPeriod] = useState<string>('01-02'); 

    const [activeTab, setActiveTab] = useState<'expenses' | 'income'>('expenses');
    const [showGuide, setShowGuide] = useState(false);
    const [newExpense, setNewExpense] = useState<Partial<Expense>>({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: 0,
        taxType: 'inclusive',
        category: 'office'
    });

    const [daysUntilDeadline, setDaysUntilDeadline] = useState<number>(0);
    const [nextDeadlineDate, setNextDeadlineDate] = useState<string>('');

    useEffect(() => {
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // 1-12

        let targetMonth, targetYear;
        if (currentMonth % 2 !== 0) {
            if (today.getDate() <= 15) {
                targetMonth = currentMonth;
                targetYear = today.getFullYear();
            } else {
                targetMonth = currentMonth + 2;
                targetYear = today.getFullYear();
            }
        } else {
            targetMonth = currentMonth + 1;
            targetYear = today.getFullYear();
        }

        if (targetMonth > 12) {
            targetMonth -= 12;
            targetYear += 1;
        }

        const deadline = new Date(targetYear, targetMonth - 1, 15);
        const diffTime = deadline.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setDaysUntilDeadline(diffDays);
        setNextDeadlineDate(`${targetYear}/${targetMonth}/15`);
    }, []);

    // Paywall Check - Moved after hooks to satisfy Rules of Hooks
    if (!plan?.features.financeModule) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-6">
                <div className="max-w-2xl w-full bg-white rounded-[2rem] border border-black/10 shadow-2xl overflow-hidden relative">
                    {/* Background Accent */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />

                    <div className="relative p-12 text-center">
                        <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-200 rotate-3">
                            <Lock className="w-10 h-10 text-white" />
                        </div>

                        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">解鎖專業財務防禦</h2>
                        <p className="text-lg text-slate-500 font-medium mb-10 leading-relaxed max-w-md mx-auto">
                            免費版不具備財務報表與稅務自動化功能。升級至 <span className="text-indigo-600 font-bold">專業版 (Pro)</span>，讓我們為您的利潤把關，自動計算 20% 服務費與營業稅。
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
                            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <TrendingUp className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">獲利趨勢分析</p>
                                    <p className="text-xs text-slate-400">洞察每一分錢的流向</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <Receipt className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">401 報表自動化</p>
                                    <p className="text-xs text-slate-400">複製貼上即可完成報稅</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <Calculator className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">服務費加價提醒</p>
                                    <p className="text-xs text-slate-400">確保 20% 利潤不漏接</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <Wallet className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">現金流水位監測</p>
                                    <p className="text-xs text-slate-400">預警資金缺口，安心接案</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push('/dashboard/settings')}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                        >
                            立即升級專業版 — NT$ 2,900 /月
                        </button>

                        <p className="mt-6 text-xs text-slate-400 font-bold flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-indigo-400" /> 解鎖 14+ 實戰模組與法律護盾
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Filters
    const startDate = `${year}-${period.split('-')[0]}-01`;
    // End date calculation
    const endMonth = period.split('-')[1];
    const lastDayMap: Record<string, string> = { '02': '29', '04': '30', '06': '30', '08': '31', '10': '31', '12': '31' };
    const endDate = `${year}-${endMonth}-${lastDayMap[endMonth] || '30'}`;


    // Helper: Is date in range?
    const isInPeriod = (dateStr: string) => {
        return dateStr >= startDate && dateStr <= endDate;
    };

    // --- Calculations ---

    // 1. Income (Output Tax)
    const incomeProjects = projects.filter(p =>
        (p.invoiceStatus === 'billed' || p.invoiceStatus === 'paid') &&
        p.invoiceDate && isInPeriod(p.invoiceDate)
    );

    const totalSales = incomeProjects.reduce((sum, p) => {
        if (!p.quotationItems) return sum;

        let subtotal = p.quotationItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
        let taxMode = p.quotationSettings?.taxMode || 'exclusive';

        if (taxMode === 'exclusive') {
            return sum + subtotal;
        } else if (taxMode === 'inclusive') {
            return sum + Math.round(subtotal / 1.05);
        } else {
            return sum + subtotal;
        }
    }, 0);

    const outputTax = Math.round(totalSales * 0.05);

    // 2. Expenses (Input Tax)
    const periodExpenses = expenses.filter(e => isInPeriod(e.date));

    let totalPurchases = 0; // Pre-tax amount
    let inputTax = 0;

    periodExpenses.forEach(e => {
        if (e.taxType === 'exclusive') {
            const preTax = Math.round(e.amount / 1.05);
            totalPurchases += preTax;
            inputTax += (e.amount - preTax);
        } else if (e.taxType === 'inclusive') {
            const preTax = Math.round(e.amount / 1.05);
            totalPurchases += preTax;
            inputTax += (e.amount - preTax);
        } else {
            // None
            totalPurchases += e.amount; // No tax
        }
    });

    const payableTax = Math.max(0, outputTax - inputTax);

    // --- Advanced Analytics Data ---
    const monthlyData = useMemo(() => {
        const data: Record<string, { month: string, revenue: number, expense: number, profit: number }> = {};

        // Months for current year
        for (let i = 1; i <= 12; i++) {
            const m = i.toString().padStart(2, '0');
            const key = `${year}-${m}`;
            data[key] = { month: `${i}月`, revenue: 0, expense: 0, profit: 0 };
        }

        // Add Income
        projects.forEach(p => {
            if ((p.invoiceStatus === 'billed' || p.invoiceStatus === 'paid') && p.invoiceDate && p.invoiceDate.startsWith(year.toString())) {
                const m = p.invoiceDate.split('-')[1];
                const key = `${year}-${m}`;
                if (data[key]) {
                    let subtotal = p.quotationItems?.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0) || 0;
                    let taxMode = p.quotationSettings?.taxMode || 'exclusive';
                    let amount = taxMode === 'inclusive' ? Math.round(subtotal / 1.05) : subtotal;
                    data[key].revenue += amount;
                }
            }
        });

        // Add Expenses
        expenses.forEach(e => {
            if (e.date.startsWith(year.toString())) {
                const m = e.date.split('-')[1];
                const key = `${year}-${m}`;
                if (data[key]) {
                    const amount = e.taxType === 'inclusive' || e.taxType === 'exclusive' ? Math.round(e.amount / 1.05) : e.amount;
                    data[key].expense += amount;
                }
            }
        });

        // Calculate Profit
        Object.keys(data).forEach(k => {
            data[k].profit = data[k].revenue - data[k].expense;
        });

        return Object.values(data);
    }, [year, projects, expenses]);

    const annualTotalRevenue = monthlyData.reduce((sum: number, d) => sum + d.revenue, 0);
    const annualTotalExpense = monthlyData.reduce((sum: number, d) => sum + d.expense, 0);
    const annualNetProfit = annualTotalRevenue - annualTotalExpense;

    // Estimate Annual Income Tax (Taiwan Basic Example: 20% for Company)
    const estimatedAnnualTax = Math.max(0, annualNetProfit * 0.2);

    // --- State for Forms ---

    const handleAddExpense = () => {
        if (!newExpense.description || !newExpense.amount) {
            toast.error('請填寫完整支出資訊');
            return;
        }
        addExpense(newExpense as Omit<Expense, 'id'>);
        setNewExpense({
            date: new Date().toISOString().split('T')[0],
            description: '',
            amount: 0,
            taxType: 'inclusive',
            category: 'office'
        });
        toast.success('支出已記錄');
    };

    const handleExportData = () => {
        const data = {
            expenses: expenses,
            version: '8.0',
            exportedAt: new Date().toISOString()
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `finance_backup_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        toast.success('財務資料備份完成');
    };

    // --- Dynamic Alert Logic ---
    const today = new Date();
    const currMonth = today.getMonth() + 1; // 1-12
    const currDay = today.getDate();
    const alerts = [];

    // 1. Invoice Procurement Alert
    // Even month 20th ~ next Odd month 15th
    const isEven = currMonth % 2 === 0;
    const isOdd = currMonth % 2 !== 0;
    if ((isEven && currDay >= 20) || (isOdd && currDay <= 15)) {
        let startM = isEven ? currMonth + 1 : currMonth;
        let endM = isEven ? currMonth + 2 : currMonth + 1;
        if (startM > 12) startM -= 12;
        if (endM > 12) endM -= 12;
        alerts.push({
            id: 'invoice',
            type: 'warning',
            icon: <Receipt className="w-5 h-5" />,
            title: '發票申領提醒',
            message: `本月正在辦理 ${startM}月～${endM}月 的新發票申領流程，請儘速確認庫存並完成購票。`
        });
    }

    // 2. May Income Tax Alert
    if (currMonth === 5) {
        alerts.push({
            id: 'income-tax',
            type: 'error',
            icon: <AlertTriangle className="w-5 h-5" />,
            title: '所得稅申報期限 (May)',
            message: `五月份為所得稅申報季！請在 5/31 前完成去年度營利事業所得稅申報，避免罰鍰。`
        });
    }

    // 3. Year-end / Jan Withholding Alert
    if (currMonth === 1) {
        alerts.push({
            id: 'year-end',
            type: 'warning',
            icon: <Clock className="w-5 h-5" />,
            title: '各類所得扣繳申報',
            message: `一月份為去年度「各類所得」扣繳申報期限，請務必在 1/31 前完成各項勞務、租金申報。`
        });
    }

    // 4. Deadline near alert (within 5 days)
    if (daysUntilDeadline > 0 && daysUntilDeadline <= 5) {
        alerts.push({
            id: 'deadline',
            type: 'error',
            icon: <AlertTriangle className="w-5 h-5" />,
            title: '報稅截止日將至',
            message: `本期營業稅申報僅剩 ${daysUntilDeadline} 天！截止日期為 ${nextDeadlineDate}，請儘速完成。`
        });
    }

    return (
        <div className="w-full p-6 animate-in fade-in pb-20">
            {/* Financial Alerts Banner */}
            {alerts.length > 0 && (
                <div className="space-y-3 mb-8">
                    {alerts.map(alert => (
                        <div
                            key={alert.id}
                            className={cn(
                                "flex items-start p-4 rounded-xl border animate-in slide-in-from-top-4 duration-500",
                                alert.type === 'warning' ? "bg-amber-50 border-amber-100 text-amber-800" :
                                    alert.type === 'error' ? "bg-rose-50 border-rose-100 text-rose-800" :
                                        "bg-indigo-50 border-indigo-100 text-indigo-800"
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-lg mr-4",
                                alert.type === 'warning' ? "bg-amber-100/50" :
                                    alert.type === 'error' ? "bg-rose-100/50" :
                                        "bg-indigo-100/50"
                            )}>
                                {alert.icon}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-black text-sm uppercase tracking-wider mb-1">{alert.title}</h4>
                                <p className="text-sm font-medium opacity-90 leading-relaxed">{alert.message} <span className="underline cursor-pointer ml-1 font-bold">查看詳情 →</span></p>
                            </div>
                            <button title="關閉提醒" className="text-current opacity-40 hover:opacity-100 transition-opacity">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">財務與稅務</h1>
                    <p className="text-slate-500">財務儀表板 (Finance Dashboard)</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Backup Controls */}
                    <div className="flex items-center space-x-2 mr-4">
                        <button
                            onClick={handleExportData}
                            className="bg-white border border-black/30 text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-xl text-base font-medium flex items-center shadow-sm transition-colors h-12"
                            title="匯出備份 (Export)"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            備份資料
                        </button>
                        <label className="bg-white border border-black/30 text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-xl text-base font-medium flex items-center shadow-sm transition-colors cursor-pointer h-12">
                            <Upload className="w-5 h-5 mr-2" />
                            還原資料
                            <input
                                type="file"
                                className="hidden"
                                accept=".json"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        try {
                                            const json = JSON.parse(event.target?.result as string);
                                            if (json.expenses && Array.isArray(json.expenses)) {
                                                importExpenses(json.expenses);
                                                toast.success(`成功匯入 ${json.expenses.length} 筆支出資料`);
                                            } else {
                                                toast.error('無效的備份檔案');
                                            }
                                        } catch (err) {
                                            toast.error('檔案解析失敗');
                                        }
                                    };
                                    reader.readAsText(file);
                                    e.target.value = '';
                                }}
                            />
                        </label>
                    </div>

                    <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border shadow-sm h-12">
                        <Calendar className="w-5 h-5 text-gray-500 ml-2" />
                        <select
                            title="年份"
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            className="bg-transparent border-none text-base font-medium focus:ring-0 cursor-pointer outline-none"
                        >
                            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}年</option>)}
                        </select>
                        <div className="w-px h-6 bg-gray-300" />
                        <select
                            title="期別"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="bg-transparent border-none text-base font-medium focus:ring-0 cursor-pointer outline-none"
                        >
                            <option value="01-02">1-2月 (3月報稅)</option>
                            <option value="03-04">3-4月 (5月報稅)</option>
                            <option value="05-06">5-6月 (7月報稅)</option>
                            <option value="07-08">7-8月 (9月報稅)</option>
                            <option value="09-10">9-10月 (11月報稅)</option>
                            <option value="11-12">11-12月 (1月報稅)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Top Row: Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 rounded-2xl p-8 shadow-xl shadow-cyan-900/10 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <ArrowUpRight className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center text-cyan-50 font-bold mb-3 text-base uppercase tracking-wider">
                            <ArrowUpRight className="w-5 h-5 mr-1" />
                            本期銷項 (Sales)
                        </div>
                        <div className="text-3xl font-black tracking-tight">NT$ {totalSales.toLocaleString()}</div>
                        <div className="text-sm text-cyan-50/70 mt-3 font-medium">
                            銷項稅額 (5%): <span className="font-black text-white">NT$ {outputTax.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 shadow-xl shadow-emerald-900/10 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <ArrowDownLeft className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center text-amber-100 font-bold mb-3 text-base uppercase tracking-wider">
                            <ArrowDownLeft className="w-5 h-5 mr-1" />
                            本期進項 (Expenses)
                        </div>
                        <div className="text-3xl font-black tracking-tight">NT$ {totalPurchases.toLocaleString()}</div>
                        <div className="text-sm text-amber-100/70 mt-3 font-medium">
                            可扣抵稅額 (5%): <span className="font-black text-white">NT$ {inputTax.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-8 shadow-xl shadow-violet-900/10 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Wallet className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center text-blue-100 font-bold mb-3 text-base uppercase tracking-wider">
                            <Wallet className="w-5 h-5 mr-1" />
                            應納稅額 (Payable)
                        </div>
                        <div className="text-5xl font-black tracking-tighter">
                            NT$ {payableTax.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-blue-100/80 mt-3 font-black uppercase tracking-widest bg-white/10 w-fit px-2 py-1 rounded">
                            需於次月 15 日前繳納
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-black/30 shadow-xl shadow-indigo-900/10 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 flex items-center uppercase tracking-tight">
                                <TrendingUp className="w-5 h-5 mr-2 text-indigo-500" />
                                獲利趨勢分析 (Profit & Loss)
                            </h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Monthly Analytics {year}</p>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                                    tickFormatter={(value: number) => `$${value / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 900 }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 900, fontSize: '12px' }} />
                                <Area type="monotone" dataKey="revenue" name="營業額" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                <Area type="monotone" dataKey="profit" name="淨利潤" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-black/30 shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 flex items-center uppercase tracking-tight mb-6">
                        <BarChart3 className="w-5 h-5 mr-2 text-rose-500" />
                        專案營收分佈 (Revenue Breakdown)
                    </h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={projects.length > 0 ? projects.map(p => ({
                                        name: p.name,
                                        value: p.quotationItems?.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0) || 0
                                    })).filter(d => d.value > 0) : [{ name: '尚無數據', value: 1 }]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {(projects.length > 0 ? projects.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                                    )) : <Cell fill="#f1f5f9" />)}
                                </Pie>
                                <Tooltip
                                    contentStyle={TOOLTIP_STYLE}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold text-center mt-4">
                        依據目前所有專案之報價總額計算
                    </p>
                </div>

                <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-rose-900/20">
                    <div className="absolute -right-10 -top-10 opacity-10">
                        <Calculator className="w-48 h-48" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="p-2 bg-white/10 rounded-xl"><Calculator className="w-5 h-5 text-cyan-200" /></span>
                            <span className="text-xs font-black uppercase tracking-widest text-cyan-50">Annual Tax Estimate</span>
                        </div>
                        <p className="text-sm font-bold text-cyan-100/70 mb-1 leading-none">年度累計預估純利</p>
                        <h4 className="text-4xl font-black tracking-tighter mb-8 text-white">${annualNetProfit.toLocaleString()}</h4>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-xs font-bold text-cyan-100/70">營所稅估算 (20%)</span>
                                <span className="text-xl font-black text-white">${estimatedAnnualTax.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-gradient-to-r from-rose-400 to-pink-500 h-full shadow-[0_0_12px_rgba(244,63,94,0.4)]" style={{ width: '20%' }} />
                            </div>
                            <p className="text-[10px] text-cyan-50/60 leading-relaxed font-bold">
                                此為根據目前獲利狀況之「營利事業所得稅」預估值，實際稅額視扣除額與最終申報為準。
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:bg-white/20 transition-all border border-white/10 shadow-lg">
                        <span className="text-sm font-black tracking-tight">查看年度稅務規劃</span>
                        <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                </div>
            </div>

            {/* New Row: Countdown & 401 Cheat Sheet */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
                <div className="lg:col-span-1">
                    <div className={cn(
                        "rounded-xl p-6 border relative overflow-hidden h-full flex flex-col justify-center transition-all duration-300",
                        daysUntilDeadline <= 5
                            ? "bg-gradient-to-br from-rose-50 to-red-100 border-rose-200 shadow-xl shadow-rose-900/10 text-slate-900"
                            : "bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 border-transparent shadow-xl shadow-cyan-900/10 text-white"
                    )}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={cn("font-black flex items-center uppercase tracking-wider text-xs", daysUntilDeadline <= 5 ? "text-rose-700" : "text-cyan-100")}>
                                <Clock className="w-4 h-4 mr-2" />
                                報稅倒數
                            </h3>
                            {daysUntilDeadline <= 5 && <span className="text-[10px] font-bold bg-white/50 text-rose-600 px-2 py-1 rounded-full animate-pulse border border-rose-200">Coming Soon</span>}
                        </div>
                        <div className="text-center">
                            <div className={cn("text-[72px] leading-none font-black mb-2 mt-4", daysUntilDeadline <= 5 ? "text-rose-900" : "text-white")}>
                                {daysUntilDeadline} <span className="text-[21px] font-bold opacity-80 ml-1">天</span>
                            </div>
                            <p className={cn("text-[15px] mt-4 font-bold opacity-80 uppercase tracking-widest", daysUntilDeadline <= 5 ? "text-rose-700" : "text-cyan-100")}>
                                下次期限：{nextDeadlineDate}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl p-6 h-full shadow-xl shadow-orange-900/10 transition-all duration-300 text-white">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black flex items-center text-white uppercase tracking-tight">
                                    <FileText className="w-5 h-5 mr-2 text-white" />
                                    401 報表申報數據 (Cheat Sheet)
                                </h3>
                                <p className="text-xs text-orange-100 mt-1 font-bold">
                                    請直接將下列數字填入國稅局報稅系統對應欄位
                                </p>
                                <div className="mt-2 flex items-center text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 w-fit">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    提醒：若應納稅額為 0，仍需進行「零稅額申報」，以免受罰喔！
                                </div>
                            </div>
                            <div className="bg-white/10 text-white text-[10px] font-black px-2 py-1 rounded border border-white/20 uppercase tracking-widest backdrop-blur-sm">
                                Data for {period}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col">
                                <p className="text-[10px] text-orange-100 font-black mb-2 uppercase tracking-wide">欄位 [31]+[35] 銷售額</p>
                                <div className="text-2xl font-black text-slate-900 bg-white border border-transparent p-4 rounded-xl shadow-sm flex justify-between items-center group cursor-pointer hover:shadow-md transition-all" onClick={() => { navigator.clipboard.writeText(totalSales.toString()); toast.success('已複製'); }}>
                                    {totalSales}
                                    <Copy className="w-4 h-4 text-slate-300 group-hover:text-orange-500" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-[10px] text-orange-100 font-black mb-2 uppercase tracking-wide">欄位 [Output Tax] 銷項稅額</p>
                                <div className="text-2xl font-black text-slate-900 bg-white border border-transparent p-4 rounded-xl shadow-sm flex justify-between items-center group cursor-pointer hover:shadow-md transition-all" onClick={() => { navigator.clipboard.writeText(outputTax.toString()); toast.success('已複製'); }}>
                                    {outputTax}
                                    <Copy className="w-4 h-4 text-slate-300 group-hover:text-orange-500" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-[10px] text-orange-100 font-black mb-2 uppercase tracking-wide">欄位 [48] 扣抵進項稅額</p>
                                <div className="text-2xl font-black text-slate-900 bg-white border border-transparent p-4 rounded-xl shadow-sm flex justify-between items-center group cursor-pointer hover:shadow-md transition-all" onClick={() => { navigator.clipboard.writeText(inputTax.toString()); toast.success('已複製'); }}>
                                    {inputTax}
                                    <Copy className="w-4 h-4 text-slate-300 group-hover:text-orange-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Left Column: Tax Guide */}
                {/* Tax Guide (Horizontal & Collapsible) */}
                <div className="lg:col-span-4 mb-6">
                    <button
                        onClick={() => setShowGuide(!showGuide)}
                        className="flex items-center text-sm font-black text-slate-700 bg-white border border-black/30 rounded-lg px-4 py-2 hover:bg-slate-50 transition-colors shadow-sm mb-4"
                    >
                        <Info className="w-4 h-4 mr-2 text-indigo-500" />
                        {showGuide ? "隱藏新手申辦指南" : "顯示新手「全線上」辦理指南"}
                        <svg
                            className={cn("w-4 h-4 ml-2 transition-transform duration-200", showGuide ? "rotate-180" : "")}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {showGuide && (
                        <div className="bg-white rounded-xl border border-black/30 shadow-sm p-6 animate-in slide-in-from-top-2 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative mt-4">
                                {/* Connector Line (Desktop) */}
                                <div className="hidden md:block absolute top-[30px] left-[16%] right-[16%] h-1 bg-slate-100 -z-0 rounded-full">
                                    <div className="absolute left-[33%] top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-0.5"><ChevronRight className="w-5 h-5 text-slate-300" /></div>
                                    <div className="absolute left-[66%] top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-0.5"><ChevronRight className="w-5 h-5 text-slate-300" /></div>
                                </div>

                                {/* Step -1 */}
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 text-white flex items-center justify-center text-sm font-black tracking-widest mb-5 shadow-xl shadow-cyan-900/20 border-4 border-white uppercase">Pro</div>
                                    <h4 className="text-[22px] font-black text-slate-900 mb-2">辦理工商憑證</h4>
                                    <span className="text-[15px] px-4 py-1.5 rounded-full bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 text-white font-bold mb-4 tracking-widest shadow-md uppercase">建議線上</span>
                                    <p className="text-[18px] text-slate-500 leading-relaxed mb-3 font-medium">全線上辦理的「總鑰匙」。</p>
                                    <a href="https://moaca.nat.gov.tw/" target="_blank" rel="noopener noreferrer" className="text-[18px] text-indigo-600 font-black hover:text-indigo-800 transition-colors flex items-center group">
                                        前往申辦 <ExternalLink className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </div>

                                {/* Step 0 */}
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-3xl font-black mb-5 shadow-xl shadow-emerald-900/20 border-4 border-white">1</div>
                                    <h4 className="text-[22px] font-black text-slate-900 mb-2">電子發票申請</h4>
                                    <span className="text-[15px] px-4 py-1.5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold mb-4 tracking-widest shadow-md uppercase">線上辦理</span>
                                    <p className="text-[18px] text-slate-500 leading-relaxed mb-3 font-medium">自動配號，完全無紙化。</p>
                                    <a href="https://www.einvoice.nat.gov.tw/" target="_blank" rel="noopener noreferrer" className="text-[18px] text-indigo-600 font-black hover:text-indigo-800 transition-colors flex items-center group">
                                        財政部平台 <ExternalLink className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </div>

                                {/* Step 1 */}
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-violet-600 to-purple-700 text-white flex items-center justify-center text-3xl font-black mb-5 shadow-xl shadow-violet-900/20 border-4 border-white">2</div>
                                    <h4 className="text-[22px] font-black text-slate-900 mb-2">整理單據</h4>
                                    <span className="text-[15px] px-4 py-1.5 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 text-white font-bold mb-4 tracking-widest shadow-md flex items-center uppercase">
                                        <span className="mr-1">✨</span>本系統操作
                                    </span>
                                    <p className="text-[18px] text-slate-500 leading-relaxed font-medium">輸入發票號碼即可。</p>
                                </div>

                                {/* Step 4 */}
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center text-3xl font-black mb-5 shadow-xl shadow-rose-900/20 border-4 border-white">3</div>
                                    <h4 className="text-[22px] font-black text-slate-900 mb-2">申報上傳</h4>
                                    <span className="text-[15px] px-4 py-1.5 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white font-bold mb-4 tracking-widest shadow-md uppercase">線上辦理</span>
                                    <p className="text-[18px] text-slate-500 leading-relaxed font-medium">國稅局 401 線上申報系統。</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-dashed border-black/30">
                                <div className="flex items-start text-[14px] text-slate-900 bg-rose-50 p-4 rounded-xl border border-rose-200 shadow-sm leading-relaxed">
                                    <Building2 className="w-5 h-5 mr-3 shrink-0 mt-0.5 text-rose-600" />
                                    <div>
                                        <span className="font-black block mb-1">臨櫃親跑重點提示：</span>
                                        <ul className="list-disc pl-4 space-y-1">
                                            <li><span className="font-bold">購票：</span>需攜帶「發票章」與「購票證」前往代售點。</li>
                                            <li><span className="font-bold">申報：</span>若不使用軟體，需親送 401 報表至所屬國稅局（通常 17:00 截止）。</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content Area (Full Width) */}
                <div className="lg:col-span-4 space-y-8">


                    {/* Tabs */}
                    <div className="w-full">
                        <div className="flex w-full bg-slate-100/80 p-1.5 rounded-2xl mb-8 backdrop-blur-sm gap-2">
                            <button
                                onClick={() => setActiveTab('expenses')}
                                className={cn(
                                    "flex-1 py-4 text-lg font-black rounded-xl transition-all duration-300",
                                    activeTab === 'expenses'
                                        ? "bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-[0_8px_20px_-4px_rgba(79,70,229,0.4)] scale-y-105"
                                        : "bg-black/20 text-slate-700 hover:bg-black/30 hover:text-slate-900 hover:scale-y-105"
                                )}
                            >
                                支出管家 (Expense Logger)
                            </button>
                            <button
                                onClick={() => setActiveTab('income')}
                                className={cn(
                                    "flex-1 py-4 text-lg font-black rounded-xl transition-all duration-300",
                                    activeTab === 'income'
                                        ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_8px_20px_-4px_rgba(16,185,129,0.4)] scale-y-105"
                                        : "bg-black/20 text-slate-700 hover:bg-black/30 hover:text-slate-900 hover:scale-y-105"
                                )}
                            >
                                收入列表 (Invoices)
                            </button>
                        </div>

                        {/* EXPENSES TAB CONTENT */}
                        {activeTab === 'expenses' && (
                            <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                                {/* Add Expense Form */}
                                <div className="bg-white rounded-xl border border-black/30 shadow-sm p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                                        <div className="md:col-span-1">
                                            <label className="text-xs font-bold text-gray-500 mb-1 block">日期</label>
                                            <input
                                                title="日期"
                                                type="date"
                                                value={newExpense.date}
                                                onChange={e => setNewExpense({ ...newExpense, date: e.target.value })}
                                                className="w-full text-sm border-black/30 rounded-md focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold text-gray-500 mb-1 block">支出項目說明</label>
                                            <input
                                                title="說明"
                                                type="text"
                                                placeholder="例如：Adobe 訂閱費"
                                                value={newExpense.description}
                                                onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
                                                className="w-full text-sm border-black/30 rounded-md focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
                                            />
                                        </div>
                                        <div className="md:col-span-1">
                                            <label className="text-xs font-bold text-gray-500 mb-1 block">類別</label>
                                            <select
                                                title="類別"
                                                value={newExpense.category}
                                                onChange={e => setNewExpense({ ...newExpense, category: e.target.value as any })}
                                                className="w-full text-sm border-black/30 rounded-md focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border bg-white"
                                            >
                                                <option value="office">辦公雜支</option>
                                                <option value="software">軟體訂閱</option>
                                                <option value="travel">差旅交通</option>
                                                <option value="freelancer">外包費用</option>
                                                <option value="meal">交際餐費</option>
                                                <option value="other">其他</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="text-xs font-bold text-gray-500 block">總金額</label>
                                                {newExpense.category === 'freelancer' && (
                                                    <span className="text-[10px] bg-rose-50 text-rose-600 px-1 rounded font-black">含勞報扣繳</span>
                                                )}
                                            </div>
                                            <input
                                                title="金額"
                                                type="number"
                                                value={newExpense.amount || ''}
                                                onChange={e => {
                                                    const val = parseInt(e.target.value) || 0;
                                                    if (newExpense.category === 'freelancer') {
                                                        // Auto-calculate withholding (10%) and NHI (2.11%)
                                                        // Assuming input is the Gross Amount
                                                        const wh = Math.round(val * 0.1);
                                                        const nhi = Math.round(val * 0.0211);
                                                        setNewExpense({ ...newExpense, amount: val, withholdingTax: wh, nhiFee: nhi });
                                                    } else {
                                                        setNewExpense({ ...newExpense, amount: val });
                                                    }
                                                }}
                                                className="w-full text-sm border-black/30 rounded-md focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border font-black"
                                                placeholder="NT$"
                                            />
                                        </div>
                                        <div className="md:col-span-1">
                                            <button
                                                onClick={handleAddExpense}
                                                className="w-full bg-gradient-to-br from-cyan-600 to-blue-700 text-white flex items-center justify-center p-2 rounded-xl hover:brightness-110 transition-all h-[42px] font-black uppercase text-base shadow-[0_4px_12px_-2px_rgba(8,145,178,0.3)] active:scale-95"
                                            >
                                                <Plus className="w-5 h-5 mr-1" />
                                                紀錄
                                            </button>
                                        </div>
                                    </div>
                                    {newExpense.category === 'freelancer' && newExpense.amount ? (
                                        <div className="mt-4 flex gap-4 animate-in fade-in slide-in-from-left-2">
                                            <div className="bg-rose-50 border border-rose-100 p-2 rounded-lg text-[10px] font-bold text-rose-700">
                                                代扣 10% 所得稅: NT$ {newExpense.withholdingTax}
                                            </div>
                                            <div className="bg-amber-50 border border-amber-100 p-2 rounded-lg text-[10px] font-bold text-amber-700">
                                                扣繳 2.11% 二代健保: NT$ {newExpense.nhiFee}
                                            </div>
                                            <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-lg text-[10px] font-black text-emerald-700 flex items-center">
                                                實付金額 (Net): NT$ {(newExpense.amount - (newExpense.withholdingTax || 0) - (newExpense.nhiFee || 0)).toLocaleString()}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>

                                {/* Expense List */}
                                <div className="bg-white rounded-xl shadow-sm border border-black/30 overflow-hidden">
                                    <table className="w-full text-base text-left">
                                        <thead className="bg-gray-50 text-gray-500 border-b">
                                            <tr>
                                                <th className="px-6 py-4 font-bold uppercase tracking-wider">日期</th>
                                                <th className="px-6 py-4 font-bold uppercase tracking-wider">項目</th>
                                                <th className="px-6 py-4 font-bold uppercase tracking-wider">類別</th>
                                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">金額 (含稅)</th>
                                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">稅額 (5%)</th>
                                                <th className="px-6 py-4 font-bold uppercase tracking-wider w-[60px]"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-black/30">
                                            {periodExpenses.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-16 text-center text-gray-400 text-lg">
                                                        尚無本期支出記錄，把發票拿出來記吧！
                                                    </td>
                                                </tr>
                                            )}
                                            {periodExpenses.sort((a, b) => b.date.localeCompare(a.date)).map(expense => {
                                                const tax = expense.taxType === 'inclusive' || expense.taxType === 'exclusive'
                                                    ? Math.round(expense.amount - (expense.amount / 1.05))
                                                    : 0;
                                                return (
                                                    <tr key={expense.id} className="hover:bg-gray-50 group">
                                                        <td className="px-6 py-5 font-mono text-gray-600">{expense.date}</td>
                                                        <td className="px-6 py-5 font-bold text-gray-900">{expense.description}</td>
                                                        <td className="px-6 py-5">
                                                            <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-bold text-gray-600">
                                                                {expense.category === 'software' && '軟體'}
                                                                {expense.category === 'office' && '辦公'}
                                                                {expense.category === 'travel' && '交通'}
                                                                {expense.category === 'freelancer' && '外包'}
                                                                {expense.category === 'meal' && '餐費'}
                                                                {expense.category === 'other' && '其他'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5 text-right font-black text-lg">{expense.amount.toLocaleString()}</td>
                                                        <td className="px-6 py-5 text-right text-gray-500 font-medium">{tax.toLocaleString()}</td>
                                                        <td className="px-6 py-5 text-right">
                                                            <button
                                                                title="刪除"
                                                                onClick={() => deleteExpense(expense.id)}
                                                                className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* INCOME TAB CONTENT */}
                        {activeTab === 'income' && (
                            <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                                <p className="text-sm text-gray-500 mb-2 bg-blue-50 text-blue-700 p-3 rounded-lg flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    這裡列出所有專案。請將「已開發票」的專案標記起來，系統才會計算稅額。
                                </p>

                                <div className="bg-white rounded-xl shadow-sm border border-black/30 overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-gray-500 border-b">
                                            <tr>
                                                <th className="px-4 py-3 font-medium">建立日期</th>
                                                <th className="px-4 py-3 font-medium">專案名稱</th>
                                                <th className="px-4 py-3 font-medium">客戶</th>
                                                <th className="px-4 py-3 font-medium text-right">報價總額</th>
                                                <th className="px-4 py-3 font-medium text-center">發票狀態</th>
                                                <th className="px-4 py-3 font-medium w-[200px]">發票資訊</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-black/30">
                                            {projects.map(project => {
                                                const subtotal = project.quotationItems?.reduce((s, i) => s + (i.quantity * i.unitPrice), 0) || 0;
                                                const taxMode = project.quotationSettings?.taxMode || 'exclusive';
                                                let total = subtotal;
                                                if (taxMode === 'exclusive') total = Math.round(subtotal * 1.05);

                                                const isBilled = project.invoiceStatus === 'billed' || project.invoiceStatus === 'paid';

                                                return (
                                                    <tr key={project.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-gray-500 text-xs">{new Date(project.createdAt).toLocaleDateString()}</td>
                                                        <td className="px-4 py-3 font-medium text-gray-900">{project.name}</td>
                                                        <td className="px-4 py-3 text-gray-600">{project.data.clientCompany || '-'}</td>
                                                        <td className="px-4 py-3 text-right font-medium">{total.toLocaleString()}</td>
                                                        <td className="px-4 py-3 text-center">
                                                            <button
                                                                onClick={() => {
                                                                    const newStatus = isBilled ? 'unbilled' : 'billed';
                                                                    const date = !isBilled ? new Date().toISOString().split('T')[0] : undefined;
                                                                    updateProjectInvoiceStatus(project.id, newStatus, project.invoiceNumber, date);
                                                                    if (!isBilled) toast.success('已標記為已開票');
                                                                }}
                                                                className={cn(
                                                                    "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                                                                    isBilled
                                                                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                                )}
                                                            >
                                                                {isBilled ? (
                                                                    <span className="flex items-center justify-center">
                                                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                                                        已開票
                                                                    </span>
                                                                ) : '未開票'}
                                                            </button>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {isBilled ? (
                                                                <div className="flex flex-col space-y-1">
                                                                    <input
                                                                        title="發票日期"
                                                                        type="date"
                                                                        value={project.invoiceDate || ''}
                                                                        onChange={e => updateProjectInvoiceStatus(project.id, project.invoiceStatus || 'billed', project.invoiceNumber, e.target.value)}
                                                                        className="text-xs border-black/30 rounded px-2 py-1 h-7 border"
                                                                    />
                                                                    <input
                                                                        title="發票號碼"
                                                                        type="text"
                                                                        placeholder="發票號碼"
                                                                        value={project.invoiceNumber || ''}
                                                                        onChange={e => updateProjectInvoiceStatus(project.id, project.invoiceStatus || 'billed', e.target.value, project.invoiceDate)}
                                                                        className="text-xs border-black/30 rounded px-2 py-1 h-7 uppercase border"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-300 text-xs">-</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Disclaimer / Legal Shield */}
            <div className="bg-gray-100 rounded-xl p-5 text-[13.5px] leading-relaxed text-gray-600 mt-12 mb-8 border border-black/30">
                <h4 className="text-[15px] font-bold flex items-center mb-3 text-gray-800">
                    <ShieldCheck className="w-5 h-5 mr-2" />
                    免責聲明 (Disclaimer)
                </h4>
                <ul className="list-disc pl-5 space-y-1.5">
                    <li>本系統 (捷報Estimator) 僅提供財務數據整理與試算功能，旨在協助使用者自行管理專案收支。</li>
                    <li>本系統非會計師事務所，<span className="font-bold text-gray-700">不提供稅務簽證、代客記帳或稅務諮詢服務</span>。</li>
                    <li>試算結果僅供參考，實際申報金額與稅務責任，請以國稅局相關法規與核定為準。使用者應自行確認申報數據之正確性。</li>
                    <li>若有複雜稅務問題，或營業規模較大 (如需會計師簽證)，仍建議諮詢專業會計師。</li>
                    <li>By using this tool, you acknowledge that you are solely responsible for your tax filings.</li>
                </ul>
            </div>
        </div>
    );
}

function AlertCircle({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
    )
}

function ShieldCheck({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="m9 12 2 2 4-4"></path>
        </svg>
    )
}
