import { BusinessModule } from '@/types/industries';

export const MODULE_CORPORATE_TRAINING: BusinessModule = {
    id: 'corporate_training',
    name: '企業培訓與教練',
    description: '內訓課程、工作坊、一對一教練、線上課程製作',
    categoryId: 'consulting',
    tagline: '出席率、錄影授權、成效評估，課前說清楚',
    targetUser: '企業培訓師、教練、講師',
    painPoints: ['出席率不足', '課程被錄影後流傳', '成效評估爭議'],
    corePrompt: `Role: 企業培訓師與高階教練 (Corporate Trainer)
    Profile: 你專精於領導力發展與技能培訓。你的專業涵蓋課程設計、引導技巧、教練方法學與學習評估。
    Focus: 學習成效、學員投入度、實務應用與 ROI 衡量。
    Task: 請提供詳細的培訓提案，包含學習目標、課程大綱與評估方法。`,
    formConfig: {
        descriptionPlaceholder: "請描述培訓對象、人數與預期達成的學習成效 (Audience & Goals)...",
        styleLabel: "教學風格與互動比例 (Training Style)",
        stylePlaceholder: "例如：\n• 教學風格：高度互動工作坊 (Workshop)、系統化大堂講授、線上混合式教學\n• 互動比例：希望 50% 實作演練、希望著重於案例討論而非理論\n• 課程氣氛：活潑帶動、專業嚴謹、實戰導向",
        timelineLabel: "培訓執行日期 (Training Dates)",
        timelinePlaceholder: "例如：11 月中擇兩日辦理、分三梯次",
        deliverablesLabel: "培訓課程大綱與教材 (Syllabus & Materials)",
        deliverablesPlaceholder: "例如：課程教材、課後行動計畫、滿意度調查報告...",
        customFields: [
            { name: "traineeCountRange", label: "預計培訓人數", placeholder: "請選擇人數區間...", type: "select", options: ['15人以下 (小班制工作坊)', '15 - 30 人 (標準課堂)', '30 - 100 人 (大型講座)', '100 人以上 (多人演講)'] },
            { name: "trainingMethod", label: "教學授課模式", placeholder: "請選擇授課方式...", type: "select", options: ['線下實體培訓', '線上直播教學 (Live)', '混合式學習 (Hybrid)', '錄播課程製作'] },
            { name: "targetAudience", label: "主要培訓對象", placeholder: "請選擇對象 (可複選)...", type: "multi-select", options: ['高階主管 (Executives)', '中階主管 (Mid-mgt)', '基層員工 (Staff)', '全體同仁', '特定專業職位'] },
            { name: "trainingTopic", label: "培訓主題 (Topic)", placeholder: "例如：溝通技巧, 專案管理, 領導力", type: "text" },
            { name: "evaluationMethod", label: "學習成效評估", placeholder: "請選擇評估方式 (可複選)...", type: "multi-select", options: ['課後滿意度問卷', '課前 / 課後測驗', '行動計畫 (Action Plan)', '課後輔導報告', 'KPI 績效對接'] },
            { name: "recordingRights", label: "錄影授權與規範", placeholder: "請選擇授權模式...", type: "select", options: ['全程不可錄影', '僅限企業內部回放授權 (一年)', '全權錄影授權買斷', '不需錄影服務'] },
            { name: "duration", label: "預計時數/天數 (Duration)", placeholder: "例如：2天 (14小時)", type: "text" }
        ]
    },
    aiPrompts: {
        reportGeneration: `你是一位資深企業內訓規劃師。請根據客戶描述的培訓對象與痛點，產出一份培訓課程大綱提案。內容需包含：學習目標設定 (Learning Objectives)、模組化課程課綱、預期採用的互動教學法 (如：個案研討、角色扮演)，以及課後的落地行動計畫 (Action Plan)。`,
        customerChat: `你是專業的企業講師。面對 HR 提出「能不能把兩天的課壓縮成半天講完」時，需以成人學習理論 (Adult Learning Theory) 為基礎，委婉說明過度壓縮將導致學員「只聽到概念，無法產生行為改變」，並建議捨棄次要內容以確保核心技能的演練時間。`,
        quotationSuggestion: `請提供企業內訓報價建議。必須列出「講師鐘點費(或半日/全日計價)」、「客製化教材設計費(如需大幅度調整內容)」，並註明交通費、住宿費(若跨縣市)及講義印刷費是否包含其中或另行實報實銷。`
    },
    reportTemplate: {
        structure: `# 企業培訓與工作坊提案\n\n## 1. 培訓背景與學習目標 (Learning Objectives)\n\n## 2. 課程設計理念與教學方法 (Methodology)\n- 互動比例：理論講解 X% / 實作演練 Y%\n- 教學手法：小組討論、個案研討、角色扮演...\n\n## 3. 模組化課程大綱 (Syllabus)\n- 第一模組 (X小時)：\n- 第二模組 (X小時)：\n\n## 4. 講師資歷簡介 (Trainer Profile)\n\n## 5. 課後成效評估與落地計畫 (Evaluation)`,
        terminology: {
            'Action Plan': '課後行動計畫 (要求學員在課後寫下具體要改變的行為或要執行的任務，是檢驗培訓成效的重要指標)',
            'Kirkpatrick Model': '柯氏四級評估模型 (評估培訓成效的國際標準，從滿意度、學習吸收、行為改變到最終的商業結果)',
            '破冰 (Ice-breaker)': '課前或課程初期的暖身活動，目的是降低學員防備心，快速建立安全感與互動氛圍'
        },
        analysisDimensions: ['課程內容實戰性', '學員參與投入度', '教學節奏掌控力', '課後行為轉變率']
    },
    contractHighlights: {
        mustHaveClauses: ['錄影與智慧財產權條款（明訂課程教材版權歸講師所有，客戶不得未經授權擅自錄音、錄影，或將講義作為企業內部常態性教材翻印傳播）', '延期與取消政策（如因客戶因素於課前 X 日內取消或延期，需支付一定比例之違約金或行政費用）', '人數上限控管（為維護教學品質，約定課堂人數上限，若現場超出人數，講師有權拒絕授課或加收費用）'],
        industrySpecificClauses: ['課前問卷與前置作業（甲方需配合於課前 X 週發放並回收學員課前問卷，以利講師調整授課方向）', '設備與場地責任（甲方需負責提供合適之培訓場地及約定之硬體設備(如投影機、麥克風、白板)）'],
        acceptanceCriteria: ['講師依約定時間出席並完成授課', '交付約定份數或電子檔之課程講義'],
        paymentMilestones: [
            { stage: '課程訂金', percentage: 50, trigger: '合約簽署，保留講師檔期並啟動客製化教材設計' },
            { stage: '結案尾款', percentage: 50, trigger: '課程執行完畢後 X 日內支付' }
        ]
    },
    quotationConfig: {
        categoryName: '企業培訓與課程服務',
        unit: '梯次/時',
        terminology: { '客戶': '培訓單位(HR)', '我們': '講師/顧問公司' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "您好，我是企業培訓規劃師。一堂好的培訓課，不應該只是讓學員聽完覺得『好熱血』，而是回到崗位後能『真的做出來』。請問這次培訓結束後，您希望看到員工產生什麼具體的『行為改變』？",
        discoveryQuestions: ['過去公司有舉辦過類似主題的培訓嗎？當時學員的反饋如何？（找出過去失敗的原因）', '這次參與培訓的學員，他們在日常工作中遇到最大的困難是什麼？（這能讓講師的舉例更接地氣）', '課後的主管是否願意配合參與『行動計畫』的驗收？（主管的支持是培訓成效落地的關鍵）'],
        objectionHandling: {
            '講師費一天要好幾萬，超出我們 HR 預算了': '培訓的成本不只有講師費，更昂貴的是把您公司 30 位優秀主管集合在教室一整天的「時間成本」。如果因為預算考量請了無法帶來真實改變的講師，那這一整天的人事成本才是真正的浪費。我們帶來的是能立刻應用在工作上的實戰工具。',
            '可以錄影起來，讓之後進來的新人看嗎？': '如果是純理論知識，錄影確實是好方法。但這堂課有 50% 是現場互動與演練，看錄影檔完全無法體會現場的學習氣氛，甚至可能引發反效果。且基於智慧財產權保護，我們的標準合約不開放全程錄影。若貴公司有製作數位化教材的需求，我們可以另外提供線上課程錄製的報價。'
        },
        closing: "了解您的培訓目標了！我會針對您的需求，規劃一份包含『課前問卷』、『互動式課綱』與『課後行動計畫』的完整培訓提案給您參考。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '需求對焦與課程大綱初稿', type: 'internal', duration: '3 天', assignee: 'Trainer / PM' },
            { name: '課前問卷設計與發放', type: 'external', duration: '1-2 週', assignee: 'HR / Trainer' },
            { name: '客製化講義與教案編撰', type: 'internal', duration: '2 週', assignee: 'Trainer' },
            { name: '教材最終確認與講義付印', type: 'internal', duration: '3 天', assignee: 'PM' },
            { name: '課程現場執行 (授課與帶領)', type: 'internal', duration: '1-2 天', assignee: 'Trainer' },
            { name: '滿意度調查分析與結案報告', type: 'internal', duration: '1 週', assignee: 'PM' },
            { name: '課後一個月行動計畫追蹤會議', type: 'external', duration: '半天', assignee: 'Trainer & Client' }
        ],
        milestones: [
            { label: '課綱確認與檔期保留', order: 1 },
            { label: '課前問卷回收與教材定案', order: 2 },
            { label: '現場培訓順利完成', order: 3 },
            { label: '結案報告與課後成效追蹤', order: 4 }
        ],
        workflow: {
            diagram: "graph TD\\n  A[痛點訪談與課綱設計] --> B[課前問卷與期待對焦]\\n  B --> C[教案客製化與備課]\\n  C --> D[現場實戰授課 (演練大於理論)]\\n  D --> E[滿意度調查]\\n  E --> F[課後行動計畫落地追蹤]",
            description: "強調「訓戰合一」，將培訓拉長為一個包含課前預熱、課中實戰與課後追蹤的完整學習旅程。"
        }
    },
    defaultItems: [
        { description: '課程設計與教材製作 (Curriculum Design)', quantity: 1, unitPrice: 20000 },
        { description: '講師鐘點費（8 小時）(Training Delivery)', quantity: 1, unitPrice: 32000 },
        { description: '工作坊執行費用 (Workshop Facilitation)', quantity: 1, unitPrice: 25000 },
        { description: '後續輔導與追蹤 (Follow-up Coaching)', quantity: 1, unitPrice: 15000 },
    ],
    projectTypes: [
        { id: 'leadership_training', label: '👔 領導力培訓 (Leadership)', description: '主管培訓、領導力發展' },
        { id: 'skill_training', label: '🎯 技能培訓 (Skills)', description: '專業技能、軟實力訓練' },
        { id: 'executive_coaching', label: '🤝 高階教練 (Coaching)', description: '一對一教練、顧問諮詢' },
    ],
};
