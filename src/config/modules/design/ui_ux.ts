import { BusinessModule } from '@/types/industries';

export const MODULE_UI_UX: BusinessModule = {
    id: 'ui_ux_design',
    name: 'UI/UX 介面設計',
    description: '使用者經驗分析、介面設計、交互原型製作',
    categoryId: 'design',
    tagline: '不只是畫圖，更是解決產品易用性問題',
    targetUser: 'UI/UX 設計師、產品設計師',
    painPoints: ['客戶分不清楚 UI 與 UX', '需求邊界模糊導致無限增改', '開發落地與設計稿有落差'],
    corePrompt: `Role: 資深 UI/UX 設計師與產品策略師
    Profile: 你精通使用者中心設計 (UCD) 流程，擅長將複雜的業務邏輯轉化為直觀的介面。你的專業涵蓋使用者研究、Wireframe 繪製、Hi-Fi UI 設計與交互原型。
    Focus: 易用性 (Usability)、資訊架構、視覺美感與開發者體驗 (DX)。
    Task: 請提供專業的 UI/UX 設計提案，包含設計階段拆解、交付規格與預期產出。`,
    formConfig: {
        descriptionPlaceholder: "請描述產品類型 (如: SaaS, 商城 APP) 與主要目標用戶...",
        styleLabel: "產品定位與風格偏好 (Product Style)",
        stylePlaceholder: "例如：現代簡潔、B2B 專業感、活潑鮮豔的電商風格...",
        timelineLabel: "設計時程要求 (Design Timeline)",
        timelinePlaceholder: "例如：三週內完成關鍵頁面 Wireframe",
        deliverablesLabel: "設計交付項目 (Design Deliverables)",
        deliverablesPlaceholder: "例如：Figma 設計稿、交互原型、設計規範 (Design System)...",
        customFields: [
            { name: "targetPlatform", label: "目標載體平台", placeholder: "請選擇平台 (可複選)...", type: "multi-select", options: ['響應式網頁 (RWD)', 'iOS / Android APP', '後台管理系統', '橫式大螢幕 / Kiosk'] },
            { name: "designDepth", label: "設計深度需求", placeholder: "請選擇設計深度...", type: "select", options: ['MVP 快速原型 (精簡版)', '完整產品介面設計 (全案)', '現有產品介面優化 (Redesign)', '設計系統建立 (Design System)'] },
            { name: "userFlow", label: "是否需要用戶流程圖 (User Flow)", placeholder: "請選擇需求狀態...", type: "select", options: ['需要完整用戶旅程分析', '僅需核心流程圖', '已有流程，直接設計介面', '不需要'] },
            { name: "interactionLevel", label: "交互原型細膩度", placeholder: "請選擇原型等級...", type: "select", options: ['靜態介面 (Static)', '初級點擊原型 (Clickable)', '高級交互動畫 (Hi-Fi Prototype)', '不需要原型'] },
            { name: "pageCount", label: "預計設計頁數", placeholder: "例如：總共 10-15 頁", type: "text" }
        ]
    },
    aiPrompts: {
        reportGeneration: `你是一位資深 UX 研究員與 UI 設計師。請根據客戶的產品願景與目標受眾，生成一份 UI/UX 設計提案。內容需包含：使用者旅程分析 (User Journey)、資訊架構規劃 (Information Architecture)、設計系統 (Design System) 建立策略，以及交付的高保真原型 (Hi-Fi Prototype) 規格。`,
        customerChat: `你是一位產品設計總監。溝通風格需兼顧同理心與邏輯思維。面對客戶要求「這裡加個按鈕、那裡加個跑馬燈」時，需以使用者體驗 (UX) 為核心，詢問其背後的商業目的，並從操作動線的合理性給出專業建議。`,
        quotationSuggestion: `請提供 UI/UX 專案報價建議。必須依據專案階段劃分：UX 研究與流程規劃、Wireframe 繪製、UI 視覺設計與互動原型製作。並提醒客戶設計系統 (Design System) 組件庫的建立需另計費用。`
    },
    reportTemplate: {
        structure: `# UI/UX 介面與體驗設計提案\n\n## 1. 產品定位與使用者輪廓 (Persona)\n\n## 2. 使用者旅程與痛點分析 (User Journey)\n\n## 3. 資訊架構規劃 (Information Architecture)\n- 核心功能模組：\n- 導覽列與選單結構：\n\n## 4. 視覺設計系統 (Design System) 定調\n- 品牌色彩與字體：\n- 元件庫風格 (Component Style)：\n\n## 5. 專案產出交付物與協作流程`,
        terminology: {
            'Wireframe': '線框圖 (專注於資訊架構與排版的草圖，不含色彩與視覺細節)',
            'Prototype': '互動原型 (模擬最終產品點擊與轉場效果的動態模型)',
            'Design System': '設計系統 (統一按鈕、字體、色彩等元件的規範，確保開發與設計的一致性)'
        },
        analysisDimensions: ['直覺易用性 (Usability)', '視覺一致性 (Consistency)', '無障礙設計 (Accessibility)', '開發可行性 (Feasibility)']
    },
    contractHighlights: {
        mustHaveClauses: ['設計階段確認制（Wireframe 階段確認後方可進入 UI 視覺設計，若進入 UI 階段後要求更改 Wireframe 結構需另行報價）', '交付物定義（明確定義交付之原始檔格式，如 Figma 連結，以及是否包含標註文件 Handoff）', '版權與智慧財產權（設計費付清後，UI 介面之著作財產權歸甲方所有，乙方保留作為作品集展示之權利）'],
        industrySpecificClauses: ['前端開發免責聲明（乙方僅負責介面設計與交互原型，不包含前端程式切版與功能開發）', '修改次數與時限（每個設計階段提供 N 次微調，超出次數或客戶未於 X 日內回覆視為確認）'],
        acceptanceCriteria: ['完成全站/APP 頁面之高保真 (Hi-Fi) 設計稿', '提供可點擊之互動原型 (Interactive Prototype)', '交付開發者友好之標註與資源檔 (Handoff)'],
        paymentMilestones: [
            { stage: '簽約與需求盤點', percentage: 30, trigger: '合約簽署，啟動 UX 研究與資訊架構規劃' },
            { stage: 'Wireframe 確認', percentage: 30, trigger: '低保真線框圖與核心流程確認' },
            { stage: 'UI 視覺定調', percentage: 20, trigger: '首頁或主視覺風格 (Key Vision) 確認' },
            { stage: '完稿與切圖交付', percentage: 20, trigger: '全案設計完稿並交付開發資源' }
        ]
    },
    quotationConfig: {
        categoryName: 'UI/UX 介面設計',
        unit: '專案',
        terminology: { '客戶': '產品方', '我們': '設計團隊' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "您好，我是您的 UI/UX 設計師。好的介面不只是『好看』，更要『好用』。我們設計的出發點，永遠是幫助您的用戶更順暢地完成他們想做的任務。請問這款產品想解決用戶最核心的痛點是什麼？",
        discoveryQuestions: ['這款產品的目標受眾年齡層與數位熟悉度為何？（這會影響按鈕大小與提示文字的設計）', '目前市面上您認為哪一款 APP 或系統的操作體驗最棒？為什麼？', '您的開發團隊對於前端技術有什麼限制嗎？（例如是否有指定使用的 UI 框架？）'],
        objectionHandling: {
            '這介面看起來太素了，可以多點特效嗎？': '在介面設計中，「少即是多」。過多的特效與裝飾會分散用戶的注意力，甚至拖慢網頁載入速度。我們目前的極簡設計是為了凸顯您的核心內容，並引導用戶順利完成結帳轉換。',
            '為什麼 Wireframe 階段不能先上色？我感覺不到畫面': 'Wireframe 的目的是讓我們專注於『骨架』——也就是資訊結構與操作動線是否合理。如果提早上色，大家很容易陷入對顏色的主觀喜好爭論，而忽略了最重要的流程邏輯。確認骨架穩固後，我們一定會為您穿上最漂亮的衣服 (UI)。'
        },
        closing: "非常清楚！接下來我會先梳理出產品的『資訊架構圖 (Information Architecture)』，確認所有的功能模組都沒有遺漏，我們再進入介面的繪製。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '需求訪談與使用者旅程分析', type: 'internal', duration: '1 週', assignee: 'UX Designer' },
            { name: '資訊架構 (IA) 與 Wireframe 繪製', type: 'internal', duration: '1-2 週', assignee: 'UX Designer' },
            { name: 'Wireframe 客戶確認與修改', type: 'external', duration: '1 週', assignee: 'Client' },
            { name: '主視覺定調與 Design System 建立', type: 'internal', duration: '1-2 週', assignee: 'UI Designer' },
            { name: '全站/全頁面 UI 高保真設計', type: 'internal', duration: '2-4 週', assignee: 'UI Designer' },
            { name: '互動原型 (Prototype) 製作', type: 'internal', duration: '1 週', assignee: 'UI Designer' },
            { name: '開發者交接 (Handoff) 與標註說明', type: 'internal', duration: '3 天', assignee: 'UI Designer' }
        ],
        milestones: [
            { label: '資訊架構與 Wireframe 確認', order: 1 },
            { label: '主視覺與元件庫 (UI Kit) 定調', order: 2 },
            { label: '全頁面 UI 完稿', order: 3 },
            { label: '原型製作與開發交接完成', order: 4 }
        ],
        workflow: {
            diagram: "graph TD\\n  A[UX 研究與架構分析] --> B[Wireframe 繪製]\\n  B --> C[客戶確認流程]\\n  C --> D[UI 視覺定調與元件庫建立]\\n  D --> E[全頁面高保真設計]\\n  E --> F[Prototype 與開發交接]",
            description: "嚴格遵守「結構優先，視覺其後」的設計守則，確保 UX 邏輯正確才進行 UI 美化。"
        }
    },
    defaultItems: [
        { description: '使用者流程與資訊架構分析 (User Flow & IA)', quantity: 1, unitPrice: 15000 },
        { description: '低保真線框圖設計 (Wireframes)', quantity: 1, unitPrice: 20000 },
        { description: '高保真視覺介面設計 (UI Design)', quantity: 1, unitPrice: 45000 },
        { description: '交互原型製作 (Interactive Prototyping)', quantity: 1, unitPrice: 12000 },
        { description: '初版設計規範建立 (Basic Design System)', quantity: 1, unitPrice: 18000 },
    ],
    projectTypes: [
        { id: 'app_design', label: '📱 APP 介面設計 (Mobile)', description: '行動裝置應用程式設計' },
        { id: 'web_ux', label: '💻 網頁體驗設計 (Web UX)', description: 'RWD 網站或 SaaS 介面設計' },
        { id: 'system_design', label: '⚙️ 系統介面設計 (Admin)', description: '複雜後台或專業軟體介面' },
        { id: 'design_system', label: '📚 設計規範建立 (Atomic)', description: '組件庫與品牌 Guideline' },
    ],
};
