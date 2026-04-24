'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { 
    Users, 
    CheckCircle2, 
    AlertCircle, 
    Loader2, 
    ArrowRight, 
    ShieldCheck,
    Briefcase,
    Calculator,
    User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

function InvitationContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState(false);
    const [invitation, setInvitation] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkStatus = async () => {
            if (!token) {
                setError('找不到邀請碼 (Missing token)');
                setLoading(false);
                return;
            }

            // 1. Get current user
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);

            // 2. Fetch invitation details (using our RLS policy that allows public view by token)
            const { data, error: inviteError } = await supabase
                .from('team_invitations')
                .select('*, teams(name)')
                .eq('token', token)
                .eq('status', 'pending')
                .gt('expires_at', new Date().toISOString())
                .single();

            if (inviteError || !data) {
                setError('邀請連結已失效或不存在 (Invalid or expired invitation)');
            } else {
                setInvitation(data);
            }
            setLoading(false);
        };

        checkStatus();
    }, [token]);

    const handleAccept = async () => {
        if (!token || !user) {
            router.push(`/login?redirect=/invite?token=${token}`);
            return;
        }

        setAccepting(true);
        try {
            const response = await fetch('/api/invite/accept', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error);

            toast.success('🎉 成功加入團隊！');
            router.push('/dashboard');
        } catch (err: any) {
            toast.error(err.message);
            setAccepting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
                <div className="max-w-md w-full bg-slate-900 border border-white/10 p-8 rounded-3xl text-center">
                    <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-black text-white mb-2">邀請無效</h1>
                    <p className="text-slate-400 font-bold mb-8">{error}</p>
                    <button 
                        onClick={() => router.push('/')}
                        className="w-full py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all"
                    >
                        回到首頁
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-lg w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] text-center relative z-10 shadow-2xl">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Users className="w-10 h-10 text-white" />
                </div>

                <h1 className="text-3xl font-black text-white mb-2">加入團隊邀請</h1>
                <p className="text-slate-400 font-bold mb-10 leading-relaxed">
                    您受邀加入 <span className="text-indigo-400 font-black">「{invitation?.teams?.name}」</span> 的專案管理團隊
                </p>

                <div className="bg-white/5 rounded-3xl p-6 border border-white/10 mb-10 text-left space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">您的職位 (Target Role)</p>
                            <p className="text-white font-black flex items-center gap-2">
                                {invitation?.role === 'sales' && <Briefcase className="w-4 h-4 text-emerald-400" />}
                                {invitation?.role === 'accountant' && <Calculator className="w-4 h-4 text-orange-400" />}
                                {invitation?.role === 'admin' && <ShieldCheck className="w-4 h-4 text-indigo-400" />}
                                {invitation?.role === 'member' && <User className="w-4 h-4 text-slate-400" />}
                                {invitation?.role.toUpperCase()}
                            </p>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">邀請對象 (Email)</p>
                        <p className="text-slate-300 font-bold">{invitation?.email}</p>
                    </div>
                </div>

                {!user ? (
                    <div className="space-y-4">
                        <p className="text-sm font-bold text-amber-400 bg-amber-400/10 py-3 rounded-xl border border-amber-400/20">
                            請先登入或註冊以接受邀請
                        </p>
                        <button 
                            onClick={() => router.push(`/login?redirect=/invite?token=${token}`)}
                            className="w-full py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 active:scale-[0.98] transition-all flex items-center justify-center shadow-xl shadow-white/10"
                        >
                            前往登入 / 註冊
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={handleAccept}
                        disabled={accepting}
                        className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center shadow-xl shadow-indigo-600/20 disabled:opacity-50"
                    >
                        {accepting ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                正在加入...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-5 h-5 mr-2" />
                                接受邀請並加入團隊
                            </>
                        )}
                    </button>
                )}

                <p className="mt-8 text-xs font-bold text-slate-500">
                    有效期至：{new Date(invitation?.expires_at).toLocaleDateString('zh-TW')}
                </p>
            </div>
        </div>
    );
}

export default function InvitationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            </div>
        }>
            <InvitationContent />
        </Suspense>
    );
}
