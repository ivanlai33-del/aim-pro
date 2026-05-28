import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getItemById, getAllItems } from '@/config/industries';
import Link from 'next/link';
import FadeIn from '@/components/animations/FadeIn';
import { 
    ArrowLeft, Zap, ArrowRight, CheckCircle2, ShieldCheck, 
    Clock, TrendingUp, Users, Globe2, Eye, XCircle,
    Palette, Code2, MessageSquare, CalendarDays,
    Hammer, Megaphone, Video, Search, Store, Layout, Camera, Monitor,
    Briefcase, GraduationCap, Lightbulb, Presentation, Home, Scale, Award,
    Mic, Sparkles, Trophy, Landmark
} from 'lucide-react';
import { PERSONA_LANDING_DATA } from '@/config/personaLandingData';
import PersonaSelectorDropdown from '@/components/landing/PersonaSelectorDropdown';

const ICON_MAP: Record<string, any> = {
    web_development: Code2,
    software_outsourcing: Layout,
    system_integration: Monitor,
    social_media: Megaphone,
    ad_management: TrendingUp,
    seo: Search,
    influencer_marketing: MessageSquare,
    pr_agency: Mic,
    brand_design: Palette,
    video_production: Video,
    social_visual: Layout,
    photography: Camera,
    ui_ux_design: Layout,
    interior_design: Hammer,
    event_planning: CalendarDays,
    exhibition_design: Store,
    business_consulting: Briefcase,
    corporate_training: GraduationCap,
    strategy_planning: Lightbulb,
    online_course_prod: Presentation,
    home_organizer: Home,
    ip_agent: Scale,
    ai_agent_consultant: Sparkles,
    real_estate_agent: Landmark,
    government_tender: Trophy,
    grant_subsidy: Landmark,
};

const PAIN_TAGS_MAP: Record<string, string[]> = {
    web_development: ['規格一直變', '驗收無標準', '被凹加功能', '尾款收不回'],
    software_outsourcing: ['需求無底洞', '程式碼外流', '保固變免費', '工期狂延遲'],
    system_integration: ['API 規格缺漏', '資料遺失扛責', '第三方不配合', '介接推諉扯皮'],
    social_media: ['被求24h回覆', '無限微調圖片', '硬扛業績 KPI', '假日也要發文'],
    ad_management: ['銷量差怪投手', '預算代操難算', '帳號被封要賠', '平台政策突變'],
    seo: ['要求立刻首頁', '演算法變更背鍋', '工程師不配合', '不保排名拒付'],
    influencer_marketing: ['網紅遲交素材', '導購差背鍋', '二次授權被告', '網紅發文翻車'],
    pr_agency: ['沒上版面拒付', '設備壞公關賠', '免費處理危機', '現場無限追加'],
    brand_design: ['陷入免費比稿', '報價被亂砍', '無限微調地獄', '智財權被亂用'],
    video_production: ['拍攝現場超時', '初剪無限改', '天氣不好重拍', '演員授權糾紛'],
    social_visual: ['圖卡單價極低', '模板惡意二創', '免費改多尺寸', '緊急插單沒錢'],
    photography: ['被拗全給毛片', '修圖無底洞', '照片未授權', '代墊模特費用'],
    ui_ux_design: ['程式開發翻案', '工程師做不出', '免費加元件', '主觀感覺不對'],
    interior_design: ['隱蔽工程自吸', '口頭變更不認', '天候延誤扣款', '完工挑剔扣款'],
    event_planning: ['取消訂金難討', '硬體出包企劃賠', '現場追加不認', '雨天備案爭議'],
    exhibition_design: ['申報逾期重罰', '進撤場延誤背鍋', '撤展後挑剔', '展品失竊要賠'],
    business_consulting: ['半夜call狂問', '沒升級拒付月費', '拿了報告自己做', '無限免費諮詢'],
    corporate_training: ['無償全客製化', '被偷錄影轉售', '硬體爛怪講師', '上課前臨時改期'],
    strategy_planning: ['被嫌只是PPT', '提案朝令夕改', '執行錯怪策略', '比稿浪費心血'],
    online_course_prod: ['盜版四處流竄', '平台分潤不清', '講師拖延交稿', '修改次數無限'],
    home_organizer: ['物品丟棄爭議', '被當免費清潔工', '收完亂怪收納師', '工時難以估算'],
    ip_agent: ['保證核准不切實', '駁回怪代理', '客戶拖延補件', '免費撰寫答辯'],
    ai_agent_consultant: ['AI幻覺被告', 'API費用拒付', '員工不用怪系統', '要求100%精準'],
    real_estate_agent: ['帶看幾次買別家', '漏水瑕疵背鍋', '買賣私下成交', '被退半成服務費'],
    government_tender: ['企劃被免費借鑑', '得標驗收刁難', '法規變動算廠商', '公文無限重改'],
    grant_subsidy: ['沒過要求退訂', '核銷被退件', '客戶亂花補助款', '查帳責任難清'],
    default: ['進度不透明', '需求一直變動', '品質難以控管', '交付時間延遲']
};

