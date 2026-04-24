import { BusinessModule } from '@/types/industries';

export const MODULE_HOME_ORGANIZER: BusinessModule = {
    id: 'home_organizer',
    name: '專業整理收納師',
    description: '居家空間規劃、物品捨棄建議、動線優化、到府收納施作',
    categoryId: 'pro_service',
    tagline: '不只是整理，更是透過空間重整生活',
    targetUser: '整理師、收納顧問、軟裝佈置師',
    painPoints: ['客戶對「整理」與「清潔」有誤解', '物品過多導致結案困難', '施作時間難以精確預估'],
    corePrompt: `Role: 專業空間整理顧問與生活規劃師
    Profile: 你專精於「人、物、空間」的平衡。你的專業涵蓋空間動線規劃、物品分類邏輯、收納用品建議與居家習慣引導。
    Focus: 空間易用性、生活流程、物品減量與美感維護。
    Task: 請提供專業的整理收納提案，包含空間診斷、施作計畫與後續維修建議。`,
    formConfig: {
        descriptionPlaceholder: "請描述需整理的空間類型 (如: 換季衣櫥、全家搬遷) 與目前的困擾...",
        styleLabel: "理需求與空間現況 (Organizational Needs)",
        stylePlaceholder: "例如：\n• 空間特色：兒童房兼玩具間、小坪數套房空間極大化\n• 需求目標：建立長效收納系統、協助捨棄多餘物品、搬家後的拆箱歸位",
        timelineLabel: "預計施作日期",
        timelinePlaceholder: "例如：下週三或週六白天",
        deliverablesLabel: "服務內容與產出",
        deliverablesPlaceholder: "例如：空間診斷報告、收納用品清單、到府施作與習慣引導...",
        customFields: [
            { name: "spaceType", label: "主要整理空間", placeholder: "請選擇空間類別 (可複選)...", type: "multi-select", options: ['全屋收納規劃', '客餐廳 / 公共區域', '衣櫥 / 臥室空間', '搬家前減量 / 搬家後歸位', '商業空間 / 辦公室', '陽台 / 儲藏室'] },
            { name: "sizeRange", label: "施作空間坪數", placeholder: "請選擇範圍...", type: "select", options: ['局部 (3坪以下)', '小坪數 (10坪以內)', '中大型 (10-30坪)', '豪宅 / 多層 (30坪以上)'] },
            { name: "clutterLevel", label: "物品雜亂程度評估", placeholder: "請選擇程度...", type: "select", options: ['一般整齊 (需建立邏輯)', '中度雜亂 (物品已溢出)', '重度囤積 (需較長捨棄時間)', '搬家空屋 (純定位)'] },
            { name: "organizationMethod", label: "整理參與方式", placeholder: "請選擇...", type: "select", options: ['職人全權施作', '與客戶共同整理 (含引導)', '遠端諮詢 (僅提供規劃)'] },
            { name: "requiredStaff", label: "預計出勤人數", placeholder: "請選擇...", type: "select", options: ['1 人 (單兵作業)', '2 人 (標準雙人組)', '3 人 (大型專案組)', '未定'] }
        ]
    },
    aiPrompts: {
        reportGeneration: `你是一位具備生活美學與空間邏輯的整理師。請根據客戶提供的空間照片與痛點，產出一份空間診斷與整理計畫書。內容需包含：物品爆滿的根本原因 (Root Cause)、整理先後順序建議 (如：先衣物後雜物)、預期採用的收納系統，以及維持整潔的日常習慣建議。`,
        customerChat: `你是溫暖但堅定的整理顧問。面對客戶「這個還有紀念價值不能丟」或「雖然沒穿過但以後可能會穿」的囤積心理，需運用斷捨離的心理學技巧，引導客戶專注於「現在的自己」，而非過去或未來，溫和地協助客戶做出取捨。`,
        quotationSuggestion: `請提供整理收納報價建議。必須明確區分「線上診斷費」、「到府實作費(通常以人/小時計價)」、「收納用品代購費(實報實銷)」與「大型廢棄物清運費(另計)」。提醒客戶，若雜亂程度遠超預期，有權於現場重新評估所需工時。`
    },
    reportTemplate: {
        structure: `# 居家空間診斷與整理提案\n\n## 1. 空間現況與生活痛點分析\n- 痛點描述：(例如：找不到東西、動線受阻)\n- 空間能量：\n\n## 2. 核心問題診斷 (Root Cause)\n- 購物習慣/收納邏輯/動線設計\n\n## 3. 空間重整與動線規劃方案\n\n## 4. 預期使用之收納系統與推薦用品清單\n\n## 5. 整理時程規劃與所需人力評估`,
        terminology: {
            '斷捨離': '不只是丟東西，而是斬斷對物品的執念，捨棄不需要的雜物，脫離對物品的迷戀',
            '動線收納': '根據居住者的生活習慣(如：回家後脫外套、放鑰匙的路線)來配置收納位置，而非單純把東西藏起來',
            '直立式收納': '將衣物或物品摺疊後直立擺放，一目了然且拿取時不會弄亂其他物品的技巧'
        },
        analysisDimensions: ['物品數量與空間比例', '生活動線順暢度', '使用者分類邏輯', '空間美感與氛圍']
    },
    contractHighlights: {
        mustHaveClauses: ['貴重物品免責與保管條款（施作前客戶需自行妥善保管現金、珠寶等貴重物品，乙方不負遺失賠償責任）', '物品捨棄確認權（所有物品的丟棄與轉贈，必須經由客戶本人明確同意，乙方不擅自丟棄任何物品）', '超時收費與工時評估（報價工時為預估值，若因物品過多或客戶猶豫時間過長導致超時，需依合約約定之小時計費標準加收費用）'],
        industrySpecificClauses: ['清潔範圍界定（整理師專注於「物品分類與收納規劃」，不包含重度污垢刷洗或病媒蟲害除錯等專業清潔服務）', '影像授權條款（若需拍攝 Before/After 空間對比照作為行銷案例，需取得客戶同意，並承諾隱藏可識別客戶身分之私人物品）'],
        acceptanceCriteria: ['依約定工時完成指定區域之物品分類與定位', '交付空間維持與收納邏輯說明'],
        paymentMilestones: [
            { stage: '預約訂金', percentage: 30, trigger: '確認預約日期並完成線上診斷後支付' },
            { stage: '施作尾款', percentage: 70, trigger: '到府實作完成，當日驗收後支付' },
            { stage: '代購款項', percentage: 100, trigger: '收納用品代購前全額預收或當日實報實銷' }
        ]
    },
    quotationConfig: {
        categoryName: '空間整理與收納服務',
        unit: '小時/人',
        terminology: { '客戶': '委託人', '我們': '整理顧問團隊' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "您好，我是您的整理師。很多時候，空間的混亂反映的是我們內心的疲憊。在我們開始動手之前，我想先請您閉上眼睛想像一下，當這個空間整理好之後，您最想在這個空間裡做什麼？（例如：悠閒地喝杯咖啡、邀請朋友來家裡玩？）",
        discoveryQuestions: ['目前家裡最讓您感到煩躁或壓力最大的角落是哪裡？', '您覺得造成目前物品堆積的最大原因是什麼？（例如：沒時間整理、不知道怎麼分類、捨不得丟？）', '在這次整理中，是否有其他家人(如伴侶、小孩)的物品也會牽涉其中？他們對於整理的意願高嗎？'],
        objectionHandling: {
            '整理房間一小時要收一千多？我找打掃阿姨只要四百塊耶': '打掃阿姨能幫您把表面「清乾淨」，但過幾天東西又會亂。整理師的價值在於幫您「建立系統」，我們分析您的生活動線，幫每個物品找到專屬的「家」。這是一次徹底解決雜亂根源的空間微整型，而不是治標不治本的勞力活。',
            '我真的很捨不得丟東西，不丟也可以整理嗎？': '當然可以。我們的首要任務是「分類」而不是「丟棄」。如果空間足夠，我們可以透過高效率的收納系統把物品收好。但如果物品數量已經遠大於空間容量，我會陪著您一起審視這些物品與您現在生活的關係，幫您做出最沒有遺憾的選擇。'
        },
        closing: "我完全理解您的困擾，這也是我們最常處理的狀況。我們第一步先不急著丟東西，我會先發送一份『空間診斷表』給您，請您拍幾張現況照片讓我評估所需的工時。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '線上諮詢與空間照片診斷', type: 'external', duration: '半天', assignee: 'Lead Organizer' },
            { name: '收納企劃與用品代購清單評估', type: 'internal', duration: '1-2 天', assignee: 'Organizer' },
            { name: '現場第一階段：下架與分類 (Sort)', type: 'internal', duration: '依坪數', assignee: 'Organizing Team' },
            { name: '現場第二階段：引導取捨 (Declutter)', type: 'external', duration: '依物品量', assignee: 'Lead Organizer & Client' },
            { name: '現場第三階段：定位與收納 (Organize)', type: 'internal', duration: '依坪數', assignee: 'Organizing Team' },
            { name: '廢棄物清運或二手轉贈處理', type: 'external', duration: '1 天', assignee: 'Partner Vendor' },
            { name: '結案驗收與維持習慣教學', type: 'external', duration: '1 小時', assignee: 'Lead Organizer' }
        ],
        milestones: [
            { label: '線上診斷與時程確認', order: 1 },
            { label: '到府施作與物品分類完成', order: 2 },
            { label: '物品定位與收納系統建立', order: 3 },
            { label: '廢棄物清運與完工驗收', order: 4 }
        ],
        workflow: {
            diagram: "graph TD\\n  A[線上診斷與報價] --> B[到府下架清空]\\n  B --> C[集中分類與引導取捨]\\n  C --> D[收納系統配置與定位]\\n  D --> E[完工驗收]\\n  E --> F[維持教學與後續追蹤]",
            description: "嚴格遵守「清空 -> 分類 -> 取捨 -> 定位」的整理標準流程，確保不漏掉隱藏的雜物。"
        }
    },
    defaultItems: [
        { description: '課前/案前線上診斷與空間規劃 (Pre-consultation)', quantity: 1, unitPrice: 1500 },
        { description: '現場整理施作服務 (按時數/每人) (On-site Organizing)', quantity: 6, unitPrice: 800 },
        { description: '收納用品代購與配置 (Storage Solutions)', quantity: 1, unitPrice: 3000 },
        { description: '廢棄物協助清運/轉贈媒合 (Waste Disposal)', quantity: 1, unitPrice: 2000 },
    ],
    projectTypes: [
        { id: 'wardrobe_master', label: '👗 衣櫥管理 (Wardrobe)', description: '換季、衣物減量、收納建立' },
        { id: 'relocation_service', label: '📦 搬家統籌 (Moving)', description: '免動手打包與定位' },
        { id: 'life_coaching', label: '🧠 生活秩序重整 (Life Order)', description: '整理心靈與物理空間' },
    ],
};
