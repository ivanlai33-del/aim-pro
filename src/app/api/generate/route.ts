import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { BUSINESS_MODULES } from '@/config/industries';

// --- Industry System Prompts (MOVED FROM FRONTEND TO BACKEND FOR SECURITY) ---
const INDUSTRY_PROMPTS: Record<string, string> = {
    web: `
# Role: 資深技術顧問與架構師 (Senior Technical Consultant)
## Profile
你是一位擁有 10 年以上經驗的軟體架構師，精通現代化 Web 開發 (React, Next.js)、雲端架構 (AWS/GCP) 與系統整合。你的報價風格精準、條理分明，能將複雜的技術需求拆解為具體的開發項目。
`,
    graphic: `
# Role: 創意設計總監 (Creative Director)
## Profile
你是一位獲獎無數的平面設計師，擅長品牌識別 (CIS)、視覺傳達與印刷工藝。你對色彩敏銳，並能精準建議紙材與後加工方式。
`,
    video: `
# Role: 影視製作人與導演 (Video Producer)
## Profile
你是一位資深的影像製作人，熟悉從腳本發想、拍攝執行到後期剪輯的完整流程。你擅長控管預算，能在有限資源下拍出高質感的商業影片。
`,
    renovation: `
# Role: 室內設計師與工務經理 (Interior Designer)
## Profile
你是一位專業的室內設計師，熟悉工程法規、建材特性與工班調度。你的報價單必須精確到工種與坪數，讓客戶感到專業與安心。
`,
    marketing: `
# Role: 社群行銷總監 (Social Media Director)
## Profile
你是一位數據驅動的行銷專家，擅長內容策略、社群經營與口碑行銷。你的報價重點在於「產出量」與「預期效益」。
`,
    ads: `
# Role: 資深廣告投手 (Ads Optimizer)
## Profile
你是一位精通 Meta Ads (FB/IG) 與 Google Ads 的廣告優化師。你重視 ROAS (廣告投資報酬率) 與精準受眾鎖定。報價通常包含「代操服務費」與「建議廣告預算」。
`,
    seo: `
# Role: SEO 搜尋引擎優化專家 (SEO Specialist)
## Profile
你是一位專注於技術 SEO 與內容行銷的專家。你的目標是提升網站的自然流量與關鍵字排名。報價包含「技術檢測」、「關鍵字佈局」與「內容產出」。
`,
    event: `
# Role: 活動統籌與策展人 (Event Planner)
## Profile
你是一位經驗豐富的活動統籌，無論是婚禮、尾牙還是研討會，你都能完美掌控流程與現場氛圍。報價涵蓋「企劃」、「硬體」、「人力」與「場地」。
`,
    exhibition: `
# Role: 展場設計師 (Exhibition Designer)
## Profile
你是一位熟悉世貿、南港展覽館等大型場館的展場設計師。你擅長空間規劃、動線設計與材質運用，並能精準估算進撤場的施工成本。
`,
    discord: `
# Role: Discord 社群架構師 (Community Architect)
## Profile
你是一位專精於 Discord 伺服器建置與自動化的專家。你熟悉各類 Bot (身份組、音樂、防護) 的設定，並能結合 Midjourney 等 AI 工具產出高品質的社群素材。
`
};

const DEFAULT_OUTPUT_FORMAT = `
## Output Format
**⚠️ 重要格式規範 (Strict Formatting Rules)**：
1.  **表格必須換行**：Markdown 表格的每一列 (Row) **必須** 獨立一行。
2.  **完整分隔線**：表格標題與內容之間必須有 \`| --- |\` 分隔線。
3.  **語言**：請使用繁體中文 (Traditional Chinese, Taiwan) 撰寫。

### 💎 [專案名稱] 專案報價 (Project Quotation)
請提供一份詳細的專案報價表，這份表格將被系統自動讀取：

| 項目名稱 | 規格說明 | 數量 | 單價 (TWD) | 總價 (TWD) |
| :--- | :--- | :--- | :--- | :--- |
| **1. [模組名稱]** | [詳細技術規格] | 1 | $[金額] | $[金額] |
| **總計費用** | **(未稅)** | | | **$[總金額]** |

### 🛠️ 執行任務拆解與建議 (Execution Breakdown)
請根據報價項目，建議如何分派執行任務。這部分將用於內部的分帳與人力控管：

| 任務名稱 | 建議資源類型 | 分帳模式 | 建議金額/比例 | 備註 |
| :--- | :--- | :--- | :--- | :--- |
| **範例任務** | [內部/外包發票/勞報單] | [固定/比例/單位] | [如：40% 或 30000] | [建議理由] |

**⚠️ 分帳模式建議規範**：
- **固定 (fixed)**：總額承包。
- **比例 (percentage)**：與報價連動的抽成（請給予 0-100 的數字）。
- **單位 (unit)**：論件計酬（請給予單價）。
`;

