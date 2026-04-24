'use client';

import { useEffect } from 'react';
import { RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Unhandled Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900 border border-red-500/20 rounded-3xl p-8 text-center shadow-2xl">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <RefreshCcw className="w-8 h-8 text-red-500 animate-spin-slow" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-4">糟糕！發生了點問題</h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                    我們在處理您的請求時遇到了一些技術困難。這可能是暫時的連線問題，或是系統正在進行微調。
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => reset()}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCcw className="w-4 h-4" /> 嘗試重新整理
                    </button>
                    
                    <Link 
                        href="/"
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" /> 回到首頁
                    </Link>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 p-4 bg-black/50 rounded-lg text-left overflow-auto max-h-40">
                        <code className="text-[10px] text-red-400 font-mono">
                            {error.message}
                            {error.digest && <div className="mt-1 opacity-50">Digest: {error.digest}</div>}
                        </code>
                    </div>
                )}
            </div>
        </div>
    );
}
