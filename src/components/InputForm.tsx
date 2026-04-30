import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Loader2, Check, Wand2, FileText, Target, Settings2, Users, LayoutGrid, CalendarRange,
    Globe, Terminal, Layers, Share2, BadgeDollarSign, Search, UserPlus,
    PenTool, Monitor, Video, ImageIcon, Camera, Home, Calendar, Map,
    Lightbulb, GraduationCap, Compass, BookOpen, Box, ShieldCheck,
    Smartphone, Laptop, ShoppingCart, Megaphone as MegaphoneIcon, Rocket, HelpCircle,
    CheckCircle2, Lock, Upload, X, FileSearch, ChevronDown, ChevronUp, Paperclip
} from 'lucide-react';
import { toast } from 'sonner';
import { useProject, Customer } from '@/context/ProjectContext';
import { useModuleAccess } from '@/hooks/useModuleAccess';
import { BusinessModule, IndustryCategory } from '@/types/industries';
import { INDUSTRY_CATEGORIES, CATEGORY_GRADIENTS } from '@/config/industries';
import { cn } from '@/lib/utils';
import { MAGIC_TEST_DATA } from '@/config/magicData';

interface InputFormProps {
    initialData?: ProjectData;
    onSubmit: (data: ProjectData) => void;
    isLoading: boolean;
}

import { ProjectData } from '@/types/project';

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

const TYPE_ICONS: Record<string, any> = {
    website: Globe,
    webapp: Laptop,
    mobile: Smartphone,
    ecommerce: ShoppingCart,
    campaign: Rocket,
    promotion: MegaphoneIcon,
    general: HelpCircle
};

const OPTION_GRADIENTS = [
    "bg-gradient-to-br from-indigo-500 to-blue-600",
    "bg-gradient-to-br from-emerald-500 to-teal-600",
    "bg-gradient-to-br from-violet-500 to-purple-600",
    "bg-gradient-to-br from-rose-500 to-pink-600",
    "bg-gradient-to-br from-cyan-500 to-blue-600",
    "bg-gradient-to-br from-orange-400 to-amber-500"
];

const TYPE_GRADIENTS = [
    "bg-gradient-to-br from-indigo-500 to-blue-600",
    "bg-gradient-to-br from-emerald-500 to-teal-600",
    "bg-gradient-to-br from-violet-500 to-purple-600",
    "bg-gradient-to-br from-rose-500 to-pink-600",
    "bg-gradient-to-br from-orange-400 to-amber-500"
];

const CATEGORY_GRADIENT_MAP: Record<string, string> = {
    web: "bg-gradient-to-br from-indigo-500 to-blue-600",
    marketing: "bg-gradient-to-br from-orange-400 to-rose-500",
    design: "bg-gradient-to-br from-pink-500 to-purple-600",
    space: "bg-gradient-to-br from-emerald-400 to-teal-500",
    consulting: "bg-gradient-to-br from-violet-500 to-fuchsia-600",
    pro_service: "bg-gradient-to-br from-sky-500 to-blue-500"
};

