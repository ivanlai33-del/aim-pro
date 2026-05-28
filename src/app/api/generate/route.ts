import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

// --- CONFIGURATION ---
const DEFAULT_MODEL = "gemini-3.1-flash-lite";
const API_VERSION = "v1beta";

// System instructions and prompts
const INDUSTRY_PROMPTS: Record<string, string> = {
    "web": "你是一位資深網站開發專案經理，擅長精確估算開發工時、技術架構與外包分帳...",
    "graphic": "你是一位資深平面設計總監，擅長品牌視覺規劃、印刷發包與設計費率估算...",
    "interior": "你是一位室內裝修監工經理，擅長工程進度安排、材料詢價與師傅工錢分帳...",
    "video": "你是一位資深影視製作製片經理與 NVIDIA AI 多模態視覺總監，擅長拍攝時程規劃、器材租賃、組員勞報分配，並精通運用 NVIDIA NIM 進行多模態毛片快篩、Whisper 字幕對時與 NeMo 競品短影音鉤子 (Hook) 解構分析...",
    "marketing": "你是一位數位行銷策略顧問與 AI 趨勢分析師，擅長投放預算分配、內容創作成本與轉單率評估，並善用多模態 AI 進行競品短影音成效解構...",
    "app": "你是一位行動應用產品經理，擅長雙平台開發規範、API 整合與後續維護估預算...",
    "event": "你是一位專業活動策展經理，擅長場地佈置、硬體租借與工作人員薪資調度...",
    "consulting": "你是一位專業商務諮詢經理，擅長策略分析、研究報告成本與專業顧問費率估算...",
    "ecommerce": "你是一位電商運營經理，擅長商品採購規劃、倉儲物流成本與行銷損益評估...",
    "software": "你是一位資深軟體架構師，擅長 SaaS 開發模型、雲端基礎建設費用與開發週期評估..."
};

const DEFAULT_OUTPUT_FORMAT = `
### 💰 專案預估總額 (Total Estimated Budget)
請給出一個範圍與建議報價。

### 📅 執行時程規劃 (Execution Timeline)
分階段說明預計工作天數。

### 🎥 NVIDIA AI 影音多模態視覺洞察與工時精算 (Multimodal Video Insights)
若為影音製作、社群行銷或空間巡檢相關專案，請針對毛片檢索效率、前 3 秒鉤子吸睛度 (Hook Score)、場景切換頻率 (SCD) 及 Milvus 向量庫配置提供專業洞察與微服務算力估算。

### 📝 詳細任務拆解與報價建議 (Task Breakdown & Pricing)
請務必使用 Markdown 表格輸出：
| 任務名稱 | 費用歸屬 | 分帳模式 | 預計金額/比例 | 建議理由 |
| :--- | :--- | :--- | :--- | :--- |
| **範例任務** | [內部/外包發票/勞報單] | [固定/比例/單位] | [如：40% 或 30000] | [建議理由] |

- **單位 (unit)**：論件計酬（請給予單價）。

### 📊 視覺化流程與架構 (Visual Diagrams)
**⚠️ 專業經理人指示**：當需要解釋複雜流程、專案時程、系統架構或邏輯判斷時，請**自動調度** Mermaid 語法繪製圖表（如 graph TD, gantt, pie 等）。
\`\`\`mermaid
graph TD
    A[範例起點] --> B{是否需要圖表?}
    B -- 是 --> C[使用 Mermaid 繪製]
    B -- 否 --> D[保持文字說明]
\`\`\`
`;

