import { BusinessModule } from '@/types/industries';

export const MODULE_SYSTEM_INTEGRATION: BusinessModule = {
    id: 'system_integration',
    name: '系統整合',
    description: 'ERP 整合、CRM 串接、第三方 API 整合',
    categoryId: 'web',
    tagline: '讓現有系統無縫連通，資料不再孤島',
    targetUser: 'ERP/CRM 導入顧問、IT 整合商',
    painPoints: ['現有系統不配合', '資料遷移風險高', '測試責任歸屬不清'],
    corePrompt: `Role: 系統整合專家 (System Integration Specialist)
    Profile: 你擅長連接不同的軟體系統與平台。你的技能包括 API 開發、資料遷移、ERP/CRM 整合與中介軟體解決方案。
    Focus: 系統相容性、資料整合性、安全性與效能優化。
    Task: 請提供包含明確里程碑與風險評估的完整整合計畫。`,
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
        reportGeneration: `你是一位資深系統整合專家。請針對使用者的系統串接需求，生成一份技術整合評估報告。重點須放在資料流 (Data Flow)、API 對接方式、資料轉換邏輯 (Mapping) 與潛在的資安風險防範。`,
        customerChat: `你是負責系統串接的技術顧問。溝通時要特別謹慎，強調「兩端系統」的限制。必須引導客戶釐清「資料來源端」與「資料接收端」的規格，並釐清若舊系統缺乏 API 時的替代方案。`,
        quotationSuggestion: `請為系統整合專案提供報價建議。報價項目必須包含：現有系統架構盤點、API 串接開發、資料清洗與遷移 (Migration)、以及壓力與安全測試。請提醒客戶舊系統廠商可能也會收取 API 開放費用。`
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
