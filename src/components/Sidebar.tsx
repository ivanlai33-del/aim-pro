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
import Turnstile from "./Turnstile";

export default function Sidebar() {
    const { 
        projects, activeProjectId, selectProject, createProject, deleteProject, 
        sidebarCollapsed, setSidebarCollapsed, userTier, aiQuota, 
        setUpgradeModalOpen, isSyncing, providerInfo, currentPersona,
        setTurnstileToken
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
                    sidebarCollapsed ? "p-4 justify-center" : "px-6 py-5"
                )}
                title={sidebarCollapsed ? "展開側欄" : "縮合側欄"}
            >
                {sidebarCollapsed ? (
                    <div className="flex items-center justify-center shrink-0 transition-transform duration-300 w-10 h-10">
                        <img 
                            src="/Logo.png" 
                            alt="Aim.pro Icon" 
                            className="w-full h-full object-contain"
                        />
                    </div>
                ) : (
                    <div className="flex flex-col whitespace-nowrap flex-1">
                        <img 
                            src="/Logo_w.png" 
                            alt="Aim.pro Logo" 
                            className="h-10 object-contain object-left"
                        />
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
                            activeClass="bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/30"
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
                        activeClass="bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/30"
                    />
                </nav>
            </div>

            {/* AI Quota Progress Bar & Warning */}
            <div className={cn(
                "border-t border-border/50 pt-3",
                sidebarCollapsed ? "px-3" : "px-4"
            )}>
                {!sidebarCollapsed ? (
                    <div className="space-y-3">
                        {/* Low Quota Warning Card */}
                        {maxQuota > 0 && aiQuota <= Math.max(10, maxQuota * 0.05) && (
                            <div 
                                className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-3 mb-2 animate-pulse cursor-pointer group"
                                onClick={() => router.push('/dashboard/settings')}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm">⚠️</span>
                                    <p className="text-[11px] font-black text-amber-800 dark:text-amber-200">AI 點數即將耗盡</p>
                                </div>
                                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mb-2">剩餘 {aiQuota} 點，請儘速升級</p>
                                <button className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black rounded-lg shadow-sm group-hover:brightness-110 transition-all">
                                    立刻升級 →
                                </button>
                            </div>
                        )}

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
                        </div>
                    </div>
                ) : (
                    <div
                        className={cn(
                            "w-10 h-10 mx-auto rounded-full flex items-center justify-center text-[10px] font-black border-2 cursor-pointer relative",
                            quotaPercent > 40 ? "border-emerald-400 text-emerald-600" : quotaPercent > 15 ? "border-amber-400 text-amber-600" : "border-red-400 text-red-600 animate-pulse"
                        )}
                        onClick={() => setUpgradeModalOpen(true)}
                        title={`AI 點數: ${aiQuota} / ${maxQuota}`}
                    >
                        {maxQuota > 0 && aiQuota <= Math.max(10, maxQuota * 0.05) && (
                             <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
                            </span>
                        )}
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                        {currentPersona?.name?.slice(0, 1) || 'U'}
                    </div>
                    {!sidebarCollapsed && (
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col">
                                <p className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-tighter truncate leading-tight">
                                    {providerInfo?.name || '個人工作者'}
                                </p>
                                <p className="text-sm font-bold truncate text-slate-900 dark:text-white leading-tight mt-0.5">
                                    {currentPersona?.name || '使用者'}
                                </p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-white font-black tracking-wider uppercase">
                                        {userTier === 'professional' ? 'PRO' : userTier?.toUpperCase() || 'FREE'}
                                    </span>
                                    <span className="text-[9px] font-bold text-muted-foreground/80">
                                        {currentPersona?.role === 'owner' ? '所有者' : 
                                         currentPersona?.role === 'admin' ? '管理員' : 
                                         currentPersona?.role === 'member' ? '成員' : '財務'}
                                    </span>
                                </div>
                            </div>
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
    </div>
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
