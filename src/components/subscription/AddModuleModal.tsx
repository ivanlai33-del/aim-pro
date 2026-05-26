'use client';

import { useState } from 'react';
import { X, CheckCircle2, Crown, ShoppingCart, ArrowRight, Check } from 'lucide-react';
import { BUSINESS_MODULES, INDUSTRY_CATEGORIES } from '@/config/industries';
import { useModuleAccess } from '@/hooks/useModuleAccess';
import { useProject } from '@/context/ProjectContext';
import { toast } from 'sonner';
import { PRICING_CONFIG } from '@/config/subscription';

interface AddModuleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// 暫時定義重量級模組清單 (後續可移至設定檔)
const HEAVY_MODULES = ['video_production', 'ai_agent_consultant', 'government_tender'];

export default function AddModuleModal({ isOpen, onClose }: AddModuleModalProps) {
    const { userTier, currentPersona, setPersona, session } = useProject();
    const { checkAccess } = useModuleAccess();
    const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([]);
    
    // 金流表單狀態
    const [step, setStep] = useState<1 | 2 | 3>(1); // 1: 選擇模組, 2: 填寫表單, 3: 成功
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

    const unlockedCount = currentPersona.unlockedModules.length;
    const maxBaseModules = userTier === 'free' ? 1 : 2;
    const isUpgradeNeeded = userTier === 'free' && unlockedCount >= 1;
    const isAddOnPurchase = userTier !== 'free' && unlockedCount >= 2;

    const toggleModule = (id: string) => {
        if (!isAddOnPurchase && selectedModuleIds.length >= (maxBaseModules - unlockedCount) && !selectedModuleIds.includes(id)) {
            toast.error(`您目前只能再免費選擇 ${maxBaseModules - unlockedCount} 個模組`);
            return;
        }
        setSelectedModuleIds(prev => 
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    // 計算價格
    const calculateTotal = () => {
        if (!isAddOnPurchase) return 0;
        let total = 0;
        selectedModuleIds.forEach(id => {
            if (HEAVY_MODULES.includes(id)) {
                total += PRICING_CONFIG[userTier].addOnPrices.heavyModule;
            } else {
                total += PRICING_CONFIG[userTier].addOnPrices.generalModule;
            }
        });
        return total;
    };

    const totalAmount = calculateTotal();

    const handleConfirmSelection = () => {
        if (selectedModuleIds.length === 0 && !isUpgradeNeeded) {
            toast.error("請至少選擇一個模組");
            return;
        }

        if (isUpgradeNeeded) {
            window.open('/pricing', '_blank');
            toast.info("請升級至 Professional 方案以解鎖更多模組");
            return;
        }

        if (isAddOnPurchase) {
            // 進入匯款表單流程
            setStep(2);
        } else {
            // 免費額度：直接啟用
            const updatedPersona = {
                ...currentPersona,
                unlockedModules: [...currentPersona.unlockedModules, ...selectedModuleIds]
            };
            setPersona(updatedPersona);
            toast.success(`成功啟用 ${selectedModuleIds.length} 個模組`);
            onClose();
        }
    };

    const handleSubmitPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('/api/payment/submit-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: session?.user?.id || 'guest',
                    tier: 'module_addon', // 特殊標記為模組加購
                    amount: totalAmount,
                    ...formData,
                    // 將選購的模組附註在 metadata 裡 (透過 description)
                    description: `加購模組: ${selectedModuleIds.join(', ')}`
                })
            });

            const result = await response.json();
            if (result.error) throw new Error(result.error);

            toast.success('🎉 申請送出成功！');
            setStep(3);
        } catch (error: any) {
            console.error('Submit Error:', error);
            toast.error('表單送出失敗', { description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const availableCategories = Object.values(INDUSTRY_CATEGORIES);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`bg-slate-900 border border-indigo-500/30 rounded-2xl w-full ${step === 1 ? 'max-w-4xl' : 'max-w-md'} max-h-[90vh] flex flex-col overflow-hidden relative shadow-2xl shadow-indigo-500/20 animate-in zoom-in-95 duration-200`}>
                
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            {step === 1 ? (
                                isUpgradeNeeded ? '升級方案 (Upgrade Plan)' :
                                isAddOnPurchase ? '加購模組 (Purchase Add-on)' :
                                '選擇服務模組 (Select Module)'
                            ) : step === 2 ? '填寫匯款與發票資訊' : '申請已送出'}
                        </h2>
                        {step === 1 && (
                            <p className="text-sm text-slate-400 mt-1">
                                {isUpgradeNeeded ? '訪客版僅限 1 個模組，請升級以解鎖更多。' :
                                 isAddOnPurchase ? '您可以複選多個模組一次結帳。' :
                                 `您目前還可以免費選擇 ${maxBaseModules - unlockedCount} 個模組。`}
                            </p>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
                    
                    {step === 1 && (
                        isUpgradeNeeded ? (
                            <div className="text-center py-12">
                                <Crown className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-2">升級 Professional 專業版</h3>
                                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                                    解鎖任選 2 個專業模組、無限專案數量、移除浮水印，並開啟加購權限。
                                </p>
                                <div className="flex justify-center gap-4">
                                    <button onClick={onClose} className="px-6 py-3 rounded-lg border border-white/20 font-medium hover:bg-white/5 text-slate-300">
                                        稍後再說
                                    </button>
                                    <button onClick={handleConfirmSelection} className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20">
                                        前往升級 ($2,900/月)
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {availableCategories.map(cat => (
                                    <div key={cat.id} className="space-y-4">
                                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">{cat.name}</h3>
                                        {cat.items.map(module => {
                                            const isUnlocked = checkAccess(module.id);
                                            const isSelected = selectedModuleIds.includes(module.id);
                                            const isHeavy = HEAVY_MODULES.includes(module.id);
                                            const price = isHeavy ? PRICING_CONFIG[userTier].addOnPrices.heavyModule : PRICING_CONFIG[userTier].addOnPrices.generalModule;

                                            if (isUnlocked) return null;

                                            return (
                                                <button
                                                    key={module.id}
                                                    onClick={() => toggleModule(module.id)}
                                                    className={`w-full text-left p-4 rounded-xl border transition-all relative overflow-hidden group ${isSelected
                                                            ? 'border-indigo-500 bg-indigo-500/10 shadow-md transform scale-[1.02]'
                                                            : 'border-white/10 bg-white/5 hover:border-indigo-500/50 hover:bg-white/10'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className={`font-bold ${isSelected ? 'text-indigo-400' : 'text-slate-300'}`}>
                                                            {module.name}
                                                        </h4>
                                                        {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-500" />}
                                                    </div>
                                                    <p className="text-xs text-slate-500 line-clamp-2">{module.tagline}</p>

                                                    {isAddOnPurchase && (
                                                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                            ${price} / 永久
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        )
                    )}

                    {step === 2 && (
                        <form onSubmit={handleSubmitPayment} className="space-y-4">
                            <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-slate-700">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-400">加購模組數量</span>
                                    <span className="text-white font-bold">{selectedModuleIds.length} 個</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">總金額 (含稅)</span>
                                    <span className="text-2xl font-bold text-indigo-400">
                                        NT$ {totalAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-slate-900 rounded-xl p-4 mb-6 border border-emerald-500/30 text-sm">
                                <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                                    <Check className="w-4 h-4" /> 官方匯款帳號
                                </h4>
                                <div className="grid grid-cols-[80px_1fr] gap-2 text-slate-300">
                                    <span className="text-slate-500">銀行代碼</span><span>玉山銀行 (808) 林口分行</span>
                                    <span className="text-slate-500">銀行帳號</span><span className="font-mono font-bold text-white text-base">0886-940-022350</span>
                                    <span className="text-slate-500">戶名</span><span>奕暢創新工作室賴奕暢</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 font-bold">聯絡人姓名 *</label>
                                    <input required type="text" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 font-bold">寄送發票 Email *</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 font-bold">公司抬頭 *</label>
                                    <input required type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 font-bold">統一編號</label>
                                    <input type="text" value={formData.taxId} onChange={e => setFormData({...formData, taxId: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none" placeholder="選填" />
                                </div>
                            </div>

                            <div className="border-t border-slate-800 my-4 pt-4"></div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 font-bold">匯款帳號後五碼 *</label>
                                    <input required type="text" maxLength={5} value={formData.bankLast5} onChange={e => setFormData({...formData, bankLast5: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none" placeholder="例如: 12345" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 font-bold">匯款日期 *</label>
                                    <input required type="date" value={formData.transferDate} onChange={e => setFormData({...formData, transferDate: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none" />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setStep(1)} className="px-4 py-3 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-colors">
                                    上一步
                                </button>
                                <button type="submit" disabled={isLoading} className="flex-1 bg-gradient-to-br from-indigo-500 to-purple-600 hover:brightness-110 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center">
                                    {isLoading ? '處理中...' : '送出審核'}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/50">
                                <Check className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">審核申請已送出</h3>
                            <p className="text-slate-400 mb-8 text-sm">
                                感謝您的加購匯款！我們將於 1-2 個工作天內核對帳款，開通您的模組權限，並將電子發票寄送至您的信箱。
                            </p>
                            <button onClick={onClose} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors border border-slate-700">
                                關閉視窗
                            </button>
                        </div>
                    )}

                </div>

                {/* Footer Action (Only Step 1) */}
                {step === 1 && !isUpgradeNeeded && (
                    <div className="p-6 border-t border-white/10 bg-slate-900 flex justify-end items-center gap-4">
                        <div className="text-sm text-slate-400">
                            {isAddOnPurchase ? (
                                <span>預計費用：<span className="font-bold text-white">${totalAmount.toLocaleString()}</span> (買斷)</span>
                            ) : (
                                <span>免費額度：尚餘 <span className="font-bold text-emerald-400">{maxBaseModules - unlockedCount - selectedModuleIds.length}</span> 個</span>
                            )}
                        </div>
                        <button
                            onClick={handleConfirmSelection}
                            disabled={selectedModuleIds.length === 0}
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all active:scale-95"
                        >
                            {isAddOnPurchase ? (
                                <>
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    進入結帳 (${totalAmount.toLocaleString()})
                                </>
                            ) : (
                                <>
                                    確認啟用
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
