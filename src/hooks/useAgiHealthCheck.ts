'use client';

import { useMemo } from 'react';
import { ProjectData } from '@/types/project';

export type HealthStatus = 'green' | 'yellow' | 'red';

export interface DimensionResult {
    id: string;
    label: string;
    role: string;
    icon: string;
    status: HealthStatus;
    summary: string;
    suggestions: string[];
}

export interface AgiHealthReport {
    dimensions: DimensionResult[];
    overallScore: number;
    blockingCount: number; // red count
    warningCount: number;  // yellow count
}

// Modules considered "technical" — CTO check applies
const TECH_MODULES = [
    'web_development', 'software_outsourcing', 'system_integration',
    'app_development', 'ecommerce', 'ui_ux_design'
];

// Modules that are legal-risk heavy (government / compliance)
const LEGAL_HEAVY_MODULES = ['government_tender', 'grant_subsidy', 'ip_agent'];

// Minimum sensible budgets (TWD) per module type (rough guideline)
const MIN_BUDGET_MAP: Record<string, number> = {
    web_development: 30000,
    software_outsourcing: 100000,
    system_integration: 150000,
    brand_design: 15000,
    social_visual: 8000,
    video_production: 20000,
    ad_management: 30000,
    seo: 12000,
    government_tender: 500000,
    grant_subsidy: 0, // grants are about receiving, not paying
};

function parseBudget(rawBudget?: string): number | null {
    if (!rawBudget) return null;
    // Strip non-numeric chars except decimal point, handle 萬 (10,000)
    const hasMillion = rawBudget.includes('萬');
    const digits = parseFloat(rawBudget.replace(/[^0-9.]/g, ''));
    if (isNaN(digits)) return null;
    return hasMillion ? digits * 10000 : digits;
}

function estimateWordCount(str?: string): number {
    if (!str) return 0;
    return safeStr(str).trim().length;
}

// Safe string coercion — guards against arrays / numbers / undefined
function safeStr(val?: unknown): string {
    if (val === null || val === undefined) return '';
    if (typeof val === 'string') return val;
    if (Array.isArray(val)) return val.join(' ');
    return String(val);
}

// ────────────────────────────────────────────
//  RULE ENGINE — 6 Dimensions
// ────────────────────────────────────────────

function checkFinance(data: ProjectData): DimensionResult {
    const suggestions: string[] = [];
    let status: HealthStatus = 'green';
    let summary = '預算規劃完整，財務風險低。';

    const budgetStr = safeStr(data.budget);
    const budget = parseBudget(budgetStr || undefined);
    const minBudget = MIN_BUDGET_MAP[data.moduleId] || 10000;

    if (!budgetStr || budgetStr.trim() === '') {
        status = 'red';
        summary = '缺少預算資訊，無法評估財務健康度。';
        suggestions.push('請填寫「預算範圍」欄位，這是核心報價依據。');
    } else if (budget !== null && budget < minBudget && data.moduleId !== 'grant_subsidy') {
        status = 'yellow';
        summary = `預算 (${budgetStr}) 低於此類型專案的建議最低收費。`;
        suggestions.push(`此服務建議最低收費為 ${(minBudget / 10000).toFixed(0)} 萬，請確認是否已涵蓋人力與外包成本。`);
        suggestions.push('建議加入「分期付款條件」（如：簽約 30% / 交稿 50% / 驗收 20%）以保護現金流。');
    } else {
        suggestions.push('建議在報告中加入「付款分期方案」，降低收款風險。');
    }

    if (!data.timeline && status !== 'red') {
        status = status === 'green' ? 'yellow' : status;
        summary += ' 但缺少時程設定。';
        suggestions.push('請填寫「預計執行時間」，以便計算人力成本。');
    }

    return {
        id: 'finance',
        label: 'CFO 財務長',
        role: '帳目與財務風險',
        icon: '💼',
        status,
        summary,
        suggestions,
    };
}

