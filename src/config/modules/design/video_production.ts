import { BusinessModule } from '@/types/industries';

export const MODULE_VIDEO_PRODUCTION: BusinessModule = {
    id: 'video_production',
    name: '影片與動態影像',
    description: '品牌形象片、TVC、社群短影音、活動紀錄、動態設計',
    categoryId: 'design',
    tagline: '腳本確認才開拍，版權音樂有授權',
    targetUser: '影片製作公司、剪輯師、動態設計師',
    painPoints: ['腳本一直改', '版權音樂糾紛', '素材所有權不清'],
    corePrompt: `Role: 資深影視製作人與商業導演 (Senior Video Producer)
    Profile: 你專精於商業影片製作與動態影像設計，曾主導超過兩百支商業影片，協助品牌在社群平台上實現平均 3 倍以上的觀看完播率。你深信一支好影片的投資回報期通常不超過三個月。
    Focus: 敘事能力、視覺美學、製作效率，以及每支影片的具體商業 ROI。
    Reality Check: 主動提示：(1) 沒有腳本確認就開拍，補拍成本可能是原始預算的兩倍；(2) 版權音樂授權範圍不清楚，上線後可能收到撤除通知；(3) 沒有考慮平台適配比例，一支影片可能需要重剪三個版本。
    Task: 提供詳細製作計畫，並清楚說明每個製作決策對最終商業效益的影響。`,
    formConfig: {
        descriptionPlaceholder: "請描述影片類型、預計長度與播放平台 (Type, Length & Platform)...",
        timelineLabel: "預期交片日期 (Deadline)",
        timelinePlaceholder: "例如：拍攝後二週內初稿、12/1 前完片",
        stylePlaceholder: "例如：電影感、紀錄片風格、快節奏剪輯 (Cinematic, Documentary)...",
        deliverablesLabel: "影片規格與交片清單 (Video Specs)",
        deliverablesPlaceholder: "例如：腳本、分鏡表、A Copy / B Copy、字幕 (Deliverables)...",
        customFields: [
            { name: "distPlatforms", label: "播放平台 (Platforms)", placeholder: "請選擇播放通路 (可複選)...", type: "multi-select", options: ['Instagram (Reels/限動)', 'YouTube (長片/Shorts)', 'TikTok (短影音)', 'Facebook (貼文/廣告)', '官網 / 活動現場播映', '電視廣告 (TVC)', '電商平台 (蝦皮/Momo)'] },
            { name: "videoLength", label: "影片預計長度", placeholder: "請選擇長度區間...", type: "select", options: ['15秒以內 (廣告/極短片)', '15-60秒 (短影音 Reels)', '1-3 分鐘 (形象/介紹片)', '3-10 分鐘 (紀錄/深度訪談)', '10 分鐘以上 (專題/影集)'] },
            { name: "shootingDays", label: "預計拍攝天數 (Shooting Days)", placeholder: "例如：1天, 2個半天", type: "text" },
            { name: "locations", label: "拍攝場景 (Locations)", placeholder: "例如：棚拍, 外景, 公司辦公室", type: "text" },
            { name: "postProduction", label: "後期製作需求", placeholder: "請選擇後期項目 (可複選)...", type: "multi-select", options: ['粗剪與精剪 (Editing)', '專業調色 (Color Grading)', '動態特效 / MG 字幕', '專業配音 (VO)', '版權音樂採購 / 授權', '3D 動畫製作'] },
            { name: "musicRights", label: "音樂與素材授權", placeholder: "請選擇授權等級...", type: "select", options: ['網路社群永久授權 (不限區域)', '商業播放授權 (一年/單區)', '全球全通路永久授權', '需協助委託原創配樂', '不需授權 (客戶自備)'] },
            { name: "exportFormats", label: "交片規格與格式", placeholder: "請選擇規格...", type: "multi-select", options: ['4K 超高畫質', '1080p Full HD', '16:9 橫式', '9:16 直式', '1:1 正方形 (社群用)', '提供專案原始檔'] },
        ]
    },
    aiPrompts: {
        reportGeneration: `你是資深影視製作人兼提案策略師。請生成具備說服力的「影片製作企劃提案書」：痛點共鳴（低品質影片如何在 3 秒內流失觀眾並損害品牌形象）、解決方案（核心敘事策略與製作方法論）、ROI 分析（專業影片如何提升完播率與轉換率）、製作藍圖（腳本→分鏡→拍攝→後期→交付）、授權規劃、風險預警（臨時需求變更的補拍成本）。`,
        customerChat: `你是商業影片製作顧問。溝通哲學是「3 秒決生死，敘事決勝負」。用數據說明完播率對品牌轉換的影響。當客戶要求「質感又要促銷感」，引導他先確認影片的主要 KPI，再做取捨建議。`,
        quotationSuggestion: `請提供三方案報價：社群短影音方案（腳本+拍攝+基礎後期）、品牌形象片方案（完整製作+精緻後期+版權音樂）、旗艦方案（多版本+多平台適配+完整授權+花絮素材）。說明各方案對業務目標的具體貢獻。`
    },
    reportTemplate: {
        structure: `# 影片與動態影像製作企劃\n\n## 1. 影片目標與核心訊息 (Core Message)\n\n## 2. 視覺與聲音定調 (Tone & Manner)\n- 視覺風格 (如：電影感、明亮清新、賽博龐克)：\n- 聲音節奏 (如：快節奏電子樂、溫暖人聲旁白)：\n\n## 3. 創意腳本大綱與分鏡規劃 (Storyboard)\n\n## 4. 拍攝執行需求 (Production Requirements)\n- 場地與美術陳設：\n- 演員與特殊器材：\n\n## 5. 後期製作清單與交片時程`,
        terminology: {
            'A Copy / B Copy': 'A Copy 指初步剪輯確認敘事邏輯的版本；B Copy 指加入特效、調光與音效的最終精修版本',
            'Storyboard': '分鏡腳本 (將文字腳本轉化為連續畫面的草圖，幫助團隊與客戶想像最終畫面)',
            'B-Roll': '輔助鏡頭 (穿插在主訪談或主畫面中的空景或特寫，用來豐富畫面與掩飾剪接點)'
        },
        analysisDimensions: ['敘事流暢度', '畫面視覺張力', '聲音設計層次', '平台適配性 (各尺寸長度)']
    },
    contractHighlights: {
        mustHaveClauses: ['修改次數與階段定義（通常約定 A Copy 階段可修改敘事邏輯 2 次，B Copy 階段僅限微調字卡或音效 1 次，超出需加收費用）', '音樂與素材版權授權範圍（載明授權的平台、地區與年限，如：全球網路永久授權，不含電視聯播網）', '腳本確認與重拍條款（拍攝必須依據雙方簽名確認之最終腳本執行，若因客戶現場臨時大幅修改需求導致延誤或需補拍，費用由客戶承擔）'],
        industrySpecificClauses: ['原始檔不提供條款（報價僅包含最終輸出的影片檔，不包含剪輯專案檔(如 Pr/Ae 檔)與未經剪輯之拍攝毛片，若需買斷原始檔需另行計價 3-5 倍）', '天氣與不可抗力條款（外景拍攝若遇天候不佳，雙方協議延期之器材與人員成本分攤方式）'],
        acceptanceCriteria: ['依約定之長度、規格與格式交付最終影片檔', '確認畫面、聲音與字幕同步無錯誤'],
        paymentMilestones: [
            { stage: '簽約與企劃訂金', percentage: 30, trigger: '合約簽署，啟動腳本撰寫' },
            { stage: '拍攝前製期款', percentage: 40, trigger: '確認腳本，拍攝日開機前支付' },
            { stage: '交片尾款', percentage: 30, trigger: '確認 B Copy 無誤，交付無浮水印之最終高畫質檔案前' }
        ]
    },
    quotationConfig: {
        categoryName: '影片與動態影像製作',
        unit: '支/專案',
        terminology: { '客戶': '委託方 (Client)', '我們': '製作方 (Production House)' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "您好，我是影片製作人。一支好影片就像是一趟旅程，我們要在短短幾十秒內抓住觀眾的眼球，並把您的品牌故事烙印在他們心裡。這次的影片，您希望觀眾看完後，心裡留下什麼感覺？",
        discoveryQuestions: ['這支影片主要的播放平台在哪裡？（這會影響我們拍攝的構圖比例，例如 IG 需要直式，YouTube 需要橫式）', '您有參考的影片範例 (Reference) 嗎？喜歡它哪裡？（是顏色、節奏還是特效？）', '影片中會需要專業演員、特定場地（如豪宅、咖啡廳）或特殊的道具嗎？'],
        objectionHandling: {
            '為什麼拍一支 3 分鐘的影片這麼貴？手機錄一下不就好了': '手機確實能錄影，但我們提供的是「影視級」的製作。這包含了：打動人心的專業編劇腳本、百萬級的電影攝影機與燈光設備、以及能讓影片質感提升三倍的專業調光與音效設計。您買的是一個能提升品牌價值的商業武器，而不只是「一段錄影」。',
            '剪輯可以把專案檔一起給我，我以後自己改字嗎？': '影片的專案檔包含了我們團隊辛苦建立的特效模板、調色節點與獨家音效庫，這是製作公司的商業機密與核心資產，通常不包含在一般影片製作報價中。如果您未來有頻繁修改字卡的需求，我們可以討論在報價中加入「原始檔買斷費」，或是由我們為您提供長期的優惠修改方案。'
        },
        closing: "非常期待這次的合作！我會根據您的需求，先擬定一份『視覺參考清單 (Reference Board)』與初步的『腳本大綱』，確認方向後我們再來細抓預算。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '企劃發想與腳本大綱 (Concept & Script)', type: 'internal', duration: '1-2 週', assignee: 'Director / Copywriter' },
            { name: '分鏡繪製與前置作業 (Pre-production)', type: 'internal', duration: '1-2 週', assignee: 'Producer' },
            { name: '實際拍攝執行 (Shooting)', type: 'internal', duration: '1-3 天', assignee: 'Film Crew' },
            { name: 'A Copy 粗剪與客戶初審 (Offline Edit)', type: 'internal', duration: '1 週', assignee: 'Editor' },
            { name: 'B Copy 精剪、調光與音效設計 (Online Edit)', type: 'internal', duration: '1-2 週', assignee: 'Post-production Team' },
            { name: '客戶最終確認與修改', type: 'external', duration: '3-5 天', assignee: 'Client' },
            { name: '最終母帶輸出與交付 (Delivery)', type: 'internal', duration: '1 天', assignee: 'Editor' }
        ],
        milestones: [
            { label: '腳本與分鏡確認 (PPM 會議)', order: 1 },
            { label: '拍攝順利殺青', order: 2 },
            { label: 'A Copy 粗剪確認 (敘事邏輯)', order: 3 },
            { label: 'B Copy 最終交片 (高畫質完稿)', order: 4 }
        ],
        workflow: {
            diagram: "graph TD\\n  A[概念與腳本] --> B[分鏡與前製會議 (PPM)]\\n  B --> C[現場拍攝 (Production)]\\n  C --> D[粗剪 A Copy (敘事確認)]\\n  D --> E[精剪 B Copy (調光/特效/音效)]\\n  E --> F[最終交片]",
            description: "採用嚴謹的影視工業流程，確保在進入高成本的拍攝與後期階段前，雙方已在 PPM (Pre-Production Meeting) 達成絕對共識。"
        }
    },
    defaultItems: [
        { description: '腳本企劃與分鏡製作 (Script & Storyboard)', quantity: 1, unitPrice: 5000 },
        { description: '動態攝影與器材租賃 (Shooting & Rental)', quantity: 1, unitPrice: 20000 },
        { description: '後期剪輯與調色 (Editing & Color Grading)', quantity: 1, unitPrice: 15000 },
        { description: 'Motion Graphics 動畫特效 (VFX/MG)', quantity: 1, unitPrice: 10000 },
    ],
    projectTypes: [
        { id: 'commercial', label: '🎬 形象廣告 (Commercial)', description: '品牌形象片、TVC、產品宣傳' },
        { id: 'social_video', label: '📹 社群短影音 (Social Reels)', description: 'Reels/Shorts/TikTok 垂直短片' },
        { id: 'event_video', label: '🎥 活動紀錄 (Event Record)', description: '活動花絮、訪談、婚禮錄影' },
    ],
};
