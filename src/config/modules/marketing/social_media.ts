import { BusinessModule } from '@/types/industries';

export const MODULE_SOCIAL_MEDIA: BusinessModule = {
    id: 'social_media',
    name: '社群經營與內容行銷',
    description: 'FB/IG 粉專經營、貼文製作、內容策略',
    categoryId: 'marketing',
    tagline: '帳號是你的，成效是可量化的',
    targetUser: '社群小編、內容行銷公司、自媒體接案者',
    painPoints: ['帳號所有權爭議', '成效定義不清', '客戶隨時要改方向'],
    corePrompt: `Role: 數位行銷策略師 (Digital Marketing Strategist)
    Profile: 你專精於社群媒體管理與內容行銷。你的專業涵蓋內容策略、社群互動、KOL 合作與品牌敘事。
    Focus: 互動指標、內容行事曆、受眾分析與品牌一致性。
    Task: 請提供包含內容主題、發布排程與 KPI 追蹤的詳細社群媒體計畫。`,
    formConfig: {
        descriptionPlaceholder: "請描述品牌現況與經營目標 (Brand & Goals)...",
        timelineLabel: "合約經營週期 (Contract Cycle)",
        timelinePlaceholder: "例如：按月簽約、第一季試辦",
        stylePlaceholder: "例如：活潑憂默、專業權威、極簡文青...",
        deliverablesLabel: "經營項目與貼文頻率 (Service Scope)",
        deliverablesPlaceholder: "例如：每週 3 篇貼文、每月 1 支 Reels、限動企劃...",
        customFields: [
            { name: "socialPlatforms", label: "主攻經營平台", placeholder: "請選擇經營平台...", type: "multi-select", options: ['Instagram', 'Facebook', 'Threads', 'YouTube', 'Line 官方帳號', 'TikTok'] },
            { name: "postFrequency", label: "預計發文頻率", placeholder: "請選擇頻率...", type: "select", options: ['一週 2 篇 (月約 8 篇)', '一週 3 篇 (月約 12 篇)', '每天發布 (月約 30 篇)', '專案式內容發布 (單次)'] },
            { name: "contentGoal", label: "主要經營目標 (KPI)", placeholder: "請選擇經營目標...", type: "select", options: ['品牌曝光與增粉 (Awareness)', '提高貼文互動率 (Engagement)', '導流至官網/賣場 (Traffic)', '私訊轉單與導購 (Conversion)', '自媒體個人 IP 打造'] },
            { name: "assetSource", label: "素材提供方式", placeholder: "請選擇素材來源...", type: "select", options: ['客戶提供素材 (製圖/影為主)', '需代為安排商業攝影', '使用商用圖庫/AI 生成', '純文字內容創作'] },
            { name: "targetAudience", label: "目標受眾 (Target Audience)", placeholder: "例如：25-35歲上班族女性", type: "text" }
        ]
    },
    aiPrompts: {
        reportGeneration: `你是一位資深社群行銷總監。請針對使用者的品牌現況與目標，產出一份社群經營提案報告。內容必須涵蓋：受眾輪廓分析、社群平台定位策略(如 IG 主攻視覺、FB 主攻導購)、內容支柱 (Content Pillars) 規劃、以及預期的互動 KPI。`,
        customerChat: `你是一位社群內容企劃兼 PM。溝通風格應活潑、有創意且具備同理心。面對客戶對於「為什麼貼文沒人按讚」的焦慮，需以專業的演算法知識與漏斗行銷觀念進行安撫與引導。`,
        quotationSuggestion: `請根據客戶預期的發文頻率與素材來源（是否需要代客拍攝、設計圖文），產出按月計費的社群代操報價單。請將「策略企劃」、「圖文製作」、「社群互動與客服」分開列項。`
    },
    reportTemplate: {
        structure: `# 社群經營與內容行銷提案報告\n\n## 1. 品牌現況與社群健檢\n\n## 2. 目標受眾與平台定位策略\n- 目標受眾輪廓 (Persona)：\n- 各平台經營定位：\n\n## 3. 內容支柱規劃 (Content Pillars)\n\n## 4. 視覺風格與溝通語氣 (Tone & Voice)\n\n## 5. 月度 KPI 與成效追蹤指標`,
        terminology: {
            'Content Pillar': '內容支柱 (品牌在社群上固定溝通的幾個核心主題大類)',
            'Engagement Rate': '互動率 (貼文按讚、留言、分享、收藏的總和除以觸及人數)',
            'UGC': '使用者生成內容 (鼓勵粉絲主動為品牌創作的圖文內容)'
        },
        analysisDimensions: ['品牌識別一致性', '受眾互動深度', '內容擴散力', '導購轉換率']
    },
    contractHighlights: {
        mustHaveClauses: ['帳號所有權聲明（合約終止後帳號歸屬客戶，但代操期間乙方有管理權限）', '素材版權與授權範圍（設計圖文僅限於本次約定之社群平台使用）', '回應時間承諾（私訊或留言的 SLA，如 24 小時內回覆）'],
        industrySpecificClauses: ['KPI 不保證轉換條款（社群經營不等於直接業績，若需保證轉換需搭配廣告投放）', '修稿次數限制（每月貼文主題與圖稿確認後，僅限微調 2 次）', '客訴免責條款（遇重大公關危機，乙方僅協助轉達，不代為決策或承擔賠償）'],
        acceptanceCriteria: ['依約定頻率準時發布貼文', '每月產出社群洞察報告', '互動率維持在約定基準線上'],
        paymentMilestones: [
            { stage: '簽約與首月執行費', percentage: 30, trigger: '合約簽署，啟動帳號接管與初期企劃' },
            { stage: '次月定時請款', percentage: 70, trigger: '依合約按月收取定額代操費用' }
        ]
    },
    quotationConfig: {
        categoryName: '社群經營模組',
        unit: '月',
        terminology: { '客戶': '品牌方', '我們': '代理商' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "您好，我是社群策略顧問。經營社群就像在網路上開一家旗艦店，我們不僅要讓路過的人想進來，還要讓進來的人願意留下來。為了精準定調，我想先了解貴品牌的靈魂是什麼？",
        discoveryQuestions: ['目前社群上最大的痛點是什麼？（是沒有粉絲、有粉絲沒互動、還是有互動但不買單？）', '您認為哪一個競品的社群經營得很棒？為什麼？', '對於品牌的發言語氣，您偏好哪種風格？（例如：專業權威的大師、親切幽默的朋友、高冷質感的精品）'],
        objectionHandling: {
            '這收費太高了，我們自己發發圖文不行嗎': '發圖文不難，難在「有策略的持續輸出」。我們的費用包含了市場競品分析、素材設計、文案撰寫以及每月的數據覆盤。如果您內部沒有專職團隊，往往會發到最後失去方向，反而浪費了平台的自然紅利。',
            '經營三個月了，為什麼業績沒有明顯提升': '社群經營（Organic Social）的核心是建立品牌信任與漏斗上層的池子。就像談戀愛，需要時間培養感情。要立即看到業績，建議要搭配廣告投放（Paid Social），將我們辛苦建立的優質內容精準投遞給準備好購買的人。'
        },
        closing: "很棒的討論！接下來我會盤點您現有的社群資產，並在一週內為您提出前三個月的「社群內容支柱 (Content Pillars)」與視覺定調提案。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '品牌社群健檢與策略定調', type: 'internal', duration: '1 週', assignee: 'Strategist' },
            { name: '月度內容行事曆規劃', type: 'internal', duration: '1 週', assignee: 'Content Planner' },
            { name: '圖文素材設計與文案撰寫', type: 'internal', duration: '1-2 週', assignee: 'Designer & Copywriter' },
            { name: '客戶審稿與修改', type: 'external', duration: '3 天', assignee: 'Client' },
            { name: '排程發布與日常互動維護', type: 'internal', duration: 'Ongoing', assignee: 'Community Manager' },
            { name: '月底數據盤點與優化報告', type: 'internal', duration: '3 天', assignee: 'Data Analyst' }
        ],
        milestones: [
            { label: '品牌社群策略定調', order: 1 },
            { label: '首月貼文行事曆確認', order: 2 },
            { label: '帳號正式接管上線', order: 3 },
            { label: '首份月報與覆盤會議', order: 4 }
        ],
        workflow: {
            diagram: "graph TD\\n  A[策略定調] --> B[月度行事曆規劃]\\n  B --> C[素材製作與文案]\\n  C --> D[客戶審核]\\n  D --> E[排程發布]\\n  E --> F[數據分析與下月優化]",
            description: "採用月度循環 (Monthly Retainer) 模式，確保內容輸出的穩定性與數據優化的連續性。"
        }
    },
    defaultItems: [
        { description: '社群內容策略規劃 (Content Strategy)', quantity: 1, unitPrice: 15000 },
        { description: 'FB/IG 貼文製作 (Social Media Post x 4)', quantity: 4, unitPrice: 3000 },
        { description: 'KOL/網紅媒合與溝通 (Influencer Management)', quantity: 1, unitPrice: 10000 },
        { description: '月度社群成效報告 (Monthly Social Report)', quantity: 1, unitPrice: 5000 },
    ],
    projectTypes: [
        { id: 'social_management', label: '📱 社群經營 (Social Media)', description: 'IG/FB 粉專經營、貼文製作' },
        { id: 'content_marketing', label: '✍️ 內容行銷 (Content Marketing)', description: '品牌內容策略、故事行銷' },
    ],
};
