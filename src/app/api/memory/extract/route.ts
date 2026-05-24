import { NextRequest, NextResponse } from 'next/server';

const API_VERSION = "v1beta";
const MODEL_NAME = "gemini-3.1-flash-lite";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { chatHistory, projectData } = body;

        if (!chatHistory || !Array.isArray(chatHistory)) {
            return NextResponse.json({ error: '缺少對話紀錄' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
        
        if (!apiKey) {
            return NextResponse.json({ error: '系統未設定 Gemini API Key' }, { status: 500 });
        }

        const systemPrompt = `
你是一個專門萃取「職人接案記憶」的AI分析引擎。
請閱讀下方提供的「本案狀態」與「最新對話紀錄」，並試圖從中萃取出以下兩種記憶：

1. **職人專屬記憶 (Professional Memory, 跨案件)**：這名職人的長期偏好、底牌或習慣。例如：「網頁設計最低報價為 8 萬」、「習慣先收 50% 訂金」、「不接急件」。
2. **本案決策備忘錄 (Project Memory, 單一案件)**：在此次對話中做出的具體決定。例如：「與客戶確認網站主色調改為藍色」、「取消空拍機租借」。

如果沒有值得記住的內容，請回傳空陣列。
必須嚴格輸出以下 JSON 格式（不要加上任何 \`\`\`json 標籤，純粹輸出 JSON 即可）：
{
  "professionalMemories": [
    { "category": "pricing_rule", "content": "網頁設計最低報價為 8 萬" }
  ],
  "projectMemories": [
    "與客戶確認網站主色調改為藍色",
    "取消空拍機租借"
  ]
}
`;

        const contextStr = `
[目前專案狀態]
${JSON.stringify(projectData || {}, null, 2)}

[最新對話紀錄]
${chatHistory.map((msg: any) => `${msg.sender}: ${msg.content}`).join("\n")}
`;

        const apiUrl = `https://generativelanguage.googleapis.com/${API_VERSION}/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemPrompt + "\n\n" + contextStr }]
                }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        const resultData = await response.json();

        if (!response.ok) {
            console.error("[Memory Extract API Error]", resultData);
            return NextResponse.json({ error: '呼叫 Gemini API 失敗' }, { status: response.status });
        }

        const textContent = resultData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        
        try {
            const parsed = JSON.parse(textContent);
            return NextResponse.json(parsed);
        } catch (e) {
            console.error("Failed to parse Gemini output as JSON", textContent);
            return NextResponse.json({ professionalMemories: [], projectMemories: [] });
        }

    } catch (error: any) {
        console.error("Memory Extract Route Error:", error);
        return NextResponse.json({ error: '伺服器內部錯誤' }, { status: 500 });
    }
}
