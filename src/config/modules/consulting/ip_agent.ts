import { BusinessModule } from '@/types/industries';

export const MODULE_IP_AGENT: BusinessModule = {
    id: 'ip_agent',
    name: '商標與智財代理',
    description: '商標查詢、專利申請諮詢、著作權聲明代理、IP 授權合約諮詢',
    categoryId: 'pro_service',
    tagline: '保護您的無形資產，讓專業價值有法律保障',
    targetUser: '商標代理人、法律顧問、智財專家',
    painPoints: ['客戶對規費與服務費分不清', '不知道如何選擇申請類別', '商標已被註冊導致做白工'],
    corePrompt: `Role: 資深商標代理人與智慧財產權顧問
    Profile: 你精通各國商標法、專利法與著作權規範。你的專業涵蓋前置查詢 (Search)、類別區分、申請程序控管與侵權風險評估。
    Focus: 法律嚴謹性、資產保護範圍、申請成功率與時效控管。
    Task: 請提供專業的智財代理提案，包含申請流程拆解、市場風險分析與規費預算建議。`,
    formConfig: {
        descriptionPlaceholder: "請詳細描述欲申請的品牌名稱、圖樣、發明內容或創作性質...",
        styleLabel: "智財保護需求與範圍 (IP Scope)",
        stylePlaceholder: "例如：\n• 核心需求：申請台灣與日本商標、合約審閱以確保版權不外流\n• 品牌計畫：正在籌備電商網站，需預先保護品牌字樣與 LOGO\n• 修改需求：針對既有商標進行增項申請",
        timelineLabel: "預計提交申請日期",
        timelinePlaceholder: "例如：兩週內完成初步查名並送件",
        deliverablesLabel: "服務交付成果",
        deliverablesPlaceholder: "例如：商標查名報告、官方受理通知書、核准證書、合約審閱意見...",
        customFields: [
            { name: "applicationRegion", label: "預計申請地區", placeholder: "請選擇地區 (可複選)...", type: "multi-select", options: ['台灣 (TIPO)', '大中華區 (CN/HK/MO)', '日本 (JPO)', '美國 (USPTO)', '歐洲 (EUIPO)', '東南亞各國'] },
            { name: "applicationType", label: "申請權利類型", placeholder: "請選擇項目...", type: "select", options: ['商標申請 (Trademark)', '新型/設計專利 (Patent)', '著作權聲明 (Copyright)', 'IP 授權合約規劃', '侵權抗辯諮詢'] },
            { name: "searchDepth", label: "前置查名深度", placeholder: "請選擇...", type: "select", options: ['簡易核名 (僅查同名)', '深度檢索 (含類似音/圖樣)', '全球競爭對手監測', '不需查名'] },
            { name: "classCount", label: "申請類別數量 (Class)", placeholder: "例如：第 35 類, 第 43 類", type: "text" },
            { name: "urgency", label: "案件急迫性", placeholder: "請選擇狀態...", type: "select", options: ['一般件 (按正常程序)', '急件處理 (兩日內送件)', '急需侵權應對諮詢'] }
        ]
    },
    aiPrompts: {
        reportGeneration: `你是一位嚴謹的智財法律顧問。請根據客戶提供的品牌名稱與業務範圍，產出一份商標前置查名(Search)與風險評估報告。內容需包含：欲申請名稱的識別性強度、在各指定類別中是否已有近似商標、潛在的核駁風險評估，以及建議的註冊策略(如：文字與圖樣分開申請)。`,
        customerChat: `你是一位講求精確與風險控管的商標代理人。面對客戶抱怨「為什麼查名還要收費，別家都免費」時，需以專業角度說明「免費查名通常只查完全同名，而我們提供的是包含近似音、近似圖樣與法理分析的深度檢索」，強調這是為了避免申請失敗而損失官方規費與半年等待期的保險。`,
        quotationSuggestion: `請提供智財申請報價建議。必須極度清晰地區分「事務所服務費(代辦費)」與「官方規費(代收代付，如智財局收費)」。並提醒客戶，若案件遭官方核駁需要撰寫答辯理由書，將產生額外的處理費用。`
    },
    reportTemplate: {
        structure: `# 商標檢索與註冊策略風險評估報告\n\n## 1. 檢索標的與指定商品/服務範圍\n- 擬註冊名稱/圖樣：\n- 涵蓋業務類別 (尼斯分類)：\n\n## 2. 識別性評估 (Distinctiveness)\n- 屬性分析 (如：描述性、暗示性、隨意性)\n\n## 3. 近似商標前案檢索結果 (Prior Rights Search)\n- 高風險前案 (Highly Similar)：\n- 中風險前案 (Moderately Similar)：\n\n## 4. 註冊成功率評估與潛在核駁風險\n\n## 5. 建議申請策略與後續行動計畫`,
        terminology: {
            '尼斯分類 (Nice Classification)': '國際通用的商品與服務分類表，共 45 類。申請商標必須指定保護在哪個類別，跨類申請需繳交額外規費',
            '識別性 (Distinctiveness)': '商標能讓消費者區別不同商品/服務來源的特徵。若名稱太過通用(如「好喝奶茶」)，將因不具識別性而遭核駁',
            '核駁 (Rejection)': '官方審查委員認為申請的商標不符規定，拒絕給予註冊的處分'
        },
        analysisDimensions: ['商標先天識別性', '前案衝突風險度', '跨國佈局可行性', '品牌未來延展性']
    },
    contractHighlights: {
        mustHaveClauses: ['官方審查結果免責（商標/專利之核准與否，最終裁量權在於各國官方智慧財產局。乙方保證提供專業評估與代辦，但不保證必然核准註冊）', '規費代收代付條款（官方規費屬代收代付性質，一經向官方送件繳納，無論案件後續核准或撤回，官方皆不予退費，乙方亦不退還此部分款項）', '時效與送件責任（乙方承諾於收齊文件及款項後 X 個工作日內完成官方送件，以確保甲方之申請日優勢（先申請主義））'],
        industrySpecificClauses: ['核駁答辯另計費聲明（若案件遭官方下發核駁先行通知書，乙方將提供初步分析，但後續撰寫與提交「答辯理由書」之服務需另行報價收費）', '領證費用後收機制（部分國家(如台灣)商標採兩階段收費，核准後需另行繳納「註冊費」方能領取證書，此階段將另行請款）'],
        acceptanceCriteria: ['取得官方下發之收文收據/申請案號', '轉交官方核發之商標/專利註冊證書正本'],
        paymentMilestones: [
            { stage: '查名/評估費', percentage: 100, trigger: '簽署委託，進行深度檢索前全額支付' },
            { stage: '申請送件款', percentage: 100, trigger: '確認送件前，支付服務費及第一階段官方申請規費' },
            { stage: '領證尾款', percentage: 100, trigger: '官方核准後，支付第二階段註冊規費與領證服務費' }
        ]
    },
    quotationConfig: {
        categoryName: '智慧財產權代理',
        unit: '件/類',
        terminology: { '客戶': '申請人', '我們': '代理事務所' },
        defaultItems: []
    },
    communicationScripts: {
        opening: "您好，我是商標代理人。一個好的品牌就像是您辛苦養大的孩子，而商標註冊就是幫這個孩子報戶口。請問您這個品牌目前有預計要發展到國外市場，還是先以台灣本土為主？這會影響我們申請的策略。",
        discoveryQuestions: ['這個商標未來會用在哪些具體的產品或服務上？（例如：只是開咖啡廳，還是未來會出濾掛包、甚至賣馬克杯周邊？）', '您的商標是純文字，還是包含特殊設計的圖案 (LOGO)？', '目前這個品牌是否已經在市場上公開使用或宣傳了？（這牽涉到是否已有他人搶註的急迫性）'],
        objectionHandling: {
            '自己上網申請只要三千多塊，為什麼找你們要快一萬？': '您付出的官方規費確實是三千多，但商標審查就像打官司，重點不是「填表送件」，而是「策略與防禦」。我們幫您避開已被註冊的雷區、精準選擇保護類別，如果被審查委員刁難，我們知道怎麼引經據典寫答辯書。省幾千塊代辦費，如果換來半年後被核駁，您的招牌跟包裝可能都要重做，那個損失是幾十萬。',
            '你們能保證 100% 申請通過嗎？': '任何跟您保證 100% 通過的代理人都是不誠實的。因為商標審查是由「人(審查委員)」進行的主觀判斷，且系統中永遠有這半年內剛送件、我們查不到的「盲期」案件。我們能保證的是，透過深度檢索，把失敗風險降到最低(例如排除 90% 的已知死胡同)。'
        },
        closing: "了解您的品牌願景了！為了保護您的心血，我們第一步需要進行『商標深度查名』，確認這個名字在法律上是乾淨、安全且可註冊的。"
    },
    taskConfig: {
        typicalTasks: [
            { name: '需求訪談與商品/服務類別確認', type: 'internal', duration: '1 天', assignee: 'IP Agent' },
            { name: '商標前案檢索與風險評估報告', type: 'internal', duration: '3-5 天', assignee: 'IP Researcher' },
            { name: '申請策略確認與委任書簽署', type: 'external', duration: '2 天', assignee: 'IP Agent & Client' },
            { name: '官方系統電子送件與繳費', type: 'internal', duration: '1 天', assignee: 'Paralegal' },
            { name: '官方審查期監控 (約 5-8 個月)', type: 'internal', duration: '半年以上', assignee: 'System Tracking' },
            { name: '官方公文轉達 (如核准或核駁通知)', type: 'internal', duration: '依官方時程', assignee: 'Paralegal' },
            { name: '核准後繳納註冊費與領取證書', type: 'internal', duration: '1 週', assignee: 'Paralegal' }
        ],
        milestones: [
            { label: '查名報告完成與策略定案', order: 1 },
            { label: '取得官方申請案號 (送件完成)', order: 2 },
            { label: '通過官方審核取得核准通知', order: 3 },
            { label: '領取商標/專利註冊證書正本', order: 4 }
        ],
        workflow: {
            diagram: "graph TD\\n  A[需求確認與查名] --> B[風險評估與策略建議]\\n  B --> C[簽署委任與官方送件]\\n  C --> D[漫長的官方實體審查期]\\n  D --> E{官方決定: 核准或核駁}\\n  E -->|核駁| F[撰寫答辯理由書]\\n  E -->|核准| G[繳交註冊費與領證]",
            description: "智財申請是高度依賴官方行政流程的專案，代理人的價值在於前置的排雷與中後期的危機處理(答辯)。"
        }
    },
    defaultItems: [
        { description: '商標/專利查名與風險評估報告 (Search Report)', quantity: 1, unitPrice: 3500 },
        { description: '官方申請服務費 (1 類/每件) (Service Fee)', quantity: 1, unitPrice: 5000 },
        { description: '各國官方規費 (代收代付) (Official Fees)', quantity: 1, unitPrice: 3000 },
        { description: '智慧財產權授權合約審閱 (Contract Review)', quantity: 1, unitPrice: 8000 },
    ],
    projectTypes: [
        { id: 'brand_protection', label: '🛡️ 品牌防護 (Brand Protection)', description: '商標與品牌權利申請' },
        { id: 'creative_copyright', label: '🎨 創意保護 (Copyright)', description: '著作權與藝術創作授權' },
        { id: 'global_ip_strategy', label: '🌍 國際智財佈局 (Global IP)', description: '跨國權利保護計畫' },
    ],
};
