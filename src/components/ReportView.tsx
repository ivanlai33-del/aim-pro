import { useRef, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, FileText, Edit, Save, X, Sparkles, Loader2, MessageSquarePlus, Lock, Languages, Globe } from 'lucide-react';
import { refineReport, translateDocument, partialRefine } from '../lib/aiService';
import Turnstile from './Turnstile';
import { useProject } from '../context/ProjectContext';
import { toast } from 'sonner';
import UpgradeModal from './landing/UpgradeModal';
import mermaid from 'mermaid';

// Initialize mermaid
if (typeof window !== 'undefined') {
    mermaid.initialize({
        startOnLoad: true,
        theme: 'neutral',
        securityLevel: 'loose',
        fontFamily: 'inherit',
    });
}

interface ReportViewProps {
    reportContent: string;
    onSave: (content: string) => void;
    apiKey?: string;
}

// Mermaid component for dynamic rendering
const MermaidDiagram = ({ chart }: { chart: string }) => {
    const [svg, setSvg] = useState<string>('');
    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

    useEffect(() => {
        const renderChart = async () => {
            try {
                const { svg } = await mermaid.render(id, chart);
                setSvg(svg);
            } catch (error) {
                console.error('Mermaid render error:', error);
            }
        };
        renderChart();
    }, [chart, id]);

    return (
        <div 
            className="mermaid-container my-8 flex justify-center bg-white p-6 rounded-2xl border border-border shadow-sm overflow-x-auto" 
            dangerouslySetInnerHTML={{ __html: svg }} 
        />
    );
};

