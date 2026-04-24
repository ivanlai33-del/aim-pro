'use client';

import { useState } from 'react';
import { X, CheckCircle2, Crown, ShoppingCart, ArrowRight } from 'lucide-react';
import { BUSINESS_MODULES, INDUSTRY_CATEGORIES } from '@/config/industries';
import { useModuleAccess } from '@/hooks/useModuleAccess';
import { useProject } from '@/context/ProjectContext';
import { toast } from 'sonner';

interface AddModuleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddModuleModal({ isOpen, onClose }: AddModuleModalProps) {
    const { userTier, currentPersona, setPersona } = useProject();
    const { checkAccess } = useModuleAccess();
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

    if (!isOpen) return null;

    // Logic to determine state:
    // 1. Free User (Has 1 module) -> Upgrade to Pro
    // 2. Pro User (Has < 2 modules) -> Select Free
    // 3. Pro User (Has >= 2 modules) -> Purchase Add-on
    const unlockedCount = currentPersona.unlockedModules.length;
    const maxBaseModules = userTier === 'free' ? 1 : 2;
    const isUpgradeNeeded = userTier === 'free' && unlockedCount >= 1;
    const isAddOnPurchase = userTier !== 'free' && unlockedCount >= 2;

    const handleConfirm = () => {
        if (!selectedModuleId && !isUpgradeNeeded) {
            toast.error("請選擇一個模組");
            return;
        }

        if (isUpgradeNeeded) {
            // Mock Upgrade Flow
            window.open('/pricing', '_blank');
            toast.info("請升級至 Professional 方案以解鎖更多模組");
            return;
        }

        if (isAddOnPurchase) {
            // Mock Purchase Flow
            const cost = userTier === 'professional' ? 900 : 1000;
            if (confirm(`確認加購「${BUSINESS_MODULES[selectedModuleId!].name}」模組？\n費用：$${cost} /月`)) {
                // Update Persona (Mock DB Update)
                const updatedPersona = {
                    ...currentPersona,
                    addOnModules: [...(currentPersona.addOnModules || []), selectedModuleId!]
                };
                setPersona(updatedPersona);
                toast.success(`成功加購：${BUSINESS_MODULES[selectedModuleId!].name}`);
                onClose();
            }
        } else {
            // Select Base Module (Free quota)
            // Update Persona (Mock DB Update)
            const updatedPersona = {
                ...currentPersona,
                unlockedModules: [...currentPersona.unlockedModules, selectedModuleId!]
            };
            setPersona(updatedPersona);
            toast.success(`成功啟用：${BUSINESS_MODULES[selectedModuleId!].name}`);
            onClose();
        }
    };

    // Filter logic for selectable modules
    // Show ALL modules that are NOT already unlocked
    const availableCategories = Object.values(INDUSTRY_CATEGORIES);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-black/30 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            {isUpgradeNeeded ? '升級方案 (Upgrade Plan)' :
                                isAddOnPurchase ? '加購模組 (Purchase Add-on)' :
                                    '選擇服務模組 (Select Module)'}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            {isUpgradeNeeded ? '訪客版僅限 1 個模組，請升級以解鎖更多。' :
                                isAddOnPurchase ? '您已用完基本額度，請選擇要加購的模組。' :
                                    `您目前還可以免費選擇 ${maxBaseModules - unlockedCount} 個模組。`}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50">

                    {isUpgradeNeeded ? (
                        <div className="text-center py-12">
                            <Crown className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">升級 Professional 專業版</h3>
                            <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                解鎖任選 2 個專業模組、無限專案數量、移除浮水印，並開啟加購權限。
                            </p>
                            <div className="flex justify-center gap-4">
                                <button onClick={onClose} className="px-6 py-3 rounded-lg border border-black/30 font-medium hover:bg-white text-slate-600">
                                    稍後再說
                                </button>
                                <button onClick={handleConfirm} className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                                    前往升級 ($2,900/月)
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {availableCategories.map(cat => (
                                <div key={cat.id} className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">{cat.name}</h3>
                                    {cat.items.map(module => {
                                        const isUnlocked = checkAccess(module.id);
                                        const isSelected = selectedModuleId === module.id;

                                        if (isUnlocked) return null; // Don't show already unlocked

                                        return (
                                            <button
                                                key={module.id}
                                                onClick={() => setSelectedModuleId(module.id)}
                                                className={`w-full text-left p-4 rounded-xl border-2 transition-all relative overflow-hidden group ${isSelected
                                                        ? 'border-indigo-600 bg-indigo-50 shadow-md transform scale-[1.02]'
                                                        : 'border-white bg-white hover:border-indigo-200 hover:shadow-sm'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className={`font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                        {module.name}
                                                    </h4>
                                                    {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                                                </div>
                                                <p className="text-xs text-slate-500 line-clamp-2">{module.tagline}</p>

                                                {/* Price Tag for Add-on */}
                                                {isAddOnPurchase && (
                                                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                        +${userTier === 'professional' ? '900' : '1000'}/mo
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Action */}
                {!isUpgradeNeeded && (
                    <div className="p-6 border-t border-black/30 bg-white flex justify-end items-center gap-4">
                        <div className="text-sm text-slate-500">
                            {isAddOnPurchase ? (
                                <span>預計費用：<span className="font-bold text-slate-900">${userTier === 'professional' ? '900' : '1000'}</span> /月</span>
                            ) : (
                                <span>免費額度：尚餘 <span className="font-bold text-green-600">{maxBaseModules - unlockedCount}</span> 個</span>
                            )}
                        </div>
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedModuleId}
                            className="px-6 py-2.5 bg-indigo-900 text-white rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all active:scale-95"
                        >
                            {isAddOnPurchase ? (
                                <>
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    確認加購
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
