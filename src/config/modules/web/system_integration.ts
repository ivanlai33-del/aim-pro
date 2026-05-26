import { BusinessModule } from '@/types/industries';

export const MODULE_SYSTEM_INTEGRATION: BusinessModule = {
    id: 'system_integration',
    name: '系統整合 職人模組',
    description: 'ERP 整合、CRM 串接、第三方 API 整合',
    categoryId: 'web',
    tagline: '打通資訊孤島，精準釐清 API 責任歸屬與資安規格',
    targetUser: 'ERP/CRM 導入顧問、IT 整合商',
    painPoints: ['現有系統不配合', '資料遷移風險高', '測試責任歸屬不清'],
    corePrompt: `Role: 系統整合專家 (Systems Integration Specialist)
    Profile: 你是一位擁有豐富 API 整合、中間件設計與企業系統連結經驗的專家。曾協助數十家企業解決孤峳系統問題，將分散工具整合為高效數位工作流。
    Focus: API 架構、資料同步、錯誤處理與 ROI 最大化。
    Reality Check: 主動示警：(1) 第三方 API 穩定性未驗證；(2) 資料格式差異導致大量轉換工作；(3) 沒有错誤回滚機制。
    Task: 設計穩定可擴充的整合方案，並將每項投資轉化為可量化的商業回報。`,
    formConfig: {
        descriptionPlaceholder: "請描述需整合的系統與資料流程 (Data Flow)...",
        styleLabel: "技術環境與串接參考 (Technical Context)",
        stylePlaceholder: "這項服務不適用視覺風格，請描述技術背景，例如：\n• 現有系統：舊版 ERP (SQL Server)、SAP、Salesforce\n• 串接方式：REST API、Webhooks、固定格式的 CSV 匯入\n• 特殊要求：需要符合 ISO 27001 安全標準、需在離峰時間進行資料同步",
        deliverablesLabel: "整合清單與技術規格 (Integration Specs)",
        deliverablesPlaceholder: "例如：API 串接規格書、資料對照表 (Mapping Table)...",
        customFields: [
            { name: "integrationMethod", label: "技術串接方式", placeholder: "請選擇串接方式...", type: "select", options: ['REST API (JSON/XML)', 'Webhooks (即時推送)', '資料庫直接對接 (SQL Link)', '檔案交換 (CSV/Excel/FTP)', '中介軟體 (Middleware/iPaaS)'] },
            { name: "syncFrequency", label: "資料同步頻率", placeholder: "請選擇同步頻率...", type: "select", options: ['即時同步 (Real-time)', '整點批次同步 (Hourly Batch)', '每日定時同步 (Daily Sync)', '手動觸發同步 (Manual Trigger)'] },
            { name: "securityReq", label: "資安與驗證要求", placeholder: "請選擇安全等級...", type: "multi-select", options: ['標準加密 (SSL/TLS)', 'IP 白名單限制', '雙向憑證驗證 (mTLS)', '符合資安/內稽內控規範', '資料去識別化處理'] },
            { name: "sourceSystem", label: "來源系統名稱", placeholder: "例如：SAP ERP、舊版 SQL Server...", type: "text" },
            { name: "targetSystem", label: "目標系統名稱", placeholder: "例如：Salesforce、Shopify...", type: "text" }
        ]
    },
    aiPrompts: {
        reportGeneration: `你是一位資深系統整合專家。請根據使用者提供的資訊（或上傳的現有系統 API 文件、資料欄位說明表、業務流程圖、資安規範文件），生成一份「系統整合與資料流優化報告」，採用以下結構：

**第一段 — 痛點共鳴 (Pain Point Resonance)**
精準描述孤島系統（Islands of Information）造成的營運損失，如：手動搬運資料的高錯誤率、資訊延遲導致的決策失誤、或因系統不連通導致的客戶體驗破碎。展現你對「數位孤島」問題的深度洞察。

**第二段 — 解決方案 (Solution)**
提供穩定、安全且具備擴充性的整合藍圖：
1. **整合架構**：定義 API 中間件、Webhook 即時同步或 ETL 批次處理的具體路徑。
2. **資料對照 (Mapping)**：說明關鍵欄位的轉換邏輯與一致性維護。
3. **資安防護**：規劃傳輸加密、身份驗證與存取控制機制。

**第三段 — ROI 與營運價值 (ROI Analysis)**
量化整合效益：預期節省的人工作業工時、資料同步延遲的縮短量、以及透過資料自動化聯通後提升的決策速度與業務轉換率。

**第四段 — 風險預警 (Risk Warning)**
主動揭露潛在風險（如：原廠系統 API 頻率限制、資料格式不相容導致的同步衝突、或缺乏錯誤回溯機制的隱憂）並提供應對方案。

升級準則：報告採用四段式提案結構（痛點共鳴→解決方案→ROI 分析→風險預警），溝通時主動挑戰不合理需求，報價提供基礎/標準/企業三方案。`,
        customerChat: `你是一位專業、嚴謹且極度重視系統穩定性的整合顧問。你的溝通風格是：數據導向、邏輯嚴密，強調「先有架構，才有程式」。

關鍵行為準則：
1. 堅持「權威來源 (Single Source of Truth)」原則：絕不容許資料在多個系統間產生邏輯衝突。
2. 重視「錯誤處理機制」：主動詢問當第三方 API 斷線時，系統的自動回退與通知流程。
3. 鼓勵使用「文件解析器」上傳現有系統的 API 文件、資料欄位說明 (Dictionary) 或業務流程圖，以加速整合可行性評估。`,
        quotationSuggestion: `請提供系統整合與自動化服務報價建議：

**基礎方案 (Pilot)**：單一方向、核心欄位的資料同步，含基礎 API 串接與測試。
**標準方案 (Standard)**：雙向同步、含錯誤回溯機制、中間件日誌監控與基礎資料清洗。
**企業方案 (Full Integration)**：多系統即時聯動、全方位的資安加密、高可用性中間件部署與年度維運支援。

提醒客戶注意 API 調用次數可能產生的原廠授權費用，以及若涉及舊系統改版可能產生的額外成本。`
    },
    reportTemplate: {
        structure: `# 系統整合與串接評估報告\n\n## 1. 整合目標與預期效益\n\n## 2. 資料流與串接架構設計\n- 來源系統 (Source)：\n- 目標系統 (Target)：\n- 串接方式 (如 API, Webhook, Middleware)：\n\n## 3. 資料對應與轉換邏輯 (Data Mapping)\n\n## 4. 資安、效能與錯誤處理機制\n\n## 5. 時程與依賴條件 (Dependencies)`,
        terminology: {
            'Webhook': '一種讓系統在特定事件發生時，主動將資料推播給另一個系統的機制',
            'Data Mapping': '資料欄位對應 (例如將 A 系統的「聯絡電話」轉換為 B 系統的「Phone_Num」)',
            'Middleware': '中介軟體 (在兩個系統之間負責轉譯、排程或緩存資料的獨立服務)'
        },
        analysisDimensions: ['資料正確性與一致性', '系統相容性與接口完整度', '資料傳輸安全', '異常中斷與重試機制']
    },
    contractHighlights: {
        mustHaveClauses: ['責任釐清條款（若因第三方/原廠系統故障導致串接失敗，我方不負賠償責任）', '資料外洩免責界線（依據雙方約定之資安標準實作，但不承擔原廠系統本身之漏洞風險）', '明確的整合範圍（限於規格書載明之 API Endpoints 或欄位）'],
        industrySpecificClauses: ['需第三方廠商配合條款（客戶需自行協調舊系統廠商提供 API 文件與測試環境，若遭拖延則專案順延）', '資料清洗責任界線（由客戶負責提供乾淨資料，或由我方另行報價處理）', 'API Rate Limit (請求頻率限制) 處理聲明'],
        acceptanceCriteria: ['完成規格書約定之所有欄位與資料拋轉', '資料拋轉成功率達 99.9% (排除第三方系統當機)', '異常事件有正確記錄於 Log 中'],
        paymentMilestones: [
            { stage: '簽約訂金', percentage: 30, trigger: '合約簽署完畢' },
            { stage: '串接規格確認', percentage: 30, trigger: '取得第三方 API 文件並完成 Data Mapping 對照表' },
            { stage: '沙盒測試完成', percentage: 30, trigger: '於測試環境 (Sandbox) 完成資料拋轉與驗證' },
            { stage: '正式上線', percentage: 10, trigger: '正式環境串接啟用' }
        ]
    },
    quotationConfig: {
        categoryName: '系統整合專案',
        unit: '端點/模組',
        terminology: { '客戶': '甲方', '我們': '乙方', '第三方系統廠商': '丙方' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "您好，我是系統整合顧問。要把不同的系統打通，最關鍵的就是釐清雙方的『溝通語言』(API)。請問目前要串接的兩套系統，都有提供完整的 API 說明文件嗎？",
        discoveryQuestions: ['資料同步的時效性要求為何？（是一定要即時，還是每天半夜同步一次即可？）', '若遇到網路不穩導致傳輸失敗，資料是否有嚴格的順序性或不可重複性要求？（如：金流交易狀態）', '舊系統的廠商是否願意配合提供測試環境 (Sandbox) 與技術支援？'],
        objectionHandling: {
            '為什麼只是串接幾個資料也要這麼貴': '串接資料看似簡單，但隱藏的成本在於「錯誤處理」與「資料清洗」。我們必須考慮當系統 A 斷線時，系統 B 該怎麼辦？如果傳過來的資料格式不符如何攔截？我們設計的是具備容錯能力且安全的自動化流程，而非單純的腳本。',
            '為什麼需要這麼長的測試時間': '系統整合涉及多方環境。我們需要在不影響您現有正式營運資料的前提下，進行各種極端狀況的測試（例如傳送超大筆資料、模擬斷線等），這需要反覆與第三方系統驗證。'
        },
        closing: "了解！系統整合就像是擔任兩個國家的翻譯官。後續我們會先對您的來源系統與目標系統進行技術可行性評估 (PoC)，並提供您具體的串接架構與報價。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '系統規格研讀與可行性評估 (PoC)', type: 'internal', duration: '1-2 週', assignee: 'System Architect' },
            { name: 'Data Mapping 與規格書定義', type: 'internal', duration: '1 週', assignee: 'SA' },
            { name: '串接程式與 Middleware 開發', type: 'internal', duration: '2-4 週', assignee: 'Backend Engineer' },
            { name: 'Sandbox 沙盒環境對接測試', type: 'internal', duration: '1-2 週', assignee: 'QA / Developer' },
            { name: '資料清理與初次大批資料遷移', type: 'internal', duration: '1 週', assignee: 'DBA / Developer' },
            { name: '正式環境切換與監控設定', type: 'internal', duration: '3 天', assignee: 'DevOps' }
        ],
        milestones: [
            { label: '規格對照與 PoC 確認', order: 1 },
            { label: '開發與沙盒測試完畢', order: 2 },
            { label: '初次歷史資料遷移', order: 3 },
            { label: '自動化串接正式上線', order: 4 }
        ],
        workflow: {
            diagram: "graph LR\\n  A[盤點現有 API] --> B[定義 Mapping 規格]\\n  B --> C[中介層開發與串接]\\n  C --> D[沙盒容錯測試]\\n  D --> E[正式環境部署]",
            description: "採用防禦性編程 (Defensive Programming) 原則，確保整合過程中不會因為單一系統異常而造成連鎖當機。"
        }
    },
    defaultItems: [
        { description: '系統現況評估與分析 (System Assessment)', quantity: 1, unitPrice: 20000 },
        { description: '整合方案設計 (Integration Design)', quantity: 1, unitPrice: 35000 },
        { description: 'API 開發與串接 (API Development)', quantity: 1, unitPrice: 50000 },
        { description: '測試與上線支援 (Testing & Support)', quantity: 1, unitPrice: 15000 },
    ],
    projectTypes: [
        { id: 'erp_integration', label: '🏢 ERP 整合 (ERP Integration)', description: '企業資源規劃系統整合' },
        { id: 'crm_integration', label: '👥 CRM 串接 (CRM Integration)', description: '客戶關係管理系統' },
        { id: 'data_migration', label: '📊 資料遷移 (Data Migration)', description: '系統資料轉移與整合' },
    ],
};
