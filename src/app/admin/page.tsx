'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
    Users, Activity, DollarSign, PieChart, ShieldCheck, 
    Search, Filter, ExternalLink, MessageSquare, Sparkles, 
    ArrowUpRight, AlertCircle, TrendingUp, CreditCard, FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

export default function AdminPage() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalEvents: 0,
        totalRevenue: 0,
        pendingInvoices: 0
    });
    const [events, setEvents] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [revenue, setRevenue] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'events' | 'finance'>('overview');
    
    // AI Assistant State
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [aiMessages, setAiMessages] = useState<any[]>([
        { role: 'assistant', content: '您好，我是您的 Admin AI 助手。我已準備好為您分析全站數據、營收狀況與使用者行為。請問您想了解什麼？' }
    ]);
    const [aiInput, setAiInput] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    useEffect(() => {
        checkAdmin();
    }, []);

    async function checkAdmin() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
            window.location.href = '/';
            return;
        }

        const { data: profile } = await supabase
            .from('users_profile')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();

        if (!profile?.is_admin) {
            toast.error('無權限進入管理後台');
            window.location.href = '/dashboard';
            return;
        }

        setIsAdmin(true);
        fetchData();
        setLoading(false);
    }

    async function fetchData() {
        // Fetch Stats
        const { count: userCount } = await supabase.from('users_profile').select('*', { count: 'exact', head: true });
        const { count: eventCount } = await supabase.from('user_events').select('*', { count: 'exact', head: true });
        const { data: revData } = await supabase.from('platform_revenue').select('amount');
        const { count: pendingInv } = await supabase.from('platform_revenue').select('*', { count: 'exact', head: true }).eq('invoice_status', 'pending');

        const totalRev = revData?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

        setStats({
            totalUsers: userCount || 0,
            totalEvents: eventCount || 0,
            totalRevenue: totalRev,
            pendingInvoices: pendingInv || 0
        });

        // Fetch Recent Events
        const { data: recentEvents } = await supabase
            .from('user_events')
            .select('*, users_profile(email)')
            .order('created_at', { ascending: false })
            .limit(20);
        setEvents(recentEvents || []);

        // Fetch Users
        const { data: allUsers } = await supabase
            .from('users_profile')
            .select('*')
            .order('created_at', { ascending: false });
        setUsers(allUsers || []);
        
        // Fetch Revenue
        const { data: allRevenue } = await supabase
            .from('platform_revenue')
            .select('*, users_profile(email)')
            .order('created_at', { ascending: false });
        setRevenue(allRevenue || []);
    }

    const handleAiChat = async () => {
        if (!aiInput.trim()) return;

        const userMsg = { role: 'user', content: aiInput };
        setAiMessages(prev => [...prev, userMsg]);
        setAiInput('');
        setIsAiLoading(true);

        try {
            // Context for AI: Stats and snapshot of data
            const context = {
                stats,
                recentEvents: events.slice(0, 5).map(e => ({ type: e.event_type, user: e.users_profile?.email })),
                activeUsers: users.length,
                pendingInvoices: stats.pendingInvoices
            };

            const response = await fetch('/api/admin/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: aiInput, 
                    context 
                })
            });
            const data = await response.json();

            setAiMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
        } catch (error) {
            toast.error('AI 助手暫時無法回應');
        } finally {
            setIsAiLoading(false);
        }
    };

    if (loading) return <div className="h-screen bg-slate-950 flex items-center justify-center text-white font-black animate-pulse">ADMIN AUTHORIZING...</div>;
    if (!isAdmin) return null;

    return (
        <div className="flex h-screen bg-[#050505] text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30">
            {/* Admin Sidebar */}
            <div className="w-[280px] border-r border-white/5 bg-[#0a0a0a] flex flex-col p-6 gap-8">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-white tracking-tight">ADMIN CONSOLE</span>
                        <span className="text-[10px] text-indigo-400 font-bold tracking-[0.2em] uppercase">Control Center</span>
                    </div>
                </div>

                <nav className="flex flex-col gap-1.5">
                    <AdminNavItem active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<PieChart className="w-5 h-5" />} label="數據總覽" />
                    <AdminNavItem active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users className="w-5 h-5" />} label="用戶管理" />
                    <AdminNavItem active={activeTab === 'events'} onClick={() => setActiveTab('events')} icon={<Activity className="w-5 h-5" />} label="行為雷達" />
                    <AdminNavItem active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} icon={<DollarSign className="w-5 h-5" />} label="會計與發票" />
                </nav>

                <div className="mt-auto bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">System Status</span>
                    </div>
                    <p className="text-xs text-slate-500">All systems operational. Database synced.</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className="h-[80px] border-b border-white/5 flex items-center justify-between px-10 bg-[#080808]/50 backdrop-blur-xl z-10">
                    <h1 className="text-2xl font-black text-white tracking-tight">
                        {activeTab === 'overview' && '系統概況'}
                        {activeTab === 'users' && '所有使用者'}
                        {activeTab === 'events' && '即時行為牆'}
                        {activeTab === 'finance' && '營收與發票管理'}
                    </h1>
                    <div className="flex items-center gap-4">
                        <button onClick={fetchData} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5">
                            <TrendingUp className="w-5 h-5 text-indigo-400" />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-xs text-indigo-300">
                            AD
                        </div>
                    </div>
                </header>

                {/* Dashboard Scroll Area */}
                <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    
                    {activeTab === 'overview' && (
                        <div className="space-y-10 animate-in fade-in duration-500">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-4 gap-6">
                                <StatCard label="總註冊用戶" value={stats.totalUsers} icon={<Users />} color="from-blue-600 to-indigo-600" trend="+12%" />
                                <StatCard label="總點數事件" value={stats.totalEvents} icon={<Activity />} color="from-violet-600 to-purple-600" trend="+5.4%" />
                                <StatCard label="總累積營收" value={`$${stats.totalRevenue.toLocaleString()}`} icon={<DollarSign />} color="from-emerald-600 to-teal-600" trend="+20.1%" />
                                <StatCard label="待開發票數" value={stats.pendingInvoices} icon={<FileText />} color="from-orange-600 to-amber-600" trend="Action Required" />
                            </div>

                            {/* Two Column Layout */}
                            <div className="grid grid-cols-3 gap-8">
                                <div className="col-span-2 bg-[#111] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                                    <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center">
                                        <h3 className="font-black text-lg text-white">即時行為追蹤 (Crawler Stream)</h3>
                                        <span className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full font-bold">Live Data</span>
                                    </div>
                                    <div className="divide-y divide-white/5">
                                        {events.map((e, i) => (
                                            <div key={i} className="px-8 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-xl flex items-center justify-center",
                                                        e.event_type === 'GENERATE_REPORT' ? 'bg-emerald-500/10 text-emerald-500' : 
                                                        e.event_type === 'UPGRADE_CLICK' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-500'
                                                    )}>
                                                        {e.event_type === 'GENERATE_REPORT' ? <Sparkles className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{e.event_type}</p>
                                                        <p className="text-[11px] text-slate-500">{e.users_profile?.email || 'Unknown User'}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-slate-500 font-mono">{new Date(e.created_at).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden group">
                                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                            <Sparkles className="w-32 h-32" />
                                        </div>
                                        <h4 className="text-lg font-black mb-2">AI 經營分析</h4>
                                        <p className="text-sm text-indigo-100 mb-6 leading-relaxed">目前系統活躍度高於上週平均 15%。用戶對「設計業」報價需求顯著增加。</p>
                                        <button 
                                            onClick={() => setIsAiOpen(true)}
                                            className="w-full bg-white text-indigo-600 py-3 rounded-xl font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
                                        >
                                            開啟 AI 指揮官
                                        </button>
                                    </div>

                                    <div className="bg-[#111] rounded-[2rem] border border-white/5 p-6">
                                        <h4 className="font-black text-white mb-4">待辦事項</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-white/5 border border-white/5">
                                                <div className="w-2 h-2 rounded-full bg-orange-500" />
                                                <span>開立 {stats.pendingInvoices} 份發票</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-white/5 border border-white/5">
                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                <span>審核 3 位專業版申請</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="bg-[#111] rounded-[2rem] border border-white/5 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-8 py-5">使用者</th>
                                        <th className="px-8 py-5">方案等級</th>
                                        <th className="px-8 py-5">剩餘點數</th>
                                        <th className="px-8 py-5">註冊日期</th>
                                        <th className="px-8 py-5 text-right">操作</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.map((u, i) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-all">
                                            <td className="px-8 py-5 font-bold text-white text-sm">{u.email}</td>
                                            <td className="px-8 py-5">
                                                <span className={cn(
                                                    "text-[10px] px-2 py-0.5 rounded-full font-black",
                                                    u.tier === 'professional' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-500/20 text-slate-500'
                                                )}>
                                                    {u.tier.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 font-mono text-sm">{u.ai_quota}</td>
                                            <td className="px-8 py-5 text-xs text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                                            <td className="px-8 py-5 text-right">
                                                <button className="text-[11px] font-black text-indigo-400 hover:underline">編輯用戶</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'finance' && (
                        <div className="bg-[#111] rounded-[2rem] border border-white/5 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-8 py-5">日期</th>
                                        <th className="px-8 py-5">客戶</th>
                                        <th className="px-8 py-5">金額</th>
                                        <th className="px-8 py-5">統編 / 抬頭</th>
                                        <th className="px-8 py-5">發票狀態</th>
                                        <th className="px-8 py-5 text-right">管理</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {revenue.map((r, i) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-all">
                                            <td className="px-8 py-5 text-xs text-slate-500">{new Date(r.created_at).toLocaleDateString()}</td>
                                            <td className="px-8 py-5 font-bold text-white text-sm">{r.users_profile?.email || 'N/A'}</td>
                                            <td className="px-8 py-5 font-mono text-emerald-400 font-bold">${Number(r.amount).toLocaleString()}</td>
                                            <td className="px-8 py-5 text-sm text-slate-300">
                                                {r.tax_id ? `${r.tax_id} / ${r.tax_name || '-'}` : '個人/不需統編'}
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={cn(
                                                    "text-[10px] px-2 py-0.5 rounded-full font-black",
                                                    r.invoice_status === 'issued' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'
                                                )}>
                                                    {r.invoice_status === 'issued' ? '已開立' : '待處理'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button className="text-[11px] font-black text-indigo-400 hover:underline">開立發票</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>

                {/* AI Assistant Drawer */}
                <div className={cn(
                    "absolute bottom-10 right-10 w-[400px] h-[600px] bg-[#111] border border-white/10 rounded-[2.5rem] shadow-3xl z-50 flex flex-col overflow-hidden transition-all duration-500 transform",
                    isAiOpen ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95 pointer-events-none"
                )}>
                    <div className="p-6 bg-indigo-600 text-white flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-6 h-6" />
                            <span className="font-black tracking-tight text-lg">Admin AI Assistant</span>
                        </div>
                        <button onClick={() => setIsAiOpen(false)} className="hover:bg-white/20 p-1 rounded-lg">
                            <AlertCircle className="w-5 h-5 rotate-45" />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/50 custom-scrollbar">
                        {aiMessages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={cn(
                                    "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed",
                                    msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-600/10' : 'bg-white/5 text-slate-300 border border-white/5 rounded-tl-none prose prose-invert prose-sm'
                                )}>
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        {isAiLoading && <div className="flex justify-start"><div className="bg-white/5 p-4 rounded-2xl text-slate-500 animate-pulse">AI 正在分析數據...</div></div>}
                    </div>

                    <div className="p-5 border-t border-white/5 bg-[#0a0a0a]">
                        <div className="relative">
                            <input 
                                type="text" 
                                value={aiInput}
                                onChange={(e) => setAiInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAiChat()}
                                placeholder="問問 AI 助手關於經營狀況..."
                                className="w-full bg-slate-800 border border-white/10 rounded-xl px-5 py-3.5 text-base text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/50 pr-12 transition-all shadow-inner"
                            />
                            <button 
                                onClick={handleAiChat}
                                className="absolute right-3 top-2.5 bottom-2.5 bg-indigo-600 text-white w-9 h-9 rounded-lg flex items-center justify-center hover:bg-indigo-500 active:scale-95 transition-all shadow-lg"
                            >
                                <ArrowUpRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}

function StatCard({ label, value, icon, color, trend }: { label: string, value: string | number, icon: React.ReactNode, color: string, trend?: string }) {
    return (
        <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 shadow-xl relative overflow-hidden group">
            <div className={cn("absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br opacity-5 rounded-full group-hover:scale-125 transition-transform duration-700", color)} />
            <div className="flex justify-between items-start mb-6">
                <div className={cn("p-3 rounded-2xl bg-gradient-to-br text-white shadow-lg", color)}>
                    {icon}
                </div>
                {trend && <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">{trend}</span>}
            </div>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{label}</p>
            <h2 className="text-3xl font-black text-white tracking-tighter">{value}</h2>
        </div>
    );
}

function AdminNavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group",
                active 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
            )}
        >
            <span className={cn("transition-colors", active ? "text-white" : "group-hover:text-indigo-400")}>
                {icon}
            </span>
            <span className="font-bold text-sm tracking-tight">{label}</span>
        </button>
    );
}
