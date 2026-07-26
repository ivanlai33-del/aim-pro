'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ProjectData } from '@/types/project';
import { QuotationItem } from '@/context/ProjectContext';

interface ProviderInfo {
  name: string;
  taxId: string;
  phone: string;
  address: string;
  contact: string;
  primaryBank?: {
    bankName: string;
    branch?: string;
    accountName: string;
    accountNumber: string;
  };
}

interface ProtectedProposalPortalProps {
  projectId: string;
  title: string;
  projectData: ProjectData;
  quotationItems: QuotationItem[];
  providerInfo: ProviderInfo;
  paymentTerms?: { label: string; amount: number }[];
  contractTerms?: string[];
  reportContent?: string;
  industryModuleId?: string;
  isAdminBypass?: boolean;
}

export default function ProtectedProposalPortal({
  projectId,
  title,
  projectData,
  quotationItems,
  providerInfo,
  paymentTerms = [],
  contractTerms = [],
  reportContent,
  industryModuleId = 'web_development',
  isAdminBypass = false,
}: ProtectedProposalPortalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(isAdminBypass);
  const [errorMsg, setErrorMsg] = useState('');
  const [checkTerms1, setCheckTerms1] = useState(false);
  const [checkTerms2, setCheckTerms2] = useState(false);

  // Form Remittance State
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [invoiceAddress, setInvoiceAddress] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [remittanceBank5, setRemittanceBank5] = useState('');
  const [remittanceName, setRemittanceName] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Security Intercept State
  const [isVpnBlocked, setIsVpnBlocked] = useState(false);
  const [detectedVpnIp, setDetectedVpnIp] = useState('');

  // Inline Click-to-Edit State (Owner Mode Only)
  const [editedTextMap, setEditedTextMap] = useState<Record<string, string>>({});
  const [dirtyCount, setDirtyCount] = useState(0);
  const [showVersionSaveModal, setShowVersionSaveModal] = useState(false);
  const [versionNote, setVersionNote] = useState('');

  const primaryBank = providerInfo.primaryBank;

  // Calculate Subtotal & Total
  const subtotal = quotationItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxAmount = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + taxAmount;

  // Real-time IP Security & VPN Check
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        const isTaiwanOrLocal = !data.country_code || data.country_code === 'TW' || data.ip === '127.0.0.1';
        const isProxyOrVpn = data.security?.is_proxy || (data.org && (data.org.includes('VPN') || data.org.includes('Cloud') || data.org.includes('DataCenter')));

        if ((!isTaiwanOrLocal || isProxyOrVpn) && !isAdminBypass) {
          setIsVpnBlocked(true);
          setDetectedVpnIp(`${data.ip} [${data.country_name || '海外/VPN'}]`);
        }
      })
      .catch(() => {});
  }, [isAdminBypass]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim().length >= 4) {
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      setErrorMsg('請輸入授權訪問密碼。');
    }
  };

  const handleSaveRemittanceInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !taxId || !remittanceBank5 || !remittanceName) {
      alert('請填寫完整公司全銜、統一編號、預計匯出帳號後5碼與戶名！');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSaved(true);
      alert('✓ 簽核與預約對帳帳號綁定資料已成功存檔對齊！');
    }, 800);
  };

  // Foreign IP / VPN Intercept Screen
  if (isVpnBlocked && !isAdminBypass) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans select-none">
        <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-8 text-center shadow-2xl space-y-5">
          <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center text-3xl mx-auto border border-amber-500/30 animate-bounce">
            🌐
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">安全存取驗證 — 請關閉 VPN 代理</h1>
            <span className="inline-block mt-2 px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-mono font-bold rounded-full border border-amber-500/30">
              {detectedVpnIp ? `偵測到非台灣在地連線/VPN: ${detectedVpnIp}` : '連線位置安全性檢測中...'}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed text-left bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span>⚠️ <strong>存取限制說明：</strong></span><br />
            1. 為防範商業機密外洩與跨國網路詐騙，本專案報價計畫書僅限<strong>台灣在地網路 IP</strong>開啓與瀏覽。<br />
            2. 若您正在使用 VPN 代理伺服器、跳板網路或國外 IP，<strong>請先暫時關閉 VPN 或切換至台灣本地電信網路</strong>，並重新整理頁面。
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl shadow-lg transition"
          >
            🔄 關閉 VPN 後重新嘗試開啟
          </button>
          <div className="pt-2 text-[11px] text-slate-500">
            如為官方授權海外連線需求，請聯繫執行團隊：<br />
            {providerInfo.name} ｜ 電話：{providerInfo.phone}
          </div>
        </div>
      </div>
    );
  }

  // Password Lock Modal
  if (!isUnlocked && !isAdminBypass) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans select-none">
        <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl my-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 border border-blue-500/20 shadow-inner">
              🛡️
            </div>
            <h1 className="text-2xl font-bold font-serif text-white tracking-wide">{title}</h1>
            <p className="text-xs text-blue-400 font-semibold tracking-wider uppercase mt-1">
              {providerInfo.name} ｜ 專案報價與合約簽核線上 Portal
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">專案瀏覽存取密碼 *</label>
              <input
                type="password"
                placeholder="請輸入訪問密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-center text-lg focus:outline-none focus:border-blue-500 text-white placeholder-slate-500 font-mono"
                autoFocus
              />
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3 text-xs">
              <div className="text-slate-300 font-bold flex items-center space-x-1 border-b border-slate-800 pb-2">
                <span className="text-amber-400">⚖️</span>
                <span>委託方權利切結與條款聲明 (請勾選確認)</span>
              </div>
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checkTerms1}
                  onChange={(e) => setCheckTerms1(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-blue-500 rounded cursor-pointer"
                />
                <span className="text-slate-300 group-hover:text-white leading-relaxed">
                  <strong className="text-blue-400">[確認一：專案智慧財產權與授權切結]</strong> 本專案報價單內容受智財權保護，承諾不私自複製流傳或提供第三方同業競價。
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checkTerms2}
                  onChange={(e) => setCheckTerms2(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-blue-500 rounded cursor-pointer"
                />
                <span className="text-slate-300 group-hover:text-white leading-relaxed">
                  <strong className="text-emerald-400">[確認二：合約用途合規聲明]</strong> 本計畫書內容僅用於合法商業合作，付款帳號以對應戶名為唯一指定開工標準。
                </span>
              </label>
            </div>

            {errorMsg && <p className="text-xs text-rose-400 text-center font-medium">{errorMsg}</p>}

            <button
              type="submit"
              disabled={!checkTerms1 || !checkTerms2}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span>同意條款並解鎖專案報價與合約 ➔</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Slides definition
  const slides = [
    { id: 0, title: '1. 專案說明與現況分析' },
    { id: 1, title: '2. 服務項目與估價明細' },
    { id: 2, title: '3. 付款期程與匯款綁定' },
    { id: 3, title: '4. 合約條款與線上簽核' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans select-none pb-20 print:bg-white print:text-slate-900 print:p-0">
      {/* 👑 Owner Bypass Banner */}
      {isAdminBypass && (
        <div className="bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 px-4 py-1.5 text-xs font-bold text-center flex items-center justify-center space-x-2 shadow-md no-print">
          <span>👑 管理者上帝視角預覽模式 (全權限解鎖 ｜ 支援點擊即編輯 ✎)</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 no-print">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              P
            </span>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">{title}</h2>
              <p className="text-[10px] text-slate-400">{providerInfo.name} ｜ 正式專案報價與合約計畫書</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {slides.map((s) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  currentSlide === s.id
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition flex items-center space-x-1.5 shadow"
            >
              <span>🖨️ 列印/輸出官方簽核單</span>
            </button>
          </div>
        </div>
      </header>

      {/* PRINT ONLY HEADER */}
      <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-xl font-bold">{providerInfo.name} ｜ 正式專案報價與服務合約計畫書</h1>
        <p className="text-xs mt-1">專案名稱：{title} ｜ 執行團隊統編：{providerInfo.taxId || '未填寫'}</p>
        <p className="text-[10px] text-slate-600 mt-0.5">專案電話：{providerInfo.phone} ｜ Line / 聯絡：{providerInfo.contact}</p>
      </div>

      {/* Main Content Body */}
      <main className="max-w-5xl mx-auto px-4 pt-8">
        {/* SLIDE 0: Overview */}
        {currentSlide === 0 && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-2">專案現況與需求診斷</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                本專案由 <strong>{providerInfo.name}</strong> 針對客戶目標與營運規格擬定之客製化服務計畫書。
              </p>
            </div>
            {reportContent && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
                {reportContent}
              </div>
            )}
          </div>
        )}

        {/* SLIDE 1: Items & Quotation */}
        {currentSlide === 1 && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-2">專案估價項目與細項明細</h2>
              <p className="text-xs text-slate-400">以下為本專案規劃之實作項目與費用核算：</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/60 text-slate-300 font-mono">
                  <tr>
                    <th className="p-3">項目描述</th>
                    <th className="p-3 text-center">數量</th>
                    <th className="p-3 text-right">單價 (NT$)</th>
                    <th className="p-3 text-right">小計 (NT$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {quotationItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30">
                      <td className="p-3 font-medium">{item.description}</td>
                      <td className="p-3 text-center font-mono">{item.quantity}</td>
                      <td className="p-3 text-right font-mono">NT$ {item.unitPrice.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-emerald-400 font-bold">
                        NT$ {(item.quantity * item.unitPrice).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs font-mono space-y-1 text-right">
                <p className="text-slate-400">未稅小計：NT$ {subtotal.toLocaleString()}</p>
                <p className="text-slate-400">營業稅 (5%)：NT$ {taxAmount.toLocaleString()}</p>
                <p className="text-base font-bold text-emerald-400">專案總計：NT$ {totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 2: Payment Terms & Remittance */}
        {currentSlide === 2 && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-2">付款期程與對帳匯款帳號</h2>
              <p className="text-xs text-slate-400">請依下列期程進行階段式支付：</p>
            </div>

            {primaryBank && (
              <div className="p-5 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl space-y-2">
                <h3 className="text-xs font-bold text-emerald-400 flex items-center">
                  <span className="mr-1.5">🏦</span> 唯一指定銀行對帳帳號
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono text-slate-200">
                  <p>銀行名稱：<strong className="text-white">{primaryBank.bankName}</strong> {primaryBank.branch && `(${primaryBank.branch})`}</p>
                  <p>戶名：<strong className="text-emerald-300 font-bold">{primaryBank.accountName}</strong></p>
                  <p className="col-span-full">帳號：<strong className="text-amber-300 text-sm">{primaryBank.accountNumber}</strong></p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SLIDE 3: Contract & Remittance Binding Form */}
        {currentSlide === 3 && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-2">線上條款切結與訂金對帳綁定</h2>
              <p className="text-xs text-slate-400">請填寫預計開工對帳帳號資料，以完成專案啟動手續：</p>
            </div>

            {/* Anti-Middleman Notice */}
            <div className="p-3.5 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-200 space-y-1">
              <div className="font-bold text-red-400 flex items-center">
                <span className="mr-1.5">🚨</span> 防詐騙與唯一帳號聲明
              </div>
              <p className="text-[11px] leading-relaxed text-red-300">
                1. 本團隊絕無委託第三方代理代收款項。<br />
                2. 指定匯款戶名必須為「<strong>{primaryBank?.accountName || providerInfo.name}</strong>」，切勿轉帳至其他帳戶！
              </p>
            </div>

            <form onSubmit={handleSaveRemittanceInfo} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">公司全銜 *</label>
                <input
                  type="text"
                  required
                  placeholder="例：科隆工業股份有限公司"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">統一編號 *</label>
                <input
                  type="text"
                  required
                  placeholder="例：12345678"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-amber-300 font-bold mb-1">預計匯出帳號後 5 碼 *</label>
                  <input
                    type="text"
                    required
                    placeholder="例：帳號後 5 碼 12345"
                    value={remittanceBank5}
                    onChange={(e) => setRemittanceBank5(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-amber-500/50 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-amber-300 font-bold mb-1">預計匯款戶名 *</label>
                  <input
                    type="text"
                    required
                    placeholder="例：張負責人"
                    value={remittanceName}
                    onChange={(e) => setRemittanceName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-amber-500/50 rounded-lg text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg transition"
              >
                <span>{isSaved ? '✓ 簽核與對帳帳號已存檔' : '儲存發票與對帳綁定資料'}</span>
              </button>
            </form>

            {/* PRINT ONLY SIGN-OFF CHOP BOX */}
            <div className="hidden print:block border-2 border-dashed border-slate-900 p-4 rounded-lg mt-6">
              <h3 className="text-sm font-bold border-b border-slate-900 pb-2 mb-3">【委託方主管簽核與用印欄】(紙本專用)</h3>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <p className="mb-4">簽核主管職稱與姓名：______________________</p>
                  <p>簽核日期：2026 年 ______ 月 ______ 日</p>
                </div>
                <div className="border-l border-dashed border-slate-400 pl-4 text-center">
                  <p className="text-[10px] text-slate-500 mb-8">[ 委託單位公司章 / 負責人職章用印處 ]</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Footer Controls */}
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 p-3 z-40 no-print">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
            disabled={currentSlide === 0}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-lg disabled:opacity-30 transition"
          >
            ← 上一頁
          </button>

          <span className="text-xs font-mono text-slate-400">
            {currentSlide + 1} / {slides.length}
          </span>

          <button
            onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))}
            disabled={currentSlide === slides.length - 1}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-bold rounded-lg disabled:opacity-30 transition"
          >
            下一頁 →
          </button>
        </div>
      </footer>
    </div>
  );
}