function checkLegal(data: ProjectData): DimensionResult {
    const suggestions: string[] = [];
    let status: HealthStatus = 'green';
    let summary = '法務風險未見明顯漏洞。';

    const isLegalHeavy = LEGAL_HEAVY_MODULES.includes(data.moduleId);
    const hasClientInfo = !!(data.clientCompany || data.clientTaxId);
    const desc = (data.description || '').toLowerCase();
    const mentionsContract = desc.includes('合約') || desc.includes('contract') || desc.includes('協議');

    if (isLegalHeavy && !hasClientInfo) {
        status = 'red';
        summary = '高法務風險模組，但缺少客戶識別資料。';
        suggestions.push('政府標案或補助申請必須填寫「客戶公司全名」與「統一編號」。');
        suggestions.push('請確認已備齊政府規定的所有申請文件清單。');
    } else if (!hasClientInfo) {
        status = 'yellow';
        summary = '缺少客戶基本資料，合約保護不完整。';
        suggestions.push('建議填寫「客戶公司名稱」與「統一編號」，以便法律追索。');
    }

    if (!mentionsContract && !isLegalHeavy) {
        if (status === 'green') {
            status = 'yellow';
            summary = '提案資訊完整，但建議加入驗收與合約保護條款。';
        }
        suggestions.push('建議在報告中加入「驗收期（建議 30 天）」與「爭議仲裁條款」。');
        suggestions.push('未定義著作權歸屬是常見糾紛來源，建議明確說明。');
    }

    if (status === 'green') {
        suggestions.push('可考慮加入「保固期間」說明，增加客戶信心。');
    }

    return {
        id: 'legal',
        label: 'CLO 法務長',
        role: '合規與法律風險',
        icon: '⚖️',
        status,
        summary,
        suggestions,
    };
}

function checkSales(data: ProjectData): DimensionResult {
    const suggestions: string[] = [];
    let status: HealthStatus = 'green';
    let summary = '提案具有清晰的價值主張。';

    const descLength = estimateWordCount(data.description);
    const hasClient = !!data.clientCompany;

    if (descLength < 50) {
        status = 'red';
        summary = '專案描述過於簡短，提案競爭力不足。';
        suggestions.push('請在「專案描述」中說明：客戶面臨的核心問題、您的解決方案、預期效益。');
        suggestions.push('描述建議至少 100 字以上，幫助 AI 產出更有說服力的提案。');
    } else if (descLength < 100) {
        status = 'yellow';
        summary = '描述尚可，但競爭力可進一步強化。';
        suggestions.push('建議加入「預期 ROI 或量化效益」，例如：預估節省 30% 人力成本。');
    }

    if (!hasClient) {
        if (status === 'green') {
            status = 'yellow';
            summary = '描述完整，但缺少客戶針對性。';
        }
        suggestions.push('加入「客戶公司名稱」後，AI 可為報告加入更有針對性的競爭分析。');
    }

    if (status === 'green') {
        suggestions.push('考慮加入「競品比較分析」或「同類案例參考」，進一步提升說服力。');
    }

    return {
        id: 'sales',
        label: 'CSO 業務總監',
        role: '提案競爭力',
        icon: '🎯',
        status,
        summary,
        suggestions,
    };
}

function checkExecution(data: ProjectData): DimensionResult {
    const suggestions: string[] = [];
    let status: HealthStatus = 'green';
    let summary = '執行規劃合理，時程可行。';

    const hasTimeline = !!(data.timeline && safeStr(data.timeline).trim().length > 0);
    const hasFeatures = !!(data.features && safeStr(data.features).trim().length > 0);
    const timelineStr = safeStr(data.timeline).toLowerCase();
    const isShortTimeline = timelineStr.includes('1週') || timelineStr.includes('3天') || timelineStr.includes('一週');
    const featureCount = safeStr(data.features).split(/[,，\n]/).filter(f => f.trim()).length;

    if (!hasTimeline) {
        status = 'red';
        summary = '缺少時程設定，執行計畫無法成形。';
        suggestions.push('請填寫「預計執行時間」，這是報告中執行企劃的核心依據。');
    } else if (isShortTimeline && featureCount > 3) {
        status = 'yellow';
        summary = '時程較短，但功能需求較多，建議重新評估。';
        suggestions.push(`目前有 ${featureCount} 個需求項目，建議時程至少預留緩衝時間（+20%）。`);
        suggestions.push('考慮採用「分期交付」模式，降低時程壓力與交付風險。');
    }

    if (!hasFeatures) {
        if (status === 'green') {
            status = 'yellow';
            summary = '時程已填，但缺少功能需求清單。';
        }
        suggestions.push('請填寫「具體功能需求」，幫助 AI 產出更精確的執行時程分解。');
    }

    if (status === 'green') {
        suggestions.push('建議在報告中加入「風險矩陣」，讓客戶看見您的風險管控意識。');
    }

    return {
        id: 'execution',
        label: 'PMO 專案總監',
        role: '執行可行性',
        icon: '📋',
        status,
        summary,
        suggestions,
    };
}