// POST request handler
export async function POST(req: NextRequest) {
    let apiKey = '';
    let source = '';
    
    try {
        const supabase = createSupabaseServerClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: '未授權存取，請先登入' }, { status: 401 });
        }

        // Deduct AI Quota on the server
        const { data: hasQuota, error: quotaError } = await supabase.rpc('decrement_ai_quota', {
            user_id: session.user.id
        });

        if (quotaError || hasQuota === false) {
            return NextResponse.json({ error: 'AI 額度不足，請升級方案' }, { status: 403 });
        }

        const body = await req.json();
        const { mode, userApiKey, turnstileToken, ...params } = body;

        // Use custom key if provided, otherwise use system key from env
        const rawKey = userApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
        apiKey = rawKey.trim();
        source = userApiKey ? 'User Provided' : 'System Default';

        // --- Turnstile Token Verification (Optional for testing) ---
        if (!userApiKey && turnstileToken) {
            const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
            const verifyRes = await fetch(verifyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    secret: process.env.TURNSTILE_SECRET_KEY,
                    response: turnstileToken
                })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
                console.log("[SECURITY] Turnstile verification passed.");
            }
        }

        let systemPrompt = '';
        let userPrompt = '';

        // Helper to extract URLs from text
        const extractUrls = (text: string): string[] => {
            if (!text) return [];
            const urlRegex = /(https?:\/\/[^\s)]+)/g;
            const matches = text.match(urlRegex);
            return matches ? Array.from(new Set(matches)) : [];
        };

        if (mode === 'report') {
            const { projectData, customPrompts } = params;
            const industry = projectData.category || 'web';
            const basePrompt = customPrompts?.[industry] || INDUSTRY_PROMPTS[industry] || INDUSTRY_PROMPTS.web;
            
            // --- 整合 Scrapling 全域背景情報抓取 (掃描所有欄位網址) ---
            let scraplingContext = '';
            const allTextToScan = `${projectData.websiteUrl || ''} ${projectData.description || ''} ${projectData.features || ''} ${projectData.optimizationGoals || ''} ${projectData.styleReferences || ''} ${JSON.stringify(projectData)}`;
            const foundUrls = extractUrls(allTextToScan);

            if (foundUrls.length > 0 && !projectData.websiteContent) {
                try {
                    const { fetchWithScrapling } = await import('@/lib/scraplingClient');
                    // 抓取第一個找到的網址 (或主要 websiteUrl)
                    const targetUrl = projectData.websiteUrl || foundUrls[0];
                    const scrapeRes = await fetchWithScrapling({ url: targetUrl, mode: 'stealth' });
                    if (scrapeRes.success && scrapeRes.content) {
                        scraplingContext = `\n\n### 🕷️ Scrapling 提取外部動態網頁情報 (Ground Truth)\n目標網址：${targetUrl}\n${scrapeRes.content}`;
                    }
                } catch (err) {
                    console.warn('[Scrapling API Route] 抓取失敗:', err);
                }
            } else if (projectData.websiteContent) {
                scraplingContext = `\n\n### 🕷️ Scrapling 提取外部動態網頁情報 (Ground Truth)\n${projectData.websiteContent}`;
            }

            systemPrompt = `
# Role: ${basePrompt}
你的任務是根據使用者提供的專案需求，產出一份極具專業度的「專案執行建議與報價預估報告」。

## 輸出要求：
1. 必須包含預算範圍、時程規劃與任務分帳拆解。
2. 針對產業特性提供具體的專業建議。
3. 保持語氣專業、客觀且具有公信力。
${DEFAULT_OUTPUT_FORMAT}
`;
            userPrompt = `專案名稱：${projectData.name || projectData.projectName}\n專案描述：${projectData.description}\n目標預算：${projectData.budget || '未提供'}${scraplingContext}`;
        } else if (mode === 'chat') {
            const { chatMode, projectContext, reportContext, chatContext, userMessage, isDesign } = params;
            
            // --- 整合 Scrapling 聊天訊息即時網址抓取 ---
            let scraplingChatContext = '';
            const chatUrls = extractUrls(userMessage);
            if (chatUrls.length > 0) {
                try {
                    const { fetchWithScrapling } = await import('@/lib/scraplingClient');
                    const scrapeRes = await fetchWithScrapling({ url: chatUrls[0], mode: 'stealth' });
                    if (scrapeRes.success && scrapeRes.content) {
                        scraplingChatContext = `\n\n### 🕷️ Scrapling 即時查網情報 (Ground Truth)\n使用者提供的網址：${chatUrls[0]}\n網頁擷取內容：\n${scrapeRes.content}`;
                    }
                } catch (err) {
                    console.warn('[Scrapling Chat Route] 抓取失敗:', err);
                }
            }

            const roleTitle = isDesign ? "資深設計總監與品牌策略顧問" : "資深技術專案經理與系統架構師";
            systemPrompt = `
# Role: ${roleTitle}
你的任務是作為 AGI 導航中樞的智能店長與專業顧問，針對使用者的提問給出極具深度、客觀且具備商業公信力的建議。

## 參考背景資訊：
- **專案背景**：${projectContext || '無'}
- **當前報價與建議書**：${reportContext || '無'}
- **歷史對話紀錄**：${chatContext || '無'}

## 對話準則：
1. **直接回應痛點**：針對使用者的提問給出具體的解決方案或議價策略。
2. **數據與情報驅動**：若使用者提供外部網址，請務必基於 Scrapling 抓取的即時情報進行客觀分析。
3. **保持語氣溫暖且專業**：展現職人精神與顧問權威。
`;
            userPrompt = `使用者最新提問：\n${userMessage}${scraplingChatContext}`;
        } else if (mode === 'refine') {
            const { currentContent, additionalNotes } = params;
            systemPrompt = `
# Role: 專業商業文件校閱與優化專家
你的任務是根據使用者的「註解或指示」，對既有的報告內容進行【局部精確潤飾】或【功能擴充】。

## 任務指令：
1. **精準修改**：若使用者要求「刪除某條目」、「修改數據」或「新增內容」，請準確執行，並保持其餘無關部分的穩定性。
2. **工具調度**：若使用者指示「畫個圖」、「視覺化」或「用圖表表示」，請立即調度 Mermaid 語法繪製合適的流程圖、甘特圖或架構圖。
3. **邏輯整合**：整合使用者提供的額外注意事項：${additionalNotes || '無'}
4. **數據校正**：自動檢查並修正所有 Markdown 表格中的計算錯誤（數量 * 單價 = 總價）。

請輸出完整更新後的報告內容。
`;
            userPrompt = currentContent;
        } else if (mode === 'partial_refine') {
            const { selectedText, instruction } = params;
            systemPrompt = `
# Role: 專業商業文件精確修補專家
你的任務是針對使用者選取的【局部內容】進行精確的修改。

## 任務指令：
1. **僅輸出替換內容**：不要輸出任何解釋、開場白或結尾。僅輸出修改後的這段內容。
2. **遵守指令**：嚴格執行使用者的修改要求：${instruction}
3. **保持語境**：確保修改後的內容能完美嵌入原始報告中，保持語氣與專業度一致。
4. **格式不變**：除非指令要求，否則請保留原本的 Markdown 語法（如表格、粗體）。

請直接輸出修改後的局部內容。
`;
            userPrompt = `原始內容：\n${selectedText}`;
        }

        // --- FETCHING FROM GOOGLE ---
        const genAI = new GoogleGenerativeAI(apiKey);
        const modelObj = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

        const fullPrompt = systemPrompt + "\n\n" + userPrompt;

        try {
            const resultStream = await modelObj.generateContentStream(fullPrompt);
            
            // Create a ReadableStream to stream the response back
            const stream = new ReadableStream({
                async start(controller) {
                    try {
                        for await (const chunk of resultStream.stream) {
                            const chunkText = chunk.text();
                            if (chunkText) {
                                controller.enqueue(new TextEncoder().encode(chunkText));
                            }
                        }
                        controller.close();
                    } catch (err) {
                        console.error('Stream error:', err);
                        controller.error(err);
                    }
                }
            });

            return new Response(stream, {
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'Cache-Control': 'no-cache, no-transform',
                    'Connection': 'keep-alive',
                },
            });

        } catch (apiError: any) {
            console.error("[CRITICAL API ERROR]", apiError);
            return NextResponse.json({ 
                error: `AI 故障: ${apiError.message || '未知錯誤'} (Source: ${source})` 
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error("AI Generation Route Error:", error);
        return NextResponse.json({ error: `伺服器內部錯誤: ${error.message}` }, { status: 500 });
    }
}
