'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import Link from 'next/link';
import {
    ArrowLeft,
    Mail,
    Building2,
    Phone,
    MapPin,
    CreditCard,
    Calendar,
    Plus,
    CheckCircle2,
    XCircle,
    Clock
} from 'lucide-react';
import SubscriptionForm from '@/components/admin/SubscriptionForm';

interface Customer {
    id: string;
    user_id: string;
    company_name: string;
    contact_person: string;
    email: string;
    phone: string;
    address: string;
    tax_id: string;
    created_at: string;
}

interface Subscription {
    id: string;
    module_id: string;
    plan_type: string;
    start_date: string;
    end_date: string;
    status: string;
    amount_paid: number;
    is_trial: boolean;
}

export default function CustomerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const customerId = params.id as string;

    const [customer, setCustomer] = useState<Customer | null>(null);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        fetchCustomerData();
    }, [customerId]);

    async function fetchCustomerData() {
        try {
            setLoading(true);

            // 獲取客戶資料
            const { data: customerData, error: customerError } = await supabase
                .from('clients')
                .select('*')
                .eq('id', customerId)
                .single();

            if (customerError) throw customerError;
            setCustomer(customerData);

            // 獲取訂閱資料
            const { data: subsData, error: subsError } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', customerData.user_id)
                .order('created_at', { ascending: false });

            if (subsError) throw subsError;
            setSubscriptions(subsData || []);

        } catch (error) {
            console.error('Error fetching customer data:', error);
            toast.error('載入客戶資料失敗');
        } finally {
            setLoading(false);
        }
    }

    function getStatusBadge(status: string) {
        const styles = {
            active: 'bg-green-100 text-green-700',
            expired: 'bg-gray-100 text-gray-600',
            cancelled: 'bg-red-100 text-red-700'
        };

        const icons = {
            active: <CheckCircle2 className="w-3.5 h-3.5" />,
            expired: <Clock className="w-3.5 h-3.5" />,
            cancelled: <XCircle className="w-3.5 h-3.5" />
        };

        return (
            <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.expired}`}>
                {icons[status as keyof typeof icons]}
                <span>{status}</span>
            </span>
        );
    }

    function getModuleName(moduleId: string) {
        const modules: Record<string, string> = {
            'sub_web': '網站開發',
            'sub_marketing': '行銷模組',
            'sub_discord': 'Discord 模組',
            'sub_exhibition': '展覽模組',
            'bundle_starter': '入門套餐',
            'bundle_pro': '專業套餐'
        };
        return modules[moduleId] || moduleId;
    }

    function getPlanTypeName(planType: string) {
        const plans: Record<string, string> = {
            'trial': '試用',
            'monthly': '月繳',
            'yearly': '年繳',
            'bundle': '套餐'
        };
        return plans[planType] || planType;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">載入客戶資料中...</p>
                </div>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">找不到客戶資料</p>
                <Link href="/admin/customers" className="text-blue-600 hover:underline mt-2 inline-block">
                    返回客戶列表
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link
                href="/admin/customers"
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>返回客戶列表</span>
            </Link>

            {/* Customer Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-black/30 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">客戶資料</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                        <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-medium text-gray-900">{customer.email || '未提供'}</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500">公司名稱</p>
                            <p className="text-sm font-medium text-gray-900">{customer.company_name || '未提供'}</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500">統一編號</p>
                            <p className="text-sm font-medium text-gray-900">{customer.tax_id || '未提供'}</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500">電話</p>
                            <p className="text-sm font-medium text-gray-900">{customer.phone || '未提供'}</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3 md:col-span-2">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500">地址</p>
                            <p className="text-sm font-medium text-gray-900">{customer.address || '未提供'}</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500">註冊日期</p>
                            <p className="text-sm font-medium text-gray-900">
                                {new Date(customer.created_at).toLocaleDateString('zh-TW')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subscriptions Section */}
            <div className="bg-white rounded-lg shadow-sm border border-black/30 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">訂閱管理</h2>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>新增訂閱</span>
                    </button>
                </div>

                {subscriptions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        此客戶尚無訂閱記錄
                    </div>
                ) : (
                    <div className="space-y-3">
                        {subscriptions.map((sub) => (
                            <div
                                key={sub.id}
                                className="border border-black/30 rounded-lg p-4 hover:border-blue-300 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="font-semibold text-gray-900">
                                                {getModuleName(sub.module_id)}
                                            </h3>
                                            {getStatusBadge(sub.status)}
                                            {sub.is_trial && (
                                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                                    試用
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                            <span>方案: {getPlanTypeName(sub.plan_type)}</span>
                                            <span>•</span>
                                            <span>開始: {new Date(sub.start_date).toLocaleDateString('zh-TW')}</span>
                                            <span>•</span>
                                            <span>到期: {new Date(sub.end_date).toLocaleDateString('zh-TW')}</span>
                                        </div>

                                        {sub.amount_paid > 0 && (
                                            <p className="text-sm text-gray-500">
                                                付款金額: NT$ {sub.amount_paid.toLocaleString()}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex space-x-2">
                                        <button className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            延長
                                        </button>
                                        <button className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            取消
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Subscription Form Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <SubscriptionForm
                        userId={customer.user_id}
                        onClose={() => setShowAddForm(false)}
                        onSuccess={() => {
                            fetchCustomerData(); // Refresh data
                            setShowAddForm(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
