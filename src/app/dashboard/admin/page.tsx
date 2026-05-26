'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, Shield, CreditCard, MessageSquare, Users, Check, Inbox, SearchX } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';

interface UserProfile {
    id: string;
    email: string;
    tier: string;
    system_role: string;
    ai_quota: number;
    unlocked_modules?: string[];
}

interface SubscriptionRequest {
    id: string;
    user_id: string;
    email: string;
    tier: string;
    amount: number;
    company_name: string;
    tax_id: string;
    contact_name: string;
    bank_last_5: string;
    transfer_date: string;
    status: string;
    created_at: string;
}

interface SupportTicket {
    id: string;
    user_id: string;
    subject: string;
    status: string;
    created_at: string;
    email?: string;
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'users' | 'orders' | 'support'>('users');
    const [isLoading, setIsLoading] = useState(true);
    
    // Data States
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [orders, setOrders] = useState<SubscriptionRequest[]>([]);
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    
    // Search & Filter
    const [searchTerm, setSearchTerm] = useState('');

    // Support Tab State
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [ticketMessages, setTicketMessages] = useState<any[]>([]);
    const [adminReply, setAdminReply] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);

    useEffect(() => {
        initAdmin();
    }, []);

    const initAdmin = async () => {
        setIsLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                window.location.href = '/login';
                return;
            }
            setCurrentAdminId(session.user.id);

            const { data: currentUser, error: userError } = await supabase
                .from('users_profile')
                .select('system_role')
                .eq('id', session.user.id)
                .single();

            if (userError || currentUser?.system_role !== 'superadmin') {
                toast.error('權限不足', { description: '只有系統管理員可以訪問此頁面' });
                window.location.href = '/dashboard';
                return;
            }

            const fetchedUsers = await fetchUsers();
            await fetchOrders();
            await fetchTickets(fetchedUsers);
        } catch (err) {
            window.location.href = '/dashboard';
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async () => {
        const { data, error } = await supabase.from('users_profile').select('*').order('id', { ascending: false });
        if (!error && data) {
            setUsers(data);
            return data;
        }
        return [];
    };

    const fetchOrders = async () => {
        const { data, error } = await supabase.from('subscription_requests').select('*').order('created_at', { ascending: false });
        if (!error && data) {
            setOrders(data);
        }
    };

    const fetchTickets = async (loadedUsers: any[] = []) => {
        const { data: ticketsData, error } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
        if (error) return;
        
        // 直接使用傳入的已載入用戶名單，避免 React state closure 問題
        const enhancedTickets = ticketsData.map(t => {
            const foundUser = loadedUsers.find(u => u.id === t.user_id);
            return { ...t, email: foundUser?.email || '未提供信箱' };
        });
        
        setTickets(enhancedTickets);
    };

    // --- Support Actions ---
    const fetchMessages = async (ticketId: string) => {
        const { data } = await supabase.from('ticket_messages').select('*').eq('ticket_id', ticketId).order('created_at', { ascending: true });
        if (data) setTicketMessages(data);
    };

    const handleSelectTicket = async (ticketId: string) => {
        setSelectedTicketId(ticketId);
        await fetchMessages(ticketId);
    };

    const handleSendReply = async () => {
        if (!selectedTicketId || !adminReply.trim() || !currentAdminId) return;
        setIsReplying(true);
        try {
            const { error } = await supabase.from('ticket_messages').insert([{
                ticket_id: selectedTicketId,
                sender_id: currentAdminId,
                content: adminReply,
                is_admin: true
            }]);

            if (error) {
                toast.error('回覆失敗');
            } else {
                toast.success('回覆已送出');
                setAdminReply('');
                
                // 將工單狀態改為已回覆
                await supabase.from('support_tickets').update({ status: 'replied' }).eq('id', selectedTicketId);
                
                // 重新整理對話與列表
                fetchMessages(selectedTicketId);
                const fetchedUsers = await fetchUsers();
                fetchTickets(fetchedUsers);
            }
        } catch (e: any) {
            toast.error('送出失敗', { description: e.message });
        } finally {
            setIsReplying(false);
        }
    };

    const handleApproveOrder = async (orderId: string, userId: string, tier: string) => {
        try {
            const { error: orderError } = await supabase.from('subscription_requests').update({ status: 'completed' }).eq('id', orderId);
            if (orderError) throw orderError;

            const { error: userError } = await supabase.from('users_profile').update({ tier }).eq('id', userId);
            if (userError) throw userError;

            toast.success('已成功開通該用戶權限！');
            const fetchedUsers = await fetchUsers();
            await fetchOrders();
            await fetchTickets(fetchedUsers);
        } catch (error: any) {
            toast.error('開通失敗', { description: error.message });
        }
    };

    // --- Modern Tabs UI Renderers ---

    const renderUsersTab = () => {
        const filtered = users.filter(u => u.email?.toLowerCase().includes(searchTerm.toLowerCase()));
        return (
            <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-800/30">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <input
                            placeholder="搜尋用戶 Email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full p-2.5 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                        />
                    </div>
                </div>
                {filtered.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
                        <SearchX className="w-12 h-12 mb-4 text-gray-200 dark:text-gray-700" />
                        <p>找不到符合條件的用戶</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 dark:bg-slate-800/30 border-b border-gray-100 dark:border-slate-800">
                            <tr>
                                <th className="px-8 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">帳號資訊</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">身分</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">當前方案</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                            {filtered.map(user => (
                                <tr key={user.id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold shadow-md">
                                                {user.email ? user.email[0].toUpperCase() : 'U'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{user.email || '未提供'}</div>
                                                <div className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5">{user.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        {user.system_role === 'superadmin' ? (
                                            <span className="inline-flex items-center text-xs font-black text-amber-700 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-500/10 px-3 py-1 rounded-full border border-amber-200/50 dark:border-amber-500/20 shadow-sm">
                                                <Shield className="w-3 h-3 mr-1" />
                                                Super Admin
                                            </span>
                                        ) : (
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-gray-200/50 dark:border-slate-700">一般用戶</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-sm font-bold uppercase text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-3 py-1.5 rounded-lg shadow-sm">
                                            {user.tier || 'Free'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    };

    const renderOrdersTab = () => {
        const pendingOrders = orders.filter(o => o.status === 'pending');
        const historyOrders = orders.filter(o => o.status !== 'pending');

        return (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                {/* Pending Orders Card */}
                <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden">
                    <div className="px-8 py-6 border-b border-amber-100 dark:border-amber-900/30 flex items-center justify-between bg-amber-50/30 dark:bg-amber-900/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-xl">
                                <CreditCard className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                            </div>
                            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-400 tracking-tight">
                                待審核匯款
                                <span className="ml-3 text-xs font-black bg-amber-500 text-white px-2 py-0.5 rounded-full">{pendingOrders.length}</span>
                            </h3>
                        </div>
                    </div>
                    {pendingOrders.length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center justify-center">
                            <CheckCircle className="w-16 h-16 text-emerald-200 dark:text-emerald-900 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 font-medium">太棒了！目前沒有任何待審核的訂單</p>
                        </div>
                    ) : (
                        <div className="p-6 grid grid-cols-1 gap-4">
                            {pendingOrders.map(order => (
                                <div key={order.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 hover:shadow-md dark:hover:shadow-black/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">客戶資訊</p>
                                            <div className="font-bold text-gray-900 dark:text-gray-200">{order.company_name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">統編: {order.tax_id || '無'}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{order.email}</div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">購買方案</p>
                                            <div className="font-black text-indigo-600 dark:text-indigo-400 uppercase text-lg">{order.tier}</div>
                                            <div className="text-sm font-bold text-gray-700 dark:text-gray-300 mt-1">NT$ {order.amount.toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">匯款細節</p>
                                            <div className="text-sm font-mono font-bold bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded inline-block mb-1 border border-transparent dark:border-slate-600">
                                                末五碼: {order.bank_last_5}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">日期: {order.transfer_date}</div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleApproveOrder(order.id, order.user_id, order.tier)}
                                        className="bg-emerald-500 text-white font-bold px-6 py-4 rounded-xl hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20 active:scale-95 flex flex-shrink-0 items-center justify-center"
                                    >
                                        <Check className="w-5 h-5 mr-2" strokeWidth={3} />
                                        核對無誤，一鍵開通
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* History Orders Card */}
                <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden">
                    <div className="px-8 py-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                        <h3 className="font-bold text-gray-500 dark:text-gray-400 flex items-center">
                            歷史訂單紀錄
                            <span className="ml-3 text-xs bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">{historyOrders.length}</span>
                        </h3>
                    </div>
                </div>
            </div>
        );
    };

    const renderSupportTab = () => {
        return (
            <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden animate-in fade-in zoom-in-95 duration-500 h-[650px] flex">
                {/* Ticket List (Sidebar) */}
                <div className="w-1/3 bg-gray-50/50 dark:bg-slate-900/80 border-r border-gray-100 dark:border-slate-800 flex flex-col h-full">
                    <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                        <h3 className="font-bold text-gray-900 dark:text-white tracking-tight flex items-center">
                            <Inbox className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                            收件匣 ({tickets.length})
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {tickets.length === 0 ? (
                            <div className="py-20 text-center text-gray-400 dark:text-gray-600 text-sm">目前沒有任何客服紀錄</div>
                        ) : (
                            <div className="p-3 space-y-2">
                                {tickets.map(ticket => (
                                    <button
                                        key={ticket.id}
                                        onClick={() => handleSelectTicket(ticket.id)}
                                        className={`w-full text-left p-4 rounded-2xl transition-all ${
                                            selectedTicketId === ticket.id 
                                            ? 'bg-white dark:bg-slate-800 shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
                                            : 'hover:bg-gray-100/50 dark:hover:bg-slate-800/50'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="font-bold text-sm text-gray-900 dark:text-gray-200 truncate pr-2">{ticket.email}</div>
                                            {ticket.status === 'open' && <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm flex-shrink-0" />}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">{ticket.subject}</div>
                                        <div className="text-[10px] font-medium text-gray-400 dark:text-gray-500 mt-3">
                                            {new Date(ticket.created_at).toLocaleDateString()}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area (Main) */}
                <div className="w-2/3 bg-white dark:bg-[#0f172a] flex flex-col h-full relative">
                    {selectedTicketId ? (
                        <>
                            <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900/50 z-10">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{tickets.find(t => t.id === selectedTicketId)?.email}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">正在處理此用戶的反饋</p>
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50/30 dark:bg-slate-950/40">
                                {ticketMessages.map((msg, idx) => {
                                    const isAdmin = msg.is_admin === true;
                                    return (
                                        <div key={idx} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] rounded-3xl px-5 py-4 shadow-sm ${
                                                isAdmin 
                                                ? 'bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-indigo-600 text-white rounded-br-sm' 
                                                : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-sm'
                                            }`}>
                                                <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{msg.content}</p>
                                                <span className={`text-[10px] mt-2 block font-medium ${isAdmin ? 'text-indigo-200 dark:text-indigo-200/70' : 'text-gray-400 dark:text-slate-500'}`}>
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="p-6 bg-white dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800">
                                <div className="relative">
                                    <textarea
                                        value={adminReply}
                                        onChange={(e) => setAdminReply(e.target.value)}
                                        placeholder="回覆用戶..."
                                        className="w-full resize-none bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl pl-5 pr-28 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all text-[15px] text-gray-900 dark:text-white placeholder:text-gray-400"
                                        rows={2}
                                    />
                                    <button
                                        onClick={handleSendReply}
                                        disabled={isReplying || !adminReply.trim()}
                                        className="absolute right-3 bottom-3 top-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white px-6 rounded-xl font-bold transition-all shadow-md active:scale-95"
                                    >
                                        送出
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-300 dark:text-slate-700">
                            <MessageSquare className="w-16 h-16 mb-6 text-gray-200 dark:text-slate-800 stroke-1" />
                            <p className="text-gray-400 dark:text-slate-600 font-medium text-lg">請從左側選擇一個客服對話</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B1120] pt-8 pb-20 transition-colors duration-500">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Premium Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-2">管理中心</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Admin Workspace</p>
                    </div>

                    {/* Modern Pill Tabs */}
                    <div className="bg-gray-200/50 dark:bg-slate-800/80 p-1.5 rounded-2xl inline-flex gap-1 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50">
                        <button 
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 text-sm flex items-center ${
                                activeTab === 'users' 
                                ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' 
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-slate-700/50'
                            }`}
                        >
                            <Users className="w-4 h-4 mr-2" />
                            會員名單
                        </button>
                        <button 
                            onClick={() => setActiveTab('orders')}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 text-sm flex items-center ${
                                activeTab === 'orders' 
                                ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' 
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-slate-700/50'
                            }`}
                        >
                            <CreditCard className="w-4 h-4 mr-2" />
                            匯款審核
                            {orders.filter(o => o.status === 'pending').length > 0 && (
                                <span className="ml-2 bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                                    {orders.filter(o => o.status === 'pending').length}
                                </span>
                            )}
                        </button>
                        <button 
                            onClick={() => setActiveTab('support')}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 text-sm flex items-center ${
                                activeTab === 'support' 
                                ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' 
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-slate-700/50'
                            }`}
                        >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            客服信箱
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-gray-400 dark:text-gray-500">
                        <div className="w-12 h-12 border-4 border-gray-200 dark:border-slate-800 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                        <p className="font-medium">載入資料中...</p>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Subtle ambient background glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
                        
                        {activeTab === 'users' && renderUsersTab()}
                        {activeTab === 'orders' && renderOrdersTab()}
                        {activeTab === 'support' && renderSupportTab()}
                    </div>
                )}
            </div>
        </div>
    );
}
