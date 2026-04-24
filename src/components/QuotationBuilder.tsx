import { useState, useRef, useEffect, useMemo } from 'react';
import { useProject, QuotationItem } from '../context/ProjectContext';
import { Plus, Trash2, Printer, Download, Calculator, FileText, Sparkles, AlertCircle, Palette, Check, Lock } from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { ProjectData } from '@/types/project';
import { cn, generateId } from '@/lib/utils';
import ContractGenerator from './ContractGenerator';
import UpgradeModal from './landing/UpgradeModal';

interface QuotationBuilderProps {
    projectData: ProjectData;
    reportContent?: string;
}

type RiskLevel = 'low' | 'medium' | 'high';
type TaxMode = 'exclusive' | 'inclusive' | 'none';

export default function QuotationBuilder({ projectData, reportContent }: QuotationBuilderProps) {
    const { providerInfo, activeProject, updateProjectQuotation, userTier } = useProject();
    const primaryBank = providerInfo?.bankAccounts?.find(b => b.id === providerInfo.primaryBankId);
    const canDownload = userTier !== 'free';
    const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);

    // Initialize state from context or defaults
    const [items, setItems] = useState<QuotationItem[]>(activeProject?.quotationItems || [
        { id: '1', description: '系統架構設計與規劃', quantity: 1, unitPrice: 30000 },
        { id: '2', description: '前端介面開發 (RWD RESPONSIVE)', quantity: 1, unitPrice: 50000 },
        { id: '3', description: '後端 API 與資料庫建置', quantity: 1, unitPrice: 60000 },
        { id: '4', description: '系統部署與測試', quantity: 1, unitPrice: 20000 },
    ]);
    const [taxMode, setTaxMode] = useState<TaxMode>((activeProject?.quotationSettings?.taxMode as TaxMode) || 'exclusive'); // exclusive = +5%
    const [riskLevel, setRiskLevel] = useState<RiskLevel>((activeProject?.quotationSettings?.riskLevel as RiskLevel) || 'medium');
    const [quoteStyle, setQuoteStyle] = useState<'standard' | 'modern' | 'minimal' | 'classic' | 'creative'>('standard');

    // Import Confirmation State
    const [isConfirmingImport, setIsConfirmingImport] = useState(false);
    const [viewMode, setViewMode] = useState<'quote' | 'contract'>('quote');

    // Sync local state when context changes (e.g. initial load)
    useEffect(() => {
        if (activeProject?.quotationItems) {
            setItems(activeProject.quotationItems);
        }
        if (activeProject?.quotationSettings) {
            setTaxMode(activeProject.quotationSettings.taxMode as TaxMode);
            setRiskLevel(activeProject.quotationSettings.riskLevel as RiskLevel);
        }
    }, [activeProject]);

    // Helper to persist changes
    const saveChanges = (newItems: QuotationItem[], newTax: TaxMode, newRisk: RiskLevel) => {
        if (activeProject) {
            updateProjectQuotation(activeProject.id, newItems, { taxMode: newTax, riskLevel: newRisk });
        }
    };

    const quoteRef = useRef<HTMLDivElement>(null);

    // --- Calculations ---

    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    let taxAmount = 0;
    let total = subtotal;

    if (taxMode === 'exclusive') {
        taxAmount = Math.round(subtotal * 0.05);
        total = subtotal + taxAmount;
    } else if (taxMode === 'inclusive') {
        // Total is subtotal (which includes tax), so tax is included
        // tax = total - (total / 1.05)
        taxAmount = Math.round(subtotal - (subtotal / 1.05));
        total = subtotal;
    } else if (taxMode === 'none') {
        taxAmount = 0;
        total = subtotal;
    }

    // Payment Terms based on Risk
    const getPaymentTerms = (risk: RiskLevel, totalAmount: number) => {
        switch (risk) {
            case 'high':
                return [
                    { label: '第一期：簽約訂金 (75%)', amount: Math.round(totalAmount * 0.75) },
                    { label: '第二期：驗收尾款 (25%)', amount: Math.round(totalAmount * 0.25) }
                ];
            case 'medium':
                return [
                    { label: '第一期：簽約訂金 (50%)', amount: Math.round(totalAmount * 0.5) },
                    { label: '第二期：期中進度款 (30%)', amount: Math.round(totalAmount * 0.3) },
                    { label: '第三期：驗收尾款 (20%)', amount: Math.round(totalAmount * 0.2) }
                ];
            case 'low':
                return [
                    { label: '第一期：簽約訂金 (30%)', amount: Math.round(totalAmount * 0.3) },
                    { label: '第二期：期中進度款 (40%)', amount: Math.round(totalAmount * 0.4) },
                    { label: '第三期：驗收尾款 (30%)', amount: Math.round(totalAmount * 0.3) }
                ];
        }
    };

    const paymentTerms = getPaymentTerms(riskLevel, total);

    // --- Handlers ---

    const handleAddItem = () => {
        const newItems = [...items, { id: generateId(), description: '', quantity: 1, unitPrice: 0 }];
        setItems(newItems);
        saveChanges(newItems, taxMode, riskLevel);
    };

    const handleUpdateItem = (id: string, field: keyof QuotationItem, value: any) => {
        const newItems = items.map(item => item.id === id ? { ...item, [field]: value } : item);
        setItems(newItems);
        saveChanges(newItems, taxMode, riskLevel);
    };

    const handleRemoveItem = (id: string) => {
        const newItems = items.filter(item => item.id !== id);
        setItems(newItems);
        saveChanges(newItems, taxMode, riskLevel);
    };

    const handleSettingChange = (setting: 'tax' | 'risk', value: any) => {
        if (setting === 'tax') {
            setTaxMode(value);
            saveChanges(items, value, riskLevel);
        } else {
            setRiskLevel(value);
            saveChanges(items, taxMode, value);
        }
    };

    // Refactored Smart Import Handler (No Native Alert/Confirm)
    const handleSmartImportClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!reportContent) {
            toast.warning('請先在「分析報告」頁面生成報告，才能使用此功能。');
            return;
        }

        if (!isConfirmingImport) {
            setIsConfirmingImport(true);
            // Auto reset confirmation state after 3 seconds
            setTimeout(() => {
                setIsConfirmingImport(false);
            }, 3000);
        } else {
            // Confirmed, execute
            setIsConfirmingImport(false);
            executeSmartImport();
        }
    };

    const executeSmartImport = () => {
        if (!reportContent) return;

        console.log("Starting Smart Import Execution...");
        try {
            const lines = reportContent.split('\n');
            let importedItems: QuotationItem[] = [];

            // Temporary storage for the "current" table being parsed
            let currentTableHeaders: string[] = [];
            let currentTableItems: QuotationItem[] = [];

            // We'll collect ALL valid tables found, then pick the best one
            // or if we are in "Recommended Section", pick that one immediately.
            let candidateTables: QuotationItem[][] = [];

            let inRecommendedSection = false;
            let inTable = false;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();

                // 1. Section Detection
                if (line.includes('執行報價') || line.includes('Execution Quotation') || line.includes('建議執行報價') || line.includes('Recommended Quotation')) {
                    inRecommendedSection = true;
                    // Reset table state when entering specific section
                    currentTableHeaders = [];
                    currentTableItems = [];
                    inTable = false;
                    continue;
                }

                // Exit section on next header
                if (inRecommendedSection && (line.startsWith('## ') || line.startsWith('### ')) && !line.includes('執行報價') && !line.includes('建議執行報價')) {
                    inRecommendedSection = false;
                    // If we collected items in the recommended section, those are High Priority. 
                    // Push them to candidates and maybe stop if we want strict mode?
                    // Let's keep scanning but mark them.
                }

                // 2. Table Boundary Detection
                if (!line.includes('|')) {
                    if (inTable) {
                        // End of a table block
                        if (currentTableItems.length > 0) {
                            candidateTables.push([...currentTableItems]);
                        }
                        inTable = false;
                        currentTableHeaders = []; // CRITICAL FIX: Reset headers for next table
                        currentTableItems = [];
                    }
                    continue;
                }

                // 3. Inside a Table Row
                inTable = true;
                let cols = line.split('|').map(c => c.trim());
                if (cols[0] === '') cols.shift();
                if (cols[cols.length - 1] === '') cols.pop();

                // Skip separators
                if (cols.some(c => c.includes('---'))) continue;

                // 4. Header vs Body Detection
                // If we don't have headers for THIS table yet, this is the header row
                if (currentTableHeaders.length === 0) {
                    // Basic validation: Is this really a header? (Look for Price/Item keywords)
                    // Or if we are in "RecommendedSection", assume first row is header.
                    const isHeaderLike = cols.some(c => c.match(/(項目|Item|說明|費用|Price|金額|Cost|方案|Plan)/i));

                    if (isHeaderLike || inRecommendedSection) {
                        currentTableHeaders = cols;
                    }
                    continue;
                }

                // 5. Data Parsing
                if (currentTableHeaders.length > 0 && cols.length >= 2) {
                    // Determine indices based on CURRENT headers (Dynamic mapping)
                    let descIndex = currentTableHeaders.findIndex(h => h.match(/(項目|Item|說明|分類|名稱|Service)/i));
                    if (descIndex === -1) descIndex = 0;

                    let priceIndex = currentTableHeaders.findIndex(h => h.match(/(執行報價|總計|小計|Total|Amount|報價)/i));
                    if (priceIndex === -1) {
                        priceIndex = currentTableHeaders.findIndex(h => h.match(/(費用|Price|Cost|金額|TWD|單價)/i));
                    }
                    if (priceIndex === -1) priceIndex = currentTableHeaders.length - 1;

                    // Bounds check
                    const finalDescIndex = Math.min(descIndex, cols.length - 1);
                    const finalPriceIndex = Math.min(priceIndex, cols.length - 1);

                    const rawName = cols[finalDescIndex] || '';
                    const rawValue = cols[finalPriceIndex] || '';

                    // Filter out likely non-data rows
                    if (rawName.match(/(總計|Total|費用|備註|Note)/i)) continue;
                    if (rawName.includes('---')) continue;

                    // Parse Price
                    let price = 0;
                    const cleanValue = rawValue.replace(/,/g, '').replace(/\$/g, '').replace(/TWD/g, '').replace(/NT/g, '').trim();

                    // IMPROVED: Check for digits first. If digits exist, it's likely a price (even with hyphens like $1k-2k)
                    const hasDigits = /\d/.test(cleanValue);

                    if (hasDigits) {
                        const priceMatch = cleanValue.match(/(\d+)/);
                        if (priceMatch) {
                            price = parseInt(priceMatch[0]);
                        }
                    } else if (cleanValue.match(/(免費|贈送|內含|Included|Free|N\/A|-)/i)) {
                        price = 0;
                    }

                    // Clean Description
                    let description = rawName.replace(/\*\*/g, '').replace(/<br>/g, ' ').replace(/^\d+\.\s*/, '').trim();

                    // IMPROVED: Filter out spacer rows or invalid names
                    if (description === '---' || description === '...') continue;

                    // Matrix Handling: Append parsed value if it contains extra info not just price?
                    // Simplified: Just take the description.

                    // CRITICAL FIX: Add item even if price is 0 (for "Included" items)
                    currentTableItems.push({
                        id: generateId(),
                        description: description,
                        quantity: 1,
                        unitPrice: price
                    });
                }
            }

            // End of loop, check if any lingering table
            if (currentTableItems.length > 0) {
                candidateTables.push([...currentTableItems]);
            }

            // 6. Selection Logic
            // If we found a Recommended Quotation table, use the Last one (most likely final summary)? 
            // Or the one with the most items?
            // The user complained about "Confusion" with multiple reports.
            // Heuristic: Pick the table with the most items that has "Price" column?
            // OR checks project type?

            // For now, if we found ANY table in "Recommended Section", prioritize that.
            // Since we stored them in candidateTables, we need to know WHICH one was in the section.
            // Let's refine: The loop breaks tables. `candidateTables` is just a list.

            // Let's try a simple approach: The "Last" meaningful table is usually the detailed quote.
            // Filter candidates to those with > 1 items.
            const validCandidates = candidateTables.filter(t => t.length > 0);

            if (validCandidates.length > 0) {
                // Default: Pick the longest table, assuming it's the full quotation
                const bestTable = validCandidates.reduce((prev, current) => (prev.length > current.length) ? prev : current);

                importedItems = bestTable;
                setItems(importedItems);
                saveChanges(importedItems, taxMode, riskLevel);
                toast.success(`✅ 成功匯入 ${importedItems.length} 個項目！`);
            } else {
                toast.error('找不到合適的報價內容，請確認報告格式。');
            }

        } catch (e) {
            console.error(e);
            toast.error('匯入失敗，請稍後再試。');
        }
    };

    const handleDownloadPDF = () => {
        if (!canDownload) {
            setShowUpgradeModal(true);
            return;
        }
        window.print();
    };

    if (viewMode === 'contract') {
        return (
            <div className="h-full flex flex-col">
                <ContractGenerator
                    quotationItems={items}
                    totalAmount={total}
                    projectName={projectData.projectName || '未命名專案'}
                    clientName={projectData.clientCompany || projectData.clientContact}
                    providerInfo={providerInfo}
                    projectTypeId={projectData.projectType}
                    onBack={() => setViewMode('quote')}
                />
            </div>
        );
    }

    return (
        <>
        <div className="space-y-6 h-full flex flex-col">
            {/* Toolbar */}
            <div className="p-6 pb-0 flex flex-wrap gap-6 items-end justify-between shrink-0 relative print:hidden -mt-[50px]">
                <div className="flex items-end space-x-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="tax-mode" className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">稅務設定</label>
                        <select
                            id="tax-mode"
                            value={taxMode}
                            onChange={(e) => handleSettingChange('tax', e.target.value as TaxMode)}
                            className="bg-white border border-black/20 text-slate-900 text-base font-black rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all h-12 min-w-[180px] cursor-pointer"
                            title="稅務設定"
                        >
                            <option value="exclusive">未稅 (外加 5%)</option>
                            <option value="inclusive">含稅 (內含)</option>
                            <option value="none">零稅率 / 不計稅</option>
                        </select>
                    </div>

                    <div className="h-12 w-0.5 bg-slate-200 self-end mb-1" />

                    <div className="flex flex-col gap-2">
                        <label htmlFor="risk-level" className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">風險係數 / 訂金交付</label>
                        <select
                            id="risk-level"
                            value={riskLevel}
                            onChange={(e) => handleSettingChange('risk', e.target.value as RiskLevel)}
                            className="bg-white border border-black/20 text-slate-900 text-base font-black rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all h-12 min-w-[200px] cursor-pointer"
                            title="風險係數設定"
                        >
                            <option value="high">高風險 (訂金 75%)</option>
                            <option value="medium">一般 (訂金 50%)</option>
                            <option value="low">長期客戶 (訂金 30%)</option>
                        </select>
                    </div>

                    <div className="h-12 w-0.5 bg-slate-200 self-end mb-1" />

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">報價單樣式</label>
                        <div className="flex items-center bg-white border border-black/20 rounded-xl px-3 h-12">
                            <Palette className="w-[18px] h-[18px] text-indigo-500 mr-2" />
                            <select
                                value={quoteStyle}
                                onChange={(e) => setQuoteStyle(e.target.value as any)}
                                className="bg-transparent text-base font-black text-slate-700 focus:outline-none py-2 cursor-pointer outline-none min-w-[180px]"
                                title="選擇報價單樣式"
                            >
                                <option value="standard">標準商務 (Standard)</option>
                                <option value="modern">現代簡約 (Modern)</option>
                                <option value="minimal">極簡低調 (Minimal)</option>
                                <option value="classic">經典嚴謹 (Classic)</option>
                                <option value="creative">創意活潑 (Creative)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 -mt-5">
                    <button
                        type="button"
                        onClick={() => setViewMode('contract')}
                        className="flex items-center px-6 py-3 bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-2xl hover:brightness-110 transition-all font-black text-sm shadow-xl shadow-indigo-200 active:scale-95 h-[68px] scale-110 origin-right"
                        title="生成正式合約書"
                    >
                        <FileText className="w-5 h-5 mr-2" />
                        生成合約
                    </button>
                    <button
                        type="button"
                        onClick={handleDownloadPDF}
                        className={cn(
                            "flex items-center px-6 py-3 rounded-2xl transition-all font-black text-sm shadow-xl active:scale-95 h-[68px] scale-110 origin-right",
                            canDownload
                                ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white hover:brightness-110 shadow-blue-200"
                                : "bg-slate-200 text-slate-400 shadow-slate-200 cursor-not-allowed"
                        )}
                        title="下載報價單 PDF"
                    >
                        {canDownload ? <Download className="w-5 h-5 mr-2" /> : <Lock className="w-5 h-5 mr-2" />}
                        {canDownload ? '下載 PDF' : '付費下載'}
                    </button>

                    <button
                        type="button"
                        onClick={handleSmartImportClick}
                        className={cn(
                            "flex items-center px-6 py-3 border-2 rounded-2xl transition-all font-black text-sm shadow-xl min-w-[160px] justify-center active:scale-95 h-[68px] scale-110 origin-right",
                            isConfirmingImport
                                ? "bg-gradient-to-br from-rose-400 to-red-600 border-transparent text-white shadow-rose-200 animate-pulse"
                                : "bg-gradient-to-br from-sky-400 to-blue-500 border-transparent text-white shadow-sky-200 hover:brightness-110"
                        )}
                        title="從分析報告自動匯入報價項目"
                    >
                        {isConfirmingImport ? (
                            <>
                                <AlertCircle className="w-5 h-5 mr-2" />
                                確定覆寫？
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5 mr-2" />
                                報價整合
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Preview / Editor Area */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-100 via-sky-100 to-emerald-100 p-4 md:p-12 rounded-xl shadow-inner relative print:p-0 print:m-0 print:bg-white print:border-none print:shadow-none print:overflow-visible print:w-full print:max-w-none -mt-[50px]">
                <div
                    ref={quoteRef}
                    className={cn(
                        "bg-white inside-shadow-2xl mx-auto transition-all duration-300 print:shadow-none print:m-0 print:border-none print:w-full print:max-w-none shadow-2xl shadow-black/20 watermark-container",
                        quoteStyle === 'standard' && "max-w-4xl min-h-[50vh] p-12 text-slate-800 font-serif print:px-8 print:py-8", // Added print padding for content safety
                        quoteStyle === 'modern' && "max-w-[850px] p-16 font-sans border-t-[12px] border-black/20 rounded-none bg-white print:px-8 print:py-8 print:border-t-0",
                        quoteStyle === 'minimal' && "max-w-[780px] p-16 font-sans border-none shadow-none print:px-8 print:py-8",
                        quoteStyle === 'classic' && "max-w-[820px] p-12 font-serif border border-black/20 shadow-sm print:px-8 print:py-8 print:border-none",
                        quoteStyle === 'creative' && "max-w-4xl p-16 rounded-[2.5rem] font-sans bg-gradient-to-br from-white to-slate-50/50 shadow-xl overflow-hidden border border-black/20 print:px-8 print:py-8 print:rounded-none print:shadow-none"
                    )}
                >
                    {/* Watermark Overlay for Free users */}
                    {userTier === 'free' && (
                        <div className="watermark-overlay">
                            {Array.from({ length: 15 }).map((_, i) => (
                                <div key={i} className="watermark-text">捷報 Estimator - 試用版</div>
                            ))}
                        </div>
                    )}

                    {/* --- DISTINCT LAYOUTS BASED ON STYLE --- */}

                    {/* 1. Header Section */}
                    {quoteStyle === 'modern' ? (
                        <div className="flex justify-between items-end mb-16 pb-8 border-b border-black/20">
                            <div>
                                <h1 className="text-5xl font-black tracking-tighter text-slate-800 mb-2">QUOTATION</h1>
                                <div className="h-1.5 w-16 bg-slate-200 mb-6"></div>
                                <div className="text-slate-500 text-sm font-medium space-y-1">
                                    <p className="font-bold text-slate-800 text-lg">{providerInfo.name || 'Provider Name'}</p>
                                    <p>{providerInfo.contact} | {providerInfo.phone}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">DATE</p>
                                <p className="text-xl font-bold font-sans text-slate-700">{new Date().toLocaleDateString('en-CA')}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4 mb-1">VALID UNTIL</p>
                                <p className="text-sm font-medium text-slate-600">{new Date(Date.now() + 15 * 86400000).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ) : quoteStyle === 'creative' ? (
                        <div className="flex justify-between items-center mb-16 bg-slate-50/50 p-10 rounded-3xl border border-black/20 relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">PROJECT ESTIMATE</p>
                                <h1 className="text-4xl font-black tracking-tight text-slate-800">報 價 單</h1>
                            </div>
                            <div className="relative z-10 text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ISSUED DATE</p>
                                <p className="text-xl font-bold font-sans text-slate-700">{new Date().toLocaleDateString('zh-TW')}</p>
                            </div>
                            {/* Subtle Decorative Circle */}
                            <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none"></div>
                        </div>
                    ) : (
                        // Standard / Minimal / Classic Header
                        <div className={cn(
                            "flex justify-between items-start mb-12",
                            quoteStyle === 'classic' && "border-b border-black/20 pb-6 text-center block",
                            quoteStyle === 'minimal' && "mb-20 flex-col gap-2",
                        )}>
                            <div className={cn(quoteStyle === 'classic' && "w-full text-center")}>
                                <h1 className={cn(
                                    "text-4xl font-black tracking-tighter text-slate-800 m-0 leading-none",
                                    quoteStyle === 'classic' && "text-4xl font-serif tracking-widest mb-2 font-normal text-slate-700",
                                    quoteStyle === 'minimal' && "text-3xl tracking-tight font-light text-slate-900"
                                )}>
                                    {quoteStyle === 'minimal' ? 'Project Quotation.' : '報 價 單'}
                                </h1>
                                {quoteStyle !== 'minimal' && <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">QUOTATION</p>}
                            </div>
                            <div className={cn("text-right", quoteStyle === 'classic' && "hidden", quoteStyle === 'minimal' && "text-left mt-4")}>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-end">
                                    Date: {new Date().toLocaleDateString('en-CA')}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 2. Info Section Layouts */}
                    {quoteStyle === 'modern' ? (
                        <div className="grid grid-cols-12 gap-12 mb-20">
                            <div className="col-span-7">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mr-2"></span>
                                    BILL TO (客戶)
                                </h3>
                                <div className="space-y-1">
                                    <p className="font-black text-slate-900 text-xl mb-2">{projectData.clientCompany || '客戶公司名稱'}</p>
                                    <p className="text-sm text-slate-600 font-medium">Attn: {projectData.clientContact || '-'}</p>
                                    <p className="text-sm text-slate-500">{projectData.clientAddress || '-'}</p>
                                    <p className="text-xs text-slate-400 mt-1">Tax ID: {projectData.clientTaxId || '-'}</p>
                                </div>
                            </div>
                            <div className="col-span-5 border-l border-black/20 pl-8 flex flex-col justify-center">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">ESTIMATED TOTAL</p>
                                <p className="text-5xl font-black font-sans tracking-tight text-slate-800">
                                    <span className="text-2xl align-top mr-1 font-bold text-slate-400">$</span>
                                    {(total).toLocaleString()}
                                </p>
                                <p className="text-xs text-slate-400 mt-2 font-medium">currency: NTD (含稅)</p>
                            </div>
                        </div>
                    ) : quoteStyle === 'creative' ? (
                        <div className="flex gap-12 mb-16 px-6">
                            <div className="flex-1 space-y-3">
                                <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest bg-indigo-50/50 px-2 py-1 rounded inline-block">PREPARED FOR</p>
                                <h2 className="text-2xl font-black text-slate-800">{projectData.clientCompany || 'Client Name'}</h2>
                                <p className="text-sm font-bold text-slate-500">{projectData.clientContact}</p>
                                <p className="text-xs text-slate-400 font-medium">{projectData.clientAddress}</p>
                            </div>
                            <div className="flex-1 space-y-3 text-right">
                                <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest bg-indigo-50/50 px-2 py-1 rounded inline-block">App.PROVIDER</p>
                                <h2 className="text-xl font-black text-slate-700">{providerInfo.name}</h2>
                                <p className="text-sm font-medium text-slate-500">{providerInfo.contact} | {providerInfo.phone}</p>
                                {/* <p className="text-xs text-slate-400">{providerInfo.email}</p> */}
                            </div>
                        </div>
                    ) : (
                        // Standard / Minimal / Classic Info
                        <div className={cn(
                            "flex justify-between mb-20 gap-16", // Increased gap
                            quoteStyle === 'classic' && "bg-slate-50/30 p-8 border-y border-black/20 mb-16",
                            quoteStyle === 'minimal' && "mb-24 flex-col gap-8 items-start"
                        )}>
                            <div className="flex-1">
                                <h3 className={cn(
                                    "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4",
                                    quoteStyle === 'classic' && "text-slate-600 border-b border-black/20 pb-1"
                                )}>CLIENT</h3>
                                <div className="space-y-1">
                                    <p className="font-black text-slate-800 text-lg">{projectData.clientCompany || 'Client Name'}</p>
                                    <p className="text-sm text-slate-600">{projectData.clientContact}</p>
                                    <p className="text-sm text-slate-500 font-light">{projectData.clientAddress}</p>
                                </div>
                            </div>
                            <div className={cn("flex-1", quoteStyle !== 'minimal' && "text-right")}>
                                <h3 className={cn(
                                    "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4",
                                    quoteStyle === 'classic' && "text-slate-600 border-b border-black/20 pb-1"
                                )}>PROVIDER</h3>
                                <div className="space-y-1">
                                    <p className="font-black text-slate-800 text-lg">{providerInfo.name}</p>
                                    <p className="text-sm text-slate-600">{providerInfo.contact}</p>
                                    <p className="text-sm text-slate-500 font-sans tracking-wide">{providerInfo.taxId}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. Table Section */}
                    <table className={cn(
                        "w-full mb-16",
                        quoteStyle === 'classic' && "border-y border-black/20",
                        quoteStyle === 'modern' && "border-separate border-spacing-0",
                        quoteStyle === 'creative' && "border-separate border-spacing-y-2"
                    )}>
                        <thead>
                            <tr className={cn(
                                "border-b",
                                quoteStyle === 'standard' && "border-black/20",
                                quoteStyle === 'modern' && "bg-slate-50 text-slate-600",
                                quoteStyle === 'minimal' && "border-b border-black/20",
                                quoteStyle === 'classic' && "bg-slate-50 border-black/20 text-slate-700",
                                quoteStyle === 'creative' && "text-indigo-900/70"
                            )}>
                                <th className="text-left py-4 font-bold w-[45%] text-[10px] uppercase tracking-widest pl-4 text-slate-500">Item Description</th>
                                <th className="text-center py-4 font-bold w-[15%] text-[10px] uppercase tracking-widest text-slate-500">Qty</th>
                                <th className="text-right py-4 font-bold w-[20%] text-[10px] uppercase tracking-widest text-slate-500">Unit Price</th>
                                <th className="text-right py-4 font-bold w-[20%] text-[10px] uppercase tracking-widest pr-4 text-slate-500">Total</th>
                                <th className="w-[40px] print:hidden"></th>
                            </tr>
                        </thead>
                        <tbody className={cn(
                            quoteStyle === 'standard' && "divide-y divide-black/30",
                            quoteStyle === 'minimal' && "divide-y divide-slate-50",
                            quoteStyle === 'classic' && "divide-y divide-black/30",
                        )}>
                            {items.map((item, idx) => (
                                <tr key={item.id} className={cn(
                                    "group transition-colors",
                                    quoteStyle === 'modern' && idx % 2 === 0 ? "bg-slate-50/50" : "bg-white",
                                    quoteStyle === 'creative' && "bg-white shadow-sm rounded-xl mb-2 border border-slate-50 hover:border-indigo-100",
                                    quoteStyle === 'standard' && "hover:bg-slate-50"
                                )}>
                                    {/* ... Table Content kept similar but styled by row class ... */}
                                    <td className={cn("py-4 pl-4", quoteStyle === 'creative' && "rounded-l-xl")}>
                                        <textarea
                                            id={`item-description-${item.id}`}
                                            value={item.description}
                                            onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                                            className="w-full bg-transparent border-none focus:ring-0 p-0 font-bold text-slate-700 resize-none text-sm leading-snug placeholder-slate-300"
                                            rows={item.description.length > 50 ? 2 : 1}
                                            placeholder="Item Description"
                                        />
                                    </td>
                                    <td className="py-4 text-center">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                            className="w-12 text-center bg-transparent font-medium text-slate-600 text-sm"
                                            title="數量"
                                        />
                                    </td>
                                    <td className="py-4 text-right">
                                        <input
                                            type="number"
                                            value={item.unitPrice}
                                            onChange={(e) => handleUpdateItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                                            className="w-24 text-right bg-transparent font-medium text-slate-600 text-sm"
                                            title="單價"
                                        />
                                    </td>
                                    <td className={cn(
                                        "py-4 pr-4 text-right font-bold text-slate-800 text-sm font-sans tabular-nums",
                                        quoteStyle === 'creative' && "rounded-r-xl"
                                    )}>
                                        ${(item.quantity * item.unitPrice).toLocaleString()}
                                    </td>
                                    <td className="print:hidden pl-2">
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="text-slate-300 hover:text-red-500 transition-colors print:hidden"
                                            title="刪除此項目"
                                            aria-label="刪除此項目"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {/* Restored Quick Add Row */}
                            <tr className="print:hidden">
                                <td colSpan={5} className="py-2">
                                    <button
                                        type="button"
                                        onClick={handleAddItem}
                                        className="w-full flex items-center justify-center py-3 border-2 border-dashed border-black/20 rounded-xl text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all font-bold text-sm shadow-sm active:scale-[0.99]"
                                        title="新增報價項目"
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        <span>新增報價項目 (ADD LINE ITEM)</span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* 4. Totals Section - Moved logic for distinct layouts */}
                    <div className="flex justify-end mb-16">
                        <div className={cn(
                            "w-full max-w-xs space-y-3",
                            quoteStyle === 'standard' && "bg-slate-50/50 p-6 rounded-2xl border border-black/20",
                            // Modern: Total is already in header, so maybe just show tax/subtotal here minimally?
                            quoteStyle === 'modern' && "p-0",
                            quoteStyle === 'minimal' && "p-6",
                            quoteStyle === 'classic' && "p-6 border border-black/20 bg-slate-50/30",
                            quoteStyle === 'creative' && "p-8 bg-slate-50/50 rounded-3xl border border-black/20"
                        )}>
                            {/* ... Totals ... */}
                            <div className="flex justify-between text-slate-500 font-medium text-sm">
                                <span>Subtotal</span>
                                <span className="font-sans tabular-nums text-slate-700">${subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-slate-500 font-medium text-sm">
                                <span>Tax (5%)</span>
                                <span className="font-sans tabular-nums text-slate-700">${taxAmount.toLocaleString()}</span>
                            </div>
                            <div className={cn(
                                "pt-4 mt-2 flex justify-between items-baseline",
                                quoteStyle === 'standard' && "border-t border-black/20",
                                quoteStyle === 'modern' && "border-t border-black/20",
                                quoteStyle === 'classic' && "border-t border-black/20",
                                quoteStyle === 'creative' && "border-t border-black/20"
                            )}>
                                <span className="text-slate-800 font-bold text-sm">Total</span>
                                <span className="font-sans tabular-nums font-black text-2xl text-slate-800">NT$ {total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Terms */}
                    <div className={cn(
                        "p-8 rounded-2xl mb-12 relative overflow-hidden border",
                        quoteStyle === 'standard' && "bg-slate-50/50 border-black/20",
                        quoteStyle === 'modern' && "bg-white border-black/20 shadow-sm",
                        quoteStyle === 'minimal' && "bg-transparent border-black/20",
                        quoteStyle === 'classic' && "bg-white border-black/20 rounded-none",
                        quoteStyle === 'creative' && "bg-slate-50 border-black/20 rounded-[2rem]"
                    )}>
                        <h4 className={cn(
                            "font-bold text-sm mb-6 flex items-center border-b pb-3 uppercase tracking-wider",
                            "text-slate-600 border-black/20"
                        )}>
                            <Calculator className="w-4 h-4 mr-2" />
                            PAYMENT TERMS
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {paymentTerms.map((term, index) => (
                                <div key={index} className={cn(
                                    "p-4 border transition-all",
                                    quoteStyle === 'standard' && "bg-white rounded-xl border-black/20",
                                    quoteStyle === 'modern' && "bg-slate-50 border-none",
                                    quoteStyle === 'minimal' && "bg-transparent border-black/20",
                                    quoteStyle === 'classic' && "bg-white border-black/20 rounded-none",
                                    quoteStyle === 'creative' && "bg-white border-black/20 rounded-2xl"
                                )}>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1 leading-none tracking-widest">{term.label.split('：')[0]}</p>
                                    <p className="font-black text-lg leading-none font-sans tabular-nums text-slate-800">NT$ {term.amount.toLocaleString()}</p>
                                    <p className="text-[10px] mt-2 font-medium text-slate-400">{term.label.split('：')[1] || '簽署後支付'}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-6 border-t border-black/20">
                            <div className="flex items-start gap-4">
                                <div className="bg-slate-100 p-2 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-slate-400" />
                                </div>
                                <div className="text-xs font-medium text-slate-500 leading-relaxed">
                                    <p>報價單有效期限為簽發日起 15 個日曆天。</p>
                                    <p>確認合作後請回簽此報價單並支付第一期訂金以啟動專案。</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bank Details Section - Only Primary/Default */}
                    {primaryBank && (
                        <div className={cn(
                            "mb-12 rounded-2xl border transition-all print:break-inside-avoid",
                            quoteStyle === 'standard' && "bg-slate-50/50 border-black/20 p-8",
                            quoteStyle === 'modern' && "bg-slate-50 border-none p-8",
                            quoteStyle === 'minimal' && "bg-transparent border-t border-black/20 rounded-none p-0 pt-8",
                            quoteStyle === 'classic' && "bg-white border-x border-b border-black/20 rounded-none p-8",
                            quoteStyle === 'creative' && "bg-indigo-50/30 border-indigo-50 rounded-[2rem] p-8"
                        )}>
                            <h4 className={cn(
                                "font-bold text-sm mb-6 flex items-center border-b pb-3 uppercase tracking-wider",
                                "text-slate-600 border-black/20"
                            )}>
                                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-slate-200 rounded-full text-[10px] text-slate-500">
                                    $
                                </span>
                                BANK DETAILS (匯款資料)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5 text-sm text-slate-600">
                                    <div className="flex items-baseline">
                                        <span className="font-bold w-24 text-slate-400 text-[10px] uppercase tracking-wider shrink-0">Bank</span>
                                        <span className="font-bold text-slate-800">{primaryBank.bankName}</span>
                                    </div>
                                    {primaryBank.branch && (
                                        <div className="flex items-baseline">
                                            <span className="font-bold w-24 text-slate-400 text-[10px] uppercase tracking-wider shrink-0">Branch</span>
                                            <span>{primaryBank.branch}</span>
                                        </div>
                                    )}
                                    <div className="flex items-baseline">
                                        <span className="font-bold w-24 text-slate-400 text-[10px] uppercase tracking-wider shrink-0">A/C Name</span>
                                        <span>{primaryBank.accountName}</span>
                                    </div>
                                    <div className="flex items-baseline">
                                        <span className="font-bold w-24 text-slate-400 text-[10px] uppercase tracking-wider shrink-0">A/C No.</span>
                                        <span className="font-mono font-bold text-slate-800 tracking-wide">{primaryBank.accountNumber}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Signatures */}
                    <div className={cn(
                        "flex justify-between mt-16 pt-8 border-t",
                        "border-black/30"
                    )}>
                        <div className="w-1/3 text-center">
                            <p className="mb-12 font-bold text-slate-800 text-sm">Client Signature (客戶簽章)</p>
                            <div className="border-b w-full border-black/30"></div>
                            <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest">Date</p>
                        </div>
                        <div className="w-1/3 text-center">
                            <p className="mb-12 font-bold text-slate-800 text-sm">Provider Signature (廠商簽章)</p>
                            <div className="border-b w-full border-black/30"></div>
                            <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest">Date</p>
                        </div>
                    </div>

                    <div className="mt-12 text-center text-slate-300 text-[9px] font-medium uppercase tracking-[0.2em]">
                        <p>Document Generated by AI Project Estimator</p>
                    </div>
                </div> {/* end quoteRef div */}
            </div> {/* end flex-1 overflow-y-auto wrapper */}
        </div> {/* end space-y-6 */}

        <UpgradeModal
            isOpen={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
            planName="Starter 個人啟航版"
            tierId="starter"
        />
        </>
    );
}
