'use client';

import { useState } from 'react';
import { X, Check, ChevronRight, ChevronLeft, Building2, Zap, Rocket, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { PRICING_CONFIG, SubscriptionTier, PricingPeriod, PricingPlan } from '@/config/subscription';
import ModuleSelector from './ModuleSelector';

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Plan, 2: Modules, 3: Checkout, 4: Success
    const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('professional');
    const [selectedModules, setSelectedModules] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        taxId: '',
        contactName: '',
        email: '',
        bankLast5: '',
        transferDate: new Date().toISOString().split('T')[0]
    });

    if (!isOpen) return null;

    const plan = PRICING_CONFIG[selectedTier];
    const period: PricingPeriod = 'yearly';
    const planPrice = plan.price[period] || 0;
    
    // Add-on calculations
    const maxSelection = plan.limits.includedGeneralModules;
    const addOnCost = plan.addOnPrices.generalModule;
    const addOnCount = Math.max(0, selectedModules.length - maxSelection);
    // Add-on cost is per month, so multiply by 12 for yearly
    const totalAddOnCostYearly = addOnCount * addOnCost * 12; 
    
    const totalAmount = planPrice + totalAddOnCostYearly;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Mock API Call
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('🎉 申請送出成功！');
            setStep(4);
        } catch (error: any) {
            console.error('Submit Error:', error);
            toast.error('表單送出失敗', { description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setSelectedModules([]);
        onClose();
    };

    // Icons map for plans
    const PlanIcons = {
        free: Building2,
        starter: Zap,
        professional: Rocket,
        pro_plus: Crown,
        enterprise: Building2
    };

    const renderPlanCard = (tierId: SubscriptionTier) => {
        if (tierId === 'free') return null; // Hide free plan in upgrade modal
        const t = PRICING_CONFIG[tierId];
        const isSelected = selectedTier === tierId;
        const Icon = PlanIcons[tierId] || Zap;

        return (
            <div 
                key={tierId}
                onClick={() => setSelectedTier(tierId)}
                className={`
                    relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200
                    ${isSelected 
                        ? 'border-cyan-400 bg-slate-800/80 shadow-lg shadow-cyan-500/20' 
                        : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                    }
                `}
            >
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className={`font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>{t.name}</h4>
                        </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'}`}>
                        {isSelected && <Check className="w-3 h-3 text-slate-900" />}
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                        <span className={`text-2xl font-bold ${isSelected ? 'text-cyan-400' : 'text-slate-300'}`}>
                            NT$ {t.price.yearly.toLocaleString()}
                        </span>
                        <span className="text-sm text-slate-500">/ 年</span>
                    </div>
                    {t.price.original && (
                        <div className="text-sm text-slate-500 line-through">
                            原價 NT$ {t.price.original.toLocaleString()} / 月
                        </div>
                    )}
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center text-slate-300">
                        <Check className="w-4 h-4 mr-2 text-emerald-400" />
                        含 {t.limits.includedGeneralModules} 個職人模組
                    </div>
                    <div className="flex items-center text-slate-400 text-xs">
                        加購模組 NT$ {t.addOnPrices.generalModule}/月
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 dark">
            <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative shadow-2xl shadow-cyan-900/20 flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 z-10 shrink-0">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        {step === 1 && "選擇訂閱方案"}
                        {step === 2 && "挑選專屬職人模組"}
                        {step === 3 && "確認結帳與匯款資訊"}
                        {step === 4 && "申請完成"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body scrollable area */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    {/* Progress Bar (if not success) */}
                    {step < 4 && (
                        <div className="mb-8 flex items-center justify-center gap-2 max-w-md mx-auto">
                            <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-slate-800'}`} />
                            <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-slate-800'}`} />
                            <div className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-slate-800'}`} />
                        </div>
                    )}

                    {/* Step 1: Plan Selection */}
                    {step === 1 && (
                        <div className="animate-in slide-in-from-right-8 duration-300">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-bold mb-4 border border-amber-500/20">
                                    🎉 鼓勵年繳：買 12 個月，送 2 個月 (共 14 個月)
                                </div>
                                <p className="text-slate-400">
                                    為提供更穩定的企業級服務，本平台目前採年度 B2B 匯款制。
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {(['starter', 'professional', 'pro_plus', 'enterprise'] as SubscriptionTier[]).map(renderPlanCard)}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Module Selection */}
                    {step === 2 && (
                        <div className="animate-in slide-in-from-right-8 duration-300">
                            <div className="mb-6 bg-slate-800/50 p-4 rounded-xl border border-cyan-500/20 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div>
                                    <h3 className="text-white font-bold text-lg">您已選擇：{plan.name}</h3>
                                    <p className="text-slate-400 text-sm">
                                        包含 {plan.limits.includedGeneralModules} 個免費模組，您可以隨時加購更多職人模組。
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-400">目前模組加購 (年費)</div>
                                    <div className="text-xl font-bold text-cyan-400">+ NT$ {totalAddOnCostYearly.toLocaleString()}</div>
                                </div>
                            </div>
                            
                            {/* We use a wrapper to override ModuleSelector colors for dark mode context */}
                            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl">
                                <ModuleSelector 
                                    maxSelection={maxSelection}
                                    initialSelected={selectedModules}
                                    onSelectionChange={setSelectedModules}
                                    addOnCost={addOnCost}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Checkout */}
                    {step === 3 && (
                        <div className="animate-in slide-in-from-right-8 duration-300 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            
                            {/* Left: Order Summary */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4">訂單總覽 (Order Summary)</h3>
                                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-white font-bold">{plan.name} (年繳)</div>
                                            <div className="text-slate-400 text-sm">包含 {maxSelection} 個模組額度</div>
                                        </div>
                                        <div className="text-white font-medium">NT$ {planPrice.toLocaleString()}</div>
                                    </div>
                                    
                                    {selectedModules.length > maxSelection && (
                                        <div className="flex justify-between items-start pt-4 border-t border-slate-700/50">
                                            <div>
                                                <div className="text-cyan-400 font-bold">模組加購費用</div>
                                                <div className="text-slate-400 text-sm">
                                                    已選 {selectedModules.length} 個 (超額 {addOnCount} 個)<br/>
                                                    NT$ {addOnCost} × 12個月 × {addOnCount}
                                                </div>
                                            </div>
                                            <div className="text-cyan-400 font-medium">+ NT$ {totalAddOnCostYearly.toLocaleString()}</div>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-4 border-t border-slate-600">
                                        <div className="text-slate-300">總應付金額 (含稅)</div>
                                        <div className="text-3xl font-bold text-white">NT$ {totalAmount.toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="mt-6 bg-slate-900 rounded-xl p-5 border border-emerald-500/30">
                                    <h4 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                                        <Check className="w-5 h-5" /> 官方匯款帳號
                                    </h4>
                                    <div className="grid grid-cols-[80px_1fr] gap-3 text-sm">
                                        <span className="text-slate-500">銀行代碼</span><span className="text-slate-300">玉山銀行 (808) 林口分行</span>
                                        <span className="text-slate-500">銀行帳號</span><span className="font-mono font-bold text-white text-lg tracking-wider">0886-940-022350</span>
                                        <span className="text-slate-500">戶名</span><span className="text-slate-300">奕暢創新工作室賴奕暢</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Form */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4">填寫匯款與發票資訊</h3>
                                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                                    <div className="bg-cyan-900/20 p-3 rounded-lg border border-cyan-500/20 mb-2">
                                        <p className="text-xs text-cyan-300 leading-relaxed">
                                            💡 <strong>資料用途：</strong>僅用於「系統升級匯款核對」與「發票開立」。若您接案用的工作室名稱與報稅抬頭不同，請填寫報稅用的抬頭。
                                        </p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs text-slate-400 font-bold">聯絡人姓名 *</label>
                                            <input required type="text" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-cyan-500 focus:outline-none" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-slate-400 font-bold">寄送發票 Email *</label>
                                            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-cyan-500 focus:outline-none" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs text-slate-400 font-bold">公司抬頭 *</label>
                                            <input required type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-cyan-500 focus:outline-none" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-slate-400 font-bold">統一編號</label>
                                            <input type="text" value={formData.taxId} onChange={e => setFormData({...formData, taxId: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-cyan-500 focus:outline-none" placeholder="選填" />
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-800 my-4"></div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs text-slate-400 font-bold">匯款帳號後五碼 *</label>
                                            <input required type="text" maxLength={5} value={formData.bankLast5} onChange={e => setFormData({...formData, bankLast5: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-cyan-500 focus:outline-none" placeholder="例如: 12345" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-slate-400 font-bold">匯款日期 *</label>
                                            <input required type="date" value={formData.transferDate} onChange={e => setFormData({...formData, transferDate: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-cyan-500 focus:outline-none" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <div className="text-center py-12 animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/50 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                                <Check className="w-10 h-10" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4">審核申請已送出！</h3>
                            <p className="text-slate-400 mb-8 text-lg max-w-lg mx-auto leading-relaxed">
                                感謝您的匯款與支持！我們將於 1-2 個工作天內核對帳款，開通您的 14 個月專屬權限，並將電子發票寄送至您的信箱。
                            </p>
                            <button onClick={handleClose} className="px-8 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition-colors border border-slate-700">
                                返回儀表板
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer / Actions */}
                {step < 4 && (
                    <div className="p-6 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md shrink-0 flex justify-between items-center">
                        <div>
                            {step > 1 && (
                                <button 
                                    onClick={() => setStep(s => s - 1 as any)} 
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" /> 上一步
                                </button>
                            )}
                        </div>
                        
                        <div>
                            {step === 1 && (
                                <button 
                                    onClick={() => setStep(2)} 
                                    className="flex items-center gap-2 bg-gradient-to-br from-cyan-400 to-cyan-600 hover:brightness-110 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20 border border-white/10"
                                >
                                    下一步：挑選模組 <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                            {step === 2 && (
                                <button 
                                    onClick={() => setStep(3)} 
                                    className="flex items-center gap-2 bg-gradient-to-br from-cyan-400 to-cyan-600 hover:brightness-110 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20 border border-white/10"
                                >
                                    下一步：前往結帳 <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                            {step === 3 && (
                                <button 
                                    type="submit"
                                    form="checkout-form"
                                    disabled={isLoading} 
                                    className="flex items-center gap-2 bg-gradient-to-br from-emerald-400 to-emerald-600 hover:brightness-110 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 border border-white/10 disabled:opacity-50"
                                >
                                    {isLoading ? '處理中...' : '我已匯款，送出審核'}
                                    {!isLoading && <Check className="w-4 h-4" />}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
