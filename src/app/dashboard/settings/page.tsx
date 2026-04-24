'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProject } from '@/context/ProjectContext';
import {
    RefreshCw, Save, CheckCircle2, Building, Bot, FileCog,
    Layout, Hammer, Megaphone, PartyPopper, Briefcase,
    Lock, ChevronDown, ChevronUp, AlertCircle, Crown, Zap, Info,
    Plus, Trash2, Check, CreditCard, Building2, Cpu, LayoutGrid,
    Globe, Terminal, Layers, Share2, BadgeDollarSign, Search, UserPlus,
    PenTool, Monitor, Video, ImageIcon, Camera, Home, Calendar, Map,
    Lightbulb, GraduationCap, Compass, BookOpen, Box, ShieldCheck
} from 'lucide-react';
import { CATEGORY_FOLDERS, BUSINESS_MODULES, BusinessModule, CATEGORY_GRADIENTS } from '@/config/industries';
import { BankInfo } from '@/context/ProjectContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// --- Icons Map ---
const CATEGORY_ICONS: Record<string, any> = {
    web: Layout,
    marketing: Megaphone,
    design: PartyPopper, // Adjusted icon
    space: Hammer,
    consulting: Briefcase
};



const MODULE_ICONS: Record<string, any> = {
    // 🟢 Web
    web_development: Globe,
    software_outsourcing: Terminal,
    system_integration: Layers,
    // 🟡 Marketing
    social_media: Share2,
    ad_management: BadgeDollarSign,
    seo: Search,
    influencer_marketing: UserPlus,
    // 🔵 Design
    brand_design: PenTool,
    ui_ux_design: Monitor,
    video_production: Video,
    social_visual: ImageIcon,
    photography: Camera,
    // 🟠 Space
    interior_design: Home,
    event_planning: Calendar,
    exhibition_design: Map,
    // 🟣 Professional
    business_consulting: Lightbulb,
    corporate_training: GraduationCap,
    strategy_planning: Compass,
    online_course_prod: BookOpen,
    home_organizer: Box,
    ip_agent: ShieldCheck
};

import { MOCK_PERSONAS } from '@/config/subscription';
import { useModuleAccess } from '@/hooks/useModuleAccess';

export default function SettingsPage() {
    const {
        providerInfo, setProviderInfo,
        currentIndustry, switchIndustry,
        currentPersona, setPersona,
        devMode, setDevMode
    } = useProject();

    // Permission Hook
    const { checkAccess } = useModuleAccess();

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SettingsContent 
                providerInfo={providerInfo}
                setProviderInfo={setProviderInfo}
                currentIndustry={currentIndustry}
                switchIndustry={switchIndustry}
                currentPersona={currentPersona}
                setPersona={setPersona}
                devMode={devMode}
                setDevMode={setDevMode}
                checkAccess={checkAccess}
            />
        </Suspense>
    );
}

