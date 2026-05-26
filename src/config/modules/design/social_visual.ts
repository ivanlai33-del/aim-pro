import { BusinessModule } from '@/types/industries';

export const MODULE_SOCIAL_VISUAL: BusinessModule = {
    id: 'social_visual',
    name: '社群視覺與模板 職人模組',
    description: '社群圖卡、模板設計、Discord 視覺、Emoji 設計',
    categoryId: 'design',
    tagline: '統一視覺規範，精準估算大量社群素材的產製成本',
    targetUser: '社群視覺設計師、品牌設計師',
    painPoints: ['模板授權範圍不清', '客戶自行修改後出問題', '視覺不一致'],
    corePrompt: `Role: 社群視覺設計師 (Social Media Visual Designer)
    Profile: 你專精於品牌一致性的數位資產與社群視覺設計。你的專業涵蓋社群模板、Discord 伺服器設計、Emoji 創作與動態圖形。
    Focus: 視覺一致性、平台規範與模板易用性。
    Task: 請提供詳細的視覺設計套組，包含平台規格、檔案格式與使用指南。
    Reality Check: 主動提示客戶潛在風險並提出替代方案，確保每項投資都有清晰的 ROI 依據。
    Proposal Mindset: 所有報告與建議都應具備說服力——痛點共鳴、解決方案、ROI 分析、風險預警四段式結構。`,
    formConfig: {
        descriptionPlaceholder: "請描述社群風格與模板需求 (Style & Requirements)...",
        timelineLabel: "模板交付頻率 (Delivery Frequency)",
        timelinePlaceholder: "例如：每週交付 5 款、次月 2 號前結案",
        stylePlaceholder: "例如：Cyberpunk、日系、手寫風、迷因感...",
        deliverablesLabel: "視覺項目與製作規格 (Visual Assets)",
        deliverablesPlaceholder: "例如：IG 貼文模板 10 款、限動邊框、Discord 貼圖...",
        customFields: [
            { name: "targetPlatforms", label: "目標平台 (Platforms)", placeholder: "請選擇目標平台...", type: "multi-select", options: ['Instagram (貼文/限動)', 'Facebook (貼文/廣告)', 'Threads', 'Discord', 'LINE 官方帳號', 'YouTube (社群貼文)'] },
            { name: "visualAssets", label: "視覺資產需求", placeholder: "請選擇品項 (可複選)...", type: "multi-select", options: ['貼文模板 (Post Template)', '限時動態 / Reels 封面', '社群大頭貼 / Banner', 'Discord Emoji / 貼圖', 'LINE 認證帳號圖文選單', '動態橫幅 (GIF/Motion)'] },
            { name: "styleVibe", label: "視覺風格調性", placeholder: "請選擇風格關鍵字...", type: "multi-select", options: ['極簡冷淡', '日系清新', '美式復古', '賽博龐克 (Cyberpunk)', '動漫手寫', '迷因梗圖 (MEME)', '商務專業'] },
            { name: "templateCount", label: "預計製作數量", placeholder: "例如：5款模板、10張圖卡", type: "text" },
            { name: "deliveryFormat", label: "交付與修改工具", placeholder: "請選擇交付格式...", type: "multi-select", options: ['Canva 連結 (客戶直接改)', 'Figma 專案檔', 'Adobe Photoshop (PSD)', 'Adobe Illustrator (AI)', '僅交付 PNG / JPG'] },
            { name: "usageRights", label: "授權與使用範圍", placeholder: "請選擇授權方式...", type: "select", options: ['全額版權買斷 (可商用轉售)', '品牌內部授權 (不可轉售)', '僅限模板範本使用權', '非商業使用授權'] }
        ]
    },
    aiPrompts: {
        reportGeneration: `你是一位資深社群視覺設計師與品牌美學顧問。請根據使用者提供的資訊，生成一份「社群視覺風格與模板規劃報告」，採用以下結構：

**第一段 — 痛點共鳴 (Pain Point Resonance)**
精準描述客戶目前在社群版面混亂、視覺缺乏一致性、或每次發文都要重新設計導致效率低下的焦慮。

**第二段 — 解決方案 (Solution)**
說明建議的視覺解決方案（如：排版系統定調、模組化模板設計、或視覺動線優化），強調如何透過「設計資產化」實現高效且具質感的內容輸出。

**第三段 — ROI 分析 (ROI Analysis)**
量化設計效益（如：預期降低 X% 的發文設計工時、提升 Y% 的帳號追蹤意願、或透過視覺美感建立 Z% 的品牌高端溢價）。

**第四段 — 風險預警 (Risk Warning)**
主動揭露潛在風險（如：手機端閱讀字體過小、過度依賴特效導致視覺疲勞、或模板使用規範不當導致變形）並提供對策。

升級準則：報告採用四段式提案結構（痛點共鳴→解決方案→ROI 分析→風險預警），溝通時主動挑戰不合理需求，報價提供基礎/標準/企業三方案。`,
        customerChat: `你是一位對美感極度挑剔且具備效率思維的設計師。你的溝通風格是：明快、精確，擅長將抽象的美感轉化為可執行的規範。

關鍵行為準則：
1. 堅持「視覺一致性」是品牌資產的核心。
2. 當客戶要求「把字放大加粗」時，以專業排版美學提供更優雅的強調方案。
3. 鼓勵使用「文件解析器」上傳現有的品牌 Logo、過往受好評的圖卡或喜歡的競爭對手帳號截圖，以進行更精準的視覺定調。`,
        quotationSuggestion: `請提供社群視覺設計報價建議：

**基礎方案 (Template Only)**：核心貼文模板設計、基礎色彩規範。
**標準方案 (Full Set)**：含完整限動邊框、Reels 封面模板與 Canva/Figma 可編輯原始檔。
**企業方案 (Brand Social)**：含 Discord 視覺系統、全套動態圖形 (GIF/Emoji) 與詳細使用指南手冊。

提醒客戶注意商業字體與商用圖庫授權費用通常為外加。`
    },
    reportTemplate: {
        structure: `# 社群視覺設計與模板提案\n\n## 1. 品牌社群視覺現況與痛點分析\n\n## 2. 核心視覺風格定調 (Visual Identity)\n- 主色與輔助色配置：\n- 專用字體與字級規範：\n\n## 3. 貼文排版系統設計 (Grid & Layout)\n- 封面/單圖排版規範：\n- 輪播圖卡 (Carousel) 連貫性設計：\n- 限時動態 (Stories) 互動框架：\n\n## 4. 特殊社群資產規劃 (如 Discord 貼圖, LINE 選單)\n\n## 5. 檔案交付與後續使用指南`,
        terminology: {
            'Carousel': '輪播圖卡 (IG 常見的多張連貫圖片貼文，適合知識型或故事型內容)',
            'Brand Guideline': '品牌視覺規範 (規定 Logo 怎麼放、顏色怎麼配的說明書，確保不同人設計都不會走鐘)',
            'Mockup': '情境合成圖 (將設計圖合成到真實手機畫面中，檢視實際閱讀感受)'
        },
        analysisDimensions: ['跨平台視覺一致性', '手機端閱讀清晰度', '排版延展性 (易於後續套版)']
    },
    contractHighlights: {
        mustHaveClauses: ['設計原始檔交付條款（明確約定是否提供 Canva 連結或 PSD 檔，以及客戶自行修改的授權範圍）', '修改次數限制（設計初稿提供 N 次修改，定稿套版後不再提供版型架構上的大改）', '字體與素材版權聲明（設計中使用的字體或商用圖片，版權歸屬原創作者，客戶需自行確認其商業使用範圍或由乙方代購授權）'],
        industrySpecificClauses: ['成品展示權（乙方保留將設計成品發布於個人作品集或社群平台之權利）', '非客製化插畫免責（除非另行加購「插畫設計」，否則視覺模板中之圖案多為排版與基礎圖形，不含複雜手繪）'],
        acceptanceCriteria: ['依約定數量與平台規格交付設計圖檔', '交付可編輯之模板原始檔 (如合約有約定)'],
        paymentMilestones: [
            { stage: '簽約訂金', percentage: 50, trigger: '合約簽署，啟動視覺風格定調與首波模板設計' },
            { stage: '完稿尾款', percentage: 50, trigger: '所有模板與圖卡確認並交付檔案前支付' }
        ]
    },
    quotationConfig: {
        categoryName: '社群視覺與模板設計',
        unit: '組',
        terminology: { '客戶': '品牌方', '我們': '視覺設計師' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "您好，我是社群視覺設計師。好的社群版面就像是一本精美的線上雜誌，能讓人一眼認出您的品牌。在開始設計前，您可以分享 2-3 個您目前最喜歡的 IG 帳號版面讓我參考嗎？",
        discoveryQuestions: ['未來這些模板，主要是由貴公司的哪位同事負責填入內容與發布？（這關係到我該提供 Canva 還是專業軟體的檔案）', '您目前最常發布的內容類型是什麼？（例如：純文字語錄、人物照片、還是去背的產品圖？）', '是否有既有的品牌 Logo 或標準色需要我們絕對遵守？'],
        objectionHandling: {
            '只是做個 IG 框，為什麼收費不便宜？': '您買的不是「一個框」，而是一套「視覺系統」。這套系統確保了未來不管是誰來發文，您的版面看起來都像是一個專業大品牌，而不是拼湊出來的。這能大幅降低您未來每天發文的溝通與排版成本。',
            '我可以用這組模板去幫別的客戶做圖嗎？': '我們的報價是基於「單一品牌授權」。這套模板是為您的品牌量身打造，您可以在內部無限次使用。但若您是行銷公司，要將此模板轉售或應用於其他品牌客戶，我們需要另外討論「商業轉售授權」的費用。'
        },
        closing: "了解您的喜好了！接下來我會先為您製作 2 款不同風格的『首頁九宮格預覽圖』，讓您具體感受一下未來版面排起來的氛圍。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '視覺風格定調與競品分析', type: 'internal', duration: '3 天', assignee: 'Visual Designer' },
            { name: '核心版面框架設計 (Grid & Layout)', type: 'internal', duration: '3 天', assignee: 'Visual Designer' },
            { name: '初版模板提案 (通常 2-3 款版型)', type: 'external', duration: '3 天', assignee: 'Client' },
            { name: '依據回饋修改並延伸其他尺寸', type: 'internal', duration: '1 週', assignee: 'Visual Designer' },
            { name: 'Discord 或 LINE 等其他平台視覺延伸', type: 'internal', duration: '1 週', assignee: 'Visual Designer' },
            { name: '整理規範說明與交付原始檔', type: 'internal', duration: '2 天', assignee: 'Visual Designer' }
        ],
        milestones: [
            { label: '視覺風格與排版初稿確認', order: 1 },
            { label: '全套社群模板完稿', order: 2 },
            { label: '周邊平台 (Discord/LINE) 視覺確認', order: 3 },
            { label: '檔案交付與使用教學', order: 4 }
        ],
        workflow: {
            diagram: "graph TD\\n  A[品牌風格盤點] --> B[核心版型初稿設計]\\n  B --> C[客戶回饋與微調]\\n  C --> D[延展至各平台尺寸]\\n  D --> E[建立 Canva 或 Figma 模板]\\n  E --> F[交付與結案]",
            description: "先決定核心視覺 (通常是 IG 貼文封面)，確認無誤後再延展至限時動態、Banner 等其他格式，確保效率。"
        }
    },
    defaultItems: [
        { description: '社群視覺模板設計 (Social Template)', quantity: 1, unitPrice: 12000 },
        { description: 'Discord 伺服器完整架設 (Discord Setup)', quantity: 1, unitPrice: 15000 },
        { description: '全套美術設計套組 (Art Set)', quantity: 1, unitPrice: 12000 },
        { description: 'GIF 動態設計套組 (Motion Set)', quantity: 1, unitPrice: 10000 },
    ],
    projectTypes: [
        { id: 'social_template', label: '📱 社群模板 (Social Template)', description: 'IG/FB 貼文模板、限時動態' },
        { id: 'discord_setup', label: '🛠️ Discord 架設 (Discord)', description: 'Discord 伺服器設計與架設' },
        { id: 'discord_art', label: '🎨 Discord 美術 (Discord Art)', description: 'Emoji/Banner/頭貼設計' },
    ],
};
