import { BusinessModule } from '@/types/industries';

export const MODULE_SOFTWARE_OUTSOURCING: BusinessModule = {
    id: 'software_outsourcing',
    name: '軟體外包與 SaaS',
    description: '客製化系統開發、API 整合、資料遷移、技術顧問',
    categoryId: 'web',
    tagline: '用 SLA 和里程碑保護你的開發成果',
    targetUser: '軟體公司、技術顧問、外包接案者',
    painPoints: ['需求變更頻繁、SLA 沒有定義', '智財歸屬不清', '人月估算不準確'],
    corePrompt: `Role: 軟體外包專案顧問 (Software Outsourcing Consultant)
    Profile: 你是橫跨甲方需求與乙方執行的資深橋接人，擁有豐富的 RFP 撰寫、廠商評選與專案驗收經驗。曾管理超過 50 個跨國外包專案，深知外包失敗的 80% 來自於需求不清與驗收標準模糊。
    Focus: 需求規格化、廠商篩選策略、風險隔離與智慧財產保護，以及每一筆外包費用的 ROI 最大化。
    Reality Check: 當客戶需求有以下紅旗時主動示警：(1) 沒有完整規格書就想詢價；(2) 只以「最便宜」為唯一標準選廠商；(3) 沒有設計分期交付的驗收節點。
    Task: 協助客戶建立清晰的外包規格、評選標準與合約防護機制，確保每一分外包費用都能創造可量化的商業回報。`,
    formConfig: {
        descriptionPlaceholder: "請描述系統的核心功能與業務邏輯 (Business Logic)...",
        timelineLabel: "預期開發週期 (Dev Timeline)",
        timelinePlaceholder: "例如：第一階段 4 個月、總時程半年",
        stylePlaceholder: "例如：企業級後台介面 (Dashboard UI)、高資訊密度設計...",
        deliverablesLabel: "系統功能與技術規格 (System Specs)",
        deliverablesPlaceholder: "例如：API 文件、原始碼交付、Docker 部署檔...",
        customFields: [
            { name: "techStack", label: "技術棧要求 (Tech Stack)", placeholder: "請選擇技術背景...", type: "multi-select", options: ['Java / Spring Boot', 'Node.js (NestJS/Express)', 'Python (Django/FastAPI)', 'Go (Golang)', 'React / Next.js', 'Vue / Nuxt.js', 'PHP (Laravel)', 'C# / .NET Core'] },
            { name: "deployment", label: "部署環境需求", placeholder: "請選擇部署方式...", type: "select", options: ['雲端平台 (AWS / GCP / Azure)', '虛擬主機 (Linode / DigitalOcean)', '客戶機房本地部署 (On-premise)', '混合雲架構 (Hybrid Cloud)', 'Serverless / Static Hosting'] },
            { name: "ipOwnership", label: "智財權歸屬 (IP)", placeholder: "請選擇智財權處理方式...", type: "select", options: ['全額買斷 (IP Transfer)', '原始碼授權 (不含轉售權)', '僅交付成品使用權 (License)', '開源協議交付 (Open Source)'] },
            { name: "deliverablesDetail", label: "交付物細節 (Deliverables)", placeholder: "請選擇交付項目...", type: "multi-select", options: ['系統原始碼 (Source Code)', 'API 文件 (Swagger/Postman)', 'Docker 部署腳本', '資料庫 Schema 文件', '單元測試報告', '使用者操作手冊 (User Manual)'] },
            { name: "slaNeeds", label: "技術支援與 SLA 需求", placeholder: "請選擇支援等級...", type: "multi-select", options: ['基礎故障修復 (Bug Fix)', '7/24 高可用性支援', '定期功能微調與維護', '安全性滲透測試 (Regular)', '不需額外維護'] },
            { name: "migration", label: "資料遷移需求", placeholder: "是否需處理舊資料？", type: "select", options: ['全新建置 (不需搬遷)', '需代為搬遷舊資料 (Migration)', '僅需提供 API 對接', '客戶自行處理'] }
        ]
    },
    aiPrompts: {
        reportGeneration: `你是一位軟體外包顧問兼提案策略師。請生成一份「外包專案評估與建議報告」，結構如下：

**第一段 - 痛點共鳴**：點出客戶在外包過程中最常遇到的 1-2 個核心痛點（如：規格不清導致無限追加、驗收後才發現品質問題）。

**第二段 - 解決方案**：提供本次外包的推薦架構（如：分期式外包 vs 整包外包），說明此方案如何規避風險。

**第三段 - ROI 分析**：量化外包效益（如：節省多少內部人力成本、加速多少上市時程）。

**第四段 - 廠商評選標準**：提供具體的廠商篩選評分表（技術能力、溝通效率、樣本作品、合約條款）。

**第五段 - 風險預警與合約重點**：點出最常見的外包合約陷阱，並提供防禦建議。`,
        customerChat: `你是一位軟體外包資深顧問。溝通哲學是「幫客戶買得對，不只是買得便宜」。

關鍵行為準則：
1. 在客戶詢價前，先協助他釐清需求規格——沒有規格，任何報價都是謊言。
2. 當客戶只以「價格最低」為標準時，溫和地說明低價外包的隱形成本（二次開發、溝通耗損）。
3. 主動提供「廠商評選評分表」，讓客戶有客觀工具做決策，而非憑感覺。
4. 強調智慧財產保護的重要性，確保合約中有明確的原始碼移交與保密條款。`,
        quotationSuggestion: `請根據外包項目內容，產出「外包成本結構分析」，包含：

**直接成本**：開發費、測試費、部署費。
**間接成本**：PM 溝通成本、需求修改成本、驗收測試人力。
**風險準備金**：建議保留 10-15% 作為需求變更緩衝。

並提供「自建 vs 外包」的成本效益比較，幫助客戶做出最佳決策。`
    },
    reportTemplate: {
        structure: `# 軟體系統開發評估報告\n\n## 1. 業務需求與痛點分析\n\n## 2. 系統架構與技術選型\n- 系統架構圖簡述：\n- 前後端技術棧：\n- 雲端部署方案：\n\n## 3. 資料庫設計與安全性考量\n\n## 4. 開發里程碑與 MVP 規劃\n\n## 5. 後續維護 (SLA) 建議`,
        terminology: {
            'API': '應用程式介面 (系統之間互相溝通的橋樑)',
            'MVP': '最小可行性產品 (先開發核心功能上線測試市場，再逐步擴充)',
            'SLA': '服務級別協議 (承諾的系統穩定度與故障修復時間)'
        },
        analysisDimensions: ['系統擴充性 (Scalability)', '高可用性 (HA)', '資訊安全', '維護成本與技術債']
    },
    contractHighlights: {
        mustHaveClauses: ['原始碼交付條件（全額付清後移交，或僅授權使用）', '保密協定 (NDA) 與客戶資料所有權聲明', '明確定義 Bug 與新功能的界線（Bug 免費修，新功能另外報價）'],
        industrySpecificClauses: ['第三方 API 變動免責條款（若因串接的外部服務改版導致功能失效，修復需另計費）', '開源軟體 (Open Source) 使用聲明', 'SLA 服務等級定義與響應時間承諾'],
        acceptanceCriteria: ['核心業務邏輯運行無誤', 'API 回應時間在約定範圍內', '通過基礎的安全弱點掃描'],
        paymentMilestones: [
            { stage: '簽約訂金', percentage: 30, trigger: '合約與 NDA 簽署完畢' },
            { stage: 'SA/SD 系統分析確認', percentage: 20, trigger: '系統分析規格書、API 文件或資料庫 Schema 確認' },
            { stage: 'Beta 測試版交付', percentage: 30, trigger: '功能開發完成，交付 UAT 測試' },
            { stage: '正式上線驗收', percentage: 20, trigger: '系統部署至正式環境且無重大嚴重錯誤' }
        ]
    },
    quotationConfig: {
        categoryName: '軟體開發專案',
        unit: '人月/模組',
        terminology: { '客戶': '甲方', '我們': '乙方' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "您好，我是系統解決方案顧問。軟體開發是一項長期的投資，為了確保最終的系統能真正解決您的業務痛點，並且具備未來擴充的彈性，我們需要先深入了解您的業務邏輯與流程。",
        discoveryQuestions: ['這個系統主要是解決公司內部的什麼問題？或是提供給哪種外部使用者使用？', '預期的同時上線人數、資料量等級大約落在哪裡？（這關係到架構設計）', '上線後，貴公司內部有 IT 人員可以接手維護，還是希望能由我們提供長期的維護服務 (SLA)？'],
        objectionHandling: {
            '開發費用太高': '客製化軟體如同量身訂做西裝。我們的報價涵蓋了嚴謹的系統分析 (SA) 與架構設計，這能避免系統在未來因為一點小修改就牽一髮動全身。如果預算有限，我們強烈建議先定義出 MVP (最小可行性產品)，把預算花在最核心的刀口上。',
            '為什麼不能明確保證沒有 Bug': '任何複雜的軟體系統在特定極端操作下都可能產生未預期的錯誤。因此，我們在合約內包含了明確的保固期與 SLA 條款，保證在上線後遇到問題時，我們會在約定的時間內為您修復。'
        },
        closing: "經過今天的討論，我們對系統的輪廓有了清晰的認知。接下來我會整理一份初步的系統架構建議與 MVP 開發時程報價供您評估。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '系統需求訪談與 SA 分析', type: 'internal', duration: '2-4 週', assignee: 'SA / PM' },
            { name: '系統架構與資料庫設計 (SD)', type: 'internal', duration: '1-2 週', assignee: 'Architect / Tech Lead' },
            { name: '前後端平行開發', type: 'internal', duration: '1-3 個月', assignee: 'Dev Team' },
            { name: '系統整合測試 (SIT)', type: 'internal', duration: '2 週', assignee: 'QA' },
            { name: '使用者驗收測試 (UAT)', type: 'external', duration: '2 週', assignee: 'Client' },
            { name: '雲端環境部署與上線', type: 'internal', duration: '1 週', assignee: 'DevOps' },
            { name: '技術移交與教育訓練', type: 'internal', duration: '1 週', assignee: 'PM / Tech Lead' }
        ],
        milestones: [
            { label: '需求凍結與規格書簽署', order: 1 },
            { label: '核心模組開發完成', order: 2 },
            { label: 'UAT 驗收測試', order: 3 },
            { label: '正式部署與移交', order: 4 }
        ],
        workflow: {
            diagram: "graph TD\\n  A[需求收集] --> B[SA/SD 系統分析設計]\\n  B --> C[Sprint 開發迭代]\\n  C --> D[SIT/UAT 測試]\\n  D --> E[CI/CD 自動化部署]\\n  E --> F[維護與營運 (SLA)]",
            description: "推薦採用敏捷開發 (Scrum)，透過短週期的迭代交付，確保開發方向與業務需求一致。"
        }
    },
    defaultItems: [
        { description: '需求分析與技術規劃 (Requirement Analysis)', quantity: 1, unitPrice: 25000 },
        { description: '系統開發（按功能模組計價）(Development)', quantity: 1, unitPrice: 80000 },
        { description: '測試與部署 (Testing & Deployment)', quantity: 1, unitPrice: 15000 },
        { description: '維護與技術支援（月費）(Maintenance)', quantity: 1, unitPrice: 10000 },
    ],
    projectTypes: [
        { id: 'custom_software', label: '💻 客製化軟體 (Custom Software)', description: '企業專屬系統開發' },
        { id: 'saas', label: '☁️ SaaS 產品 (SaaS Product)', description: '雲端訂閱制軟體' },
        { id: 'api_integration', label: '🔌 API 整合 (API Integration)', description: '第三方服務串接' },
    ],
};