// ==========================================
// 動態主題色彩定義 (Dynamic Color Themes)
// ==========================================
const THEMES: Record<string, {
    heroBg: string; glow1: string; glow2: string; 
    btnText: string; btnShadow: string; badgeIcon: string; 
    textHighlight: string; iconGlow: string; 
    afterBg: string; afterTitle: string; afterSub: string; checkIcon: string; 
    bottomBanner: string; faqQ: string; uiMain: string; uiLight: string;
}> = {
    // 1. 網頁與系統 (Indigo/Blue)
    web: {
        heroBg: 'theme-gradient-web',
        glow1: 'bg-white/20', glow2: 'bg-white/10',
        btnText: 'text-indigo-600', btnShadow: 'shadow-[0_10px_30px_rgba(0,0,0,0.1)]',
        badgeIcon: 'text-white fill-white', textHighlight: 'theme-text-web',
        iconGlow: 'theme-glow-web', afterBg: 'bg-[#F8FAFF] border-indigo-100 shadow-[0_20px_50px_-12px_rgba(99,102,241,0.1)]',
        afterTitle: 'text-indigo-900', afterSub: 'text-indigo-600', checkIcon: 'text-indigo-500',
        bottomBanner: 'theme-gradient-web shadow-[0_15px_40px_rgba(67,100,247,0.3)]', faqQ: 'text-indigo-600',
        uiMain: 'bg-indigo-600', uiLight: 'bg-indigo-100'
    },
    // 2. 數位行銷與推廣 (Amber/Orange)
    marketing: {
        heroBg: 'theme-gradient-marketing',
        glow1: 'bg-white/20', glow2: 'bg-white/10',
        btnText: 'text-amber-600', btnShadow: 'shadow-[0_10px_30px_rgba(0,0,0,0.1)]',
        badgeIcon: 'text-white fill-white', textHighlight: 'theme-text-marketing',
        iconGlow: 'theme-glow-marketing', afterBg: 'bg-[#FFFBEB] border-amber-100 shadow-[0_20px_50px_-12px_rgba(245,158,11,0.1)]',
        afterTitle: 'text-amber-900', afterSub: 'text-amber-600', checkIcon: 'text-amber-500',
        bottomBanner: 'theme-gradient-marketing shadow-[0_15px_40px_rgba(255,75,43,0.3)]', faqQ: 'text-amber-600',
        uiMain: 'bg-amber-600', uiLight: 'bg-amber-100'
    },
    // 3. 視覺設計與創意 (Pink/Rose)
    design: {
        heroBg: 'theme-gradient-design',
        glow1: 'bg-white/20', glow2: 'bg-white/10',
        btnText: 'text-pink-600', btnShadow: 'shadow-[0_10px_30px_rgba(0,0,0,0.1)]',
        badgeIcon: 'text-white fill-white', textHighlight: 'theme-text-design',
        iconGlow: 'theme-glow-design', afterBg: 'bg-[#FDF2F8] border-pink-100 shadow-[0_20px_50px_-12px_rgba(236,72,153,0.1)]',
        afterTitle: 'text-pink-900', afterSub: 'text-pink-600', checkIcon: 'text-pink-500',
        bottomBanner: 'theme-gradient-design shadow-[0_15px_40px_rgba(218,34,255,0.3)]', faqQ: 'text-pink-600',
        uiMain: 'bg-pink-600', uiLight: 'bg-pink-100'
    },
    // 4. 空間與活動企劃 (Emerald/Green)
    space: {
        heroBg: 'theme-gradient-space',
        glow1: 'bg-white/20', glow2: 'bg-white/10',
        btnText: 'text-emerald-600', btnShadow: 'shadow-[0_10px_30px_rgba(0,0,0,0.1)]',
        badgeIcon: 'text-white fill-white', textHighlight: 'theme-text-space',
        iconGlow: 'theme-glow-space', afterBg: 'bg-[#F0FDF4] border-emerald-100 shadow-[0_20px_50px_-12px_rgba(16,185,129,0.1)]',
        afterTitle: 'text-emerald-900', afterSub: 'text-emerald-600', checkIcon: 'text-emerald-500',
        bottomBanner: 'theme-gradient-space shadow-[0_15px_40px_rgba(56,239,125,0.3)]', faqQ: 'text-emerald-600',
        uiMain: 'bg-emerald-600', uiLight: 'bg-emerald-100'
    },
    // 5. 專業服務與顧問 (Purple/Violet)
    consulting: {
        heroBg: 'theme-gradient-consulting',
        glow1: 'bg-white/20', glow2: 'bg-white/10',
        btnText: 'text-purple-600', btnShadow: 'shadow-[0_10px_30px_rgba(0,0,0,0.1)]',
        badgeIcon: 'text-white fill-white', textHighlight: 'theme-text-consulting',
        iconGlow: 'theme-glow-consulting', afterBg: 'bg-[#F5F3FF] border-purple-100 shadow-[0_20px_50px_-12px_rgba(139,92,246,0.1)]',
        afterTitle: 'text-purple-900', afterSub: 'text-purple-600', checkIcon: 'text-purple-500',
        bottomBanner: 'theme-gradient-consulting shadow-[0_15px_40px_rgba(44,83,100,0.4)]', faqQ: 'text-purple-600',
        uiMain: 'bg-purple-600', uiLight: 'bg-purple-100'
    },
    // 6. 知識產出與專業職人 (Sky Blue)
    pro_service: {
        heroBg: 'theme-gradient-pro_service',
        glow1: 'bg-white/20', glow2: 'bg-white/10',
        btnText: 'text-sky-600', btnShadow: 'shadow-[0_10px_30px_rgba(0,0,0,0.1)]',
        badgeIcon: 'text-white fill-white', textHighlight: 'theme-text-pro_service',
        iconGlow: 'theme-glow-pro_service', afterBg: 'bg-[#F0F9FF] border-sky-100 shadow-[0_20px_50px_-12px_rgba(14,165,233,0.1)]',
        afterTitle: 'text-sky-900', afterSub: 'text-sky-600', checkIcon: 'text-sky-500',
        bottomBanner: 'theme-gradient-pro_service shadow-[0_15px_40px_rgba(109,213,237,0.3)]', faqQ: 'text-sky-600',
        uiMain: 'bg-sky-600', uiLight: 'bg-sky-100'
    },
    // 7. 商務開發與競標 (Orange/Red)
    business_dev: {
        heroBg: 'theme-gradient-business_dev',
        glow1: 'bg-white/20', glow2: 'bg-white/10',
        btnText: 'text-orange-600', btnShadow: 'shadow-[0_10px_30px_rgba(0,0,0,0.1)]',
        badgeIcon: 'text-white fill-white', textHighlight: 'theme-text-business_dev',
        iconGlow: 'theme-glow-business_dev', afterBg: 'bg-[#FFF7ED] border-orange-100 shadow-[0_20px_50px_-12px_rgba(249,115,22,0.1)]',
        afterTitle: 'text-orange-900', afterSub: 'text-orange-600', checkIcon: 'text-orange-500',
        bottomBanner: 'theme-gradient-business_dev shadow-[0_15px_40px_rgba(241,39,17,0.3)]', faqQ: 'text-orange-600',
        uiMain: 'bg-orange-600', uiLight: 'bg-orange-100'
    },
};