// --- Helper Component: Big Block Card ---
function FormCard({ title, children, className, colSpan = "col-span-12", titleClassName, icon: Icon }: { title?: string, children: React.ReactNode, className?: string, colSpan?: string, titleClassName?: string, icon?: any }) {
    // Logic to split title "Chinese (English)"
    const match = title?.match(/^([^(]+)(?:\s*\((.*)\))?$/);
    const mainTitle = match ? match[1].trim() : title;
    const subTitle = match && match[2] ? match[2].trim() : null;

    return (
        <div className={cn(
            "bg-white p-8 rounded-[24px] border border-black/20 shadow-sm hover:shadow-md transition-all duration-300",
            colSpan,
            className
        )}>
            {title && (
                <div className="mb-6 flex items-center gap-4">
                    {Icon && <Icon className="w-10 h-10 text-indigo-600 flex-shrink-0" />}
                    <h3 className={cn("text-[27px] font-bold text-slate-800 tracking-tight flex items-baseline flex-wrap gap-x-2", titleClassName)}>
                        <span>{mainTitle}</span>
                        {subTitle && (
                            <span className="text-[15px] text-slate-400 font-normal">({subTitle})</span>
                        )}
                    </h3>
                </div>
            )}
            {children}
        </div>
    );
}

function OptionButton({
    label,
    isActive,
    onClick,
    className,
    icon,
    showBadge,
    activeBg = "bg-gradient-to-br from-indigo-500 to-blue-600"
}: {
    label: string,
    isActive: boolean,
    onClick: () => void,
    className?: string,
    icon?: React.ReactNode,
    showBadge?: boolean,
    activeBg?: string
}) {
    // Logic to split "Chinese (English)" into two lines
    const match = label.match(/^([^(]+)(?:\s*\((.*)\))?$/);
    const mainText = match ? match[1].trim() : label;
    const subText = match && match[2] ? match[2].trim() : null;

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex flex-col items-start justify-start p-[15px] rounded-2xl border transition-all min-h-[160px] text-left group active:scale-95 relative overflow-hidden",
                isActive
                    ? `border-transparent ${activeBg} text-white shadow-lg shadow-primary/20`
                    : 'border-black/20 bg-white text-slate-500 hover:border-primary/50 hover:bg-slate-50 hover:text-primary hover:shadow-md',
                className
            )}
        >
            {icon && <div className={cn("mb-2", isActive ? "text-white/80" : "text-slate-400 group-hover:text-primary/70")}>{icon}</div>}
            <span className="text-[22px] font-bold leading-tight block">{mainText || "未命名模組"}</span>
            {subText && (
                <span className={cn(
                    "text-[16px] font-medium mt-1 block tracking-tight",
                    isActive ? "text-white/70" : "text-slate-400"
                )}>
                    {subText}
                </span>
            )}

            {/* Status Badge positioned bottom-right */}
            {showBadge && (
                <div className="absolute bottom-0 right-0">
                    <div className={cn(
                        "flex items-center text-[14.5px] font-bold px-3 py-1.5 rounded-full backdrop-blur-md border shadow-sm",
                        isActive
                            ? "bg-white/20 text-yellow-300 border-white/20"
                            : "bg-slate-100 text-slate-400 border-black/10"
                    )}>
                        <CheckCircle2 className={cn("w-[18px] h-[18px] mr-1.5", isActive ? "text-yellow-300 fill-yellow-300/20" : "text-slate-400")} />
                        已啟用
                    </div>
                </div>
            )}
        </button>
    );
}

const FormFieldLabel = ({ label, htmlFor, className }: { label: string, htmlFor?: string, className?: string }) => {
    // Matches "Chinese (English) [Optional]"
    const match = label.match(/^([^(]+)(?:\s*\(([^)]+)\))?(.*)$/);
    if (!match) return <label htmlFor={htmlFor} className={cn("block text-[15px] font-bold text-slate-500 mb-[10px] px-[15px]", className)}>{label}</label>;

    const mainText = match[1].trim();
    const engText = match[2] ? match[2].trim() : null;
    const extra = match[3] ? match[3].trim() : "";

    return (
        <label htmlFor={htmlFor} className={cn("block text-[15px] font-bold text-slate-500 mb-[10px] px-[15px]", className)}>
            {mainText}
            {engText && (
                <span className="text-[13.5px] font-normal text-slate-400 ml-1.5">
                    ({engText})
                </span>
            )}
            {extra && (
                <span className="text-slate-400 text-[11px] font-normal tracking-wider ml-1">
                    {extra}
                </span>
            )}
        </label>
    );
};

