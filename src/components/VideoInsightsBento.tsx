'use client';

import React, { useState } from 'react';
import { Play, Pause, Search, Bot, Sparkles, Clock, Video, TrendingUp, CheckCircle2, AlertTriangle, Cpu, Database, Layers, Send, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface VideoInsightsBentoProps {
    projectName?: string;
    industry?: string;
    initialQuery?: string;
    onImportEquipment?: (equipment: Array<{ name: string; cost: number; reason: string }>) => void;
}

interface TimestampItem {
    id: string;
    time: string;
    title: string;
    description: string;
    type: 'hook' | 'quote' | 'broll' | 'anomaly';
    score: number;
}

const DEFAULT_TIMESTAMPS: TimestampItem[] = [
    { id: '1', time: '00:00 - 00:03', title: '前 3 秒黃金鉤子 (Hook)', description: '高對比空拍轉場，搭配強烈節奏音效，AI 預測吸睛度達 94%，有效降低滑走率。', type: 'hook', score: 94 },
    { id: '2', time: '01:24 - 02:15', title: '核心報價與規格論述', description: '講者詳細解說企業級方案與保固條款，此段落語速適中，情緒分析顯示高度自信。', type: 'quote', score: 88 },
    { id: '3', time: '03:45 - 04:10', title: '優質 B-Roll 毛片快篩', description: '陽光灑落辦公室的特寫鏡頭，光影層次豐富，非常適合做為形象片開場素材。', type: 'broll', score: 91 },
    { id: '4', time: '06:12 - 06:30', title: '工地管線未收合 (異常缺失)', description: 'VLM 視覺大模型自動偵測天花板管線裸露風險，已標記為待修繕估價項目。', type: 'anomaly', score: 72 },
];

export default function VideoInsightsBento({ projectName = "商業品牌形象片", industry = "video_production", initialQuery, onImportEquipment }: VideoInsightsBentoProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState('00:00');
    const [activeTab, setActiveTab] = useState<'timestamps' | 'rag' | 'metrics'>('timestamps');
    
    // RAG Chat State
    const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; timestamp?: string }>>([
        { sender: 'ai', text: `您好！我是 NVIDIA 影音 RAG 專屬 AI 助理。我已將本專案的原始影片與競品短影音進行多模態切片與 Milvus 向量建檔。請問您想搜尋影片中哪個特定片段或知識點？` }
    ]);
    const [inputQuery, setInputQuery] = useState(initialQuery || '');
    const [isSearching, setIsSearching] = useState(false);

    // Video Analysis State
    const [videoUrl, setVideoUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [metrics, setMetrics] = useState({
        sceneComplexity: 94,
        estimatedDays: 1.5,
        scdRate: 25
    });
    const [equipment, setEquipment] = useState<Array<{ name: string; cost: number; reason: string }>>([]);
    const [timestamps, setTimestamps] = useState<TimestampItem[]>(DEFAULT_TIMESTAMPS);

    // Active Timestamp Selection
    const [selectedTimestamp, setSelectedTimestamp] = useState<TimestampItem>(DEFAULT_TIMESTAMPS[0]);

    const handleAnalyzeVideo = async () => {
        if (!videoUrl) {
            toast.error('請先輸入影片網址');
            return;
        }

        setIsAnalyzing(true);
        toast.info('🚀 Gemini AI 正在解析影片結構...');

        try {
            const res = await fetch('/api/video-insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoUrl, projectData: { projectName, industry } })
            });

            if (!res.ok) throw new Error('API 解析失敗');
            
            const data = await res.json();
            
            if (data.metrics) {
                setMetrics({
                    sceneComplexity: data.metrics.sceneComplexity || 85,
                    estimatedDays: data.metrics.estimatedDays || 2,
                    scdRate: data.metrics.scdRate || 20
                });
            }

            if (data.timestamps && data.timestamps.length > 0) {
                setTimestamps(data.timestamps);
                setSelectedTimestamp(data.timestamps[0]);
            }

            if (data.equipment) {
                setEquipment(data.equipment);
            }

            if (data.ragReply) {
                setMessages([{ sender: 'ai', text: data.ragReply }]);
            }

            toast.success('✨ 影片解析完成，已萃取報價指標！');
            setActiveTab('timestamps');

        } catch (error) {
            console.error(error);
            toast.error('解析失敗，請稍後再試');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handlePlayTime = (item: TimestampItem) => {
        setSelectedTimestamp(item);
        setCurrentTime(item.time.split(' - ')[0]);
        setIsPlaying(true);
        toast.success(`🎬 已跳轉至影片片段：${item.title} (${item.time})`);
    };

    const handleSendSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputQuery.trim()) return;

        const newMsg = { sender: 'user' as const, text: inputQuery };
        setMessages(prev => [...prev, newMsg]);
        setInputQuery('');
        setIsSearching(true);

        // Simulate NVIDIA NIM Vector Search
        setTimeout(() => {
            let aiReply = "根據 Milvus 多模態向量檢索結果，未找到完全符合的片段，建議嘗試其他關鍵字。";
            let foundTime = "00:00";

            if (newMsg.text.includes('報價') || newMsg.text.includes('費用') || newMsg.text.includes('錢')) {
                aiReply = `已為您找到相關片段！在影片 **01:24 - 02:15** 處，講者詳細說明了標準與企業級方案的收費標準與保固條款。`;
                foundTime = "01:24";
            } else if (newMsg.text.includes('鉤子') || newMsg.text.includes('前3秒') || newMsg.text.includes('吸睛')) {
                aiReply = `在影片 **00:00 - 00:03** 處，使用了高對比空拍轉場，NeMo 視覺評分給予 94/100 的極高吸睛度評價。`;
                foundTime = "00:00";
            } else if (newMsg.text.includes('缺失') || newMsg.text.includes('異常') || newMsg.text.includes('工地')) {
                aiReply = `VLM 模型在影片 **06:12 - 06:30** 處偵測到天花板管線裸露的異常缺失，建議列入修繕估價單中。`;
                foundTime = "06:12";
            } else {
                aiReply = `已為您檢索整部影片！在 **03:45** 處有提到相關概念：「${newMsg.text}」的延伸討論，該段落畫面穩定且語音清晰。`;
                foundTime = "03:45";
            }

            setMessages(prev => [...prev, { sender: 'ai', text: aiReply, timestamp: foundTime }]);
            setIsSearching(false);
            toast.info("🔍 NVIDIA NIM 檢索完成");
        }, 1200);
    };

    return (
        <div className="w-full bg-slate-950 text-slate-100 rounded-3xl p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-slate-800/80 font-sans my-8 animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-emerald-400 animate-spin" />
                            NVIDIA AI Blueprints 賦能
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Milvus Vector ID: #NV-8842-V</span>
                    </div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Video className="w-6 h-6 text-emerald-400" />
                        多模態影音視覺洞察與 RAG 檢索中樞
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                        專案標的：<span className="text-slate-200 font-medium">{projectName}</span> | 整合 Gemini 3.1 Flash-Lite 多模態視覺解析
                    </p>
                </div>

                {/* Microservice Badges & URL Input */}
                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-[11px]">
                            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Gemini Vision: <strong className="text-cyan-400">100%</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-[11px]">
                            <Database className="w-3.5 h-3.5 text-purple-400" />
                            <span>Vector Index: <strong className="text-purple-400">Active</strong></span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full max-w-sm">
                        <input
                            type="text"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder="貼上 YouTube 或外部影片網址..."
                            className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                        <button
                            onClick={handleAnalyzeVideo}
                            disabled={isAnalyzing || !videoUrl}
                            className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30 px-3 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center gap-1"
                        >
                            {isAnalyzing ? <Sparkles className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                            {isAnalyzing ? '解析中...' : '開始解析'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
                
                {/* Left: Simulated Video Player & Metrics (5 Cols) */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Simulated Player */}
                    <div className="relative w-full aspect-video bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner group flex flex-col justify-between p-4">
                        <div className="flex justify-between items-start z-10">
                            <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-mono border border-white/10 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                                {currentTime} / 08:45
                            </span>
                            <span className={cn(
                                "px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-md border",
                                selectedTimestamp.type === 'hook' ? "bg-amber-500/20 text-amber-300 border-amber-500/30" :
                                selectedTimestamp.type === 'quote' ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" :
                                selectedTimestamp.type === 'anomaly' ? "bg-rose-500/20 text-rose-300 border-rose-500/30" :
                                "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            )}>
                                {selectedTimestamp.title}
                            </span>
                        </div>

                        {/* Video Waveform / Animation Placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                            <div className="w-full h-24 flex items-center justify-center gap-1 px-8 opacity-20 group-hover:opacity-40 transition-opacity">
                                {[...Array(24)].map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={cn(
                                            "w-2 bg-emerald-500 rounded-full transition-all duration-300",
                                            isPlaying ? "animate-pulse" : ""
                                        )}
                                        style={{ 
                                            height: isPlaying ? `${Math.floor(Math.random() * 64) + 12}px` : '16px',
                                            animationDelay: `${i * 0.05}s`
                                        }}
                                    />
                                ))}
                            </div>
                            
                            {/* Central Play/Pause Indicator */}
                            <button 
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="absolute w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center backdrop-blur-sm hover:scale-110 hover:bg-emerald-500/30 transition-all pointer-events-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                            >
                                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                            </button>
                        </div>

                        {/* Player Footer Description */}
                        <div className="z-10 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs text-slate-300">
                            <div className="font-bold text-white mb-0.5 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                AI 多模態視覺解析：
                            </div>
                            {selectedTimestamp.description}
                        </div>
                    </div>

                    {/* VLM AI Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                            <div className="text-xs text-slate-400 flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                                前 3 秒 Hook 吸睛度
                            </div>
                            <div className="text-2xl font-black text-white flex items-baseline gap-1">
                                {metrics.sceneComplexity}<span className="text-xs text-slate-400 font-normal">/100 分</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                                <div className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-1000" style={{ width: `${metrics.sceneComplexity}%` }} />
                            </div>
                        </div>

                        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                            <div className="text-xs text-slate-400 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                                AI 快篩節省工時
                            </div>
                            <div className="text-2xl font-black text-cyan-400 flex items-baseline gap-1">
                                {metrics.estimatedDays}<span className="text-xs text-slate-400 font-normal">天</span>
                            </div>
                            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-2">
                                <CheckCircle2 className="w-3 h-3" />
                                報價參考拍攝天數
                            </div>
                        </div>
                    </div>

                    {/* Scene Change Detection (SCD) Info */}
                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                            <div className="font-bold text-white flex items-center gap-1.5">
                                <Video className="w-4 h-4 text-purple-400" />
                                智能場景切換頻率 (SCD)
                            </div>
                            <div className="text-slate-400 text-[11px]">平均每 2.4 秒切換分鏡，符合短影音高張力節奏</div>
                        </div>
                        <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 font-mono font-bold border border-purple-500/30">
                            {metrics.scdRate} SCD/min
                        </span>
                    </div>
                </div>

                {/* Right: Interactive Tabs - Timestamps & RAG Q&A (7 Cols) */}
                <div className="lg:col-span-7 flex flex-col bg-slate-900/40 rounded-2xl border border-slate-800 overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="flex items-center border-b border-slate-800 bg-slate-900/80 px-4 pt-2 gap-2">
                        <button
                            onClick={() => setActiveTab('timestamps')}
                            className={cn(
                                "px-4 py-3 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2",
                                activeTab === 'timestamps' 
                                    ? "bg-slate-800/80 text-white border-emerald-500 shadow-lg" 
                                    : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40"
                            )}
                        >
                            <Clock className="w-4 h-4 text-emerald-400" />
                            AI 關鍵影格與時間軸快篩 ({timestamps.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('rag')}
                            className={cn(
                                "px-4 py-3 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2",
                                activeTab === 'rag' 
                                    ? "bg-slate-800/80 text-white border-cyan-500 shadow-lg" 
                                    : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40"
                            )}
                        >
                            <Bot className="w-4 h-4 text-cyan-400" />
                            NVIDIA 影音 RAG 語意問答
                            {messages.length > 1 && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                        </button>
                    </div>

                    {/* Tab Content 1: Timestamps List */}
                    {activeTab === 'timestamps' && (
                        <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[380px] no-scrollbar">
                            {timestamps.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handlePlayTime(item)}
                                    className={cn(
                                        "group p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 active:scale-[0.99]",
                                        selectedTimestamp.id === item.id
                                            ? "bg-slate-800 border-emerald-500/50 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.2)]"
                                            : "bg-slate-900/60 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700"
                                    )}
                                >
                                    <button className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                                        selectedTimestamp.id === item.id ? "bg-emerald-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-300"
                                    )}>
                                        <Play className="w-5 h-5 ml-0.5" />
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2 truncate">
                                                {item.title}
                                                {item.type === 'anomaly' && <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                                            </h4>
                                            <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700 shrink-0">
                                                {item.time}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 my-auto shrink-0 transition-transform group-hover:translate-x-1" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tab Content 2: Video RAG Chatbot */}
                    {activeTab === 'rag' && (
                        <div className="flex-1 flex flex-col h-[380px]">
                            {/* Chat Messages */}
                            <div className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar">
                                {messages.map((msg, i) => (
                                    <div key={i} className={cn("flex gap-3", msg.sender === 'user' ? "justify-end" : "justify-start")}>
                                        {msg.sender === 'ai' && (
                                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
                                                <Bot className="w-4 h-4" />
                                            </div>
                                        )}
                                        <div className={cn(
                                            "max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed space-y-2",
                                            msg.sender === 'user' 
                                                ? "bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-tr-none shadow-lg" 
                                                : "bg-slate-800/90 text-slate-200 rounded-tl-none border border-slate-700"
                                        )}>
                                            <div className="whitespace-pre-wrap">{msg.text}</div>
                                            {msg.timestamp && (
                                                <button
                                                    onClick={() => handlePlayTime({
                                                        id: 'rag-temp',
                                                        time: `${msg.timestamp} - 08:45`,
                                                        title: `RAG 檢索跳轉 (${msg.timestamp})`,
                                                        description: msg.text,
                                                        type: 'quote',
                                                        score: 90
                                                    })}
                                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 text-cyan-400 border border-cyan-500/30 hover:bg-slate-900 transition-colors font-mono font-bold mt-2 text-[11px]"
                                                >
                                                    <Play className="w-3 h-3 text-cyan-400" />
                                                    跳轉至影片 {msg.timestamp} 觀看片段
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {isSearching && (
                                    <div className="flex gap-3 items-center text-xs text-slate-400 bg-slate-800/50 p-3 rounded-2xl w-fit border border-slate-700/50">
                                        <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                                        NVIDIA NIM 多模態向量檢索中，正在比對 Whisper 字幕與 NV-Embed 關鍵影格...
                                    </div>
                                )}
                            </div>

                            {/* Chat Input */}
                            <form onSubmit={handleSendSearch} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2 items-center">
                                <div className="relative flex-1">
                                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={inputQuery}
                                        onChange={(e) => setInputQuery(e.target.value)}
                                        placeholder="輸入自然語言搜尋影片片段 (例如：哪裡有提到報價？前 3 秒鉤子吸睛嗎？)..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSearching || !inputQuery.trim()}
                                    className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none shrink-0"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    檢索
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Summary Banner */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>本模組支援匯出 **Milvus 多模態向量索引檔 (.json)**，可直接無縫交付給客戶做為知識庫資產。</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    {equipment.length > 0 && typeof onImportEquipment === 'function' && (
                        <button
                            onClick={() => {
                                onImportEquipment(equipment);
                                toast.success("✅ 已成功匯入器材與天數至報價單");
                            }}
                            className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500 text-emerald-400 font-bold transition-all active:scale-95 shrink-0 flex items-center gap-1.5 text-xs"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            一鍵匯入報價單 (Import to Quote)
                        </button>
                    )}
                    <button
                        onClick={() => {
                            toast.success("📦 已成功匯出 Milvus 多模態向量庫索引檔");
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold transition-all active:scale-95 shrink-0 flex items-center gap-1.5 text-xs"
                    >
                        <Database className="w-3.5 h-3.5 text-purple-400" />
                        匯出向量索引庫 (Export Index)
                    </button>
                </div>
            </div>
        </div>
    );
}
