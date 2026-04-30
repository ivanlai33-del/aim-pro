import { BusinessModule } from '@/types/industries';

export const MODULE_EVENT_PLANNING: BusinessModule = {
    id: 'event_planning',
    name: '活動與婚禮統籌',
    description: '婚禮統籌、企業尾牙、新品發表會',
    categoryId: 'space',
    tagline: '取消政策、不可抗力，活動前就說清楚',
    targetUser: '活動公司、婚禮顧問、企業活動統籌',
    painPoints: ['臨時取消損失慘重', '場地問題責任歸屬', '人力調度臨時出包'],
    corePrompt: `Role: 活動統籌與策劃人 (Event Planner)
    Profile: 你專精於婚禮、企業活動與特殊場合的統籌。你的專業涵蓋活動設計、廠商管理、流程協調與現場執行。
    Focus: 賓客體驗、後勤規劃、預算管理與應變計畫。
    Task: 請提供完整的活動計畫，包含流程表、廠商名單與預算細項。
    Reality Check: 主動提示客戶潛在風險並提出替代方案，確保每項投資都有清晰的 ROI 依據。
    Proposal Mindset: 所有報告與建議都應具備說服力——痛點共鳴、解決方案、ROI 分析、風險預警四段式結構。`,
    formConfig: {
        descriptionPlaceholder: "請描述活動類型、主題與預期氛圍 (Event Type & Vibe)...",
        timelineLabel: "活動舉辦正式日期 (Event Date)",
        timelinePlaceholder: "例如：2024/12/31 跨年酒會",
        stylePlaceholder: "例如：溫馨浪漫、科技未來感、莊重典雅、活潑派對...",
        deliverablesLabel: "活動執行清單與規格 (Event Deliverables)",
        deliverablesPlaceholder: "例如：活動流程規劃、場地佈置、主持人、攝影紀錄...",
        customFields: [
            { name: "eventDate", label: "活動正式日期 (Date)", placeholder: "例如：2024/12/31", type: "text" },
            { name: "attendeeCount", label: "預計賓客數量", placeholder: "請選擇人數區間...", type: "select", options: ['50人以下 (小型聚會)', '50 - 100 人 (中型)', '100 - 200 人 (婚宴標準)', '200 - 500 人 (大型活動)', '500 人以上 (千人大型)'] },
            { name: "venue", label: "舉辦地點類型", placeholder: "請選擇地點屬性...", type: "select", options: ['五星級飯店 / 宴會廳', '戶外草地 / 莊園', '特色餐廳 / 酒吧', '公司辦公室 / 廠區', '專業展演空間 / 表演廳'] },
            { name: "servicesNeeded", label: "需要服務項目", placeholder: "請選擇服務 (可複選)...", type: "multi-select", options: ['活動企劃與流程控管', '現場硬體 (音響燈光)', '場地視覺佈置', '專業攝影與錄影', '活動主持人 / 樂團', '外燴餐飲與服務'] },
            { name: "eventVibe", label: "活動氛圍要求", placeholder: "請選擇氛圍關鍵字...", type: "multi-select", options: ['溫馨浪漫', '科技未來感', '莊重典雅', '活潑派對', '中式傳統'] },
            { name: "cateringType", label: "餐飲形式要求", placeholder: "請選擇餐飲方式...", type: "select", options: ['自助餐 (Buffet)', '中式圓桌菜', '西式位上套餐', '雞尾酒會小點', '特色餐車合作', '不需餐飲服務'] },
        ]
    },
    aiPrompts: {
        reportGeneration: `你是一位資深活動企劃統籌 (Event Planner)。請根據客戶的活動類型與人數規模，產出一份活動企劃提案。內容需包含：活動核心概念 (Theme)、流程亮點 (Highlights)、場地動線規劃、風險控管計畫 (如雨備) 以及預期效益。

升級準則：報告採用四段式提案結構（痛點共鳴→解決方案→ROI 分析→風險預警），溝通時主動挑戰不合理需求，報價提供基礎/標準/企業三方案。`,
        customerChat: `你是一位沉穩且反應靈敏的活動總監。面對客戶要求「現場能不能臨時加碼放煙火」或「突然多出十個貴賓」等突發狀況，需以安全與法規為第一考量，同時迅速提出替代的 B 計畫 (Plan B) 來安撫客戶。`,
        quotationSuggestion: `請提供活動統籌報價建議。必須將報價分為「企劃統籌費 (軟體)」與「硬體設備/場租/餐飲 (實報實銷或代墊)」。並提醒客戶若為戶外活動，雨備器材(如雨棚)需提早下訂且費用無法退還。`
    },
    reportTemplate: {
        structure: `# 活動與展會企劃提案\n\n## 1. 活動主旨與核心概念 (Event Theme)\n\n## 2. 創意亮點與賓客體驗 (Guest Experience)\n- 迎賓/報到體驗：\n- 舞台活動/主秀：\n\n## 3. 活動流程與時間表 (Run-down)\n\n## 4. 場地配置與動線規劃 (Floor Plan)\n\n## 5. 危機處理與雨天備案 (Contingency Plan)`,
        terminology: {
            'Run-down': '活動細部流程表 (精確到分鐘的腳本，記載台上台下所有人的動作與燈光音響配合)',
            'RSVP': '敬請賜覆 (源自法文，用於活動邀請函，請賓客回覆是否出席以便統計人數)',
            'PA 系統': 'Public Address System (公共廣播系統，泛指現場的專業音響設備)'
        },
        analysisDimensions: ['品牌精神傳達度', '賓客參與互動性', '動線流暢與安全性']
    },
    contractHighlights: {
        mustHaveClauses: ['不可抗力條款與延期/取消政策（如遇颱風等天災致活動無法舉辦，訂金退還比例與硬體代墊款處理方式）', '人數保證條款（餐飲或贈品需於活動前 X 日確認「保證人數」，低於此人數仍需依保證人數計費）', '場地損壞賠償責任（若因客戶或其賓客行為造成場地毀損，賠償責任由客戶負擔）'],
        industrySpecificClauses: ['超時費用（若活動流程嚴重延遲導致硬體設備與工作人員超時，需依合約給付超時加班費）', '音樂與表演版權（活動現場播放之音樂或表演節目，版權費用是否包含於報價內或需另行申請）'],
        acceptanceCriteria: ['依企劃案完成活動現場執行', '活動結束後妥善撤場並恢復場地原狀'],
        paymentMilestones: [
            { stage: '簽約訂金', percentage: 30, trigger: '合約簽署，啟動企劃與場地保留' },
            { stage: '硬體與外包訂金', percentage: 40, trigger: '活動前 30 天，支付協力廠商費用' },
            { stage: '活動尾款', percentage: 30, trigger: '活動圓滿結束後支付' }
        ]
    },
    quotationConfig: {
        categoryName: '活動統籌與執行',
        unit: '場/專案',
        terminology: { '客戶': '主辦方', '我們': '統籌執行單位' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "您好，我是您的活動統籌總監。一場完美的活動，就像是一場精準的交響樂。在我們開始安排場地跟流程之前，請問這場活動對您來說，『最成功』的畫面是什麼？（例如：賓客笑聲不斷、長官致詞很氣派、還是新聞媒體大肆報導？）",
        discoveryQuestions: ['目前的預算結構中，是否有硬性的限制？（例如：餐飲預算絕對不能低於總預算的 40%）', '活動場地是已經確定了，還是需要我們代為尋找？', '是否有 VIP 長官或特殊貴賓會出席？他們的動線是否需要特別隱密或尊榮的安排？'],
        objectionHandling: {
            '企劃執行費為什麼要收總預算的 15-20%？不能免收嗎？': '企劃費是買我們的「經驗」與「保險」。一場 500 人的活動，背後牽涉到 10 家以上的廠商協調、上百個流程細節與突發狀況的應變。您支付企劃費，是為了確保活動當天您可以優雅地當個主人，而不是滿場飛奔解決麥克風沒聲音的問題。',
            '雨備方案太花錢了，我們賭天氣好不行嗎？': '我們完全理解預算考量。但根據過往經驗，若無雨備，一旦下雨不只器材可能受損，賓客的抱怨會直接影響品牌形象。如果預算有限，我們建議準備「縮減版的輕量雨備」，至少確保核心活動能順利進行，而不是完全不準備。'
        },
        closing: "非常了解！我會針對您的需求，先擬定一份『活動亮點概念(Event Concept)』與『預算分配比例建議』，我們確認大方向後再進入場勘。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '需求訪談與企劃提案', type: 'internal', duration: '1-2 週', assignee: 'Event Planner' },
            { name: '場地勘查與動線規劃', type: 'internal', duration: '1 週', assignee: 'Planner / Venue Manager' },
            { name: '協力廠商發包 (硬體/表演/餐飲)', type: 'internal', duration: '2 週', assignee: 'Project Manager' },
            { name: '視覺設計與佈置物輸出', type: 'internal', duration: '2-3 週', assignee: 'Designer' },
            { name: '細部流程 (Run-down) 確認會議', type: 'external', duration: '1 天', assignee: 'Client & Planner' },
            { name: '活動前日進場與彩排', type: 'internal', duration: '1 天', assignee: 'Event Team' },
            { name: '活動正式執行', type: 'internal', duration: '1 天', assignee: 'All Staff' },
            { name: '結案報告與效益評估', type: 'internal', duration: '1 週', assignee: 'Event Planner' }
        ],
        milestones: [
            { label: '企劃提案與場地確認', order: 1 },
            { label: '視覺定調與廠商發包', order: 2 },
            { label: '流程彩排與進場', order: 3 },
            { label: '活動圓滿落幕', order: 4 }
        ],
        workflow: {
            diagram: "graph TD\\n  A[概念企劃] --> B[場地與廠商發包]\\n  B --> C[視覺與流程細化]\\n  C --> D[行前總彩排 (Rehearsal)]\\n  D --> E[現場執行]\\n  E --> F[撤場與結案]",
            description: "採用高密度的時間軸管理，活動前一週進入備戰狀態，確保所有協力廠商資訊同步。"
        }
    },
    defaultItems: [
        { description: '活動企劃與流程設計 (Event Planning)', quantity: 1, unitPrice: 20000 },
        { description: '場地佈置與花藝設計 (Decoration & Floral)', quantity: 1, unitPrice: 35000 },
        { description: '專業攝影與錄影 (Photo & Video)', quantity: 1, unitPrice: 25000 },
        { description: '活動主持人與工作人員 (Emcee & Staff)', quantity: 1, unitPrice: 15000 },
        { description: '現場音響與燈光設備 (Audio & Lighting)', quantity: 1, unitPrice: 12000 },
    ],
    projectTypes: [
        { id: 'wedding', label: '💍 婚禮統籌 (Wedding)', description: '婚禮流程、求婚企劃' },
        { id: 'corporate_event', label: '🎤 企業活動 (Corporate)', description: '尾牙、春酒、新品發表會' },
        { id: 'special_event', label: '🎉 特殊活動 (Special)', description: '生日派對、週年慶典' },
    ],
};
