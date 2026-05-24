'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { PRICING_CONFIG, SubscriptionTier, PricingPeriod } from '@/config/subscription';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    planName: string;
    tierId: string;
    userId?: string; // Need user ID for submission
}

export default function UpgradeModal({ isOpen, onClose, planName, tierId, userId = 'mock_user_id' }: UpgradeModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Info, 2: Form, 3: Success
    const [formData, setFormData] = useState({
        companyName: '',
        taxId: '',
        contactName: '',
        email: '',
        bankLast5: '',
        transferDate: new Date().toISOString().split('T')[0]
    });

    if (!isOpen) return null;

    // Force Yearly pricing
    const period: PricingPeriod = 'yearly';
    const amount = PRICING_CONFIG[tierId as SubscriptionTier]?.price[period] || 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('/api/payment/submit-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    tier: tierId,
                    amount,
                    ...formData
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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-md p-6 relative shadow-2xl shadow-cyan-500/20 animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                    {step === 1 && (
                        <>
                            <h3 className="text-2xl font-bold text-white mb-2">
                                升級至 <span className="text-cyan-400">{planName}</span>
                            </h3>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold mb-4 border border-amber-500/30">
                                🎉 鼓勵年繳：買 12 個月，送 2 個月 (共 14 個月)
                            </div>
                            <p className="text-slate-400 mb-6 text-sm">
                                立即解鎖專業版功能。為提供更穩定的企業級服務，本平台目前採年度 B2B 匯款制。
                            </p>

                            <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-slate-700">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-400">訂閱方案 (年繳)</span>
                                    <span className="text-white font-bold">{planName}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">應付金額 (含稅)</span>
                                    <span className="text-2xl font-bold text-cyan-400">
                                        NT$ {amount.toLocaleString()}
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

                            <button
                                onClick={() => setStep(2)}
                                className="w-full bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 hover:brightness-110 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20 border border-white/10"
                            >
                                我已匯款，填寫發票與對帳單
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="text-xl font-bold text-white mb-4">填寫發票與對帳資訊</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 font-bold">聯絡人姓名 *</label>
                                    <input required type="text" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 font-bold">寄送發票 Email *</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 font-bold">公司抬頭 *</label>
                                    <input required type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 font-bold">統一編號</label>
                                    <input type="text" value={formData.taxId} onChange={e => setFormData({...formData, taxId: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none" placeholder="選填" />
                                </div>
                            </div>

                            <div className="border-t border-slate-800 my-4 pt-4"></div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 font-bold">匯款帳號後五碼 *</label>
                                    <input required type="text" maxLength={5} value={formData.bankLast5} onChange={e => setFormData({...formData, bankLast5: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none" placeholder="例如: 12345" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 font-bold">匯款日期 *</label>
                                    <input required type="date" value={formData.transferDate} onChange={e => setFormData({...formData, transferDate: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none" />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setStep(1)} className="px-4 py-3 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-colors">
                                    返回
                                </button>
                                <button type="submit" disabled={isLoading} className="flex-1 bg-gradient-to-br from-cyan-400 to-emerald-500 hover:brightness-110 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center">
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
                                感謝您的匯款！我們將於 1-2 個工作天內核對帳款，開通您的 14 個月專屬權限，並將電子發票寄送至您的信箱。
                            </p>
                            <button onClick={onClose} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors border border-slate-700">
                                關閉視窗
                            </button>
                        </div>
                    )}
            </div>
        </div>
    );
}
