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

            try {
                const { data: subData, error: subError } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', authUser.id)
                    .single();

                if (!subError && subData) {
                    setSubscription(subData);
                } else if (subError && subError.code !== 'PGRST116') {
                    console.debug('Subscription table notice:', subError.message);
                }
            } catch (e) {
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
        <div className="container mx-auto p-6 max-w-6xl animate-in fade-in pb-24">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">個人設定</h1>
                    <p className="text-muted-foreground">Personal Settings</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors font-medium"
                >
                    <LogOut className="w-5 h-5" />
                    <span>登出帳號</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Form Editing */}
                <div className="lg:col-span-7 space-y-8">
                    
                    {/* Account Info */}
                    <section className="bg-surface rounded-[24px] border border-border/60 shadow-sm p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-foreground">帳號資訊</h2>
                                <p className="text-sm text-muted-foreground">管理您的基本登入資訊</p>
                            </div>
                        </div>
                        
                        <div className="space-y-5">
                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    電子郵件 (Email)
                                </label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    disabled
                                    className="w-full px-4 py-3 border border-border rounded-xl bg-muted/50 text-muted-foreground cursor-not-allowed text-[15px]"
                                />
                                <p className="text-[12px] text-muted-foreground mt-2 ml-1">作為帳號唯一識別，無法修改</p>
                            </div>

                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-2">
                                    顯示名稱
                                </label>
                                <input
                                    type="text"
                                    value={profile.full_name}
                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                    placeholder="您的真實姓名或暱稱"
                                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-[15px] placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Contact Info */}
                    <section className="bg-surface rounded-[24px] border border-border/60 shadow-sm p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-foreground">聯絡與發票資訊</h2>
                                <p className="text-sm text-muted-foreground">用於自動帶入報價單與合約</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-muted-foreground" />
                                    公司名稱
                                </label>
                                <input
                                    type="text"
                                    value={profile.company}
                                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                                    placeholder="填寫公司名稱，若無可留白"
                                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-[15px] placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[13px] font-bold text-slate-700 mb-2 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        聯絡電話
                                    </label>
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        placeholder="0912-345-678"
                                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-[15px] placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[13px] font-bold text-slate-700 mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        聯絡地址
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.address}
                                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                        placeholder="發票或聯絡地址"
                                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-[15px] placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="inline-flex items-center px-10 py-4 border border-white/20 text-[16px] font-bold rounded-2xl shadow-xl shadow-cyan-500/25 text-white bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 hover:brightness-110 disabled:opacity-50 transition-all active:scale-95"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3"></div>
                                    儲存中...
                                </>
                            ) : (
                                '儲存變更'
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Column: Status & Subscription */}
                <div className="lg:col-span-5 space-y-6">
                    
                    {/* Premium Subscription Card */}
                    <section className="bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 dark:from-cyan-900/60 dark:via-cyan-800/60 dark:to-emerald-900/60 rounded-[24px] border border-white/20 dark:border-cyan-500/30 shadow-2xl shadow-cyan-500/25 dark:shadow-none p-8 relative overflow-hidden text-white">
                        {/* Decorative background flair */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-surface/20 blur-3xl rounded-full pointer-events-none"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-300/20 blur-3xl rounded-full pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <Crown className="w-8 h-8 text-white drop-shadow-md" />
                                    <span className="text-xl font-bold tracking-wider drop-shadow-md">AIM PRO</span>
                                </div>
                                <span className="text-[11px] font-black tracking-widest text-cyan-50 uppercase border border-white/40 bg-surface/10 px-2 py-1 rounded-md backdrop-blur-sm">
                                    Subscription
                                </span>
                            </div>

                            <div className="mb-8">
                                <p className="text-cyan-50 text-sm mb-1 font-medium">當前訂閱方案</p>
                                <p className="text-4xl font-black text-white drop-shadow-lg">
                                    {
                                        userTier === 'starter' ? 'Starter' :
                                        userTier === 'professional' ? 'Professional' :
                                        userTier === 'pro_plus' ? 'Pro+' :
                                        userTier === 'enterprise' ? 'Enterprise' : 'Free Plan'
                                    }
                                </p>
                            </div>

                            {userTier === 'free' ? (
                                <button
                                    onClick={() => toast.info('升級功能即將推出')}
                                    className="w-full py-4 bg-surface text-foreground rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95"
                                >
                                    解鎖專業版功能
                                </button>
                            ) : (
                                <div className="space-y-3 bg-surface/20 p-4 rounded-xl backdrop-blur-md border border-white/30 shadow-inner">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-white flex items-center gap-2"><Calendar className="w-4 h-4"/> 狀態</span>
                                        <span className="font-bold text-white drop-shadow-md">
                                            {subscription?.status === 'active' ? '✅ 啟用中' :
                                             subscription?.status === 'trial' ? '🎯 試用期' :
                                             subscription?.status === 'expired' ? '⚠️ 已過期' : 'Pro (團隊授權)'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-white flex items-center gap-2"><AlertCircle className="w-4 h-4"/> 到期日</span>
                                        <span className="font-bold text-white drop-shadow-md">
                                            {subscription?.trial_end_date
                                                ? new Date(subscription?.trial_end_date).toLocaleDateString('zh-TW')
                                                : '無期限'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Account Security */}
                    <section className="bg-surface rounded-[24px] border border-border/60 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="w-5 h-5 text-emerald-500" />
                            <h2 className="text-lg font-bold text-foreground">帳號安全</h2>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-muted border border-border rounded-xl">
                            <div className="flex items-center gap-3">
                                <Key className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-bold text-slate-700">密碼設定</p>
                                    <p className="text-[12px] text-muted-foreground">重設您的登入密碼</p>
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
                                className="px-4 py-2 text-[13px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                            >
                                發送重設信
                            </button>
                        </div>
                    </section>

                    {/* Features Status */}
                    <section className="bg-surface rounded-[24px] border border-border/60 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                            <h2 className="text-lg font-bold text-foreground">解鎖功能</h2>
                        </div>
                        <div className="space-y-2">
                            <FeatureRow label="專案設定與 AI 分析" active={true} />
                            <FeatureRow label="專案企劃與執行追蹤" active={true} />
                            <FeatureRow label="專業報價單生成系統" active={userTier !== 'free'} />
                            <FeatureRow label="團隊協作與權限管理" active={userTier !== 'free'} />
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}

// Helper for feature list
function FeatureRow({ label, active }: { label: string, active: boolean }) {
    return (
        <div className={`flex items-center justify-between p-3 rounded-xl border ${active ? 'bg-emerald-50/50 border-emerald-100' : 'bg-muted border-border opacity-60'}`}>
            <div className="flex items-center gap-3">
                {active ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                        <Lock className="w-3 h-3 text-muted-foreground" />
                    </div>
                )}
                <span className={`text-sm font-medium ${active ? 'text-slate-700' : 'text-muted-foreground'}`}>{label}</span>
            </div>
            {!active && <span className="text-[10px] font-black bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">PRO</span>}
        </div>
    );
}
