import { BusinessModule } from '@/types/industries';

export const MODULE_WEB_DEVELOPMENT: BusinessModule = {
    id: 'web_development',
    name: '網站/APP 開發',
    description: '形象網站、電商系統、企業官網、APP 開發',
    categoryId: 'web',
    tagline: '把需求變成可驗收的系統，不再改不完',
    targetUser: '網頁工作室、全端工程師、接案開發者',
    painPoints: ['功能範圍不清、驗收標準模糊', '客戶一直追加功能', '改不完、收不到尾款'],
    corePrompt: `Role: 資深技術顧問與解決方案架構師 (Senior Technical Consultant)
    Profile: 你是一位精通網頁與行動應用開發的專家，熟悉現代化框架 (Next.js, React, Vue)、後端系統 (Node.js, Python) 與雲端基礎設施。擁有超過十年的系統架構設計與客戶提案經驗，曾協助數十家企業從零打造高流量平台。
    Focus: 系統擴充性、安全性、使用者體驗 (UX)、技術可行性，以及商業投資回報率 (ROI)。
    Reality Check: 當客戶需求存在以下風險時，你必須主動點出並提出替代方案：(1) 時程不合理（如 2 週內要做完電商系統）；(2) 預算遠低於市場行情；(3) 功能範圍模糊可能導致無限追加。
    Task: 請根據專案複雜度、功能需求與時程，提供詳細的成本預估、技術選型建議，以及清晰的 ROI 分析，讓客戶理解每一分投資的具體商業回報。`,
    formConfig: {
        descriptionPlaceholder: "請描述系統的核心功能與業務邏輯 (Business Logic)...",
        timelineLabel: "預期開發週期 (Dev Timeline)",
        timelinePlaceholder: "例如：3 個月內完工、12 月底正式上線",
        stylePlaceholder: "例如：參考 Apple 官網的極簡風格、現代化 RWD 設計...",
        deliverablesLabel: "主要功能需求 (Key Features)",
        deliverablesPlaceholder: "例如：會員系統、購物車、金流串接、後台管理 (Key Features)",
        customFields: [
            { name: "existingTech", label: "技術架構 (Stack)", placeholder: "請選擇技術背景...", type: "multi-select", options: ['React / Next.js', 'Vue / Nuxt.js', 'WordPress / PHP', 'Node.js (Express)', 'Python (Django/Flask)', 'iOS / Android Native', 'Flutter / React Native'] },
            { name: "targetPlatforms", label: "支援平台 (Platforms)", placeholder: "請選擇目標平台...", type: "multi-select", options: ['Web 網頁版', 'iOS App', 'Android App', 'PWA (行動網頁)', 'Desktop 桌面版', '微信/LINE 小程式'] },
            { name: "infrastructure", label: "基礎設施/託管需求", placeholder: "請選擇部署方式...", type: "multi-select", options: ['雲端平台 (AWS/GCP/Azure)', '虛擬主機 (VPS)', '靜態託管 (Vercel/Netlify)', '客戶自有伺服器', '尚未決定'] },
            { name: "optimizationGoals", label: "技術優化目標", placeholder: "請選擇重點目標...", type: "multi-select", options: ['SEO 搜尋優化', '極速載入校調', '無障礙設計 (WCAG)', 'RWD 多裝置相容', '資安強化/滲透測試'] },
            { name: "projectNature", label: "專案開發性質", placeholder: "請選擇開發性質...", type: "select", options: ['0 到 1 全新開發 (New Build)', '既有系統維護 (Maintenance)', '系統重構/升級 (Refactoring)', '單一功能增強 (Feature Update)'] },
            { name: "websiteUrl", label: "參考/現有網址 (URL)", placeholder: "https://", type: "text" }
        ]
    },
    aiPrompts: {
        reportGeneration: `你是一位資深網頁開發顧問兼提案策略師。請根據使用者需求，生成一份具備說服力的「網站建置專案提案書」，結構如下：

**第一段 - 痛點共鳴 (Hook)**：用 2-3 句話精準描述客戶目前面臨的核心問題，讓客戶感到「你完全懂我」。

**第二段 - 解決方案與獨家優勢**：說明本次技術選型的理由，強調為何這個架構比其他方案更適合客戶的業務目標（非技術語言）。

**第三段 - ROI 投資回報分析**：預估網站上線後可能帶來的具體效益，如「電商轉換率提升 15-20%」、「節省每月 X 小時人工作業」等可量化指標。

**第四段 - 技術架構藍圖**：前後端架構、技術選型、SEO/效能與資安規劃。

**第五段 - 階段時程與里程碑**：清晰的階段性交付計畫，讓客戶知道何時能看到成果。

**第六段 - 風險預警**：主動揭露潛在風險（如第三方 API 不穩定、需求變更的成本）並提出對應預案，展現職業誠信。`,
        customerChat: `你是一位網站開發資深顧問兼業務。你的溝通哲學是「先診斷，後開藥」——在提供任何方案前，必須先深度了解客戶的商業目標。

關鍵行為準則：
1. 將技術語言翻譯成商業價值（「SSR」= 「讓 Google 更容易找到您，提升自然流量」）。
2. 當客戶需求不合理時，溫和但堅定地挑戰：「我理解您希望在 3 週內完成，不過根據我的經驗，這樣的時程可能會犧牲 X 和 Y，導致上線後需要緊急修補，反而多花費 Z 的成本。我建議我們...」。
3. 主動引導升單：了解客戶未來規模後，建議「留後門」設計，讓客戶現在的投資在未來仍能持續發揮價值。
4. 使用「我們」而非「我」，讓客戶感受到是整個專業團隊在服務他。`,
        quotationSuggestion: `請根據使用者提供的網站功能清單，產出一份專業且具競爭力的分階段報價建議，格式如下：

**基礎方案 (MVP)**：包含核心功能，適合快速驗證市場。
**標準方案 (Standard)**：完整功能集，附帶 SEO 與效能優化。
**企業方案 (Enterprise)**：含客製化設計、資安強化與優先維護。

每個方案必須包含：前端、後端、資料庫、部署、測試費用，以及第三方服務成本提醒（伺服器、網域、金流手續費）。並說明各方案對業務目標的具體影響。`
    },
    reportTemplate: {
        structure: `# 網站建置專案評估報告\n\n## 1. 專案背景與目標\n\n## 2. 建議技術架構\n- 前端框架：\n- 後端/CMS：\n- 基礎設施：\n\n## 3. 核心功能亮點\n\n## 4. 時程與階段性產出\n\n## 5. 後續維護與擴充性規劃`,
        terminology: {
            'RWD': '響應式網頁設計 (確保手機、平板、電腦都能正常瀏覽)',
            'CMS': '內容管理系統 (讓您可以自行上架文章或產品的後台)',
            'SEO': '搜尋引擎優化 (提升在 Google 搜尋結果的排名)'
        },
        analysisDimensions: ['技術可行性', '使用者體驗 (UX)', 'SEO 與行銷擴充性', '資安與效能']
    },
    contractHighlights: {
        mustHaveClauses: ['原始碼與智財權歸屬說明（通常於尾款付清後移交）', '伺服器、網域與第三方服務之帳號歸屬與代管責任', '保固期限與免費修復範圍（通常為上線後 3-6 個月）'],
        industrySpecificClauses: ['瀏覽器相容性標準（如支援 Chrome, Safari, Edge 最新兩代版本）', '修改次數限制（如視覺設計提供 3 次大改）', '客戶需提供之資料（如文案、圖片）若延遲，專案時程自動順延'],
        acceptanceCriteria: ['所有功能皆符合規格書定義', '於指定測試主機上運行無 Fatal Error', 'RWD 在手機與桌機版面無嚴重跑版'],
        paymentMilestones: [
            { stage: '簽約訂金', percentage: 30, trigger: '合約簽署完畢' },
            { stage: '設計確認', percentage: 30, trigger: '視覺設計稿或 Wireframe 確認' },
            { stage: '測試版交付', percentage: 30, trigger: '前端與後台功能開發完成，發布於測試機' },
            { stage: '正式上線', percentage: 10, trigger: '系統正式發布上線，且原始碼移交' }
        ]
    },
    quotationConfig: {
        categoryName: '網站開發模組',
        unit: '式',
        terminology: { '客戶': '甲方 (委託方)', '我們': '乙方 (開發方)' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "您好，我是負責網站開發的顧問。很高興有機會為您服務！為了提供您最精準的報價與架構建議，我想先請教幾個關於您網站未來營運方向的問題。",
        discoveryQuestions: ['網站最主要的目的為何？（如：提升品牌形象、線上銷售、獲取名單）', '未來半年到一年內，是否有預計擴充的功能或流量成長的目標？', '是否有既有的品牌識別（Logo、標準色）或是參考的競品網站？'],
        objectionHandling: {
            '價格太貴': '我們的報價包含了高擴充性的架構設計與基礎 SEO 優化。市面上有套版網站雖然便宜，但在您未來想要客製化功能或調整版面時，往往會遇到技術瓶頸，甚至需要打掉重練。我們一開始把地基打好，長期來看反而能為您省下可觀的改版成本。',
            '開發時間太長': '為了確保上線後的品質與穩定性，我們安排了完整的測試與修正時間。如果您有緊急上線的壓力，我們也可以討論先推出「核心功能版 (MVP)」，其餘進階功能分第二階段上線。'
        },
        closing: "了解您的需求了，非常有挑戰性且令人期待的專案！我會盡快將這些需求整理成具體的規格與報價建議，並在 X 天內提供給您參考。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '需求訪談與規格書撰寫', type: 'internal', duration: '1 週', assignee: 'PM / SA' },
            { name: 'UI/UX 視覺設計', type: 'internal', duration: '2-3 週', assignee: 'UI Designer' },
            { name: '前端切版與互動開發', type: 'internal', duration: '3-4 週', assignee: 'Frontend Engineer' },
            { name: '後端 API 與資料庫建置', type: 'internal', duration: '3-4 週', assignee: 'Backend Engineer' },
            { name: '內部整合測試 (QA)', type: 'internal', duration: '1 週', assignee: 'QA / PM' },
            { name: '客戶驗收測試 (UAT)', type: 'external', duration: '1-2 週', assignee: 'Client' },
            { name: '正式上線與移交', type: 'internal', duration: '3 天', assignee: 'DevOps' }
        ],
        milestones: [
            { label: '專案啟動與規格確認', order: 1 },
            { label: '設計定稿', order: 2 },
            { label: '開發完成 (Beta 交付)', order: 3 },
            { label: '正式上線', order: 4 }
        ],
        workflow: {
            diagram: "graph LR\\n  A[需求釐清] --> B[系統分析與設計]\\n  B --> C[程式開發]\\n  C --> D[測試與修改]\\n  D --> E[正式上線]",
            description: "採用敏捷精神與瀑布流結合的流程，確保設計階段的共識，並在開發階段保持彈性。"
        }
    },
    defaultItems: [
        { description: '系統架構設計與規劃 (System Architecture)', quantity: 1, unitPrice: 30000 },
        { description: '前端介面開發 (RWD Responsive)', quantity: 1, unitPrice: 50000 },
        { description: '後端 API 與資料庫建置 (Backend API)', quantity: 1, unitPrice: 60000 },
        { description: '系統部署與測試 (Deployment & Testing)', quantity: 1, unitPrice: 20000 },
    ],
    projectTypes: [
        { id: 'website', label: '🌐 形象網站 (Corporate Website)', description: '企業官網、品牌形象網站' },
        { id: 'ecommerce', label: '🛒 電商系統 (E-commerce)', description: '線上購物平台、商城系統' },
        { id: 'app', label: '📱 APP 開發 (Mobile App)', description: 'iOS/Android 應用程式' },
    ],
};
