import { BusinessModule } from '@/types/industries';

export const MODULE_ONLINE_COURSE: BusinessModule = {
    id: 'online_course_prod',
    name: '線上課程製作統籌',
    description: '課程企劃、影片拍攝、後期剪輯、平台架設、行銷分潤',
    categoryId: 'pro_service',
    tagline: '將知識轉化為可獲利的數位資產',
    targetUser: '內容創作者、企業講師、線上教育機構',
    painPoints: ['不知道如何將知識結構化', '拍攝成本控管困難', '平台選擇與串接複雜'],
    corePrompt: `Role: 資深線上課程製作人與內容策略師
    Profile: 你精通線上課程全案開發流程。你的專業涵蓋課程架構設計 (Syllabus)、知識點萃取、教學腳本、錄影導播與數位行銷。
    Focus: 課程含金量、學習體驗、製作效率與市場競爭力。
    Task: 請提供專業的線上課程製作提案，包含單元規劃、製作成本拆解與上架策略。
    Reality Check: 主動提示客戶潛在風險並提出替代方案，確保每項投資都有清晰的 ROI 依據。
    Proposal Mindset: 所有報告與建議都應具備說服力——痛點共鳴、解決方案、ROI 分析、風險預警四段式結構。`,
    formConfig: {
        descriptionPlaceholder: "請詳細描述課程主題、預期解題的核心價值與目標受眾...",
        styleLabel: "教學形式與課程規格 (Course Specs)",
        stylePlaceholder: "例如：\n• 教學形式：螢幕錄製 + 出鏡說明、高度互動 Live 課、純動畫教學\n• 預計規模：總計 24 個單元，約 300 分鐘\n• 交付平台：Hahow, PressPlay, 自建 WordPress 學院",
        timelineLabel: "預計上架日期",
        timelinePlaceholder: "例如：期望在三個月內完成錄製並啟動募資",
        deliverablesLabel: "產出物清單",
        deliverablesPlaceholder: "例如：課程腳本、剪輯後影片、隨堂講義、練習檔案...",
        customFields: [
            { name: "courseFormat", label: "課程呈現形式", placeholder: "請選擇形式...", type: "select", options: ['預錄影片課程 (VOD)', '線上直播課 (Live)', '混合式學習 (Blended)', '電子書 / 文章訂閱'] },
            { name: "totalMinutes", label: "預計總時長 (分鐘)", placeholder: "例如：180 分鐘", type: "text" },
            { name: "chapterCount", label: "預計單元數量", placeholder: "例如：15 個單元", type: "text" },
            { name: "deliverables", label: "核心交付項目", placeholder: "請選擇項目 (可複選)...", type: "multi-select", options: ['教學腳本撰寫', '錄影現場導播', '後期剪輯與字幕', '隨堂講義與素材', '平台代上架服務'] },
            { name: "marketingSupport", label: "是否需行銷代操", placeholder: "請選擇需求狀態...", type: "select", options: ['需要 (募資策略+廣告代操)', '僅需募資影片拍攝', '已有行銷管道，不需要', '未定'] }
        ]
    },
    aiPrompts: {
        reportGeneration: `你是一位經驗豐富的線上課程製作人。請根據老師(創作者)的專業領域與目標受眾，產出一份線上課程企劃提案。內容需包含：課程市場定位 (Market Positioning)、解決的核心痛點、課程亮點與賣點 (USPs)、建議的課程模組架構 (Syllabus)，以及製作與募資時程表。

升級準則：報告採用四段式提案結構（痛點共鳴→解決方案→ROI 分析→風險預警），溝通時主動挑戰不合理需求，報價提供基礎/標準/企業三方案。`,
        customerChat: `你是具備影視製作與數位行銷背景的課程總監。面對老師提出「我想講的內容很多，可以拍成 50 個小時的課嗎」時，需以完課率數據與學習心理學來勸導，建議將課程濃縮至 3-5 小時的精華，或拆分成「初階」與「進階」兩門課，以確保商業效益與學員體驗。`,
        quotationSuggestion: `請提供線上課程製作報價建議。若為「買斷制」，需明列企劃、拍攝、剪輯之各項費用；若為「分潤制」，需於報價中載明雙方分潤比例(如：創作者 60%、製作方 40%)、預付版稅(MG)機制，以及行銷廣告費用的分攤方式。`
    },
    reportTemplate: {
        structure: `# 線上課程企劃與製作提案\n\n## 1. 課程市場定位與目標受眾 (Target Audience)\n- 受眾痛點輪廓：\n- 課程承諾帶來的改變：\n\n## 2. 課程核心賣點 (Unique Selling Propositions)\n\n## 3. 課程架構與單元規劃初稿 (Syllabus)\n- 第一章：(基礎概念)\n- 第二章：(核心心法)\n- 第三章：(實戰演練)\n\n## 4. 製作規格與視覺風格建議\n- 拍攝形式 (如：雙機場景、綠幕合成、螢幕側錄)\n\n## 5. 募資策略與專案時程 (Timeline)`,
        terminology: {
            '募資期 (Crowdfunding)': '課程正式拍攝前，先透過預售來驗證市場需求並籌措製作資金的行銷階段',
            '完課率 (Completion Rate)': '學員購買課程後完整看完的比例。過長或缺乏互動的課程會導致完課率低，影響口碑',
            'MG (Minimum Guarantee)': '保底授權金。製作方預先支付給創作者的一筆費用，之後從銷售分潤中扣除'
        },
        analysisDimensions: ['市場剛性需求度', '講師個人品牌聲量', '知識可結構化程度', '視覺與音質專業度']
    },
    contractHighlights: {
        mustHaveClauses: ['著作權與所有權歸屬（明訂課程內容之著作人格權歸講師，但影片之著作財產權及重製、公開播送權之歸屬及授權年限，以及是否為獨家授權）', '分潤機制與對帳週期（若採合作分潤模式，需明訂營收計算基準(如扣除金流費及平台抽成後之淨利)、分潤比例及每月/每季之對帳結算日）', '講師配合義務（明訂講師需配合提供講義素材、按時程進棚錄影、配合行銷活動宣傳及回覆購課學員提問之義務）'],
        industrySpecificClauses: ['競業禁止條款（合約期間內，講師不得於其他平台開設相同或高度雷同主題之線上課程，以免影響本課程之銷售）', '募資失敗退場機制（若課程募資未達最低目標人數，雙方同意取消開課之退費處理程序及前置製作成本之吸收方式）'],
        acceptanceCriteria: ['完成所有課程單元之高畫質影片剪輯與輸出', '課程成功上架至指定平台並可正常觀看'],
        paymentMilestones: [
            { stage: '企劃與前置訂金', percentage: 30, trigger: '合約簽署，啟動課程腳本梳理與視覺定調' },
            { stage: '拍攝期款', percentage: 40, trigger: '進棚錄影完成，啟動後期剪輯前' },
            { stage: '上架與尾款', percentage: 30, trigger: '全數影片交付並成功上架至平台後' }
        ]
    },
    quotationConfig: {
        categoryName: '線上課程製作',
        unit: '專案/單元',
        terminology: { '客戶': '講師/創作者', '我們': '課程製作方' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "老師您好！線上課程不是把實體演講錄下來而已，而是一場精密的『知識產品化』工程。在我們討論要拍幾支影片之前，我想先請問，上完您這堂課的學生，能夠具體解決他們生活或工作上的哪個大麻煩？",
        discoveryQuestions: ['老師過去有將教學內容整理成簡報或文章的習慣嗎？還是主要依賴現場發揮？（評估知識萃取的難度）', '您覺得目前市場上類似主題的課程，他們最大的缺點或沒講清楚的地方是什麼？（找出課程切入點）', '針對課程的銷售，老師自有的流量(如粉絲專頁、電子報)大約有多少？還是需要我們投入大量廣告資源操盤？'],
        objectionHandling: {
            '為什麼要把課程切成每支 5 到 10 分鐘？我平常講課都是一小時起跳': '線上學習的環境充滿干擾，學員通常是利用通勤或睡前等『碎片化時間』觀看。根據數據顯示，超過 15 分鐘的教學影片，學員的注意力會大幅下降。把課程切碎成『一個單元只講一個核心知識點』，能大幅降低學習阻力，提升完課率與好評。',
            '你們抽成要抽 40% 這麼高？我自己架站賣不就好了？': '如果您自己架站，確實能拿 100% 的利潤。但這 40% 的分潤，買的是我們一整個團隊的專業：從幫您梳理腳本、架設百萬攝影棚錄影、後製動畫字卡、下廣告導流、到處理學員的客服與退費退貨。我們承擔了所有的製作與行銷風險，讓您只要專注在『把課講好』這件事上。'
        },
        closing: "老師的專業含金量非常高！我們接下來會安排一次『知識萃取會議』，幫您把腦中的 Know-how 轉化為一份系統化的『課程大綱 (Syllabus)』。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '市場定位與痛點分析', type: 'internal', duration: '1 週', assignee: 'Course Producer' },
            { name: '知識萃取與大綱(Syllabus)編撰', type: 'external', duration: '2 週', assignee: 'Producer & Expert' },
            { name: '募資影片企劃與拍攝 (Promo)', type: 'internal', duration: '2 週', assignee: 'Video Team' },
            { name: '募資上線與行銷宣傳 (Crowdfunding)', type: 'external', duration: '4-6 週', assignee: 'Marketing Team' },
            { name: '正式課程腳本撰寫與講義製作', type: 'internal', duration: '3-4 週', assignee: 'Expert & Content Editor' },
            { name: '進棚錄製正式課程 (Production)', type: 'internal', duration: '3-5 天', assignee: 'Video Team' },
            { name: '後期剪輯、動畫字卡與順片 (Post)', type: 'internal', duration: '4-6 週', assignee: 'Editor' },
            { name: '課程平台上架、封測與正式開課', type: 'internal', duration: '1 週', assignee: 'PM' }
        ],
        milestones: [
            { label: '課程大綱確認與合約簽署', order: 1 },
            { label: '募資影片上線與達標', order: 2 },
            { label: '正式課程進棚錄影完畢', order: 3 },
            { label: '全數影片交付與正式開課', order: 4 }
        ],
        workflow: {
            diagram: "graph TD\\n  A[知識萃取與課綱設計] --> B[募資準備與宣傳]\\n  B --> C{募資是否達標?}\\n  C -->|是| D[正式課程腳本與錄製]\\n  C -->|否| X[啟動退費機制]\\n  D --> E[後期剪輯與動畫]\\n  E --> F[平台上架與開課]",
            description: "採用「先賣後做(募資)」的標準作業模式，降低製作風險，確保市場需求真實存在。"
        }
    },
    defaultItems: [
        { description: '課程架構優化與教學腳本審閱 (Consultancy)', quantity: 1, unitPrice: 15000 },
        { description: '專業影棚錄影費用 (含燈光音訊) (Filming)', quantity: 2, unitPrice: 12000 },
        { description: '影片後期剪輯與動態效果 (Post-production)', quantity: 10, unitPrice: 3500 },
        { description: '課程平台串接與上架測試 (System Setup)', quantity: 1, unitPrice: 8000 },
    ],
    projectTypes: [
        { id: 'masterclass', label: '🎓 職人專欄課 (Masterclass)', description: '高客單價、高質感大師課' },
        { id: 'quick_guide', label: '⚡ 快速手冊課 (Guide)', description: '短平快、解決小痛點的課程' },
        { id: 'corporate_academy', label: '🏢 企業內訓轉線上 (Corporate)', description: '將內訓制度數位化' },
    ],
};
