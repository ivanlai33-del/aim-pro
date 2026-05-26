'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRouter } from 'next/navigation';
import { useProject } from '@/context/ProjectContext';
import { MAGIC_TEST_DATA } from '@/config/magicData';
import { getModuleById, getCategoryByModuleId } from '@/config/industries';
import { ArrowLeft, Sparkles, FileText, Lock, LayoutDashboard } from 'lucide-react';
import InputForm from '@/components/InputForm';
import ReportView from '@/components/ReportView';

// ==========================================
// 預先生成的精美固化報告 (Mock Reports)
// ==========================================
const generateMockReport = (moduleName: string, painPoints: string[]) => `
# 🌟 AGI 專案智能分析報告：${moduleName}

> 本報告由 AGI 辦公室智能助理自動化生成，已針對您的職人領域進行客製化分析。

## 1. 專案風險評估與防禦建議

在執行 ${moduleName} 專案時，最常遇到的隱藏風險包含：
${painPoints.map(p => `- **🚨 潛在風險**：${p}`).join('\n')}

**🛡️ AGI 防禦策略建議**：
建議在合約中明確定義驗收標準與修改次數，並將上述痛點轉化為報價單中的「風險隔離條款」，防止無底洞的修改循環。

## 2. ROI 與定價策略建議

基於市場大數據分析，您的專案具備高度的專業溢價空間。

* 避免使用「工時 (Time & Material)」報價，改採**「階段性里程碑 (Milestone-based)」**報價。
* **建議起步價**：根據您輸入的規格，此專案的合理定價區間落於行情的中高水位。請確保在提案中強調您的隱性溝通成本與技術護城河。

## 3. SLA 服務層級協議建議

1. **回應時間**：定義工作日 24 小時內回覆，週末不處理常規需求。
2. **保固/維護期**：專案上線後提供 30 天無償 Debug 期，新功能需求另行報價。
3. **智財權歸屬**：尾款結清前，所有原始檔/智財權歸屬於您。

---
*💡 這是預覽模式的示範報告。在正式版中，AI 將會根據您輸入的每一項專案需求，即時生成深度且具備防禦力的分析結果。*
`;

