import { BusinessModule } from '@/types/industries';

export const MODULE_AI_AGENT_CONSULTANT: BusinessModule = {
    id: 'ai_agent_consultant',
    name: 'AI Agent 代理顧問',
    description: '企業流程診斷、AI Agent PoC 設計、數位工作流自動化、AI 運維優化',
    categoryId: 'consulting',
    tagline: '點擊 3 下，把您的經驗變成「不會累的 AI 助手」',
    targetUser: 'AI 顧問、流程工程師、數位轉型專家',
    painPoints: ['手動作業過多', '流程混亂難以自動化', 'AI 導入不知從何開始', '人員異動造成 Know-how 流失'],
    corePrompt: `Role: AI Agent 代理顧問 (AI Orchestrator)
    Profile: 你專精於企業流程自動化與 AI Agent 編排。你能將複雜的人工作業拆解為 Input、Process、Output 的自動化邏輯。
    Focus: 找尋高價值自動化場景（快、省、準）、設計 MVP/PoC 驗證、並建立長期維運體系。
    Task: 請根據客戶描述的業務流程，提供 AI 導入建議地圖，標記自動化潛力點，並規劃 PoC 實作方案。`,
    formConfig: {
        descriptionPlaceholder: "請描述客戶目前的業務流程（如：怎麼接單、怎麼回覆、哪裡最浪費時間）...",
        styleLabel: "期望自動化場景與目標 (Automation Goals)",
        stylePlaceholder: "您可以描述您最想解決的痛點，例如：\n• 客服回覆：自動分析 Line 訊息並分類、生成回覆建議\n• 訂單處理：自動從 Excel 抓取資料並發送通知及報表\n• 行銷自動化：定時抓取關鍵字並生成週報",
        timelineLabel: "PoC / 導入時程 (Timeline)",
        timelinePlaceholder: "例如：2 週完成 PoC、一個月的系統導入",
        deliverablesLabel: "顧問產出與 Agent 交付物 (Deliverables)",
        deliverablesPlaceholder: "例如：AI 導入地圖、PoC 實作 Agent、維運報告書...",
        customFields: [
            { name: "automationStage", label: "目前規畫階段", placeholder: "請選擇當前階段...", type: "select", options: ['探索與診斷 (Discovery)', 'PoC / MVP 設計 (Validation)', '擴充與產品化 (Scale)', '維運與優化 (Run & Improve)'] },
            { name: "targetIndustry", label: "目標產業別", placeholder: "請選擇產業...", type: "select", options: ['傳統製造 / 工廠', '零售 / 批發 / 貿易', '手工藝 / 設計工作室', '服務業 (健身/美容/教育)', 'B2B 中小企業'] },
            { name: "dataSources", label: "主要資料來源 (Input)", placeholder: "例如：Line, Google Sheets, ERP API, Email...", type: "text" },
            { name: "successMetric", label: "成功指標 (KPI)", placeholder: "例如：每月減少 40 小時人力、錯誤率降至 0...", type: "text" }
        ]
    },
    aiPrompts: {
        reportGeneration: `你是一位專精企業數位轉型的 AI 流程導入顧問。請根據客戶描述的業務痛點，產出一份 AI Agent 導入診斷報告。內容需包含：目前人工作業的時間成本估算、建議自動化的切入點 (PoC 場景)、預期效益與潛在風險。`,
        customerChat: `你是一位講求效率與數據的 AI 顧問。當客戶提出「我想要一個無所不能的 AI 幫我賺錢」時，需溫和但務實地將期望值拉回地面，引導客戶先從單一痛點（如：客服自動回覆、自動發信報價）開始進行概念驗證 (MVP)。`,
        quotationSuggestion: `請提供 AI Agent 導入報價建議。必須將報價分為三階段：「流程診斷與設計費(一次性)」、「PoC 開發與串接費(一次性)」與「每月 Token 消耗與維護調優費(訂閱制)」。提醒客戶 API Token 費用通常採實報實銷。`
    },
    reportTemplate: {
        structure: `# AI Agent 自動化導入評估報告\n\n## 1. 企業現行作業流程痛點分析\n\n## 2. AI 導入潛力評估與切入點 (High ROI Scenarios)\n- 高頻低效任務：\n- 適合自動化節點：\n\n## 3. PoC 概念驗證方案設計\n- 系統串接架構 (如：Line + Make/Zapier + OpenAI)：\n- 預期自動化成果：\n\n## 4. 預期效益與 ROI 分析 (節省工時估算)\n\n## 5. 導入時程與階段性報價建議`,
        terminology: {
            'PoC (Proof of Concept)': '概念驗證 (用最小的成本與最快的速度，驗證 AI 是否能確實解決問題，再決定是否全面導入)',
            'Prompt Engineering': '提示詞工程 (設計並調校給 AI 的指令，確保其產出符合企業標準的專業內容)',
            'API 串接': '讓不同軟體互相溝通的橋樑 (如讓公司內部的 ERP 系統能自動傳資料給 ChatGPT 處理)'
        },
        analysisDimensions: ['技術可行性', '資料安全性 (Data Privacy)', '人員適應力', '成本效益比 (ROI)']
    },
    contractHighlights: {
        mustHaveClauses: ['Token 費用負擔約定（LLM 如 OpenAI 產生的 API 調用費用，通常由客戶綁定信用卡實報實銷，乙方不代墊）', '資料保密與隱私條款 (NDA)（乙方處理客戶資料時，承諾不將機密數據用於訓練公開模型）', '服務中斷免責（若因第三方平台如 OpenAI、Line 官方當機或政策改變導致服務中斷，乙方不負違約責任）'],
        industrySpecificClauses: ['幻覺免責聲明（AI 模型可能產生錯誤資訊(幻覺)，客戶需理解 AI 為輔助工具，最終決策與審核責任仍歸屬客戶）', '優化期限制（PoC 上線後提供 N 次 Prompt 調優，超出次數需轉為月度維運合約）'],
        acceptanceCriteria: ['依提案架構完成自動化工作流串接', '成功執行並通過至少 3 組真實測試案例 (Test Cases)', '交付系統操作與除錯說明手冊'],
        paymentMilestones: [
            { stage: '診斷與設計費', percentage: 40, trigger: '合約簽署，啟動流程盤點與架構設計' },
            { stage: '開發期款', percentage: 40, trigger: '系統架構確認，開始進行 API 串接與 Prompt 撰寫前' },
            { stage: '上線與尾款', percentage: 20, trigger: 'PoC 測試通過並正式上線運作後' }
        ]
    },
    quotationConfig: {
        categoryName: 'AI 導入與流程自動化',
        unit: '專案/月',
        terminology: { '客戶': '導入企業', '我們': 'AI 技術顧問' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "您好，我是您的 AI 導入顧問。AI 不是魔法，而是不知疲倦的超級實習生。為了幫您安排最適合的自動化流程，請問目前公司內哪一項重複性工作，最讓您的員工感到痛苦或耗時？",
        discoveryQuestions: ['目前這些繁瑣的工作，資料通常散落在哪些系統？（例如：Line 群組、Excel 報表、還是傳統的 ERP 系統？）', '如果我們能把這項工作自動化，您預計每個月能省下多少個小時的人力？', '對於資料上傳到雲端給 AI 分析，公司內部是否有資安或個資法規的疑慮？'],
        objectionHandling: {
            '直接買現成的 AI 軟體就好，為什麼要找你們客製化？': '現成的軟體就像是買成衣，能穿但不一定合身。我們的價值在於「梳理您的專屬流程」，把 AI 嵌入到您現有的 Line 或是內部系統中，您的員工不需要學習新軟體，而是感覺多了一個無形的超級幫手。',
            '如果 AI 回答錯誤或得罪客戶怎麼辦？': '這就是為什麼我們堅持採用「人機協作 (Human-in-the-loop)」模式。在初期階段，AI 生成的回覆只會存成草稿，必須經過您員工的點擊確認才會發送。我們會在確保 AI 準確率達到 95% 以上後，才考慮開放全自動發送。'
        },
        closing: "了解您的痛點了。這絕對是可以透過 AI 解決的問題！我會先為您規劃一個為期 2 週的『概念驗證 (PoC)』小專案，讓您用最低成本親眼看到自動化的效果。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '業務流程盤點與需求訪談', type: 'internal', duration: '3 天', assignee: 'AI Consultant' },
            { name: '導入架構設計與 PoC 提案', type: 'internal', duration: '1 週', assignee: 'AI Consultant' },
            { name: 'API 串接與工作流腳本開發', type: 'internal', duration: '1-2 週', assignee: 'Automation Engineer' },
            { name: 'Prompt 撰寫與內部測試調優', type: 'internal', duration: '1 週', assignee: 'Prompt Engineer' },
            { name: '客戶端概念驗證 (PoC 測試)', type: 'external', duration: '1 週', assignee: 'Client & Consultant' },
            { name: '系統修正與正式上線', type: 'internal', duration: '3 天', assignee: 'Automation Engineer' },
            { name: '操作教育訓練與後續維運啟動', type: 'internal', duration: '1 天', assignee: 'AI Consultant' }
        ],
        milestones: [
            { label: '流程痛點診斷完成', order: 1 },
            { label: '系統架構與 PoC 提案確認', order: 2 },
            { label: '自動化測試通過 (UAT)', order: 3 },
            { label: '正式上線與移交', order: 4 }
        ],
        workflow: {
            diagram: "graph TD\\n  A[痛點診斷與流程梳理] --> B[系統架構與 PoC 設計]\\n  B --> C[API 串接與 Prompt 開發]\\n  C --> D[內部測試與客戶驗證 (UAT)]\\n  D --> E[修正調優與正式上線]\\n  E --> F[月度維運與持續優化]",
            description: "採用敏捷開發思維，強調以最小成本快速產出 PoC 驗證可行性，再逐步擴充自動化範圍。"
        }
    },
    defaultItems: [
        { description: 'AI 導入地圖規劃與診斷 (Discovery & Diagnosis)', quantity: 1, unitPrice: 15000 },
        { description: 'AI Agent PoC 實作小專案 (MVP Development)', quantity: 1, unitPrice: 50000 },
        { description: '系統擴充與產品化 (Scaling & Integration)', quantity: 1, unitPrice: 80000 },
        { description: 'AI Agent 月度維運與優化 (Monthly Retainer)', quantity: 1, unitPrice: 10000 },
    ],
    projectTypes: [
        { id: 'ai_discovery', label: '🔍 探索與診斷 (Discovery)', description: '找出最值得 Agent 化的點，產出導入地圖' },
        { id: 'ai_poc', label: '🧪 PoC / MVP 小專案', description: '2-4 週快速驗證，看到真實省時效果' },
        { id: 'ai_scale', label: '🚀 擴充與產品化 (Scale)', description: '橫向發展多流程，建立系統化後台' },
        { id: 'ai_maintenance', label: '🛡️ 維運與優化 (Maintenance)', description: '長期監控、調整規則、數位同事持續成長' },
    ],
};
