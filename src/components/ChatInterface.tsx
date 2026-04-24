'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Copy, Check } from 'lucide-react';
import { ChatMessage, useProject } from '../context/ProjectContext';
import { generateChatReply, ReplyMode } from '@/lib/aiService';
import { generateId } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import Turnstile from './Turnstile';
import { toast } from 'sonner';

interface ChatInterfaceProps {
    apiKey: string;
}

export default function ChatInterface({ apiKey }: ChatInterfaceProps) {
    const { activeProject, addChatMessage } = useProject();
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeProject?.chatHistory]);

    if (!activeProject) return <div>請先選擇專案</div>;

    const handleGenerateReply = async (mode: ReplyMode) => {
        let finalInput = inputMessage;

        // Auto-fill context based on mode
        if (mode === 'followup' && !finalInput.trim()) {
            finalInput = "（客戶已讀不回，請幫我生成一則禮貌但有目的性的追問訊息）";
        } else if (mode === 'payment' && !finalInput.trim()) {
            finalInput = "（客戶尚未付款，請幫我生成一則正式的催款通知，提醒會計查帳）";
        }

        if (!finalInput.trim()) return;

        // 1. Add User Message (Client's Inquiry or User Instruction)
        const userMsg: ChatMessage = {
            id: generateId(),
            role: 'user',
            content: finalInput,
            timestamp: Date.now(),
        };
        addChatMessage(activeProject.id, userMsg);
        setInputMessage('');
        setIsLoading(true);

        // 2. Prepare Context
        const projectContext = JSON.stringify(activeProject.data);
        const reportContext = activeProject.reportContent || "（尚未生成報告）";
        const chatContext = activeProject.chatHistory.map(m => `${m.role}: ${m.content}`).join('\n');

        // 3. Call AI
        const projectType = (activeProject.data.projectType || 'web') as 'web' | 'design'; // Default to web for backward compatibility
        const response = await generateChatReply(
            mode,
            projectContext,
            reportContext,
            chatContext,
            userMsg.content,
            apiKey,
            projectType,
            turnstileToken || undefined
        );

        // 4. Add AI Message (Generated Reply)
        const aiMsg: ChatMessage = {
            id: generateId(),
            role: 'ai',
            content: response.content || response.error || "生成失敗",
            timestamp: Date.now(),
        };
        addChatMessage(activeProject.id, aiMsg);
        setIsLoading(false);
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-xl border border-black/20 overflow-hidden">
            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                {activeProject.chatHistory.length === 0 && (
                    <div className="text-center text-slate-400 mt-10">
                        <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>尚無對話記錄</p>
                        <p className="text-sm">請將客戶的信件或是訊息貼在下方，並選擇回覆模式。</p>
                    </div>
                )}

                {activeProject.chatHistory.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
                            {/* Avatar */}
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-primary/10 text-primary' : 'bg-emerald-100 text-emerald-600'}`}>
                                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                            </div>

                            {/* Message Bubble */}
                            <div className={`group relative p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none shadow-primary/20' : 'bg-white text-slate-700 border border-black/20 rounded-tl-none prose prose-sm max-w-none'}`}>
                                {msg.role === 'user' ? (
                                    <div className="whitespace-pre-wrap">{msg.content}</div>
                                ) : (
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                )}

                                {/* Copy Button (Only for AI messages) */}
                                {msg.role === 'ai' && (
                                    <button
                                        onClick={() => copyToClipboard(msg.content, msg.id)}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-500"
                                        title="複製內容"
                                    >
                                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-5 bg-white border-t border-black/20">
                <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="請貼上客戶的回信或是訊息内容... (若要催款，可輸入「訂金」或「尾款」讓AI更精準)"
                    className="w-full h-24 p-4 border border-black/20 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none mb-4 text-sm text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white transition-all outline-none"
                    disabled={isLoading}
                />

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {!apiKey && (
                            <div className="scale-75 origin-left">
                                <Turnstile onVerify={(token) => setTurnstileToken(token)} />
                            </div>
                        )}
                        <div className="text-xs text-gray-400">
                            AI 將參考本專案的評估報告與上下文進行回覆
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => handleGenerateReply('payment')}
                            disabled={isLoading}
                            className="px-4 py-2.5 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl shadow-lg shadow-red-200 hover:brightness-110 text-sm font-black transition-all active:scale-95 disabled:opacity-50"
                            title="發出正式催款通知"
                        >
                            💰 催款通知
                        </button>
                        <button
                            onClick={() => handleGenerateReply('followup')}
                            disabled={isLoading}
                            className="px-4 py-2.5 bg-gradient-to-br from-sky-500 to-indigo-600 text-white rounded-xl shadow-lg shadow-sky-200 hover:brightness-110 text-sm font-black transition-all active:scale-95 disabled:opacity-50"
                            title="客戶已讀不回時使用"
                        >
                            👋 主動追問
                        </button>
                        <button
                            onClick={() => handleGenerateReply('simple')}
                            disabled={!inputMessage.trim() || isLoading}
                            className="px-4 py-2.5 bg-gradient-to-br from-cyan-400 to-blue-500 text-white rounded-xl shadow-lg shadow-cyan-200 hover:brightness-110 text-sm font-black transition-all active:scale-95 disabled:opacity-50"
                        >
                            生成簡易版
                        </button>
                        <button
                            onClick={() => handleGenerateReply('medium')}
                            disabled={!inputMessage.trim() || isLoading}
                            className="px-4 py-2.5 bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-xl shadow-lg shadow-blue-200 hover:brightness-110 text-sm font-black transition-all active:scale-95 disabled:opacity-50"
                        >
                            生成中階版
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Loader2({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    )
}
