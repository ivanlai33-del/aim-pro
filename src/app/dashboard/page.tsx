'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProjectProvider, useProject, Project } from '@/context/ProjectContext';
import ProjectTabs from '@/components/ProjectTabs';
import InputForm from '@/components/InputForm';
import { ProjectData } from '@/types/project';
import ReportView from '@/components/ReportView';
import ChatInterface from '@/components/ChatInterface';
import ExecutionManager from '@/components/ExecutionManager';
import ProjectPlan from '@/components/ProjectPlan';
import TeamManagement from '@/components/TeamManagement';
import DeleteProjectModal from '@/components/DeleteProjectModal';
import { fetchAIResponse } from '@/lib/aiService';
import { supabase } from '@/lib/supabaseClient';
import { INDUSTRY_CATEGORIES } from '@/config/industries';
import { MOCK_PERSONAS, PRICING_CONFIG } from '@/config/subscription';
import QuotationBuilder from '@/components/QuotationBuilder';
import { trackEvent } from '@/lib/tracking';
import { Settings, Sparkles, Save, FileText, MessageSquare, Sliders, Download, Upload, RefreshCw, Activity, Workflow, Users } from 'lucide-react';
import { cn, generateId } from '@/lib/utils';
import { toast } from 'sonner';
import Turnstile from '@/components/Turnstile';

const DEFAULT_WEB_PROMPT = `You are a helpful, professional technical consultant.`;

import UpgradeModal from '@/components/landing/UpgradeModal';

// --- Dashboard Component ---