function SettingsContent({ 
    providerInfo, setProviderInfo, 
    currentIndustry, switchIndustry, 
    currentPersona, setPersona, 
    devMode, setDevMode,
    checkAccess 
}: any) {
    const searchParams = useSearchParams();
    const isPaymentSuccess = searchParams.get('payment') === 'success';

    // --- Local State for Settings ---
    const [apiKey, setApiKey] = useState('');
    const [useCustomKey, setUseCustomKey] = useState(false); // New: Hybrid API Toggle
    const [customPrompts, setCustomPrompts] = useState<Record<string, string>>({});

    // UI State
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
        web: true, marketing: true, design: true, space: true, consulting: true
    });
    const [selectedModuleId, setSelectedModuleId] = useState<string>('');

    // Load from LocalStorage
    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) {
            setApiKey(storedKey);
            setUseCustomKey(true); // Auto-enable if key exists
        }

        // Load custom prompts
        const storedPromptsJson = localStorage.getItem('custom_prompts_map');
        if (storedPromptsJson) {
            try {
                setCustomPrompts(JSON.parse(storedPromptsJson));
            } catch (e) {
                console.error("Failed to parse custom_prompts_map", e);
            }
        }

        // Default selection logic
        if (currentIndustry && !selectedModuleId) {
            // Optional: Auto-select first module if none selected
            const firstModule = MOCK_PERSONAS[0].unlockedModules[0];
            if (firstModule) setSelectedModuleId(firstModule);
        }
    }, [currentIndustry, selectedModuleId]);

    // --- Handlers ---

    // Save to LocalStorage
    const handleSave = () => {
        if (useCustomKey) {
            localStorage.setItem('gemini_api_key', apiKey);
        } else {
            localStorage.removeItem('gemini_api_key'); // Clear if using system key
        }

        localStorage.setItem('custom_prompts_map', JSON.stringify(customPrompts));
        // DevMode is handled by context sync now, but we can verify

        toast.success("設定已儲存");
    };

    const toggleCategory = (catId: string) => {
        setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
    };

    const handleModuleSelect = (moduleId: string, isLocked: boolean) => {
        // Use checkAccess logic instead of passed isLocked if desired, 
        // but UI already passes computed lock status
        if (isLocked) {
            toast.error("此模組未訂閱", {
                description: "請升級方案或加購此模組以解鎖功能。",
                action: {
                    label: "了解詳情",
                    onClick: () => window.open('/pricing', '_blank') // Mock link
                }
            });
            return;
        }

        setSelectedModuleId(moduleId);
        // Removed: switchIndustry(module.categoryId); // No longer sync context to avoid toast and unwanted navigation effect
    };

    const handlePromptChange = (val: string) => {
        if (!selectedModuleId) return;
        setCustomPrompts(prev => ({
            ...prev,
            [selectedModuleId]: val
        }));
    };

    const resetPrompts = () => {
        if (!selectedModuleId) return;
        const newPrompts = { ...customPrompts };
        delete newPrompts[selectedModuleId];
        setCustomPrompts(newPrompts);
        toast.success("已重置為預設提示詞");
    };

    // --- Bank Account Handlers ---
    const addBankAccount = () => {
        const newAccount = {
            id: Math.random().toString(36).substr(2, 9),
            bankName: '',
            branch: '',
            accountName: '',
            accountNumber: ''
        };
        const updatedAccounts = [...providerInfo.bankAccounts, newAccount];
        // If it's the first account, set as primary automatically
        const primaryId = providerInfo.bankAccounts.length === 0 ? newAccount.id : providerInfo.primaryBankId;

        setProviderInfo({
            ...providerInfo,
            bankAccounts: updatedAccounts,
            primaryBankId: primaryId
        });
    };

    const removeBankAccount = (id: string) => {
        const updatedAccounts = providerInfo.bankAccounts.filter((acc: BankInfo) => acc.id !== id);
        let primaryId = providerInfo.primaryBankId;
        if (primaryId === id) {
            primaryId = updatedAccounts.length > 0 ? updatedAccounts[0].id : '';
        }
        setProviderInfo({
            ...providerInfo,
            bankAccounts: updatedAccounts,
            primaryBankId: primaryId
        });
    };

    const updateBankAccount = (id: string, field: string, value: string) => {
        const updatedAccounts = providerInfo.bankAccounts.map((acc: BankInfo) => {
            if (acc.id === id) {
                return { ...acc, [field]: value };
            }
            return acc;
        });
        setProviderInfo({
            ...providerInfo,
            bankAccounts: updatedAccounts
        });
    };

    const setPrimaryAccount = (id: string) => {
        setProviderInfo({
            ...providerInfo,
            primaryBankId: id
        });
        toast.success("已設定為預設收款帳號");
    };

    // --- Computed Values ---
    const activeModule = BUSINESS_MODULES[selectedModuleId];
    // Prompt Logic: Default is EMPTY or Template, NOT the core prompt
    // 3-Layer Logic: Core (Hidden) -> Template (Default) -> Custom (Overlay)
    const currentPromptValue = activeModule
        ? (customPrompts[selectedModuleId] || activeModule.userPromptTemplate || '')
        : '';

    // Core Prompt Display Logic
    const corePromptDisplay = activeModule
        ? (devMode ? activeModule.corePrompt : "🔒 已鎖定 (System Managed - Core IP Protected)")
        : "";

    return (
        <div className="w-full px-[50px] pt-[50px] animate-in fade-in pb-20">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">系統設定</h1>
                    <p className="text-slate-500">System Settings</p>
                </div>
            </div>

            {/* Payment Success Banner */}
            {isPaymentSuccess && (
                <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-center gap-6 animate-in zoom-in duration-500 shadow-xl shadow-emerald-500/5">
                    <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg shadow-emerald-500/20">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-emerald-900">付款成功！</h3>
                        <p className="text-emerald-700">您的方案已成功升級。AI 額度與模組權限已即時更新，您可以開始使用專業功能了。</p>
                    </div>
                    <button 
                        onClick={() => window.history.replaceState({}, '', window.location.pathname)}
                        className="ml-auto p-2 text-emerald-400 hover:text-emerald-600 transition-colors"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            )}

            <div className="space-y-8">


                {/* --- 1. Industry & Module Selection (Flattened) --- */}
                <div className="animate-in slide-in-from-top-4 duration-500">
                    <div className="mb-10 flex items-center gap-4">
                        <LayoutGrid className="w-10 h-10 text-indigo-600 flex-shrink-0" />
                        <div>
                            <h2 className="text-[27px] font-bold text-slate-800 tracking-tight flex items-baseline flex-wrap gap-x-2">
                                <span>產業與模組</span>
                                <span className="text-[15px] text-slate-400 font-normal">(Industry Modules)</span>
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                已解鎖模組將顯示為啟用狀態。
                            </p>
                        </div>
                    </div>

                    <div className="space-y-[50px]">
                        {Object.values(CATEGORY_FOLDERS).map(category => {
                            const isExpanded = expandedCategories[category.id];
                            const Icon = CATEGORY_ICONS[category.id] || Layout;

                            return (
                                <div key={category.id} className="group">
                                    <button
                                        onClick={() => toggleCategory(category.id)}
                                        className="w-full flex items-center justify-between py-6 group-hover:bg-slate-50/50 transition-colors text-left border-t border-black/20"
                                    >
                                        <div className="flex items-center space-x-5">
                                            <div className={cn(
                                                "p-4 rounded-2xl text-white shadow-lg transition-transform group-hover:scale-110 bg-gradient-to-br",
                                                CATEGORY_GRADIENTS[category.id] || "from-slate-400 to-slate-500"
                                            )}>
                                                <Icon className="w-10 h-10" />
                                            </div>
                                            <div className="mt-[10px]">
                                                <h3 className="font-bold text-[29px] text-gray-900 leading-tight">
                                                    {category.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                                            </div>
                                        </div>
                                        {isExpanded ? <ChevronUp className="w-6 h-6 text-gray-400" /> : <ChevronDown className="w-6 h-6 text-gray-400" />}
                                    </button>

                                    {isExpanded && (
                                        <div className="pt-4 pb-10 animate-in slide-in-from-top-2 duration-200">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                                {category.moduleIds.map(moduleId => {
                                                    const moduleInfo = BUSINESS_MODULES[moduleId];
                                                    if (!moduleInfo) return null;

                                                    // Check Permission Hook
                                                    const isUnlocked = checkAccess(moduleId);

                                                    return (
                                                        <button
                                                            key={moduleId}
                                                            onClick={() => handleModuleSelect(moduleId, !isUnlocked)}
                                                            className={cn(
                                                                "flex flex-col items-start justify-start p-[15px] rounded-2xl transition-all w-full h-[200px] text-left border border-black/20 overflow-hidden relative group active:scale-95",
                                                                isUnlocked
                                                                    ? `bg-gradient-to-br ${CATEGORY_GRADIENTS[category.id] || "from-indigo-500 to-purple-600"} text-white shadow-lg shadow-indigo-500/20 border-transparent`
                                                                    : "bg-white text-slate-900 hover:border-indigo-400 hover:shadow-md"
                                                            )}
                                                        >
                                                            <div className="w-full flex flex-col items-start z-10 relative h-full">
                                                                <div className="w-full flex justify-between items-start mb-2">
                                                                    {(() => {
                                                                        const ModIcon = MODULE_ICONS[moduleId] || FileCog;
                                                                        return <ModIcon className={cn("w-8 h-8", isUnlocked ? "text-white/80" : "text-indigo-500/60")} />;
                                                                    })()}
                                                                </div>
                                                                <h4 className={cn("font-bold text-[23.4px] mb-1.5 leading-tight", isUnlocked ? "text-white" : "text-slate-800")}>
                                                                    {moduleInfo.name}
                                                                </h4>
                                                                <p className={cn("text-[14.3px] font-medium line-clamp-1 opacity-80", isUnlocked ? "text-indigo-100" : "text-slate-500")}>
                                                                    {moduleInfo.tagline}
                                                                </p>

                                                                {/* Status Icon positioned bottom-right */}
                                                                <div className="absolute bottom-0 right-0">
                                                                    {isUnlocked ? (
                                                                        <div className="flex items-center text-[14.5px] font-bold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md text-yellow-300 border border-white/20 shadow-sm">
                                                                            <CheckCircle2 className="w-[18px] h-[18px] mr-1.5 text-yellow-300 fill-yellow-300/20" />
                                                                            已啟用
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex items-center text-[14.5px] font-bold bg-slate-100 px-3 py-1.5 rounded-full text-slate-400 border border-black/10">
                                                                            <Lock className="w-[18px] h-[18px] mr-1.5" />
                                                                            未訂閱
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Decorative Background Elements for Unlocked */}
                                                            {isUnlocked && (
                                                                <>
                                                                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl pointer-events-none" />
                                                                    <div className="absolute bottom-0 left-0 w-12 h-12 bg-indigo-400/20 rounded-full -ml-4 -mb-4 blur-lg pointer-events-none" />
                                                                </>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* --- Advanced AI Settings (Side-by-Side) --- */}
                <div className="border-t border-black/20 pt-[50px] mt-[50px]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-[50px]">
                        {/* --- 2. AI Brain & Prompt Protection --- */}
                        <div className="animate-in slide-in-from-left-4 duration-500">
                            {activeModule ? (
                                <section className="bg-white rounded-xl border border-black/20 shadow-sm overflow-hidden h-full">
                                    <div className="p-6 border-b border-black/20 bg-gray-50/50">
                                        <div className="flex items-center gap-4">
                                            <Bot className="w-10 h-10 text-indigo-600 flex-shrink-0" />
                                            <h2 className="text-[27px] font-bold text-slate-800 tracking-tight flex items-baseline flex-wrap gap-x-2">
                                                <span>AI 角色指令設定</span>
                                                <span className="text-[15px] text-slate-400 font-normal">(AI Persona)</span>
                                            </h2>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            設定 <strong>{activeModule.name}</strong> 的行為模式。
                                        </p>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        {devMode && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                                                    <span>Core Persona</span>
                                                </label>
                                                <div className="w-full p-4 rounded-lg border text-xs font-mono overflow-auto max-h-32 bg-red-50 border-red-200 text-red-900">
                                                    {activeModule.corePrompt}
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-[15px] font-bold text-slate-500 mb-[10px] px-1">
                                                <span>Your Custom Instructions</span>
                                                <span className="text-[13.5px] font-normal text-slate-400 ml-1.5">(自定義指令疊加)</span>
                                            </label>
                                            <textarea
                                                className="w-full p-[15px] border border-black/20 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-[22px] text-slate-800 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white h-32"
                                                placeholder={`輸入額外的行為指導...`}
                                                value={customPrompts[selectedModuleId] || ''}
                                                onChange={(e) => handlePromptChange(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </section>
                            ) : (
                                <div className="bg-gray-50 rounded-xl border border-black/20 border-dashed p-10 flex flex-col items-center justify-center text-center h-full">
                                    <Bot className="w-10 h-10 text-gray-300 mb-4" />
                                    <p className="text-sm text-gray-400">請先從上方選擇一個模組<br />以設定其 AI 角色指令</p>
                                </div>
                            )}
                        </div>

                        {/* --- 3. Hybrid API Key Config --- */}
                        <div className="animate-in slide-in-from-right-4 duration-500">
                            <section className="bg-white rounded-xl border border-black/20 shadow-sm overflow-hidden h-full">
                                <div className="p-6 border-b border-black/20 bg-gray-50/50">
                                    <div className="flex items-center gap-4">
                                        <Cpu className="w-10 h-10 text-indigo-600 flex-shrink-0" />
                                        <h2 className="text-[27px] font-bold text-slate-800 tracking-tight flex items-baseline flex-wrap gap-x-2">
                                            <span>AI 模型與金鑰設定</span>
                                            <span className="text-[15px] text-slate-400 font-normal">(Model & API Key)</span>
                                        </h2>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                                        <div className="flex items-start">
                                            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-medium text-blue-900 text-sm">混合 API 模式</h4>
                                                <p className="text-xs text-blue-700 mt-1">
                                                    系統預設使用託管的 API 金鑰。您可以輸入自己的 Gemini API Key 以解鎖無限速模式。
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="useCustomKey"
                                                checked={useCustomKey}
                                                onChange={(e) => setUseCustomKey(e.target.checked)}
                                                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-black/20"
                                            />
                                            <label htmlFor="useCustomKey" className="flex items-center cursor-pointer select-none">
                                                <span className="text-sm font-bold text-gray-900">啟用自訂金鑰</span>
                                            </label>
                                        </div>

                                        {useCustomKey ? (
                                            <div className="space-y-2">
                                                <label className="block text-[15px] font-bold text-slate-500 mb-[10px] px-1">Gemini API Key</label>
                                                <input
                                                    type="password"
                                                    value={apiKey}
                                                    onChange={(e) => setApiKey(e.target.value)}
                                                    placeholder="sk-..."
                                                    className="w-full p-[15px] border border-black/20 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-[22px] text-slate-800 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white font-mono"
                                                />
                                            </div>
                                        ) : (
                                            <div className="p-3 bg-gray-50 rounded-lg border border-black/20 text-sm text-gray-500 flex items-center justify-center">
                                                <Lock className="w-4 h-4 mr-2" />
                                                使用系統內建金鑰
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                {/* --- 4. Company Info --- */}
                <div className="border-t border-black/20 pt-[50px] mt-[50px]">
                    <section className="bg-white rounded-xl border border-black/20 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-black/20 bg-gray-50/50 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <Building2 className="w-10 h-10 text-indigo-600 flex-shrink-0" />
                                <h2 className="text-[27px] font-bold text-slate-800 tracking-tight flex items-baseline flex-wrap gap-x-2">
                                    <span>公司與統編資料</span>
                                    <span className="text-[15px] text-slate-400 font-normal">(Company Info)</span>
                                </h2>
                            </div>
                            <button
                                onClick={handleSave}
                                className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-10 py-3 rounded-2xl font-bold hover:brightness-110 flex items-center shadow-xl shadow-indigo-500/30 active:scale-95 transition-all text-[18.2px]"
                            >
                                <Save className="w-6 h-6 mr-2" />
                                儲存變更
                            </button>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[15px] font-bold text-slate-500 mb-[10px] px-1">公司名稱</label>
                                <input
                                    value={providerInfo.name}
                                    onChange={(e) => setProviderInfo({ ...providerInfo, name: e.target.value })}
                                    title="公司名稱"
                                    placeholder="請輸入公司名稱"
                                    className="w-full p-[15px] border border-black/20 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-[22px] text-slate-800 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-[15px] font-bold text-slate-500 mb-[10px] px-1">聯絡人</label>
                                <input
                                    type="text"
                                    value={providerInfo.contact}
                                    onChange={(e) => setProviderInfo({ ...providerInfo, contact: e.target.value })}
                                    title="聯絡人"
                                    placeholder="請輸入聯絡人姓名"
                                    className="w-full p-[15px] border border-black/20 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-[22px] text-slate-800 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-[15px] font-bold text-slate-500 mb-[10px] px-1">統一編號</label>
                                <input
                                    type="text"
                                    value={providerInfo.taxId}
                                    onChange={(e) => setProviderInfo({ ...providerInfo, taxId: e.target.value })}
                                    className="w-full p-[15px] border border-black/20 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-[22px] text-slate-800 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-[15px] font-bold text-slate-500 mb-[10px] px-1">電話</label>
                                <input
                                    type="text"
                                    value={providerInfo.phone}
                                    onChange={(e) => setProviderInfo({ ...providerInfo, phone: e.target.value })}
                                    className="w-full p-[15px] border border-black/20 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-[22px] text-slate-800 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[15px] font-bold text-slate-500 mb-[10px] px-1">地址</label>
                                <input
                                    type="text"
                                    value={providerInfo.address}
                                    onChange={(e) => setProviderInfo({ ...providerInfo, address: e.target.value })}
                                    className="w-full p-[15px] border border-black/20 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-[22px] text-slate-800 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white"
                                />
                            </div>
                        </div>

                        {/* Bank Account Management */}
                        <div className="p-6 border-t border-black/20 bg-gray-50/30">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-4">
                                    <CreditCard className="w-10 h-10 text-indigo-600 flex-shrink-0" />
                                    <h3 className="text-[27px] font-bold text-slate-800 tracking-tight flex items-baseline flex-wrap gap-x-2">
                                        <span>公司收款帳號</span>
                                        <span className="text-[15px] text-slate-400 font-normal">(Bank Accounts)</span>
                                    </h3>
                                </div>
                                <button
                                    onClick={addBankAccount}
                                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 flex items-center shadow-lg shadow-blue-500/25 active:scale-95 transition-all text-[18px]"
                                >
                                    <Plus className="w-8 h-8 mr-2" strokeWidth={3} />
                                    增加公司匯款帳號
                                </button>
                            </div>

                            <div className="space-y-3">
                                {providerInfo.bankAccounts.map((acc: BankInfo) => (
                                    <div key={acc.id} className={cn(
                                        "p-4 rounded-xl border transition-all relative group",
                                        providerInfo.primaryBankId === acc.id
                                            ? "bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-200"
                                            : "bg-white border-black/20 hover:border-black/20 shadow-sm"
                                    )}>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="md:col-span-1">
                                                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">銀行名稱</label>
                                                <input
                                                    value={acc.bankName}
                                                    onChange={(e) => updateBankAccount(acc.id, 'bankName', e.target.value)}
                                                    placeholder="例如：台新銀行 (812)"
                                                    className="w-full text-sm bg-transparent border-none p-0 focus:ring-0 font-medium text-gray-900"
                                                />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">分行/代碼</label>
                                                <input
                                                    value={acc.branch}
                                                    onChange={(e) => updateBankAccount(acc.id, 'branch', e.target.value)}
                                                    placeholder="例如：建南分行"
                                                    className="w-full text-sm bg-transparent border-none p-0 focus:ring-0 font-medium text-gray-900"
                                                />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">戶名</label>
                                                <input
                                                    value={acc.accountName}
                                                    onChange={(e) => updateBankAccount(acc.id, 'accountName', e.target.value)}
                                                    placeholder="例如：某某數位有限公司"
                                                    className="w-full text-sm bg-transparent border-none p-0 focus:ring-0 font-medium text-gray-900"
                                                />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">帳號</label>
                                                <input
                                                    value={acc.accountNumber}
                                                    onChange={(e) => updateBankAccount(acc.id, 'accountNumber', e.target.value)}
                                                    placeholder="0000-0000-0000"
                                                    className="w-full text-sm bg-transparent border-none p-0 focus:ring-0 font-medium text-gray-900"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-black/20 flex justify-between items-center">
                                            <button
                                                onClick={() => setPrimaryAccount(acc.id)}
                                                className={cn(
                                                    "text-[11px] px-3 py-1 rounded-full font-bold flex items-center transition-all",
                                                    providerInfo.primaryBankId === acc.id
                                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                                        : "bg-white text-gray-400 border border-black/20 hover:text-indigo-600 hover:border-indigo-200"
                                                )}
                                            >
                                                {providerInfo.primaryBankId === acc.id ? (
                                                    <><Check className="w-3 h-3 mr-1" /> 預設帳號</>
                                                ) : (
                                                    "設為預設"
                                                )}
                                            </button>
                                            <button
                                                onClick={() => removeBankAccount(acc.id)}
                                                className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {providerInfo.bankAccounts.length === 0 && (
                                    <div className="text-center py-8 border-2 border-dashed border-black/20 rounded-xl bg-gray-50/50">
                                        <p className="text-sm text-gray-400">目前尚無帳號資料，請點擊上方按鈕新增。</p>
                                    </div>
                                )}
                            </div>
                        </div>


                    </section>
                </div>


                {/* --- Simulation Mode (Developer Only) --- */}
                {devMode && (
                    <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-6 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden border border-slate-800/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <Crown className="w-5 h-5 text-yellow-400" />
                                <h2 className="text-lg font-bold">訂閱模擬 (Simulation Mode)</h2>
                            </div>
                            <select
                                value={currentPersona.id}
                                onChange={(e) => {
                                    const persona = MOCK_PERSONAS.find(p => p.id === e.target.value);
                                    if (persona) setPersona(persona);
                                }}
                                className="bg-slate-700 border-slate-600 text-white text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                            >
                                {MOCK_PERSONAS.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Simulation Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-4 bg-slate-900/40 rounded-lg border border-indigo-500/20 backdrop-blur-sm">
                            {/* Projects Usage */}
                            <div>
                                <div className="flex justify-between text-xs text-indigo-200/70 mb-1">
                                    <span>專案數量</span>
                                    <span>{currentPersona.usage.projectsCount} / {currentPersona.tier === 'free' ? '3' : '∞'}</span>
                                </div>
                                <div className="w-full bg-slate-800/50 rounded-full h-1.5">
                                    <div
                                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                        style={{ width: currentPersona.tier === 'free' ? `${Math.min(100, (currentPersona.usage.projectsCount / 3) * 100)}%` : '15%' }}
                                    />
                                </div>
                            </div>

                            {/* AI Quota Usage */}
                            <div>
                                <div className="flex justify-between text-xs text-indigo-200/70 mb-1">
                                    <span>AI 生成額度</span>
                                    <span>{currentPersona.usage.aiGenerations} / {
                                        currentPersona.tier === 'free' ? '10' :
                                            currentPersona.tier === 'professional' ? '1,000' :
                                                currentPersona.tier === 'pro_plus' ? '5,000' : '∞'
                                    }</span>
                                </div>
                                <div className="w-full bg-slate-800/50 rounded-full h-1.5">
                                    <div
                                        className="bg-purple-500 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                                        style={{ width: `${Math.min(100, (currentPersona.usage.aiGenerations / (currentPersona.tier === 'free' ? 10 : currentPersona.tier === 'professional' ? 1000 : 5000)) * 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Modules Usage */}
                            <div>
                                <div className="flex justify-between text-xs text-indigo-200/70 mb-1">
                                    <span>已解鎖模組</span>
                                    <span>
                                        {currentPersona.unlockedModules.length + (currentPersona.addOnModules?.length || 0)}
                                        <span className="text-indigo-300/50"> (含加購)</span>
                                    </span>
                                </div>
                                <div className="flex gap-1 mt-1">
                                    {currentPersona.unlockedModules.map((m: string) => (
                                        <div key={m} className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" title={`Base Plan: ${m}`} />
                                    ))}
                                    {currentPersona.addOnModules?.map((m: string) => (
                                        <div key={m} className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" title={`Add-on: ${m}`} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <p className="text-indigo-200/50 text-xs mt-4 flex items-center">
                            <Info className="w-3 h-3 mr-1.5" />
                            切換不同角色以預覽「模組化訂閱」的鎖定/解鎖狀態與用量顯示。
                            <span className="ml-2 text-indigo-300 font-bold bg-indigo-900/80 px-2 py-0.5 rounded text-[10px] border border-indigo-500/50 flex items-center shadow-[0_0_10px_rgba(99,102,241,0.3)]"><Zap className="w-3 h-3 mr-1 text-yellow-300" /> DEV ACCESS ALL</span>
                        </p>
                    </section>
                )}

                {/* Developer Mode Toggle */}
                <div className="flex justify-center pt-[50px] mt-[50px] border-t border-black/20">
                    <label className="flex items-center space-x-2 text-sm text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                        <input
                            type="checkbox"
                            checked={devMode}
                            onChange={(e) => setDevMode(e.target.checked)}
                            className="rounded border-black/20 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Developer Mode</span>
                    </label>
                </div>

            </div>
        </div>
    );
}

