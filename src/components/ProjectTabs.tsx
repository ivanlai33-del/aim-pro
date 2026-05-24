'use client';

import { useState, useEffect } from 'react';
import { useProject } from "../context/ProjectContext";
import { Plus, X, Layout, User, Download, Upload, Hammer, Megaphone, PartyPopper, Video, Search, Store, Palette, Code2, Bot, Sparkles, Save, Check, Edit3, FileText } from "lucide-react";
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

            {/* Center: Scrollable Tabs */}
            <div className="flex-1 overflow-x-auto no-scrollbar flex items-center px-2 space-x-2">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        onClick={() => selectProject(project.id)}
                        className={cn(
                            "group relative flex items-center min-w-[160px] max-w-[200px] h-12 px-4 rounded-xl text-sm font-bold cursor-pointer transition-all select-none shrink-0 active:scale-[0.98]",
                            activeProjectId === project.id
                                ? "bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 text-white shadow-md z-10 border border-white/20 dark:border-white/10"
                                : "bg-surface/60 text-muted-foreground hover:bg-surface hover:text-cyan-600 border border-border/50 dark:border-transparent"
                        )}
                    >
                        {getProjectIcon(project.data.projectType)}
                        <span className="truncate flex-1 pr-6">{project.name || "未命名專案"}</span>

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
                ))}
            </div>

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

                        {/* Review / Edit Panel Popover */}
                        {showInstructionsPanel && (
                            <div className="absolute top-full right-0 mt-3 w-[420px] bg-surface rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)] border border-border dark:border-transparent overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-4 bg-muted/50 border-b border-border dark:border-transparent flex justify-between items-center backdrop-blur-sm">
                                    <div className="flex items-center gap-2">
                                        <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                        <span className="font-bold text-sm text-foreground">專案專屬 AI 角色指令</span>
                                    </div>
                                    <button 
                                        onClick={() => setShowInstructionsPanel(false)}
                                        className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-surface-hover transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="p-5 space-y-4">
                                    {!isEditingInstructions ? (
                                        // Read-only Review Panel
                                        <div className="space-y-4 animate-in fade-in duration-200">
                                            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200/80 rounded-xl p-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                                    <span className="text-xs font-bold text-emerald-800">Active</span>
                                                </div>
                                                <span className="text-[11px] text-emerald-600 font-medium">於每次 AI 估價/分析時自動注入</span>
                                            </div>

                                            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono whitespace-pre-wrap max-h-[220px] overflow-y-auto shadow-inner border border-slate-800 leading-relaxed">
                                                {currentInstruction}
                                            </div>

                                            <div className="flex justify-end gap-2 pt-2">
                                                <button
                                                    onClick={() => setIsEditingInstructions(true)}
                                                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                    編輯指令 (Edit Instructions)
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
                                                        返回檢視 (Cancel)
                                                    </button>
                                                )}
                                            </div>

                                            <textarea
                                                value={instructionInput}
                                                onChange={(e) => setInstructionInput(e.target.value)}
                                                placeholder="請輸入給 AI 的專案專屬指示，例如：請以資深架構師的角度審查合約，並嚴格限制修改次數不超過 3 次..."
                                                className="w-full h-[180px] p-3.5 border border-input rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20 focus:border-ring outline-none resize-none leading-relaxed bg-input focus:bg-surface transition-all font-sans"
                                            />

                                            <div className="flex justify-end gap-2 pt-2">
                                                <button
                                                    onClick={handleSaveInstructions}
                                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:brightness-110 transition-all shadow-lg shadow-indigo-500/25 active:scale-95"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    儲存並啟用 (Save & Activate)
                                                </button>
                                            </div>
                                        </div>
                                    )}
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
