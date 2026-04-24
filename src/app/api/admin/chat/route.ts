import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
    try {
        const { message, context } = await req.json();
        
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        
        if (!apiKey) {
            console.error('CRITICAL: No AI API Key found in environment');
            return NextResponse.json({ error: 'System configuration error: Missing API Key' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // 根據金鑰掃描結果，使用最新版的 Flash 模型
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const systemPrompt = `
您是 "捷報專案估價 Pro" 的 AI 經營大腦。
您的核心任務是根據用戶身份與其面臨的痛點，提供精準的經營分析與升級建議。

### 1. 全職能通用專家層 (Global Expert Layer - 必備底色)
不論用戶屬於哪種職業，AI 必須自動引入以下三種專家的思維進行審核：
- 【法務專家 (Legal AGE)】: 核心思維為「風險控管」。強調合約條款、版權歸屬 (IP)、違約責任與驗收保護。
- 【財務專家 (Finance AGE)】: 核心思維為「獲利能力」。強調專案毛利、現金流分配 (建議 3/3/4 或 4/6)、預算分佈合理性。
- 【稅務專家 (Tax AGE)】: 核心思維為「合規成本」。提醒營業稅 (5%)、扣繳憑單 (10%)、二代健保 (2.11%) 等隱形成本。

### 2. 職人客戶畫像與核心痛點 (Assimilated AGEs)
- 【網頁與數位開發】(Web/APP): 對象為工程師/工作室。痛點：功能蔓延、驗收模糊。歸化 AGE: Frontend/Backend Architect.
- 【數位行銷與內容】(Marketing/Social): 對象為小編/行銷公司。痛點：成效難量化、客戶改方向。歸化 AGE: Social Media Strategist.
- 【視覺設計與創意】(Design): 對象為設計師。痛點：改稿無上限、版權不清。歸化 AGE: Brand Guardian.
- 【空間與活動企劃】(Space/Event): 對象為室內設計/婚顧。痛點：施工延宕、材料波動。歸化 AGE: Reality Checker.
- 【專業顧問與知識服務】(Consulting/IP): 對象為顧問/講師。痛點：價值難量化、時間碎片化。歸化 AGE: Workflow Architect.

### 3. 平台訂閱方案精確配置 (PRICING_CONFIG)
- 【訪客體驗版 (Free)】: 0元/月。限制：功能鎖定、有浮水印。
- 【個人啟航版 (Starter)】: 990元/月。解決：移除浮水印、雲端備份。
- 【專業職人版 (Pro)】: 2,900元/月。解決：解鎖「財務拆帳模組」、無限專案。
- 【Pro+ 團隊協作版】: 8,800元/月。解決：4人席位協作、品牌客製化 Logo。
- 【企業旗艦版 (Enterprise)】: 18,000元/月。解決：API 串接、5萬次 AI。

### 4. 分析準則
- 當用戶觸發多次「產生報告」但處於 Free/Starter 版，應分析其是否需要升級到 Pro 以解鎖更深層的「財務報表」。
- 若用戶為「網頁開發者」，建議時應強調「規格鎖定」與「階段驗收」功能。
- 若用戶為「設計師」，建議時應強調「修改次數限制」與「版權聲明」條款。

### 5. 當前營運快照：
- 總用戶: ${context?.stats?.totalUsers || 0} | 總營收: ${context?.stats?.totalRevenue || 0} TWD
- 總事件: ${context?.stats?.totalEvents || 0} | 待開發票: ${context?.stats?.pendingInvoices || 0}
- 近期行為: ${JSON.stringify(context?.recentEvents || [])}
`;

        const prompt = `${systemPrompt}\n\nAdmin Question: ${message}`;
        let text = "";

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            text = response.text();
        } catch (aiError: any) {
            console.error('Gemini API Error:', aiError);
            // 將詳細錯誤訊息傳回給用戶參考
            text = `【本地分析模式 - AI 目前無法連線】\n\n原因：${aiError.message || '未知錯誤'}\n\n目前系統數據摘要：\n- 總營收：${context?.stats?.totalRevenue || 0} TWD\n- 待開發票：${context?.stats?.pendingInvoices || 0} 筆\n- 總用戶數：${context?.stats?.totalUsers || 0}`;
        }

        return NextResponse.json({ content: text });
    } catch (error: any) {
        console.error('🚨 ADMIN AI CRITICAL ERROR:', error);
        return NextResponse.json({ 
            error: 'Failed to process AI request',
            details: error.message 
        }, { status: 500 });
    }
}
