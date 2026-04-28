'use client';

import { useState } from 'react';
import { Check, Star, Shield, Users, Zap, Building2, Crown } from 'lucide-react';
import UpgradeModal from './UpgradeModal';
import { PRICING_CONFIG, SubscriptionTier, PricingPeriod } from '@/config/subscription';
import { cn } from '@/lib/utils';

export default function Pricing() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState({ id: '', name: '' });
    const [period, setPeriod] = useState<PricingPeriod>('monthly');

    const handleUpgrade = (tierId: string, name: string) => {
        if (tierId === 'free') {
            window.location.href = '/login'; // Or handle free signup
            return;
        }
        setSelectedPlan({ id: tierId, name });
        setModalOpen(true);
    };

    const plans = Object.values(PRICING_CONFIG);

    const PLAN_STYLES: Record<string, { gradient: string, glow: string }> = {
        free: { gradient: 'from-slate-500 to-slate-700', glow: 'rgba(148, 163, 184, 0.3)' },
        individual: { gradient: 'from-blue-500 to-cyan-500', glow: 'rgba(59, 130, 246, 0.3)' },
        professional: { gradient: 'from-indigo-500 to-purple-600', glow: 'rgba(99, 102, 241, 0.5)' },
        pro_plus: { gradient: 'from-amber-400 to-orange-600', glow: 'rgba(251, 191, 36, 0.4)' },
        enterprise: { gradient: 'from-cyan-400 to-blue-500', glow: 'rgba(34, 211, 238, 0.4)' },
    };

    return (
        <section 
            id="pricing" 
            className="py-24 bg-slate-950/80 relative overflow-hidden"
            style={{ 
                backgroundImage: 'linear-gradient(rgba(2, 6, 23, 0.6), rgba(2, 6, 23, 0.6)), url(/HeroBG.png)', 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Background Glow */}
            <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        選擇適合您的 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">成長方案</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        從個人職人到跨國代理商，我們都有為您量身打造的專業工具。
                    </p>
                    
                    <div className="mt-8 flex justify-center items-center gap-4">
                        <span className={cn("text-sm", period === 'monthly' ? "text-white font-bold" : "text-slate-500")}>月繳</span>
                        <button 
                            onClick={() => setPeriod(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                            className="w-14 h-7 bg-slate-800 rounded-full p-1 relative transition-colors hover:bg-slate-700"
                        >
                            <div className={cn(
                                "w-5 h-5 bg-indigo-500 rounded-full transition-transform duration-200",
                                period === 'yearly' ? "translate-x-7" : "translate-x-0"
                            )} />
                        </button>
                        <span className={cn("text-sm flex items-center gap-2", period === 'yearly' ? "text-white font-bold" : "text-slate-500")}>
                            年繳 <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/20">省下 25%</span>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-[1400px] mx-auto">
                    {plans.map((plan) => {
                        const isPro = plan.id === 'professional';
                        const isFree = plan.id === 'free';
                        const isEnterprise = plan.id === 'enterprise';
                        const isProPlus = plan.id === 'pro_plus';
                        const style = PLAN_STYLES[plan.id] || PLAN_STYLES.professional;

                        return (
                            <div 
                                key={plan.id}
                                className={cn(
                                    "flex flex-col rounded-[2.5rem] transition-all duration-500 relative group",
                                    isPro ? "scale-105 z-10" : "z-0"
                                )}
                            >
                                {/* External Glow Layer (Blurred) */}
                                <div className={cn(
                                    "absolute -inset-[3px] rounded-[2.6rem] bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[4px] z-[-1]",
                                    style.gradient
                                )} />
                                
                                {/* Sharp Border Layer */}
                                <div className={cn(
                                    "absolute -inset-[1px] rounded-[2.6rem] bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[-1]",
                                    style.gradient
                                )} />
                                
                                {/* Main Dark Glass Card */}
                                <div className={cn(
                                    "flex flex-col h-full p-8 rounded-[2.5rem] transition-all duration-500 relative z-10",
                                    "bg-slate-900/60 backdrop-blur-2xl border border-white/10",
                                    "group-hover:border-white/20 group-hover:-translate-y-[20px]",
                                    isPro ? "border-indigo-500/40 shadow-2xl shadow-indigo-500/30" : "shadow-xl"
                                )}>
                                {isPro && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-lg uppercase tracking-widest">
                                        <Star className="w-3 h-3 fill-current" /> Most Popular
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className={`text-lg font-bold mb-2 ${isPro ? 'text-white' : 'text-slate-300'}`}>
                                        {plan.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 mb-6 h-10 leading-relaxed">
                                        {plan.description}
                                    </p>

                                    <div className="mt-4">
                                        {plan.price.original && (
                                            <span className="text-[10px] text-slate-500 line-through block mb-1">
                                                原價 ${plan.price.original.toLocaleString()}
                                            </span>
                                        )}
                                        <div className="flex items-end gap-1">
                                            <span className={`text-3xl font-black ${isPro ? 'text-white' : 'text-slate-200'}`}>
                                                ${plan.price[period].toLocaleString()}
                                            </span>
                                            <span className="text-xs text-slate-500 font-medium mb-1">/ {period === 'monthly' ? '月' : '年'}</span>
                                        </div>
                                    </div>
                                </div>

                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex items-start gap-2 text-xs text-slate-400">
                                        <Check className={`w-4 h-4 shrink-0 ${isPro ? 'text-indigo-400' : 'text-slate-600'}`} />
                                        <span>
                                            {plan.limits.maxProjectsMonthly === -1 ? '無限' : plan.limits.maxProjectsMonthly} 個專案額度
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2 text-xs text-slate-400">
                                        <Check className={`w-4 h-4 shrink-0 ${isPro ? 'text-indigo-400' : 'text-slate-600'}`} />
                                        <span>包含 {plan.limits.includedGeneralModules} 個行業模組</span>
                                    </li>
                                    
                                    {plan.features.noWatermark && (
                                        <li className="flex items-start gap-2 text-xs text-slate-200 font-bold">
                                            <Zap className="w-4 h-4 shrink-0 text-yellow-400" />
                                            <span>移除文件浮水印</span>
                                        </li>
                                    )}

                                    {plan.features.financeModule && (
                                        <li className="flex items-start gap-2 text-xs text-slate-300">
                                            <Check className={`w-4 h-4 shrink-0 ${isPro ? 'text-indigo-400' : 'text-slate-600'}`} />
                                            <span>進階財務/成本模組</span>
                                        </li>
                                    )}

                                    {plan.features.customBranding && (
                                        <li className="flex items-start gap-2 text-xs text-indigo-300 font-black">
                                            <Crown className="w-4 h-4 shrink-0 text-indigo-400" />
                                            <span>品牌客製化 (Logo)</span>
                                        </li>
                                    )}

                                    {plan.features.teamCollaboration && (
                                        <li className="flex items-start gap-2 text-xs text-slate-300">
                                            <Users className="w-4 h-4 shrink-0 text-slate-500" />
                                            <span>{plan.limits.maxSeats} 人團隊協作</span>
                                        </li>
                                    )}

                                    {plan.features.apiAccess && (
                                        <li className="flex items-start gap-2 text-xs text-cyan-400">
                                            <Building2 className="w-4 h-4 shrink-0" />
                                            <span>API 串接服務</span>
                                        </li>
                                    )}
                                </ul>

                                <button
                                    onClick={() => handleUpgrade(plan.id, plan.name)}
                                    className={cn(
                                        "w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95",
                                        isPro 
                                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' 
                                        : isFree 
                                            ? 'bg-slate-800 hover:bg-slate-700 text-white'
                                            : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                                    )}
                                >
                                    {isFree ? '免費開始' : '立即訂閱'}
                                </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-500 text-sm">
                        所有方案皆包含 256-bit 加密保護與 Cloudflare Turnstile 安全驗證。需要更大型的方案？ 
                        <a href="mailto:aim@ycideas.com" className="text-indigo-400 hover:underline ml-1">聯繫我們</a>
                    </p>
                </div>
            </div>

            <UpgradeModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                planName={selectedPlan.name}
                tierId={selectedPlan.id}
                period={period}
            />
        </section>
    );
}
