'use client';

import { useState } from 'react';
import { useProject } from "../context/ProjectContext";
import { Plus, X, Layout, User, Download, Upload, Hammer, Megaphone, PartyPopper, Video, Search, Store, Palette, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useModuleAccess } from "@/hooks/useModuleAccess";
import { INDUSTRY_CATEGORIES } from "@/config/industries";
import { ThemeToggle } from "./ThemeToggle";

interface ProjectTabsProps {
    onDeleteRequest: (project: { id: string, name: string }) => void;
    onImport: () => void;
    onExport: () => void;
    onSettings: () => void;
}

export default function ProjectTabs({ onDeleteRequest, onImport, onExport, onSettings }: ProjectTabsProps) {
    const [showAddCategory, setShowAddCategory] = useState(false);
    const { projects, activeProjectId, selectProject, createProject, addProjectIndustry, activeProject, userTier } = useProject();
    const { checkAccess } = useModuleAccess();

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
                className="flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground h-14 w-14 rounded-xl font-bold text-sm transition-all shadow-lg ml-12 z-20 shrink-0 shadow-primary/20"
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
                                ? "bg-primary text-white shadow-md z-10"
                                : "bg-white/60 text-slate-500 hover:bg-white hover:text-primary border border-black/5"
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

                        {/* Active Indicator Line */}
                        {/* Removed active top border line as the entire tab is now gradient */}
                    </div>
                ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center px-4 space-x-2 h-full z-20 shrink-0 relative">

                {/* Add Category Button (Only visible if active project) */}
                {activeProjectId && (
                    <button
                        onClick={() => setShowAddCategory(!showAddCategory)}
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
                <div className="relative group">
                    <button
                        onClick={onSettings}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-surface rounded-lg transition-colors active:scale-[0.98]"
                        title="個人設定 (Profile)"
                    >
                        <User className="w-5 h-5" />
                    </button>
                    {userTier !== 'free' && (
                        <span className="absolute -top-1 -right-1 flex h-4 px-1 items-center justify-center bg-primary text-primary-foreground text-[8px] font-black rounded-full border-2 border-surface shadow-sm pointer-events-none">
                            PRO
                        </span>
                    )}
                </div>

                {/* Category Selection Modal */}
                {showAddCategory && activeProject && (
                    <div className="absolute top-full right-0 mt-2 w-72 bg-surface rounded-xl shadow-2xl border border-border overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-3 bg-muted/50 border-b border-border flex justify-between items-center">
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
