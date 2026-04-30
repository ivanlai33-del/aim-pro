import { BusinessModule } from '@/types/industries';

export const MODULE_SEO: BusinessModule = {
    id: 'seo',
    name: 'SEO 與搜尋策略',
    description: '網站 SEO 優化、關鍵字策略、內容撰寫',
    categoryId: 'marketing',
    tagline: '白帽 SEO，長期排名，成效透明',
    targetUser: 'SEO 顧問、數位行銷公司',
    painPoints: ['排名承諾被濫用', '成效週期長客戶沒耐心', '白帽/黑帽爭議'],
    corePrompt: `Role: SEO 搜尋引擎優化專家 (SEO Specialist)
    Profile: 你具備技術 SEO、內容策略與連結建設的專業知識。你的目標是提升搜尋排名、自然流量成長與轉換率優化。
    Focus: 技術檢測、關鍵字研究、內容優化與反向連結策略。
    Task: 請提供可執行的 SEO 建議，並列出明確的優先順序與預期成效時程。
    Reality Check: 主動提示客戶潛在風險並提出替代方案，確保每項投資都有清晰的 ROI 依據。
    Proposal Mindset: 所有報告與建議都應具備說服力——痛點共鳴、解決方案、ROI 分析、風險預警四段式結構。`,
    formConfig: {
        descriptionPlaceholder: "請描述網站現況與流量目標 (Current Status & Goals)...",
        styleLabel: "市場參考與競爭對手 (Competitors)",
        stylePlaceholder: "請提供您觀察中的市場參考，例如：\n• 競爭對手：主要競品官網 A、內容經營標竿 B\n• 參考網站：希望參考某些網站的內容架構或排版方式\n• 目標市場：在地化搜尋 (如：台北咖啡廳) 或 全域搜尋 (如：電商平台)",
        timelineLabel: "預期達標時程 (Expected Result)",
        timelinePlaceholder: "例如：三個月內關鍵字導入、半年進首頁",
        deliverablesLabel: "優化項目與預期產出 (Deliverables)",
        deliverablesPlaceholder: "例如：關鍵字排名優化、網站速度提升、內容行銷...",
        customFields: [
            { name: "currentWebsite", label: "現有網站 (Website URL)", placeholder: "https://", type: "text" },
            { name: "websiteStatus", label: "網站現況", placeholder: "請選擇網站狀態...", type: "select", options: ['全新建置 (尚未上線)', '現有網站但排名不佳', '網站剛改版/換網址', '關鍵字流量大幅下滑', '內容多但無轉化', '僅需技術維修調教'] },
            { name: "seoFocus", label: "SEO 優化焦點", placeholder: "請選擇優化重點 (可複選)...", type: "multi-select", options: ['技術 SEO (網站健檢)', '內容行銷 (部落格策略)', '關鍵字排名優化', '外部連結開發 (Backlinks)', '在地搜尋 (Google Map)', '轉化率優化 (CRO)'] },
            { name: "searchEngines", label: "目標搜尋引擎", placeholder: "請選擇目標平台...", type: "multi-select", options: ['Google (主要)', 'Bing (微軟)', 'LINE 搜尋', '百度 / 小紅書 (特定市場)', 'YouTube 搜尋'] },
            { name: "analyticsStatus", label: "數據追蹤安裝狀態", placeholder: "請選擇追蹤現況...", type: "select", options: ['已安裝並正確設定 GA4 & GSC', '已安裝但數據可能不準', '僅安裝 GA4 / GSC 其中一項', '完全未安裝追蹤工具', '僅使用廣告追蹤碼'] },
            { name: "targetKeywords", label: "目標關鍵字 (Keywords)", placeholder: "例如：台中 咖啡廳, 台北 健身房", type: "textarea" },
            { name: "competitors", label: "主要競爭對手 (Competitors)", placeholder: "例如：對手A, 對手B", type: "text" }
        ]
    },
    aiPrompts: {
        reportGeneration: 
        升級準則：報告採用四段式提案結構（痛點共鳴→解決方案→ROI 分析→風險預警），溝通時主動挑戰不合理需求，報價提供基礎/標準/企業三方案。`你是一位資深白帽 SEO 顧問。請根據客戶網站現況與目標關鍵字，生成一份 SEO 健檢與優化藍圖報告。內容須包含：技術端健檢 (Technical SEO)、內容策略 (Content Marketing) 以及外部權重建立 (Off-page SEO) 的具體執行項目。
        升級準則：報告採用四段式提案結構（痛點共鳴→解決方案→ROI 分析→風險預警），溝通時主動挑戰不合理需求，報價提供基礎/標準/企業三方案。`,
        customerChat: `你是一位注重長期效益的 SEO 專家。溝通時必須管理客戶期望，明確告知 SEO 是馬拉松而非百米衝刺（通常需要 3-6 個月才能看到顯著成效）。面對要求「保證第一頁」的客戶，需以專業說明 Google 演算法的不可控性。`,
        quotationSuggestion: `請提供 SEO 專案報價建議。可分為「單次網站健檢與調校費 (Technical SEO Audit)」與「每月固定維護與內容撰寫費 (Monthly Retainer)」。清楚標示每月包含幾篇 SEO 文章及幾組關鍵字追蹤。`
    },
    reportTemplate: {
        structure: `# SEO 搜尋引擎優化健檢與策略報告\n\n## 1. 網站現況與關鍵字排名基準\n\n## 2. 技術 SEO 健檢問題與修復清單\n- 網站速度與 Core Web Vitals：\n- 爬蟲與索引問題 (Crawling & Indexing)：\n- 行動裝置友善度：\n\n## 3. 關鍵字策略與架構 (Keyword Mapping)\n\n## 4. 內容行銷與文章產出計畫\n\n## 5. 預期成效里程碑 (3 / 6 / 12 個月)`,
        terminology: {
            'Technical SEO': '技術 SEO (改善網站架構，讓 Google 爬蟲更容易讀取您的網站)',
            'Long-tail Keywords': '長尾關鍵字 (搜尋量較低但意圖非常精準的字詞，如"台北信義區平價義大利麵")',
            'Backlinks': '反向連結 (其他網站連到您的網站，如同對您的網站投下信任票)'
        },
        analysisDimensions: ['網站健康度', '關鍵字搜尋意圖', '內容豐富度', '網域權重 (DA/DR)']
    },
    contractHighlights: {
        mustHaveClauses: ['排名不保證條款（明確聲明 Google 演算法非乙方可控，不保證特定關鍵字絕對排名）', '網站修改權限與配合條款（客戶需提供網站後台權限，或請工程團隊配合修改技術項目）', '合約最低期限（通常為 6 個月或 1 年，確保策略有時間發酵）'],
        industrySpecificClauses: ['白帽 SEO 聲明（承諾不使用購買黑帽連結等違規手法，保護網域免受懲罰）', '原創內容版權歸屬（乙方代寫之 SEO 文章，於合約期滿或付清款項後，著作財產權歸客戶所有）', '成效衡量基準（以 Google Search Console 的自然曝光與點擊為準，排除品牌字）'],
        acceptanceCriteria: ['完成期初技術健檢報告並提交修復清單', '每月依約定篇數交付 SEO 原創文章', '每月提供 GSC 排名與流量變化報表'],
        paymentMilestones: [
            { stage: '期初健檢與策略費', percentage: 100, trigger: '合約簽署，交付首次技術健檢與關鍵字藍圖' },
            { stage: '月度執行費', percentage: 100, trigger: '按月收取，交付文章與成效報告' }
        ]
    },
    quotationConfig: {
        categoryName: 'SEO 優化專案',
        unit: '月',
        terminology: { '客戶': '業主', '我們': 'SEO 顧問' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "您好，我是您的 SEO 顧問。SEO 就像是幫您的網站在 Google 買房地產，一開始打地基很辛苦，但一旦蓋好，未來帶來的都是免費且精準的自然流量。您的網站目前有遇過什麼搜尋排名上的痛點嗎？",
        discoveryQuestions: ['您的客戶通常會搜尋什麼字眼來找到您的服務或產品？', '您目前有專門負責撰寫部落格或最新消息的人員嗎？還是需要我們代筆？', '如果現有網站的架構非常老舊，您能接受進行一定程度的改版，甚至重建嗎？'],
        objectionHandling: {
            '為什麼要等半年才看得到效果，廣告馬上就有單了': '廣告是「租房子」，只要停止付費，流量瞬間歸零。SEO 是「買房子」，雖然前幾個月都在打地基跟裝潢，但排名上去後，這些流量都是免費且持續的。成熟的品牌一定都是廣告與 SEO 雙管齊下。',
            '別家保證一個月上第一頁，你們為什麼不保證': '保證排名的通常是使用「黑帽」作弊手法，或是挑選根本沒人搜尋的冷門字。Google 演算法經常更新，一旦被抓到作弊，您的網站會被永久懲罰 (De-indexed)。我們堅持白帽手法，保障您品牌的長期資產。'
        },
        closing: "了解！接下來我會先使用專業工具對您的網站進行一次「快速健檢」，抓出最嚴重的技術阻礙，並挑出 3-5 個具有潛力的機會關鍵字，提供給您參考。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '網站深度技術健檢 (Technical Audit)', type: 'internal', duration: '2 週', assignee: 'SEO Specialist' },
            { name: '關鍵字研究與 Keyword Mapping', type: 'internal', duration: '1 週', assignee: 'SEO Specialist' },
            { name: '技術問題修復 (與工程師協作)', type: 'external', duration: '2-4 週', assignee: 'Client Dev Team' },
            { name: '每月 SEO 文章撰寫與上架', type: 'internal', duration: 'Ongoing', assignee: 'SEO Copywriter' },
            { name: '在地商家 (Google Map) 優化', type: 'internal', duration: '1 週', assignee: 'SEO Specialist' },
            { name: '月度數據追蹤與排名報告', type: 'internal', duration: '3 天', assignee: 'SEO Specialist' }
        ],
        milestones: [
            { label: '期初技術健檢與修復建議交付', order: 1 },
            { label: '關鍵字藍圖與內容行事曆確認', order: 2 },
            { label: 'GSC 爬蟲收錄與初始排名提升', order: 3 },
            { label: '核心關鍵字進入第一頁', order: 4 }
        ],
        workflow: {
            diagram: "graph TD\\n  A[網站健檢與關鍵字分析] --> B[技術端修復 (Tech SEO)]\\n  B --> C[內容產出與優化 (Content)]\\n  C --> D[外部連結建立 (Off-page)]\\n  D --> E[成效監測與策略迭代]",
            description: "採用「技術打底 -> 內容擴充 -> 權重建立」的長期飛輪策略。"
        }
    },
    defaultItems: [
        { description: '網站技術健檢與優化建議 (Technical Audit)', quantity: 1, unitPrice: 10000 },
        { description: '關鍵字策略研究報告 (Keyword Research)', quantity: 1, unitPrice: 8000 },
        { description: 'SEO 優化文章撰寫 (Content Writing x 4)', quantity: 4, unitPrice: 5000 },
        { description: '外部連結建設 (Backlink Building)', quantity: 1, unitPrice: 15000 },
    ],
    projectTypes: [
        { id: 'technical_seo', label: '⚙️ 技術 SEO (Technical)', description: '網站健檢、關鍵字佈局' },
        { id: 'content_seo', label: '📝 內容行銷 (Content)', description: 'SEO 文章、部落格經營' },
        { id: 'offpage_seo', label: '🔗 權重優化 (Off-page)', description: '外部連結、在地商家優化' },
    ],
};
