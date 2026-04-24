'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface SubscriptionFormProps {
    userId: string;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any; // 如果是編輯模式，傳入現有資料
}

export default function SubscriptionForm({ userId, onClose, onSuccess, initialData }: SubscriptionFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        moduleId: initialData?.module_id || 'sub_web',
        planType: initialData?.plan_type || 'monthly',
        duration: 1, // 預設 1 個月/年
        isTrial: initialData?.is_trial || false
    });

    const MODULE_OPTIONS = [
        { value: 'sub_web', label: '網站開發模組' },
        { value: 'sub_marketing', label: '行銷模組' },
        { value: 'sub_discord', label: 'Discord 模組' },
        { value: 'sub_exhibition', label: '展覽模組' },
        { value: 'bundle_starter', label: '入門套餐' },
        { value: 'bundle_pro', label: '專業套餐' }
    ];

    const PLAN_OPTIONS = [
        { value: 'trial', label: '試用 (7天)' },
        { value: 'monthly', label: '月繳' },
        { value: 'yearly', label: '年繳' },
        { value: 'bundle', label: '單次套餐' }
    ];

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            // 計算到期日
            const startDate = new Date();
            const endDate = new Date(startDate);

            if (formData.planType === 'trial') {
                endDate.setDate(endDate.getDate() + 7); // 試用 7 天
            } else if (formData.planType === 'monthly') {
                endDate.setMonth(endDate.getMonth() + formData.duration);
            } else if (formData.planType === 'yearly') {
                endDate.setFullYear(endDate.getFullYear() + formData.duration);
            } else {
                // 套餐預設 1 年，或依需求調整
                endDate.setFullYear(endDate.getFullYear() + 1);
            }

            const payload = {
                user_id: userId,
                module_id: formData.moduleId,
                plan_type: formData.planType,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                status: 'active',
                is_trial: formData.planType === 'trial',
                amount_paid: formData.planType === 'trial' ? 0 : 999 // 這裡暫時用假金額，實際應連接付款記錄
            };

            const { error } = await supabase
                .from('subscriptions')
                .insert(payload);

            if (error) throw error;

            toast.success('訂閱已成功新增');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error creating subscription:', error);
            toast.error('新增訂閱失敗: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">
                {initialData ? '編輯訂閱' : '新增訂閱'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Module Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        訂閱模組
                    </label>
                    <select
                        value={formData.moduleId}
                        onChange={(e) => setFormData({ ...formData, moduleId: e.target.value })}
                        className="w-full border border-black/30 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                    >
                        {MODULE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                {/* Plan Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        方案類型
                    </label>
                    <select
                        value={formData.planType}
                        onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
                        className="w-full border border-black/30 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                    >
                        {PLAN_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                {/* Duration (Only for monthly/yearly) */}
                {(formData.planType === 'monthly' || formData.planType === 'yearly') && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            訂閱時長 ({formData.planType === 'monthly' ? '月' : '年'})
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="120"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })}
                            className="w-full border border-black/30 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                        取消
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '確認新增'}
                    </button>
                </div>
            </form>
        </div>
    );
}
