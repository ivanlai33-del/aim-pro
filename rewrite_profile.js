const fs = require('fs');
const path = './src/app/dashboard/profile/page.tsx';

let content = fs.readFileSync(path, 'utf-8');

// Find the start of the return statement
const returnIndex = content.indexOf('return (');
if (returnIndex === -1) {
    console.error('Could not find return statement');
    process.exit(1);
}

const beforeReturn = content.substring(0, returnIndex);

const newJSX = `return (
        <div className="container mx-auto p-6 max-w-6xl animate-in fade-in pb-24">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">個人設定</h1>
                    <p className="text-slate-500">Personal Settings</p>
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
                    <section className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">帳號資訊</h2>
                                <p className="text-sm text-slate-500">管理您的基本登入資訊</p>
                            </div>
                        </div>
                        
                        <div className="space-y-5">
                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    電子郵件 (Email)
                                </label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    disabled
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-500 cursor-not-allowed text-[15px]"
                                />
                                <p className="text-[12px] text-slate-400 mt-2 ml-1">作為帳號唯一識別，無法修改</p>
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
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-[15px] placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Contact Info */}
                    <section className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">聯絡與發票資訊</h2>
                                <p className="text-sm text-slate-500">用於自動帶入報價單與合約</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-slate-400" />
                                    公司名稱
                                </label>
                                <input
                                    type="text"
                                    value={profile.company}
                                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                                    placeholder="填寫公司名稱，若無可留白"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-[15px] placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[13px] font-bold text-slate-700 mb-2 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        聯絡電話
                                    </label>
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        placeholder="0912-345-678"
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-[15px] placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[13px] font-bold text-slate-700 mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        聯絡地址
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.address}
                                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                        placeholder="發票或聯絡地址"
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-[15px] placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 transition-all"
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
                    <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-[24px] border border-white/10 shadow-2xl p-8 relative overflow-hidden text-white">
                        {/* Decorative background flair */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/20 blur-3xl rounded-full pointer-events-none"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <Crown className="w-8 h-8 text-cyan-400" />
                                    <span className="text-xl font-bold tracking-wider">AIM PRO</span>
                                </div>
                                <span className="text-[11px] font-black tracking-widest text-slate-400 uppercase border border-slate-600 px-2 py-1 rounded-md">
                                    Subscription
                                </span>
                            </div>

                            <div className="mb-8">
                                <p className="text-slate-400 text-sm mb-1">當前訂閱方案</p>
                                <p className="text-4xl font-black bg-gradient-to-r from-cyan-300 via-white to-purple-200 bg-clip-text text-transparent">
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
                                    className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95"
                                >
                                    解鎖專業版功能
                                </button>
                            ) : (
                                <div className="space-y-3 bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-300 flex items-center gap-2"><Calendar className="w-4 h-4"/> 狀態</span>
                                        <span className="font-bold text-emerald-400">
                                            {subscription?.status === 'active' ? '✅ 啟用中' :
                                             subscription?.status === 'trial' ? '🎯 試用期' :
                                             subscription?.status === 'expired' ? '⚠️ 已過期' : 'Pro (團隊授權)'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-300 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> 到期日</span>
                                        <span className="font-medium text-white">
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
                    <section className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="w-5 h-5 text-emerald-500" />
                            <h2 className="text-lg font-bold text-slate-800">帳號安全</h2>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                            <div className="flex items-center gap-3">
                                <Key className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-sm font-bold text-slate-700">密碼設定</p>
                                    <p className="text-[12px] text-slate-500">重設您的登入密碼</p>
                                </div>
                            </div>
                            <button
                                onClick={async () => {
                                    try {
                                        await supabase.auth.resetPasswordForEmail(profile.email, {
                                            redirectTo: \`\${window.location.origin}/reset-password\`
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
                    <section className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                            <h2 className="text-lg font-bold text-slate-800">解鎖功能</h2>
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
        <div className={\`flex items-center justify-between p-3 rounded-xl border \${active ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100 opacity-60'}\`}>
            <div className="flex items-center gap-3">
                {active ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                        <Lock className="w-3 h-3 text-slate-500" />
                    </div>
                )}
                <span className={\`text-sm font-medium \${active ? 'text-slate-700' : 'text-slate-500'}\`}>{label}</span>
            </div>
            {!active && <span className="text-[10px] font-black bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">PRO</span>}
        </div>
    );
}
`;

fs.writeFileSync(path, beforeReturn + newJSX, 'utf-8');
console.log('Profile page UI rewritten successfully.');
