import { BusinessModule } from '@/types/industries';

export const MODULE_BUSINESS_CONSULTING: BusinessModule = {
    id: 'business_consulting',
    name: '企業管理顧問',
    description: '企業診斷、流程優化、組織重整、數位轉型',
    categoryId: 'consulting',
    tagline: '顧問建議有依據，保密協議有保障',
    targetUser: '管理顧問、企業診斷師',
    painPoints: ['顧問建議不被執行', '成效難以量化', '保密資訊外洩風險'],
    corePrompt: `Role: 企業顧問與策略導師 (Business Consultant)
    Profile: 你專精於組織發展與流程優化。你的專業涵蓋企業診斷、策略規劃、變革管理與數位轉型。
    Focus: 可執行的洞察、可衡量的成果與實施路徑圖。
    Task: 請提供完整的顧問提案，包含現況分析、建議方案與執行計畫。
    Reality Check: 主動提示客戶潛在風險並提出替代方案，確保每項投資都有清晰的 ROI 依據。
    Proposal Mindset: 所有報告與建議都應具備說服力——痛點共鳴、解決方案、ROI 分析、風險預警四段式結構。`,
    formConfig: {
        descriptionPlaceholder: "請描述企業目前面臨的主要挑戰或轉型目標 (Challenges & Goals)...",
        styleLabel: "合作模式與期望重點 (Collaboration Mode)",
        stylePlaceholder: "這項服務不需填寫視覺風格，您可以描述期望的合作方式，例如：\n• 輔導頻率：每週一次固定現場輔導、每月一次數位轉型進度檢核\n• 溝通偏好：希望與決策層直接對接、需要提供詳細的數據分析報告\n• 預期成果：希望在三個月內優化內部流程，讓跨部門溝通順暢",
        timelineLabel: "預期輔導週期 (Duration)",
        timelinePlaceholder: "例如：年度顧問合約、為期半年的轉型",
        deliverablesLabel: "諮詢重點與輔導產出 (Consulting Outcomes)",
        deliverablesPlaceholder: "例如：企業診斷報告、流程優化方案、每週顧問會議...",
        customFields: [
            { name: "companySize", label: "公司規模 (Company Size)", placeholder: "請選擇公司規模...", type: "select", options: ['微型企業 / 個人工作室 (5人以下)', '中小型企業 SME (5-50人)', '中大型企業 (50-200人)', '大型集團 / 上市公司 (200人以上)'] },
            { name: "industrySector", label: "所屬產業類別", placeholder: "請選擇產業...", type: "select", options: ['傳統製造業', '零售 / 批發 / 服務業', '技術服務 / 軟體開發', '金融 / 法律 / 專業諮詢', '醫療衛生 / 生技', '政府 / 教育 / 非營利'] },
            { name: "consultingScope", label: "諮詢與輔導範疇", placeholder: "請選擇諮詢項目 (可複選)...", type: "multi-select", options: ['全案企業診斷 (Diagnosis)', '經營戰略與佈局規劃', '內部流程優化 (Process)', '組織人事重整與文化', '數位轉型與系統導入', 'ESG / 永續經營顧問'] },
            { name: "engagementModel", label: "合作參與模式", placeholder: "請選擇合作方式...", type: "select", options: ['單一專案制 (Project-based)', '年度顧問約 (Retainer)', '按進度里程碑結案', '成功報酬制 (Success-fee)'] },
            { name: "keyObjectives", label: "關鍵輔導目標", placeholder: "請選擇目標 (可複選)...", type: "multi-select", options: ['提升整體營運效率', '營收績效成長', '降低營運成本', '企業轉型突破', '品牌形象升級'] },
            { name: "mainChallenge", label: "目前核心痛點", placeholder: "例如：營收停滯, 組織溝通不良...", type: "text" }
        ]
    },
    aiPrompts: {
        reportGeneration: `你是一位高階管理顧問與企業診斷師。請根據使用者提供的資訊（或上傳的財務報表、組織架構圖、年度計畫），生成一份「企業營運診斷與成長提案報告」，採用以下結構：

**第一段 — 痛點共鳴 (Pain Point Resonance)**
精準描述企業目前的管理瓶頸，如：組織溝通穀倉、營收成長停滯、或因制度不健全導致的各類內耗，展現你對經營困境的深度理解。

**第二段 — 解決方案 (Solution)**
提供系統化的改善藍圖：
1. **根因剖析**：找出導致問題的核心節點。
2. **策略路徑**：分階段建議改善方案（如：SOP 建立、KPI 體系優化、或數位轉型路徑）。
3. **資源盤點**：說明企業內部需投入的關鍵資源。

**第三段 — ROI 與長期價值 (ROI Analysis)**
量化顧問效益：預期營運效率的提升百分比、成本節約空間，以及建立「制度化」管理後帶來的長遠企業價值與估值加分。

**第四段 — 風險預警 (Risk Warning)**
主動揭露變革管理的潛在阻力（如：員工抗拒、短期的業績陣痛期、或外部環境變化）並提供防範與應對策略。

升級準則：報告採用四段式提案結構（痛點共鳴→解決方案→ROI 分析→風險預警），溝通時主動挑戰不合理需求，報價提供基礎/標準/企業三方案。`,
        customerChat: `你是一位沉穩、老練且具備同理心的策略顧問。你的溝通風格是：睿智、精確，擅長從混亂的現象中梳理出商業邏輯。

關鍵行為準則：
1. 堅持「事實勝於雄辯」：主動要求數據支持，不隨意給出未經診斷的靈丹妙藥。
2. 當客戶急於求成時，進行專業的期望值管理，引導其看見系統性問題。
3. 鼓勵使用「文件解析器」上傳「年度目標 (OKR)」、「組織架構表」或「特定流程 SOP」，以進行更深度的管理脈絡診斷。`,
        quotationSuggestion: `請提供管理顧問服務報價建議：

**基礎方案 (Discovery)**：企業現況快速診斷、核心問題識別與改善建議書。
**標準方案 (Transformation)**：含深度流程優化、KPI/OKR 體系建立與為期三個月的現場輔導。
**企業方案 (Partnering)**：年度顧問約、含高階經理人一對一教練、全面組織變革管理與成功報酬掛鉤。

提醒客戶注意輔導過程中的交通車馬費與專屬教材費通常採實報實銷。`
    },
    reportTemplate: {
        structure: `# 企業管理與營運診斷提案\n\n## 1. 企業現況與核心挑戰 (Current Situation)\n\n## 2. 問題根因分析 (Root Cause Analysis)\n- 組織與人事面：\n- 流程與制度面：\n\n## 3. 顧問輔導目標與預期效益 (Objectives & ROI)\n\n## 4. 輔導方法論與執行階段劃分 (Methodology)\n- Phase 1: 深度診斷與共識凝聚\n- Phase 2: 制度導入與流程優化\n- Phase 3: 績效追蹤與固化\n\n## 5. 專案時程與資源投入需求`,
        terminology: {
            'Quick Wins': '速贏策略 (在輔導初期，挑選最容易見效、成本最低的痛點進行改善，以建立團隊信心)',
            'SOP / SIP': '標準作業程序 / 標準檢驗程序 (將隱性知識顯性化，降低人員流動帶來的營運風險)',
            'Change Management': '變革管理 (處理組織在導入新制度或系統時，員工產生的抗拒心理，是顧問的核心價值之一)'
        },
        analysisDimensions: ['營運效率與成本結構', '組織架構合理性', '部門溝通與協作壁壘', '企業文化與員工士氣']
    },
    contractHighlights: {
        mustHaveClauses: ['保密協定 (NDA)（乙方對輔導過程中所接觸之財務數據、商業機密與薪資結構負有絕對保密義務）', '免責與成效聲明（顧問提供專業建議與方法論，但企業內部執行力將直接影響最終成效，乙方不對特定營收數字做絕對保證）', '提前終止條款（若雙方合作理念不合，需提前 X 日書面通知方可終止合約，並結算已發生之費用）'],
        industrySpecificClauses: ['智慧財產權歸屬（顧問提供之專屬教材、表單模板與方法論，版權屬乙方所有，甲方僅限內部使用，不得轉售）', '競業禁止條款（在合約期間及結束後 X 個月內，乙方不得為甲方的直接競爭對手提供相同範疇之輔導）'],
        acceptanceCriteria: ['按合約約定之頻率(如每週/每月)提交進度輔導報告', '交付約定之專案產出物(如：全新 SOP 手冊、績效考核制度表)'],
        paymentMilestones: [
            { stage: '簽約與啟動金', percentage: 30, trigger: '合約簽署，啟動深度訪談與數據調閱' },
            { stage: '診斷報告交付', percentage: 30, trigger: '完成現況診斷並提交策略規劃書時' },
            { stage: '輔導期中款', percentage: 20, trigger: '輔導計畫執行達 50% 時' },
            { stage: '結案尾款', percentage: 20, trigger: '輔導週期結束，提交最終結案與成效報告' }
        ]
    },
    quotationConfig: {
        categoryName: '企業診斷與管理顧問',
        unit: '專案/月',
        terminology: { '客戶': '委任企業', '我們': '管理顧問團隊' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "您好，我是企業管理顧問。很多企業在成長期都會遇到『人治大於法治』的瓶頸。在我們進行全面診斷前，我想先請問，如果您能立刻解決公司內部的一個問題，您最想消滅哪個痛點？",
        discoveryQuestions: ['目前公司內部跨部門溝通的狀況如何？是否有明顯的穀倉效應(Silo Effect)？', '過去是否曾經嘗試過導入新制度或系統？當時失敗或推行不順的原因是什麼？', '在接下來的輔導過程中，您本人(決策者)能夠承諾投入多少時間參與？（高階主管的參與度是變革成功的關鍵）'],
        objectionHandling: {
            '顧問費太貴了，這筆錢我不如多請兩個資深員工？': '資深員工能幫您「做事」，但顧問能幫您「建立系統」。我們帶入的是跨產業的最佳實踐(Best Practice)以及客觀的第三方視角。這套系統建立起來後，未來每個員工的產值都會提升，這是一項能帶來複利的投資。',
            '你們不懂我們產業的特殊性，能給出有用建議嗎？': '產業知識(Domain Know-how)是您的強項，而組織管理與流程優化是我們的專業。顧問的價值不是教您怎麼做產品，而是運用邏輯框架，幫您找出流程中的浪費、梳理權責，把您的專業知識轉化為可傳承的標準化制度。'
        },
        closing: "您的痛點我非常清楚，這在快速成長的企業中很常見。我會先為您安排一次 2 小時的『高階主管深度訪談』，之後再提交一份量身打造的初步診斷提案。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '高階主管與關鍵人物深度訪談', type: 'internal', duration: '1-2 週', assignee: 'Lead Consultant' },
            { name: '內部數據調閱與流程觀察', type: 'internal', duration: '2 週', assignee: 'Consulting Team' },
            { name: '企業診斷報告與策略提案撰寫', type: 'internal', duration: '1-2 週', assignee: 'Consulting Team' },
            { name: '策略共識營 (Workshop) 與提案確認', type: 'external', duration: '1 天', assignee: 'Consultant & Client' },
            { name: '制度設計與 SOP 建立', type: 'internal', duration: '3-4 週', assignee: 'Consulting Team' },
            { name: '新制度導入輔導與教育訓練', type: 'external', duration: '1-2 個月', assignee: 'Consultant & HR' },
            { name: '成效追蹤與滾動式修正', type: 'internal', duration: '持續進行', assignee: 'Consulting Team' }
        ],
        milestones: [
            { label: '現況盤點與深度訪談完成', order: 1 },
            { label: '診斷報告與改善藍圖定案', order: 2 },
            { label: '新制度/流程設計完成', order: 3 },
            { label: '全員教育訓練與正式上線', order: 4 }
        ],
        workflow: {
            diagram: "graph TD\\n  A[需求確認與簽約] --> B[深度訪談與數據盤點]\\n  B --> C[診斷報告與策略提案]\\n  C --> D[共識營與目標對焦]\\n  D --> E[制度設計與導入輔導]\\n  E --> F[績效追蹤與結案]",
            description: "顧問輔導是一段雙向承諾的旅程，強調查明問題根因(Root Cause)後，凝聚高層共識才進入執行，避免為了改變而改變。"
        }
    },
    defaultItems: [
        { description: '現況診斷與分析 (Business Diagnosis)', quantity: 1, unitPrice: 40000 },
        { description: '策略規劃報告 (Strategy Planning)', quantity: 1, unitPrice: 50000 },
        { description: '流程優化方案設計 (Process Optimization)', quantity: 1, unitPrice: 35000 },
        { description: '導入輔導與教育訓練 (Implementation Support)', quantity: 1, unitPrice: 30000 },
    ],
    projectTypes: [
        { id: 'business_diagnosis', label: '🔍 企業診斷 (Diagnosis)', description: '現況分析、問題診斷' },
        { id: 'process_optimization', label: '⚙️ 流程優化 (Process)', description: '流程改善、效率提升' },
        { id: 'digital_transformation', label: '💻 數位轉型 (Digital)', description: '數位化、系統導入' },
        { id: 'legal_admin', label: '⚖️ 法律行政與代撰', description: '契約擬定、法律文件代撰、合規諮詢' },
        { id: 'psy_coaching', label: '🧠 心理諮詢與教練', description: '職涯諮詢、高階領導心理、心靈教練' },
    ],
};
