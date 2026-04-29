import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- CONFIGURATION ---
const DEFAULT_MODEL = "gemini-1.5-flash-latest";
const API_VERSION = "v1beta";

// System instructions and prompts
const INDUSTRY_PROMPTS: Record<string, string> = {
    "web": "你是一位資深網站開發專案經理，擅長精確估算開發工時、技術架構與外包分帳...",
    "graphic": "你是一位資深平面設計總監，擅長品牌視覺規劃、印刷發包與設計費率估算...",
    "interior": "你是一位室內裝修監工經理，擅長工程進度安排、材料詢價與師傅工錢分帳...",
    "video": "你是一位影視製作製片經理，擅長拍攝時程規劃、器材租賃與組員勞報分配...",
    "marketing": "你是一位數位行銷策略顧問，擅長投放預算分配、內容創作成本與轉單率評估...",
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

        if (mode === 'report') {
            const { projectData, customPrompts } = params;
            const industry = projectData.category || 'web';
            const basePrompt = customPrompts?.[industry] || INDUSTRY_PROMPTS[industry] || INDUSTRY_PROMPTS.web;
            
            systemPrompt = `
# Role: ${basePrompt}
你的任務是根據使用者提供的專案需求，產出一份極具專業度的「專案執行建議與報價預估報告」。

## 輸出要求：
1. 必須包含預算範圍、時程規劃與任務分帳拆解。
2. 針對產業特性提供具體的專業建議。
3. 保持語氣專業、客觀且具有公信力。
${DEFAULT_OUTPUT_FORMAT}
`;
            userPrompt = `專案名稱：${projectData.name}\n專案描述：${projectData.description}\n目標預算：${projectData.budget || '未提供'}`;
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
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: systemPrompt + "\n\n" + userPrompt
                    }]
                }]
            })
        });
        
        const resultData = await response.json();
        
        if (!response.ok) {
            console.error("[CRITICAL API ERROR]", JSON.stringify(resultData, null, 2));
            return NextResponse.json({ 
                error: `AI 故障: ${resultData.error?.message || '未知錯誤'} (Source: ${source})` 
            }, { status: 500 });
        }

        const content = resultData.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return NextResponse.json({ content });

    } catch (error: any) {
        console.error("AI Generation Route Error:", error);
        return NextResponse.json({ error: `伺服器內部錯誤: ${error.message}` }, { status: 500 });
    }
}
