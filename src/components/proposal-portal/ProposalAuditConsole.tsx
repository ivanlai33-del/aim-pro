'use client';

import React, { useState } from 'react';

interface AuditLogSession {
  sessionId: string;
  clientIp: string;
  userAgent: string;
  createdAt: string;
  isTeamIp?: boolean;
  actions?: { action: string; timestamp: string }[];
  remittanceBank5?: string;
  remittanceName?: string;
  companyName?: string;
}

interface ProposalAuditConsoleProps {
  projectId: string;
  projectSlug: string;
  title: string;
  lifecycle: {
    stage: 'NORMAL' | 'EXPIRED' | 'ARCHIVED_404' | 'MANUALLY_CLOSED';
    countdownStarted: boolean;
    daysDiff: number;
    firstExternalViewedAt?: string | null;
  };
  sessions?: AuditLogSession[];
  isManuallyClosed?: boolean;
  versions?: { versionId: string; note: string; createdAt: string }[];
  activeVersionId?: string;
  onToggleStatus?: (isClosed: boolean) => void;
  onSelectVersion?: (versionId: string) => void;
}

export default function ProposalAuditConsole({
  projectId,
  projectSlug,
  title,
  lifecycle,
  sessions = [],
  isManuallyClosed = false,
  versions = [
    { versionId: 'v1', note: 'AI 分析報告初始版本', createdAt: new Date().toISOString() }
  ],
  activeVersionId = 'v1',
  onToggleStatus,
  onSelectVersion,
}: ProposalAuditConsoleProps) {
  const [closedState, setClosedState] = useState(isManuallyClosed);

  const handleToggle = () => {
    const nextState = !closedState;
    setClosedState(nextState);
    if (onToggleStatus) onToggleStatus(nextState);
  };

  // Determine Status Light Badge
  const renderStatusBadge = () => {
    if (closedState || lifecycle.stage === 'MANUALLY_CLOSED') {
      return (
        <span className="text-xs bg-rose-900/90 text-rose-200 px-2.5 py-1 rounded-full font-bold border border-rose-600 animate-pulse">
          🔒 手動隱蔽關閉
        </span>
      );
    }
    if (!lifecycle.countdownStarted) {
      return (
        <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-bold border border-slate-600">
          🟢 尚未開啟 (計時未始)
        </span>
      );
    }
    if (lifecycle.stage === 'NORMAL') {
      return (
        <span className="text-xs bg-blue-900/80 text-blue-300 px-2.5 py-1 rounded-full font-bold border border-blue-700 animate-pulse">
          🔵 Day {lifecycle.daysDiff} 倒數中 (已啟動)
        </span>
      );
    }
    if (lifecycle.stage === 'EXPIRED') {
      return (
        <span className="text-xs bg-amber-900/80 text-amber-300 px-2.5 py-1 rounded-full font-bold border border-amber-700 animate-pulse">
          🟡 Day {lifecycle.daysDiff} 密碼過期
        </span>
      );
    }
    return (
      <span className="text-xs bg-rose-900/80 text-rose-300 px-2.5 py-1 rounded-full font-bold border border-rose-700">
        🔴 Day {lifecycle.daysDiff} 404歸檔
      </span>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 text-slate-100 font-sans">
      {/* Top Header Card */}
      <div className="flex flex-wrap justify-between items-center pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-white">{title}</h2>
            {renderStatusBadge()}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            專案代碼：{projectSlug} ｜ 首次開啟：
            {lifecycle.firstExternalViewedAt
              ? new Date(lifecycle.firstExternalViewedAt).toLocaleString('zh-TW')
              : '尚無陌生 IP 開啟 (計時未觸發)'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggle}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow cursor-pointer ${
              closedState
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-rose-700 hover:bg-rose-600 text-white'
            }`}
          >
            {closedState ? '🔓 重新開啟報價' : '🔒 手動隱蔽關閉報價單'}
          </button>

          <a
            href={`/p/${projectId}?admin=87257257`}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 rounded-xl text-xs font-bold shadow hover:brightness-110 transition"
          >
            👑 上帝視角預閱 ➔
          </a>
        </div>
      </div>

      {/* Version Control Cards */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <h3 className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
            <span>📜</span>
            <span>報價單編修版本歷史紀錄 ({versions.length} 個版本)</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">
            對外發布中：<b className="text-emerald-400">{activeVersionId}</b>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {versions.map((v) => {
            const isActive = v.versionId === activeVersionId;
            return (
              <div
                key={v.versionId}
                className={`p-3 rounded-xl border transition flex flex-col justify-between ${
                  isActive
                    ? 'bg-emerald-950/30 border-emerald-500/50 shadow'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono font-bold text-xs text-white">{v.versionId}</span>
                    {isActive ? (
                      <span className="text-[10px] bg-emerald-900/90 text-emerald-200 px-2 py-0.5 rounded font-bold border border-emerald-600">
                        🟢 對外生效中
                      </span>
                    ) : (
                      <button
                        onClick={() => onSelectVersion && onSelectVersion(v.versionId)}
                        className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-bold border border-slate-600 transition cursor-pointer"
                      >
                        ⭐️ 設為發布版
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium line-clamp-2">{v.note}</p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>{new Date(v.createdAt).toLocaleDateString('zh-TW')}</span>
                  <a
                    href={`/p/${projectId}?admin=87257257&v=${v.versionId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 underline hover:text-emerald-300 font-bold"
                  >
                    👁️ 檢視此版 ➔
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-cyan-400 flex items-center space-x-1">
          <span>🕵️‍♂️</span>
          <span>多成員傳閱、IP 風險與點擊軌跡 ({sessions.length} 筆觀看紀錄)</span>
        </h3>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 font-mono">
              <tr>
                <th className="p-3">開啟時間</th>
                <th className="p-3">訪客 IP / 裝置</th>
                <th className="p-3">對帳戶名綁定</th>
                <th className="p-3 text-right">狀態</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-500">
                    尚無傳閱觀看紀錄。客戶開啓網址時將自動記錄 IP 與軌跡。
                  </td>
                </tr>
              ) : (
                sessions.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="p-3 text-slate-400">
                      {new Date(s.createdAt).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}
                    </td>
                    <td className="p-3">
                      {s.isTeamIp ? (
                        <span className="text-emerald-400 font-bold">🏠 團隊本機/管理者 IP ({s.clientIp})</span>
                      ) : s.clientIp.includes('China') || s.clientIp.includes('海外') ? (
                        <span className="text-rose-400 font-bold animate-pulse">🚨 海外/VPN 高風險 IP ({s.clientIp})</span>
                      ) : (
                        <span className="text-blue-300">🇹🇼 台灣在地連線 ({s.clientIp})</span>
                      )}
                    </td>
                    <td className="p-3 text-amber-300 font-bold">
                      {s.remittanceBank5 ? `${s.remittanceName} (後5碼 ${s.remittanceBank5})` : '未填寫'}
                    </td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        已觀看
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
