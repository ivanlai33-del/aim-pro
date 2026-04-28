'use client';

import Link from 'next/link';
import { Layout, ShieldCheck, CreditCard, Scale, Info } from 'lucide-react';

export default function TermsPage() {
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
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">服務條款</h1>
                    <p className="text-slate-400 text-lg uppercase tracking-widest font-medium">Terms of Service</p>
                </div>

                <div className="space-y-12 text-slate-300 leading-relaxed">
                    <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6 text-indigo-400">
                            <ShieldCheck className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-white">一、服務受理與同意</h2>
                        </div>
                        <p>
                            歡迎您使用由 YC Ideas 奕暢創新工作室 (以下簡稱「本公司」) 營運之「Aim pro 捷報」AI 職人智能總部服務。當您開始使用本服務、註冊帳號或進行付費訂閱時，即表示您已詳細閱讀並同意接受本服務條款之所有內容。如果您不同意本條款，請立即停止使用本服務。
                        </p>
                    </section>

                    <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6 text-purple-400">
                            <Info className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-white">二、服務範圍與 AI 特性</h2>
                        </div>
                        <p className="mb-4">
                            本服務係基於先進之大語言模型 (LLM) 技術提供之 AI 輔助決策系統，包含但不限於專案估價、合約生成與時程規劃。
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-400">
                            <li>用戶瞭解 AI 生成結果係基於機率模型，其準確性與參考性受限於輸入資料之品質。</li>
                            <li>AI 生成之建議內容 (如報價、合約) 僅供參考，不具法律效力，用戶應自行進行最終審核。</li>
                            <li>本服務不保證生成內容在特定市場或法律環境下的絕對適用性。</li>
                        </ul>
                    </section>

                    <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6 text-emerald-400">
                            <CreditCard className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-white">三、訂閱制規範與方案價格</h2>
                        </div>
                        <p className="mb-6">
                            本服務採預付訂閱制 (SaaS)，用戶可根據需求選擇不同的方案級別。目前的方案價格如下：
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                <h3 className="font-bold text-white mb-2">專業職人版 (Pro)</h3>
                                <p className="text-2xl font-black text-indigo-400">NT$ 2,900</p>
                                <p className="text-xs text-slate-500">/ 月 (未稅)</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                <h3 className="font-bold text-white mb-2">Pro+ 團隊版</h3>
                                <p className="text-2xl font-black text-purple-400">NT$ 8,800</p>
                                <p className="text-xs text-slate-500">/ 月 (未稅)</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                <h3 className="font-bold text-white mb-2">旗艦企業版</h3>
                                <p className="text-2xl font-black text-emerald-400">NT$ 18,000</p>
                                <p className="text-xs text-slate-500">/ 月 (未稅)</p>
                            </div>
                        </div>
                        <ul className="list-disc list-inside space-y-2 text-slate-400">
                            <li>用戶可隨時於管理後台取消次月續訂，服務將持續至該帳單週期屆滿。</li>
                            <li>年約方案享專屬折扣，付款後恕不接受中途退費或轉換為月費。</li>
                            <li>本平台交易資料由藍新金流 (NewebPay) 提供 256-bit SSL 加密安全保護。</li>
                        </ul>
                    </section>

                    <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6 text-red-400">
                            <Scale className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-white">四、退款政策與終止政策</h2>
                        </div>
                        <p className="mb-4">
                            依據《消費者保護法》與《通訊交易解除權合理例外情事適用準則》，本服務提供之數位內容一經點選開通或完成付款即完成履行，恕不適用七天鑑賞期退貨規則。
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-400">
                            <li>除不可抗力之系統因素外，本服務不提供任何退款。</li>
                            <li>若有重複扣款或金額異常，請於交易發生後 7 日內聯繫客服處理。</li>
                            <li>若用戶違反使用規範 (如非法轉售、惡意攻擊)，本公司有權暫停或終止服務。</li>
                        </ul>
                    </section>

                    <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs">
                        <p className="text-slate-500">
                            © 2026 YC Ideas 奕暢創新工作室. All rights reserved. 地址：244 新北市林口區文化北路一段486號之2，3樓
                        </p>
                        <div className="flex gap-6">
                            <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 transition-colors">隱私權政策</Link>
                            <a href="mailto:aim@ycideas.com" className="text-slate-400 hover:text-white transition-colors">聯絡我們</a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
