'use client';

import React from 'react';
import { useProject } from '@/context/ProjectContext';
import { MessageCircle, Clock, CheckCircle2, UserCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export function ClientCRM() {
    const { activeProject } = useProject();
    const logs = activeProject?.clientCommLogs || [];

    if (!activeProject) return null;

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800 dark:text-gray-100">
                        <UserCircle2 className="w-7 h-7 text-amber-500" />
                        客戶溝通歷程
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        由業務 (CSO) 梳理的對話重點與追蹤事項。
                    </p>
                </div>
            </div>

            {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-gray-700">
                    <MessageCircle className="w-12 h-12 text-slate-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 dark:text-gray-400">尚無溝通紀錄</h3>
                    <p className="text-sm text-slate-500 mt-2">請將客戶對話丟進 AGI 辦公室由業務進行重點摘要</p>
                </div>
            ) : (
                <div className="relative border-l-2 border-slate-200 dark:border-gray-700 ml-6 space-y-12 pb-8">
                    {logs.map((log, index) => (
                        <div key={log.id} className="relative pl-8">
                            {/* Timeline dot */}
                            <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-amber-100 border-4 border-white dark:border-gray-900 dark:bg-amber-500 flex items-center justify-center shadow-sm">
                                <div className="w-2 h-2 rounded-full bg-amber-500 dark:bg-white" />
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-gray-700/50 hover:shadow-md transition-shadow">
                                <div className="flex items-center text-xs text-slate-500 dark:text-gray-400 mb-3 font-medium">
                                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                                    {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm')}
                                </div>
                                
                                <h4 className="text-[15px] leading-relaxed text-slate-800 dark:text-gray-200 mb-4 font-medium">
                                    {log.summary}
                                </h4>

                                {log.followUpTasks && log.followUpTasks.length > 0 && (
                                    <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-4 border border-amber-100 dark:border-amber-500/20">
                                        <h5 className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-2 uppercase tracking-wider">Follow-up Tasks</h5>
                                        <ul className="space-y-2">
                                            {log.followUpTasks.map((task, i) => (
                                                <li key={i} className="flex items-start text-sm text-amber-900/80 dark:text-amber-200/80">
                                                    <CheckCircle2 className="w-4 h-4 mr-2 text-amber-500/70 mt-0.5 shrink-0" />
                                                    <span>{task}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
