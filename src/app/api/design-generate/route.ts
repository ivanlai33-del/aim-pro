import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DesignBrief, getFullCraftCSS, SKILL_LABELS, PHILOSOPHY_LABELS } from '@/lib/designEngine';

const DEFAULT_MODEL = "gemini-2.5-flash"; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brief, userApiKey }: { brief: DesignBrief; userApiKey?: string } = body;
    const apiKey = (userApiKey || "AIzaSyC_rSsPsR4dkqKtWqSPO3DSzJoCv48riA8").trim();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: DEFAULT_MODEL,
      generationConfig: { temperature: 0.9, maxOutputTokens: 8192 } 
    });

    const prompt = `你是一位享譽國際的 ${PHILOSOPHY_LABELS[brief.philosophy]} 創意總監 (Creative Director)。
你的任務：運用提供的「設計原子系統」，為專案「${brief.projectName}」打造一份具備電影感、驚艷視覺且具備商業深度的「${SKILL_LABELS[brief.skill]}」。

【全力模式：核心設計準則】
1. **拒絕平庸排版**：嚴禁僅使用簡單的段落。請運用 12 欄位的 Bento Grid、非對稱佈局、以及極端的文字大小對比。
2. **資訊藝術化**：將報告中的數據（如預算、ROI、風險、時程）轉化為視覺化的 UI 元件（如：發光卡片、SVG 進度條、對比列表）。
3. **動態敘事**：每一個 <section> 都必須是一個完整的視覺故事。
    - Section 1: Cinematic Hero (超大漸層標題 + 願景敘述)
    - Section 2: Strategy Grid (使用 bento-grid 展示核心數據)
    - Section 3: Deep Dive (深入分析與解決方案)
    - Section 4: Future ROI (轉化率、獲利預測、預算分析)
    - Section 5: Call to Action (強大的下一步行動建議)
4. **細節工藝**：善用 <span class="caps"> 作為小標題，使用 <span class="text-gradient"> 強調關鍵詞。

【報告核心內容】
${brief.reportSummary}

【輸出要求】
- 僅輸出 <body> 內的 HTML 片段。
- 每一個主要容器必須加上 class="reveal"。
- 絕對禁止輸出 Markdown。
- 如果專案名稱中有「測試」，請發揮想像力將其轉化為一個高端虛擬品牌。

開始產出您的 Open Design 傑作：`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiContent = response.text().replace(/```html?/gi, '').replace(/```/g, '').trim();

    const designSystem = getFullCraftCSS(brief.philosophy);
    const finalHtml = `
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brief.projectName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&family=Playfair+Display:wght@700;900&family=Noto+Serif+TC:wght@700&family=Space+Mono&family=Outfit:wght@900&family=Cormorant+Garamond:wght@400;700&display=swap" rel="stylesheet">
    <style>${designSystem}</style>
</head>
<body>
    <div class="bg-glow"></div>
    ${aiContent}
    <script>
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('reveal');
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('section, .card-premium').forEach(el => observer.observe(el));
    </script>
</body>
</html>
    `;

    return NextResponse.json({
      html: finalHtml,
      title: `${brief.projectName} — ${brief.philosophy}`,
    });

  } catch (error: any) {
    console.error('[DesignGenerate] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
