'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { FileText, Clock, FileEdit, Check, X, ShieldCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface DocumentManagerProps {
    onGoToAgiOffice?: (initialMessage?: string) => void;
}

export function DocumentManager({ onGoToAgiOffice }: DocumentManagerProps) {
    const { activeProject, updateProjectDocuments } = useProject();
    const [editingDocId, setEditingDocId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');

    const docs = activeProject?.documents || [];

    if (!activeProject) return null;

    const handleEdit = (doc: any) => {
        setEditingDocId(doc.id);
        setEditContent(doc.content);
    };

    const handleSave = (id: string) => {
        const newDocs = docs.map(d => {
            if (d.id === id) {
                return { ...d, content: editContent, updatedAt: new Date().toISOString() };
            }
            return d;
        });
        updateProjectDocuments(activeProject.id, newDocs);
        setEditingDocId(null);
        toast.success('合約已更新並存檔');
    };

    const handleJumpToAgiLegal = (msg?: string) => {
        if (onGoToAgiOffice) {
            onGoToAgiOffice(msg || "（請法務長幫我擬定本專案的正式服務與授權合約）");
        } else {
            window.location.href = `/dashboard/agi-office?role=legal`;
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800 dark:text-gray-100">
                        <ShieldCheck className="w-7 h-7 text-rose-500" />
                        專案合約與文件庫
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        由法務長 (CLO) 審閱或修訂的正式合約將自動歸檔於此。
                    </p>
                </div>

                {docs.length > 0 && (
                    <button
                        onClick={() => handleJumpToAgiLegal("（請法務長協助審視目前已歸檔的合約，並檢查條款是否有修改空間）")}
                        className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center gap-2"
                    >
                        <span>💬 與法務長討論/修訂合約 ➔</span>
                    </button>
                )}
            </div>

            {docs.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-gray-700 text-center space-y-4">
                    <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-500/20">
                        <FileText className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-700 dark:text-gray-200">目前尚無歸檔合約</h3>
                        <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 max-w-sm">
                            您可以直接點擊下方按鈕跳轉至 AGI 辦公室，由法務長 (CLO) 為您量身擬定專業合約。
                        </p>
                    </div>

                    <button
                        onClick={() => handleJumpToAgiLegal("（請法務長幫我擬定本專案的正式服務與授權合約，包含專案範圍、驗收標準與智財權切結）")}
                        className="px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm rounded-xl shadow-xl hover:shadow-rose-500/20 transition active:scale-95 flex items-center gap-2"
                    >
                        <span>🚀 點擊直接跳轉至 AGI 辦公室請法務擬定合約 ➔</span>
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {docs.map(doc => (
                        <div key={doc.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-slate-100 dark:border-gray-700 bg-slate-50 dark:bg-gray-800/80 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-rose-100 dark:bg-rose-500/20 rounded-lg text-rose-600 dark:text-rose-400">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800 dark:text-gray-100">{doc.title}</h3>
                                        <div className="flex items-center text-xs text-slate-500 dark:text-gray-400 mt-1 gap-2">
                                            <span className="capitalize">{doc.type}</span>
                                            {doc.updatedAt && (
                                                <span className="flex items-center">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    最後更新: {format(new Date(doc.updatedAt), 'yyyy-MM-dd HH:mm')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleJumpToAgiLegal(`（請法務長針對這份合約【${doc.title}】進行條款審視與說明）`)}
                                        className="px-3 py-1.5 text-xs bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 font-bold rounded-lg transition"
                                    >
                                        💬 請法務審視此條款
                                    </button>

                                    {editingDocId === doc.id ? (
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => setEditingDocId(null)}
                                                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-gray-700 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                取消
                                            </button>
                                            <button 
                                                onClick={() => handleSave(doc.id)}
                                                className="px-3 py-1.5 text-sm bg-rose-600 hover:bg-rose-500 text-white rounded-lg flex items-center gap-1 transition-colors"
                                            >
                                                <Check className="w-4 h-4" /> 儲存
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => handleEdit(doc)}
                                            className="p-2 text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                            title="編輯合約內容"
                                        >
                                            <FileEdit className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            <div className="p-6 bg-white dark:bg-gray-900/50 flex-1">
                                {editingDocId === doc.id ? (
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full h-96 p-4 bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-rose-500/50 font-mono text-sm leading-relaxed"
                                    />
                                ) : (
                                    <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-gray-300">
                                        <ReactMarkdown>{doc.content}</ReactMarkdown>
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
