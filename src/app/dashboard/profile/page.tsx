'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { User, Mail, Building2, Phone, MapPin, LogOut, Shield, Key, Crown, CheckCircle2, Lock, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useProject } from '@/context/ProjectContext';
import { trackEvent } from '@/lib/tracking';

export default function ProfilePage() {
    const router = useRouter();
    const { userTier } = useProject();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [subscription, setSubscription] = useState<any>(null);
    const [profile, setProfile] = useState({
        email: '',
        full_name: '',
        company: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        loadUserProfile();
        trackEvent('VIEW_SETTINGS', { source: 'personal_settings' });
    }, []);

    async function loadUserProfile() {
        try {
            const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

            if (authError || !authUser) {
                router.push('/login');
                return;
            }

            setUser(authUser);
            setProfile({
                email: authUser.email || '',
                full_name: authUser.user_metadata?.full_name || '',
                company: authUser.user_metadata?.company || '',
                phone: authUser.user_metadata?.phone || '',
                address: authUser.user_metadata?.address || ''
            });

            // Fetch subscription data (Defensive check to avoid 406 if table missing)
            try {
                const { data: subData, error: subError } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', authUser.id)
                    .single();

                if (!subError && subData) {
                    setSubscription(subData);
                } else if (subError && subError.code !== 'PGRST116') {
                    // PGRST116 is just "no rows", which is fine. 
                    // We only log if it's something else, but we keep it quiet to avoid 406 noise.
                    console.debug('Subscription table notice:', subError.message);
                }
            } catch (e) {
                // Table might not exist yet
                console.debug('Subscription table not ready');
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            toast.error('載入個人資料失敗');
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        setSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: profile.full_name,
                    company: profile.company,
                    phone: profile.phone,
                    address: profile.address
                }
            });

            if (error) throw error;
            toast.success('個人資料已更新');
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error('更新失敗: ' + error.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleLogout() {
        try {
            await supabase.auth.signOut();
            router.push('/login');
            toast.success('已登出');
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error('登出失敗');
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">載入中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl animate-in fade-in pb-20">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">個人設定</h1>
                    <p className="text-slate-500">Personal Settings</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    <span>登出</span>
                </button>
            </div>

            <div className="space-y-6">
                {/* Account Info */}
                <section className="bg-white rounded-xl border border-black/30 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-50 to-emerald-50 px-6 py-4 border-b border-black/30 flex items-center">
                        <User className="w-5 h-5 text-cyan-600 mr-2" />
                        <h2 className="text-lg font-bold text-gray-800">帳號資訊</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    disabled
                                    className="w-full px-3 py-2 border border-black/30 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1">Email 無法修改</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    姓名
                                </label>
                                <input
                                    type="text"
                                    value={profile.full_name}
                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                    placeholder="您的姓名"
                                    className="w-full px-3 py-2 border border-black/30 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Info */}
                <section className="bg-white rounded-xl border border-black/30 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-black/30 flex items-center">
                        <Phone className="w-5 h-5 text-cyan-600 mr-2" />
                        <h2 className="text-lg font-bold text-gray-800">聯絡資訊</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                                    公司名稱
                                </label>
                                <input
                                    type="text"
                                    value={profile.company}
                                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                                    placeholder="您的公司名稱"
                                    className="w-full px-3 py-2 border border-black/30 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                    聯絡電話
                                </label>
                                <input
                                    type="tel"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    placeholder="0912-345-678"
                                    className="w-full px-3 py-2 border border-black/30 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                    地址
                                </label>
                                <input
                                    type="text"
                                    value={profile.address}
                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                    placeholder="您的地址"
                                    className="w-full px-3 py-2 border border-black/30 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Account Security */}
                <section className="bg-white rounded-xl border border-black/30 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-black/30 flex items-center">
                        <Shield className="w-5 h-5 text-cyan-600 mr-2" />
                        <h2 className="text-lg font-bold text-gray-800">帳號安全</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Key className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">變更密碼</p>
                                    <p className="text-xs text-gray-500">更新您的登入密碼</p>
                                </div>
                            </div>
                            <button
                                onClick={async () => {
                                    try {
                                        await supabase.auth.resetPasswordForEmail(profile.email, {
                                            redirectTo: `${window.location.origin}/reset-password`
                                        });
                                        toast.success('密碼重設信已發送至您的 Email');
                                    } catch (error) {
                                        toast.error('發送失敗');
                                    }
                                }}
                                className="px-4 py-2 text-sm text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                            >
                                發送重設信
                            </button>
                        </div>
                    </div>
                </section>

                {/* Subscription Info */}
                <section className="bg-white rounded-xl border border-black/30 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-black/30 flex items-center">
                        <Crown className="w-5 h-5 text-purple-600 mr-2" />
                        <h2 className="text-lg font-bold text-gray-800">訂閱資訊</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {/* Current Plan */}
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center">
                                        <Crown className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">當前方案</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {
                                                userTier === 'starter' ? 'Starter' :
                                                userTier === 'professional' ? 'Professional' :
                                                    userTier === 'pro_plus' ? 'Pro+' :
                                                        userTier === 'enterprise' ? 'Enterprise' : 'Free'
                                            }
                                        </p>
                                    </div>
                                </div>
                                {userTier === 'free' && (
                                    <button
                                        onClick={() => toast.info('升級功能即將推出')}
                                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-lg font-medium hover:brightness-110 transition-all shadow-md shadow-cyan-500/20"
                                    >
                                        升級方案
                                    </button>
                                )}
                            </div>

                            {/* Subscription Status */}
                            {subscription && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <p className="text-xs font-medium text-gray-500">訂閱狀態</p>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900">
                                                {subscription.status === 'active' ? '✅ 啟用中' :
                                                    subscription.status === 'trial' ? '🎯 試用期' :
                                                        subscription.status === 'expired' ? '⚠️ 已過期' : '未知'}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <AlertCircle className="w-4 h-4 text-gray-400" />
                                                <p className="text-xs font-medium text-gray-500">到期日</p>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900">
                                                {subscription.trial_end_date
                                                    ? new Date(subscription.trial_end_date).toLocaleDateString('zh-TW')
                                                    : '無期限'}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}

                            {!subscription && userTier === 'professional' && (
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <p className="text-sm text-blue-700">
                                        ℹ️ 您已登入並享有 Pro 功能權限
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Feature Permissions */}
                <section className="bg-white rounded-xl border border-black/30 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-black/30 flex items-center">
                        <Shield className="w-5 h-5 text-cyan-600 mr-2" />
                        <h2 className="text-lg font-bold text-gray-800">功能權限</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            {/* Available Features */}
                            <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                                <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">專案設定與分析報告</p>
                                    <p className="text-xs text-gray-500">建立專案、查看報告、AI 分析</p>
                                </div>
                            </div>

                            <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                                <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">執行企劃</p>
                                    <p className="text-xs text-gray-500">專案執行計畫與追蹤</p>
                                </div>
                            </div>

                            <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                                <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">客戶溝通</p>
                                    <p className="text-xs text-gray-500">客戶管理與溝通記錄</p>
                                </div>
                            </div>

                            {/* Locked Features (if Free tier) */}
                            {userTier === 'free' && (
                                <>
                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-black/30 opacity-60">
                                        <Lock className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-700">報價單生成</p>
                                            <p className="text-xs text-gray-500">需要 Pro 方案</p>
                                        </div>
                                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-bold">PRO</span>
                                    </div>

                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-black/30 opacity-60">
                                        <Lock className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-700">財務與執行管理</p>
                                            <p className="text-xs text-gray-500">需要 Pro 方案</p>
                                        </div>
                                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-bold">PRO</span>
                                    </div>
                                </>
                            )}

                            {userTier !== 'free' && (
                                <>
                                    <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">報價單生成</p>
                                            <p className="text-xs text-gray-500">專業報價單與估價工具</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">財務與執行管理</p>
                                            <p className="text-xs text-gray-500">完整財務追蹤與專案管理</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-3 bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-500/25 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 border border-white/20"
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                儲存中...
                            </>
                        ) : (
                            '儲存變更'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
