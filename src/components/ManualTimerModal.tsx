'use client';

import { useState } from 'react';
import { X, Clock, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface ManualTimerModalProps {
    isOpen: boolean;
    taskName: string;
    onClose: () => void;
    onConfirm: (minutes: number, note: string) => void;
}

export default function ManualTimerModal({ isOpen, taskName, onClose, onConfirm }: ManualTimerModalProps) {
    const [minutes, setMinutes] = useState<string>('60');
    const [note, setNote] = useState<string>('手動紀錄');

    if (!isOpen) return null;

    const handleConfirm = () => {
        const mins = parseInt(minutes);
        if (isNaN(mins) || mins <= 0) {
            toast.error('請輸入有效的工時分鐘數');
            return;
        }
        onConfirm(mins, note);
        onClose();
        // Reset defaults for next time
        setMinutes('60');
        setNote('手動紀錄');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all scale-100 p-8 border border-black/30">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                    type="button"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 leading-none">紀錄工時</h3>
                            <p className="text-sm text-gray-400 font-bold mt-1 line-clamp-1 max-w-[200px]">{taskName}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                                工時 (分鐘)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={minutes}
                                    onChange={(e) => setMinutes(e.target.value)}
                                    className="w-full bg-slate-50 border border-black/30 rounded-xl px-4 py-3 font-black text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="60"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">MIN</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                                備註說明
                            </label>
                            <input
                                type="text"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full bg-slate-50 border border-black/30 rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="例如：API 串接測試..."
                                onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                            />
                        </div>
                    </div>

                    <div className="flex w-full space-x-3 mt-8">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-sm font-black transition-colors"
                            type="button"
                        >
                            取消
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-black shadow-lg shadow-indigo-200 transition-colors flex items-center justify-center"
                            type="button"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            確認紀錄
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