// 類別對應主題
const CATEGORY_THEME_MAP: Record<string, keyof typeof THEMES> = {
    web: 'web',
    marketing: 'marketing',
    design: 'design',
    space: 'space',
    consulting: 'consulting',
    pro_service: 'pro_service',
    business_dev: 'business_dev'
};
// ==========================================

// 預先生成靜態路徑 (SSG) 提升 SEO 與載入速度
export async function generateStaticParams() {
    const modules = getAllItems();
    return modules.map((mod) => ({
        id: mod.id,
    }));
}

// 動態產生 SEO Meta Data
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const mod = getItemById(params.id);
    if (!mod) return {};

    const seoDescription = `讓專屬 AGI 成為您的「${mod.name}」頂尖大腦！Aim.pro 解決職人缺乏法務與財務知識的痛點，幫助您省下數十小時的繁瑣溝通。從精準報價單、專業合約、委任書到財務請款，一鍵自動化光速生成，讓您專注於核心專業，徹底告別傳統外包困境！`;

    return {
        title: `${mod.name} - 職人頭腦的 AGI 專家 | Aim.pro 全球專家智庫`,
        description: seoDescription,
        openGraph: {
            title: `${mod.name} - 職人頭腦的 AGI 專家`,
            description: seoDescription,
            type: 'website',
        }
    };
}

