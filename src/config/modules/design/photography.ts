import { BusinessModule } from '@/types/industries';

export const MODULE_PHOTOGRAPHY: BusinessModule = {
    id: 'photography',
    name: '攝影服務',
    description: '商業攝影、婚禮紀錄、產品拍攝、人像寫真',
    categoryId: 'design',
    tagline: '精修張數說清楚，版權使用範圍白紙黑字',
    targetUser: '商業攝影師、婚攝、產品攝影師',
    painPoints: ['精修張數爭議', '版權使用範圍不清', '場地問題責任歸屬'],
    corePrompt: `Role: 專業攝影師 (Professional Photographer)
    Profile: 你專精於商業、產品與活動攝影。你的專業涵蓋燈光佈置、構圖、後期修圖與客戶溝通。
    Focus: 影像品質、客戶需求與工作流效率。
    Task: 請提供詳細的攝影方案，包含拍攝清單、器材規格與交付時程。
    Reality Check: 主動提示客戶潛在風險並提出替代方案，確保每項投資都有清晰的 ROI 依據。
    Proposal Mindset: 所有報告與建議都應具備說服力——痛點共鳴、解決方案、ROI 分析、風險預警四段式結構。`,
    formConfig: {
        descriptionPlaceholder: "請描述拍攝主題、產品數量或活動流程 (Theme & Quantity)...",
        timelineLabel: "校片與交片時程 (Delivery Timeline)",
        timelinePlaceholder: "例如：後製 7 天、拍攝後次日挑片",
        stylePlaceholder: "例如：自然光、高對比、雜誌感、韓系證件照...",
        deliverablesLabel: "拍攝張數與交付規格 (Photo Specs)",
        deliverablesPlaceholder: "例如：精修 30 張、全數毛片調色、雲端交付...",
        customFields: [
            { name: "shootingHours", label: "預計拍攝時數", placeholder: "請選擇拍攝時段...", type: "select", options: ['2小時快拍 (單點/單面)', '4小時半天 (標準)', '8小時全天 (精實)', '兩天以上長期拍攝', '不定期巡迴拍攝'] },
            { name: "productCount", label: "拍攝組數/數量 (Count)", placeholder: "例如：10項產品, 3套服裝", type: "text" },
            { name: "locationNeeded", label: "拍攝場地需求", placeholder: "請選擇場地安排...", type: "select", options: ['客戶自備場地', '需代租專業攝影棚', '定點外景拍攝', '需跨地區進場拍攝', '不需場地 (僅後期)'] },
            { name: "editingLevel", label: "後期修圖等級", placeholder: "請選擇修稿深度...", type: "select", options: ['基礎校色與調光 (不修容)', '標準精修 (膚質、液化、基礎環境)', '高階廣告級合成 (合成、精細修稿)', '完全不需後製 (僅交付原片)'] },
            { name: "deliverableFormats", label: "交付項目與規格", placeholder: "請選擇交付項目 (可複選)...", type: "multi-select", options: ['全數調色毛片 (JPG)', '指定數量精修檔 (JPG)', '全數原始檔 (RAW)', '線上雲端相簿交付', '實體相本 / 輸出物', 'USB 實體備份交付'] },
            { name: "addServices", label: "現場額外服務與人力", placeholder: "如有需求請勾選...", type: "multi-select", options: ['造型師 (妝髮)', '專業模特兒媒合', '攝影助理 (燈光/側拍)', '道具準備與場景佈置', '空拍機支援'] },
        ]
    },
    aiPrompts: {
        reportGeneration: `你是一位資深商業攝影師。請根據客戶的產品特性與拍攝需求，生成一份攝影企劃書。內容需包含：拍攝風格定調 (Moodboard)、光影設定、場景與道具建議、以及預估的拍攝時數與修圖張數。

升級準則：報告採用四段式提案結構（痛點共鳴→解決方案→ROI 分析→風險預警），溝通時主動挑戰不合理需求，報價提供基礎/標準/企業三方案。`,
        customerChat: `你是專業攝影指導。溝通風格需注重細節且具備現場掌控力。當客戶要求「當天隨便多拍幾個不同感覺」時，需溫和但堅定地提醒時間與燈光切換的物理限制，並引導客戶聚焦於核心拍攝清單。`,
        quotationSuggestion: `請提供攝影專案報價建議。必須明確劃分「前期企劃/場勘費」、「拍攝執行費(按時/按日)」與「後期精修費(按張數)」。若有模特兒、妝髮或特殊場地租借需求，應列為代墊或由客戶實報實銷。`
    },
    reportTemplate: {
        structure: `# 商業攝影企劃提案\n\n## 1. 拍攝目標與核心視覺傳達\n\n## 2. 視覺風格與光影設定 (Moodboard)\n- 燈光風格 (如：硬光、柔光、自然光)：\n- 色彩計畫 (如：高對比、日系低飽和)：\n\n## 3. 場景設計與道具清單 (Props)\n\n## 4. 拍攝清單與分鏡草圖 (Shot List)\n\n## 5. 後期修圖標準與交付規格`,
        terminology: {
            'Moodboard': '情緒板 (用於對焦影像風格、色調與氛圍的參考圖庫)',
            'RAW檔': '相機感光元件記錄的未壓縮原始數據，保留最大後製空間，通常不直接交付給客戶',
            '精修 (Retouching)': '針對照片進行細部瑕疵修補（如修容、去背、合成），有別於僅調明暗的「基礎校色」'
        },
        analysisDimensions: ['影像視覺衝擊力', '產品細節還原度', '品牌風格一致性']
    },
    contractHighlights: {
        mustHaveClauses: ['修圖次數與範圍界定（如：精修照片提供 2 次微調，超出需加收費用；不接受無中生有的合成要求）', '版權與使用授權（照片著作財產權歸攝影師所有，授權客戶於約定之範圍內商業使用，若需買斷需另行議價）', '拍攝超時費用計算（若因客戶遲到或現場臨時增加拍攝項目導致超時，按小時計費）'],
        industrySpecificClauses: ['原檔不提供條款（除非另行購買，否則不提供未經後製之 RAW 檔或未選用之毛片）', '不可抗力延期條款（如因天候不佳導致外景無法拍攝，雙方協調延期之處理方式）'],
        acceptanceCriteria: ['依約定之風格與數量交付初調毛片供挑選', '依客戶選定之照片完成精修並交付高解析度檔案'],
        paymentMilestones: [
            { stage: '檔期保留訂金', percentage: 30, trigger: '合約簽署，確認拍攝日期與攝影棚' },
            { stage: '拍攝尾款', percentage: 50, trigger: '拍攝當日結束收工時支付' },
            { stage: '精修尾款', percentage: 20, trigger: '最終精修檔案確認並交付前' }
        ]
    },
    quotationConfig: {
        categoryName: '攝影與影像服務',
        unit: '組/時',
        terminology: { '客戶': '委託方', '我們': '攝影團隊' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "您好，我是攝影總監。一張好的商業照片不只是把東西拍清楚，更要能勾起消費者的渴望。為了準備最適合的燈光跟道具，請告訴我這次產品想呈現出什麼樣的『氛圍』？",
        discoveryQuestions: ['這些照片最終會用在哪裡？（例如：大型戶外看板、電商商品頁、還是 IG 社群貼文？）', '您有準備好這次必須拍攝的具體清單 (Shot List) 嗎？還是希望由我們來規劃？', '拍攝現場會有貴公司的人員來擔任美術指導 (Art Director) 即時看畫面嗎？'],
        objectionHandling: {
            '為什麼只是按個快門收費這麼高？': '您付費買的不是『按快門』的那一秒，而是我們為了那一秒所準備的百萬級別燈光器材、十年的打光經驗，以及後續能把產品修飾到完美無瑕的高階修圖技術。',
            '可以把所有拍失敗的毛片也都給我嗎？': '身為專業攝影師，我們有責任控管產出的影像品質。未經處理或未達標準的毛片無法代表我們的專業水準，因此我們僅交付經過初步篩選與校色的照片供您挑選。'
        },
        closing: "了解您的需求了。我會先整理一份包含『光影風格』與『推薦道具』的 Moodboard 給您，確認感覺對了，我們再來確認具體的拍攝時數與報價。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '需求訪談與風格定調 (Moodboard)', type: 'internal', duration: '3 天', assignee: 'Photographer' },
            { name: '場地勘查與道具準備', type: 'internal', duration: '1 週', assignee: 'Producer/Stylist' },
            { name: '現場拍攝執行', type: 'internal', duration: '1-2 天', assignee: 'Photography Team' },
            { name: '毛片初步校色與匯出供挑選', type: 'internal', duration: '3 天', assignee: 'Photographer' },
            { name: '客戶挑片與確認精修方向', type: 'external', duration: '3 天', assignee: 'Client' },
            { name: '高階精修與合成', type: 'internal', duration: '1-2 週', assignee: 'Retoucher' },
            { name: '最終高解析檔案交付', type: 'internal', duration: '1 天', assignee: 'Photographer' }
        ],
        milestones: [
            { label: '企劃與風格確認', order: 1 },
            { label: '拍攝日執行', order: 2 },
            { label: '毛片挑選完成', order: 3 },
            { label: '精修完稿交付', order: 4 }
        ],
        workflow: {
            diagram: "graph TD\\n  A[風格定調與前置作業] --> B[現場拍攝]\\n  B --> C[初調毛片產出]\\n  C --> D[客戶挑片]\\n  D --> E[精細修圖]\\n  E --> F[完稿交付]",
            description: "強調前置作業的完整性，確保拍攝當日高效率執行，並透過標準化的挑片流程控制後製時間。"
        }
    },
    defaultItems: [
        { description: '商業/產品拍攝費用 (按時數/組數) (Shooting Fee)', quantity: 1, unitPrice: 18000 },
        { description: '高階廣告級精修 (按張數) (High-end Retouching)', quantity: 1, unitPrice: 12000 },
        { description: '專業影棚租賃與道具準備 (Studio & Props)', quantity: 1, unitPrice: 5000 },
        { description: '授權費用 (商業廣告展示權) (Usage Rights)', quantity: 1, unitPrice: 10000 },
    ],
    projectTypes: [
        { id: 'commercial_photo', label: '📸 商業攝影 (Commercial)', description: '企業形象、大型專案、看板廣告' },
        { id: 'product_commercial', label: '📦 產品商攝 (Product)', description: '電商產品、情境展示、化妝品渲染感' },
        { id: 'wedding_photo', label: '💍 婚禮紀錄 (Wedding)', description: '婚禮攝影、婚紗拍攝' },
        { id: 'portrait_photo', label: '👤 人像寫真 (Portrait)', description: '個人寫真、形象照、證件照' },
    ],
};
