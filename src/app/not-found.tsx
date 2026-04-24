import Link from 'next/link';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="text-9xl font-black text-indigo-500/10 mb-[-60px] select-none">404</div>
                
                <div className="relative z-10 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Compass className="w-8 h-8 text-indigo-400" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2">頁面迷失在 AI 雲端中</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        我們找不到您要訪問的頁面。這可能是一個失效的連結，或者該頁面已被移動到新的維度。
                    </p>

                    <Link 
                        href="/"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                    >
                        <Home className="w-5 h-5" /> 帶我回到安全地帶
                    </Link>
                </div>
            </div>
        </div>
    );
}
