import Link from 'next/link';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-slate-900 pt-32 pb-40">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6 animate-fade-in-up">
                        <Sparkles className="w-4 h-4" />
                        <span>全台首創 AGI 職人大腦庫</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                        一人公司，<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">百人規模</span>。
                        <br />
                        內建全球職人智庫。
                    </h1>

                    <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        不僅是報價，更整合了法務、財務、稅務基因。
                        <br className="hidden md:block" />
                        為職人打造的虛擬經營總部，讓專業價值倍增。
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/dashboard"
                            className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-xl shadow-white/5 active:scale-95 duration-200"
                        >
                            立即免費試用
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a
                            href="#pricing"
                            className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-medium text-lg hover:bg-white/10 transition-colors active:scale-95 duration-200"
                        >
                            查看方案
                        </a>
                    </div>

                    <div className="mt-12 flex flex-wrap justify-center gap-6 text-slate-500 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            無需綁定信用卡
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            30 秒快速上手
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            專業級 PDF 匯出
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
