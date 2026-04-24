'use client';

import { useProject } from "../context/ProjectContext";
import { Plus, LayoutGrid, Layout, Briefcase, X, Wallet, LayoutDashboard, Settings, ChevronLeft, ChevronRight, Users, LogOut, Moon, Sun, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from "next-themes";
import { PRICING_CONFIG } from "@/config/subscription";
import { toast } from "sonner";
import { trackEvent } from "@/lib/tracking";

export default function Sidebar() {
    const { 
        projects, activeProjectId, selectProject, createProject, deleteProject, 
        sidebarCollapsed, setSidebarCollapsed, userTier, aiQuota, 
        setUpgradeModalOpen, isSyncing 
    } = useProject();
    const pathname = usePathname();
    const router = useRouter();

    const plan = PRICING_CONFIG[userTier as keyof typeof PRICING_CONFIG];
    const maxQuota = plan?.limits?.aiCreditsMonthly || 50;
    const quotaPercent = Math.max(0, Math.min(100, (aiQuota / maxQuota) * 100));
    const quotaColor = quotaPercent > 40 ? 'bg-emerald-500' : quotaPercent > 15 ? 'bg-amber-400' : 'bg-red-500';

    const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

    const handleLockedClick = (feature: string) => {
        toast.info(`【升級提示】您的方案尚未解鎖「${feature}」功能。`, {
            description: "升級至專業版，解鎖完整財務防禦與法律護盾。",
            action: {
                label: "前往升級",
                onClick: () => {
                    setUpgradeModalOpen(true);
                    trackEvent('UPGRADE_CLICK', { source: 'sidebar_lock' });
                }
            }
        });
    };

    return (
        <div className={cn(
            "bg-surface h-screen flex flex-col shrink-0 z-[60] relative border-r border-border/50",
            sidebarCollapsed ? "w-[80px]" : "w-[270px]"
        )}>
            <button
                onClick={toggleSidebar}
                className={cn(
                    "flex items-center transition-all duration-300 overflow-hidden w-full group/logo hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left outline-none border-b border-black/10 dark:border-slate-800",
                    sidebarCollapsed ? "p-4 justify-center" : "px-6 py-5 gap-3"
                )}
                title={sidebarCollapsed ? "展開側欄" : "縮合側欄"}
            >
                <div className={cn(
                    "flex items-center justify-center shrink-0 transition-transform duration-300 bg-primary p-2.5 rounded-xl text-white shadow-lg shadow-primary/30",
                )}>
                    <LayoutGrid className="w-8 h-8" strokeWidth={2.5} />
                </div>
                {!sidebarCollapsed && (
                    <div className="flex flex-col whitespace-nowrap flex-1">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-[18px] text-[#111111] dark:text-white tracking-tight leading-tight">Project Estimator</span>
                            
                            {/* Sync Indicator */}
                            <div className={cn(
                                "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black transition-all duration-500",
                                isSyncing 
                                ? "bg-amber-100 text-amber-600 animate-pulse" 
                                : "bg-emerald-50 text-emerald-600 border border-emerald-100/50"
                            )}>
                                <div className={cn(
                                    "w-1.5 h-1.5 rounded-full shrink-0",
                                    isSyncing ? "bg-amber-500" : "bg-emerald-500"
                                )} />
                                {isSyncing ? "SYNCING" : "CLOUD SAVED"}
                            </div>
                        </div>
                        <span className="text-[12px] text-slate-500 font-medium whitespace-nowrap">Dashboard Pro</span>
                    </div>
                )}
            </button>

            {/* Navigation Section */}
            <div className={cn(
                "transition-all duration-300 flex-1 py-4",
                sidebarCollapsed ? "px-3" : "px-5"
            )}>
                {!sidebarCollapsed && <p className="text-[10px] font-bold text-muted-foreground/60 mt-[30px] mb-4 px-3.5 tracking-wider uppercase">Menu</p>}
                <nav className="space-y-1">
                    <div className="mt-[10px]">
                        <SidebarLink
                            href="/dashboard"
                            icon={<LayoutDashboard className="w-[18px] h-[18px] shrink-0" />}
                            label="專案儀表板"
                            isActive={pathname === '/dashboard' || pathname === '/'}
                            isCollapsed={sidebarCollapsed}
                            activeClass="bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/30"
                        />
                    </div>
                    <SidebarLink
                        href="/dashboard/finance"
                        icon={<Wallet className="w-[18px] h-[18px] shrink-0" />}
                        label="財務與概況"
                        isActive={pathname === '/dashboard/finance'}
                        isCollapsed={sidebarCollapsed}
                        badge="TAX"
                        activeClass="bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                        isLocked={!plan.features.financeModule}
                        onLockedClick={() => handleLockedClick('財務與稅務')}
                    />
                    <SidebarLink
                        href="/dashboard/customers"
                        icon={<Users className="w-[18px] h-[18px] shrink-0" />}
                        label="客戶管理"
                        isActive={pathname === '/dashboard/customers'}
                        isCollapsed={sidebarCollapsed}
                        activeClass="bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30"
                        isLocked={userTier === 'free'} // Customers module is also pro+
                        onLockedClick={() => handleLockedClick('客戶管理')}
                    />
                    <SidebarLink
                        href="/dashboard/profile"
                        icon={<Briefcase className="w-[18px] h-[18px] shrink-0" />}
                        label="個人設定"
                        isActive={pathname === '/dashboard/profile'}
                        isCollapsed={sidebarCollapsed}
                        activeClass="bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30"
                    />
                    <SidebarLink
                        href="/dashboard/settings"
                        icon={<Settings className="w-[18px] h-[18px] shrink-0" />}
                        label="系統方案"
                        isActive={pathname === '/dashboard/settings'}
                        isCollapsed={sidebarCollapsed}
                        activeClass="bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                    />
                </nav>
            </div>

            {/* AI Quota Progress Bar */}
            <div className={cn(
                "border-t border-border/50 pt-3",
                sidebarCollapsed ? "px-3" : "px-4"
            )}>
                {!sidebarCollapsed ? (
                    <div
                        className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
                        onClick={() => quotaPercent < 20 && setUpgradeModalOpen(true)}
                        title="AI 點數餘額"
                    >
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">⚡ AI 點數</span>
                            <span className={`text-[11px] font-black ${quotaPercent < 20 ? 'text-red-500' : 'text-slate-500'}`}>
                                {aiQuota} / {maxQuota === -1 ? '無限' : maxQuota}
                            </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                            <div
                                className={`${quotaColor} h-1.5 rounded-full transition-all duration-700`}
                                style={{ width: `${quotaPercent}%` }}
                            />
                        </div>
                        {quotaPercent < 20 && (
                            <p className="text-[9px] text-red-400 font-bold mt-1.5 animate-pulse">⚠️ 點數不足，點擊升級方案→</p>
                        )}
                    </div>
                ) : (
                    <div
                        className={cn(
                            "w-10 h-10 mx-auto rounded-full flex items-center justify-center text-[10px] font-black border-2 cursor-pointer",
                            quotaPercent > 40 ? "border-emerald-400 text-emerald-600" : quotaPercent > 15 ? "border-amber-400 text-amber-600" : "border-red-400 text-red-600 animate-pulse"
                        )}
                        onClick={() => setUpgradeModalOpen(true)}
                        title={`AI 點數: ${aiQuota} / ${maxQuota}`}
                    >
                        {Math.round(quotaPercent)}%
                    </div>
                )}
            </div>

            {/* Theme & Profile Section */}
            <div className={cn(
                "mt-2 p-4 border-t border-border/50",
                sidebarCollapsed ? "flex flex-col items-center gap-4" : "space-y-4"
            )}>
                {!sidebarCollapsed && <p className="text-[10px] font-bold text-muted-foreground/60 px-2 tracking-wider uppercase">Theme</p>}

                <div className={cn(
                    "flex items-center",
                    sidebarCollapsed ? "justify-center" : "px-2 justify-between"
                )}>
                    {!sidebarCollapsed && <span className="text-[15px] font-bold text-slate-800 dark:text-slate-200">Theme</span>}
                    <ThemeSwitch isCollapsed={sidebarCollapsed} />
                </div>

                <div className={cn(
                    "flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700",
                    sidebarCollapsed ? "justify-center" : "px-3 py-2.5"
                )}>
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
                        JD
                    </div>
                    {!sidebarCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">John Doe</p>
                            <p className="text-[10px] text-muted-foreground truncate">Admin</p>
                        </div>
                    )}
                    {!sidebarCollapsed && (
                        <button
                            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                            title="登出"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div >
    );
}

interface ThemeSwitchProps {
    isCollapsed: boolean;
}

function ThemeSwitch({ isCollapsed }: ThemeSwitchProps) {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "flex items-center justify-center rounded-full transition-all duration-300 border border-slate-200 dark:border-slate-700",
                "w-10 h-10",
                "text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-sm"
            )}
            title={theme === 'dark' ? '切換至淺色模式' : '切換至深色模式'}
        >
            {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
            ) : (
                <Moon className="w-5 h-5" />
            )}
        </button>
    );
}

