import { BusinessModule } from '@/types/industries';

export const MODULE_INTERIOR_DESIGN: BusinessModule = {
    id: 'interior_design',
    name: '室內空間設計與裝修',
    description: '居家裝潢、店面改裝、辦公室設計',
    categoryId: 'space',
    tagline: '工序、材料、追加費用，全部寫進合約',
    targetUser: '室內設計師、裝修工班、設計裝修公司',
    painPoints: ['工期延誤', '材料替換糾紛', '追加工程費無限追加'],
    corePrompt: `Role: 室內設計師與工務經理 (Interior Designer)
    Profile: 你專精於住宅與商業空間設計。你的專業涵蓋空間規劃、材質挑選、施工管理與預算控制。
    Focus: 美學、機能性、工期管理與成本估算。
    Task: 請提供詳細的裝修計畫，包含材質規格、施工階段與務實的時程表。
    Reality Check: 主動提示客戶潛在風險並提出替代方案，確保每項投資都有清晰的 ROI 依據。
    Proposal Mindset: 所有報告與建議都應具備說服力——痛點共鳴、解決方案、ROI 分析、風險預警四段式結構。`,
    formConfig: {
        descriptionPlaceholder: "請描述裝修空間類型、坪數與居住成員需求 (Space & Needs)...",
        timelineLabel: "預期完工日期 (Handover Date)",
        timelinePlaceholder: "例如：春節前搬入、工期預計 90 天",
        stylePlaceholder: "例如：北歐風、現代極簡、工業風、日式無印...",
        deliverablesLabel: "空間規格與施作細項 (Space Specs)",
        deliverablesPlaceholder: "例如：平面配置圖、3D 渲染圖、施工圖、家具建議...",
        customFields: [
            { name: "propertyType", label: "屋況類型 (Property Type)", placeholder: "請選擇屋況...", type: "select", options: ['新成屋裝潢', '老屋翻新工程', '預售屋客變', '商業 / 店面空間', '辦公室設計'] },
            { name: "spaceSizeRange", label: "空間坪數區間", placeholder: "請選擇坪數範圍...", type: "select", options: ['15坪以下 (小坪數)', '15 - 30 坪 (標準)', '30 - 50 坪 (大坪數)', '50 坪以上 (豪宅/大空間)'] },
            { name: "designStyle", label: "偏好設計風格", placeholder: "請選擇風格 (可複選)...", type: "multi-select", options: ['現代極簡', '北歐風 (Nordic)', '工業風 (Industrial)', '日式無印 (MUJI)', '美式鄉村', '奢華古典', '混搭風 (Japandi)'] },
            { name: "projectScope", label: "施作工程範圍", placeholder: "請選擇施作項目 (可複選)...", type: "multi-select", options: ['全室完整裝修', '局部空間改裝', '基礎水電瓦斯更新', '木作看板與隔間', '系統櫃設計與組裝', '家具軟裝挑選與佈置 (Styling)', '空間色彩與牆面漆色建議'] },
            { name: "functionalNeeds", label: "特殊機能需求", placeholder: "如有需求請勾選...", type: "multi-select", options: ['寵物友善空間', '幼童安全友善', '居家辦公室 / 書房', '海量收納規劃', '全自動智能家居', '開放式廚房', '商業美感展示'] },
            { name: "location", label: "物件地點 (Location)", placeholder: "例如：台北市專案", type: "text" }
        ]
    },
    aiPrompts: {
        reportGeneration: `你是一位資深室內設計師。請根據客戶的空間坪數、屋況與生活需求，產出一份室內設計提案。內容需包含：空間動線重塑 (Space Planning)、風格定調 (Concept & Vibe)、建材材質建議，以及預估的工程預算分配比例。

升級準則：報告採用四段式提案結構（痛點共鳴→解決方案→ROI 分析→風險預警），溝通時主動挑戰不合理需求，報價提供基礎/標準/企業三方案。`,
        customerChat: `你是一位細心且具備工程實務經驗的設計總監。面對客戶要求「打掉這面牆」或「預算砍半但材質都要最高級」時，需以建築結構安全為由婉拒不合理要求，並提供高性價比的替代建材方案 (如：用塗料取代天然大石材)。`,
        quotationSuggestion: `請提供室內設計與裝修工程報價建議。必須嚴格區分「設計費(按坪數)」、「工程費(實報實銷或連工帶料)」、「監工費(工程款的%)」。並強烈建議老屋翻新需預留 15-20% 的隱蔽工程(水電管線)預備金。`
    },
    reportTemplate: {
        structure: `# 室內空間設計與裝修提案\n\n## 1. 居住者需求與痛點分析\n\n## 2. 空間配置與動線規劃 (Space Planning)\n- 核心生活區域 (客/餐廳)：\n- 私密與收納空間：\n\n## 3. 視覺風格與材質計畫 (Concept & Material)\n\n## 4. 基礎工程與智能家居建議\n\n## 5. 預算分配建議與施工時程表`,
        terminology: {
            '客變': '預售屋客戶變更 (在建商灌漿前，先要求更改格局、水電配置，以省下未來敲磚重做的費用)',
            '隱蔽工程': '完工後看不見的工程，如水電管線、泥作防水、冷氣冷媒管，是老屋翻新的預算重點',
            '監工費': '設計師代為監督工班進度、品質與協調突發狀況的服務費，通常為總工程款的 5-10%'
        },
        analysisDimensions: ['生活動線流暢度', '收納機能實用性', '採光與通風優化', '建材環保與安全性']
    },
    contractHighlights: {
        mustHaveClauses: ['設計與工程合約分離（建議先簽訂「設計合約」，待施工圖與詳細報價單確認後，再簽訂「工程合約」，避免預算無限膨脹）', '追加減帳條款（施工中若客戶變更設計或遇不可預見之屋況問題，必須簽署「追加減帳確認單」後方可施工與計費）', '驗收標準與保固（明訂各工種的驗收標準，如漆面平整度，以及完工後的結構與五金保固期限，通常為 1 年）'],
        industrySpecificClauses: ['鄰損與管委會責任（施工期間若造成鄰居漏水或損壞公設，責任歸屬與處理流程）', '物料價差條款（若因國際物料大漲導致建材成本嚴重偏離報價，雙方協議補貼價差之機制）'],
        acceptanceCriteria: ['依最終確認之施工圖面與建材規格完成施作', '通過初驗、複驗並完成瑕疵修繕 (Punch List)', '交付完工清潔後之現場與設備保固書'],
        paymentMilestones: [
            { stage: '設計費', percentage: 100, trigger: '分階支付：簽約 30%、平配圖 40%、3D與施工圖 30%' },
            { stage: '工程開工款', percentage: 30, trigger: '工程合約簽署，進場拆除與保護工程前' },
            { stage: '泥作/水電期款', percentage: 30, trigger: '基礎隱蔽工程完成，準備封板前' },
            { stage: '木作/系統櫃期款', percentage: 30, trigger: '木作與櫃體安裝完成，準備油漆前' },
            { stage: '完工尾款', percentage: 10, trigger: '清潔完畢，複驗通過並點交鑰匙時' }
        ]
    },
    quotationConfig: {
        categoryName: '空間設計與裝修工程',
        unit: '坪/式',
        terminology: { '客戶': '業主', '我們': '設計/裝修方' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "您好，我是室內設計師。家，是生活的容器。在我們討論要用什麼風格之前，我想先了解您與家人週末在家通常都在做什麼？喜歡在客廳看電影，還是在餐廳大桌子上喝咖啡看書？",
        discoveryQuestions: ['這間房子的預計居住年限是多久？未來 5 年內成員會有變化嗎？（例如：準備生小孩、長輩同住）', '您目前的收納痛點是什麼？有哪些大型物品（如：露營設備、公路車、行李箱）需要被妥善收納？', '如果是老屋翻新，我們強烈建議將預算優先投入在『水電管線更新』與『防水工程』。您的預算分配觀念也是如此嗎？'],
        objectionHandling: {
            '設計費一坪要收 5000 太貴了，我找統包不用設計費啊': '統包不收設計費，是因為他們不負責「解決問題」與「美學規劃」，只負責「按圖施工」。設計費包含了我們為您解決動線卡頓、精算每一個櫃體尺寸、挑選無毒建材，以及繪製幾十張精確施工圖的專業。這是確保工程不爛尾、不追加預算的最核心保障。',
            '為什麼報價單不能一開始就給總價，要等圖畫完才報？': '負責任的報價必須基於「明確的規格」。用大理石還是人造石？用進口五金還是國產五金？價格會差到數倍。我們堅持先完成設計圖與材質確認，再給出精確的工程報價單，這是保護您不會在施工到一半時，被各種理由「追加預算」。'
        },
        closing: "很期待為您打造夢想家！我們的第一步，會先到現場進行『丈量與屋況體檢』，一週後會為您提交 2 款不同動線的『平面配置圖 (Floor Plan)』供您選擇。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '現場丈量與屋況評估', type: 'internal', duration: '半天', assignee: 'Designer' },
            { name: '平面配置提案與討論 (Layout)', type: 'external', duration: '1-2 週', assignee: 'Designer & Client' },
            { name: '3D 渲染與建材挑選', type: 'internal', duration: '2-3 週', assignee: 'Designer' },
            { name: '施工圖繪製與精確報價', type: 'internal', duration: '2 週', assignee: 'Draftsman' },
            { name: '保護工程、拆除與基礎水電 (泥作)', type: 'internal', duration: '3-4 週', assignee: 'Construction Team' },
            { name: '木作、系統櫃與油漆工程', type: 'internal', duration: '4-6 週', assignee: 'Construction Team' },
            { name: '設備安裝與軟裝進場', type: 'internal', duration: '1 週', assignee: 'Construction Team' },
            { name: '完工清潔與驗收交屋', type: 'external', duration: '1 週', assignee: 'All' }
        ],
        milestones: [
            { label: '設計合約簽署與平配確認', order: 1 },
            { label: '工程合約簽署與開工', order: 2 },
            { label: '隱蔽工程(水電泥作)完工', order: 3 },
            { label: '完工點交與保固啟動', order: 4 }
        ],
        workflow: {
            diagram: "graph TD\\n  A[需求丈量] --> B[平面圖與設計提案]\\n  B --> C[3D圖與精確報價]\\n  C --> D[簽署工程合約與開工]\\n  D --> E[基礎工程與裝潢施工]\\n  E --> F[完工驗收與交屋]",
            description: "嚴格執行「圖面確認後才動工」的原則，減少施工中的變更設計與追加帳糾紛。"
        }
    },
    defaultItems: [
        { description: '空間風格企劃與軟裝提案 (Styling Proposal)', quantity: 1, unitPrice: 15000 },
        { description: '拆除與清運工程 (Demolition & Disposal)', quantity: 1, unitPrice: 25000 },
        { description: '水電配置工程 (Plumbing & Electrical)', quantity: 1, unitPrice: 45000 },
        { description: '木作天花板與隔間 (Carpentry)', quantity: 1, unitPrice: 55000 },
        { description: '系統櫃與家具配置 (Furniture Setup)', quantity: 1, unitPrice: 40000 },
    ],
    projectTypes: [
        { id: 'residential', label: '🏠 居家裝潢 (Residential)', description: '老屋翻新、新成屋裝潢' },
        { id: 'commercial_space', label: '🏢 商業空間 (Commercial)', description: '辦公室、店面、展場設計' },
        { id: 'home_staging', label: '✨ 軟裝佈置 (Staging)', description: '家具搭配、風格美化、輕量改裝' },
        { id: 'renovation', label: '🔨 統包工程 (Renovation)', description: '全室裝修、局部改裝' },
    ],
};
