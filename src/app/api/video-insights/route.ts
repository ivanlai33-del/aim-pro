import { NextRequest, NextResponse } from 'next/server';

const API_VERSION = "v1beta";
const MODEL_NAME = "gemini-3.1-flash-lite";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { videoUrl, projectData } = body;

        if (!videoUrl) {
            return NextResponse.json({ error: '缺少影片網址 (videoUrl)' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
        
        if (!apiKey) {
            return NextResponse.json({ error: '系統未設定 Gemini API Key' }, { status: 500 });
        }

        // 為了讓 Gemini 解析影片，我們需要建構一個針對「售前報價」的系統指令
        const systemPrompt = `
你是一個專為「影視製作職人」設計的頂級 AI 售前報價分析引擎。
使用者提供了一段參考影片的網址，請你盡可能根據該網址（或模擬該類型影片的典型架構）進行分析，並萃取出「報價所需的核心成本結構與難度指標」。

影片網址：${videoUrl}
目前專案資訊：${JSON.stringify(projectData || {}, null, 2)}

請務必嚴格輸出以下 JSON 格式（不要加上任何 \`\`\`json 標籤，純粹輸出 JSON 即可）：
{
  "metrics": {
    "sceneComplexity": 85, 
    "estimatedDays": 2,
    "vfxDifficulty": "medium",
    "scdRate": 25
  },
  "equipment": [
    { "name": "空拍機 (DJI Mavic 3 Pro)", "cost": 12000, "reason": "需要大景開場畫面" },
    { "name": "三軸穩定器", "cost": 3000, "reason": "室內跟拍穩定需求" }
  ],
  "timestamps": [
    { "id": "t1", "time": "00:00 - 00:05", "title": "高難度開場", "description": "需要特殊運鏡與大量群演", "type": "anomaly", "score": 90 },
    { "id": "t2", "time": "00:20 - 00:40", "title": "大量特效", "description": "需要 3D 建模與合成", "type": "quote", "score": 85 }
  ],
  "ragReply": "根據影片網址分析，這是一支高規格的品牌形象片，建議將空拍與後製特效列為重點報價項目。"
}

其中 metrics.sceneComplexity 為 0-100 的複雜度分數，scdRate 為每分鐘場景切換次數預估。
`;

        const apiUrl = `https://generativelanguage.googleapis.com/${API_VERSION}/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemPrompt }]
                }],
                generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.7
                }
            })
        });

        const resultData = await response.json();

        if (!response.ok) {
            console.error("[Video Insights API Error]", resultData);
            return NextResponse.json({ error: '呼叫 Gemini API 失敗' }, { status: response.status });
        }

        const textContent = resultData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        
        try {
            const parsed = JSON.parse(textContent);
            return NextResponse.json(parsed);
        } catch (e) {
            console.error("Failed to parse Gemini output as JSON", textContent);
            return NextResponse.json({ error: '解析 JSON 失敗' }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Video Insights Route Error:", error);
        return NextResponse.json({ error: '伺服器內部錯誤' }, { status: 500 });
    }
}
