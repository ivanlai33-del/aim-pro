import { BusinessModule } from '@/types/industries';

export const MODULE_VIDEO_PRODUCTION: BusinessModule = {
    id: 'video_production',
    name: '影片與動態影像 (NVIDIA 多模態升級版)',
    description: '品牌形象片、TVC、社群短影音、活動紀錄、動態設計、多模態影音 RAG 檢索',
    categoryId: 'design',
    tagline: 'NVIDIA 多模態秒級切片，腳本確認才開拍',
    targetUser: '影片製作公司、剪輯師、動態設計師、行銷總監',
    painPoints: ['腳本一直改', '版權音樂糾紛', '素材所有權不清', '數十小時毛片人工審看耗時', '競品短影音成效難以量化解構'],
    corePrompt: `Role: 資深影視製作人與 AI 多模態視覺總監 (Senior Video Producer & Multimodal AI Director)
    Profile: 你專精於商業影片製作與動態影像設計，並領先業界導入 NVIDIA Video Search & Summarization AI 藍圖技術。你曾主導超過兩百支商業影片，利用多模態 AI 秒級檢索數千小時毛片與競品短影音，協助品牌在社群平台上實現平均 3 倍以上的觀看完播率。你深信一支好影片的投資回報期通常不超過三個月。
    Focus: 敘事能力、視覺美學、製作效率、NVIDIA NIM 多模態切片檢索，以及每支影片的具體商業 ROI。
    Reality Check: 主動提示：(1) 沒有腳本確認就開拍，補拍成本可能是原始預算的兩倍；(2) 版權音樂授權範圍不清楚，上線後可能收到撤除通知；(3) 缺乏多模態競品解構，影片前 3 秒鉤子 (Hook) 不夠吸睛將流失 80% 觀眾；(4) 人工審看數十小時毛片極度耗時，應導入 AI 語意關鍵影格快篩。
    Task: 提供詳細製作計畫與多模態 AI 影音洞察報告，並清楚說明每個製作決策與 AI 分析對最終商業效益的影響。`,
    formConfig: {
        descriptionPlaceholder: "請描述影片類型、預計長度、播放平台與是否需導入 NVIDIA 多模態毛片快篩...",
        timelineLabel: "預期交片日期 (Deadline)",
        timelinePlaceholder: "例如：拍攝後二週內初稿、12/1 前完片",
        stylePlaceholder: "例如：電影感、紀錄片風格、快節奏剪輯 (Cinematic, Documentary)...",
        deliverablesLabel: "影片規格與交片清單 (Video Specs)",
        deliverablesPlaceholder: "例如：腳本、分鏡表、A Copy / B Copy、字幕、AI 多模態摘要精華 (Deliverables)...",
        customFields: [
            { name: "distPlatforms", label: "播放平台 (Platforms)", placeholder: "請選擇播放通路 (可複選)...", type: "multi-select", options: ['Instagram (Reels/限動)', 'YouTube (長片/Shorts)', 'TikTok (短影音)', 'Facebook (貼文/廣告)', '官網 / 活動現場播映', '電視廣告 (TVC)', '電商平台 (蝦皮/Momo)'] },
            { name: "videoLength", label: "影片預計長度", placeholder: "請選擇長度區間...", type: "select", options: ['15秒以內 (廣告/極短片)', '15-60秒 (短影音 Reels)', '1-3 分鐘 (形象/介紹片)', '3-10 分鐘 (紀錄/深度訪談)', '10 分鐘以上 (專題/影集)'] },
            { name: "shootingDays", label: "預計拍攝天數 (Shooting Days)", placeholder: "例如：1天, 2個半天", type: "text" },
            { name: "locations", label: "拍攝場景 (Locations)", placeholder: "例如：棚拍, 外景, 公司辦公室", type: "text" },
            { name: "postProduction", label: "後期製作需求", placeholder: "請選擇後期項目 (可複選)...", type: "multi-select", options: ['粗剪與精剪 (Editing)', '專業調色 (Color Grading)', '動態特效 / MG 字幕', '專業配音 (VO)', '版權音樂採購 / 授權', 'NVIDIA NIM 多模態毛片索引與快篩', 'Whisper AI 語音轉譯與自動對時', 'NeMo 競品短影音鉤子分析'] },
            { name: "musicRights", label: "音樂與素材授權", placeholder: "請選擇授權等級...", type: "select", options: ['網路社群永久授權 (不限區域)', '商業播放授權 (一年/單區)', '全球全通路永久授權', '需協助委託原創配樂', '不需授權 (客戶自備)'] },
            { name: "exportFormats", label: "交片規格與格式", placeholder: "請選擇規格...", type: "multi-select", options: ['4K 超高畫質', '1080p Full HD', '16:9 橫式', '9:16 直式', '1:1 正方形 (社群用)', '提供專案原始檔', '提供 Milvus 多模態向量索引檔'] },
        ]
    },
    aiPrompts: {
        reportGeneration: `你是一位資深影視製作人與 AI 多模態視覺總監。請根據使用者提供的資訊，生成一份「影像製作企劃與 NVIDIA 多模態敘事策略提案報告」，採用以下結構：

**第一段 — 痛點共鳴 (Pain Point Resonance)**
精準描述客戶目前在品牌故事難以傳達、觀眾注意力稀缺、毛片審看耗時數十小時、或低品質影片損害品牌形象上的痛點，讓客戶感受到你懂影視心理與 AI 科技。

**第二段 — NVIDIA 多模態解決方案 (Multimodal AI Solution)**
說明建議的敘事角度、製作規格與 NVIDIA Video Search & Summarization 藍圖技術的應用（如：利用 NV-Embed 進行毛片向量檢索、Whisper NIM 進行字幕秒級對時、NeMo VLM 解構競品前 3 秒鉤子），強調如何透過視覺衝擊力抓住觀眾。

**第三段 — ROI 與工時精算分析 (ROI & Efficiency Analysis)**
量化影像效益與 AI 節省工時（如：透過 AI 快篩節省 70% 審看毛片時間、預期提升 X% 的完播率、增加 Y% 的產品點擊轉換、或透過專業影片提升品牌溢價能力 Z%）。

**第四段 — 風險預警 (Risk Warning)**
主動揭露潛在風險（如：補拍成本高昂、音樂版權限制、缺乏競品解構導致前 3 秒流失率高）並提供對應的製作規範與防護建議。

升級準則：報告採用四段式提案結構（痛點共鳴→解決方案→ROI 分析→風險預警），溝通時主動挑戰不合理需求，報價提供基礎/標準/旗艦三方案。`,
        customerChat: `你是一位以敘事為魂、AI 技術為骨的影視製作顧問。你的溝通風格是：熱情、具象、充滿科技前瞻性。

關鍵行為準則：
1. 堅持「3 秒決生死」，優先討論核心訊息（Core Message）與視覺鉤子（Hook）。
2. 當客戶要求「質感又要促銷感」時，引導其確認主要 KPI（品牌 vs 轉換），再提供平衡方案。
3. 積極向客戶推介 NVIDIA NIM 多模態影音 RAG 檢索技術，解說如何利用 AI 秒級檢索數千小時素材與競品精華，大幅節省人工時間並提升作品爆發力。`,
        quotationSuggestion: `請提供影像製作報價建議：

**基礎方案 (Social Lite)**：社群短影音快速製作 + 基礎 AI 字幕對時。
**標準方案 (Professional)**：含劇本編寫、專業攝影器材、精緻調色後期與 Whisper AI 多模態轉譯。
**旗艦方案 (NVIDIA AI Cinema)**：電影級攝製團隊、原創配樂、NVIDIA NIM 影音向量切片索引、NeMo 競品短影音鉤子解構與 Milvus 知識庫建置。

提醒客戶注意演員費、場地費與多模態伺服器算力費通常採實報實銷。`
    },
    reportTemplate: {
        structure: `# 影片與動態影像製作企劃 (NVIDIA 多模態升級版)\n\n## 1. 影片目標與核心訊息 (Core Message)\n\n## 2. NVIDIA 多模態視覺洞察與聲音定調 (Multimodal Tone & Manner)\n- 競品短影音前 3 秒鉤子 (Hook) AI 解構：\n- 視覺風格 (如：電影感、明亮清新、賽博龐克)：\n- 聲音節奏與 Whisper AI 對時規劃：\n\n## 3. 創意腳本大綱與分鏡規劃 (Storyboard)\n\n## 4. 拍攝執行與 AI 索引需求 (Production & AI Indexing)\n- 場地與美術陳設：\n- 演員與特殊器材：\n- NVIDIA NIM 多模態毛片快篩與向量資料庫配置：\n\n## 5. 後期製作清單與交片時程`,
        terminology: {
            'A Copy / B Copy': 'A Copy 指初步剪輯確認敘事邏輯的版本；B Copy 指加入特效、調光與音效的最終精修版本',
            'NVIDIA NIM': 'NVIDIA 推理微服務，提供企業級的視覺大模型 (VLM)、語音轉譯 (Whisper) 與多模態向量嵌入 (NV-Embed) 加速',
            'Video RAG': '影音檢索增強生成技術，能將數千小時影片轉為向量資料庫，支援自然語言秒級搜尋影片特定時間軸片段',
            'SCD (Scene Change Detection)': 'AI 場景切換偵測技術，自動計算影片節奏與分鏡切換頻率'
        },
        analysisDimensions: ['敘事流暢度', '前 3 秒鉤子吸睛度 (Hook Score)', 'NVIDIA AI 毛片檢索效率', '畫面視覺張力', '聲音設計層次', '平台適配性 (各尺寸長度)']
    },
    contractHighlights: {
        mustHaveClauses: ['修改次數與階段定義（通常約定 A Copy 階段可修改敘事邏輯 2 次，B Copy 階段僅限微調字卡或音效 1 次，超出需加收費用）', '音樂與素材版權授權範圍（載明授權的平台、地區與年限，如：全球網路永久授權）', 'NVIDIA NIM 雲端算力與多模態索引所有權歸屬（明定 AI 分析模型與 Milvus 向量索引資料庫之存取權限與保存期限）'],
        industrySpecificClauses: ['原始檔不提供條款（報價僅包含最終輸出的影片檔，不包含剪輯專案檔與未經剪輯之拍攝毛片，若需買斷原始檔需另行計價 3-5 倍）', '天氣與不可抗力條款（外景拍攝若遇天候不佳，雙方協議延期之器材與人員成本分攤方式）'],
        acceptanceCriteria: ['依約定之長度、規格與格式交付最終影片檔', '確認畫面、聲音與字幕同步無錯誤，AI 多模態摘要精華產出完整'],
        paymentMilestones: [
            { stage: '簽約與企劃訂金', percentage: 30, trigger: '合約簽署，啟動腳本撰寫與 AI 競品分析' },
            { stage: '拍攝前製期款', percentage: 40, trigger: '確認腳本，拍攝日開機前支付' },
            { stage: '交片與 AI 索引尾款', percentage: 30, trigger: '確認 B Copy 無誤，交付無浮水印之最終高畫質檔案與多模態索引前' }
        ]
    },
    quotationConfig: {
        categoryName: '影片與動態影像製作 (NVIDIA 多模態升級版)',
        unit: '支/專案',
        terminology: { '客戶': '委託方 (Client)', '我們': '製作方 (Production House)' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "您好，我是影片製作人與 AI 視覺總監。一支好影片就像是一趟旅程，我們要在短短幾十秒內抓住觀眾的眼球。這次我們特別導入了 NVIDIA 企業級的 Video RAG 多模態 AI 技術，能秒級分析數十小時的毛片與競品短影音，提煉出前 3 秒最吸睛的視覺鉤子 (Hook)，大幅節省人工審看時間，讓您的影片成效倍增！",
        discoveryQuestions: ['這支影片主要的播放平台在哪裡？（這會影響我們拍攝的構圖比例，例如 IG 需要直式，YouTube 需要橫式）', '您有參考的影片範例 (Reference) 嗎？喜歡它哪裡？（是顏色、節奏還是特效？）', '您是否有大量過往的毛片或演講影片需要透過 NVIDIA AI 進行秒級關鍵影格搜尋與精華提煉？'],
        objectionHandling: {
            '為什麼拍一支 3 分鐘的影片這麼貴？手機錄一下不就好了': '手機確實能錄影，但我們提供的是「影視級與 AI 賦能」的頂級製作。這包含了：打動人心的專業編劇腳本、百萬級的電影攝影機、能讓影片質感提升三倍的專業調光，以及 NVIDIA 企業級多模態大模型的精準受眾視覺分析。您買的是一個能提升品牌價值與轉換率的商業武器，而不只是「一段錄影」。',
            '剪輯可以把專案檔一起給我，我以後自己改字嗎？': '影片的專案檔包含了我們團隊辛苦建立的特效模板、調色節點與獨家音效庫，這是製作公司的商業機密與核心資產。不過，我們特別提供「NVIDIA 多模態向量索引檔與 AI 摘要精華」，讓您未來能透過自然語言隨時搜尋影片特定片段。如果您仍需買斷 Pr/Ae 原始檔，我們可以討論在報價中加入「原始檔買斷費」。'
        },
        closing: "非常期待這次的合作！我會根據您的需求，先擬定一份『NVIDIA AI 視覺參考清單 (Reference Board)』與初步的『腳本大綱』，確認方向後我們再來細抓預算。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '企劃發想與競品 AI 鉤子分析 (Concept & AI Hook Analysis)', type: 'internal', duration: '1-2 週', assignee: 'AI Director / Copywriter' },
            { name: '分鏡繪製與前置作業 (Pre-production)', type: 'internal', duration: '1-2 週', assignee: 'Producer' },
            { name: '現場拍攝執行 (Shooting)', type: 'internal', duration: '1-3 天', assignee: 'Film Crew' },
            { name: 'NVIDIA NIM 多模態毛片快篩與向量索引 (AI Indexing)', type: 'internal', duration: '1-2 天', assignee: 'AI Engineer' },
            { name: 'A Copy 粗剪與 Whisper 字幕對時 (Offline Edit)', type: 'internal', duration: '1 週', assignee: 'Editor' },
            { name: 'B Copy 精剪、調光與音效設計 (Online Edit)', type: 'internal', duration: '1-2 週', assignee: 'Post-production Team' },
            { name: '客戶最終確認與修改', type: 'external', duration: '3-5 天', assignee: 'Client' },
            { name: '最終母帶輸出與 Milvus 知識庫交付 (Delivery)', type: 'internal', duration: '1 天', assignee: 'Editor' }
        ],
        milestones: [
            { label: '腳本與 AI 競品洞察確認 (PPM 會議)', order: 1 },
            { label: '拍攝順利殺青與 AI 毛片索引完成', order: 2 },
            { label: 'A Copy 粗剪確認 (敘事邏輯與 AI 字幕)', order: 3 },
            { label: 'B Copy 最終交片 (高畫質完稿與向量庫)', order: 4 }
        ],
        workflow: {
            diagram: "graph TD\\n  A[概念與 AI 競品分析] --> B[分鏡與前製會議 (PPM)]\\n  B --> C[現場拍攝 (Production)]\\n  C --> D[NVIDIA NIM 毛片快篩與索引]\\n  D --> E[粗剪 A Copy & Whisper 字幕]\\n  E --> F[精剪 B Copy (調光/特效/音效)]\\n  F --> G[最終交片與向量庫交付]",
            description: "結合影視工業流程與 NVIDIA AI Blueprints 藍圖架構，確保在進入高成本的拍攝與後期階段前，雙方已透過 AI 數據達成絕對共識。"
        }
    },
    defaultItems: [
        { description: '腳本企劃與分鏡製作 (Script & Storyboard)', quantity: 1, unitPrice: 5000 },
        { description: '動態攝影與器材租賃 (Shooting & Rental)', quantity: 1, unitPrice: 20000 },
        { description: 'NVIDIA NIM 多模態切片與向量索引費 (Video RAG Indexing)', quantity: 1, unitPrice: 8000 },
        { description: 'Whisper AI 語音轉譯與字幕自動對時費 (AI Subtitling)', quantity: 1, unitPrice: 3500 },
        { description: 'NeMo 競品短影音鉤子 (Hook) 分析與 VLM 洞察費 (VLM Insights)', quantity: 1, unitPrice: 6000 },
        { description: '後期剪輯與調色 (Editing & Color Grading)', quantity: 1, unitPrice: 15000 },
        { description: 'Motion Graphics 動畫特效 (VFX/MG)', quantity: 1, unitPrice: 10000 },
    ],
    projectTypes: [
        { id: 'commercial', label: '🎬 形象廣告 (Commercial)', description: '品牌形象片、TVC、產品宣傳' },
        { id: 'social_video', label: '📹 社群短影音 (Social Reels)', description: 'Reels/Shorts/TikTok 垂直短片 + AI 鉤子分析' },
        { id: 'event_video', label: '🎥 活動紀錄 (Event Record)', description: '活動花絮、訪談、多模態精華提煉' },
    ],
};
