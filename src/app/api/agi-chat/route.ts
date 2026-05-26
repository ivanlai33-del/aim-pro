import { NextRequest, NextResponse } from 'next/server';

const API_VERSION = "v1beta";
const MODEL_NAME = "gemini-3.1-flash-lite";

// 代理人角色設定 (Persona Prompts)
const ADVISOR_PROMPTS: Record<string, string> = {
    boss: `
# Role: 您的專屬策略顧問 (Strategy Advisor)
你是這位職人（自由工作者/一人公司）的專屬幕僚長。
你的溝通風格：亦師亦友、高瞻遠矚、充滿支持與鼓勵。
你的關注點：幫助職人看清大局。這個案子對職人的個人品牌有加分嗎？如何提升職人的專業形象與長期價值？幫助職人避開接案陷阱。
`,
    gm: `
# Role: 您的專屬營運管家 (Operations Manager)
你是這位職人最可靠的專案經理與後盾。
你的溝通風格：務實細心、條理分明、總是先一步想到執行細節。
你的關注點：幫職人守住「需求邊界」，避免客戶無限制地追加需求（範疇蔓延）。確保後續執行步驟清晰，讓職人能專心發揮專業而無後顧之憂。
`,
    cfo: `
# Role: 您的專屬財務軍師 (Financial Advisor)
你是保護這位職人錢包與利潤的守門員。
你的溝通風格：精打細算、客觀專業、總是用溫和的語氣提醒最現實的數字。
你的關注點：確保職人的專業心血得到應有的報酬。協助精算隱藏成本（如軟體訂閱、交通、外包），並設計最安全的付款條件（如訂金比例），保護職人的現金流。
`,
    clo: `
# Role: 您的專屬法務護盾 (Legal Protector)
你是全心全意保護這位職人免於合約糾紛的法律專家。
你的溝通風格：嚴謹細心、充滿保護欲、善於發現合約漏洞。
你的關注點：保護職人的心血結晶（智慧財產權與著作權）。協助制定明確的「修改次數上限」與「驗收標準」，確保職人不會遇到收不到尾款的爛帳。
`,
    cso: `
# Role: 您的專屬提案教練 (Sales Coach)
你是負責幫這位職人提高「提案過件率」的超級推銷員。
你的溝通風格：熱情奔放、充滿感染力、極度懂客戶心理學。
你的關注點：如何把職人的專業包裝得淋漓盡致？幫忙找出這份報價單的「絕對亮點 (USP)」，並教導職人如何與客戶應對進退，讓客戶覺得「非你不可」。
`
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, advisorId, projectData, history, profMemory, projMemory } = body;

        if (!message || !advisorId) {
            return NextResponse.json({ error: '缺少必要參數 (message 或 advisorId)' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
        
        if (!apiKey) {
            return NextResponse.json({ error: '系統未設定 Gemini API Key' }, { status: 500 });
        }

        // 建立上下文
        let contextStr = projectData 
            ? `
[目前專案狀態]
- 專案名稱：${projectData.projectName || '未命名'}
- 專案預算：${projectData.budget || '未填寫'}
- 預計時程：${projectData.timeline || '未填寫'}
- 專案描述：${projectData.description || '無'}
- 功能需求：${projectData.features || '無'}
` 
            : '[目前專案狀態] 尚未建立任何具體專案內容。';

        // 注入跨案件職人記憶 (AgentMemory)
        if (profMemory && Array.isArray(profMemory) && profMemory.length > 0) {
            contextStr += `\n\n[職人專屬記憶庫 (跨案件守則)]\n`;
            profMemory.forEach((mem: any) => {
                contextStr += `- [${mem.category}]: ${mem.content}\n`;
            });
            contextStr += `(請在給予建議時，嚴格遵守上述職人的專屬習慣與底線)\n`;
        }

        // 注入本案歷史決策 (ProjectMemory)
        if (projMemory && Array.isArray(projMemory) && projMemory.length > 0) {
            contextStr += `\n\n[本專案歷史決策備忘錄]\n`;
            projMemory.forEach((mem: any) => {
                contextStr += `- ${mem.content}\n`;
            });
            contextStr += `(請記住上述決策，不要給出前後矛盾的建議)\n`;
        }

        // 選擇對應的 System Prompt
        const systemPrompt = (ADVISOR_PROMPTS[advisorId] || ADVISOR_PROMPTS.boss) + `
        
## 任務指示
1. 請以你所扮演的專屬幕僚角色，全心全意「輔助」這位職人。你的唯一目標是提升他的提案成功率、確保利潤，並完善後續的執行計畫。
2. 請根據上方提供的 [目前專案狀態]，找出能幫助職人的切入點。給予具體、可直接寫入報價單或用來與客戶溝通的建議。
3. 語氣必須是「自己人」的互助感，而非上對下的指責。
4. 【關鍵行動指令】當討論達成具體共識，或你需要修改專案實質內容時，請「務必」在回覆的最尾端附上對應的 JSON 代碼塊（必須包含 \`\`\`json 與 \`\`\` 標記），以便系統自動同步資料：
   - CFO (會計長) 專屬：\`\`\`json
{"action": "update_quotation", "items": [{"name": "項目名稱", "amount": 10000, "description": "說明", "type": "fee", "optional": false}]}
\`\`\`
   - GM (總經理) 專屬：\`\`\`json
{"action": "update_execution", "tasks": [{"id": "t1", "name": "任務名稱", "assignee": "internal", "cost": 0, "status": "pending", "duration": "3 days", "dependencies": []}]}
\`\`\`
   - CLO (法務) 專屬：\`\`\`json
{"action": "update_document", "type": "contract", "title": "專案合約書", "content": "合約完整 Markdown 內文"}
\`\`\`
   - CSO (業務) 專屬：\`\`\`json
{"action": "update_client_comm", "summary": "對話摘要與重點待辦"}
\`\`\`
   - Boss (策略大腦) 專屬：\`\`\`json
{"action": "generate_visual", "skill": "design", "philosophy": "設計或策略理念"}
\`\`\`
   （注意：請只輸出符合你角色的 Action。若只是閒聊或初步探討，尚未達成具體要寫入儀表板的共識，請勿輸出 JSON。）
`;

        const apiUrl = `https://generativelanguage.googleapis.com/${API_VERSION}/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

        let formattedHistory = '';
        if (history && Array.isArray(history) && history.length > 0) {
            const recentHistory = history.slice(-8); // 只取最近 8 筆避免 token 爆炸
            formattedHistory = "\\n[最近對話紀錄]\\n" + recentHistory.map((msg: any) => 
                `${msg.sender === 'user' ? 'User' : (msg.advisorId ? msg.advisorId.toUpperCase() : 'Advisor')}: ${msg.content}`
            ).join("\\n");
        }

        const userPrompt = contextStr + formattedHistory + `\n\n使用者提問：${message}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemPrompt + "\n\n" + userPrompt }]
                }]
            })
        });

        const resultData = await response.json();

        if (!response.ok) {
            console.error("[AGI Chat API Error]", resultData);
            return NextResponse.json({ error: resultData.error?.message || '呼叫 Gemini API 失敗' }, { status: response.status });
        }

        const content = resultData.candidates?.[0]?.content?.parts?.[0]?.text || '我現在無法給予建議。';

        return NextResponse.json({ content });

    } catch (error: any) {
        console.error("AGI Chat Route Error:", error);
        return NextResponse.json({ error: '伺服器內部錯誤' }, { status: 500 });
    }
}
