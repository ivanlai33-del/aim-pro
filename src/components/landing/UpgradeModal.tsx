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
    period?: PricingPeriod;
}

export default function UpgradeModal({ isOpen, onClose, planName, tierId, period = 'monthly' }: UpgradeModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handlePayment = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tier: tierId,
                    period: period
                })
            });

            const result = await response.json();
            if (result.error) throw new Error(result.error);

            // Create dynamic form and submit to NewebPay
            const { MerchantID, TradeInfo, TradeSha, Version, PaymentUrl } = result.data;
            
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = PaymentUrl;

            const fields = { MerchantID, TradeInfo, TradeSha, Version };
            Object.entries(fields).forEach(([key, value]) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value as string;
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();

        } catch (error: any) {
            console.error('Payment Error:', error);
            toast.error('金流啟動失敗', { description: error.message });
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

                    <>
                        <h3 className="text-2xl font-bold text-white mb-2">
                            升級至 <span className="text-cyan-400">{planName}</span>
                        </h3>
                        <p className="text-slate-400 mb-6">
                            立即解鎖專業版功能：無限專案數、自動生成分析報告、財務收支追蹤，以及更多的 AI 生成額度。
                        </p>

                        <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-400">訂閱方案</span>
                                <span className="text-white font-bold">{planName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">應付金額</span>
                                <span className="text-2xl font-bold text-cyan-400">
                                    NT$ {PRICING_CONFIG[tierId as SubscriptionTier]?.price[period].toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 hover:brightness-110 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 border border-white/10"
                        >
                            {isLoading ? '處理中...' : '前往安全支付 (藍新金流)'}
                        </button>
                        
                        <p className="text-[10px] text-slate-500 mt-4 text-center">
                            點擊即代表您同意服務條款與隱私政策。<br />
                            支付由藍新金流提供 256-bit SSL 加密保護。
                        </p>
                    </>
            </div>
        </div>
    );
}
