'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section 
            className="relative overflow-hidden pt-32 pb-40 min-h-[90vh] flex items-center"
            style={{ 
                backgroundImage: 'url(/HeroBG.png)', 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Overlay to ensure readability if BG is too busy */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] z-0" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex justify-center mb-16 -mt-[50px] animate-fade-in relative group">
                        {/* 修正：使用藍綠色調的光暈層 */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[200px] bg-cyan-500/40 blur-[80px] rounded-full opacity-100 group-hover:bg-cyan-400/50 transition-all duration-700 pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[140px] bg-emerald-400/20 blur-[50px] rounded-full opacity-100 pointer-events-none" />
                        
                        <img 
                            src="/Logo_w.png" 
                            alt="Aim.pro Logo" 
                            className="relative h-44 md:h-48 object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] filter hover:scale-[1.02] transition-all duration-500" 
                        />
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-600/10 border border-cyan-600/20 text-cyan-700 text-sm font-semibold mb-8 animate-fade-in-up">
                        <Sparkles className="w-4 h-4" />
                        <span>全台首創 AGI 職人大腦庫</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                        一人公司，<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-500">百人規模</span>。
                        <br />
                        內建全球職人智庫。
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-700/80 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                        不僅是報價，更整合了法務、財務、稅務基因。
                        <br className="hidden md:block" />
                        為職人打造的虛擬經營總部，讓專業價值倍增。
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link
                            href="/dashboard"
                            className="px-10 py-4 bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 backdrop-blur-md text-white rounded-2xl font-bold text-lg hover:from-cyan-300 hover:via-cyan-400 hover:to-emerald-400 transition-all flex items-center gap-2 shadow-2xl shadow-cyan-500/45 active:scale-95 duration-200 border border-white/30"
                        >
                            立即免費試用
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a
                            href="#pricing"
                            className="px-10 py-4 bg-white/30 backdrop-blur-xl text-slate-900 border border-white/50 rounded-2xl font-bold text-lg hover:bg-white/50 transition-all active:scale-95 duration-200 shadow-xl shadow-black/5"
                        >
                            查看方案
                        </a>
                    </div>

                    <div className="mt-16 flex flex-wrap justify-center gap-8 text-slate-600 text-sm font-bold">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-cyan-600" />
                            無需綁定信用卡
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-cyan-600" />
                            30 秒快速上手
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-cyan-600" />
                            專業級 PDF 匯出
                        </div>
                    </div>
                </div>
            </div>

            {/* 右下角破格裝飾 Logo - 再次放大 100% */}
            <motion.div 
                className="absolute -bottom-20 -right-20 z-20 pointer-events-none opacity-30 hidden xl:block"
                animate={{ 
                    y: [0, -40, 0],
                    scale: [1, 1.05, 1],
                    rotate: [0, 3, 0]
                }}
                transition={{ 
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <img 
                    src="/Logo.png" 
                    alt="Floating Decorative Logo" 
                    className="w-[640px] h-[640px] object-contain drop-shadow-[0_40px_80px_rgba(6,182,212,0.3)]" 
                />
            </motion.div>
        </section>
    );
}
