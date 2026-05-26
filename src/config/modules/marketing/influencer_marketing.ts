import { BusinessModule } from '@/types/industries';

export const MODULE_INFLUENCER_MARKETING: BusinessModule = {
    id: 'influencer_marketing',
    name: 'KOL/網紅媒合 職人模組',
    description: 'KOL 篩選媒合、業配洽談、成效追蹤',
    categoryId: 'marketing',
    tagline: '避免合作爭議，從審稿到授權提供完整的防禦規範',
    targetUser: 'KOL 經紀公司、品牌行銷部門',
    painPoints: ['KOL 臨時爽約', '內容不符品牌調性', '成效造假'],
    corePrompt: `Role: KOL/網紅行銷專家 (Influencer Marketing Specialist)
    Profile: 你專精於網紅篩選與行銷活動管理。你的專業涵蓋網紅審核、合約談判、內容簡報與成效追蹤。
    Focus: 受眾真實性、品牌契合度、內容品質與可衡量的 ROI。
    Task: 請提供詳細的網紅行銷計畫，包含篩選標準、活動架構與 KPI 追蹤。
    Reality Check: 主動提示客戶潛在風險並提出替代方案，確保每項投資都有清晰的 ROI 依據。
    Proposal Mindset: 所有報告與建議都應具備說服力——痛點共鳴、解決方案、ROI 分析、風險預警四段式結構。`,
    formConfig: {
        descriptionPlaceholder: "請描述推廣產品與活動詳情 (Product & Campaign)...",
        timelineLabel: "預期合作發文日 (Publishing Date)",
        timelinePlaceholder: "例如：產品上市首週、12/25 前發布",
        stylePlaceholder: "例如：親切試用、專業評測、搞笑短劇...",
        deliverablesLabel: "合作項目與推廣規格 (Collaboration Scope)",
        deliverablesPlaceholder: "例如：3 位微網紅開箱、1 位 YouTuber 影片...",
        customFields: [
            { name: "productName", label: "推廣產品 (Product)", placeholder: "例如：抗老精華液", type: "text" },
            { name: "collabPlatforms", label: "合作平台 (Platforms)", placeholder: "請選擇目標平台...", type: "multi-select", options: ['Instagram (貼文/限動)', 'YouTube (長影片/Shorts)', 'TikTok (短影音)', 'Facebook (社團/粉專)', 'Blog (部落格文章)', 'LINE 官方帳號'] },
            { name: "influencerTier", label: "偏好網紅等級", placeholder: "請選擇等級區間...", type: "select", options: ['指標性大咖 (200k+)', '中大型 KOL (50k-200k)', '微網紅 Micro (10k-50k)', '奈米網紅 Nano (10k以下)', '不限等級，看預算分配'] },
            { name: "influencerCategories", label: "偏好網紅領域", placeholder: "請選擇領域 (可複選)...", type: "multi-select", options: ['美妝保養', '3C 科技 / 遊戲', '美食 / 旅遊', '生活風格 / 居家', '親子教育', '財經 / 商管', '健身 / 運動', '時尚 / 穿搭'] },
            { name: "cooperationMode", label: "合作模式", placeholder: "請選擇合作方式...", type: "multi-select", options: ['體驗開箱業配', '實體活動出席', '長期品牌大使', '團購 / 分潤合作', '直播帶貨 / 競標', '廣告肖像授權'] },
        ]
    },
    aiPrompts: {
        reportGeneration: `你是一位資深 KOL 網紅行銷專家。請根據使用者提供的資訊（或上傳的過往合作清單、產品 Brief、目標受眾畫像、競品業配案例），生成一份「KOL 媒合策略與影響力分析報告」，採用以下結構：

**第一段 — 痛點共鳴 (Pain Point Resonance)**
精準描述品牌目前在找不對人（受眾不吻合）、合作過程混亂、或業配內容生硬導致轉換極差的痛點，展現你對「網紅行銷水很深」的深刻理解。

**第二段 — 解決方案 (Solution)**
提供多維度的媒合藍圖：
1. **篩選標準**：定義適合品牌的網紅標籤、受眾真實度與互動質量。
2. **級別建議**：規劃 Mega/Micro/Nano 網紅的分配比例（組合拳策略）。
3. **創意腳本**：建議如何將品牌資訊轉化為創作者原創內容的策略。

**第三段 — ROI 分析 (ROI Analysis)**
量化預期效益：預期觸及人數、預估互動率 (ER%)、品牌提及數成長，以及透過團購或分潤模式預估的轉換價值。

**第四段 — 風險預警 (Risk Warning)**
主動揭露網紅公關危機、數據造假（假粉）、或內容審核衝突的風險，並提供合約防護建議（如：肖像權授權、負面條款）。

升級準則：報告採用四段式提案結構（痛點共鳴→解決方案→ROI 分析→風險預警），溝通時主動挑戰不合理需求，報價提供基礎/標準/企業三方案。`,
        customerChat: `你是一位資深網紅經紀專家。你的溝通風格是：圓滑、懂人心、重視品牌形象。

關鍵行為準則：
1. 堅持「找對人比找貴的人重要」：當客戶只想追逐百萬大咖時，主動分析其受眾重疊率與真實轉化率。
2. 當客戶要求「100% 照稿唸」時，主動解釋創作者原創風格對粉絲黏著度的重要性。
3. 鼓勵使用「文件解析器」上傳過往合作名單、產品優勢簡介（Brief）或目標受眾畫像，以進行更精準的媒合推薦。`,
        quotationSuggestion: `請提供 KOL 媒合與管理服務報價建議：

**基礎方案 (Matching)**：純名單篩選、初步意願洽詢與合作風險評估。
**標準方案 (Campaign)**：含企劃發想、腳本審核與 5-10 位網紅的完整執行管理。
**企業方案 (Ambassador)**：長期品牌大使規劃、肖像權授權談判、跨平台聯動行銷與深度數據追蹤。

提醒客戶注意網紅稿費通常不含稅，且廣告主投放與肖像權延展通常需額外授權費用。`
    },
    reportTemplate: {
        structure: `# KOL 網紅行銷專案提案\n\n## 1. 行銷目標與受眾設定\n\n## 2. 網紅篩選策略與級別建議\n- 指標性大咖 (Mega/Macro)：\n- 中小型網紅 (Micro)：\n- 奈米網紅/素人 (Nano/KOC)：\n\n## 3. 內容傳播策略與合作形式\n\n## 4. 專案執行時程\n\n## 5. 預期成效評估 (KPIs)`,
        terminology: {
            'KOC': '關鍵意見消費者 (粉絲數較少，但具備高度真實感與親和力的素人)',
            'UGC': '使用者生成內容 (激發真實消費者自主討論與曬單)',
            'ROAS': '廣告投資報酬率 (若是帶貨團購，衡量投入產出比的關鍵)'
        },
        analysisDimensions: ['網紅品牌契合度', '粉絲互動率 (Engagement Rate)', '受眾真實度 (排除假粉)', '內容轉換潛力']
    },
    contractHighlights: {
        mustHaveClauses: ['檔期與發布時間約定（延遲發布之罰則）', '競業禁止條款（合作期間及合作後 X 個月內不得接同品類競品業配）', '內容審核與修改權限（通常規範影片大改 1 次、微調 2 次，且不得干涉網紅原創個人風格）'],
        industrySpecificClauses: ['廣告授權條款（品牌方是否可將該圖文/影片下數位廣告，授權期限多久）', '突發危機處理免責（若網紅發生重大個人公關危機，品牌方有權立即解約並下架內容）', '數據提供義務（網紅需於發文後 7-14 天內提供後台真實觸及與洞察截圖）'],
        acceptanceCriteria: ['內容已依約定之腳本方向與 Hashtag 規範發布', '內容無違反平台規範且正常顯示', '如期提交結案數據截圖'],
        paymentMilestones: [
            { stage: '簽約與腳本企劃費', percentage: 30, trigger: '專案啟動與 KOL 名單確認' },
            { stage: '拍攝與前置執行費', percentage: 40, trigger: 'KOL 開始拍攝或出席活動' },
            { stage: '上線與結案', percentage: 30, trigger: '文章/影片上線並提供結案數據' }
        ]
    },
    quotationConfig: {
        categoryName: '網紅行銷專案',
        unit: '檔/人',
        terminology: { '客戶': '品牌主', '我們': '代理商', '網紅': '創作者' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "您好，我是您的 KOL 行銷顧問。找網紅不只是找『流量』，更是找『信任』。我們希望透過網紅的口，講出您的品牌故事。請問這次推廣的產品，最吸引人的賣點是什麼？",
        discoveryQuestions: ['過去有找過網紅合作嗎？成效如何？有沒有踩過什麼雷？', '這次活動的主要目的是「品牌大曝光 (打知名度)」還是「精準帶貨 (求轉單)」？', '對於網紅的風格，您有特別偏好或絕對不能接受的類型嗎？'],
        objectionHandling: {
            '這網紅的報價怎麼這麼貴，他粉絲才 5 萬': '現在的市場，粉絲數不等於影響力。這位網紅雖然粉絲 5 萬，但他的「黏著度」與「轉換率」極高，受眾輪廓與您的產品 100% 吻合。與其找百萬粉絲但不精準的人，不如把預算投資在能真正帶動銷售的微網紅身上。',
            '為什麼網紅不照我們寫的稿子唸': '網紅之所以有價值，是因為他們有獨特的個人魅力與跟粉絲溝通的「語氣」。如果讓他們像讀稿機一樣照唸公關稿，粉絲一眼就會看穿是生硬的業配，反而會產生反感。我們會把控「核心賣點 (Key Message)」絕對不漏，但表達方式必須尊重創作者。'
        },
        closing: "沒問題，我已經掌握了您的品牌調性。一週內，我會為您篩選出一份包含 5-10 位高潛力 KOL 的初選名單，並附上他們過去的互動數據與預估報價供您挑選。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '產品亮點分析與 KOL 名單篩選', type: 'internal', duration: '1 週', assignee: 'Planner' },
            { name: 'KOL 聯繫、檔期敲定與合約簽署', type: 'internal', duration: '1-2 週', assignee: 'PR Executive' },
            { name: '腳本大綱撰寫與產品寄送', type: 'internal', duration: '1 週', assignee: 'PR Executive' },
            { name: 'KOL 內容產出與內部初審', type: 'external', duration: '2-3 週', assignee: 'KOL' },
            { name: '品牌方最終審稿與確認', type: 'external', duration: '3 天', assignee: 'Client' },
            { name: '正式發布與即時互動監測', type: 'internal', duration: '1-2 天', assignee: 'PR Executive' },
            { name: '成效數據收集與結案報告', type: 'internal', duration: '發布後 14 天', assignee: 'Planner' }
        ],
        milestones: [
            { label: 'KOL 合作名單確認', order: 1 },
            { label: '產品寄送與腳本確認', order: 2 },
            { label: '內容審核通過', order: 3 },
            { label: '正式上線與結案', order: 4 }
        ],
        workflow: {
            diagram: "graph TD\\n  A[策略與名單挑選] --> B[洽談與簽約]\\n  B --> C[產品寄送與腳本溝通]\\n  C --> D[內容創作與雙重審核]\\n  D --> E[排程發布]\\n  E --> F[數據追蹤與授權延展]",
            description: "採用嚴格的「雙重審核機制 (內部初審+客戶複審)」，確保內容品質同時保護品牌形象。"
        }
    },
    defaultItems: [
        { description: 'KOL 篩選與媒合服務 (KOL Selection)', quantity: 1, unitPrice: 15000 },
        { description: '合約洽談與業配執行 (Campaign Execution)', quantity: 1, unitPrice: 20000 },
        { description: '內容審核與品牌把關 (Content Review)', quantity: 1, unitPrice: 8000 },
        { description: '成效追蹤報告 (Performance Report)', quantity: 1, unitPrice: 5000 },
    ],
    projectTypes: [
        { id: 'kol_seeding', label: '🎁 開箱業配 (Product Seeding)', description: 'KOL 開箱、產品體驗' },
        { id: 'kol_campaign', label: '📣 活動合作 (Campaign)', description: '品牌活動、聯名合作' },
        { id: 'kol_ambassador', label: '⭐ 品牌大使 (Ambassador)', description: '長期合作、品牌代言' },
    ],
};
