import { BusinessModule } from '@/types/industries';

export const MODULE_PR_AGENCY: BusinessModule = {
    id: 'pr_agency',
    name: '公關公司與活動行銷',
    description: '媒體關係、記者會規劃、危機處理、品牌活動',
    categoryId: 'marketing',
    tagline: '掌握話語權，讓品牌價值被看見',
    targetUser: '公關顧問、活動公關公司、行銷專案經理',
    painPoints: ['媒體曝光效果難量化', '現場突發狀況多', '新聞稿石沉大海'],
    corePrompt: `Role: 資深公關顧問與活動策劃專家 (Senior PR Consultant)
    Profile: 你是一位在公共關係與大型活動行銷領域擁有豐富經驗的專家。擅長媒體策略、記者會操作、KOL 合作與品牌影響力塑造。
    Focus: 媒體溝通、專案時效性、品牌調性一致性與危機預防。
    Task: 請根據客戶目標與預算，提供完整的 PR 執行方案，包含媒體名單建議、活動亮點設計、新聞發布流程與 KPI 預估。
    Reality Check: 主動提示客戶潛在風險並提出替代方案，確保每項投資都有清晰的 ROI 依據。
    Proposal Mindset: 所有報告與建議都應具備說服力——痛點共鳴、解決方案、ROI 分析、風險預警四段式結構。`,
    formConfig: {
        descriptionPlaceholder: "請描述活動主題、目標受眾與預期宣傳目的 (PR Goals)...",
        timelineLabel: "預計活動/新聞發布日期",
        timelinePlaceholder: "例如：2024/10/24 新品上市記者會",
        stylePlaceholder: "例如：專業權威、感性人心、潮流科技、精緻奢華...",
        deliverablesLabel: "PR 執行項目清單 (PR Deliverables)",
        deliverablesPlaceholder: "例如：新聞稿撰寫、媒體邀請、KOL 合作、現場活動統籌...",
        customFields: [
            { name: "mediaType", label: "目標媒體類型", placeholder: "請選擇重點媒體...", type: "multi-select", options: ['主流報章雜誌', '財經/專業媒體', '生活/休閒媒體', '網路新聞門戶', '社群媒體/KOL', '電視媒體'] },
            { name: "eventType", label: "活動形式限制", placeholder: "請選擇活動形式...", type: "select", options: ['實體大型記者會', '線上虛擬發表會', '媒體小聚/餐敘', '快閃店/街頭活動', '純數位公關操盤'] },
            { name: "crisisPrep", label: "危機預防需求", placeholder: "是否需要危機處理方案？", type: "select", options: ['基礎 PR 規範', '深度危機處理手冊', '負面輿情監控系統', '暫不需要'] },
            { name: "kolStrategy", label: "KOL/影響者策略", placeholder: "請選擇合作偏好...", type: "multi-select", options: ['百萬大網紅 (Awareness)', '領域小眾專家 (Trust)', '微影響者量產 (Volume)', '不需 KOL 合作'] },
        ]
    },
    aiPrompts: {
        reportGeneration: `你現在是資深公關總監。請分析客戶需求，產出一份包含：媒體亮點分析、活動流程概要、預期曝光管道與危機預防建議的 PR 提案報告。請使用專業且具說服力的公關語彙。

升級準則：報告採用四段式提案結構（痛點共鳴→解決方案→ROI 分析→風險預警），溝通時主動挑戰不合理需求，報價提供基礎/標準/企業三方案。`,
        customerChat: `你現在是專業的公關經理。在與客戶溝通時，請展現對媒體環境的敏銳度，並主動詢問活動的「新聞價值」與「目標受眾」，給予即時的專業建議。`,
        quotationSuggestion: `請根據計畫的媒體廣度與活動規模，建議合理的公關稿件費、車馬費代理、活動執行費與媒體監測費用。`
    },
    reportTemplate: {
        structure: `# 公關活動與媒體溝通提案報告\n\n## 1. 專案背景與公關目標 (PR Objectives)\n\n## 2. 媒體切角與新聞價值分析 (News Angle)\n\n## 3. 活動形式與亮點規劃 (Event Highlights)\n\n## 4. 媒體與 KOL 邀請名單策略\n\n## 5. 危機預防與應變措施 (Issue Management)\n\n## 6. 預期曝光效益與 PR Value 評估`,
        terminology: {
            'PR Value': '公關價值 (通常以廣告版面等效價值乘上特定倍數計算出的曝光效益)',
            'Press Kit': '媒體公關包 (提供給記者的資料，包含新聞稿、高解析圖片、產品介紹等)',
            'Embargo': '新聞發布解禁時間 (要求記者在特定時間點之後才能發布新聞的約定)'
        },
        analysisDimensions: ['品牌形象契合度', '新聞議題延展性', '媒體出席意願', '潛在負面輿情風險']
    },
    contractHighlights: {
        mustHaveClauses: ['媒體出席與曝光免責條款（因天災、突發重大社會事件導致媒體缺席或未報導，乙方不負違約責任）', '代墊款項處理原則（如場地費、餐飲費、媒體車馬費，需約定由何方代墊及結算方式）', '保密協定 (NDA)（對於未公開的新產品資訊負有嚴格保密義務）'],
        industrySpecificClauses: ['突發危機處理時數上限（若發生非乙方造成之公關危機，協助處理之額外工時需另計費）', '發言人授權條款（乙方不代表甲方對外發言，所有正式對外聲明需經甲方確認）', '媒體露出監測期限（通常為活動結束後 2-4 週內）'],
        acceptanceCriteria: ['如期舉辦記者會或發布新聞稿', '提供活動結案報告與媒體露出剪報', '達成約定之基本保證曝光數 (如有約定)'],
        paymentMilestones: [
            { stage: '簽約與專案啟動', percentage: 40, trigger: '合約簽署，啟動媒體名單盤點與新聞稿撰寫' },
            { stage: '活動前置作業', percentage: 40, trigger: '活動前 14 天，支付場地等硬體前置費用' },
            { stage: '結案報告交付', percentage: 20, trigger: '活動結束且交付媒體露出報告' }
        ]
    },
    quotationConfig: {
        categoryName: '公關專案執行',
        unit: '專案',
        terminology: { '客戶': '品牌方', '我們': '公關代理商 (PR Agency)' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "您好，我是公關策略顧問。公關操作的核心在於『借力使力』，把您的品牌故事轉化為社會大眾與媒體有興趣的『新聞』。這次的專案，您最想傳遞給大眾的核心訊息是什麼？",
        discoveryQuestions: ['這個產品/活動與市面上的競品相比，最具「獨特性」或「第一」的點在哪裡？', '過去貴品牌是否有經歷過負面新聞或公關危機？目前的品牌形象定位為何？', '這次的預算結構中，是否有包含硬體場地佈置、名人代言費，還是純粹的公關操作費？'],
        objectionHandling: {
            '為什麼不能保證蘋果日報或某大媒體一定會報': '新聞媒體具備獨立編採權，我們能做的是透過精準的新聞切角、我們長期的媒體關係與完整的 Press Kit，極大化報導的機率。但若當天發生重大社會新聞（如地震、選舉），娛樂或消費新聞的版面必然會被壓縮，這是不可控的風險。',
            '辦一場記者會太貴了，發發新聞稿不行嗎': '如果預算有限，純發新聞稿確實是選項。但記者會的價值在於「體驗」與「創造畫面」。透過精心設計的現場互動與名人站台，能讓文字記者寫出更深度的報導，讓攝影記者拍到吸睛的照片，這些是單純的新聞稿無法達到的擴散效力。'
        },
        closing: "非常了解。我會先為您草擬三個不同的『新聞切角 (Angles)』，並評估最適合的媒體線路，一週內為您提交完整的公關操作提案。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '新聞切角企劃與媒體策略', type: 'internal', duration: '1 週', assignee: 'PR Director' },
            { name: '新聞稿撰寫與 Press Kit 準備', type: 'internal', duration: '1-2 週', assignee: 'PR Specialist' },
            { name: '媒體名單擬定與發送邀請 (Pitching)', type: 'internal', duration: '2 週', assignee: 'PR Executive' },
            { name: '活動場地勘查與硬體發包', type: 'external', duration: '3 週', assignee: 'Event Manager' },
            { name: '記者會/活動現場執行', type: 'internal', duration: '1 天', assignee: 'PR Team' },
            { name: '會後新聞稿發布與媒體追蹤', type: 'internal', duration: '1-3 天', assignee: 'PR Executive' },
            { name: '媒體露出監測與結案報告', type: 'internal', duration: '2 週', assignee: 'PR Specialist' }
        ],
        milestones: [
            { label: '公關策略與新聞稿定稿', order: 1 },
            { label: '媒體名單確認與發出邀請', order: 2 },
            { label: '記者會/活動圓滿落幕', order: 3 },
            { label: '結案報告與 PR Value 結算', order: 4 }
        ],
        workflow: {
            diagram: "graph TD\\n  A[策略擬定與新聞切角] --> B[媒體邀請與物料準備]\\n  B --> C[活動現場執行]\\n  C --> D[會後新聞發送與 Follow-up]\\n  D --> E[媒體露出監測]\\n  E --> F[結案檢討與關係維護]",
            description: "採用高強度的時效性專案管理，確保在新聞熱點期間達到最大曝光。"
        }
    },
    defaultItems: [
        { description: 'PR 年度策略與品牌聲譽規劃 (Strategy)', quantity: 1, unitPrice: 100000 },
        { description: '新聞稿撰寫、發布與媒體追蹤 (Press Release)', quantity: 1, unitPrice: 35000 },
        { description: '記者會/活動現場策劃與執行 (Event Mgmt)', quantity: 1, unitPrice: 150000 },
        { description: 'KOL/影響者媒合與合作管理 (Influencer)', quantity: 1, unitPrice: 50000 },
        { description: '媒體露出監測與结案報告 (Reporting)', quantity: 1, unitPrice: 20000 },
    ],
    projectTypes: [
        { id: 'press_conference', label: '🎤 記者會與發表會 (Press Event)', description: '新品上市、合作簽約、品牌發布' },
        { id: 'media_pitch', label: '📰 媒體關係維護 (Media Pitch)', description: '長效聲譽管理、專題報導操作' },
        { id: 'crisis_management', label: '🛡️ 危機公關處理 (Crisis PR)', description: '即時應變、負面排除、聲譽修復' },
    ],
};
