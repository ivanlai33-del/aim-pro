'use client';

import { useState, useEffect } from 'react';
import { useProject } from "../context/ProjectContext";
import { Plus, X, Layout, User, Download, Upload, Hammer, Megaphone, PartyPopper, Video, Search, Store, Palette, Code2, Bot, Sparkles, Save, Check, Edit3, FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useModuleAccess } from "@/hooks/useModuleAccess";
import { INDUSTRY_CATEGORIES } from "@/config/industries";
import { ThemeToggle } from "./ThemeToggle";
import Turnstile from "./Turnstile";
import { toast } from 'sonner';

interface ProjectTabsProps {
    onDeleteRequest: (project: { id: string, name: string }) => void;
    onImport: () => void;
    onExport: () => void;
    onSettings: () => void;
}

export default function ProjectTabs({ onDeleteRequest, onImport, onExport, onSettings }: ProjectTabsProps) {
    const [showAddCategory, setShowAddCategory] = useState(false);
    const { projects, activeProjectId, selectProject, createProject, addProjectIndustry, activeProject, userTier, setTurnstileToken } = useProject();
    const { checkAccess } = useModuleAccess();

    // --- Open Design #1933: Project Instructions State ---
    const [customPromptsMap, setCustomPromptsMap] = useState<Record<string, string>>({});
    const [showInstructionsPanel, setShowInstructionsPanel] = useState(false);
    const [isEditingInstructions, setIsEditingInstructions] = useState(false);
    const [instructionInput, setInstructionInput] = useState("");

    // Load custom prompts from localStorage
    useEffect(() => {
        const loadPrompts = () => {
            try {
                const stored = localStorage.getItem('custom_prompts_map');
                if (stored) {
                    setCustomPromptsMap(JSON.parse(stored));
                }
            } catch (e) {
                console.error("Failed to parse custom_prompts_map", e);
            }
        };
        loadPrompts();
        window.addEventListener('storage', loadPrompts);
        return () => window.removeEventListener('storage', loadPrompts);
    }, []);

    // Current active module/industry key
    const currentModuleKey = activeProject?.industries?.[0] || activeProject?.data?.moduleId || 'web';
    const currentInstruction = customPromptsMap[currentModuleKey] || "";

    const handleOpenInstructions = () => {
        if (!currentInstruction) {
            // Empty state: open editor directly
            setInstructionInput("");
            setIsEditingInstructions(true);
        } else {
            // Has instructions: open review panel
            setInstructionInput(currentInstruction);
            setIsEditingInstructions(false);
        }
        setShowInstructionsPanel(true);
        setShowAddCategory(false);
    };

    const handleSaveInstructions = () => {
        const updated = { ...customPromptsMap };
        if (instructionInput.trim()) {
            updated[currentModuleKey] = instructionInput.trim();
        } else {
            delete updated[currentModuleKey];
        }
        setCustomPromptsMap(updated);
        localStorage.setItem('custom_prompts_map', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
        toast.success("專案專屬指令已儲存");
        // Saving lands back on the review panel so the stored value is read back immediately
        setIsEditingInstructions(false);
    };

    const getProjectIcon = (projectType: string) => {
        // Find which industry category/item this project type belongs to
        for (const category of Object.values(INDUSTRY_CATEGORIES)) {
            for (const item of category.items) {
                if (item.projectTypes?.some(t => t.id === projectType)) {
                    switch (category.icon) {
                        case 'Hammer': return <Hammer className="w-[18px] h-[18px] mr-2" />;
                        case 'Megaphone': return <Megaphone className="w-[18px] h-[18px] mr-2" />;
                        case 'PartyPopper': return <PartyPopper className="w-[18px] h-[18px] mr-2" />;
                        case 'Layout': return <Layout className="w-[18px] h-[18px] mr-2" />;
                        case 'Video': return <Video className="w-[18px] h-[18px] mr-2" />;
                        case 'Search': return <Search className="w-[18px] h-[18px] mr-2" />;
                        case 'Palette': return <Palette className="w-[18px] h-[18px] mr-2" />;
                        case 'Briefcase': return <User className="w-[18px] h-[18px] mr-2" />;
                        default: return <Layout className="w-[18px] h-[18px] mr-2" />;
                    }
                }
            }
        }
        return <Layout className="w-4 h-4 mr-2" />;
    };

    const handleAddCategory = (industryId: string) => {
        if (activeProjectId) {
            addProjectIndustry(activeProjectId, industryId);
            setShowAddCategory(false);
        }
    };

    // Option 1: Dropdown Quick Switcher State
    const [showProjectSwitcher, setShowProjectSwitcher] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'DRAFT' | 'CLOSED'>('ALL');

    const getProjectStatusBadge = (project: any) => {
        if (project.isManuallyClosed || project.data?.isClosed) {
            return { stage: 'CLOSED', label: '🔒 已隱蔽', color: 'bg-rose-900/90 text-rose-200 border-rose-600', dot: 'bg-rose-500' };
        }
        if (project.firstViewedAt || project.data?.firstExternalViewedAt) {
            return { stage: 'ACTIVE', label: '🔵 倒數中', color: 'bg-blue-900/90 text-blue-200 border-blue-600', dot: 'bg-blue-400 animate-pulse' };
        }
        return { stage: 'DRAFT', label: '🟢 未開啟', color: 'bg-slate-800 text-slate-300 border-slate-600', dot: 'bg-emerald-500' };
    };

    const getProjectTotalAmount = (project: any) => {
        if (project.quotationItems && project.quotationItems.length > 0) {
            const sum = project.quotationItems.reduce((acc: number, item: any) => acc + item.quantity * item.unitPrice, 0);
            return Math.round(sum * 1.05); // including tax
        }
        return project.data?.budget || 0;
    };

    const filteredProjects = projects.filter((p) => {
        const matchesSearch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.data?.clientCompany || p.data?.clientName || '').toLowerCase().includes(searchQuery.toLowerCase());
        const status = getProjectStatusBadge(p);
        if (statusFilter === 'ALL') return matchesSearch;
        return matchesSearch && status.stage === statusFilter;
    });

    return (
        <div className="flex items-center w-full select-none relative z-20">

            {/* Left: New Project Button */}
            <button
                onClick={createProject}
                className="flex items-center justify-center bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 text-white h-14 w-14 rounded-xl font-bold text-sm transition-all shadow-lg ml-12 z-20 shrink-0 shadow-cyan-500/20 active:scale-95 border border-white/30"
                title="新增專案"
            >
                <Plus className="w-8 h-8 transition-transform group-hover:rotate-90" />
            </button>

            {/* Center: Scrollable Tabs with Status Dots */}
            <div className="flex-1 overflow-x-auto no-scrollbar flex items-center px-2 space-x-2">
                {projects.map((project) => {
                    const status = getProjectStatusBadge(project);
                    return (
                        <div
                            key={project.id}
                            onClick={() => selectProject(project.id)}
                            className={cn(
                                "group relative flex items-center min-w-[170px] max-w-[210px] h-12 px-3.5 rounded-xl text-xs font-bold cursor-pointer transition-all select-none shrink-0 active:scale-[0.98]",
                                activeProjectId === project.id
                                    ? "bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 text-white shadow-md z-10 border border-white/20 dark:border-white/10"
                                    : "bg-surface/60 text-muted-foreground hover:bg-surface hover:text-cyan-600 border border-border/50 dark:border-transparent"
                            )}
                        >
                            {getProjectIcon(project.data.projectType)}
                            <span className="truncate flex-1 pr-6">{project.name || "未命名專案"}</span>
                            <span className={cn("w-2 h-2 rounded-full absolute right-8 top-1/2 -translate-y-1/2", status.dot)} title={status.label} />

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteRequest({ id: project.id, name: project.name });
                                }}
                                className={cn(
                                    "absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all active:scale-[0.98]",
                                    activeProjectId === project.id
                                        ? "text-white/70 hover:text-white hover:bg-white/20 opacity-100"
                                        : "text-muted-foreground hover:bg-muted hover:text-destructive opacity-0 group-hover:opacity-100"
                                )}
                                title="刪除專案"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Quick Project Switcher Dropdown Button */}
            <button
                onClick={() => setShowProjectSwitcher(true)}
                className="flex items-center px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-teal-500/10 hover:from-cyan-500/20 hover:to-emerald-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 transition-all shadow-sm active:scale-95 mr-2 shrink-0 gap-1.5 cursor-pointer backdrop-blur-sm"
                title="專案快速切換總表 (含有專案狀態、金額與客戶全銜)"
            >
                <ChevronDown className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>切換專案 ({projects.length})</span>
            </button>

            {/* Option 1: Quick Switcher Dropdown Modal */}
            {showProjectSwitcher && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="w-full max-w-2xl bg-surface dark:bg-slate-900 border border-border dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-foreground font-sans space-y-4 p-6">
                        <div className="flex justify-between items-center pb-3 border-b border-border dark:border-slate-800">
                            <div className="flex items-center space-x-3">
                                <span className="w-9 h-9 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold border border-cyan-500/30 text-base shadow-sm">
                                    🗂️
                                </span>
                                <div>
                                    <h3 className="text-base font-bold text-foreground">專案與報價狀態總覽清單</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">快速搜尋切換專案、檢視即時報價狀態與對帳進度</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowProjectSwitcher(false)}
                                className="text-muted-foreground hover:text-foreground p-1.5 rounded-xl hover:bg-muted/80 transition cursor-pointer"
                                title="關閉"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search Bar & Status Filter */}
                        <div className="flex flex-wrap gap-3 items-center justify-between">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="搜尋專案名稱、客戶公司全銜..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-muted/40 dark:bg-slate-800/80 border border-border dark:border-slate-700 rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
                                />
                            </div>

                            <div className="flex items-center space-x-1.5 text-xs">
                                <button
                                    onClick={() => setStatusFilter('ALL')}
                                    className={`px-3 py-1.5 rounded-xl font-bold transition shadow-xs cursor-pointer ${statusFilter === 'ALL' ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white' : 'bg-muted text-muted-foreground hover:bg-surface-hover border border-border/50'}`}
                                >
                                    全部 ({projects.length})
                                </button>
                                <button
                                    onClick={() => setStatusFilter('ACTIVE')}
                                    className={`px-3 py-1.5 rounded-xl font-bold transition shadow-xs cursor-pointer ${statusFilter === 'ACTIVE' ? 'bg-blue-600 text-white' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 hover:bg-blue-100 dark:hover:bg-blue-500/20'}`}
                                >
                                    🔵 倒數中
                                </button>
                                <button
                                    onClick={() => setStatusFilter('DRAFT')}
                                    className={`px-3 py-1.5 rounded-xl font-bold transition shadow-xs cursor-pointer ${statusFilter === 'DRAFT' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'}`}
                                >
                                    🟢 未開啟
                                </button>
                                <button
                                    onClick={() => setStatusFilter('CLOSED')}
                                    className={`px-3 py-1.5 rounded-xl font-bold transition shadow-xs cursor-pointer ${statusFilter === 'CLOSED' ? 'bg-rose-600 text-white' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 hover:bg-rose-100 dark:hover:bg-rose-500/20'}`}
                                >
                                    🔒 已隱蔽
                                </button>
                            </div>
                        </div>

                        {/* Project List Cards */}
                        <div className="max-h-[360px] overflow-y-auto space-y-2.5 pr-1">
                            {filteredProjects.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground text-xs">
                                    沒有符合條件的專案項目。
                                </div>
                            ) : (
                                filteredProjects.map((p) => {
                                    const status = getProjectStatusBadge(p);
                                    const total = getProjectTotalAmount(p);
                                    const isSelected = p.id === activeProjectId;

                                    return (
                                        <div
                                            key={p.id}
                                            onClick={() => {
                                                selectProject(p.id);
                                                setShowProjectSwitcher(false);
                                            }}
                                            className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-wrap items-center justify-between gap-3 ${
                                                isSelected
                                                    ? 'bg-gradient-to-r from-cyan-500/15 via-emerald-500/10 to-transparent border-2 border-cyan-500 dark:border-cyan-400 shadow-md'
                                                    : 'bg-muted/30 dark:bg-slate-800/40 border-border dark:border-slate-800 hover:border-cyan-500/50 hover:bg-surface dark:hover:bg-slate-800/80'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-lg border border-cyan-500/20 shrink-0 shadow-sm">
                                                    {getProjectIcon(p.data?.projectType)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <h4 className="font-bold text-sm text-foreground">{p.name || '未命名專案'}</h4>
                                                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${status.color}`}>
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        客戶：<strong className="text-foreground">{p.data?.clientCompany || p.data?.clientName || '未指定客戶'}</strong>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                <div className="text-right font-mono">
                                                    <p className="text-[11px] text-muted-foreground">專案估價總額</p>
                                                    <p className="text-sm font-black text-cyan-600 dark:text-cyan-400">
                                                        NT$ {total.toLocaleString()}
                                                    </p>
                                                </div>

                                                <a
                                                    href={`/p/${p.id}?admin=87257257`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="px-3 py-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 text-xs font-bold rounded-xl border border-amber-500/30 transition shadow-xs"
                                                    title="👑 上帝視角開啟此報價單"
                                                >
                                                    👑 預閱 ➔
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Right: Actions */}
            <div className="flex items-center px-4 space-x-2 h-full z-20 shrink-0 relative">

                {/* Add Category Button (Only visible if active project) */}
                {activeProjectId && (
                    <button
                        onClick={() => {
                            setShowAddCategory(!showAddCategory);
                            setShowInstructionsPanel(false);
                        }}
                        className={cn(
                            "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all",
                            showAddCategory
                                ? "bg-primary/10 text-primary ring-2 ring-primary/20"
                                : "text-muted-foreground hover:bg-surface hover:text-primary hover:shadow-sm"
                        )}
                        title="增加服務類別 (跨領域提案)"
                    >
                        <Plus className="w-4 h-4 mr-1.5" />
                        服務類別
                    </button>
                )}

                {/* --- Open Design #1933: Project Instructions Chip --- */}
                {activeProject && (
                    <div className="relative">
                        {currentInstruction ? (
                            <button
                                onClick={handleOpenInstructions}
                                className="flex items-center px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 transition-all shadow-sm dark:shadow-none active:scale-95 gap-1.5"
                                title="檢視/編輯專案專屬指令"
                            >
                                <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                                <span>專案專屬指令</span>
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                            </button>
                        ) : (
                            <button
                                onClick={handleOpenInstructions}
                                className="flex items-center px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-all active:scale-95 gap-1.5 border border-border dark:border-transparent"
                                title="新增專案專屬指令 (Custom Instructions)"
                            >
                                <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
                                <span>自訂指令</span>
                            </button>
                        )}

                        {/* Review / Edit Panel Modal (Fixed Z-[9999] Overlay to avoid clipping) */}
                        {showInstructionsPanel && (
                            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
                                <div className="w-full max-w-lg bg-surface dark:bg-slate-900 rounded-2xl shadow-2xl border border-border dark:border-slate-800 overflow-hidden text-foreground">
                                    <div className="p-4 bg-muted/60 dark:bg-slate-800/80 border-b border-border dark:border-slate-800 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                            <span className="font-bold text-sm text-foreground">專案專屬 AI 角色指令 (Custom Instructions)</span>
                                        </div>
                                        <button 
                                            onClick={() => setShowInstructionsPanel(false)}
                                            className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-surface-hover transition-colors"
                                            title="關閉"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="p-5 space-y-4">
                                        {!isEditingInstructions ? (
                                            // Read-only Review Panel
                                            <div className="space-y-4 animate-in fade-in duration-200">
                                                <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 rounded-xl p-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                                        <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Active</span>
                                                    </div>
                                                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">於每次 AI 估價/分析時自動注入</span>
                                                </div>

                                                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono whitespace-pre-wrap max-h-[220px] overflow-y-auto shadow-inner border border-slate-800 leading-relaxed">
                                                    {currentInstruction}
                                                </div>

                                                <div className="flex items-center justify-end gap-3 pt-2">
                                                    <button
                                                        onClick={() => setShowInstructionsPanel(false)}
                                                        className="w-1/2 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 active:scale-95 cursor-pointer"
                                                    >
                                                        關閉 (Close)
                                                    </button>
                                                    <button
                                                        onClick={() => setIsEditingInstructions(true)}
                                                        className="w-1/2 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-500 transition-all shadow-md active:scale-95 cursor-pointer"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                        編輯指令 (Edit)
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // Edit Mode
                                            <div className="space-y-4 animate-in fade-in duration-200">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-xs font-bold text-foreground">自訂指令內容 (Instructions)</label>
                                                    {currentInstruction && (
                                                        <button
                                                            onClick={() => {
                                                                setInstructionInput(currentInstruction);
                                                                setIsEditingInstructions(false);
                                                            }}
                                                            className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                                                        >
                                                            返回檢視
                                                        </button>
                                                    )}
                                                </div>

                                                <textarea
                                                    value={instructionInput}
                                                    onChange={(e) => setInstructionInput(e.target.value)}
                                                    placeholder="請輸入給 AI 的專案專屬指示，例如：請以資深架構師的角度審查合約，並嚴格限制修改次數不超過 3 次..."
                                                    className="w-full h-[180px] p-3.5 border border-input rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20 focus:border-ring outline-none resize-none leading-relaxed bg-input focus:bg-surface transition-all font-sans"
                                                />

                                                <div className="flex items-center justify-end gap-3 pt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setInstructionInput(currentInstruction);
                                                            setShowInstructionsPanel(false);
                                                        }}
                                                        className="w-1/2 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 active:scale-95 cursor-pointer"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        取消 (Cancel)
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleSaveInstructions}
                                                        className="w-1/2 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:brightness-110 transition-all shadow-lg shadow-indigo-500/25 active:scale-95 cursor-pointer"
                                                    >
                                                        <Save className="w-4 h-4" />
                                                        儲存並啟用 (Save & Activate)
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="w-px h-6 bg-border mx-2" />

                <button
                    onClick={onImport}
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-surface rounded-lg transition-colors active:scale-[0.98]"
                    title="匯入專案 (Import)"
                >
                    <Upload className="w-5 h-5" />
                </button>
                <button
                    onClick={onExport}
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-surface rounded-lg transition-colors active:scale-[0.98]"
                    title="匯出專案 (Export)"
                >
                    <Download className="w-5 h-5" />
                </button>
                <ThemeToggle />

                {/* Category Selection Modal */}
                {showAddCategory && activeProject && (
                    <div className="absolute top-full right-0 mt-2 w-72 bg-surface rounded-xl shadow-2xl border border-border dark:border-transparent overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-3 bg-muted/50 border-b border-border dark:border-transparent flex justify-between items-center">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">新增服務類別</span>
                            <button onClick={() => setShowAddCategory(false)} title="關閉"><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto p-2">
                            {Object.values(INDUSTRY_CATEGORIES)
                                .filter(category => !activeProject.industries?.includes(category.id))
                                .map((category) => {
                                    // Check if any module in this category is unlocked
                                    const isLocked = !category.items.some(item => checkAccess(item.id));

                                    return (
                                        <button
                                            key={category.id}
                                            onClick={() => !isLocked && handleAddCategory(category.id)}
                                            disabled={isLocked}
                                            className={cn(
                                                "w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center group relative",
                                                isLocked
                                                    ? "opacity-50 cursor-not-allowed hover:bg-muted"
                                                    : "hover:bg-primary/5 hover:text-primary"
                                            )}
                                            title={isLocked ? "此領域尚未解鎖 (需升級方案)" : category.description}
                                        >
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-colors",
                                                isLocked ? "bg-muted text-muted-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                            )}>
                                                {(() => {
                                                    switch (category.icon) {
                                                        case 'Hammer': return <Hammer className="w-4 h-4" />;
                                                        case 'Megaphone': return <Megaphone className="w-4 h-4" />;
                                                        case 'PartyPopper': return <PartyPopper className="w-4 h-4" />;
                                                        case 'Layout': return <Layout className="w-4 h-4" />;
                                                        case 'Video': return <Video className="w-4 h-4" />;
                                                        case 'Search': return <Search className="w-4 h-4" />;
                                                        case 'Palette': return <Palette className="w-4 h-4" />;
                                                        case 'Briefcase': return <User className="w-4 h-4" />;
                                                        default: return <Layout className="w-4 h-4" />;
                                                    }
                                                })()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm flex items-center text-foreground">
                                                    {category.name.split(' ')[0]}
                                                    {isLocked && <span className="ml-2 text-[10px] bg-muted text-muted-foreground px-1.5 rounded">LOCKED</span>}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground truncate max-w-[120px]">{category.description}</div>
                                            </div>
                                            {!isLocked && (
                                                <Plus className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 text-primary" />
                                            )}
                                        </button>
                                    );
                                })}
                            {Object.values(INDUSTRY_CATEGORIES).filter(category => !activeProject.industries?.includes(category.id)).length === 0 && (
                                <div className="text-center py-8 text-muted-foreground text-xs">
                                    已加入所有類別
                                </div>
                            )}
                        </div>
                        <div className="p-3 bg-amber-500/10 border-t border-amber-500/20 text-[10px] text-amber-600 dark:text-amber-400">
                            💡 提示：增加類別將會自動匯入該領域的「預設估價項目」。
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
