import { ProjectData } from '@/types/project';

/**
 * Helper to fix Gemini's tendency to collapse tables
 */
function cleanAIResponse(text: string): string {
    let cleanText = text;
    cleanText = cleanText.replace(/\|\s*\|\s*---/g, '|\n| ---');
    cleanText = cleanText.replace(/---\s*\|\s*\|/g, '--- |\n|');
    cleanText = cleanText.replace(/\|\s*\|{1,}\s*(?=[^|\n])/g, '|\n|');
    const keyHeaders = ['項目', '說明', '費用', '階段', '任務', '設計費用', '印刷/製作費', '總預估費用', '工作天數', '備註'];
    keyHeaders.forEach(header => {
        const regex = new RegExp(`(?<!^\|\\n)\\|\s*${header}`, 'g');
        cleanText = cleanText.replace(regex, `\n| ${header}`);
    });
    cleanText = cleanText.replace(/\|\s*\|(?=\s*[^|\n])/g, '|\n|');
    return cleanText;
}

/**
 * Universal call to Backend AI API
 */
async function callGenerateAPI(payload: any): Promise<{content: string, error?: string}> {
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'API Request Failed');
    }
    
    return { content: data.content };
}

export interface AIResponse {
    content: string;
    error?: string;
}

/**
 * Generate full project report (Backend handled)
 */
export async function fetchAIResponse(
    projectData: ProjectData, 
    userApiKey?: string, 
    customPrompts?: Record<string, string>,
    turnstileToken?: string
): Promise<AIResponse> {
    try {
        const result = await callGenerateAPI({
            mode: 'report',
            projectData,
            customPrompts,
            userApiKey,
            turnstileToken
        });
        return { content: cleanAIResponse(result.content) };
    } catch (error: any) {
        console.error("AI Service Error:", error);
        return {
            content: "",
            error: error instanceof Error ? error.message : "發生未知錯誤"
        };
    }
}

export type ReplyMode = 'simple' | 'medium' | 'detailed' | 'followup' | 'payment';

/**
 * Generate chat reply (Backend handled)
 */
export async function generateChatReply(
    chatMode: ReplyMode,
    projectContext: string,
    reportContext: string,
    chatContext: string,
    userMessage: string,
    userApiKey?: string,
    projectType: 'web' | 'design' = 'web',
    turnstileToken?: string
): Promise<AIResponse> {
    try {
        const result = await callGenerateAPI({
            mode: 'chat',
            chatMode,
            projectContext,
            reportContext,
            chatContext,
            userMessage,
            isDesign: projectType === 'design',
            userApiKey,
            turnstileToken
        });
        return { content: cleanAIResponse(result.content) };
    } catch (error: any) {
        console.error("Chat Generation Error:", error);
        return { content: "", error: error instanceof Error ? error.message : "發生未知錯誤" };
    }
}

/**
 * Refine/Edit report (Backend handled)
 */
export async function refineReport(
    currentContent: string,
    additionalNotes: string,
    userApiKey?: string,
    turnstileToken?: string
): Promise<AIResponse> {
    try {
        const result = await callGenerateAPI({
            mode: 'refine',
            currentContent,
            additionalNotes,
            userApiKey,
            turnstileToken
        });
        return { content: cleanAIResponse(result.content) };
    } catch (error: any) {
        console.error("Report Refinement Error:", error);
        return { content: "", error: error instanceof Error ? error.message : "發生未知錯誤" };
    }
}

/**
 * Professional Translation/Internationalization (Backend handled)
 */
export async function translateDocument(
    content: string,
    targetLanguage: 'English' | 'Japanese' | 'Traditional Chinese',
    context?: string,
    userApiKey?: string,
    turnstileToken?: string
): Promise<AIResponse> {
    try {
        const result = await callGenerateAPI({
            mode: 'translate',
            content,
            targetLanguage,
            context,
            userApiKey,
            turnstileToken
        });
        return { content: cleanAIResponse(result.content) };
    } catch (error: any) {
        console.error("Translation Service Error:", error);
        return { content: "", error: error instanceof Error ? error.message : "翻譯服務暫時不可用" };
    }
}
/**
 * Surgical/Partial Edit of a specific text segment (Backend handled)
 */
export async function partialRefine(
    selectedText: string,
    instruction: string,
    userApiKey?: string,
    turnstileToken?: string
): Promise<AIResponse> {
    try {
        const result = await callGenerateAPI({
            mode: 'partial_refine',
            selectedText,
            instruction,
            userApiKey,
            turnstileToken
        });
        return { content: cleanAIResponse(result.content) };
    } catch (error: any) {
        console.error("Partial Refinement Error:", error);
        return { content: "", error: error instanceof Error ? error.message : "局部修改失敗" };
    }
}
