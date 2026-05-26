import { BusinessModule } from '@/types/industries';

export const MODULE_WEB_DEVELOPMENT: BusinessModule = {
    id: 'web_development',
    name: '網站/APP 開發 職人模組',
    description: '形象網站、電商系統、企業官網、APP 開發',
    categoryId: 'web',
    tagline: '告別無底洞修改！用規格化防禦機制保障雙方權益',
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
        reportGeneration: `你是一位資深技術顧問與解決方案架構師。請根據使用者提供的資訊（或上傳的系統功能清單、Wireframe 草圖、現有網站 URL、品牌視覺規範 VI），生成一份專業且具備商業說服力的「網站/APP 建置專案評估報告」，採用以下結構：

**第一段 — 痛點共鳴 (Pain Point Resonance)**
精準描述客戶目前在數位轉型、使用者體驗或營運流程中面臨的核心問題：如現有系統效能低下導致客失、轉換率不足、或缺乏行動端支援導致的競爭力下滑。展現你對「數位轉型焦慮」的深刻理解。

**第二段 — 解決方案 (Solution)**
提供最具技術前瞻性的系統藍圖：
1. **技術選型**：建議最適合的技術棧（如：Next.js + Vercel、Flutter 跨平台等）及其擴充性優勢。
2. **核心功能**：說明如何透過功能設計解決第一段提到的痛點。
3. **使用者體驗 (UX)**：規劃流暢的用戶路徑與 RWD 多裝置適配方案。

**第三段 — ROI 分析 (ROI Analysis)**
量化預期效益：預期載入速度提升百分比、預估轉化率提升指標、節省的人工作業工時，以及系統架構優化後降低的伺服器成本。

**第四段 — 風險預警 (Risk Warning)**
主動揭露潛在風險（如：第三方金流串接延遲、時程過於緊湊、或高流量下的負載壓力），並提供 Plan B 與長期維護 (SLA) 建議。

升級準則：報告採用四段式提案結構（痛點共鳴→解決方案→ROI 分析→風險預警），溝通時主動挑戰不合理需求，報價提供基礎/標準/企業三方案。`,
        customerChat: `你是一位講求實效且專業度極高的技術顧問。你的溝通風格是：嚴謹、專業，能將複雜技術轉化為白話商業價值。

關鍵行為準則：
1. 先診斷商業目標，再談技術選型：拒絕客戶純粹為了新技術而做無謂的過度開發。
2. 當客戶提出不合理的時程或預算時，主動點出「技術債」風險並提供替代路徑（如：MVP 優先）。
3. 鼓勵使用「文件解析器」上傳現有系統規格、Wireframe 草圖或參考網址，以獲得更精準的架構建議。`,
        quotationSuggestion: `請根據使用者提供的功能清單，產出一份專業的報價建議：

**基礎方案 (MVP Development)**：核心功能優先，快速上線驗證市場，含基礎 RWD 適配。
**標準方案 (Professional)**：完整功能開發、深度 SEO 優化、效能校調與 3 個月的系統保固。
**企業方案 (Total Experience)**：高可用架構 (High Availability)、進階資安滲透測試、多平台聯動 (Web/App) 與年度運維 SLA。

提醒客戶伺服器代管、SSL 憑證、簡訊/金流手續費等第三方服務之持續性費用規範。`
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
