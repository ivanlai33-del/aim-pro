'use client';

import { useRef, useState, useEffect, FormEvent } from 'react';
import { useAgi, AdvisorId } from '../context/AgiContext';
import { Send, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const ADVISORS: { id: AdvisorId; name: string; icon: string; color: string }[] = [
    { id: 'boss', name: '老闆',   icon: '👔', color: 'bg-slate-700 text-white' },
    { id: 'gm',   name: '總經理', icon: '📊', color: 'bg-indigo-600 text-white' },
    { id: 'cfo',  name: '會計長', icon: '💰', color: 'bg-emerald-600 text-white' },
    { id: 'clo',  name: '法務',   icon: '⚖️', color: 'bg-violet-600 text-white' },
    { id: 'cso',  name: '業務',   icon: '🎯', color: 'bg-rose-600 text-white' },
];

const ADVISOR_COLOR: Record<AdvisorId | 'system', string> = {
    boss:   'from-slate-700 to-slate-800',
    gm:     'from-indigo-600 to-indigo-700',
    cfo:    'from-emerald-600 to-emerald-700',
    clo:    'from-violet-600 to-violet-700',
    cso:    'from-rose-500 to-rose-600',
    system: 'from-slate-400 to-slate-500',
};

export default function AgiMeetingTab() {
    const { messages, activeAdvisor, setActiveAdvisor, sendMessage, isAdvisorTyping, allowedIds } = useAgi();
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isAdvisorTyping]);

    const handleSend = (e?: FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;
        sendMessage(input.trim());
        setInput('');
    };

    const currentAdvisorMeta = ADVISORS.find(a => a.id === activeAdvisor);

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Advisor selector */}
            <div className="flex items-center gap-1.5 px-3 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0 overflow-x-auto no-scrollbar">
                {ADVISORS.filter(a => allowedIds.includes(a.id)).map((a) => (
                    <button
                        key={a.id}
                        onClick={() => setActiveAdvisor(a.id)}
                        className={cn(
                            'flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-black transition-all shrink-0',
                            activeAdvisor === a.id
                                ? a.color + ' shadow-md scale-105'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                        )}
                    >
                        <span>{a.icon}</span>
                        {a.name}
                    </button>
                ))}
                {/* Group meeting button */}
                <button
                    onClick={() => {
                        setActiveAdvisor('all');
                        sendMessage('請所有顧問針對目前的專案，各自提出最重要的一個意見。');
                    }}
                    className={cn(
                        'flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-black transition-all shrink-0 border',
                        activeAdvisor === 'all'
                            ? 'bg-gradient-to-r from-cyan-400 via-cyan-500 to-emerald-500 text-white border-transparent shadow-md'
                            : 'border-cyan-200 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 hover:bg-cyan-100'
                    )}
                >
                    <Users className="w-3 h-3" />
                    全體會議
                </button>
            </div>

            {/* Current advisor label */}
            <div className="px-4 py-2 text-[10px] text-slate-400 shrink-0">
                {activeAdvisor === 'all'
                    ? '全體顧問模式 — 所有人都會發言'
                    : `對話中：${currentAdvisorMeta?.icon} ${currentAdvisorMeta?.name}`
                }
            </div>

            {/* Message list */}
            <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-3">
                {messages.map((msg) => {
                    if (msg.advisorId === 'user') {
                        return (
                            <div key={msg.id} className="flex justify-end">
                                <div className="max-w-[75%] bg-cyan-600 text-white rounded-2xl rounded-br-sm px-3 py-2 text-xs leading-relaxed shadow-sm">
                                    {msg.content}
                                </div>
                            </div>
                        );
                    }

                    if (msg.advisorId === 'system') {
                        return (
                            <div key={msg.id} className="flex justify-center">
                                <p className="text-[9px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                                    {msg.content}
                                </p>
                            </div>
                        );
                    }

                    const advisorMeta = ADVISORS.find(a => a.id === msg.advisorId);
                    const gradKey = msg.advisorId as AdvisorId;

                    return (
                        <div key={msg.id} className="flex items-start gap-2">
                            <div className={cn(
                                'w-7 h-7 rounded-xl bg-gradient-to-br flex items-center justify-center text-sm shrink-0 shadow-sm',
                                ADVISOR_COLOR[gradKey] || ADVISOR_COLOR.system
                            )}>
                                {advisorMeta?.icon || '🤖'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[9px] font-black text-slate-400 mb-0.5">
                                    {advisorMeta?.name || '顧問'}
                                </p>
                                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-3 py-2 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Typing indicator */}
                {isAdvisorTyping && (
                    <div className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-sm shrink-0 animate-pulse">
                            🤔
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="px-3 pb-3 pt-2 border-t border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={activeAdvisor === 'all' ? '問所有顧問...' : `問${currentAdvisorMeta?.name}...`}
                        className="flex-1 bg-transparent text-xs text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="p-1.5 rounded-lg bg-cyan-600 text-white disabled:opacity-40 transition-all hover:bg-cyan-500 active:scale-95"
                    >
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </div>
            </form>
        </div>
    );
}
