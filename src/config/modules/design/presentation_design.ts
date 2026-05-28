import { BusinessModule } from '@/types/industries';

export const MODULE_PRESENTATION_DESIGN: BusinessModule = {
    id: 'presentation_design',
    name: '簡報與提案設計 職人模組 (Open Design)',
    description: 'Pitch Deck、商業簡報、HTML 網頁簡報與系統化設計 (Design System)',
    categoryId: 'design',
    tagline: '終結排版地獄！透過模組化設計系統與 AI 生成專屬高轉化率提案',
    targetUser: '簡報設計師、提案企劃、商業拓展 (BD)',
    painPoints: ['客戶對簡報設計無止盡微調', '缺乏系統化導致每份簡報都從零開始', '文字與視覺邏輯脫節', '提案缺乏互動與現代感 (如 HTML PPT)'],
    corePrompt: `Role: 資深簡報設計師與提案策略師 (Pitch Deck Specialist)
    Profile: 你精通商業邏輯視覺化，擅長將複雜的商業模式轉化為極具說服力的簡報 (Pitch Deck)。你的專業涵蓋大綱梳理、設計系統 (Design System) 導入、HTML PPT / 橫向滑動簡報設計。
    Focus: 說服力 (Persuasion)、資訊層級、視覺張力與模組化重用。
    Task: 請提供專業的簡報設計提案，包含內容企劃、視覺定調與預期產出格式 (如靜態 PDF 或互動式 HTML 簡報)。
    Reality Check: 主動釐清簡報的「目標受眾 (TA)」與「核心目的」，避免無效的視覺過度包裝。
    Proposal Mindset: 所有報告都應具備：核心商業目的、視覺與設計系統 (Design System) 規劃、ROI 分析與互動技術導入 (如 HTML PPT)。`,
    formConfig: {
        descriptionPlaceholder: "請描述簡報主題 (如: 募資 Pitch Deck, 企業介紹, 產品發佈會) 與目標受眾...",
        styleLabel: "視覺風格與品牌調性",
        stylePlaceholder: "例如：Apple 蘋果極簡風、科技感、專業沈穩的顧問風格...",
        timelineLabel: "預計完成時間",
        timelinePlaceholder: "例如：兩週內完成 15 頁初稿",
        deliverablesLabel: "期望交付格式",
        deliverablesPlaceholder: "例如：PowerPoint、Keynote、Figma 原始檔或互動式 HTML 網頁簡報...",
        customFields: [
            { name: "slideCount", label: "預計總頁數", placeholder: "例如：約 15-20 頁", type: "text" },
            { name: "designDepth", label: "設計深度需求", placeholder: "請選擇設計深度...", type: "select", options: ['僅美化排版 (已有完整文字內容)', '內容梳理 + 全案設計', '互動式簡報 (HTML PPT / 網頁版)', '建立企業專屬簡報設計系統 (Design System)'] },
            { name: "interactiveNeed", label: "是否需要特殊互動效果", placeholder: "請選擇互動需求...", type: "select", options: ['靜態無動畫', '基礎轉場動畫', '進階動態與橫向滑動 (如 Guizang PPT)', '完全網頁化互動'] }
        ]
    },
    aiPrompts: {
        reportGeneration: `你是一位資深簡報提案策略師。請根據使用者提供的資訊，生成一份「簡報設計與提案策略報告」，採用以下結構：

**第一段 — 核心目標與痛點 (Core Objective & Pain Points)**
精準描述客戶本次簡報欲達成之目的（如募資、銷售、報告），以及目前面臨的痛點（如邏輯發散、視覺無力）。

**第二段 — 設計與技術解決方案 (Design & Tech Solution)**
說明建議的設計路徑。若適合，請推薦導入「Open Design 系統化設計」與「HTML PPT / 橫向滑動簡報技術」，強調如何透過系統化提升品牌專業度與後續維護效率。

**第三段 — 商業效益 (Business Value / ROI)**
量化或具象化高質感提案帶來的效益（如：提升投資人停留時間、增強品牌信任感、模組化減少未來 50% 製作時間）。

**第四段 — 專案範圍與風險 (Scope & Risks)**
主動定義修改次數上限，提醒內容大幅變更將影響設計時程。`,
        customerChat: `你是一位講求邏輯與說服力的簡報設計師。
關鍵行為準則：
1. 堅持「先確認大綱與邏輯 (Storyboard)，再進入視覺設計」。
2. 推薦客戶採用「系統化設計 (Design System)」，避免一次性的拋棄式設計。
3. 若客戶追求現代感，主動介紹「HTML 網頁簡報」或「橫向滑動 (Swipe) 互動簡報」的優勢。`,
        quotationSuggestion: `請提供簡報設計報價建議：

**基礎方案 (Essential)**：現有文字稿美化排版（約 10-15 頁）、靜態 PDF 交付。
**標準方案 (Standard)**：Pitch Deck 內容梳理 + 全新視覺定調 + 基礎動畫設計。
**尊榮方案 (Pro / Tech)**：導入 Open Design 設計系統、製作高互動 HTML 網頁簡報、包含動態轉場與開發交付。`
    },
    reportTemplate: {
        structure: `# 簡報設計與提案策略報告\n\n## 1. 簡報目標與受眾分析\n\n## 2. 內容大綱與資訊架構 (Storyboard)\n\n## 3. 視覺風格與設計系統 (Design System)\n- 品牌色彩與字體：\n- 視覺定調：\n\n## 4. 技術與互動提案 (如適用)\n- 格式建議 (PDF / PPT / HTML 網頁簡報)：\n- 互動效果規劃：\n\n## 5. 專案交付與時程`,
        terminology: {
            'Pitch Deck': '商業計畫/募資簡報 (用以向投資人或合作夥伴說服的精煉簡報)',
            'Design System': '設計系統 (統一的字體、色彩、版式規範，確保品牌一致性)',
            'HTML PPT': '網頁式簡報 (使用網頁技術製作的簡報，具備極高的互動性與跨裝置支援)'
        },
        analysisDimensions: ['邏輯說服力 (Persuasion)', '視覺一致性 (Consistency)', '互動體驗 (Interactivity)', '後續維護性 (Maintainability)']
    },
    contractHighlights: {
        mustHaveClauses: ['文字內容凍結點（確認大綱與文字稿後，若大幅修改內容需另計費用）', '設計階段確認制（提供 2-3 頁主視覺定調，確認風格後才展開全份製作）', '修改次數限制（包含 X 次整體微調，超過次數將以時薪計費）'],
        industrySpecificClauses: ['特殊格式免責聲明（若採用 HTML PPT 或特殊互動格式，需明確定義相容的瀏覽器或播放設備環境）', '版權與字型授權（說明所使用之素材、圖片與字型授權歸屬，確保無侵權疑慮）'],
        acceptanceCriteria: ['交付指定格式之最終簡報檔案', '若含設計系統，則交付完整 UI/元件規範文件'],
        paymentMilestones: [
            { stage: '簽約與企劃', percentage: 30, trigger: '合約簽署，確認大綱與文字內容' },
            { stage: '主視覺定調', percentage: 30, trigger: '確認 2-3 頁之主視覺與風格 (Key Vision)' },
            { stage: '全份設計初稿', percentage: 20, trigger: '完成全份簡報設計並交付初稿' },
            { stage: '定稿與交付', percentage: 20, trigger: '完成修改並交付最終原始檔或網頁連結' }
        ]
    },
    quotationConfig: {
        categoryName: '簡報與提案設計',
        unit: '專案',
        terminology: { '客戶': '委託方', '我們': '設計團隊' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "您好，我是專注於商業說服與提案設計的設計師。一份好的簡報不只是排版漂亮，更是幫助您達成商業目的的利器。請問這次提案最希望聽眾記住的三個重點是什麼？",
        discoveryQuestions: ['這份簡報主要會在哪種場合播放？（線上會議、大型演講廳、或是一對一平板展示？）', '是否有考慮過使用現代化的 HTML 網頁簡報？能提供更順暢的動態與更好的展示體驗。', '目前文字內容的完整度大約是多少？是否需要我們協助梳理邏輯？'],
        objectionHandling: {
            '為什麼只是排版也要這麼貴？': '我們提供的不是單純的「把字排整齊」，而是「資訊層級重組」與「說服邏輯強化」。如果導入設計系統，還能大幅降低您未來自行修改或新增頁面的時間成本。',
            '我可以用我原本的舊簡報直接改嗎？': '當然可以，但若舊簡報缺乏系統性的設計規範，每次修改都會很吃力。我們會建議建立一套全新的 Design System，一勞永逸。'
        },
        closing: "了解您的需求了！我們將先為您梳理大綱邏輯 (Storyboard)，確認核心訊息無誤後，再為您提供 2-3 頁的視覺定調風格稿。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '商業邏輯梳理與大綱確立 (Storyboard)', type: 'internal', duration: '3 天', assignee: 'Planner' },
            { name: '主視覺與風格定調 (Key Vision)', type: 'internal', duration: '3 天', assignee: 'Designer' },
            { name: '客戶確認主視覺', type: 'external', duration: '2 天', assignee: 'Client' },
            { name: '全份簡報視覺化設計', type: 'internal', duration: '1-2 週', assignee: 'Designer' },
            { name: '動態轉場與互動效果設置 (含 HTML PPT 開發)', type: 'internal', duration: '1 週', assignee: 'Designer/Developer' },
            { name: '最終微調與定稿', type: 'external', duration: '3 天', assignee: 'Client' },
            { name: '交付原始檔與設計系統 (Design System) 規範', type: 'internal', duration: '1 天', assignee: 'Designer' }
        ],
        milestones: [
            { label: '內容大綱與邏輯確認', order: 1 },
            { label: '主視覺定調確認', order: 2 },
            { label: '全份初稿完成', order: 3 },
            { label: '最終定稿與檔案交付', order: 4 }
        ],
        workflow: {
            diagram: "graph TD\\n  A[商業邏輯梳理] --> B[主視覺設計]\\n  B --> C[客戶風格確認]\\n  C --> D[全份排版設計]\\n  D --> E[動態/HTML 開發(可選)]\\n  E --> F[完稿交付]",
            description: "採用「先邏輯、後視覺」的設計策略，並可依需求導入前端技術製作 HTML 互動簡報。"
        }
    },
    defaultItems: [
        { description: '簡報邏輯梳理與內容企劃 (Storyboard)', quantity: 1, unitPrice: 15000 },
        { description: '主視覺與版型設計 (含 3 頁風格提案)', quantity: 1, unitPrice: 12000 },
        { description: '全份簡報視覺化排版 (15-20頁)', quantity: 1, unitPrice: 25000 },
        { description: '專屬設計系統建立 (Design System Guideline)', quantity: 1, unitPrice: 18000 },
        { description: '互動式 HTML 網頁簡報開發 (Web PPT)', quantity: 1, unitPrice: 35000 },
    ],
    projectTypes: [
        { id: 'pitch_deck', label: '🚀 募資與商業提案 (Pitch Deck)', description: '具備高度說服力與商業邏輯的募資簡報' },
        { id: 'corporate_deck', label: '🏢 企業介紹簡報 (Corporate Deck)', description: '展現品牌專業度與規模的標準簡報' },
        { id: 'html_ppt', label: '🌐 互動式網頁簡報 (HTML PPT)', description: '使用前端技術打造的高流暢度現代化簡報' },
        { id: 'template_design', label: '📚 品牌簡報模板與設計系統', description: '建立可重複使用的企業專屬簡報規範' },
    ],
};
