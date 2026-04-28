import Link from 'next/link';
import { Mail, CreditCard, ShieldCheck, Building2, MessageSquare } from 'lucide-react';

export default function LandingFooter() {
    return (
        <footer className="bg-slate-950 border-t border-white/5 pt-16 pb-8 text-slate-400 text-sm">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Column 1: Customer Service */}
                    <div>
                        <div className="flex items-center gap-3 mb-6 text-white font-bold">
                            <div className="bg-emerald-500/10 p-2 rounded-lg">
                                <Mail className="w-5 h-5 text-emerald-500" />
                            </div>
                            <h3>客服聯絡資訊</h3>
                        </div>
                        <div className="space-y-4">
                            <p>官方客服信箱：<a href="mailto:aim@ycideas.com" className="text-white hover:text-emerald-400 transition-colors font-medium">aim@ycideas.com</a></p>
                            <div className="pt-2 border-t border-white/5">
                                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">LINE 專屬通道</p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs">🤖 AI 客服：</span>
                                        <a href="https://line.me/ti/p/@967iypui" target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold hover:underline">@967iypui</a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs">👤 真人專員：</span>
                                        <span className="text-emerald-400 font-bold">ivanlai33</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-600 mt-4 italic">服務、合作、開發、洽詢</p>
                        </div>
                    </div>

                    {/* Column 2: Pricing */}
                    <div>
                        <div className="flex items-center gap-3 mb-6 text-white font-bold">
                            <div className="bg-emerald-500/10 p-2 rounded-lg">
                                <CreditCard className="w-5 h-5 text-emerald-500" />
                            </div>
                            <h3>付費方案說明</h3>
                        </div>
                        <div className="space-y-3">
                            <p className="text-xs mb-4 text-slate-500 italic">本平台採「訂閱制 (SaaS)」收費模式</p>
                            <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                                <span className="min-w-[140px]">個人啟航版 (Starter)</span>
                                <span className="text-white font-bold">$990 / 月</span>
                            </div>
                            <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                                <span className="min-w-[140px]">專業職人版 (Pro)</span>
                                <span className="text-white font-bold">$2,900 / 月</span>
                            </div>
                            <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                                <span className="min-w-[140px]">Pro+ 團隊協作版</span>
                                <span className="text-white font-bold">$8,800 / 月</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="min-w-[140px]">企業旗艦版 (Enterprise)</span>
                                <span className="text-white font-bold">$18,000 / 月</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Policy */}
                    <div>
                        <div className="flex items-center gap-3 mb-6 text-white font-bold">
                            <div className="bg-emerald-500/10 p-2 rounded-lg">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            </div>
                            <h3>退款與終止政策</h3>
                        </div>
                        <div className="space-y-4 leading-relaxed text-xs">
                            <p>數位服務開通後，除不可抗力因素外，<br />恕不提供退款。</p>
                            <p>用戶可隨時於後台取消次月續訂，<br />服務將持續至該帳單週期結束。</p>
                            <p className="text-slate-600 text-[10px] mt-4">若有異常扣款，請於 7 日內聯繫客服處理。</p>
                        </div>
                    </div>

                    {/* Column 4: Entity */}
                    <div>
                        <div className="flex items-center gap-3 mb-6 text-white font-bold">
                            <div className="bg-emerald-500/10 p-2 rounded-lg">
                                <Building2 className="w-5 h-5 text-emerald-500" />
                            </div>
                            <h3>營運單位</h3>
                        </div>
                        <div className="space-y-4">
                            <p className="text-xs text-slate-500">© {new Date().getFullYear()} 您的專屬AI職人智能總部</p>
                            <div className="pt-2">
                                <h4 className="text-white text-lg font-black tracking-tight">YC Ideas 奕暢創新工作室</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-1 h-3 bg-emerald-500"></div>
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">AI 職人智能總部 運作</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-600 mt-4">
                                地址：244 新北市林口區文化北路一段486號之2，3樓
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Banner */}
                <div className="pt-8 border-t border-white/5 text-center space-y-6">
                    <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-[10px] text-slate-500 uppercase tracking-[0.2em]">
                        <span>本網站交易資料由</span>
                        <span className="text-white font-black">藍新金流 NEWEBPAY</span>
                        <span>提供</span>
                        <span className="text-white font-black">256-BIT SSL</span>
                        <span>加密安全保護</span>
                    </div>

                    <div className="flex justify-center gap-8 text-xs">
                        <Link href="/terms" className="hover:text-emerald-400 transition-colors">服務條款</Link>
                        <Link href="/privacy" className="hover:text-emerald-400 transition-colors">隱私權政策</Link>
                        <a href="#" className="hover:text-emerald-400 transition-colors">免責聲明</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

