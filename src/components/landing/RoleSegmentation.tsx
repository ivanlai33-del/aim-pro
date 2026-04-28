'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Palette, Code2, MessageSquare, CalendarDays, ArrowRight, TrendingUp,
    Hammer, Megaphone, Video, Search, Store, Layout, Camera, Monitor,
    Briefcase, GraduationCap, Lightbulb, Presentation, Home, Scale, Award,
    Mic, Sparkles
} from 'lucide-react';
import { BusinessModule } from '@/types/industries';
import { getAllItems } from '@/config/industries';

// Icon mapping for all 21 modules
const ICON_MAP: Record<string, any> = {
    web_development: Code2,
    software_outsourcing: Layout,
    system_integration: Monitor,
    social_media: Megaphone,
    ad_management: TrendingUp,
    seo: Search,
    influencer_marketing: MessageSquare,
    pr_agency: Mic,
    brand_design: Palette,
    video_production: Video,
    social_visual: Layout,
    photography: Camera,
    ui_ux_design: Layout,
    interior_design: Hammer,
    event_planning: CalendarDays,
    exhibition_design: Store,
    business_consulting: Briefcase,
    corporate_training: GraduationCap,
    strategy_planning: Lightbulb,
    online_course_prod: Presentation,
    home_organizer: Home,
    ip_agent: Scale,
    ai_agent_consultant: Sparkles,
};

const CATEGORIES = [
    { id: 'all', name: 'All' },
    { id: 'web', name: '網頁與數位產品' },
    { id: 'marketing', name: '數位行銷與推廣' },
    { id: 'design', name: '視覺設計與創意' },
    { id: 'space', name: '空間與活動規劃' },
    { id: 'consulting', name: '專業服務與顧問' },
    { id: 'pro_service', name: '知識產出與專業職人' },
];

// Category mapping with specific gradients and styles
const CATEGORY_STYLES: Record<string, { color: string, bg: string, border: string, glow: string, gradient: string, themeColor: string }> = {
    web: { color: 'text-white', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', glow: 'rgba(6, 182, 212, 0.5)', gradient: 'from-cyan-400 to-blue-500', themeColor: 'bg-cyan-500' },
    marketing: { color: 'text-white', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', glow: 'rgba(16, 185, 129, 0.5)', gradient: 'from-emerald-400 to-teal-500', themeColor: 'bg-emerald-500' },
    design: { color: 'text-white', bg: 'bg-teal-500/10', border: 'border-teal-500/30', glow: 'rgba(20, 184, 166, 0.5)', gradient: 'from-teal-400 to-cyan-500', themeColor: 'bg-teal-500' },
    space: { color: 'text-white', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', glow: 'rgba(16, 185, 129, 0.5)', gradient: 'from-emerald-400 to-teal-500', themeColor: 'bg-emerald-500' },
    consulting: { color: 'text-white', bg: 'bg-sky-500/10', border: 'border-sky-500/30', glow: 'rgba(14, 165, 233, 0.5)', gradient: 'from-sky-400 to-blue-500', themeColor: 'bg-sky-500' },
    pro_service: { color: 'text-white', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', glow: 'rgba(6, 182, 212, 0.5)', gradient: 'from-cyan-400 to-teal-500', themeColor: 'bg-cyan-500' },
};

export default function RoleSegmentation() {
    const modules = getAllItems();
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredModules = useMemo(() => {
        if (selectedCategory === 'all') return modules;
        return modules.filter(mod => mod.categoryId === selectedCategory);
    }, [modules, selectedCategory]);

    const renderTitle = (title: string) => {
        if (title.includes('與')) {
            const parts = title.split('與');
            return (
                <>
                    {parts[0]}
                    <br />
                    與{parts[1]}
                </>
            );
        }
        return title;
    };

    return (
        <section className="py-32 overflow-hidden relative bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] z-0" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tight drop-shadow-lg">
                        全球專家智庫
                        <br />
                        賦能 23 種職人核心
                    </h2>
                    <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium mb-12">
                        我們深度整合全球專業領域大腦，並植入法務、財務、稅務核心基因。
                        不論您的職業類別，都能在此獲得最強大的虛擬專家支援。
                    </p>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap justify-center gap-3 mb-16">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 border backdrop-blur-md
                                    ${selectedCategory === cat.id
                                        ? 'bg-white text-cyan-600 border-white shadow-xl scale-110'
                                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div 
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredModules && filteredModules.map((mod) => {
                            const style = CATEGORY_STYLES[mod.categoryId] || CATEGORY_STYLES.web;
                            const Icon = ICON_MAP[mod.id] || Award;

                            return (
                                <motion.div
                                    key={mod.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                >
                                    <Link
                                        href={`/login?mode=signup&industry=${mod.id}`}
                                        className="group relative block h-full"
                                    >
                                        {/* Thick Gradient Border Background Layer */}
                                        <div className={`absolute -inset-[3px] rounded-[2.6rem] bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]`} />
                                        <div className={`absolute -inset-[1px] rounded-[2.6rem] bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                        {/* Main Card Content */}
                                        <div className={`relative h-full p-8 rounded-[2rem] bg-white/10 backdrop-blur-xl transition-all duration-500 
                                                      border border-white/20 flex flex-col
                                                      hover:border-white/40
                                                      group-hover:-translate-y-[20px]
                                                      group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.3),0_0_50px_${style.glow}]`}
                                        >
                                            {/* Icon Container */}
                                            <div className={`w-16 h-16 rounded-2xl ${style.bg} text-white flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-3 group-hover:${style.themeColor} transition-all duration-500 shadow-xl border border-white/20`}>
                                                <Icon className="w-9 h-9" strokeWidth={1.5} />
                                            </div>

                                            {/* Title */}
                                            <div className="relative mb-6 overflow-hidden pr-4">
                                                <h3 className="text-2xl font-black text-white leading-[1.3]">
                                                    <span className="relative z-10 block">
                                                        {renderTitle(mod.name)}
                                                    </span>
                                                </h3>
                                            </div>

                                            <p className="text-white/80 text-base leading-relaxed mb-10 flex-grow font-semibold">
                                                {mod.tagline || mod.description}
                                            </p>

                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-[2px] w-6 bg-white rounded-full group-hover:w-12 transition-all duration-500`} />
                                                    <span className="text-sm font-bold tracking-widest text-white/60 group-hover:text-white uppercase transition-colors">
                                                        開始估價
                                                    </span>
                                                </div>
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white group-hover:bg-white group-hover:text-cyan-600 transition-all duration-500 border border-white/20`}>
                                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Background Decor */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-white/10 rounded-full blur-[150px] pointer-events-none opacity-50" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[150px] pointer-events-none opacity-50" />
        </section>
    );
}