export default function PersonaPage({ params }: { params: { id: string } }) {
    const mod = getItemById(params.id);
    if (!mod) notFound();

    // 取得該職人的專屬 Icon，若無則使用 Zap
    const PersonaIcon = ICON_MAP?.[mod.id] || Zap;
    
    // 取得對應的主題色
    const themeKey = CATEGORY_THEME_MAP[mod.categoryId] || 'web';
    const theme = THEMES[themeKey];

    const landingData = PERSONA_LANDING_DATA[mod.id] || PERSONA_LANDING_DATA['default'];

    // 產生 FAQ Schema 結構化資料
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": landingData.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <main className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-cyan-500/30">
            {/* 注入 FAQ 結構化資料 (幫助 SEO) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* 導覽列 (透明背景，置於上方) */}
            <nav className="absolute top-0 left-0 w-full z-50">
                <div className="container mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
                    <div className="flex-1">
                        <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium">
                            <ArrowLeft className="w-5 h-5" />
                            返回首頁
                        </Link>
                    </div>
                    
                    <div className="flex items-center justify-center">
                        <img src="/Logo.png" alt="Aim.pro Icon" className="w-12 h-12 object-contain brightness-0 invert opacity-90" />
                    </div>
                    
                    <div className="flex-1 flex justify-end">
                        <PersonaSelectorDropdown currentId={mod.id} />
                    </div>
                </div>
            </nav>

            {/* ---------------------------------------------------- */}
            {/* 1. 動態主視覺區 (Hero Section) */}
            {/* ---------------------------------------------------- */}
            <section className={`relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden ${theme.heroBg}`}>
                {/* 裝飾性光暈 */}
                <div className={`absolute top-0 right-0 w-[800px] h-[800px] ${theme.glow1} rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3`} />
                <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] ${theme.glow2} rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/3`} />
                
                {/* 斜線網格背景 */}
                <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.05] mix-blend-overlay" />

                <FadeIn delay={0.1} className="container mx-auto px-6 lg:px-12 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* 左側：文字與 CTA */}
                        <div className="text-left">
                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-sm mb-6 shadow-sm`}>
                                <Zap className={`w-4 h-4 text-white fill-white`} />
                                全球專家智庫系列
                            </div>
                            
                            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 tracking-tight leading-[1.15] drop-shadow-md flex flex-wrap items-baseline">
                                {mod.name.split('與').map((part, index, array) => (
                                    <span key={index}>
                                        <span className={`text-transparent bg-clip-text ${theme.textHighlight}`}>
                                            {part}
                                        </span>
                                        {index === 0 && array.length > 1 && <span className="font-light text-white/80 text-4xl lg:text-5xl"> 與 </span>}
                                        {index === array.length - 1 && <span className="font-medium text-white/90 text-3xl lg:text-4xl ml-4 tracking-normal align-baseline">職人模組</span>}
                                    </span>
                                ))}
                            </h1>

                            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6 tracking-wide drop-shadow-sm">
                                {landingData.heroSubtitle || '你的專屬 AGI 幕僚：極速完成提案、報價與合約，不再孤軍奮戰'}
                            </h2>
                            
                            <p className="text-white/90 text-lg leading-relaxed font-medium mb-10 max-w-xl">
                                {landingData.heroDescription || mod.tagline || '告別過去繁瑣的傳統流程，擁抱 AGI 帶來的指數級效率。讓懂法務與財務的 AGI 辦公室成為您最堅強的後盾，專注於您的核心專業。'}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Link 
                                    href="/dashboard/settings?action=upgrade"
                                    className={`w-full sm:w-auto px-8 py-3.5 bg-white ${theme.btnText} rounded-xl font-bold text-[15px] hover:bg-white/90 hover:scale-105 active:scale-95 transition-all ${theme.btnShadow} flex items-center justify-center gap-2 group`}
                                >
                                    <Zap className={`w-4 h-4 fill-current`} />
                                    立即訂閱解鎖
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link 
                                    href={`/dashboard/modules/${mod.id}?preview=true`}
                                    className="w-full sm:w-auto px-8 py-3.5 bg-transparent text-white border border-white/40 rounded-xl font-bold text-[15px] hover:bg-white/10 transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <Eye className="w-4 h-4 opacity-80" />
                                    進入工作區預覽
                                </Link>
                            </div>
                        </div>

                        {/* 右側：動態職人形象圖片 (Fallback to CSS 3D Glass Composition) */}
                        <div className="relative hidden lg:block h-[500px] w-full">
                            {/* Fallback Glassmorphic 3D Composition */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                {/* Main Center Glass Card */}
                                <div className="relative w-80 h-96 bg-white/10 backdrop-blur-2xl border border-white/30 rounded-[2.5rem] shadow-2xl flex items-center justify-center rotate-[-5deg] hover:rotate-0 transition-transform duration-700 group overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    <PersonaIcon className={`w-40 h-40 text-white filter ${theme.iconGlow} transform group-hover:scale-110 transition-transform duration-700`} strokeWidth={1} />
                                    
                                    {/* Glass reflection */}
                                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent skew-y-[-20deg] transform origin-top-left" />
                                </div>

                                {/* Floating Tags */}
                                <div className="absolute top-20 right-4 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white shadow-xl text-sm font-bold flex items-center gap-2 animate-[float_4s_ease-in-out_infinite]">
                                    <ShieldCheck className={`w-4 h-4 text-white`} />
                                    SLA 保證機制
                                </div>
                                <div className="absolute top-1/2 -right-8 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white shadow-xl text-sm font-bold flex items-center gap-2 animate-[float_5s_ease-in-out_infinite_reverse]">
                                    <Clock className={`w-4 h-4 text-white`} />
                                    里程碑驗收機制
                                </div>
                                <div className={`absolute bottom-24 right-12 px-4 py-2 bg-white/30 backdrop-blur-md border border-white/40 rounded-full text-white shadow-xl text-sm font-bold flex items-center gap-2 animate-[float_6s_ease-in-out_infinite]`}>
                                    <Zap className={`w-4 h-4 text-white fill-current`} />
                                    AI 提效自動化
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </section>

            {/* ---------------------------------------------------- */}
            {/* 2. 信任指標橫幅 (Trust Banner) */}
            {/* ---------------------------------------------------- */}
            <div className="bg-white border-b border-slate-200">
                <FadeIn delay={0.2} className="container mx-auto px-6 lg:px-12 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                        <div className="flex items-center justify-center gap-4 pt-4 md:pt-0">
                            <div className={`w-12 h-12 rounded-full ${theme.uiLight} flex items-center justify-center ${theme.checkIcon}`}>
                                <Globe2 className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-800 text-lg">全球專家團隊</div>
                                <div className="text-slate-500 text-sm">遍佈 20+ 國家</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-4 pt-4 md:pt-0">
                            <div className={`w-12 h-12 rounded-full ${theme.uiLight} flex items-center justify-center ${theme.checkIcon}`}>
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-800 text-lg">SLA 保證交付</div>
                                <div className="text-slate-500 text-sm">里程碑驗收機制</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-4 pt-4 md:pt-0">
                            <div className={`w-12 h-12 rounded-full ${theme.uiLight} flex items-center justify-center ${theme.checkIcon}`}>
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-800 text-lg">交付成功率</div>
                                <div className="text-slate-500 text-sm">98% 專案如期完成</div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>

            {/* ---------------------------------------------------- */}
            {/* 3. 沉浸式痛點對比區 (Before vs After) */}
            {/* ---------------------------------------------------- */}
            <section className="py-24 lg:py-32 bg-[#F8FAFC]">
                <div className="container mx-auto px-6 lg:px-12">
                    <FadeIn delay={0.1} className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-black text-slate-800 mb-4 tracking-tight leading-snug">
                            為什麼您需要 <span className={`${theme.checkIcon}`}>{mod.name.replace(' 職人模組', '')}</span> 的專屬 AGI 團隊<br className="hidden md:block"/>
                            {landingData.beforeAfterTitle || '來處理繁雜的合約與報價防禦'}？
                        </h2>
                        <p className="text-slate-500 text-lg">
                            {landingData.beforeAfterSubtitle || '讓您擁有專業的 AGI 團隊協作，確保每一筆交易都安全可靠！'}
                        </p>
                    </FadeIn>

                    <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* VS 徽章 (Center Badge) */}
                        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                            <FadeIn delay={0.6} className={`w-32 h-32 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-2xl ${theme.checkIcon} font-black text-5xl`}>
                                VS
                            </FadeIn>
                        </div>

                        {/* Left: Before (過去的困境) */}
                        <FadeIn delay={0.3} className="bg-[#F8FAFC] rounded-3xl p-10 lg:p-14 border border-slate-200 flex flex-col relative overflow-hidden shadow-sm">
                            {/* Header (Top aligned) */}
                            <div className="flex items-center gap-5 mb-10">
                                <div className="w-14 h-14 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center shrink-0">
                                    <XCircle className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-1">過去的困境</h3>
                                    <p className="text-slate-500 text-sm font-medium">傳統外包的痛點</p>
                                </div>
                            </div>

                            {/* Abstract Illustration Placeholder for "Stress/Chaos" */}
                            <div className="w-full max-w-[320px] mx-auto aspect-[4/3] relative mb-14">
                                <div className="absolute inset-0 bg-slate-200/50 rounded-3xl animate-pulse" />
                                <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 text-slate-400" />
                                
                                {/* Floating Pain Points */}
                                <div className="absolute top-2 left-0 px-4 py-1.5 bg-white border border-slate-200 rounded-full text-slate-500 text-xs font-medium shadow-sm rotate-[-5deg] whitespace-nowrap">{PAIN_TAGS_MAP[mod.id]?.[0] || PAIN_TAGS_MAP.default[0]}</div>
                                <div className="absolute top-1/4 right-0 px-4 py-1.5 bg-white border border-slate-200 rounded-full text-slate-500 text-xs font-medium shadow-sm rotate-[5deg] whitespace-nowrap">{PAIN_TAGS_MAP[mod.id]?.[1] || PAIN_TAGS_MAP.default[1]}</div>
                                <div className="absolute bottom-1/4 left-4 px-4 py-1.5 bg-white border border-slate-200 rounded-full text-slate-500 text-xs font-medium shadow-sm rotate-[3deg] whitespace-nowrap">{PAIN_TAGS_MAP[mod.id]?.[2] || PAIN_TAGS_MAP.default[2]}</div>
                                <div className="absolute bottom-4 right-4 px-4 py-1.5 bg-white border border-slate-200 rounded-full text-slate-500 text-xs font-medium shadow-sm rotate-[-8deg] whitespace-nowrap">{PAIN_TAGS_MAP[mod.id]?.[3] || PAIN_TAGS_MAP.default[3]}</div>
                            </div>

                            <div className="flex flex-col w-full mt-auto">
                                <ul className="space-y-0 w-full text-left border-t border-slate-200/60 pt-2">
                                    {landingData.beforePainPoints.map((point, idx) => (
                                        <li key={idx} className="flex items-start gap-4 text-slate-600 font-medium py-4 border-b border-slate-200/60 text-[15px]">
                                            <span className="text-red-500 font-black text-xl mt-0.5 shrink-0 leading-none">X</span>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </FadeIn>

                        {/* Right: After (現在的優勢) */}
                        <FadeIn delay={0.8} className={`${theme.heroBg} ${theme.iconGlow} rounded-3xl p-10 lg:p-14 border border-white/20 flex flex-col relative overflow-hidden`}>
                            {/* Header (Top aligned) */}
                            <div className="flex items-center gap-5 mb-10">
                                <div className={`w-14 h-14 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full flex items-center justify-center shrink-0 shadow-lg`}>
                                    <CheckCircle2 className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className={`text-2xl font-bold text-white mb-1 drop-shadow-sm`}>現在的優勢</h3>
                                    <p className={`text-white/90 text-sm font-medium`}>擁有職人頭腦的 AGI 辦公室</p>
                                </div>
                            </div>

                            {/* Abstract Illustration Placeholder for "Clean UI / Dashboard" */}
                            <div className="w-full max-w-[320px] mx-auto aspect-[4/3] relative mb-14 flex items-center justify-center">
                                {/* Mock Dashboard UI (Glassmorphism) */}
                                <div className={`w-full h-40 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl border border-white/30 flex flex-col overflow-hidden`}>
                                    <div className={`h-6 bg-white/10 border-b border-white/20 flex items-center px-3 gap-1.5`}>
                                        <div className="w-2 h-2 rounded-full bg-white/40" />
                                        <div className="w-2 h-2 rounded-full bg-white/40" />
                                        <div className="w-2 h-2 rounded-full bg-white/40" />
                                    </div>
                                    <div className="flex-1 p-4 grid grid-cols-2 gap-4">
                                        <div className={`bg-white/20 rounded-lg`} />
                                        <div className="flex flex-col gap-2">
                                            <div className="h-3 bg-white/20 rounded" />
                                            <div className="h-3 w-2/3 bg-white/20 rounded" />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Floating Benefit Tags */}
                                <div className="absolute -bottom-6 w-[110%] flex justify-between px-2">
                                    <div className={`px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white font-bold text-[11px] shadow-lg flex flex-col items-center gap-1`}>
                                        <ShieldCheck className={`w-5 h-5 text-white`} />
                                        SLA 保護
                                    </div>
                                    <div className={`px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white font-bold text-[11px] shadow-lg flex flex-col items-center gap-1`}>
                                        <CheckCircle2 className={`w-5 h-5 text-white`} />
                                        里程碑驗收
                                    </div>
                                    <div className={`px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white font-bold text-[11px] shadow-lg flex flex-col items-center gap-1`}>
                                        <Zap className={`w-5 h-5 text-white fill-current`} />
                                        AI 自動化
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col w-full mt-auto">
                                <ul className="space-y-0 w-full text-left border-t border-white/20 pt-2">
                                    {landingData.afterAdvantages.map((point, idx) => (
                                        <li key={idx} className={`flex items-start gap-4 text-white font-medium py-4 border-b border-white/20 text-[15px]`}>
                                            <CheckCircle2 className={`w-5 h-5 text-white shrink-0`} />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ---------------------------------------------------- */}
            {/* 4. 底部 CTA 橫幅 (Bottom CTA Banner) */}
            {/* ---------------------------------------------------- */}
            <section className="py-12 bg-[#F8FAFC]">
                <FadeIn delay={0.3} className="container mx-auto px-6 lg:px-12">
                    <div className={`${theme.bottomBanner} rounded-3xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl`}>
                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex w-16 h-16 bg-white/20 rounded-full items-center justify-center backdrop-blur-sm text-2xl">
                                🚀
                            </div>
                            <div className="text-white text-center md:text-left max-w-2xl">
                                <h2 className="text-2xl lg:text-3xl font-black mb-3 drop-shadow-sm">個人接案孤軍奮戰的時代，正式結束了。</h2>
                                <p className="text-white/90 font-medium text-lg leading-relaxed">
                                    對標世界頂尖職人頭腦的AGI團隊與您一起協作，立刻為您配置專屬的 AGI 團隊！提供專案各面向的建議與輔導，與您緊密協作，並主動補足個人接案、自由工作者、工作室、微型公司企業容易忽略的隱藏細節。
                                </p>
                            </div>
                        </div>
                        <Link 
                            href="/dashboard/settings?action=upgrade"
                            className={`shrink-0 px-8 py-4 bg-white ${theme.checkIcon} rounded-lg font-bold text-[15px] hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 shadow-lg`}
                        >
                            <Zap className={`w-4 h-4 ${theme.uiMain.replace('bg-', 'fill-')} ${theme.checkIcon}`} />
                            立即訂閱解鎖
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </FadeIn>
            </section>

            {/* ---------------------------------------------------- */}
            {/* 5. 常見問題 (FAQ) */}
            {/* ---------------------------------------------------- */}
            <section className={`py-24 relative border-t border-slate-200/60 ${theme.heroBg}`}>
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[100px]" />
                <FadeIn delay={0.2} className="container mx-auto px-6 lg:px-12 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-800 mb-4">常見問題 (FAQ)</h2>
                        <p className="text-slate-600 font-medium text-lg">快速了解 {mod.name} 能為您做些什麼。</p>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-6">
                        {landingData.faqs.map((faq, idx) => (
                            <div key={idx} className={`bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/50 transition-all hover:${theme.afterTitle.replace('text-', 'border-')}/40 hover:bg-white/90 hover:shadow-xl`}>
                                <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-start gap-2">
                                    <span className={`${theme.faqQ}`}>Q.</span>
                                    {faq.question}
                                </h3>
                                <p className="text-slate-600 font-medium pl-6 leading-relaxed">
                                    A: {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </section>

        </main>
    );
}
