'use client';

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

// Category mapping with specific gradients and styles
const CATEGORY_STYLES: Record<string, { color: string, bg: string, border: string, glow: string, gradient: string }> = {
    web: { color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', glow: 'rgba(99, 102, 241, 0.4)', gradient: 'from-indigo-500 to-blue-600' },
    marketing: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', glow: 'rgba(245, 158, 11, 0.4)', gradient: 'from-orange-400 to-rose-500' },
    design: { color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', glow: 'rgba(236, 72, 153, 0.4)', gradient: 'from-pink-500 to-purple-600' },
    space: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'rgba(16, 185, 129, 0.4)', gradient: 'from-emerald-400 to-teal-500' },
    consulting: { color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', glow: 'rgba(139, 92, 246, 0.4)', gradient: 'from-violet-500 to-fuchsia-600' },
    pro_service: { color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20', glow: 'rgba(14, 165, 233, 0.4)', gradient: 'from-sky-500 to-blue-500' },
};

export default function RoleSegmentation() {
    const modules = getAllItems();

    return (
        <section className="py-24 bg-slate-950 overflow-hidden relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 font-black">全球專家智庫</span>
                        <br />
                        賦能 23 種職人核心
                    </h2>
                    <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed">
                        我們深度整合全球專業領域大腦，並植入法務、財務、稅務核心基因。
                        不論您的職業類別，都能在此獲得最強大的虛擬專家支援。
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    {modules && modules.map((mod) => {
                        const style = CATEGORY_STYLES[mod.categoryId] || CATEGORY_STYLES.web;
                        const Icon = ICON_MAP[mod.id] || Award;

                        return (
                            <div key={mod.id} className="opacity-100 transform-none">
                                <Link
                                    href={`/login?mode=signup&industry=${mod.id}`}
                                    className="group relative block h-full"
                                >
                                    {/* Thick Gradient Border Background Layer */}
                                    <div className={`absolute -inset-[3px] rounded-[2.6rem] bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]`} />
                                    <div className={`absolute -inset-[1px] rounded-[2.6rem] bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                    {/* Main Card Content */}
                                    <div className={`relative h-full p-8 rounded-[2rem] bg-slate-900/75 backdrop-blur-sm transition-all duration-500 
                                                  border border-white/10 flex flex-col
                                                  hover:border-white/20
                                                  group-hover:-translate-y-[20px]
                                                  group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.6),0_0_40px_${style.glow}]`}
                                    >
                                        {/* Icon Container */}
                                        <div className={`w-16 h-16 rounded-2xl ${style.bg} ${style.color} flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner`}>
                                            <Icon className="w-9 h-9" strokeWidth={1.5} />
                                        </div>

                                        {/* Title */}
                                        <div className="relative mb-6 overflow-hidden pr-4">
                                            <h3 className="text-2xl font-black text-white leading-tight">
                                                <span className="relative z-10 block">
                                                    {mod.name}
                                                    {/* Golden Flash Overlay */}
                                                    <span className="shine-gold-effect absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-transparent via-amber-400 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 select-none" aria-hidden="true">
                                                        {mod.name}
                                                    </span>
                                                </span>
                                            </h3>
                                        </div>

                                        <p className="text-slate-400 text-base leading-relaxed mb-10 flex-grow font-medium">
                                            {mod.tagline || mod.description}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-[2px] w-6 bg-gradient-to-r ${style.gradient} rounded-full group-hover:w-12 transition-all duration-500`} />
                                                <span className="text-sm font-bold tracking-widest text-slate-500 group-hover:text-white uppercase transition-colors">
                                                    開始估價
                                                </span>
                                            </div>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-slate-400 group-hover:bg-white group-hover:text-slate-950 transition-all duration-500`}>
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none opacity-50" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[150px] pointer-events-none opacity-50" />
        </section>
    );
}