// POST request handler for AI generation
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { mode, userApiKey, turnstileToken, ...params } = body;

        // --- NEW: Bot Protection (Turnstile) ---
        // Verify Turnstile token if no custom API key is used
        if (!userApiKey) {
            const secretKey = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA'; // Testing secret key
            
            if (!turnstileToken) {
                return NextResponse.json({ error: 'Security verification failed (Missing token)' }, { status: 403 });
            }

            const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `secret=${secretKey}&response=${turnstileToken}`,
            });

            const verifyData = await verifyResponse.json();
            if (!verifyData.success) {
                return NextResponse.json({ error: 'Security verification failed (Invalid token)' }, { status: 403 });
            }
        }

        // Use custom key if provided, otherwise use system key from env
        const apiKey = userApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'API key is missing. Please provide a custom API key or ensure system API key is configured.' },
                { status: 401 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        let systemPrompt = "";
        let userPrompt = "";

        // --- NEW: Quota Check Logic (Anti-Free-rider) ---
        // If user provides their OWN API key, we don't deduct our system quota
        if (!userApiKey) {
            const supabase = createSupabaseServerClient();
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                return NextResponse.json({ error: 'Please login to use system AI credits.' }, { status: 401 });
            }

            const { data: profile, error: profileError } = await supabase
                .from('users_profile')
                .select('ai_quota, tier')
                .eq('id', user.id)
                .single();

            if (profileError || !profile || profile.ai_quota <= 0) {
                return NextResponse.json({ 
                    error: 'AI 點數不足 (Insufficient AI credits)',
                    isQuotaError: true 
                }, { status: 403 });
            }

            // Deduct 1 credit before/after (let's do after to be fair)
        }

        // --- Mode Switching Logic ---
        if (mode === 'report') {
            const { projectData, customPrompts } = params;
            
            // Find matching module
            const matchedModule = Object.values(BUSINESS_MODULES).find(module =>
                module.projectTypes?.some(pt => pt.id === projectData.projectType)
            );

            // Mapping logic (MOVED FROM FRONTEND)
            const getIndustryId = (t: string) => {
                if (['web', 'landing', 'app'].includes(t)) return 'web';
                if (['branding', 'print', 'packaging'].includes(t)) return 'graphic';
                if (['video_prod', 'animation', 'shorts'].includes(t)) return 'video';
                if (['home', 'commercial', 'office'].includes(t)) return 'renovation';
                if (['social', 'content'].includes(t)) return 'marketing';
                if (['ads_meta', 'ads_google'].includes(t)) return 'ads';
                if (['seo_audit', 'content_strategy'].includes(t)) return 'seo';
                if (['wedding', 'corporate', 'party'].includes(t)) return 'event';
                if (['expo', 'special'].includes(t)) return 'exhibition';
                if (['dc_setup', 'dc_art', 'dc_motion'].includes(t)) return 'discord';
                return 'web';
            };

            const industryId = getIndustryId(projectData.projectType);
            systemPrompt = matchedModule 
                ? `${matchedModule.corePrompt}\n\n${DEFAULT_OUTPUT_FORMAT}`
                : `${INDUSTRY_PROMPTS[industryId]}\n\n${DEFAULT_OUTPUT_FORMAT}`;

            // Handle custom prompts override
            const moduleKey = matchedModule ? matchedModule.id : industryId;
            if (customPrompts && customPrompts[moduleKey]) {
                systemPrompt = customPrompts[moduleKey];
            }

            // Construct User Prompt
            let customFieldsContext = '';
            if (matchedModule?.formConfig?.customFields) {
                customFieldsContext = matchedModule.formConfig.customFields
                    .map(field => {
                        const val = projectData[field.name];
                        if (!val || (Array.isArray(val) && val.length === 0)) return null;
                        const displayVal = Array.isArray(val) ? val.join(', ') : val;
                        return `${field.label}: ${displayVal}`;
                    })
                    .filter(Boolean)
                    .join('\n         ');
            }

            userPrompt = `
         請針對以下專案需求撰寫估價單與規劃報告：
         專案名稱：${projectData.projectName}
         專案描述：${projectData.description}
         ${customFieldsContext ? `補充細節規格：\n         ${customFieldsContext}` : ''}
         製作項目與規格：${projectData.features}
         風格偏好：${projectData.optimizationGoals || '無特殊需求'}
         預算範圍：${projectData.budget || '未定'}
         時程：${projectData.timeline || '未定'}
         客戶產業/類型：${projectData.clientCompany || '未知'}

         請務必依照 System Prompt 中的 Output Format 格式輸出。
         (Language: Traditional Chinese, Taiwan)
         `;

        } else if (mode === 'chat') {
            const { chatMode, projectContext, reportContext, chatContext, userMessage, isDesign } = params;
            
            const modePrompts: any = {
                simple: "請生成一段【極度簡潔、節奏明快】的回覆，字數控制在 30-50 字以內。",
                medium: "請生成一段「標準、親切」的回覆，約 100-200 字。",
                detailed: "請生成一段「完整、詳細且具備說服力」的回覆，必須引用評估報告中的數據與技術細節。",
                followup: "請生成一段「主動追問、姿態放軟但有目的性」的回覆，約 50-100 字。",
                payment: "請生成一段「正式、堅定且有禮貌的催款通知」，約 100-150 字。"
            };

            systemPrompt = `
# Role: ${isDesign ? '創意總監' : '專業專案經理與技術顧問'}
你需要根據【專案背景】、【評估報告內容】以及【對話歷史】，撰寫一篇得體的回信。

## Context
1. **專案背景**：${projectContext}
2. **評估報告重點**：${reportContext.substring(0, 3000)}...
3. **對話歷史**：${chatContext}

## Task
客戶傳來了新的訊息："${userMessage}"
請依照模式【${modePrompts[chatMode]}】撰寫回覆。
請直接以「我（專案負責人）」的角度撰寫。
`;
            userPrompt = userMessage;

        } else if (mode === 'translate') {
            const { content, targetLanguage, context } = params;
            systemPrompt = `
# Role: 國際商務翻譯與跨國貿易顧問 (International Business Translation Expert)
你的任務是將提供的商務文件（報價單、合約、計畫書）翻譯成【${targetLanguage}】。

## ⚠️ 關鍵指令 (Critical Instructions)：
1. **專業術語轉換 (Professional Jargon)**：不要直譯。請使用目標語言在該行業（如軟體開發、廣告設計、建築工程）中的「專業標準術語」。
   - 例如：中文「改稿」應根據語境轉譯為 "Revision" 或 "Change Order"；「報價單」轉譯為 "Quotation" 或 "Estimate"。
2. **格式標準化 (Standard Formatting)**：
   - **地址 (Address)**：若內容包含台灣地址，請自動轉換為國際通用的英文倒敘格式。
   - **公司名稱 (Company Name)**：自動加上該語言通用的法律身分標記（如 Co., Ltd. / Inc. / G.K.）。
   - **金額 (Currency)**：除非特別指定，否則保留原幣別符號，但標註國際代碼 (如 TWD)。
3. **保持 Markdown 結構**：嚴格保留原始文件的所有表格、標題、粗體等 Markdown 語法。
4. **上下文意識 (Context Awareness)**：參考背景資訊進行更精準的在地化處理。背景：${context || '無'}

請直接輸出翻譯後的完整內容。
`;
            userPrompt = content;
        } else if (mode === 'refine') {
            const { currentContent, additionalNotes } = params;
            systemPrompt = `
# Role: 專業商業文件校閱與優化專家
你的任務是潤飾既有的報告內容，使其條理更清晰、邏輯更嚴密。
1. 優化邏輯條理
2. 整合額外資訊：${additionalNotes || '無'}
3. 校對並修正數據計算：檢查 Markdown 表格中所有的「數量 * 單價 = 總價」。
`;
            userPrompt = currentContent;
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction: systemPrompt
        });

        const result = await model.generateContent(userPrompt);
        const text = result.response.text();

        // --- NEW: Consume Quota ---
        if (!userApiKey) {
            const supabase = createSupabaseServerClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.rpc('decrement_ai_quota', { user_id: user.id });
            }
        }

        return NextResponse.json({ content: text });
    } catch (error: any) {
        console.error("AI Generation API Error:", error);
        return NextResponse.json(
            { error: error.message || 'An unexpected error occurred during AI generation' },
            { status: 500 }
        );
    }
}
