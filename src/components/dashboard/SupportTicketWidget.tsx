'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { MessageSquare, Send, User, Bot, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface TicketMessage {
    id: string;
    sender_id: string;
    content: string;
    created_at: string;
    is_admin?: boolean;
}

export default function SupportTicketWidget() {
    const [userId, setUserId] = useState<string | null>(null);
    const [ticketId, setTicketId] = useState<string | null>(null);
    const [messages, setMessages] = useState<TicketMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        initSupport();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const initSupport = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            setUserId(session.user.id);

            const { data: tickets, error: ticketError } = await supabase
                .from('support_tickets')
                .select('id, status')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })
                .limit(1);

            if (ticketError) throw ticketError;

            if (tickets && tickets.length > 0) {
                setTicketId(tickets[0].id);
                fetchMessages(tickets[0].id);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Failed to init support:', error);
            setIsLoading(false);
        }
    };

    const fetchMessages = async (tId: string) => {
        const { data, error } = await supabase
            .from('ticket_messages')
            .select('*')
            .eq('ticket_id', tId)
            .order('created_at', { ascending: true });

        if (!error && data) {
            setMessages(data);
        }
        setIsLoading(false);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !userId) return;
        setIsSending(true);

        try {
            let currentTicketId = ticketId;
            if (!currentTicketId) {
                const { data: newTicket, error: createError } = await supabase
                    .from('support_tickets')
                    .insert([{ user_id: userId, subject: '一般客服反饋' }])
                    .select('id')
                    .single();

                if (createError) throw createError;
                currentTicketId = newTicket.id;
                setTicketId(currentTicketId);
            }

            const { error: msgError } = await supabase
                .from('ticket_messages')
                .insert([{
                    ticket_id: currentTicketId,
                    sender_id: userId,
                    content: newMessage
                }]);

            if (msgError) throw msgError;

            setMessages(prev => [...prev, {
                id: Math.random().toString(),
                sender_id: userId,
                content: newMessage,
                created_at: new Date().toISOString()
            }]);
            setNewMessage('');
            
        } catch (error: any) {
            toast.error('發送失敗', { description: '請稍後再試或檢查網路連線' });
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <section className="mt-[50px] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-gray-200/60 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col h-[550px]">
                
                {/* 1. Header Area */}
                <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl shadow-inner border border-indigo-100/50 dark:border-indigo-500/20">
                            <MessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center">
                                聯繫客服
                                <span className="ml-3 text-[11px] bg-emerald-100/50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-200/50 dark:border-emerald-500/20 font-bold tracking-wide flex items-center">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></div>
                                    線上服務中
                                </span>
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 font-medium">遇到任何問題？直接在這裡發送訊息給我們！</p>
                        </div>
                    </div>
                </div>

                {/* 2. Message Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50/50 dark:bg-slate-950/40 relative">
                    {/* Ambient Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="w-8 h-8 border-3 border-gray-200 dark:border-slate-700 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin"></div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-center mb-4">
                                <Sparkles className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-1">您好！</h4>
                            <p className="text-gray-500 dark:text-slate-400 text-sm">有什麼我們可以幫忙的嗎？<br/>隨時傳送訊息給我們。</p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => {
                            const isMe = msg.is_admin !== true; // 若不是管理員發的，就是自己(客戶)發的
                            return (
                                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                                    {!isMe && (
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mr-3 flex-shrink-0 shadow-md">
                                            <Bot className="w-4.5 h-4.5" />
                                        </div>
                                    )}
                                    <div className={`max-w-[75%] rounded-3xl px-5 py-3.5 shadow-sm relative ${
                                        isMe 
                                        ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white rounded-br-sm' 
                                        : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-800 dark:text-gray-100 rounded-bl-sm'
                                    }`}>
                                        <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{msg.content}</p>
                                        <span className={`text-[10px] mt-2 block font-medium ${isMe ? 'text-indigo-200/80 text-right' : 'text-gray-400 dark:text-slate-500'}`}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    {isMe && (
                                        <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-500 dark:text-slate-400 ml-3 flex-shrink-0 shadow-sm">
                                            <User className="w-4.5 h-4.5" />
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* 3. Input Area */}
                <div className="p-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-gray-100 dark:border-slate-800 flex items-end gap-3 z-10">
                    <div className="flex-1 relative">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="輸入您的問題或反饋... (按 Enter 發送)"
                            className="w-full resize-none bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl pl-5 pr-5 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20 text-gray-900 dark:text-gray-100 text-[15px] transition-all placeholder:text-gray-400 dark:placeholder:text-slate-600 shadow-inner"
                            rows={2}
                        />
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={isSending || !newMessage.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-40 disabled:hover:bg-indigo-600 dark:disabled:hover:bg-indigo-500 text-white p-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 dark:shadow-indigo-500/20 flex-shrink-0 flex items-center justify-center active:scale-95 group"
                    >
                        <Send className="w-5 h-5 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
}