export default function PreviewModulePage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { id } = params;
    const { switchIndustry, currentIndustry } = useProject();
    
    const [activeTab, setActiveTab] = useState<'setup' | 'report'>('setup');
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportContent, setReportContent] = useState('');
    
    const mod = getModuleById(id);
    const cat = getCategoryByModuleId(id);
    
    // 初始化獨立的狀態，不干擾全域 ProjectContext 的真實資料
    const [previewData, setPreviewData] = useState<any>(null);

    useEffect(() => {
        if (!mod) {
            router.push('/');
            return;
        }

        // 確保 Industry 正確切換以支援 InputForm
        if (cat && currentIndustry.id !== cat.id) {
            switchIndustry(cat.id);
        }

        // 載入魔法測試資料
        const magicData = MAGIC_TEST_DATA[id] || {};
        
        setPreviewData({
            moduleId: id,
            projectType: mod.projectTypes?.[0]?.id || 'general',
            projectName: `[示範專案] ${mod.name} 需求評估`,
            ...magicData
        });
        
    }, [id, mod, cat, currentIndustry.id, switchIndustry, router]);

    const handleGenerate = () => {
        setIsGenerating(true);
        // 模擬 AI 生成時間，創造 AGI 的儀式感
        setTimeout(() => {
            setIsGenerating(false);
            const painPoints = mod?.painPoints || ['需求範疇模糊', '驗收標準不一致'];
            setReportContent(generateMockReport(mod?.name || '專案', painPoints));
            setActiveTab('report');
        }, 3000);
    };

    if (!mod || !previewData) return <div className="p-8 text-white">Loading Preview...</div>;

    return (
        <div className="flex flex-col h-full min-h-screen bg-background relative overflow-hidden">
            {/* 預覽模式專屬 Banner */}
            <div className="w-full bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white py-3 px-6 flex items-center justify-between z-50 shrink-0 shadow-lg">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <span className="font-black tracking-wide bg-white/20 px-3 py-1 rounded-full text-sm">
                        👀 職人工作區預覽模式 (Preview Mode)
                    </span>
                    <span className="hidden md:inline text-sm font-medium opacity-90">
                        您目前正在預覽「{mod.name}」專屬的工作流
                    </span>
                </div>
                <button 
                    onClick={() => router.push('/login')}
                    className="bg-white text-indigo-600 px-4 py-1.5 rounded-full font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2 shadow-xl"
                >
                    <Lock className="w-4 h-4" /> 註冊解鎖完整功能
                </button>
            </div>

            {/* 主要內容區塊 */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* 假的 Tabs 導覽列 */}
                <div className="w-full bg-surface border-b border-border shadow-sm shrink-0">
                    <div className="max-w-[1450px] mx-auto px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
                        <TabButton 
                            isActive={activeTab === 'setup'} 
                            onClick={() => setActiveTab('setup')} 
                            icon={<LayoutDashboard className="w-4 h-4" />} 
                            label="1. 專案設定" 
                        />
                        <TabButton 
                            isActive={activeTab === 'report'} 
                            onClick={() => setActiveTab('report')} 
                            icon={<FileText className="w-4 h-4" />} 
                            label="2. 分析報告" 
                        />
                        <TabButton isActive={false} onClick={() => router.push('/login')} icon={<Lock className="w-4 h-4" />} label="3. 報價單建置" isLocked />
                        <TabButton isActive={false} onClick={() => router.push('/login')} icon={<Lock className="w-4 h-4" />} label="4. 合約防禦" isLocked />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-[1200px] mx-auto">
                        
                        {activeTab === 'setup' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Action Bar */}
                                <div className="flex justify-between items-center mb-8 bg-surface p-6 rounded-2xl shadow-sm border border-border">
                                    <div>
                                        <h2 className="text-xl font-black text-foreground">自動填入的測試範例</h2>
                                        <p className="text-sm text-muted-foreground mt-1">我們已經為您載入針對此職人最常見的「痛點」與「需求」示範資料。</p>
                                    </div>
                                    <button
                                        onClick={handleGenerate}
                                        disabled={isGenerating}
                                        className="bg-gradient-to-r from-cyan-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/30 hover:brightness-110 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                    >
                                        {isGenerating ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                                        ) : (
                                            <Sparkles className="w-5 h-5" />
                                        )}
                                        {isGenerating ? 'AI 分析中...' : '✨ 自動生成報告'}
                                    </button>
                                </div>

                                {/* Form Readonly Display */}
                                <div className="opacity-90 pointer-events-none filter grayscale-[20%]">
                                    <InputForm 
                                        initialData={previewData} 
                                        onSubmit={() => {}} 
                                        isLoading={false} 
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'report' && (
                            <div className="animate-in fade-in zoom-in-95 duration-500">
                                {reportContent ? (
                                    <div className="bg-surface rounded-2xl border border-border overflow-hidden">
                                        <div className="bg-indigo-50 dark:bg-indigo-900/20 px-8 py-4 border-b border-border flex justify-between items-center">
                                            <h2 className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                                                <Sparkles className="w-5 h-5" /> AGI 分析結果
                                            </h2>
                                        </div>
                                        <div className="p-8 prose dark:prose-invert max-w-none prose-indigo">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {reportContent}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-32 bg-surface rounded-2xl border border-border border-dashed">
                                        <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                        <p className="text-lg font-bold text-muted-foreground">尚未生成報告</p>
                                        <p className="text-sm text-muted-foreground mt-2">請回到「專案設定」分頁，點擊「自動生成報告」。</p>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Generation Overlay */}
            {isGenerating && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="relative p-12 rounded-[3rem] bg-surface dark:bg-slate-900 border border-white/20 shadow-2xl flex flex-col items-center gap-8 max-w-md w-full mx-4 text-center">
                        <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-2xl animate-bounce">
                            <Sparkles className="w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-black text-foreground">AGI 智能店長正在思考...</h3>
                        <p className="text-primary font-bold text-sm animate-pulse">正在為您剖析「{mod.name}」專案潛在風險與防禦策略...</p>
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full w-[60%] animate-[shimmer_2s_infinite_linear] bg-[length:200%_100%]" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function TabButton({ isActive, onClick, icon, label, isLocked }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-transparent text-muted-foreground hover:bg-surface-hover hover:text-foreground border border-transparent'}`}
        >
            {icon} {label}
            {isLocked && <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full ml-1 border border-border">需升級</span>}
        </button>
    );
}
