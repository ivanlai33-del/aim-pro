import { BusinessModule } from '@/types/industries';

export const MODULE_STRATEGY_PLANNING: BusinessModule = {
    id: 'strategy_planning',
    name: '策略規劃與顧問',
    description: '商業模式設計、市場進入策略、競爭分析',
    categoryId: 'consulting',
    tagline: '策略報告所有權清楚，執行支援範圍有界定',
    targetUser: '策略顧問、商業顧問',
    painPoints: ['策略報告被拿去用但不付尾款', '執行支援範圍不清', '成效難量化'],
    corePrompt: `Role: 策略顧問與商業模式專家 (Strategy Consultant)
    Profile: 你專精於商業模式設計與市場進入策略。你的專業涵蓋市場研究、競爭分析、商業模式創新與策略路徑圖。
    Focus: 數據驅動的洞察、策略選項、風險評估與執行規劃。
    Task: 請提供完整的策略報告，包含市場分析、策略建議與實施計畫。
    Reality Check: 主動提示客戶潛在風險並提出替代方案，確保每項投資都有清晰的 ROI 依據。
    Proposal Mindset: 所有報告與建議都應具備說服力——痛點共鳴、解決方案、ROI 分析、風險預警四段式結構。`,
    formConfig: {
        descriptionPlaceholder: "請描述商業目標、目標市場與目前競爭態勢 (Market & Competition)...",
        styleLabel: "商業目標與市場對標 (Benchmarks)",
        stylePlaceholder: "這項服務不需填寫視覺風格，您可以描述期望的市場目標，例如：\n• 市場標竿：希望達到類似 A 品牌的市場占有率、參考 B 公司的獲利模式\n• 競爭對手：主要競爭對手 X、Y、Z 的優劣勢分析需求\n• 擴充性需求：未來一年內有擴增產品線或進軍海外市場的計畫",
        timelineLabel: "報告交付時程 (Reporting Timeline)",
        timelinePlaceholder: "例如：四週內提供完整策略書",
        deliverablesLabel: "策略產出項目與規格 (Strategy Deliverables)",
        deliverablesPlaceholder: "例如：商業模式畫布、市場調查報告、策略路徑圖...",
        customFields: [
            { name: "businessStage", label: "企業發展階段", placeholder: "請選擇目前階段...", type: "select", options: ['初創期 (Seed / Startup)', '成長擴張期 (Growth)', '成熟穩定期 (Mature)', '轉型再造期 (Pivot)'] },
            { name: "marketScope", label: "主要市場範圍", placeholder: "請選擇目標區域...", type: "select", options: ['本土市場 (台灣)', '大中華區 (中港澳)', '東南亞市場 (SEA)', '全球市場 (美歐日)'] },
            { name: "targetMarket", label: "目標群體描述", placeholder: "例如：Z世代、高資產族群...", type: "text" },
            { name: "consultingFocus", label: "策略諮詢重點", placeholder: "請選擇重點 (可複選)...", type: "multi-select", options: ['市場進入策略 (Entry)', '商業模式創新 (BMC)', '競爭對手對標定位', '品牌價值重塑', '通路佈局與定價策略'] },
            { name: "growthObjectives", label: "核心成長目標", placeholder: "請選擇目標 (可複選)...", type: "multi-select", options: ['市佔率擴張 (Share)', '營收翻倍成長', '品牌忠誠度提升', 'IPO 準備 / 併購案', '數位轉型與自動化'] },
            { name: "timeHorizon", label: "規劃時間跨度", placeholder: "請選擇時間跨度...", type: "select", options: ['1年短期執行計畫', '3年中期戰略規劃', '5年長期發展願景', '年度持續顧問合約'] }
        ]
    },
    aiPrompts: {
        reportGeneration: `你是一位頂尖的麥肯錫級別商業策略顧問。請根據客戶的企業發展階段與市場痛點，產出一份策略規劃初步提案。內容需包含：總體環境分析 (PESTEL/SWOT)、商業模式創新切入點、競爭優勢定位，以及建議的策略選項 (Strategic Options) 與高階路徑圖 (High-level Roadmap)。

升級準則：報告採用四段式提案結構（痛點共鳴→解決方案→ROI 分析→風險預警），溝通時主動挑戰不合理需求，報價提供基礎/標準/企業三方案。`,
        customerChat: `你是一位邏輯嚴密、直指核心的策略顧問。面對客戶提出「我們什麼都要做、什麼市場都要打」的發散思維時，需運用策略的核心概念——「策略就是決定不做什麼 (Strategy is about what not to do)」，引導客戶收斂資源，聚焦於最具護城河優勢的單一突破點。`,
        quotationSuggestion: `請提供策略顧問報價建議。策略案通常屬高單價、高知識密集服務。報價應以「專案價值 (Value-based pricing)」為導向，而非單純的工時。需明確條列研究深度(如是否包含一手消費者訪談)、交付物規格(如百頁簡報報告)，以及是否包含策略落地後的伴跑指導(Retainer)。`
    },
    reportTemplate: {
        structure: `# 企業發展與市場競爭策略提案\n\n## 1. 執行摘要 (Executive Summary)\n\n## 2. 市場與競爭環境分析 (Market Context)\n- 總體趨勢與痛點：\n- 競爭者對標分析 (Benchmarking)：\n\n## 3. 核心戰略定位與價值主張 (Value Proposition)\n\n## 4. 策略選項評估與建議 (Strategic Options)\n- Option A (穩健型)：\n- Option B (激進型)：\n\n## 5. 商業模式畫布 (Business Model Canvas) 更新\n\n## 6. 實施路徑圖與資源配置 (Roadmap & Resources)`,
        terminology: {
            'Go-to-Market (GTM) Strategy': '市場進入策略 (產品或服務推向市場的具體行動計畫，包含目標客群、定價、通路與行銷手法)',
            'Value Proposition': '價值主張 (企業承諾交付給客戶的核心價值，也是說服客戶為什麼要買你的而不是競爭對手產品的原因)',
            '護城河 (Moat)': '企業抵抗競爭對手的持久性競爭優勢(如：品牌力、網絡效應、轉換成本、成本優勢)'
        },
        analysisDimensions: ['市場規模與成長潛力', '競爭對手可複製性', '財務模型可行性', '組織執行能力匹配度']
    },
    contractHighlights: {
        mustHaveClauses: ['高度保密協定 (Strict NDA)（策略規劃涉及企業核心機密與未來併購/上市計畫，乙方及其團隊需簽署嚴格之保密條款，違約需負鉅額賠償責任）', '智慧財產權歸屬與使用限制（報告之著作財產權歸甲方所有，但乙方所使用之分析框架與通用方法論保留其所有權。甲方僅限內部決策使用，不得對外公開發布或作為募資保證）', '資料正確性免責聲明（顧問基於甲方提供之內部數據及合理之第三方公開資料進行推估分析，若因基礎資料有誤導致策略偏差，乙方不負連帶責任）'],
        industrySpecificClauses: ['策略執行結果免責（顧問提供策略規劃與建議，但市場變化與企業內部執行力非顧問所能控制，乙方不對營收增長或特定商業目標之達成負保證責任）', '顧問團隊指定條款（若甲方因特定顧問之資歷而簽約，需於合約中明訂專案負責人 (Lead Partner)，未經甲方同意不得任意更換核心成員）'],
        acceptanceCriteria: ['依提案範疇完成市場研究與數據分析', '交付約定規格之策略規劃簡報/報告書，並進行一場對高階主管之口頭報告 (Presentation)'],
        paymentMilestones: [
            { stage: '專案啟動金', percentage: 40, trigger: '合約與 NDA 簽署，啟動資料調閱與市場調研' },
            { stage: '期中報告款', percentage: 40, trigger: '提交初步研究發現與策略選項(期中簡報)時' },
            { stage: '最終交付尾款', percentage: 20, trigger: '提交最終策略報告並完成對高階主管之簡報會議後' }
        ]
    },
    quotationConfig: {
        categoryName: '策略規劃與商業諮詢',
        unit: '專案/階段',
        terminology: { '客戶': '委任方/決策層', '我們': '策略顧問團隊' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "董事長/執行長您好。在快速變動的市場中，沒有一種策略能保證永遠成功，但錯誤的戰略卻會消耗大量資源。在我們探討未來的藍圖之前，請您誠實地評估：目前公司最核心的『競爭護城河』究竟是什麼？是成本、技術、還是通路？",
        discoveryQuestions: ['對於未來的成長，您的期待是穩健的線性增長，還是尋求指數型的爆發成長？（這決定了風險偏好與策略激進程度）', '如果我們提出了一項需要裁撤既有獲利部門，以換取未來新市場的策略，董事會能夠承受這樣的陣痛期嗎？', '目前推動新專案時，組織內部最大的阻力通常來自哪裡？是資金不足、人才缺乏、還是部門間的利益衝突？'],
        objectionHandling: {
            '這些分析報告我們內部的企劃部也能寫，為什麼要花幾百萬請外部顧問？': '內部團隊無疑最了解公司，但他們往往有『當局者迷』的盲點，且可能受制於內部政治與既有利益結構，不敢提出得罪人的大破大立建議。外部顧問的價值在於「絕對客觀的第三方視角」、「跨產業的成功經驗對標」，以及幫助決策者說服董事會的「外部權威性」。',
            '市場變化這麼快，現在做的五年計畫，明年就沒用了吧？': '完美的預測是不存在的，這正是為什麼我們不只交付一本靜態的報告。我們交付的是一個『決策羅盤 (Strategic Framework)』。當市場發生突發變數時，您擁有清晰的邏輯框架來快速評估：這會影響我們的核心價值嗎？我們該Pivot(軸轉)還是堅持？策略的價值在於應變，而非死守計畫。'
        },
        closing: "非常清晰的願景。為確保我們能精準切入，下一步我們會先簽署『保密協定(NDA)』，接著索取一些初步的財務與營運數據，一週後我們再為您提交正式的專案範疇(SOW)提案。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '專案啟動會議與需求對焦', type: 'external', duration: '半天', assignee: 'Lead Partner & Client' },
            { name: '次級資料收集與市場調研 (Desk Research)', type: 'internal', duration: '2 週', assignee: 'Research Analysts' },
            { name: '一級訪談 (高階主管/專家/消費者訪談)', type: 'external', duration: '2-3 週', assignee: 'Consultants' },
            { name: '資料分析與問題根因發掘', type: 'internal', duration: '1 週', assignee: 'Consulting Team' },
            { name: '期中進度報告與方向確認 (Mid-term)', type: 'external', duration: '半天', assignee: 'Consulting Team & Client' },
            { name: '策略選項研擬與商業模式設計', type: 'internal', duration: '2 週', assignee: 'Consultants' },
            { name: '實施路徑圖(Roadmap)與財務預測建立', type: 'internal', duration: '1 週', assignee: 'Consultants' },
            { name: '最終報告產出與高階主管簡報會議', type: 'external', duration: '1 天', assignee: 'Lead Partner' }
        ],
        milestones: [
            { label: '專案啟動與 NDA 簽署', order: 1 },
            { label: '市場與現況分析完成', order: 2 },
            { label: '期中報告與策略方向確認', order: 3 },
            { label: '最終策略報告交付與簡報', order: 4 }
        ],
        workflow: {
            diagram: "graph TD\\n  A[定義問題與專案範疇] --> B[資料收集與市場分析]\\n  B --> C[建立假說與驗證]\\n  C --> D[期中報告對焦]\\n  D --> E[研擬策略選項與路徑圖]\\n  E --> F[最終交付與落地指導]",
            description: "採用假說驅動 (Hypothesis-driven) 的解決問題方法，反覆驗證策略的可行性與財務影響。"
        }
    },
    defaultItems: [
        { description: '市場研究與競爭分析 (Market Research)', quantity: 1, unitPrice: 35000 },
        { description: '商業模式設計 (Business Model Design)', quantity: 1, unitPrice: 40000 },
        { description: '策略規劃報告 (Strategy Report)', quantity: 1, unitPrice: 45000 },
        { description: '執行路徑圖與里程碑 (Execution Roadmap)', quantity: 1, unitPrice: 25000 },
    ],
    projectTypes: [
        { id: 'market_entry', label: '🚀 市場進入 (Market Entry)', description: '新市場開發、進入策略' },
        { id: 'business_model', label: '💡 商業模式 (Business Model)', description: '商業模式創新、設計' },
        { id: 'competitive_strategy', label: '⚔️ 競爭策略 (Competitive)', description: '競爭分析、定位策略' },
    ],
};