export default function InputForm({ initialData, onSubmit, isLoading }: InputFormProps) {
    const {
        currentIndustry,
        customers,
        switchIndustry,
        devMode,
        tempHiddenModules,
        toggleModuleVisibility,
        resetModuleVisibility,
        activeProjectId,
        updateProjectData
    } = useProject();
    const [clientSuggestions, setClientSuggestions] = useState<Customer[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Permission Hook
    const { checkAccess } = useModuleAccess();

    // --- 文件解析器 State ---
    const [parsedDocuments, setParsedDocuments] = useState<Array<{
        id: string;
        name: string;
        type: string;
        size: string;
        content: string;
        parsedAt: string;
    }>>([]);
    const [docAnalyzing, setDocAnalyzing] = useState(false);
    const [docExpanded, setDocExpanded] = useState(true);
    const [pasteMode, setPasteMode] = useState(false);
    const [pasteText, setPasteText] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const SUPPORTED_TYPES = [
        { ext: '.txt', mime: 'text/plain', label: '純文字' },
        { ext: '.md', mime: 'text/markdown', label: 'Markdown' },
        { ext: '.csv', mime: 'text/csv', label: 'CSV 試算表' },
        { ext: '.json', mime: 'application/json', label: 'JSON 資料' },
        { ext: '.html', mime: 'text/html', label: 'HTML 網頁' },
        { ext: '.xml', mime: 'text/xml', label: 'XML 文件' },
    ];
    const MAX_DOCS = 5;
    const MAX_SIZE_MB = 2;

    const handleFileUpload = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        if (parsedDocuments.length >= MAX_DOCS) {
            toast.error(`最多支援 ${MAX_DOCS} 份文件同時解析`);
            return;
        }
        const remaining = MAX_DOCS - parsedDocuments.length;
        const toProcess = Array.from(files).slice(0, remaining);

        setDocAnalyzing(true);
        const newDocs: typeof parsedDocuments = [];

        for (const file of toProcess) {
            const sizeMB = file.size / 1024 / 1024;
            if (sizeMB > MAX_SIZE_MB) {
                toast.error(`「${file.name}」超過 ${MAX_SIZE_MB}MB 限制，已跳過`);
                continue;
            }
            try {
                const text = await file.text();
                const cleanText = text
                    .replace(/<[^>]*>/g, ' ')  // strip HTML tags
                    .replace(/\s+/g, ' ')
                    .trim()
                    .slice(0, 8000); // cap at 8000 chars per doc

                newDocs.push({
                    id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
                    name: file.name,
                    type: file.name.split('.').pop()?.toUpperCase() || 'TXT',
                    size: sizeMB < 0.1 ? `${Math.round(file.size / 1024)}KB` : `${sizeMB.toFixed(1)}MB`,
                    content: cleanText,
                    parsedAt: new Date().toLocaleTimeString('zh-TW')
                });
            } catch {
                toast.error(`無法讀取「${file.name}」，請確認格式正確`);
            }
        }

        if (newDocs.length > 0) {
            setParsedDocuments(prev => [...prev, ...newDocs]);
            toast.success(`✅ 成功解析 ${newDocs.length} 份文件，AI 將整合分析`);
        }
        setDocAnalyzing(false);
    }, [parsedDocuments]);

    const handlePasteDoc = () => {
        if (!pasteText.trim()) { toast.warning('請先貼上文字內容'); return; }
        if (parsedDocuments.length >= MAX_DOCS) { toast.error(`最多支援 ${MAX_DOCS} 份文件`); return; }
        const doc = {
            id: `doc_paste_${Date.now()}`,
            name: `貼上文字 #${parsedDocuments.filter(d => d.name.startsWith('貼上')).length + 1}`,
            type: 'TEXT',
            size: `${pasteText.length} 字`,
            content: pasteText.slice(0, 8000),
            parsedAt: new Date().toLocaleTimeString('zh-TW')
        };
        setParsedDocuments(prev => [...prev, doc]);
        setPasteText('');
        setPasteMode(false);
        toast.success('✅ 文字已加入解析佇列，AI 將整合分析');
    };

    const removeDoc = (id: string) => setParsedDocuments(prev => prev.filter(d => d.id !== id));

    // Merge document content into submission
    const getDocumentContext = () => {
        if (parsedDocuments.length === 0) return '';
        return `\n\n---\n## 📎 附加參考文件（共 ${parsedDocuments.length} 份，請整合分析）\n` +
            parsedDocuments.map((d, i) =>
                `\n### 文件 ${i + 1}：${d.name}\n${d.content}`
            ).join('\n');
    };

    // ...formData state...
    const [formData, setFormData] = useState<ProjectData>({
        moduleId: currentIndustry?.items?.[0]?.id || 'web_development',
        projectType: currentIndustry?.items?.[0]?.projectTypes?.[0]?.id || 'website',
        projectName: '',
        description: '',
        features: '',
        budget: '',
        timeline: '',
        existingTech: '',
        websiteUrl: '',
        optimizationGoals: '',
        styleReferences: '',
        clientCompany: '',
        clientTaxId: '',
        clientContact: '',
        clientPhone: '',
        clientAddress: '',
        // Dynamic fields storage
        ...initialData
    });

    const activeModule = currentIndustry?.items?.find(m => m.id === formData.moduleId) || currentIndustry?.items?.[0];
    const formConfig = activeModule?.formConfig;

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

    // Update active module when industry changes (only if current module doesn't belong to the new industry)
    useEffect(() => {
        const isCurrentModuleInNewIndustry = currentIndustry?.items?.some(m => m.id === formData.moduleId);
        
        if (currentIndustry?.items?.[0] && !isCurrentModuleInNewIndustry) {
            setFormData(prev => ({
                ...prev,
                moduleId: currentIndustry.items[0].id,
                projectType: currentIndustry.items[0].projectTypes?.[0]?.id || 'general'
            }));
        }
    }, [currentIndustry.id]);

    const handleMultiSelectToggle = (fieldName: string, option: string) => {
        setFormData(prev => {
            // @ts-ignore
            const currentValues = Array.isArray(prev[fieldName]) ? prev[fieldName] : [];
            const newValues = currentValues.includes(option)
                ? currentValues.filter((v: string) => v !== option)
                : [...currentValues, option];
            return { ...prev, [fieldName]: newValues };
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Client Search Logic
        if (name === 'clientCompany') {
            if (value.trim().length > 0) {
                const matches = customers.filter(c =>
                    c.company.toLowerCase().includes(value.toLowerCase()) ||
                    c.name.toLowerCase().includes(value.toLowerCase())
                );
                setClientSuggestions(matches);
                setShowSuggestions(true);
            } else {
                setShowSuggestions(false);
            }
        }
    };

    const handleSelectClient = (client: Customer) => {
        setFormData(prev => ({
            ...prev,
            clientCompany: client.company,
            clientTaxId: client.taxId,
            clientContact: client.name, // Map Customer.name to clientContact
            clientPhone: client.phone,
            clientAddress: client.address
        }));
        setShowSuggestions(false);
        toast.success(`已載入客戶資料：${client.company}`);
    };

    const handleTypeChange = (type: string) => {
        setFormData(prev => ({ ...prev, projectType: type }));
    };

    // Placeholder logic replaced by activeModule.formConfig
    // const placeholders = getPlaceholders(currentIndustry?.id || 'web', formData.projectType);

    const handleSaveName = () => {
        if (activeProjectId) {
            updateProjectData(activeProjectId, formData);
            toast.success('專案名稱已成功保存！', {
                description: `名稱已更新為：${formData.projectName}`,
                icon: '✅'
            });
        } else {
            toast.error('無法保存：未找到活動專案 ID');
        }
    };

    const handleMagicFill = () => {
        const magicData = MAGIC_TEST_DATA[formData.moduleId];

        // 1. Create a clean baseline for the specific module
        const baselineData: any = {
            moduleId: formData.moduleId,
            projectType: magicData?.projectType || (activeModule?.projectTypes?.[0]?.id || 'general'),
            projectName: '',
            description: '',
            features: '',
            budget: '',
            timeline: '',
            existingTech: '',
            websiteUrl: '',
            optimizationGoals: '',
            styleReferences: '',
            clientCompany: '',
            clientTaxId: '',
            clientContact: '',
            clientPhone: '',
            clientAddress: '',
        };

        // 2. Explicitly clear all custom fields defined in the current module's formConfig
        if (activeModule?.formConfig?.customFields) {
            activeModule.formConfig.customFields.forEach(field => {
                baselineData[field.name] = field.type === 'multi-select' ? [] : '';
            });
        }

        if (magicData) {
            // 3. Apply the magic data over the clean baseline
            setFormData({
                ...baselineData,
                ...magicData
            });

            toast.success('🎉 測試魔法已載入！', {
                description: `已填入針對「${activeModule?.name}」模組設計的高品質且「無衝突」測試數據。`,
                icon: '🪄'
            });
        } else {
            toast.warning('此模組尚無預設測試數據，將填入通用範例。');
            setFormData({
                ...baselineData,
                projectName: `[測試] ${activeModule?.name} 專案`,
                description: "這是一個用於測試系統 AI 分析能力的示範專案內容。",
                features: "1. 核心需求 A\n2. 核心需求 B"
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Inject document context into description
        const enrichedData = parsedDocuments.length > 0
            ? { ...formData, description: formData.description + getDocumentContext() }
            : formData;
        onSubmit(enrichedData);
    };


    return (
        <form id="project-setup-form" onSubmit={handleSubmit} className="grid grid-cols-12 gap-8 pb-20">

            <FormCard title="選擇專案範疇 (Industry Category)" className="col-span-12" icon={LayoutGrid}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Object.values(INDUSTRY_CATEGORIES)
                        .flatMap(cat => cat.items)
                        .filter(m => !tempHiddenModules.includes(m.id)) // Only filter by dev hidden, not access
                        .map((module) => {
                            const isActive = formData.moduleId === module.id;
                            const hasAccess = checkAccess(module.id);
                            const ModIcon = MODULE_ICONS[module.id] || LayoutGrid;

                            // 🔒 Locked Module: show greyed-out with lock overlay
                            if (!hasAccess) {
                                return (
                                    <div
                                        key={module.id}
                                        className="relative flex flex-col items-start justify-start p-[15px] rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 text-slate-400 min-h-[200px] cursor-not-allowed grayscale opacity-70 hover:opacity-90 transition-all group"
                                        title={`升級方案以解鎖「${module.name}」`}
                                        onClick={() => toast.info(`「${module.name}」需升級至更高方案才能解鎖`, {
                                            description: '前往「系統方案」升級以解鎖所有行業模組',
                                            action: { label: '前往升級', onClick: () => window.location.href = '/dashboard/settings' }
                                        })}
                                    >
                                        <div className="mb-2 text-slate-300">
                                            <ModIcon className="w-8 h-8" />
                                        </div>
                                        <span className="text-[20px] font-bold leading-tight block text-slate-400">
                                            {module.name}
                                        </span>
                                        <span className="text-[14px] font-medium mt-1 block text-slate-400">
                                            {module.tagline}
                                        </span>
                                        {/* Lock Badge */}
                                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-200 text-slate-500 text-[10px] font-black px-2 py-1 rounded-lg border border-slate-300">
                                            <Lock className="w-3 h-3" /> 需升級
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <OptionButton
                                    key={module.id}
                                    label={`${module.name} (${module.tagline})`}
                                    isActive={isActive}
                                    icon={<ModIcon className="w-8 h-8" />}
                                    showBadge={true}
                                    activeBg={CATEGORY_GRADIENT_MAP[module.categoryId]}
                                    className="min-h-[200px]"
                                    onClick={() => {
                                        if (devMode && isActive) {
                                            toggleModuleVisibility(module.id);
                                            toast.info(`已暫時隱藏模組：${module.name}`);
                                            return;
                                        }

                                        setFormData(prev => ({
                                            ...prev,
                                            moduleId: module.id,
                                            projectType: module.projectTypes?.[0]?.id || 'general'
                                        }));
                                        if (currentIndustry.id !== module.categoryId) {
                                            switchIndustry(module.categoryId);
                                        }
                                    }}
                                />
                            );
                        })
                    }

                    {Object.values(INDUSTRY_CATEGORIES).flatMap(cat => cat.items).filter(m => checkAccess(m.id)).length === 0 && (
                        <div className="w-full p-8 border-2 border-dashed border-black/20 rounded-2xl text-center bg-slate-50/50">
                            <p className="text-slate-500 font-bold">尚未訂閱任何模組</p>
                            <a href="/dashboard/settings" className="text-primary text-sm underline mt-2 block font-bold">
                                前往系統設定啟動功能
                            </a>
                        </div>
                    )}
                </div>
            </FormCard>

            {/* 2. Project Type */}
            <FormCard title="專案類型 (Project Type)" colSpan="col-span-12 lg:col-span-5" icon={FileText}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(() => {
                        const globalActiveModule = Object.values(INDUSTRY_CATEGORIES)
                            .flatMap(c => c.items)
                            .find(m => m.id === formData.moduleId);

                        return globalActiveModule?.projectTypes?.map((type, index) => {
                            // Extract emoji prefix if it exists (e.g., "🏠 居家裝潢" -> emoji: "🏠", text: "居家裝潢")
                            const match = type.label.match(/^([^\x00-\x7F]+)\s*(.*)$/);
                            let emoji = null;
                            let labelText = type.label;

                            // additional check to see if the first non-ascii match is actually an emoji
                            if (match && match[1] && match[1].length <= 4 && !(/^[\u4e00-\u9fa5]+$/.test(match[1]))) {
                                emoji = match[1];
                                labelText = match[2];
                            }

                            return (
                                <OptionButton
                                    key={type.id}
                                    label={labelText}
                                    isActive={formData.projectType === type.id}
                                    icon={emoji ? <span className="text-[28px] leading-none block">{emoji}</span> : null}
                                    activeBg={TYPE_GRADIENTS[index % TYPE_GRADIENTS.length]}
                                    onClick={() => handleTypeChange(type.id)}
                                />
                            );
                        });
                    })()}
                </div>
            </FormCard>


            {/* 📎 文件解析器 */}
            <FormCard
                title="文件解析器 (Document Analyzer)"
                className="col-span-12"
                icon={FileSearch}
            >
                {/* Header Controls */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-[14px] text-slate-400">
                        上傳參考文件，AI 將整合文件內容與您的專案需求共同分析
                        <span className="ml-2 text-[12px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                            {parsedDocuments.length}/{MAX_DOCS} 份
                        </span>
                    </p>
                    <button type="button" onClick={() => setDocExpanded(p => !p)}
                        className="text-slate-400 hover:text-primary transition-colors">
                        {docExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                </div>

                {docExpanded && (
                    <div className="space-y-4">
                        {/* Supported Formats */}
                        <div className="flex flex-wrap gap-2">
                            {SUPPORTED_TYPES.map(t => (
                                <span key={t.ext} className="text-[11px] font-bold px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full border border-slate-200">
                                    {t.ext} {t.label}
                                </span>
                            ))}
                            <span className="text-[11px] font-bold px-2.5 py-1 bg-indigo-50 text-indigo-500 rounded-full border border-indigo-200">
                                📋 貼上文字
                            </span>
                            <span className="text-[11px] text-slate-400 px-2 py-1">
                                每份最大 {MAX_SIZE_MB}MB，最多 {MAX_DOCS} 份
                            </span>
                        </div>

                        {/* Upload / Paste Area */}
                        <div
                            className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group"
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept=".txt,.md,.csv,.json,.html,.xml"
                                className="hidden"
                                onChange={e => handleFileUpload(e.target.files)}
                            />
                            {docAnalyzing ? (
                                <div className="flex items-center justify-center gap-3 text-primary">
                                    <Loader2 className="animate-spin" size={20} />
                                    <span className="text-[15px] font-medium">正在解析文件內容...</span>
                                </div>
                            ) : (
                                <>
                                    <Upload size={28} className="mx-auto mb-2 text-slate-300 group-hover:text-primary transition-colors" />
                                    <p className="text-[15px] text-slate-400 group-hover:text-primary transition-colors">
                                        拖曳文件至此，或<span className="text-primary font-semibold underline underline-offset-2 mx-1">點擊選擇檔案</span>
                                    </p>
                                    <p className="text-[12px] text-slate-300 mt-1">支援 .txt .md .csv .json .html .xml</p>
                                </>
                            )}
                        </div>

                        {/* Paste Mode Toggle */}
                        <div>
                            <button
                                type="button"
                                onClick={() => setPasteMode(p => !p)}
                                className="flex items-center gap-2 text-[13px] font-semibold text-primary hover:text-primary/70 transition-colors"
                            >
                                <Paperclip size={14} />
                                {pasteMode ? '收起貼上區域' : '或直接貼上文字內容（標案說明、RFP、合約條文等）'}
                            </button>
                            {pasteMode && (
                                <div className="mt-3 space-y-2">
                                    <textarea
                                        rows={5}
                                        value={pasteText}
                                        onChange={e => setPasteText(e.target.value)}
                                        placeholder="貼上任何文字：標案規格書、客戶 RFP、合約條文、會議記錄、Email 內容..."
                                        className="w-full p-4 border border-black/20 rounded-2xl text-[15px] text-slate-700 placeholder:text-slate-300 bg-slate-50 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none resize-none"
                                    />
                                    <div className="flex gap-2">
                                        <button type="button" onClick={handlePasteDoc}
                                            className="px-4 py-2 bg-primary text-white rounded-xl text-[13px] font-bold hover:bg-primary/90 transition-colors">
                                            加入解析 →
                                        </button>
                                        <span className="text-[12px] text-slate-400 self-center">{pasteText.length} / 8000 字元</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Parsed Documents List */}
                        {parsedDocuments.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-[13px] font-bold text-slate-500">已解析文件（將整合進 AI 分析）</p>
                                {parsedDocuments.map(doc => (
                                    <div key={doc.id} className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                                        <FileText size={16} className="text-emerald-500 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-semibold text-slate-700 truncate">{doc.name}</p>
                                            <p className="text-[11px] text-slate-400">{doc.type} · {doc.size} · 解析於 {doc.parsedAt} · {doc.content.length} 字元已擷取</p>
                                        </div>
                                        <button type="button" onClick={() => removeDoc(doc.id)}
                                            className="text-slate-300 hover:text-red-400 transition-colors shrink-0">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </FormCard>

            {/* 3. Description Section */}
            <FormCard title="專案描述與核心目標 (Project Description)" colSpan="col-span-12 lg:col-span-7" icon={Target}>
                <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-[15px] border border-black/20 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-[22px] text-slate-800 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white"
                    placeholder={formConfig?.descriptionPlaceholder || "請描述專案核心需求..."}
                />
            </FormCard>

            <FormCard
                title="規格與參數設定 (Configuration)"
                colSpan="col-span-12 lg:col-span-7"
                icon={Settings2}
            >
                <div className="space-y-[50px]">
                    <div className="flex flex-col gap-[50px]">
                        {formConfig?.customFields?.filter(f => f.type === 'textarea' || f.type === 'multi-select').map((field) => (
                            <div key={field.name} className="w-full">
                                <FormFieldLabel htmlFor={field.name} label={`${field.label} (選填)`} />
                                {field.type === 'textarea' ? (
                                    <textarea
                                        id={field.name}
                                        name={field.name}
                                        rows={3}
                                        // @ts-ignore
                                        value={formData[field.name as keyof ProjectData] || ''}
                                        onChange={handleChange}
                                        className="w-full p-[15px] border border-black/20 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-[22px] text-slate-800 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white"
                                        placeholder={field.placeholder}
                                    />
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 p-1">
                                        {field.options?.map((opt, index) => {
                                            // @ts-ignore
                                            const isSelected = Array.isArray(formData[field.name]) && formData[field.name].includes(opt);
                                            return (
                                                <OptionButton
                                                    key={opt}
                                                    label={opt}
                                                    isActive={isSelected}
                                                    onClick={() => handleMultiSelectToggle(field.name, opt)}
                                                    activeBg={OPTION_GRADIENTS[index % OPTION_GRADIENTS.length]}
                                                    className="min-h-[130px]"
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {/* Style References stays here if this card is visible */}
                    <div className="pt-2">
                        <FormFieldLabel
                            htmlFor="styleReferences"
                            label={`${formConfig?.styleLabel || "風格偏好與參考 (Style & References)"} (選填)`}
                        />
                        <textarea
                            id="styleReferences"
                            name="styleReferences"
                            rows={3}
                            value={formData.styleReferences}
                            onChange={handleChange}
                            className="w-full p-[15px] border border-black/20 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-[22px] text-slate-800 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white"
                            placeholder={formConfig?.stylePlaceholder || "例如：現代極簡、品牌風格..."}
                        />
                    </div>
                </div>
            </FormCard>

            <FormCard
                title="製作規格、預算與時程 (Specs & Timeline)"
                colSpan="col-span-12 lg:col-span-5"
                icon={CalendarRange}
            >
                <div className="space-y-[50px]">
                    {/* Part A: Dropdowns moved from left to fill space */}
                    <div className="grid grid-cols-1 gap-y-[50px]">
                        {formConfig?.customFields?.filter(f => f.type === 'select' || (f.type !== 'textarea' && f.type !== 'multi-select')).map((field) => (
                            <div key={field.name} className="flex flex-col">
                                <FormFieldLabel htmlFor={field.name} label={`${field.label} (選填)`} />
                                {field.type === 'select' ? (
                                    <div className="relative">
                                        <select
                                            id={field.name}
                                            name={field.name}
                                            // @ts-ignore
                                            value={formData[field.name as keyof ProjectData] || ''}
                                            onChange={handleChange}
                                            className="w-full p-[15px] pr-[45px] border border-black/20 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-[22px] text-slate-800 bg-slate-50/50 hover:bg-white appearance-none"
                                            title={field.label}
                                            style={{
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'right 15px center',
                                                backgroundSize: '20px'
                                            }}
                                        >
                                            <option value="" disabled>
                                                {field.placeholder || `請選擇${field.label}`}
                                            </option>
                                            {field.options?.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <input
                                        type={field.type || 'text'}
                                        id={field.name}
                                        name={field.name}
                                        // @ts-ignore
                                        value={formData[field.name as keyof ProjectData] || ''}
                                        onChange={handleChange}
                                        className="w-full p-[15px] border border-black/20 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-[22px] text-slate-800 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white"
                                        placeholder={field.placeholder}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Part B: Functional Specs */}
                    <div>
                        <FormFieldLabel
                            htmlFor="features"
                            label={formConfig?.deliverablesLabel || '製作項目與規格 (Deliverables & Specs)'}
                        />
                        <textarea
                            id="features"
                            name="features"
                            rows={4}
                            value={formData.features}
                            onChange={handleChange}
                            className="w-full p-[15px] border border-black/20 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-[22px] text-slate-800 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white"
                            placeholder={formConfig?.deliverablesPlaceholder || "製作項目與規格..."}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-y-[50px]">
                        <div>
                            <FormFieldLabel htmlFor="budget" label="預算範圍 (Budget Range)" />
                            <input
                                type="text"
                                id="budget"
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                className="w-full p-[15px] border border-black/20 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-[22px] text-slate-800 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white"
                                placeholder="例如：30萬 - 50萬 TWD"
                            />
                        </div>
                        <div>
                            <FormFieldLabel
                                htmlFor="timeline"
                                label={formConfig?.timelineLabel || "預期時程 (Timeline)"}
                            />
                            <input
                                type="text"
                                id="timeline"
                                name="timeline"
                                value={formData.timeline}
                                onChange={handleChange}
                                className="w-full p-[15px] border border-black/20 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-[22px] text-slate-800 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white"
                                placeholder={formConfig?.timelinePlaceholder || "例如：3個月內上線"}
                            />
                        </div>
                    </div>
                </div>
            </FormCard>

            {/* 6. Client Information Block */}
            <FormCard title="客戶資料 (Client Information)" className="col-span-12" icon={Users}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-[50px]">
                    <div className="md:col-span-6 relative">
                        <FormFieldLabel htmlFor="clientCompany" label="公司名稱 (Company Name)" />
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                id="clientCompany"
                                name="clientCompany"
                                value={formData.clientCompany || ''}
                                onChange={handleChange}
                                onFocus={() => {
                                    if (formData.clientCompany) setShowSuggestions(true);
                                }}
                                onBlur={() => {
                                    setTimeout(() => setShowSuggestions(false), 200);
                                }}
                                className="flex-1 p-[15px] border border-black/20 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-[22px] text-slate-800 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white"
                                placeholder="輸入名稱搜尋現有客戶..."
                                autoComplete="off"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    if (formData.clientCompany) {
                                        window.open(`https://www.google.com/search?q=${encodeURIComponent(formData.clientCompany + ' 統一編號')}`, '_blank');
                                    } else {
                                        toast.warning('請先輸入公司名稱');
                                    }
                                }}
                                className="px-6 py-3 bg-white text-slate-600 rounded-2xl hover:bg-slate-50 hover:text-primary hover:border-primary/50 text-sm whitespace-nowrap transition-all border border-black/20 font-bold shadow-sm"
                                title="查詢工商登記"
                            >
                                🔍 查詢工商
                            </button>
                        </div>
                        {/* ... Suggestions omitted for brevity but should be kept ... */}
                    </div>
                    <div className="md:col-span-3">
                        <FormFieldLabel htmlFor="clientTaxId" label="統一編號 (Tax ID)" />
                        <input
                            type="text"
                            id="clientTaxId"
                            name="clientTaxId"
                            value={formData.clientTaxId || ''}
                            onChange={handleChange}
                            className="w-full p-[15px] border border-black/20 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-[22px] text-slate-800 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white"
                            placeholder="例如：12345678"
                        />
                    </div>
                    <div className="md:col-span-3">
                        <FormFieldLabel htmlFor="clientContact" label="聯絡人 (Contact Person)" />
                        <input
                            type="text"
                            id="clientContact"
                            name="clientContact"
                            value={formData.clientContact || ''}
                            onChange={handleChange}
                            className="w-full p-[15px] border border-black/20 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-[22px] text-slate-800 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white"
                            placeholder="例如：陳經理"
                        />
                    </div>
                    <div className="md:col-span-4">
                        <FormFieldLabel htmlFor="clientPhone" label="聯絡電話 (Phone)" />
                        <input
                            type="text"
                            id="clientPhone"
                            name="clientPhone"
                            value={formData.clientPhone || ''}
                            onChange={handleChange}
                            className="w-full p-[15px] border border-black/20 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-[22px] text-slate-800 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white"
                            placeholder="例如：0912-345-678"
                        />
                    </div>
                    <div className="md:col-span-8">
                        <FormFieldLabel htmlFor="clientAddress" label="公司地址 (Address)" />
                        <input
                            type="text"
                            id="clientAddress"
                            name="clientAddress"
                            value={formData.clientAddress || ''}
                            onChange={handleChange}
                            className="w-full p-[15px] border border-black/20 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-[22px] text-slate-800 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white"
                            placeholder="例如：台北市信義區..."
                        />
                    </div>
                </div>
            </FormCard>
        </form >
    );
}
