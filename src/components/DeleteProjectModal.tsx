'use client';

import { X, AlertTriangle } from 'lucide-react';

interface DeleteProjectModalProps {
    isOpen: boolean;
    projectName: string;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteProjectModal({ isOpen, projectName, onClose, onConfirm }: DeleteProjectModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-sm bg-white rounded-xl shadow-2xl transform transition-all scale-100 p-6 border border-black/30">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    title="關閉"
                    aria-label="關閉"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
                        <AlertTriangle className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">確定要刪除嗎？</h3>
                    <p className="text-sm text-gray-500 mb-6">
                        您即將刪除專案 <span className="font-semibold text-gray-800">「{projectName}」</span>。<br />
                        此操作無法復原，所有資料將會消失。
                    </p>

                    <div className="flex w-full space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            取消
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
                        >
                            確認刪除
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