function checkBrand(data: ProjectData): DimensionResult {
    const suggestions: string[] = [];
    let status: HealthStatus = 'green';
    let summary = '品牌資料充足，AI 可產出有針對性的分析。';

    const hasClient = !!data.clientCompany;
    const hasStyleRef = !!(data.styleReferences && safeStr(data.styleReferences).trim().length > 0);
    const hasWebsite = !!(data.websiteUrl && safeStr(data.websiteUrl).trim().length > 0);

    if (!hasClient) {
        status = 'red';
        summary = '缺少客戶基本資料，無法進行品牌針對性分析。';
        suggestions.push('請填寫「客戶公司名稱」，這是 AI 進行品牌定位分析的基礎。');
    }

    if (!hasStyleRef && !hasWebsite) {
        if (status === 'green') {
            status = 'yellow';
            summary = '缺少風格參考資料，品牌分析將偏向通用。';
        }
        suggestions.push('提供「風格參考連結」或「客戶官網」，可讓 AI 產出更精準的視覺建議。');
    }

    if (status === 'green') {
        suggestions.push('資料完整！AI 將能產出貼合客戶品牌的差異化分析。');
    }

    return {
        id: 'brand',
        label: 'CMO 品牌總監',
        role: '品牌一致性',
        icon: '🎨',
        status,
        summary,
        suggestions,
    };
}

function checkTech(data: ProjectData): DimensionResult {
    const suggestions: string[] = [];
    let status: HealthStatus = 'green';
    let summary = '技術規格評估無明顯風險。';

    const isTechModule = TECH_MODULES.includes(data.moduleId);

    if (isTechModule) {
        const hasFeatures = !!(data.features && safeStr(data.features).trim().length > 0);
        const hasTech = !!(data.existingTech && safeStr(data.existingTech).trim().length > 0);

        if (!hasFeatures) {
            status = 'red';
            summary = '技術型模組缺少功能規格，風險最高。';
            suggestions.push('請明確列出「系統功能需求」，這是技術估價最關鍵的依據。');
            suggestions.push('缺少規格書的案子，通常會在執行中遭遇大量追加費用的爭議。');
        } else if (!hasTech) {
            status = 'yellow';
            summary = '功能需求存在，但缺少現有技術環境資訊。';
            suggestions.push('若客戶有現有系統，請填寫「現有技術環境」，避免整合衝突。');
        }

        if (status === 'green') {
            suggestions.push('建議在報告中加入「技術選型說明」，展現您的技術深度。');
        }
    } else {
        // Non-tech module — CTO check is lighter
        suggestions.push('此模組技術依賴度較低，執行風險可控。');
    }

    return {
        id: 'tech',
        label: 'CTO 技術顧問',
        role: '技術可行性',
        icon: '💻',
        status,
        summary,
        suggestions,
    };
}

// ────────────────────────────────────────────
//  Score calculation
// ────────────────────────────────────────────

function calculateScore(dimensions: DimensionResult[]): number {
    const weights: Record<string, number> = {
        finance: 20,
        legal: 20,
        sales: 15,
        execution: 20,
        brand: 10,
        tech: 15,
    };
    let total = 0;
    for (const dim of dimensions) {
        const weight = weights[dim.id] || 15;
        const score = dim.status === 'green' ? 1 : dim.status === 'yellow' ? 0.5 : 0;
        total += weight * score;
    }
    return Math.round(total);
}

// ────────────────────────────────────────────
//  Main Hook
// ────────────────────────────────────────────

export function useAgiHealthCheck(formData: ProjectData): AgiHealthReport {
    return useMemo(() => {
        const dimensions: DimensionResult[] = [
            checkFinance(formData),
            checkLegal(formData),
            checkSales(formData),
            checkExecution(formData),
            checkBrand(formData),
            checkTech(formData),
        ];

        const overallScore = calculateScore(dimensions);
        const blockingCount = dimensions.filter(d => d.status === 'red').length;
        const warningCount = dimensions.filter(d => d.status === 'yellow').length;

        return { dimensions, overallScore, blockingCount, warningCount };
    }, [
        formData.moduleId,
        formData.projectType,
        formData.budget,
        formData.timeline,
        formData.description,
        formData.features,
        formData.clientCompany,
        formData.clientTaxId,
        formData.styleReferences,
        formData.websiteUrl,
        formData.existingTech,
    ]);
}
