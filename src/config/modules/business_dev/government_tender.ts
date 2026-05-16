import { BusinessModule } from '@/types/industries';

export const MODULE_GOVERNMENT_TENDER: BusinessModule = {
    id: 'government_tender',
    name: '政府標案策略師',
    description: '政府採購標案分析、投標文件撰寫、勝率策略規劃',
    categoryId: 'business_dev',
    tagline: '讀懂招標文件，讓每一次投標都有勝算',
    maxDocuments: 10,
    targetUser: '設計公司、顧問公司、IT 廠商、工程承包商、各類接受政府採購的服務業者',
    painPoints: [
        '看不懂政府採購法規與招標文件的專業術語',
        '不知道評審評分的關鍵在哪裡，技術說明書不知從何下手',
        '報價策略失當——要嘛報太高落標，要嘛報太低賠本'
    ],
    corePrompt: `Role: 資深政府採購策略顧問 (Senior Government Procurement Strategist)
    Profile: 你是一位深諳台灣政府採購法規的資深顧問，擁有超過十五年協助各類廠商參與政府標案的實戰經驗。曾輔導超過兩百家企業從零學起，成功拿下衛福部、數位部、各縣市政府的標案。你精通政府電子採購網（eSourcing）的操作、最低標與最有利標的策略差異，以及評審委員的評分心理。
    Focus: 招標文件解讀、投標資格審查、技術說明書優化、競標價格策略，以及每一份標案的勝率最大化。
    台灣法規知識庫: 政府採購法、採購契約要項、投標廠商資格與特殊或巨額採購認定標準、政府採購錯誤行為態樣。
    Reality Check: 主動提示以下風險：(1) 資格文件不完整將直接廢標；(2) 技術說明書未針對評分項目逐條回應，等同放棄得分；(3) 押標金/履約保證金未在期限內繳納；(4) 與採購人員接觸可能觸犯圍標罪。
    Proposal Mindset: 所有建議皆採四段式架構——招標解讀→資格確認→策略規劃→文件撰寫，讓每一次投標都有清晰的行動路線圖。`,
    formConfig: {
        descriptionPlaceholder: '請描述本次標案的背景，或貼上招標公告的核心內容（採購機關、採購標的、預算金額）...',
        timelineLabel: '投標截止日期',
        timelinePlaceholder: '例如：114年5月15日 下午5時前，或距開標還有幾天',
        stylePlaceholder: '例如：最有利標（評分制）/ 最低標 / 限制性招標',
        deliverablesLabel: '預期得標後的交付內容',
        deliverablesPlaceholder: '例如：系統建置報告、教育訓練課程、設計成品、研究報告...',
        customFields: [
            {
                name: 'procurementType',
                label: '採購類型',
                placeholder: '請選擇採購類型...',
                type: 'select',
                options: ['工程採購', '財物採購', '勞務採購（服務類）', '統包採購', '共同供應契約']
            },
            {
                name: 'awardMethod',
                label: '決標方式',
                placeholder: '請選擇決標方式...',
                type: 'select',
                options: ['最低標（價格最低者得標）', '最有利標（綜合評分制）', '固定費用最有利標', '複數決標']
            },
            {
                name: 'budgetAmount',
                label: '採購預算金額',
                placeholder: '例如：新台幣 500 萬元（未稅）',
                type: 'text'
            },
            {
                name: 'qualificationRequirements',
                label: '投標資格要求（關鍵條件）',
                placeholder: '請選擇主要資格條件...',
                type: 'multi-select',
                options: [
                    '公司登記（特定行業別）',
                    '最近三年業績金額達標',
                    '特定專業證照（如甲種勞工安全管理師）',
                    '公司資本額達標',
                    '員工人數達標',
                    'ISO 認證',
                    '無違反採購法紀錄（拒絕往來廠商）',
                    '無欠稅欠費'
                ]
            },
            {
                name: 'scoringCriteria',
                label: '評分標準（最有利標適用）',
                placeholder: '請描述主要評分項目及配分...',
                type: 'textarea'
            },
            {
                name: 'competitorCount',
                label: '預估競標廠商數量',
                placeholder: '請選擇競爭態勢...',
                type: 'select',
                options: ['獨家（限制性招標）', '2-3 家（小競爭）', '4-10 家（中度競爭）', '10 家以上（激烈競爭）', '不確定']
            }
        ]
    },
    aiPrompts: {
        reportGeneration: `你是一位資深政府採購策略師。請根據使用者提供的資訊（或上傳的招標文件），生成一份「標案投標策略分析報告」，採用以下結構：

**第一段 — 痛點共鳴 (Pain Point Resonance)**
精準描述廠商在面對繁雜招標文件時的痛點，如：看不懂評選重點、資格文件怕漏失導致廢標、或報價策略拿捏不準導致白忙一場。

**第二段 — 解決方案 (Solution)**
提供全方位的投標路徑：
1. **文件解讀**：點出標案隱含的關鍵需求與評審偏好。
2. **資格確認**：逐條核對資格要求，並給出補強方案。
3. **技術標建議**：針對評分項目提供差異化撰寫策略。

**第三段 — ROI 與效益分析 (ROI Analysis)**
分析此案的商業價值：除標案預算外，強調拿下此案對「業績實績 (Track Record)」的累積、未來參與同類大型標案的加分效應，以及政府案穩定的現金流特性。

**第四段 — 風險預警 (Risk Warning)**
主動揭露「廢標」地雷（如：押標金錯誤、漏簽名、資格文件過期）與倫理邊界，並提供備選對策（如：若資格不足是否考慮共同投標）。

升級準則：報告採用四段式提案結構（痛點共鳴→解決方案→ROI 分析→風險預警），溝通時主動挑戰不合理需求，報價提供基礎/標準/企業三方案。`,
        customerChat: `你是一位深諳採購法的「標案軍師」。你的溝通風格是：嚴謹、老練，能洞察招標文件背後的「弦外之音」。

關鍵行為準則：
1. 嚴格遵守「廢標防制」：主動檢查用戶是否漏掉關鍵文件（如納稅證明、信用證明）。
2. 當用戶資格勉強時，主動提出「共同投標」或「協力廠商」方案。
3. 鼓勵使用「文件解析器」上傳「招標規範書 (RFP)」或「評選標準表」，以進行更精準的評分權重分析。`,
        quotationSuggestion: `請提供投標報價策略建議：

**保守方案 (Win-at-All-Costs)**：以競爭力價格與高規格技術標爭取勝出，強調長期業績累積。
**標準方案 (Market Grade)**：符合市場行情之報價，重點放在技術標的差異化亮點。
**利潤方案 (Premium)**：在具備獨家專利或特殊規格優勢時，以高價值提案爭取合理利潤。

提醒客戶注意押標金與履約保證金對公司現金流的短期影響。`
    },
    reportTemplate: {
        structure: `# 政府標案投標策略分析報告\n\n## 1. 標案解讀摘要\n- 採購機關：\n- 採購標的：\n- 預算金額：\n- 決標方式：\n\n## 2. 投標資格審查清單\n### ✅ 符合條件\n### ⚠️ 需確認條件\n### ❌ 不符合條件（建議補強方案）\n### 📋 必備文件清單\n\n## 3. 競標策略建議\n- 建議投標金額：\n- 押標金：\n- 履約保證金：\n- 差異化競爭重點：\n\n## 4. 技術說明書撰寫重點\n\n## 5. 時程規劃（倒數計時）\n\n## 6. 風險預警`,
        terminology: {
            '最低標': '價格最低的廠商得標，強調成本競爭力',
            '最有利標': '綜合評分最高者得標，兼顧技術與價格',
            '押標金': '投標時繳納的保證金，棄標則沒收（通常為預算 5%）',
            '履約保證金': '得標後繳納，確保廠商履行合約（通常為決標金額 10%）',
            '廢標': '投標文件不符規定，直接取消投標資格',
            'eSourcing': '政府電子採購網，台灣政府採購的統一平台'
        },
        analysisDimensions: ['資格符合度', '技術說明書品質', '價格競爭力', '履約風險管理']
    },
    contractHighlights: {
        mustHaveClauses: [
            '採購標的物的規格與驗收標準（需與招標規格書完全一致）',
            '分期付款條件與驗收里程碑',
            '遲延履約罰則（通常每日 0.1%，最高 10%）',
            '不可抗力（Force Majeure）條款',
            '著作財產權歸屬（政府採購通常要求全部移轉）'
        ],
        industrySpecificClauses: [
            '採購契約應優先適用政府採購法及其子法',
            '廠商不得轉包（政府採購法第 65 條），分包需事先報備',
            '驗收程序：書面驗收 / 部分驗收 / 初驗與正式驗收',
            '價格調整機制（物價指數連動，適用長期契約）',
            '廠商申訴管道（向主管機關申訴審議委員會提出）'
        ],
        acceptanceCriteria: [
            '所有交付成果符合招標規格書逐條要求',
            '書面驗收報告經採購機關簽核',
            '相關著作權、授權文件完整移交'
        ],
        paymentMilestones: [
            { stage: '得標後簽約', percentage: 0, trigger: '無預付款（政府採購通常不預付）' },
            { stage: '期中驗收', percentage: 50, trigger: '完成 50% 進度並通過期中驗收' },
            { stage: '結案驗收', percentage: 40, trigger: '全部成果通過正式驗收' },
            { stage: '保固期滿', percentage: 10, trigger: '保固期（通常 1 年）屆滿無瑕疵' }
        ]
    },
    quotationConfig: {
        categoryName: '政府標案',
        unit: '式',
        terminology: {
            '客戶': '採購機關（甲方）',
            '我們': '投標廠商（乙方）'
        },
        defaultItems: []
    },
    communicationScripts: {
        opening: '您好，我是您的政府採購策略顧問。投標是一場有規則的競賽——只要我們搞清楚評審要的是什麼，並把自己的優勢精準呈現，勝率就能大幅提升。請告訴我這次標案的詳細資訊，我們一起來制定作戰計畫。',
        discoveryQuestions: [
            '這是哪個機關發出的標案？採購金額和決標方式是什麼？',
            '貴公司過去有沒有承接過類似的政府標案？有哪些相關業績可以作為資格證明？',
            '目前資格文件是否齊備？特別是納稅證明、公司登記、相關業績清冊？',
            '這次最大的競爭對手是誰？你們比他們強在哪裡？'
        ],
        objectionHandling: {
            '我們是第一次投政府標案': '第一次投標最重要的是不能因為文件問題被廢標。我們來逐一確認資格條件和文件清單，確保不在格式上出錯。內容的競爭力我們可以用技術說明書來彌補。',
            '預算太少，感覺很難賺': '政府標案的價值不只是這一次。一旦累積業績，未來投更大案子的資格就有了。而且政府是最穩定的付款方——不會倒帳、不會拖款。讓我們算一下這案子的真實利潤空間。'
        },
        closing: '好的，我已經整理出完整的投標策略方向。接下來最關鍵的三件事是：第一，確認所有資格文件的效期；第二，開始撰寫技術說明書；第三，在截止日期前三天完成所有文件的確認。我們一起把這個標案拿下來！'
    },
    taskConfig: {
        typicalTasks: [
            { name: '招標文件全文解讀與重點摘要', type: 'internal', duration: '1-2 天', assignee: '標案策略師' },
            { name: '投標資格審查與文件盤點', type: 'internal', duration: '1 天', assignee: '行政/法務' },
            { name: '競標策略規劃與底價估算', type: 'internal', duration: '1 天', assignee: '主管/財務' },
            { name: '技術說明書撰寫（第一版）', type: 'internal', duration: '3-5 天', assignee: '技術撰寫者' },
            { name: '技術說明書內部審閱與修改', type: 'internal', duration: '1-2 天', assignee: '主管審核' },
            { name: '報價表填寫與最終確認', type: 'internal', duration: '1 天', assignee: '財務' },
            { name: '投標文件裝訂、蓋章、密封', type: 'internal', duration: '0.5 天', assignee: '行政' },
            { name: '於截止時間前完成投遞（電子或實體）', type: 'external', duration: '當天', assignee: '行政' }
        ],
        milestones: [
            { label: '招標文件解讀完成', order: 1 },
            { label: '資格確認 & 文件備妥', order: 2 },
            { label: '技術說明書定稿', order: 3 },
            { label: '投標完成', order: 4 },
            { label: '開標（候通知）', order: 5 }
        ],
        workflow: {
            diagram: 'graph LR\n  A[取得招標文件] --> B[解讀評分標準]\n  B --> C[資格審查]\n  C --> D[撰寫技術標]\n  D --> E[確認價格標]\n  E --> F[投標]',
            description: '政府標案的成敗在細節：資格文件一個都不能少，技術說明書每一條評分項目都要正面回應。'
        }
    },
    defaultItems: [
        { description: '招標文件解讀與策略規劃', quantity: 1, unitPrice: 15000 },
        { description: '技術說明書撰寫與優化', quantity: 1, unitPrice: 30000 },
        { description: '投標文件整備與合規審查', quantity: 1, unitPrice: 10000 },
        { description: '開標陪同與後續諮詢', quantity: 1, unitPrice: 8000 },
    ],
    projectTypes: [
        { id: 'tender_it', label: '💻 資訊系統採購', description: 'IT 系統建置、軟體開發、數位轉型' },
        { id: 'tender_service', label: '📋 勞務服務採購', description: '顧問服務、訓練課程、研究報告' },
        { id: 'tender_design', label: '🎨 創意設計採購', description: '品牌設計、影片製作、活動規劃' },
        { id: 'tender_construction', label: '🏗️ 工程採購', description: '建設工程、設備安裝、空間改造' },
    ],
};
