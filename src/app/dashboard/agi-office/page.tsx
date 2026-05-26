'use client';

import { useState, useRef, useEffect } from 'react';
import { useAgi, AdvisorId, AdvisorMessage } from '@/agi/context/AgiContext';
import { useProject } from '@/context/ProjectContext';
import { 
  Briefcase, LineChart, ShieldCheck, Megaphone, 
  Send, Users, GitMerge, Loader2, Sparkles, Lock, ArrowRight,
  CheckCircle2, PlusCircle, User, Bot, Edit2, Check, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ADVISORS = [
  { id: 'boss', name: '董事長', role: '策略大腦', icon: Briefcase, color: 'from-blue-600 to-blue-400', shadow: 'shadow-blue-500/20' },
  { id: 'gm', name: '總經理', role: '執行管理', icon: Users, color: 'from-indigo-600 to-indigo-400', shadow: 'shadow-indigo-500/20' },
  { id: 'cfo', name: '會計長', role: '財務精算', icon: LineChart, color: 'from-emerald-600 to-emerald-400', shadow: 'shadow-emerald-500/20' },
  { id: 'clo', name: '法務', role: '合約防禦', icon: ShieldCheck, color: 'from-rose-600 to-rose-400', shadow: 'shadow-rose-500/20' },
  { id: 'cso', name: '業務', role: '提案教練', icon: Megaphone, color: 'from-amber-600 to-amber-400', shadow: 'shadow-amber-500/20' },
];

export default function AgiOfficePage() {
  const { activeProject, userTier, aiQuota } = useProject();
  const { 
    messages, activeAdvisor, setActiveAdvisor, sendMessage, isAdvisorTyping,
    workflowStatus, triggerChainAnalysis, commitMeetingResolution, lastDeliverables,
    allowedIds, customNames, setCustomName, syncActionToDashboard
  } = useAgi();

  const isQuotaExhausted = (aiQuota <= 0);

  const [inputMessage, setInputMessage] = useState('');
  const [meetingMode, setMeetingMode] = useState<'debate' | 'chain'>('debate');
  const [editingAdvisor, setEditingAdvisor] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAdvisorTyping, workflowStatus]);

  // 1. Check if free tier (Paywall)
  if (userTier === 'free') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center bg-slate-50 dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
        
        <div className="relative z-10 max-w-xl mx-auto space-y-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30">
            <Lock className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white tracking-tight">解鎖 AGI 虛擬辦公室</h1>
          <p className="text-slate-600 dark:text-gray-400 text-lg">
            升級至 Pro 方案，立即擁有一支由 5 位 C-Level 專家組成的專屬顧問團隊。
            從財務精算、合約防禦到執行任務拆解，全面提升您的接案利潤與提案勝率。
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-left">
            {[
              { icon: Users, text: "5 位專屬領域顧問" },
              { icon: GitMerge, text: "鏈式任務自動拆解" },
              { icon: Sparkles, text: "多顧問圓桌會議" },
              { icon: ShieldCheck, text: "專屬合約與財務防護" }
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-3 p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                <item.icon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                <span className="text-slate-700 dark:text-gray-300 font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          <button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium text-lg transition-all shadow-xl shadow-indigo-500/25 flex items-center justify-center space-x-2 mx-auto w-full max-w-md">
            <span>立即升級方案</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // 2. Check if no project selected
  if (!activeProject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-slate-50 dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-white/10">
        <Briefcase className="w-16 h-16 text-slate-400 dark:text-gray-600 mb-6" />
        <h2 className="text-2xl font-bold text-slate-700 dark:text-gray-200 mb-2">缺少專案上下文</h2>
        <p className="text-slate-500 dark:text-gray-500">請先在左側邊欄選擇或建立一個專案，AGI 顧問團隊才能為您服務。</p>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    if (meetingMode === 'chain') {
      triggerChainAnalysis(inputMessage);
    } else {
      sendMessage(inputMessage);
    }
    
    setInputMessage('');
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-6">
      
      {/* 1. Top Section: Virtual Office Seatmap */}
      <div className="flex-none bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
              <span>AGI 虛擬辦公室</span>
            </h2>
            <p className="text-slate-500 dark:text-gray-400 mt-1">為專案【{activeProject.data?.projectName || '未命名'}】提供全方位專業建議</p>
          </div>
          <div className="flex items-center space-x-2 bg-slate-100/50 dark:bg-gray-800/50 rounded-xl p-1 border border-slate-200 dark:border-white/5">
            <button
              onClick={() => setMeetingMode('debate')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${meetingMode === 'debate' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'}`}
            >
              <Users className="w-4 h-4" />
              <span>圓桌會議</span>
            </button>
            <button
              onClick={() => setMeetingMode('chain')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${meetingMode === 'chain' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'}`}
            >
              <GitMerge className="w-4 h-4" />
              <span>鏈式任務流</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {ADVISORS.map(advisor => {
            const isAllowed = allowedIds.includes(advisor.id);
            const isActive = activeAdvisor === advisor.id || activeAdvisor === 'all';
            const isWorking = (meetingMode === 'chain' && workflowStatus === 'running') || isAdvisorTyping;
            
            return (
              <div
                key={advisor.id}
                onClick={() => isAllowed && setActiveAdvisor(advisor.id as AdvisorId)}
                role="button"
                tabIndex={isAllowed ? 0 : -1}
                className={`relative group p-4 rounded-2xl border text-left transition-all duration-300 overflow-hidden
                  ${!isAllowed ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-gray-900/50 border-slate-200 dark:border-white/5' : 
                    isActive 
                      ? `bg-white dark:bg-gray-800/80 border-slate-300 dark:border-gray-600 shadow-md dark:shadow-lg ${advisor.shadow}` 
                      : 'bg-slate-50/50 dark:bg-gray-900/40 border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-gray-800/60 hover:border-slate-300 dark:hover:border-white/20 cursor-pointer'
                  }
                `}
              >
                {isActive && (
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${advisor.color}`} />
                )}
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${advisor.color}`}>
                    <advisor.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    {editingAdvisor === advisor.id ? (
                      <div className="flex items-center space-x-1" onClick={e => e.stopPropagation()}>
                        <input 
                          type="text"
                          value={editNameValue}
                          onChange={e => setEditNameValue(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              setCustomName(advisor.id as AdvisorId, editNameValue.trim());
                              setEditingAdvisor(null);
                            } else if (e.key === 'Escape') {
                              setEditingAdvisor(null);
                            }
                          }}
                          className="w-20 px-1 py-0.5 text-sm bg-white dark:bg-gray-800 border border-indigo-300 dark:border-indigo-500 rounded text-slate-800 dark:text-white outline-none"
                          autoFocus
                        />
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setCustomName(advisor.id as AdvisorId, editNameValue.trim());
                            setEditingAdvisor(null);
                          }}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAdvisor(null);
                          }}
                          className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-700 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <h3 className="text-slate-800 dark:text-white font-semibold flex items-center group/name">
                        <span className="truncate max-w-[100px]">{customNames[advisor.id as AdvisorId] || advisor.name}</span>
                        {isAllowed && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingAdvisor(advisor.id);
                              setEditNameValue(customNames[advisor.id as AdvisorId] || advisor.name);
                            }}
                            className="ml-1 opacity-0 group-hover/name:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-gray-700 rounded text-slate-400 transition-opacity"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        )}
                      </h3>
                    )}
                    <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">
                      {customNames[advisor.id as AdvisorId] ? `${advisor.name}・${advisor.role}` : advisor.role}
                    </p>
                  </div>
                </div>
                
                {/* Status indicator */}
                <div className="flex items-center space-x-2 text-xs">
                  {isAllowed ? (
                    isWorking && isActive ? (
                      <span className="flex items-center text-indigo-500 dark:text-indigo-400">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        分析中...
                      </span>
                    ) : (
                      <span className="flex items-center text-emerald-500 dark:text-emerald-400/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-1.5" />
                        空閒
                      </span>
                    )
                  ) : (
                    <span className="flex items-center text-slate-400 dark:text-gray-500">
                      <Lock className="w-3 h-3 mr-1" />
                      無權限
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex space-x-6">
        {/* 2. Left Section: Meeting Board */}
        <div className="flex-1 flex flex-col bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl">
          <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">
              {meetingMode === 'chain' ? (
                <><GitMerge className="w-5 h-5 mr-2 text-purple-500 dark:text-purple-400" /> 鏈式任務分析看板</>
              ) : (
                <><Users className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" /> 顧問圓桌會議</>
              )}
            </h3>
            {meetingMode === 'debate' && (
              <button 
                onClick={() => setActiveAdvisor('all')}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${activeAdvisor === 'all' ? 'bg-slate-200 dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-800 dark:text-white' : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'}`}
              >
                召喚全體顧問
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-gray-500 space-y-4">
                <Bot className="w-12 h-12 opacity-20" />
                <p>請在下方輸入您面臨的專案難題，開始會商</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = msg.advisorId === 'user';
                const advisor = ADVISORS.find(a => a.id === msg.advisorId);
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id} 
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-indigo-600 ml-3' : 'mr-3 bg-gradient-to-br ' + (advisor?.color || 'from-slate-400 to-slate-500 dark:from-gray-600 dark:to-gray-500')}`}>
                        {isUser ? <User className="w-4 h-4 text-white" /> : (advisor ? <advisor.icon className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />)}
                      </div>
                      <div className={`p-4 rounded-2xl ${
                        isUser 
                          ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md' 
                          : msg.advisorId === 'system' 
                            ? 'bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-200/90 text-sm italic w-full'
                            : 'bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-200 rounded-tl-sm shadow-md'
                      }`}>
                        {!isUser && msg.advisorId !== 'system' && (
                          <div className="text-xs font-semibold mb-1 opacity-70 flex items-center space-x-2">
                            <span>{advisor ? (customNames[advisor.id as AdvisorId] || advisor.name) : '系統'}</span>
                            <span>•</span>
                            <span>{advisor?.role || ''}</span>
                          </div>
                        )}
                        <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
            
            {isAdvisorTyping && (
              <div className="flex justify-start">
                <div className="flex flex-row">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full mr-3 bg-slate-200 dark:bg-gray-700 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-slate-500 dark:text-gray-400 animate-spin" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-400 dark:text-gray-400 rounded-tl-sm flex space-x-1 items-center shadow-md">
                    <div className="w-2 h-2 bg-slate-400 dark:bg-gray-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-slate-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-slate-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
            {meetingMode === 'debate' && messages.length > 2 && (
              <div className="mb-4 flex justify-end">
                <button 
                  onClick={() => {
                    const resolution = window.prompt("請輸入本次會議共識結論，將記錄至專案記憶庫：");
                    if(resolution) commitMeetingResolution(resolution);
                  }}
                  className="text-xs bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-lg border border-emerald-200 dark:border-emerald-500/30 transition-colors flex items-center"
                >
                  <CheckCircle2 className="w-3 h-3 mr-2" />
                  做成會議決議並存檔
                </button>
              </div>
            )}
            
            <div className="relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isQuotaExhausted || isAdvisorTyping || workflowStatus === 'running'}
                placeholder={isQuotaExhausted ? "AI 額度已用盡，請升級方案。" : meetingMode === 'chain' ? "輸入專案需求，讓 4 位顧問依序為您鏈式分析..." : "在此輸入您的專案難題，與顧問進行會商..."}
                className="w-full bg-slate-50 dark:bg-gray-950 border border-slate-300 dark:border-gray-700 text-slate-800 dark:text-gray-200 rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none h-[80px] disabled:opacity-50 disabled:cursor-not-allowed shadow-inner dark:shadow-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isQuotaExhausted || isAdvisorTyping || workflowStatus === 'running'}
                className="absolute right-3 top-3 bottom-3 aspect-square bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 dark:disabled:bg-gray-700 text-white rounded-lg flex items-center justify-center transition-colors shadow-md"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            {isQuotaExhausted && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-2 flex items-center">
                <Lock className="w-3 h-3 mr-1" /> AI 額度已用盡 (Generations: 0)
              </p>
            )}
          </div>
        </div>

        {/* 3. Right Section: Deliverables Rack */}
        <div className="w-96 flex-none bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-xl dark:shadow-2xl">
          <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-amber-500 dark:text-amber-400" /> 產出成果架
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">顧問們針對本案的最新精煉產出</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
            {ADVISORS.filter(a => ['cfo', 'clo', 'cso', 'gm', 'boss'].includes(a.id)).map(advisor => {
              const deliverable = lastDeliverables[advisor.id as AdvisorId];
              const hasContent = !!deliverable?.content;
              
              if (!hasContent) return null;

              // Parse JSON Action Block if present
              let parsedAction: any = null;
              let cleanContent = deliverable.content;
              const jsonMatch = deliverable.content.match(/\`\`\`json\n([\s\S]*?)\n\`\`\`/);
              if (jsonMatch) {
                  try {
                      parsedAction = JSON.parse(jsonMatch[1]);
                      cleanContent = deliverable.content.replace(/\`\`\`json\n[\s\S]*?\n\`\`\`/, '').trim();
                  } catch(e) {}
              }
              
              return (
                <div key={`deliv-${advisor.id}`} className="bg-white dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700/50 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-slate-100 dark:border-gray-700/50">
                    <advisor.icon className={`w-4 h-4 ${advisor.color.split(' ')[0].replace('from-', 'text-')}`} />
                    <span className="font-medium text-slate-700 dark:text-gray-200 text-sm">{advisor.name}產出</span>
                  </div>
                  
                  {cleanContent && (
                    <div className="text-sm text-slate-600 dark:text-gray-400 line-clamp-4 overflow-hidden mb-3 whitespace-pre-wrap">
                      {cleanContent}
                    </div>
                  )}

                  {parsedAction && (
                    <div className="mt-4 pt-3 border-t border-indigo-100 dark:border-indigo-500/20">
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 mb-2">
                        {advisor.id === 'cfo' && '發現新的報價單項目：'}
                        {advisor.id === 'gm' && `拆解出 ${parsedAction.tasks?.length || 0} 項任務：`}
                        {advisor.id === 'clo' && '修訂合約條文：'}
                        {advisor.id === 'cso' && '整理客戶溝通摘要：'}
                        {advisor.id === 'boss' && '生成全新提案視覺：'}
                        {!['cfo', 'gm', 'clo', 'cso', 'boss'].includes(advisor.id) && '有新的可同步動作：'}
                      </p>
                      <button 
                        onClick={() => syncActionToDashboard(advisor.id as AdvisorId, parsedAction.action, parsedAction)}
                        className="w-full text-xs bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-indigo-500/20"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1.5" /> 立即同步至儀表板
                      </button>
                    </div>
                  )}
                  
                  {!parsedAction && advisor.id === 'gm' && !!deliverable?.tasks?.length && (
                    <div className="mt-4 pt-3 border-t border-indigo-100 dark:border-indigo-500/20">
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 mb-2">已拆解出 {deliverable.tasks?.length} 項執行任務：</p>
                      <button 
                        onClick={() => syncActionToDashboard(advisor.id as AdvisorId, 'update_execution', { tasks: deliverable.tasks })}
                        className="w-full text-xs bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-indigo-500/20"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1.5" /> 匯入至 ExecutionManager
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            
            {Object.values(lastDeliverables).every(d => !d.content) && (
              <div className="h-40 flex flex-col items-center justify-center text-slate-400 dark:text-gray-500 space-y-2">
                <Briefcase className="w-8 h-8 opacity-20" />
                <p className="text-sm">目前尚無產出檔案</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
