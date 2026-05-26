'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { FileText, Clock, FileEdit, Check, X, ShieldCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function DocumentManager() {
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

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800 dark:text-gray-100">
                        <ShieldCheck className="w-7 h-7 text-rose-500" />
                        專案合約與文件庫
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        由法務長 (CLO) 審閱或修訂的正式合約將自動歸檔於此。
                    </p>
                </div>
            </div>

            {docs.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-gray-700">
                    <FileText className="w-12 h-12 text-slate-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 dark:text-gray-400">目前尚無文件</h3>
                    <p className="text-sm text-slate-500 mt-2">請至 AGI 辦公室請法務顧問擬定合約</p>
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
                                <div>
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