interface SidebarLinkProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    isCollapsed: boolean;
    badge?: string;
    activeClass?: string;
    isLocked?: boolean;
    onLockedClick?: () => void;
}

function SidebarLink({ href, icon, label, isActive, isCollapsed, badge, activeClass, isLocked, onLockedClick }: SidebarLinkProps) {
    const activeStyling = activeClass || "bg-primary text-primary-foreground shadow-lg shadow-primary/25";

    if (isLocked) {
        return (
            <div
                onClick={onLockedClick}
                className={cn(
                    "group flex items-center transition-all duration-200 relative cursor-pointer",
                    isCollapsed ? "h-[60px] w-[60px] justify-center mx-auto rounded-xl" : "px-5 h-[60px] w-full rounded-xl",
                    "text-[#262626]/40 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/60 grayscale opacity-60"
                )}
            >
                <div className="transition-transform scale-110">
                    {icon}
                </div>

                {!isCollapsed ? (
                    <>
                        <span className="ml-4 text-[17px] font-semibold whitespace-nowrap flex-1 line-through">
                            {label}
                        </span>
                        <Lock className="w-4 h-4 text-slate-400" />
                    </>
                ) : (
                    <div className="absolute left-full ml-4 px-3 py-2 bg-foreground text-background text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-[100] shadow-xl transition-all translate-x-1 group-hover:translate-x-0">
                        {label} (未解鎖)
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            href={href}
            className={cn(
                "group flex items-center transition-all duration-200 relative",
                isCollapsed ? "h-[60px] w-[60px] justify-center mx-auto rounded-xl" : "px-5 h-[60px] w-full rounded-xl",
                isActive
                    ? activeStyling
                    : "text-[#262626] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            )}
        >
            <div className={cn(
                "transition-transform scale-110",
                isActive ? "text-white" : "text-current"
            )}>
                {icon}
            </div>

            {!isCollapsed ? (
                <>
                    <span className="ml-4 text-[17px] font-semibold whitespace-nowrap flex-1">
                        {label}
                    </span>
                    {isActive && <ChevronRight className="w-5 h-5 opacity-80" />}
                    {badge && !isActive && (
                        <span className={cn(
                            "ml-auto text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider leading-none bg-blue-50 text-blue-500 border border-blue-200/50",
                        )}>
                            {badge}
                        </span>
                    )}
                </>
            ) : (
                <div className="absolute left-full ml-4 px-3 py-2 bg-foreground text-background text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-[100] shadow-xl transition-all translate-x-1 group-hover:translate-x-0">
                    {label}
                </div>
            )}
        </Link>
    );
}