export default function ReportView({ reportContent, onSave, apiKey }: ReportViewProps) {
    const { userTier, aiQuota } = useProject();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const canDownload = userTier !== 'free';
    const reportRef = useRef<HTMLDivElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(reportContent);
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [isRefining, setIsRefining] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [selectedText, setSelectedText] = useState('');
    const [selectionRange, setSelectionRange] = useState({ start: 0, end: 0 });
    const [partialInstruction, setPartialInstruction] = useState('');
    const [isPartiallyRefining, setIsPartiallyRefining] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleTextSelection = () => {
        if (textareaRef.current) {
            const start = textareaRef.current.selectionStart;
            const end = textareaRef.current.selectionEnd;
            const text = textareaRef.current.value.substring(start, end);
            
            if (text.trim()) {
                setSelectedText(text);
                setSelectionRange({ start, end });
            }
        }
    };

    useEffect(() => {
        setEditedContent(reportContent);
    }, [reportContent]);

    const handleSave = () => {
        onSave(editedContent);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedContent(reportContent);
        setAdditionalNotes('');
        setIsEditing(false);
    };

    const handleAIRefine = async () => {
        setIsRefining(true);
        try {
            const response = await refineReport(editedContent, additionalNotes, apiKey, turnstileToken || undefined);
            if (response.error) {
                toast.error(`優化失敗：${response.error}`);
            } else {
                setEditedContent(response.content);
                setAdditionalNotes(''); // Clear notes after successful integration
                toast.success('AI 已優化報告邏輯並校正數據計算。');
            }
        } catch (error) {
            console.error(error);
            toast.error('AI 潤飾過程發生錯誤。');
        } finally {
            setIsRefining(false);
        }
    };

    const handlePartialRefine = async () => {
        if (!selectedText || !partialInstruction) return;
        
        setIsPartiallyRefining(true);
        try {
            const response = await partialRefine(selectedText, partialInstruction, apiKey, turnstileToken || undefined);
            if (response.error) {
                toast.error(`局部修改失敗：${response.error}`);
            } else {
                // Surgical replacement in the full content
                const before = editedContent.substring(0, selectionRange.start);
                const after = editedContent.substring(selectionRange.end);
                const newContent = before + response.content + after;
                
                setEditedContent(newContent);
                setSelectedText('');
                setPartialInstruction('');
                toast.success('局部內容已成功更新！');
            }
        } catch (error) {
            console.error(error);
            toast.error('局部修改過程發生錯誤。');
        } finally {
            setIsPartiallyRefining(false);
        }
    };

    const handleTranslate = async (lang: 'English' | 'Japanese' | 'Traditional Chinese') => {
        // 🔒 Paywall Check: Translation is a Pro feature
        if (userTier === 'free') {
            setShowUpgradeModal(true);
            return;
        }

        setIsTranslating(true);
        setShowLangMenu(false);
        try {
            const response = await translateDocument(
                editedContent, 
                lang, 
                `這是為 ${userTier} 等級用戶進行的專業商務語譯。`, 
                apiKey, 
                turnstileToken || undefined
            );
            if (response.error) {
                toast.error(`翻譯失敗：${response.error}`);
            } else {
                setEditedContent(response.content);
                onSave(response.content); // Automatically save translated content
                toast.success(`成功轉換為專業 ${lang === 'English' ? '英文' : lang === 'Japanese' ? '日文' : '繁體中文'} 版本！`);
            }
        } catch (error) {
            console.error(error);
            toast.error('翻譯過程發生錯誤。');
        } finally {
            setIsTranslating(false);
        }
    };

    const handleDownloadPDF = async () => {
        // 🔒 Paywall: Free users cannot download
        if (!canDownload) {
            setShowUpgradeModal(true);
            return;
        }

        if (!reportRef.current) return;

        try {
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('project-proposal.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('PDF 生成失敗，請稍後再試。');
        }
    };

    return (
        <>
        <div className="space-y-6 min-h-full flex flex-col">
            <div className="flex justify-between items-center bg-surface p-4 rounded-lg shadow-sm border border-border">
                <h3 className="text-lg font-black text-foreground flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-primary" />
                    專案分析報告
                </h3>
                <div className="flex space-x-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleCancel}
                                className="flex items-center px-3 py-1.5 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors text-sm font-medium"
                            >
                                <X className="w-4 h-4 mr-1.5" />
                                取消
                            </button>
                            <button
                                onClick={handleAIRefine}
                                disabled={isRefining}
                                className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all text-sm font-bold shadow-lg shadow-primary/10 active:scale-95 disabled:opacity-50"
                            >
                                {isRefining ? (
                                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                                ) : (
                                    <Sparkles className="w-4 h-4 mr-1.5" />
                                )}
                                AI 再潤飾
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center px-4 py-2 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition-all text-sm font-bold shadow-lg shadow-emerald-50 active:scale-95"
                            >
                                <Save className="w-4 h-4 mr-1.5" />
                                儲存修改
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center px-3 py-1.5 bg-surface border border-border text-foreground rounded-md hover:bg-muted transition-colors text-sm font-medium"
                            >
                                <Edit className="w-4 h-4 mr-1.5" />
                                編輯內容
                            </button>
                            {/* Internationalization Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowLangMenu(!showLangMenu)}
                                    disabled={isTranslating}
                                    className="flex items-center px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors text-sm font-bold"
                                >
                                    {isTranslating ? (
                                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                                    ) : (
                                        <Globe className="w-4 h-4 mr-1.5" />
                                    )}
                                    一鍵國際化
                                </button>

                                {showLangMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-border z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                                        <div className="p-2 border-b border-border bg-slate-50">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">選擇目標語言 (專業轉譯)</p>
                                        </div>
                                        <button 
                                            onClick={() => handleTranslate('English')}
                                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center transition-colors"
                                        >
                                            <span className="mr-3 text-lg">🇺🇸</span> 專業商務英文
                                        </button>
                                        <button 
                                            onClick={() => handleTranslate('Japanese')}
                                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center transition-colors"
                                        >
                                            <span className="mr-3 text-lg">🇯🇵</span> 專業商務日文
                                        </button>
                                        <button 
                                            onClick={() => handleTranslate('Traditional Chinese')}
                                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center transition-colors"
                                        >
                                            <span className="mr-3 text-lg">🇹🇼</span> 繁體中文 (精煉)
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleDownloadPDF}
                                className={`flex items-center px-4 py-2 rounded-xl transition-all text-sm font-black shadow-lg active:scale-95 ${
                                    canDownload 
                                    ? 'bg-indigo-900 text-white hover:bg-slate-800 shadow-indigo-50' 
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                {canDownload ? <Download className="w-4 h-4 mr-1.5" /> : <Lock className="w-4 h-4 mr-1.5" />}
                                {canDownload ? '下載 PDF' : '付費下載'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {isEditing ? (
                <div className="flex-1 flex flex-col space-y-4 min-h-0">
                    <div className="flex-1 bg-surface rounded-xl shadow border border-border overflow-hidden relative group">
                        <textarea
                            ref={textareaRef}
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            onMouseUp={handleTextSelection}
                            onKeyUp={handleTextSelection}
                            className="w-full h-full p-8 focus:outline-none resize-none font-sans text-base leading-relaxed text-foreground rounded-lg placeholder:text-muted-foreground bg-surface transition-all"
                            placeholder="請在此輸入或修改分析報告內容 (支援 Markdown 語法)..."
                            spellCheck={false}
                        />

                        {/* Partial Selection Toolbar */}
                        {selectedText && (
                            <div className="absolute top-4 right-4 animate-in fade-in slide-in-from-top-2 duration-300 z-10">
                                <div className="bg-white/95 backdrop-blur shadow-2xl border border-primary/20 rounded-2xl p-4 w-80 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">局部 AI 修改選取中...</p>
                                        <button onClick={() => setSelectedText('')} className="text-slate-400 hover:text-slate-600">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 max-h-20 overflow-y-auto italic">
                                        "{selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}"
                                    </div>
                                    <input 
                                        type="text"
                                        value={partialInstruction}
                                        onChange={(e) => setPartialInstruction(e.target.value)}
                                        placeholder="對這段選取內容的指令... (如：幫我加圖表、刪除此項)"
                                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !isPartiallyRefining) handlePartialRefine();
                                        }}
                                    />
                                    <button
                                        onClick={handlePartialRefine}
                                        disabled={isPartiallyRefining || !partialInstruction}
                                        className="w-full py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center disabled:opacity-50"
                                    >
                                        {isPartiallyRefining ? (
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        ) : (
                                            <Sparkles className="w-4 h-4 mr-2" />
                                        )}
                                        {isPartiallyRefining ? '修改中...' : '執行局部修改'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Additional Notes Field */}
                    <div className="bg-slate-50 p-6 rounded-xl border border-black/20 shadow-sm">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center">
                            <MessageSquarePlus className="w-4 h-4 mr-1.5 text-primary" />
                            額外注意事項 (Extra Notes for AI Refine)
                        </label>
                        <textarea
                            value={additionalNotes}
                            onChange={(e) => setAdditionalNotes(e.target.value)}
                            className="w-full h-24 p-4 bg-white border border-black/20 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none text-slate-700 placeholder:text-slate-400 transition-all"
                            placeholder="輸入溝通後的補充細節、保固期限或其他調整事項，點擊「AI 再潤飾」將會自動整合進上方報告..."
                        />
                    </div>

                    {/* Security Verification (Turnstile) */}
                    {!apiKey && (
                        <div className="flex justify-center items-center gap-4 bg-slate-50 p-4 rounded-xl border border-black/10">
                            <span className="text-xs font-bold text-slate-400">安全驗證：</span>
                            <Turnstile onVerify={(token) => setTurnstileToken(token)} />
                        </div>
                    )}
                </div>
            ) : (
                <div
                    ref={reportRef}
                    className="bg-transparent min-h-full prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-indigo dark:prose-invert pb-20 watermark-container"
                >
                    {/* Watermark Overlay for Free users */}
                    {userTier === 'free' && (
                        <div className="watermark-overlay">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div key={i} className="watermark-text">捷報 Estimator - 試用版</div>
                            ))}
                        </div>
                    )}

                    {/* Header decoration for the report */}
                    <div className="border-b border-border pb-6 mb-8 flex justify-between items-end">
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-bold text-foreground m-0">專案執行與報價計畫書</h1>
                            <p className="text-muted-foreground mt-2 text-sm">Generated by Aim pro</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Date: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            table: ({ node, ...props }) => (
                                <div className="overflow-x-auto my-6">
                                    <table className="min-w-full divide-y divide-border border border-border" {...props} />
                                </div>
                            ),
                            thead: ({ node, ...props }) => <thead className="bg-muted" {...props} />,
                            th: ({ node, ...props }) => <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border-b bg-muted border-border" {...props} />,
                            td: ({ node, ...props }) => <td className="px-6 py-4 text-sm text-foreground border-b border-border align-top" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-2xl font-black text-foreground mt-12 mb-6 border-l-8 border-muted-foreground/30 pl-4 bg-muted/50 py-2 rounded-r-lg" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-foreground mt-6 mb-3" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-2 text-foreground" {...props} />,
                            code({ node, inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '');
                                const lang = match ? match[1] : '';
                                
                                if (!inline && lang === 'mermaid') {
                                    return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
                                }
                                
                                return (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            }
                        }}
                    >
                        {reportContent}
                    </ReactMarkdown>

                    {/* Footer for the report */}
                    <div className="border-t border-border pt-6 mt-12 text-center text-muted-foreground text-xs">
                        <p>本文件由 Aim pro 自動生成，報價與時程僅供參考。</p>
                    </div>
                </div>
            )}
        </div>

        <UpgradeModal
            isOpen={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
            planName="Starter 個人啟航版"
            tierId="starter"
        />
        </>
    );
}
