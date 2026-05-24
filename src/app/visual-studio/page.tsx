"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Eye, Code2, History, Download, Copy, Check, 
  ChevronRight, Building2, Layout, Presentation, BarChart3, 
  Settings2, RefreshCw, Layers, FileCode2, Info, Briefcase,
  ExternalLink, ArrowLeft, Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { 
  DesignSkill, DesignPhilosophy, ArtifactRecord, 
  getStoredArtifacts, storeArtifact, generateArtifactId,
  PHILOSOPHY_LABELS, PHILOSOPHY_DESCRIPTIONS,
  SKILL_LABELS, SKILL_DESCRIPTIONS, getRecommendedSkills,
  deleteArtifact
} from '@/lib/designEngine';
import { ProjectData } from '@/types/project';
import { useProject, Project } from '@/context/ProjectContext';
import { toast } from 'sonner';

export default function VisualStudioPage() {
  const { projects } = useProject();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<DesignSkill>('presentation');
  const [selectedPhilosophy, setSelectedPhilosophy] = useState<DesignPhilosophy>('apple');
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'source' | 'history'>('preview');
  const [currentArtifact, setCurrentArtifact] = useState<ArtifactRecord | null>(null);
  const [artifactHistory, setArtifactHistory] = useState<ArtifactRecord[]>([]);
  const [copied, setCopied] = useState(false);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // 讀取歷史記錄
  useEffect(() => {
    const history = getStoredArtifacts(selectedProjectId);
    setArtifactHistory(history);
    if (history.length > 0) {
      setCurrentArtifact(history[0]);
    } else {
      setCurrentArtifact(null);
    }
  }, [selectedProjectId]);

  const handleGenerate = async () => {
    if (!selectedProjectId) {
      toast.error('請先選擇一個專案');
      return;
    }

    setIsGenerating(true);
    setViewMode('preview');

    try {
      const reportContent = selectedProject?.reportContent || '';
      
      const response = await fetch('/api/design-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brief: {
            projectName: selectedProject?.data.projectName,
            skill: selectedSkill,
            philosophy: selectedPhilosophy,
            reportSummary: reportContent
          }
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const newArtifact: ArtifactRecord = {
        id: generateArtifactId(),
        projectId: selectedProjectId,
        moduleId: selectedProject?.data.moduleId || '',
        skill: selectedSkill,
        title: `${selectedProject?.data.projectName || selectedProject?.name} — ${SKILL_LABELS[selectedSkill]}`,
        html: data.html,
        generatedAt: new Date().toISOString(),
        version: artifactHistory.length + 1
      };

      storeArtifact(newArtifact);
      setArtifactHistory([newArtifact, ...artifactHistory]);
      setCurrentArtifact(newArtifact);
      toast.success('交付物生成成功');
    } catch (error: any) {
      console.error(error);
      toast.error('生成失敗: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopySource = () => {
    if (!currentArtifact) return;
    navigator.clipboard.writeText(currentArtifact.html);
    setCopied(true);
    toast.success('原始碼已複製');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportHtml = () => {
    if (!currentArtifact) return;
    const blob = new Blob([currentArtifact.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentArtifact.title.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('HTML 檔案已導出');
  };

  const handleDeleteArtifact = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // 阻止觸發卡片點擊事件
    
    if (confirm('確定要刪除這筆歷史記錄嗎？')) {
      deleteArtifact(id);
      const updatedHistory = artifactHistory.filter(art => art.id !== id);
      setArtifactHistory(updatedHistory);
      
      if (currentArtifact?.id === id) {
        setCurrentArtifact(updatedHistory[0] || null);
      }
      
      toast.success('記錄已刪除');
    }
  };


  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* ── 側邊欄：設計中心 ── */}
      <aside className="w-[380px] h-full flex flex-col border-r border-white/5 bg-slate-900/30 backdrop-blur-3xl relative z-20">
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-white/5 gap-3">
          <Link 
            href="/dashboard"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/10"
            title="回到儀表板"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-base font-black tracking-tight text-white leading-none">提案視覺化</h1>
              <p className="text-[9px] uppercase tracking-widest text-emerald-500/70 mt-1 font-bold">Open Design</p>
            </div>
          </div>
        </div>

        {/* 捲動內容區 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          
          {/* 1. 專案選擇 */}
          <section>
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">選擇來源專案</h2>
            </div>
            <select 
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer hover:bg-slate-800 text-white font-medium"
            >
              <option value="">— 請選擇一個專案 —</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.data.projectName || p.name}</option>
              ))}
            </select>
            {selectedProject && (
              <div className="mt-3 px-2 flex items-center gap-2 text-[11px] text-emerald-500/80 font-bold">
                <Check className="w-3.5 h-3.5" /> 已載入專案數據分析
              </div>
            )}
          </section>

          {/* 2. 視覺技能 */}
          <section>
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">選擇交付物形式</h2>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {(Object.keys(SKILL_LABELS) as DesignSkill[]).map(skill => {
                const isSelected = selectedSkill === skill;
                return (
                  <button
                    key={skill}
                    onClick={() => setSelectedSkill(skill)}
                    className={cn(
                      "group relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 text-left",
                      isSelected 
                        ? "bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/5" 
                        : "bg-transparent border-white/5 hover:border-white/20 hover:bg-white/5"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                      isSelected ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-400"
                    )}>
                      {skill === 'prototype' && <Layers className="w-5 h-5" />}
                      {skill === 'presentation' && <Presentation className="w-5 h-5" />}
                      {skill === 'dashboard' && <BarChart3 className="w-5 h-5" />}
                      {skill === 'brand_spec' && <FileCode2 className="w-5 h-5" />}
                      {skill === 'flowchart' && <Layout className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className={cn("text-sm font-bold", isSelected ? "text-white" : "text-slate-300")}>
                        {SKILL_LABELS[skill]}
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                        {SKILL_DESCRIPTIONS[skill]}
                      </p>
                    </div>
                    {isSelected && <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 3. 設計哲學 */}
          <section>
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">設計哲學導向</h2>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {(Object.keys(PHILOSOPHY_LABELS) as DesignPhilosophy[]).map(phil => {
                const isSelected = selectedPhilosophy === phil;
                return (
                  <button
                    key={phil}
                    onClick={() => setSelectedPhilosophy(phil)}
                    className={cn(
                      "p-4 rounded-2xl border transition-all duration-300 text-left space-y-2",
                      isSelected 
                        ? "bg-emerald-500/10 border-emerald-500/50" 
                        : "bg-transparent border-white/5 hover:border-white/20 hover:bg-white/5"
                    )}
                  >
                    <span className={cn("text-[11px] font-black uppercase tracking-tighter block", isSelected ? "text-emerald-400" : "text-slate-500")}>
                      {phil} Style
                    </span>
                    <h3 className={cn("text-xs font-bold", isSelected ? "text-white" : "text-slate-300")}>
                      {PHILOSOPHY_LABELS[phil].split(' ')[0]}
                    </h3>
                  </button>
                );
              })}
            </div>
          </section>

        </div>

        {/* 生成按鈕區 */}
        <div className="p-6 border-t border-white/5 bg-slate-900/50 backdrop-blur-md">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !selectedProjectId}
            className={cn(
              "w-full h-16 rounded-2xl flex items-center justify-center gap-3 font-black text-sm tracking-widest uppercase transition-all duration-500 relative overflow-hidden group disabled:opacity-30 disabled:cursor-not-allowed",
              "bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 bg-[length:200%_100%]",
              "hover:bg-[100%_0] hover:scale-[1.02] active:scale-95 shadow-xl shadow-emerald-500/20"
            )}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>正在構建藝術傑作...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                <span>生成視覺交付物</span>
              </>
            )}
          </button>
          <p className="text-center text-[10px] text-slate-600 mt-4 font-bold tracking-widest uppercase opacity-50">
            Powered by Open Design × Aim.pro
          </p>
        </div>
      </aside>

      {/* ── 主要預覽區 ── */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* 工具列 */}
        <header className="h-20 shrink-0 flex items-center justify-between px-10 border-b border-white/5 bg-slate-900/40 backdrop-blur-xl relative z-10">
          <div className="flex items-center gap-6">
            {/* 視圖切換 */}
            <div className="flex items-center gap-1 bg-black/40 rounded-2xl p-1.5 border border-white/5 shadow-inner">
              {(['preview', 'source', 'history'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black tracking-tight transition-all',
                    viewMode === mode
                      ? 'bg-gradient-to-br from-slate-700 to-slate-800 text-white shadow-xl border border-white/10'
                      : 'text-slate-500 hover:text-slate-300'
                  )}
                >
                  {mode === 'preview' && <Eye className="w-4 h-4" />}
                  {mode === 'source' && <Code2 className="w-4 h-4" />}
                  {mode === 'history' && <History className="w-4 h-4" />}
                  <span className="capitalize">{mode === 'preview' ? '即時預覽' : mode === 'source' ? '原始碼' : `歷史記錄 (${artifactHistory.length})`}</span>
                </button>
              ))}
            </div>
          </div>

          {currentArtifact && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopySource}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all border border-white/5"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                複製代碼
              </button>
              <button
                onClick={handleExportHtml}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black text-white bg-white/10 hover:bg-white/20 transition-all border border-white/10 shadow-lg"
              >
                <Download className="w-4 h-4" />
                導出 HTML
              </button>
              <div className="w-px h-6 bg-white/10 mx-2" />
              <button
                onClick={() => {
                  const win = window.open('', '_blank');
                  if (win) win.document.write(currentArtifact.html);
                }}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-500 text-white hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                title="全螢幕預覽"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          )}
        </header>

        {/* 預覽畫布 */}
        <div className="flex-1 relative bg-black custom-scrollbar">
          
          {/* 生成中動畫 */}
          {isGenerating && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#020617]/90 backdrop-blur-2xl">
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-emerald-500/30 blur-[100px] rounded-full animate-pulse" />
                <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center relative z-10 animate-[spin_4s_linear_infinite]">
                  <Sparkles className="w-16 h-16 text-white animate-pulse" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">正在構築視覺傑作</h3>
              <p className="text-emerald-400/80 text-sm font-bold tracking-widest uppercase">Open Design Full Craft Mode Active</p>
              
              <div className="mt-10 flex gap-2">
                {[0, 1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="w-2 h-10 bg-emerald-500/50 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 內容顯示 */}
          <div className="w-full h-full">
            {viewMode === 'preview' && currentArtifact && (
              <iframe
                title="Visual Artifact Preview"
                className="w-full h-full border-0 bg-transparent block"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                srcDoc={currentArtifact.html}
              />
            )}

            {viewMode === 'source' && currentArtifact && (
              <div className="p-10 font-mono text-sm leading-relaxed text-emerald-400/80 overflow-auto h-full selection:bg-emerald-500/20">
                <pre className="whitespace-pre-wrap">{currentArtifact.html}</pre>
              </div>
            )}

            {viewMode === 'history' && (
              <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artifactHistory.map(art => (
                  <button
                    key={art.id}
                    onClick={() => {
                      setCurrentArtifact(art);
                      setViewMode('preview');
                    }}
                    className={cn(
                      "group p-6 rounded-3xl border text-left transition-all duration-500",
                      currentArtifact?.id === art.id
                        ? "bg-emerald-500/10 border-emerald-500/50 shadow-xl"
                        : "bg-slate-900/50 border-white/5 hover:border-white/20 hover:bg-slate-800"
                    )}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 rounded-xl bg-slate-800 text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <History className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">v{art.version}</span>
                        <button
                          onClick={(e) => handleDeleteArtifact(e, art.id)}
                          className="p-2 rounded-lg text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                          title="刪除記錄"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h4 className="text-sm font-black text-white mb-2 line-clamp-1">{art.title}</h4>
                    <p className="text-[11px] text-slate-500">
                      {new Date(art.generatedAt).toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {!currentArtifact && !isGenerating && (
              <div className="h-full flex flex-col items-center justify-center opacity-40">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mb-8">
                  <Layout className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">準備開始創作</h3>
                <p className="text-sm text-slate-500">從左側選擇專案與風格，啟動全力模式生成</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </div>
  );
}
