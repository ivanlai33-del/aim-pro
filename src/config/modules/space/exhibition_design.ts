import { BusinessModule } from '@/types/industries';

export const MODULE_EXHIBITION_DESIGN: BusinessModule = {
    id: 'exhibition_design',
    name: '展場與特展企劃',
    description: '大型展館攤位、品牌快閃店、沉浸式特展',
    categoryId: 'space',
    tagline: '搭拆時程、展品安全，展前全部確認',
    targetUser: '展場設計公司、特展策展人',
    painPoints: ['搭建拆除時間壓力大', '展品損壞責任不清', '場地規範限制多'],
    corePrompt: `Role: 展場設計與專案專家 (Exhibition Designer)
    Profile: 你擁有豐富的大型展覽經驗。你的專業涵蓋創意攤位設計、3D 視覺化、廠商協調與專案管理。
    Focus: 視覺衝擊力、品牌訊息傳達、結構可行性與預算優化。
    Task: 請提供詳細的展場提案，包含 3D 模擬圖、施工計畫與廠商協調方案。`,
    formConfig: {
        descriptionPlaceholder: "請描述參展目標、展示商品與互動需求 (Goal & Product)...",
        timelineLabel: "進場與撤場日期 (In/Out Dates)",
        timelinePlaceholder: "例如：1/10 進場、1/15 撤場",
        stylePlaceholder: "例如：開放式通透設計、強調品牌色、科技沈浸感...",
        deliverablesLabel: "展位清單與施工細項 (Booth Specs)",
        deliverablesPlaceholder: "例如：攤位 3D 設計、施工搭建、進撤場服務、電力申請...",
        customFields: [
            { name: "exhibitionName", label: "展覽/活動名稱", placeholder: "例如：Computex 2024, 品牌快閃店", type: "text" },
            { name: "exhibitionDate", label: "展出正式日期", placeholder: "例如：2024/06/04 - 06/07", type: "text" },
            { name: "boothSizeRange", label: "攤位尺寸區間", placeholder: "請選擇規模...", type: "select", options: ['9平米 (1格標準)', '18-36平米 (2-4格)', '36-72平米 (4-8格)', '72平米以上 (大型/島型攤位)', '不限尺寸 (淨地客製)'] },
            { name: "boothType", label: "攤位類型與規格", placeholder: "請選擇施工類型...", type: "select", options: ['標準攤位 (Shell Scheme)', '木作特裝 (Custom Wood)', '系統架特裝 (Truss)', '淨地自建 (自行找工班)', '快閃店/活動車'] },
            { name: "servicesNeeded", label: "需要服務項目", placeholder: "請選擇服務 (可複選)...", type: "multi-select", options: ['3D 視覺設計', '木作施工搭建', '電力/網路/給排水申請', 'AV 影音設備租賃', '燈光與效果設計', '現場活動人力', '撤場拆除與廢棄物處理'] },
            { name: "interactiveNeeds", label: "互動與功能需求", placeholder: "請選擇功能 (可複選)...", type: "multi-select", options: ['LED 連結牆 (LED Wall)', '觸控導覽/互動牆', 'AR / VR 體驗區', '舞台活動區', '產品試用專區', 'VIP 接待區 / 茶點區'] },
            { name: "styleVibe", label: "視覺風格調性", placeholder: "請選擇風格關鍵字...", type: "multi-select", options: ['科技未來感', '奢華大氣', '簡約工藝', '彩色鮮艷', '環保綠能 / 永續'] },
        ]
    },
    aiPrompts: {
        reportGeneration: `你是一位資深展場設計總監。請根據客戶的參展目標與攤位尺寸，產出一份展場設計提案。內容需包含：攤位視覺概念 (Concept)、空間動線規劃 (Space Layout)、展品陳列方式 (Display Strategy) 以及互動科技的應用建議。`,
        customerChat: `你是一位展場工務經理。溝通風格需具備工程背景的務實與嚴謹。面對客戶要求「把攤位隔板拆掉變全開放」或「在頂部掛超重招牌」時，需立刻以展館消防法規、結構安全與限高規定來把關，並提出合規的替代設計。`,
        quotationSuggestion: `請提供展場設計報價建議。必須明確劃分「3D 設計費」、「木作/系統裝潢工程費(實報實銷)」、「水電網路代辦費」與「現場專案監工費」。提醒客戶展館收取的保證金與水電費通常由客戶自行繳納。`
    },
    reportTemplate: {
        structure: `# 展場與特展設計提案\n\n## 1. 參展目標與品牌主題 (Theme)\n\n## 2. 空間配置與動線規劃 (Floor Plan)\n- 接待區/主舞台：\n- 產品展示區：\n- VIP 洽談/儲藏室：\n\n## 3. 3D 視覺模擬與材質設定\n\n## 4. 互動科技與體驗旅程 (User Journey)\n\n## 5. 施工進撤場計畫與安全規範`,
        terminology: {
            'Truss': '衍架 (展場常見的金屬組合支架，常用於懸掛燈光音響或大型帆布)',
            'TR / 木作特裝': '相對於大會提供的制式攤位，完全使用木工客製化打造的專屬攤位',
            '進撤場': 'Move-in / Move-out (大會規定的裝潢施工與拆除時間，通常非常短暫且有嚴格時限)'
        },
        analysisDimensions: ['品牌辨識度 (遠距吸睛度)', '展品說明清晰度', '人流動線順暢度']
    },
    contractHighlights: {
        mustHaveClauses: ['設計與施工分離條款（若客戶僅委託設計而由第三方施工，需明訂乙方不對第三方之施工品質與結構安全負責）', '大會規章遵守義務（所有設計與材質(如防焰證明)必須符合展館規定，若因違反規定遭罰款，責任歸屬需釐清）', '追加工程與材料替換（現場施工若遇突發狀況需替換材料或追加工程，需經甲方代表口頭或文字確認後方可執行並計費）'],
        industrySpecificClauses: ['夜間施工加班費（進退場時間受限於展館，若需夜間趕工，衍生之工班加班費與展館夜間水電費由何方負擔）', '保險責任（施工期間之公共意外責任險與雇主責任險應由乙方投保，展品失竊險由甲方投保）'],
        acceptanceCriteria: ['於大會規定之進場時間內完成攤位搭建', '交付之攤位規格與材質符合最終確認之施工圖', '展期結束後完成廢棄物清運與撤場'],
        paymentMilestones: [
            { stage: '設計訂金', percentage: 30, trigger: '合約簽署，啟動 3D 建模與平面配置' },
            { stage: '工程期款', percentage: 50, trigger: '3D 圖與報價定案，木作工廠開始下料製作前' },
            { stage: '驗收尾款', percentage: 20, trigger: '展前一日攤位點交驗收完畢後支付' }
        ]
    },
    quotationConfig: {
        categoryName: '展場空間設計',
        unit: '攤位/平米',
        terminology: { '客戶': '參展商', '我們': '展場設計公司' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "您好，我是展場設計總監。在龐大的展館裡，我們要讓您的攤位像燈塔一樣吸引目光。請問這次參展，您最希望達成的目標是『蒐集名單(Lead Gen)』、『品牌曝光(Branding)』還是『現場銷售(Sales)』？這會完全決定我們的空間配置。",
        discoveryQuestions: ['請問您的攤位是大會標準格，還是幾面開的淨地 (Raw Space)？（例如：三面開、島型攤位）', '這次預計展示的產品中，體積最大或最重的是什麼？有特殊水電需求嗎？（如：大型機台需 220V 三相用電）', '攤位上需要安排封閉式的 VIP 洽談室或員工休息/儲藏空間嗎？'],
        objectionHandling: {
            '只是用幾天就拆掉，裝潢費不能便宜點嗎？': '展場裝潢的成本在於「時間」與「人工」。我們必須在工廠先預製好所有模組，然後在展館給的短短 48 小時內，動員大量工班日夜趕工組裝。您支付的不是材料的永續價值，而是「在極限時間內完美呈現品牌形象」的專業執行力。',
            '為什麼大會的電費跟網路費這麼貴？可以不用嗎？': '展館的動力水電與網路是主辦單位的獨佔設施，收費標準是固定的。為了確保您展期中設備不會跳電、互動裝置不會斷網，這筆基礎設施的預算是絕對不能省的。我們在規劃時會精算您的用電量，幫您申請最剛好的安培數以節省費用。'
        },
        closing: "清楚了！您的需求很具體。我會先為您繪製一份『平面動線配置圖 (Floor Plan)』，確認接待區與展示區的比例正確後，我們再進入 3D 視覺渲染。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '需求訪談與法規確認', type: 'internal', duration: '3 天', assignee: 'Account Manager' },
            { name: '平面配置與 3D 設計提案', type: 'internal', duration: '1-2 週', assignee: '3D Designer' },
            { name: '設計定案與施工圖繪製', type: 'internal', duration: '1 週', assignee: 'Draftsman' },
            { name: '各項大會表格代辦申請 (水電/懸吊)', type: 'internal', duration: '依大會規定', assignee: 'Project Manager' },
            { name: '工廠木作預製與美工輸出', type: 'internal', duration: '2-3 週', assignee: 'Factory / Vendor' },
            { name: '現場進場施工與點交 (Move-in)', type: 'internal', duration: '2-3 天', assignee: 'Construction Team' },
            { name: '展期維護與撤場拆除 (Move-out)', type: 'internal', duration: '1 天', assignee: 'Project Manager' }
        ],
        milestones: [
            { label: '3D 設計與配置定案', order: 1 },
            { label: '大會手續申報完成', order: 2 },
            { label: '現場點交驗收完畢', order: 3 },
            { label: '撤場清運完成', order: 4 }
        ],
        workflow: {
            diagram: "graph TD\\n  A[設計提案] --> B[施工圖與大會申報]\\n  B --> C[工廠預製]\\n  C --> D[進場施工 (極限時間)]\\n  D --> E[展前驗收]\\n  E --> F[撤場清運]",
            description: "展場設計是高度依賴時程管理的專案，任何設計變更都必須在工廠預製前定案，現場極難進行大規模修改。"
        }
    },
    defaultItems: [
        { description: '展場創意設計與 3D 模擬圖 (Creative Design)', quantity: 1, unitPrice: 45000 },
        { description: '攤位木作/結構工程 (Booth Construction)', quantity: 1, unitPrice: 150000 },
        { description: '廠商接洽與專案監造費 (Project Management)', quantity: 1, unitPrice: 30000 },
        { description: '展場影音與燈光租賃 (AV & Lighting)', quantity: 1, unitPrice: 25000 },
        { description: '展期物料與現場人力 (Logistics & Staff)', quantity: 1, unitPrice: 20000 },
    ],
    projectTypes: [
        { id: 'expo_booth', label: '🏛️ 大型展館 (Exhibition Hall)', description: '世貿、南港展覽館大型攤位' },
        { id: 'pop_up', label: '🎪 快閃店 (Pop-up Store)', description: '品牌快閃店、期間限定店' },
        { id: 'special_exhibition', label: '✨ 特展企劃 (Special Exhibition)', description: '沉浸式特展、主題展覽' },
    ],
};
