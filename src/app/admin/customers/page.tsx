'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Search, Mail, Building2, CreditCard, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Customer {
    id: string;
    company_name: string;
    contact_person: string;
    email: string;
    phone: string;
    tax_id: string;
    created_at: string;
    subscriptionCount?: number;
    activeSubscriptions?: number;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        filterCustomers();
    }, [searchQuery, customers]);

    async function fetchCustomers() {
        try {
            setLoading(true);

            // 獲取所有客戶
            const { data: clientsData, error: clientsError } = await supabase
                .from('clients')
                .select('*')
                .order('created_at', { ascending: false });

            if (clientsError) throw clientsError;

            // 獲取每個客戶的訂閱數量
            const customersWithSubs = await Promise.all(
                (clientsData || []).map(async (client) => {
                    const { data: subs } = await supabase
                        .from('subscriptions')
                        .select('status')
                        .eq('user_id', client.user_id);

                    const activeCount = subs?.filter(s => s.status === 'active').length || 0;

                    return {
                        ...client,
                        subscriptionCount: subs?.length || 0,
                        activeSubscriptions: activeCount
                    };
                })
            );

            setCustomers(customersWithSubs);
            setFilteredCustomers(customersWithSubs);
        } catch (error) {
            console.error('Error fetching customers:', error);
            toast.error('載入客戶資料失敗');
        } finally {
            setLoading(false);
        }
    }

    function filterCustomers() {
        if (!searchQuery.trim()) {
            setFilteredCustomers(customers);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = customers.filter(customer =>
            customer.email?.toLowerCase().includes(query) ||
            customer.company_name?.toLowerCase().includes(query) ||
            customer.contact_person?.toLowerCase().includes(query) ||
            customer.tax_id?.includes(query)
        );

        setFilteredCustomers(filtered);
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

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">客戶管理</h1>
                <p className="mt-1 text-sm text-gray-500">
                    管理所有客戶資料與訂閱狀態
                </p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-black/30 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="搜尋客戶（Email、公司名稱、統編、聯絡人）..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-black/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    共 <span className="font-semibold text-gray-900">{filteredCustomers.length}</span> 筆客戶資料
                    {searchQuery && ` (從 ${customers.length} 筆中篩選)`}
                </p>
            </div>

            {/* Customer List */}
            <div className="space-y-3">
                {filteredCustomers.length === 0 ? (
                    <div className="bg-white rounded-lg border border-black/30 p-12 text-center">
                        <p className="text-gray-500">
                            {searchQuery ? '找不到符合條件的客戶' : '尚無客戶資料'}
                        </p>
                    </div>
                ) : (
                    filteredCustomers.map((customer) => (
                        <Link
                            key={customer.id}
                            href={`/admin/customers/${customer.id}`}
                            className="block bg-white rounded-lg border border-black/30 hover:border-blue-300 hover:shadow-md transition-all p-5 group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 space-y-2">
                                    {/* Email */}
                                    <div className="flex items-center space-x-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-900">
                                            {customer.email || '未提供 Email'}
                                        </span>
                                    </div>

                                    {/* Company & Tax ID */}
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <Building2 className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">
                                                {customer.company_name || '未提供公司名稱'}
                                            </span>
                                        </div>
                                        {customer.tax_id && (
                                            <div className="flex items-center space-x-2">
                                                <CreditCard className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    {customer.tax_id}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Created Date & Subscriptions */}
                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>
                                                註冊: {new Date(customer.created_at).toLocaleDateString('zh-TW')}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${customer.activeSubscriptions! > 0
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {customer.activeSubscriptions} 個 active 訂閱
                                            </span>
                                            {customer.subscriptionCount! > 0 && (
                                                <span className="text-gray-400">
                                                    (共 {customer.subscriptionCount} 個)
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Arrow Icon */}
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-1" />
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
