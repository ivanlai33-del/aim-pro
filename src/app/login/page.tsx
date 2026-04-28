'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, Layout, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [securityWarnings, setSecurityWarnings] = useState<string[]>([]);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        console.log('=== handleAuth called ===');
        console.log('Email:', email);
        console.log('isSignUp:', isSignUp);

        e.preventDefault(); // 防止表單預設提交行為
        console.log('preventDefault called');

        setLoading(true);
        console.log('Loading set to true');

        setSecurityWarnings([]);

        try {
            if (isSignUp) {
                // ===== 安全檢查開始 =====
                // 動態載入安全檢查模組（避免阻塞登入流程）
                const ipAddress = 'unknown'; // 暫時使用 unknown，實際應從後端獲取
                let securityCheck;

                try {
                    const { performRegistrationSecurityChecks, trackSuccessfulRegistration } = await import('@/lib/securityChecks');
                    securityCheck = await performRegistrationSecurityChecks(email, ipAddress);

                    // 如果有錯誤，阻止註冊
                    if (!securityCheck.allowed) {
                        toast.error(securityCheck.errors.join(', '));
                        setLoading(false);
                        return;
                    }

                    // 如果有警告，顯示給用戶（但允許繼續）
                    if (securityCheck.warnings.length > 0) {
                        setSecurityWarnings(securityCheck.warnings);
                    }
                } catch (securityError) {
                    console.error('Security check failed:', securityError);
                    // 安全檢查失敗不阻止註冊，但記錄錯誤
                }
                // ===== 安全檢查結束 =====

                // 執行 Supabase 註冊
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) throw error;

                // ===== 註冊後追蹤 =====
                if (data.user && securityCheck?.deviceId) {
                    try {
                        const { trackSuccessfulRegistration } = await import('@/lib/securityChecks');
                        await trackSuccessfulRegistration(
                            data.user.id,
                            securityCheck.deviceId,
                            ipAddress
                        );
                    } catch (trackError) {
                        console.error('Tracking failed:', trackError);
                        // 追蹤失敗不影響註冊流程
                    }
                }
                // ===== 追蹤結束 =====

                toast.success('註冊成功！請檢查您的信箱以驗證帳號。');
            } else {
                // 登入流程（完全不使用安全檢查）
                console.log('=== Starting LOGIN flow ===');
                console.log('Email:', email);
                console.log('Password length:', password.length);

                console.log('Calling supabase.auth.signInWithPassword...');
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                console.log('Supabase response:', { data, error });

                if (error) {
                    console.error('Login error:', error);
                    throw error;
                }

                console.log('Login successful! User:', data.user?.email);
                console.log('Session from login:', !!data.session);
                toast.success('登入成功！');

                // Use the session from login response directly
                if (data.session) {
                    console.log('Session confirmed from login response, redirecting...');
                    // Wait a bit for cookies to be set
                    await new Promise(resolve => setTimeout(resolve, 500));
                    window.location.href = '/dashboard';
                } else {
                    console.error('No session in login response!');
                    toast.error('登入成功但無法建立 session');
                }
            }
        } catch (error: any) {
            console.error('Auth error:', error);
            toast.error(error.message || '發生錯誤');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB] p-6 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-50 -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50 -ml-48 -mb-48" />

            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-black/5 overflow-hidden relative z-10">
                <div className="p-10 pt-12">
                    <div className="text-center mb-10">
                        <div className="mx-auto w-24 h-24 flex items-center justify-center mb-6">
                            <img src="/Logo.png" alt="Aim.pro" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex justify-center mb-2">
                            <img src="/Logo_w.png" alt="Aim.pro Logo" className="h-10 object-contain invert grayscale" />
                        </div>
                        <p className="text-slate-500 text-base font-medium">企業級 AI 職人智能總部</p>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 mb-8 text-center flex items-center justify-center gap-2">
                        <span className="h-[2px] w-6 bg-slate-200 rounded-full"></span>
                        {isSignUp ? '註冊新帳號' : '登入系統'}
                        <span className="h-[2px] w-6 bg-slate-200 rounded-full"></span>
                    </h2>

                    {/* 安全警告顯示 */}
                    {securityWarnings.length > 0 && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-yellow-800 mb-1">安全提醒</p>
                                    <ul className="text-xs text-yellow-700 space-y-1">
                                        {securityWarnings.map((warning, idx) => (
                                            <li key={idx}>• {warning}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 text-slate-900 font-medium outline-none transition-all placeholder:text-slate-300 shadow-sm"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">密碼</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 text-slate-900 font-medium outline-none transition-all placeholder:text-slate-300 shadow-sm"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 hover:brightness-110 text-white font-black py-4 rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center shadow-lg shadow-cyan-500/25 active:scale-[0.98] border border-white/20"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <span className="text-lg">{isSignUp ? '立即註冊' : '登入系統'}</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <span className="text-slate-400 font-medium">
                            {isSignUp ? '已有帳號？' : '還沒有帳號？'}
                        </span>
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setSecurityWarnings([]);
                            }}
                            className="ml-2 text-cyan-600 hover:text-cyan-800 font-bold underline-offset-4 hover:underline"
                        >
                            {isSignUp ? '直接登入' : '立即註冊'}
                        </button>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-100">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center gap-2 text-[0.7rem] text-slate-300 font-bold uppercase tracking-widest">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                <span>Secured by Supabase Auth</span>
                            </div>

                            <button
                                onClick={async () => {
                                    await supabase.auth.signOut();
                                    window.location.reload();
                                }}
                                className="text-xs text-slate-300 hover:text-slate-500 transition-colors"
                            >
                                遇到問題？強制登出
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