function Dashboard() {
    const {
        activeProject,
        updateProjectData,
        updateProjectReport,
        deleteProject,
        importProject,
        userTier,
        aiQuota,
        customers,
        addCustomer,
        setUserTier,
        setPersona,
        devMode,
        tempHiddenModules,
        resetModuleVisibility,
        currentTeamRole,
        consumeAiQuota,
        setUpgradeModalOpen,
        turnstileToken,
        setTurnstileToken
    } = useProject();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'setup' | 'report' | 'chat' | 'quote' | 'plan' | 'execution' | 'team'>('setup');
    const [apiKey, setApiKey] = useState(''); 
    const [useCustomKey, setUseCustomKey] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const [isGenerating, setIsGenerating] = useState(false);
    const [supaUser, setSupaUser] = useState<any>(null);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<{ id: string, name: string } | null>(null);

    // File Input Ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Custom Prompts State
    const [customPrompts, setCustomPrompts] = useState<Record<string, string>>({});

    // Deleted local turnstile state: token is now in ProjectContext

    // Load persisted settings on mount
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) {
            // Auto-clear known leaked key to prevent persistent errors
            if (storedKey.includes('AgjWaTky') || storedKey.includes('CU5efTTi')) {
                localStorage.removeItem('gemini_api_key');
                setApiKey('');
                toast.info('偵測到已失效的金鑰，系統已自動切換回預設安全路徑。');
            } else {
                setApiKey(storedKey);
            }
        }

        // Load custom prompts
        const loadedPrompts: Record<string, string> = {};
        const legacyWeb = localStorage.getItem('custom_web_prompt');
        if (legacyWeb) loadedPrompts['web'] = legacyWeb;
        const legacyDesign = localStorage.getItem('custom_design_prompt');
        if (legacyDesign) loadedPrompts['graphic'] = legacyDesign;

        try {
            const storedPromptsJson = localStorage.getItem('custom_prompts_map');
            if (storedPromptsJson) Object.assign(loadedPrompts, JSON.parse(storedPromptsJson));
        } catch (e) {
            console.error("Failed to parse", e);
        }
        setCustomPrompts(loadedPrompts);

        setIsLoaded(true);

        // Check Supabase Session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSupaUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const user = session?.user ?? null;
            setSupaUser(user);
            if (user) {
                // Auto-upgrade to Pro if logged in
                // In a real app, we would fetch the user's tier from the DB. 
                // For now, we trust the login to give "Pro" access as requested.
                // We need to access setUserTier from useProject, but it's not destructured above.
                // Let's rely on the useEffect below to handle the logic if we exposure it, 
                // OR we just use a local override. 
                // Better approach: Let's use the setUserTier from the hook.
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Effect to upgrade tier on login (Handled by ProjectContext cloud fetch now)
    useEffect(() => {
        if (supaUser) {
            // persona will be fetched from cloud in ProjectContext
        }
    }, [supaUser]);

    // Save prompts when changed (Keep this, but remove apiKey saving from here)
    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem('custom_prompts_map', JSON.stringify(customPrompts));
    }, [customPrompts, isLoaded]);

    const resetPrompts = () => {
        const currentIndustryId = activeProject?.industries?.[0];
        if (!currentIndustryId) {
            toast.error("請先選擇專案");
            return;
        }

        toast("確定要重置此行業的提示詞為預設值嗎？", {
            action: {
                label: "確定重置",
                onClick: () => {
                    const newPrompts = { ...customPrompts };
                    delete newPrompts[currentIndustryId];
                    setCustomPrompts(newPrompts);
                    toast.success("已重置為預設提示詞");
                }
            },
            cancel: { label: "取消", onClick: () => { } }
        });
    };

    // --- Actions ---

    const handleDeleteRequest = (project: { id: string, name: string }) => {
        setProjectToDelete(project);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (projectToDelete) {
            deleteProject(projectToDelete.id);
            setProjectToDelete(null);
        }
    };

    const handleSaveProject = (data: ProjectData) => {
        if (activeProject) {
            updateProjectData(activeProject.id, data);

            // Auto-save Client Logic
            if (data.clientCompany) {
                const existingClient = customers.find(
                    c => c.company === data.clientCompany || (data.clientTaxId && c.taxId === data.clientTaxId)
                );

                if (!existingClient) {
                    addCustomer({
                        name: data.clientContact || '未命名聯絡人',
                        company: data.clientCompany,
                        taxId: data.clientTaxId || '',
                        email: '', // Not in InputForm currently
                        phone: data.clientPhone || '',
                        address: data.clientAddress || '',
                        tags: ['Auto-Saved', activeProject.data.projectType]
                    });
                    toast.success(`✨ 已自動將「${data.clientCompany}」加入客戶名單`);
                }
            }

            toast.success('✅ 專案資料已儲存');
        }
    };

    const handleGenerateReport = async () => {
        if (!activeProject) return;

        // Check and consume quota first
        const hasQuota = await consumeAiQuota();
        if (!hasQuota) return; // consumeAiQuota will open the modal

        updateProjectData(activeProject.id, activeProject.data);
        setIsGenerating(true);
        try {
            // Pass custom prompts and turnstile token to the service
            const response = await fetchAIResponse(
                activeProject.data,
                useCustomKey ? apiKey : undefined,
                customPrompts,
                turnstileToken || undefined
            );

            if (response.error) {
                toast.error(`Error: ${response.error}`);
            } else {
                updateProjectReport(activeProject.id, response.content);
                setActiveTab('report');
                // Tracking
                trackEvent('GENERATE_REPORT', { 
                    projectName: activeProject.name,
                    industry: activeProject.industries?.[0] 
                });
            }
        } catch (error) {
            console.error(error);
            toast.error('發生錯誤，請檢查您的網路或 API Key。');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleReportUpdate = (content: string) => {
        if (activeProject) {
            updateProjectReport(activeProject.id, content);
            toast.success('報告內容已更新');
        }
    };

    const handleExport = () => {
        if (!activeProject) return;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeProject));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${activeProject.name || "project"}.json`);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileObj = event.target.files && event.target.files[0];
        if (!fileObj) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text === 'string') {
                try {
                    const importedProject = JSON.parse(text);
                    importProject(importedProject);
                    toast.success(`✅ 成功匯入專案：${importedProject.name}`);
                } catch (error) {
                    toast.error('匯入失敗：檔案格式錯誤');
                    console.error(error);
                }
            }
        };
        reader.readAsText(fileObj);
        // Reset input
        event.target.value = '';
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-background">
            {/* Top Navigation Bar: Project Tabs with Global Controls */}
            <div className="print:hidden h-[92px] flex items-center w-full border-b border-black/20">
                <ProjectTabs
                    onDeleteRequest={handleDeleteRequest}
                    onImport={handleImportClick}
                    onExport={handleExport}
                    onSettings={() => router.push('/dashboard/profile')}
                />
            </div>

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".json"
                title="匯入專案資料 JSON 檔案"
            />



            {/* Dashboard Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">



                {/* 3. Main Workspace (Centered Window) */}
                <div className="flex-1 overflow-hidden flex flex-col bg-background">

                    {!activeProject ? (
                        <div className="text-center p-12 border-2 border-dashed border-border rounded-2xl bg-muted/30 w-full max-w-2xl mx-auto my-auto">
                            <Sliders className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-xl font-medium text-foreground">歡迎使用 Project Estimator</h3>
                            <p className="text-muted-foreground mt-2">請點擊上方 <span className="font-bold text-primary">+</span> 按鈕新增專案，或匯入舊的專案檔。</p>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col overflow-hidden print:shadow-none print:border-none print:ring-0 print:h-auto print:overflow-visible print:w-full print:max-w-none">

                            {/* Window Tabs */}
                            {/* Window Tabs & Project Info */}
                            {/* Window Tabs & Project Info */}
                            <div className="w-full bg-white border-b border-slate-200/20 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] relative z-40 print:hidden">
                                <div className="px-4 shrink-0 flex items-center justify-center mt-2 py-4 w-full max-w-[1450px] mx-auto">
                                {/* Tabs (Center) */}
                                <nav className="flex space-x-2 w-full max-w-[1450px] justify-center whitespace-nowrap overflow-x-auto no-scrollbar" aria-label="Tabs">
                                    <TabButton
                                        isActive={activeTab === 'setup'}
                                        onClick={() => setActiveTab('setup')}
                                        icon={<Sliders className="w-5 h-5 lg:mr-2" />}
                                        label="1. 專案設定"
                                        activeClass="bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 text-white shadow-[0_15px_40px_-10px_rgba(6,182,212,0.4)] ring-1 ring-white/40 border-t border-white/30"
                                    />
                                    <TabButton
                                        isActive={activeTab === 'report'}
                                        onClick={() => setActiveTab('report')}
                                        icon={<FileText className="w-5 h-5 lg:mr-2" />}
                                        label="2. 分析報告"
                                        activeClass="bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_15px_40px_-10px_rgba(16,185,129,0.4)] ring-1 ring-white/40 border-t border-white/30"
                                    />
                                    <TabButton
                                        isActive={activeTab === 'plan'}
                                        onClick={() => setActiveTab('plan')}
                                        icon={<Workflow className="w-5 h-5 lg:mr-2" />}
                                        label="3. 執行企劃"
                                        activeClass="bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-[0_15px_40px_-10px_rgba(124,58,237,0.4)] ring-1 ring-white/40 border-t border-white/30"
                                    />
                                    <TabButton
                                        isActive={activeTab === 'chat'}
                                        onClick={() => setActiveTab('chat')}
                                        icon={<MessageSquare className="w-5 h-5 lg:mr-2" />}
                                        label="4. 客戶溝通"
                                        activeClass="bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-[0_15px_40px_-10px_rgba(244,63,94,0.4)] ring-1 ring-white/40 border-t border-white/30"
                                    />

                                    {/* Locked Features for Free Tier */}
                                    <TabButton
                                        isActive={activeTab === 'quote'}
                                        onClick={() => {
                                            if (userTier === 'free') setShowUpgradeModal(true);
                                            else setActiveTab('quote');
                                        }}
                                        icon={<FileText className="w-5 h-5 lg:mr-2" />}
                                        label="5. 報價單"
                                        isLocked={userTier === 'free'}
                                        activeClass="bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 text-white shadow-[0_15px_40px_-10px_rgba(6,182,212,0.4)] ring-1 ring-white/40 border-t border-white/30"
                                    />
                                    <TabButton
                                        isActive={activeTab === 'execution'}
                                        onClick={() => {
                                            if (userTier === 'free') setShowUpgradeModal(true);
                                            else setActiveTab('execution');
                                        }}
                                        icon={<Activity className="w-5 h-5 lg:mr-2" />}
                                        label="6. 財務與執行"
                                        isLocked={userTier === 'free'}
                                        activeClass="bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-[0_15px_40px_-10px_rgba(245,158,11,0.4)] ring-1 ring-white/40 border-t border-white/30"
                                    />
                                    {['owner', 'admin'].includes(currentTeamRole) && (
                                        <TabButton
                                            isActive={activeTab === 'team'}
                                            onClick={() => {
                                                if (userTier === 'free') setShowUpgradeModal(true);
                                                else setActiveTab('team');
                                            }}
                                            icon={<Users className="w-5 h-5 lg:mr-2" />}
                                            label="7. 團隊管理"
                                            isLocked={userTier === 'free'}
                                            activeClass="bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-[0_15px_40px_-10px_rgba(30,41,59,0.4)] ring-1 ring-white/40 border-t border-white/30"
                                        />
                                    )}
                                </nav>
                            </div>
                        </div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-y-auto py-8 px-[50px] relative print:p-0 print:overflow-visible print:h-auto bg-[#f8fafc]">
                                {activeTab === 'setup' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto">
                                        {/* Project Header Block */}
                                        <div className="bg-white p-8 rounded-[24px] border border-black/20 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
                                            <div className="flex flex-col gap-2 w-full md:w-auto">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
                                                        <Sliders className="w-7 h-7" />
                                                    </div>
                                                    <div className="flex flex-col flex-1">
                                                        <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">專案名稱 (Project Name)</label>
                                                        <input
                                                            type="text"
                                                            value={activeProject.data.projectName || ''}
                                                            onChange={(e) => updateProjectData(activeProject.id, { projectName: e.target.value })}
                                                            className="w-full md:w-[450px] px-0 py-0 border-none focus:ring-0 outline-none text-2xl font-black text-slate-800 placeholder:text-slate-300 bg-transparent"
                                                            placeholder="輸入專案名稱..."
                                                        />
                                                    </div>
                                                </div>
                                                {devMode && (
                                                    <div className="flex items-center gap-3 mt-1 ml-14">
                                                        <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                                                            Dev Mode
                                                        </span>
                                                        {tempHiddenModules.length > 0 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => resetModuleVisibility()}
                                                                className="text-[11px] text-indigo-600 font-bold hover:underline"
                                                            >
                                                                重置隱藏模組 ({tempHiddenModules.length})
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4 w-full md:w-auto justify-end border-t md:border-t-0 pt-6 md:pt-0 border-black/20">
                                                <div className="scale-[0.85] origin-right mr-2">
                                                    <Turnstile onVerify={(token) => setTurnstileToken(token)} />
                                                </div>

                                                <button
                                                    type="submit"
                                                    form="project-setup-form"
                                                    className="inline-flex items-center px-8 py-4 border border-black/20 shadow-sm text-[16px] font-bold rounded-2xl text-slate-700 bg-white hover:bg-slate-50 hover:text-primary transition-all active:scale-95 whitespace-nowrap"
                                                >
                                                    <Save className="-ml-1 mr-2 h-6 w-6 text-slate-400" />
                                                    儲存設定環境
                                                </button>
                                                
                                                 <button
                                                    onClick={handleGenerateReport}
                                                    disabled={isGenerating || (!apiKey && !turnstileToken)}
                                                    className="inline-flex items-center px-10 py-5 border border-white/20 text-[16px] font-bold rounded-2xl shadow-xl shadow-cyan-500/25 text-white bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 hover:brightness-110 disabled:opacity-50 transition-all active:scale-95 whitespace-nowrap"
                                                >
                                                    {isGenerating ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white mr-2" />
                                                            分析中...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles className="-ml-1 mr-2 h-6 w-6" />
                                                            自動生成報告
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Main Form Blocks */}
                                        <div className="w-full">
                                            <InputForm
                                                initialData={activeProject.data}
                                                onSubmit={handleSaveProject}
                                                isLoading={false}
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'report' && (
                                    <div className="animate-in fade-in zoom-in-95 duration-200 min-h-full">
                                        {activeProject.reportContent ? (
                                            <ReportView
                                                reportContent={activeProject.reportContent}
                                                onSave={handleReportUpdate}
                                                apiKey={useCustomKey ? apiKey : undefined}
                                            />
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-center">
                                                <div className="bg-primary/10 p-4 rounded-full mb-4">
                                                    <FileText className="h-8 w-8 text-primary" />
                                                </div>
                                                <h3 className="text-foreground font-medium">尚未生成報告</h3>
                                                <p className="text-muted-foreground text-sm mt-2 max-w-sm">
                                                    請先至「專案設定」填寫資料，完成後點擊右上角的「生成報告」按鈕。
                                                </p>
                                                <button
                                                    onClick={() => setActiveTab('setup')}
                                                    className="mt-6 text-indigo-600 font-medium hover:underline text-sm"
                                                >
                                                    回到設定頁面
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'chat' && (
                                    <div className="animate-in fade-in zoom-in-95 duration-200 h-full">
                                        <ChatInterface apiKey={useCustomKey ? (apiKey || '') : ''} />
                                    </div>
                                )}

                                {activeTab === 'quote' && (
                                    <div className="animate-in fade-in zoom-in-95 duration-200 h-full">
                                        <QuotationBuilder
                                            projectData={activeProject.data}
                                            reportContent={activeProject.reportContent}
                                        />
                                    </div>
                                )}

                                {activeTab === 'plan' && (
                                    <div className="animate-in fade-in zoom-in-95 duration-200 h-full">
                                        <ProjectPlan />
                                    </div>
                                )}

                                {activeTab === 'execution' && (
                                    <div className="animate-in fade-in zoom-in-95 duration-200 h-full">
                                        <ExecutionManager />
                                    </div>
                                )}
                                
                                {activeTab === 'team' && (
                                    <div className="animate-in fade-in zoom-in-95 duration-200 h-full">
                                        <TeamManagement />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                {/* 4. Generation Overlay */}
                {isGenerating && <GenerationOverlay />}
            </div>

            {/* Modals */}
            <DeleteProjectModal
                isOpen={deleteModalOpen}
                projectName={projectToDelete?.name || ''}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
            />

            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                planName="專業職人版 (Pro)"
                tierId="professional"
            />
        </div>
    );
}

// Helper Component for Tabs
function TabButton({ isActive, onClick, icon, label, isLocked, activeClass }: { isActive: boolean, onClick: () => void, icon: React.ReactNode, label: string, isLocked?: boolean, activeClass?: string }) {
    const activeStyling = activeClass || "bg-primary text-primary-foreground shadow-md shadow-primary/20";

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                onClick();
            }}
            className={cn(
                "group flex-1 flex justify-center items-center px-4 lg:px-6 py-4 lg:py-[18px] rounded-xl font-black text-sm lg:text-[15px] transition-all outline-none select-none relative whitespace-nowrap backdrop-blur-sm min-w-[120px]",
                isActive
                    ? activeStyling
                    : "text-slate-600 hover:bg-white/80 dark:text-slate-400 dark:hover:bg-slate-800 border border-slate-100/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 active:scale-95"
            )}
        >
            <span className={cn("transition-colors flex items-center shrink-0", isActive ? "text-white" : "text-slate-500 group-hover:text-primary")}>
                {icon}
            </span>
            <span className="ml-2">{label}</span>
            {isLocked && (
                <span className={cn(
                    "ml-auto text-[10px] px-1.5 py-0.5 rounded-full border flex items-center ml-2",
                    isActive ? "bg-white/20 border-white/20 text-white" : "bg-slate-100 text-slate-500 border-black/20"
                )}>
                    🔒 PRO
                </span>
            )}
        </button>
    )
}

// --- Root Layout Wrapper ---

// --- Root Layout Wrapper ---

function GenerationOverlay() {
    const [step, setStep] = useState(0);
    const steps = [
        "正在解析專案背景...",
        "正在檢索行業基準數據...",
        "正在計算風險係數與應對策略...",
        "正在優化報價結構...",
        "正在撰寫專業建議報告...",
        "正在進行最後的邏輯校閱..."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % steps.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-500">
            <div className="relative p-12 rounded-[3rem] bg-white dark:bg-slate-900 border border-white/20 shadow-2xl flex flex-col items-center gap-8 max-w-md w-full mx-4">
                {/* Pulsing AI Brain Icon */}
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-2xl relative z-10 animate-bounce">
                        <Sparkles className="w-12 h-12" />
                    </div>
                </div>

                <div className="text-center space-y-4">
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                        AI 智能店長正在思考...
                    </h3>
                    <div className="h-6 flex items-center justify-center">
                        <p className="text-primary font-bold text-sm animate-in slide-in-from-bottom-2 fade-in duration-500 key={step}">
                            {steps[step]}
                        </p>
                    </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full w-[60%] animate-[shimmer_2s_infinite_linear] bg-[length:200%_100%]" />
                </div>

                <p className="text-[10px] text-slate-400 font-medium">預計耗時 10-15 秒，請勿關閉視窗</p>
            </div>
            
            <style jsx>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>
        </div>
    );
}

export default function Home() {
    return (
        <Dashboard />
    );
}
