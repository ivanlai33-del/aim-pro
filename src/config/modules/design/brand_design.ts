import { BusinessModule } from '@/types/industries';

export const MODULE_BRAND_DESIGN: BusinessModule = {
    id: 'brand_design',
    name: '品牌設計與 CIS 職人模組',
    description: 'LOGO、VI 系統、海報、名片、包裝、DM、Banner、插畫、PPT 等',
    categoryId: 'design',
    tagline: '終結主觀修改！把抽象美感轉化為可量化的設計規範',
    targetUser: '設計師、設計工作室、接案平面設計者',
    painPoints: ['改稿沒有上限', '版權歸屬不清', '報價沒有依據'],
    corePrompt: `Role: 品牌設計師與視覺傳達專家 (Brand Designer)
    Profile: 你專精於品牌識別與平面設計。你的專業涵蓋 LOGO 設計、VI 系統、包裝、印刷品、數位素材與插畫。
    Process: 
    1. 確認所有需要的設計項目 (如：Logo, 海報, 名片, 包裝, Banner, 型錄, PPT, 插畫等)
    2. 若有預算：將預算合理分配至各項目，標示超出預算的項目
    3. 若無預算：為每個項目提供三種價位方案 (基礎/標準/進階)
    4. 必須輸出包含詳細分項報價的「專案報價」區塊
    Focus: 原創性、品牌一致性、製作可行性與印刷規格。`,
    defaultItems: [
        { description: '品牌識別系統設計 LOGO+VI (Brand Identity)', quantity: 1, unitPrice: 30000 },
        { description: '平面設計品項（依需求報價）(Graphic Design)', quantity: 1, unitPrice: 8000 },
        { description: '印刷規格與發包協助 (Print Production)', quantity: 1, unitPrice: 5000 },
    ],
    projectTypes: [
        { id: 'brand_identity', label: '🎨 品牌識別 (Brand Identity)', description: 'LOGO、VI 系統、品牌規範手冊' },
        { id: 'print_design', label: '🖨️ 印刷品設計 (Print)', description: '名片、海報、DM、型錄、包裝' },
        { id: 'digital_design', label: '💻 數位素材 (Digital)', description: 'Banner、社群圖、PPT 模板' },
        { id: 'illustration', label: '✏️ 插畫設計 (Illustration)', description: '品牌插畫、圖像創作' },
    ],
    aiPrompts: {
        reportGeneration: `你是一位資深品牌設計總監。請根據使用者提供的資訊，生成一份「品牌識別與視覺策略提案報告」，採用以下結構：

**第一段 — 痛點共鳴 (Pain Point Resonance)**
精準描述客戶目前在品牌形象模糊、市場區隔不明、或視覺呈現缺乏專業感導致客戶信任度不足的痛點。

**第二段 — 解決方案 (Solution)**
說明建議的視覺解決方案（如：核心識別重塑、VI 系統規範、或 Moodboard 風格定調），強調如何透過「設計力」將品牌價值轉化為視覺資產。

**第三段 — ROI 分析 (ROI Analysis)**
量化設計效益（如：提升 X% 品牌辨識度、增加 Y% 的產品溢價空間、或透過視覺統一化降低 Z% 的跨部門溝通成本）。

**第四段 — 風險預警 (Risk Warning)**
主動揭露潛在風險（如：商標註冊衝突、特殊印刷色差、或設計風格過於前衛導致受眾排斥）並提供對策。

升級準則：報告採用四段式提案結構（痛點共鳴→解決方案→ROI 分析→風險預警），溝通時主動挑戰不合理需求，報價提供基礎/標準/企業三方案。`,
        customerChat: `你是一位具備藝術家靈魂與商人思維的設計師。你的溝通風格是：優雅、專業，能將美學概念轉化為商業邏輯。

關鍵行為準則：
1. 堅持「先有風格共識（Moodboard），再動筆設計」。
2. 當客戶要求「Logo 放大」或「再改一個版本」時，以專業比例與品牌一致性進行引導。
3. 鼓勵使用「文件解析器」上傳現有的品牌簡介、喜歡的設計案例或競品清單，以進行更精準的視覺定調。`,
        quotationSuggestion: `請提供品牌設計報價建議：

**基礎方案 (Essential)**：核心 Logo 設計、基礎色彩與字體規範。
**標準方案 (Standard)**：含完整的 VI 系統應用（名片、信封、社群模板）與修改次數保障。
**企業方案 (Total Branding)**：品牌故事挖掘、完整的品牌規範手冊 (Brand Guideline) 與肖像權/商標授權建議。

提醒客戶注意商標註冊規費與印刷打樣費用通常為外加。`
    },
    reportTemplate: {
        structure: `# 品牌識別設計提案\n\n## 1. 品牌核心價值提取\n\n## 2. 視覺調性與風格設定 (Moodboard)\n- 色彩計畫 (Color Palette)：\n- 字體排印 (Typography)：\n\n## 3. Logo 概念與發展方向\n\n## 4. VI 系統與延伸應用項目\n\n## 5. 設計時程與修改規範`,
        terminology: {
            'VI (Visual Identity)': '視覺識別系統 (包含 Logo、標準字、標準色及各項輔助圖形的規範)',
            'Moodboard': '情緒板 (在正式設計前，用來凝聚視覺風格共識的拼貼參考圖)',
            'Mockup': '實體合成圖 (將平面設計套用到真實物品上，如名片、招牌的模擬圖)'
        },
        analysisDimensions: ['品牌記憶度', '市場區隔性', '跨載體應用彈性 (印刷 vs 數位)']
    },
    contractHighlights: {
        mustHaveClauses: ['著作財產權歸屬（通常約定於尾款付清後，Logo 之著作財產權移交甲方，但乙方保留作品展示權）', '修改次數與範圍界定（如：提供 3 款初稿，選定 1 款後可微調 3 次，大改需另行計費）', '未採用提案之版權（未被甲方選中之初稿，版權仍屬乙方所有，甲方不得使用）'],
        industrySpecificClauses: ['商標註冊免責聲明（乙方不保證設計之 Logo 必然能通過智慧財產局之商標註冊審查）', '色差容許範圍（實體印刷與螢幕顯示之 CMYK/RGB 色差屬正常物理現象，不構成重做理由）'],
        acceptanceCriteria: ['依合約約定之檔案格式 (AI/PDF/PNG) 交付最終完稿', '交付品牌設計規範手冊 (Brand Guideline)'],
        paymentMilestones: [
            { stage: '簽約訂金', percentage: 40, trigger: '合約簽署，開始進行市場調研與 Moodboard 繪製' },
            { stage: '初稿提案', percentage: 30, trigger: '提交 Logo 初稿設計提案' },
            { stage: '完稿與尾款', percentage: 30, trigger: '最終確認並交付所有原始檔案' }
        ]
    },
    quotationConfig: {
        categoryName: '品牌與平面設計',
        unit: '式',
        terminology: { '客戶': '委託方', '我們': '設計方' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "您好，我是品牌設計師。好的 Logo 不是只是好看的圖案，而是貴公司價值的視覺濃縮。在我們動筆之前，我想請您用三個形容詞來描述您的品牌。",
        discoveryQuestions: ['您的品牌在市場上面對的最大競爭對手是誰？您希望在視覺上跟他們做出什麼差異？', '您的 Logo 未來最常出現在哪裡？（例如：手機 APP 圖示、戶外大招牌、還是實體商品包裝上？）', '您有特別偏好或絕對避諱的顏色嗎？為什麼？'],
        objectionHandling: {
            '設計一個 Logo 為什麼這麼貴？大學生幾千塊就畫好了': '大學生畫的是「圖形」，我們設計的是「品牌系統」。這筆費用包含了前期的市場調研、競品分析，以及確保這個 Logo 放到名片上跟放到巨大招牌上都一樣好看的比例測試。這是一項能夠跟隨您企業十年的投資。',
            '可以先畫幾個草圖讓我看看嗎？滿意再簽約': '很抱歉，我們的設計流程必須在確認合作並收取訂金後才會啟動。因為「想草圖」本身就是設計師最核心的心智勞動。您可以先參考我們過去的作品集，確認我們的風格是否符合您的期待。'
        },
        closing: "了解了！您的品牌非常有潛力。我會為您整理一份 Moodboard (情緒板)，確保我們對『現代極簡』的認知是在同一個頻率上，之後再正式進入 Logo 繪製。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '需求訪談與 Moodboard 定調', type: 'internal', duration: '1 週', assignee: 'Art Director' },
            { name: 'Logo 概念發想與草圖繪製', type: 'internal', duration: '1-2 週', assignee: 'Designer' },
            { name: '初稿提案 (通常 2-3 款)', type: 'external', duration: '3 天', assignee: 'Client' },
            { name: '依反饋進行細部修改 (選定 1 款)', type: 'internal', duration: '1 週', assignee: 'Designer' },
            { name: 'VI 系統與延伸應用設計', type: 'internal', duration: '2 週', assignee: 'Designer' },
            { name: '規範手冊編排與最終檔案交付', type: 'internal', duration: '3 天', assignee: 'Art Director' }
        ],
        milestones: [
            { label: 'Moodboard 與風格確認', order: 1 },
            { label: 'Logo 初稿提案', order: 2 },
            { label: 'Logo 最終定案', order: 3 },
            { label: 'VI 延伸項目與手冊交付', order: 4 }
        ],
        workflow: {
            diagram: "graph TD\\n  A[探索與調研] --> B[Moodboard 風格共識]\\n  B --> C[Logo 概念設計]\\n  C --> D[客戶提案與收斂]\\n  D --> E[VI 系統延展]\\n  E --> F[最終交付]",
            description: "採用漏斗式設計流程，先凝聚風格共識再進入細節繪製，避免後期大改。"
        }
    },
    formConfig: {
        descriptionPlaceholder: "請描述品牌願景、核心價值與目標受眾 (Vision & Values)...",
        timelineLabel: "預期結案時程 (Completion Time)",
        timelinePlaceholder: "例如：品牌發表日前一週、1 個月內完件",
        stylePlaceholder: "例如：現代極簡、品牌風格...",
        deliverablesLabel: "交付項目與設計規格 (Deliverables & Specs)",
        deliverablesPlaceholder: "例如：Logo 原始檔、品牌規範手冊、名片與文具 (VI System)",
        customFields: [
            { name: 'brandStatus', label: '品牌現況', placeholder: '例如：全新品牌、既有品牌重塑...', type: 'select', options: ['全新品牌（從零開始）', '既有品牌延伸（已有 LOGO）', '品牌重塑（現有品牌更新）'] },
            { name: 'designScope', label: '設計品項需求 (Scope)', placeholder: '請選擇需要設計的項目...', type: 'multi-select', options: ['品牌識別系統 (LOGO/VI)', '名片設計', '海報 / DM 設計', '包裝設計', '社群素材 (Icon/Banner)', 'PPT 簡報模板', '品牌插畫創作', '網頁視覺設計'] },
            { name: 'styleVibe', label: '視覺風格調性', placeholder: '請選擇風格關鍵字...', type: 'multi-select', options: ['現代極簡 (Minimalist)', '經典優雅 (Classic)', '專業洗鍊 (Corporate)', '活潑親切 (Playful)', '高端奢侈 (Luxury)', '復古懷舊 (Retro)', '前衛科技 (Tech)'] },
            { name: 'revisionLimit', label: '修改次數限制', placeholder: '請選擇提案與修改次數...', type: 'select', options: ['2次修正 (基礎型)', '3次修正 (標準型)', '5次修正 (進階型)', '不限次數修正 (依工時)', '僅需初稿提案'] },
            { name: 'ipOwnership', label: '版權歸屬處理', placeholder: '請選擇著作權處理方式...', type: 'select', options: ['全額買斷 (著作權轉讓)', '僅交付成品使用權', '不含轉授權之授權', '開源/公有領域'] },
            { name: 'fileFormats', label: '交付檔案格式', placeholder: '請選擇產出格式...', type: 'multi-select', options: ['向量原始檔 (AI/EPS/SVG)', '印刷用 PDF', '點陣圖原創檔 (PSD)', '透明背景圖 (PNG)', '一般圖片檔 (JPG)'] },
            { name: 'printNeeds', label: '印刷需求', placeholder: '例如：僅需電子檔、需要協助安排印刷...', type: 'select', options: ['僅需電子檔', '需要協助安排印刷', '需要提供印刷規格'] },
        ],
    },
};
