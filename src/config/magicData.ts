export const MAGIC_TEST_DATA: Record<string, any> = {
    // 🟢 網頁與數位產品
    web_development: {
        projectName: "全球品牌跨境官網建置",
        description: "打造具備多國語言與極速訪問能力的企業品牌網站。",
        features: "1. 響應式網頁設計 (RWD)\n2. 多國語言切換系統\n3. 高階動畫效果與滾動視差\n4. 後台內容管理系統 (CMS)",
        budget: "50萬 - 80萬 TWD",
        timeline: "4個月內",
        existingTech: ["React / Next.js", "Node.js (Express)"],
        targetPlatforms: ["Web 網頁版", "PWA (行動網頁)"],
        infrastructure: ["雲端平台 (AWS/GCP/Azure)", "靜態託管 (Vercel/Netlify)"],
        optimizationGoals: ["SEO 搜尋優化", "極速載入校調", "RWD 多裝置相容"],
        projectNature: "0 到 1 全新開發 (New Build)",
        clientCompany: "環球創意科技股份有限公司",
        clientTaxId: "88889999",
        clientContact: "王經理",
        clientAddress: "台北市信義區...",
        projectType: "website"
    },
    software_outsourcing: {
        projectName: "企業級 CRM 客戶管理系統開發",
        description: "針對中大型企業設計的客製化 CRM，包含銷售自動化與數據分析。",
        features: "1. 角色權限管理 (RBAC)\n2. 銷售漏斗與圖表報表\n3. API 串接現有 ERP 系統",
        budget: "120萬 - 200萬",
        timeline: "6-8 個月",
        techStack: ["Node.js (NestJS/Express)", "React / Next.js"],
        deployment: "雲端平台 (AWS / GCP / Azure)",
        deliverablesDetail: ["系統原始碼 (Source Code)", "API 文件 (Swagger/Postman)", "Docker 部署腳本"],
        slaNeeds: ["基礎故障修復 (Bug Fix)", "定期功能微調與維護"],
        ipOwnership: "全額買斷 (IP Transfer)",
        clientCompany: "大型零售控股集團",
        clientContact: "林技術長",
        projectType: "saas"
    },
    system_integration: {
        projectName: "電子商務全方位金物流整合",
        description: "將自建網站與國內主要金流 (綠界/藍新) 及物流 (黑貓/超商) 系統完成對接。",
        features: "1. 刷卡、Apple Pay、Line Pay 支付\n2. 超商取貨與貨態追蹤\n3. 訂單自動拋轉後台過帳",
        integrationMethod: "API 深度對接",
        syncFrequency: "即時同步 (Real-time)",
        securityReq: ["標準加密 (SSL/TLS)", "IP 白名單限制", "API 密鑰認證"],
        projectType: "api_integration"
    },

    // 🟡 數位行銷與推廣
    social_media: {
        projectName: "新通路上市社群年度代操",
        description: "FB/IG/LINE 全渠道內容經營，目標提升品牌聲量與互動率。",
        socialPlatforms: ["Instagram", "Facebook", "Threads", "Line 官方帳號"],
        postFrequency: "一週 3 篇 (月約 12 篇)",
        contentGoal: "提高貼文互動率 (Engagement)",
        assetSource: "使用商用圖庫/AI 生成",
        clientCompany: "居家美學股份有限公司",
        projectType: "social_management"
    },
    ad_management: {
        projectName: "夏季新品流量增長計畫",
        description: "多渠道投放廣告，搭配追蹤代碼優化轉單路徑。",
        adPlatforms: ["Meta (FB/IG)", "Google Ads"],
        kpiGoals: ["提升 ROAS / ROI", "網店導購轉換", "增加名單私訊量"],
        monthlyBudget: "15萬 - 30萬 TWD",
        accountStatus: "已有運作中帳號",
        projectType: "ecommerce_ads"
    },
    seo: {
        projectName: "全站關鍵字競爭力提升",
        description: "優化現有電商站點技術架構，搶佔核心產品關鍵字首頁。",
        websiteStatus: "已上線 (流量停滯中)",
        seoFocus: ["技術 SEO (網站健檢)", "內容行銷 (部落格策略)", "關鍵字排名優化"],
        searchEngines: ["Google (主要)"],
        analyticsStatus: "已安裝並正確設定 GA4 & GSC",
        projectType: "technical_seo"
    },
    influencer_marketing: {
        projectName: "美妝新品 KOL/KOC 百人口碑計畫",
        description: "篩選優質創作者進行產品實測，累積網路聲量與 Google 評論。",
        collabPlatforms: ["Instagram (貼文/限動)", "TikTok (短影音)"],
        influencerTier: "微網紅 Micro (10k-50k)",
        influencerCategories: ["美妝保養", "生活風格 / 居家"],
        cooperationMode: ["體驗開箱業配", "廣告肖像授權"],
        projectType: "kol_seeding"
    },

    // 🔵 視覺設計與創意
    brand_design: {
        projectName: "新品牌 CI/VI 視覺形象全案",
        description: "從品牌故事出發，打造具備國際感的完整體覺辨識系統。",
        brandStatus: "全新品牌（從零開始）",
        designScope: ["品牌識別系統 (LOGO/VI)", "名片設計", "包裝設計", "社群素材 (Icon/Banner)"],
        styleVibe: ["現代極簡 (Minimalist)", "專業洗鍊 (Corporate)"],
        revisionLimit: "3次修正 (標準型)",
        ipOwnership: "全額買斷 (著作權轉讓)",
        fileFormats: ["向量原始檔 (AI/EPS/SVG)", "印刷用 PDF"],
        projectType: "brand_identity"
    },
    ui_ux_design: {
        projectName: "金融服務 APP 介面重新設計",
        description: "針對現有電商平台進行全面 UI/UX 優化，提升轉單率。",
        targetPlatform: ["iOS / Android APP", "響應式網頁 (RWD)"],
        designDepth: "完整產品介面設計 (全案)",
        userFlow: "需要完整用戶旅程分析",
        interactionLevel: "高級交互動畫 (Hi-Fi Prototype)",
        pageCount: "約 30-45 頁",
        clientCompany: "時尚生活科技",
        projectType: "ecommerce"
    },
    video_production: {
        projectName: "年度品牌形象宣傳片",
        description: "具備故事性的 2 分鐘品牌形象影片，用於廣告與官網。",
        distPlatforms: ["YouTube (長片/Shorts)", "Instagram (Reels/限動)", "電視廣告 (TVC)"],
        videoLength: "1-3 分鐘 (形象/介紹片)",
        postProduction: ["粗剪與精剪 (Editing)", "專業調色 (Color Grading)", "動態特效 / MG 字幕", "版權音樂採購 / 授權"],
        musicRights: "網路社群永久授權 (不限區域)",
        exportFormats: ["4K 超高畫質", "1080p Full HD", "16:9 橫式"],
        projectType: "commercial"
    },
    social_visual: {
        projectName: "電商大促社群視覺包",
        description: "針對購物節慶設計全套社群 Banner、限時動態與產品推廣圖。",
        targetPlatforms: ["Instagram (貼文/限動)", "Facebook (貼文/廣告)", "LINE 官方帳號"],
        visualAssets: ["貼文模板 (Post Template)", "限時動態 / Reels 封面", "LINE 認證帳號圖文選單"],
        styleVibe: ["賽博龐克 (Cyberpunk)", "迷因梗圖 (MEME)"],
        deliveryFormat: ["Canva 連結 (客戶直接改)", "Figma 專案檔"],
        usageRights: "全額版權買斷 (可商用轉售)",
        projectType: "social_template"
    },
    photography: {
        projectName: "高端皮件精品產品商攝",
        description: "高品質目錄攝影與情境氛圍圖，用於電商官網與行銷素材。",
        shootingHours: "8小時全天 (精實)",
        locationNeeded: "需代租專業攝影棚",
        editingLevel: "標準精修 (膚質、液化、基礎環境)",
        deliverableFormats: ["全數調色毛片 (JPG)", "指定數量精修檔 (JPG)", "全數原始檔 (RAW)"],
        addServices: ["造型師 (妝髮)", "道具準備與場景佈置"],
        projectType: "product_commercial"
    },

    // 🟠 空間與活動企劃
    interior_design: {
        projectName: "法式復古風格居家裝修",
        description: "35 坪新成屋，期望打造具備收納性與美感的居家空間。",
        propertyType: "新成屋裝潢",
        spaceSizeRange: "30 - 50 坪 (大坪數)",
        designStyle: ["現代極簡", "奢華古典"],
        projectScope: ["全室完整裝修", "木作看板與隔間", "家具軟裝挑選與佈置 (Styling)"],
        functionalNeeds: ["居家辦公室 / 書房", "海量收納規劃"],
        projectType: "residential"
    },
    event_planning: {
        projectName: "永續科技企業年終尾牙",
        description: "500 人規模的企業年終慶典，強調環保科技元素與高級互動。",
        attendeeCount: "200 - 500 人 (大型活動)",
        venue: "五星級飯店 / 宴會廳",
        servicesNeeded: ["活動企劃與流程控管", "現場硬體 (音響燈光)", "場地視覺佈置", "活動主持人 / 樂團"],
        eventVibe: ["科技未來感", "莊重典雅"],
        cateringType: "自助餐 (Buffet)",
        projectType: "corporate_event"
    },
    exhibition_design: {
        projectName: "台北國際電腦展 (Computex) 攤位",
        description: "4 個攤位規模，重點在於產品互動區與主視覺吸引力。",
        boothSizeRange: "18-36平米 (2-4格)",
        boothType: "木作特裝 (Custom Wood)",
        servicesNeeded: ["3D 視覺設計", "木作施工搭建", "電力/網路/給排水申請", "AV 影音設備租賃"],
        interactiveNeeds: ["LED 連結牆 (LED Wall)", "產品試用專區"],
        styleVibe: ["科技未來感", "簡約工藝"],
        projectType: "expo_booth"
    },

    // 🟣 專業服務與顧問
    business_consulting: {
        projectName: "企業永續經營 (ESG) 升級診斷",
        description: "協助中小企業符合最新的碳稅法規與永續經營路徑規劃。",
        companySize: "中小型企業 SME (5-50人)",
        industrySector: "零售 / 批發 / 服務業",
        consultingScope: ["全案企業診斷 (Diagnosis)", "ESG / 永續經營顧問", "內部流程優化 (Process)"],
        keyObjectives: ["提升整體營運效率", "降低營運成本", "企業轉型突破"],
        engagementModel: "年度顧問約 (Retainer)",
        projectType: "business_diagnosis"
    },
    corporate_training: {
        projectName: "高階主管 AI 協作領導力工作坊",
        description: "針對決策層設計，學習如何利用 AI 提昇管理效率與決策準確度。",
        traineeCountRange: "10-30 人 (標準班級)",
        trainingMethod: "實體工作坊 (現場指導)",
        targetAudience: ["高階管理者 (CXO)", "中階主管"],
        evaluationMethods: ["課後滿度問卷調查", "實際專案成果展示"],
        recordingRights: "可內部存檔 (不公開販售)",
        projectType: "workshop"
    },
    strategy_planning: {
        projectName: "跨境東南亞市場進入策略",
        description: "針對印尼、越南市場進行競爭者分析與通路佈局建議。",
        businessStage: "成長期 (有產品，追求擴張)",
        marketScope: "國際市場進入專案",
        consultingFocus: ["市場競爭分析", "通路與供應鏈佈局", "在地化行銷策略"],
        growthObjectives: ["市佔率擴張 (Share)", "品牌忠誠度提升"],
        timeHorizon: "3年中期戰略規劃",
        projectType: "market_entry"
    },

    // 💎 知識產出與專業職人
    online_course_prod: {
        projectName: "數位轉型精選大師課製作",
        description: "打造高品質知識產出，含錄影、剪輯與平台架設。",
        courseFormat: "預錄影片課程 (VOD)",
        totalMinutes: "360 分鐘",
        chapterCount: "12 個章節",
        deliverables: ["教學腳本撰寫", "後期剪輯與字幕", "平台代上架服務"],
        marketingSupport: "需要 (募資策略+廣告代操)",
        projectType: "masterclass"
    },
    home_organizer: {
        projectName: "全屋煥然一新整理計畫",
        description: "協助客戶在搬遷新居前進行物品清整，並規劃新家收納動線。",
        spaceType: ["搬家前減量 / 搬家後歸位", "衣櫥 / 臥室空間", "客餐廳 / 公共區域"],
        sizeRange: "15 - 30 坪 (標準)",
        clutterLevel: "重度囤積 (需較長捨棄時間)",
        organizationMethod: "與客戶共同整理 (含引導)",
        requiredStaff: "2 人 (標準雙人組)",
        projectType: "relocation_service"
    },
    ip_agent: {
        projectName: "品牌多國商標佈局專案",
        description: "針對自有品牌申請 TIPO、JP、US 三地商標，確保全球競爭力。",
        applicationRegion: ["台灣 (TIPO)", "日本 (JPO)", "美國 (USPTO)"],
        applicationType: "商標申請 (Trademark)",
        searchDepth: "深度檢索 (含類似音/圖樣)",
        classCount: "2 類 (第 35, 43 類)",
        projectType: "brand_protection"
    }
};
