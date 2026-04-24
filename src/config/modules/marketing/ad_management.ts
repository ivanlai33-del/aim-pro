import { BusinessModule } from '@/types/industries';

export const MODULE_AD_MANAGEMENT: BusinessModule = {
    id: 'ad_management',
    name: '廣告投放與優化',
    description: 'Meta 廣告投放、Google Ads、成效優化',
    categoryId: 'marketing',
    tagline: '廣告費和服務費分清楚，ROAS 說話',
    targetUser: '數位廣告操手、媒體購買公司',
    painPoints: ['廣告費和服務費混淆', 'KPI 承諾過高', '帳號權限問題'],
    corePrompt: `Role: 廣告優化師與媒體採購 (Ad Optimizer)
    Profile: 你專精於為中小企業與品牌進行 Meta (FB/IG) 廣告投放。你的目標是在預算限制下最大化 ROAS/ROI。
    Focus: 受眾鎖定、A/B 測試、成效優化與月度報告。
    Task: 請提供詳細的廣告活動架構，包含預算分配、受眾策略與預期成效。`,
    formConfig: {
        descriptionPlaceholder: "請描述推廣商品與行銷活動 (Product & Campaign)...",
        timelineLabel: "活動推廣期間 (Campaign Period)",
        timelinePlaceholder: "例如：雙 11 當月、長期品牌宣傳",
        stylePlaceholder: "例如：吸睛動態、促銷導購、品牌形象...",
        deliverablesLabel: "投放平台與素材規格 (Assets & Specs)",
        deliverablesPlaceholder: "例如：Google 關鍵字、FB 轉換廣告、再行銷設定...",
        customFields: [
            { name: "adPlatforms", label: "投放平台 (Ad Platforms)", placeholder: "請選擇目標平台...", type: "multi-select", options: ['Meta (FB/IG)', 'Google Ads', 'Google Map (在地商家)', 'TikTok Ads', 'LINE 廣告 / 官方帳號', 'LinkedIn Ads', '蝦皮廣告'] },
            { name: "kpiGoals", label: "核心 KPI 目標", placeholder: "請選擇重點目標...", type: "multi-select", options: ['提升 ROAS / ROI', '降低客單獲取成本 (CPA)', '增加名單私訊量', '提高品牌觸及/曝光', '網店導購轉換', '實體店面導客'] },
            { name: "monthlyBudget", label: "月廣告預算 (Monthly Budget)", placeholder: "請選擇預算區間...", type: "select", options: ['5萬以下 TWD', '5萬 - 15萬 TWD', '15萬 - 30萬 TWD', '30萬 - 50萬 TWD', '50萬 - 100萬 TWD', '100萬以上 (另議)'] },
            { name: "accountStatus", label: "廣告帳號狀態", placeholder: "請選擇目前狀態...", type: "select", options: ['已有運作中帳號', '已有帳號但需重新整理', '尚未建置帳號 (需協助)', '帳號遭停權 (需協助申訴)', '不方便提供權限'] },
            { name: "targetRegion", label: "投放地區 (Target Region)", placeholder: "例如：台灣全區、台北市、北美地區", type: "text" }
        ]
    },
    aiPrompts: {
        reportGeneration: `你是一位資深數位廣告操盤手 (Media Buyer)。請根據客戶的預算、產品特性與 KPI，產出一份廣告投放策略提案。內容需涵蓋：漏斗各階層的預算分配、受眾標籤設定、A/B 測試規劃及預估的 ROAS 或 CPA。`,
        customerChat: `你是一位廣告成效優化師。溝通風格需數據導向、客觀且具備敏銳的市場嗅覺。面對客戶質疑「為何昨天業績變差」，應引導客戶看長期趨勢而非單日波動，並以專業術語解釋演算法學習階段。`,
        quotationSuggestion: `請為客戶提供廣告代操報價建議。必須明確劃分「媒體預算 (交給 FB/Google)」與「服務費/代操費 (給我們)」。代操費通常為預算的 15%-20% 或固定月費。並列出素材製作是否另計。`
    },
    reportTemplate: {
        structure: `# 數位廣告投放策略提案\n\n## 1. 活動目標與 KPI 設定\n\n## 2. 廣告漏斗與預算分配策略\n- 漏斗頂端 (TOF - 觸及與曝光)：\n- 漏斗中段 (MOF - 考慮與流量)：\n- 漏斗底端 (BOF - 轉換與再行銷)：\n\n## 3. 受眾標籤與受眾包設定 (Targeting)\n\n## 4. A/B 測試計畫 (素材/文案/受眾)\n\n## 5. 預期成效與損益兩平點 (ROAS/CPA 預估)`,
        terminology: {
            'ROAS': '廣告投資報酬率 (每花 1 元廣告費能帶回多少營收)',
            'CPA': '每次行動成本 (獲取一張名單或一筆訂單的平均花費)',
            'Pixel/CAPI': '追蹤像素與轉換 API (用來記錄消費者在網站上的行為以優化廣告)'
        },
        analysisDimensions: ['受眾精準度', '素材點擊率 (CTR)', '轉換率 (CVR)', '單次點擊成本 (CPC)']
    },
    contractHighlights: {
        mustHaveClauses: ['廣告費與代操費分離聲明（廣告費由客戶直接綁卡付給媒體平台，代操費為乙方服務費）', '帳號權限與資產歸屬（企業管理平台 BM 應歸屬客戶，乙方僅為管理員）', '最低服務期限制（通常為 3 個月，以確保演算法有足夠學習時間）'],
        industrySpecificClauses: ['KPI 預估不等於保證條款（廣告受季節、競品與市場波動影響，預估數據僅供參考）', '停權協助免責條款（若因客戶產品違規導致帳號被鎖，乙方僅協助申訴，不負賠償責任）', '提前終止合約之違約金或費用結算方式'],
        acceptanceCriteria: ['完成廣告像素 (Pixel) 與轉換 API 的正確安裝與測試', '廣告活動依時程上線且預算正常消耗', '每月定期提供成效報表'],
        paymentMilestones: [
            { stage: '首月代操費與設定費', percentage: 100, trigger: '合約簽署，進行帳戶盤點與追蹤碼安裝' },
            { stage: '次月代操費', percentage: 100, trigger: '按月收取固定費用或依前月預算抽成' }
        ]
    },
    quotationConfig: {
        categoryName: '廣告代操模組',
        unit: '月',
        terminology: { '客戶': '廣告主', '我們': '代理商' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "您好，我是您的廣告優化師。廣告不是魔法，而是一門精密的數據實驗。為了讓您的每一塊錢預算都花在刀口上，我需要先了解您產品的「毛利率」以及您能接受的「最高獲客成本 (CPA)」。",
        discoveryQuestions: ['您過去有自行投放過廣告嗎？當時成效如何？遇到最大的瓶頸是什麼？', '您的網站目前有安裝完整的追蹤碼（如 Meta Pixel, GA4）並且設定好轉換事件了嗎？', '這次活動，您更看重的是「短期的營收爆發」還是「長期的品牌名單累積」？'],
        objectionHandling: {
            '為什麼前幾天成效很好，這兩天突然很差': '廣告系統的演算法需要時間穩定。當我們上新素材或受眾時，系統會進入「學習階段」。單日波動是正常的，我們會看 3 到 7 天的移動平均線。如果頻繁去開關廣告，反而會破壞系統的學習模型。',
            'ROAS 只有 2，我根本沒賺錢': '這就是為什麼我們一開始要釐清您的毛利率。如果您的毛利結構無法支撐目前的 CPA，我們有兩個方向：一是透過行銷活動提高「客單價 (AOV)」，二是回到網站優化「轉換率 (CVR)」。廣告只負責帶進精準流量，最終收網還是得靠您的網站。'
        },
        closing: "清楚了！接下來我會先幫您盤點現有的廣告帳戶架構，並為您規劃第一個月的 A/B 測試預算分配，讓我們用小成本找出會賺錢的黃金素材。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '廣告帳戶與追蹤碼 (Pixel) 盤點測試', type: 'internal', duration: '3 天', assignee: 'Ad Optimizer' },
            { name: '受眾策略與漏斗架構規劃', type: 'internal', duration: '2 天', assignee: 'Ad Optimizer' },
            { name: '廣告素材設計與文案撰寫', type: 'internal', duration: '1 週', assignee: 'Designer & Copywriter' },
            { name: '廣告上線與 A/B 測試設定', type: 'internal', duration: '1 天', assignee: 'Ad Optimizer' },
            { name: '每日監控與即時成效微調', type: 'internal', duration: 'Ongoing', assignee: 'Ad Optimizer' },
            { name: '月度成效統整與下月策略會議', type: 'internal', duration: '3 天', assignee: 'Strategist' }
        ],
        milestones: [
            { label: '帳戶設定與追蹤確認', order: 1 },
            { label: '第一波測試廣告上線', order: 2 },
            { label: '演算法學習完成 (成效趨緩)', order: 3 },
            { label: '優化調整與月度覆盤', order: 4 }
        ],
        workflow: {
            diagram: "graph TD\\n  A[帳戶與追蹤盤點] --> B[策略規劃與素材準備]\\n  B --> C[廣泛測試 (Testing)]\\n  C --> D[數據篩選 (Scaling)]\\n  D --> E[放大預算 (Optimization)]\\n  E --> F[月度報表覆盤]",
            description: "採用「測試 -> 驗證 -> 放大」的敏捷優化流程，嚴控預算風險。"
        }
    },
    defaultItems: [
        { description: '廣告帳戶與 BM 架構規劃 (Account Structure)', quantity: 1, unitPrice: 15000 },
        { description: '廣告投放代操服務 (Ad Management)', quantity: 1, unitPrice: 25000 },
        { description: '素材與受眾 A/B 測試 (A/B Testing)', quantity: 1, unitPrice: 10000 },
        { description: '月度成效優化報告 (Monthly Report)', quantity: 1, unitPrice: 8000 },
    ],
    projectTypes: [
        { id: 'ecommerce_ads', label: '🛍️ 電商轉換 (E-commerce)', description: 'ROAS 優化、DPA 動態廣告' },
        { id: 'leadgen_ads', label: '📋 名單獲取 (Lead Generation)', description: '名單型廣告、私訊廣告' },
        { id: 'brand_awareness', label: '✨ 品牌推廣 (Brand Awareness)', description: '觸及率優化、影片觀看' },
    ],
};
