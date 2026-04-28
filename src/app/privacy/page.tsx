'use client';

import Link from 'next/link';
import { Layout, Eye, Lock, Database, Globe } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-indigo-500/30">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg shadow-lg shadow-indigo-500/20">
                            <Layout className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg text-white tracking-tight">Aim pro 捷報</span>
                    </Link>
                    <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        返回首頁
                    </Link>
                </div>
            </nav>

            <div className="pt-32 pb-20 container mx-auto px-4 max-w-4xl">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">隱私權政策</h1>
                    <p className="text-slate-400 text-lg uppercase tracking-widest font-medium">Privacy Policy</p>
                </div>

                <div className="space-y-12 text-slate-300 leading-relaxed">
                    <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6 text-indigo-400">
                            <Eye className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-white">一、個人資料之蒐集與類別</h2>
                        </div>
                        <p className="mb-4">
                            當您使用「Aim pro 捷報」服務時，我們將蒐集必要的資訊以提供完整的服務體驗。蒐集之資料類別包含：
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-400">
                            <li><strong>帳戶資訊</strong>：您的姓名、Email、LINE 顯示名稱、頭像與 LINE UID (僅用於登入驗證)。</li>
                            <li><strong>專案內容</strong>：您在系統中輸入的專案描述、需求內容與報價金額，僅用於 AI 模型分析與生成建議。</li>
                            <li><strong>交易紀錄</strong>：您的付費方案、交易時間與訂單編號。請注意，我們不儲存您的完整信用卡卡號，所有金流資料皆由藍新金流 (NewebPay) 加密處理。</li>
                            <li><strong>服務日誌</strong>：您的 IP 位址、使用時間與操作行為紀錄，用於系統效能優化與資安防護。</li>
                        </ul>
                    </section>

                    <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6 text-purple-400">
                            <Database className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-white">二、資料使用目的與處理方式</h2>
                        </div>
                        <p className="mb-4">
                            我們所蒐集的資料將應用於以下目的：
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-400">
                            <li><strong>提供服務</strong>：根據您的輸入資料，透過大語言模型 (LLM) 生成專案估價、合約與規劃。</li>
                            <li><strong>身份驗證</strong>：維護您的帳號安全並處理訂閱授權。</li>
                            <li><strong>優化模型</strong>：在去識別化的情況下，分析對話日誌以提升 AI 回覆之精準度。</li>
                            <li><strong>客戶支援</strong>：處理您的查詢事項與交易異常回報。</li>
                        </ul>
                    </section>

                    <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6 text-emerald-400">
                            <Lock className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-white">三、資安防護與數據加密</h2>
                        </div>
                        <p className="mb-4">
                            我們高度重視您的數據安全性，並採取以下安全措施：
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-400">
                            <li><strong>傳輸加密</strong>：所有資料傳輸皆經由 256-bit SSL 加密技術保護。</li>
                            <li><strong>儲存安全</strong>：數據存儲於具備企業級防護之雲端資料中心 (如 Supabase/Google Cloud)。</li>
                            <li><strong>存取限制</strong>：僅授權之技術人員在處理客戶問題時可存取去識別化後之日誌資料。</li>
                        </ul>
                    </section>

                    <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6 text-blue-400">
                            <Globe className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-white">四、第三方服務與外部連結</h2>
                        </div>
                        <p className="mb-4">
                            本服務可能包含前往第三方網站或服務的連結 (如 LINE 官網、藍新金流支付頁面)。這些外部網站有其獨立的隱私權政策，我們不對其內容或行為負責。建議您在離開本平台時，先閱讀該第三方的隱私權說明。
                        </p>
                    </section>

                    <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs">
                        <p className="text-slate-500">
                            © 2026 YC Ideas 奕暢創新工作室. All rights reserved. 地址：244 新北市林口區文化北路一段486號之2，3樓
                        </p>
                        <div className="flex gap-6">
                            <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 transition-colors">服務條款</Link>
                            <a href="mailto:aim@ycideas.com" className="text-slate-400 hover:text-white transition-colors">聯絡我們</a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
