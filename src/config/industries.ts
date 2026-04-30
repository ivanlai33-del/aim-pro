// ============================================================
// industries.ts - 產業分類與模組註冊表
// 核心架構說明：
//   CategoryFolder  = 行業大類（例如：網頁、行銷、設計），對應後端的資料夾結構。
//   BusinessModule  = 具體的職人模組（目前 23 個），包含細項、報價建議與合約範本。
// ============================================================

// SECTION 1: 基礎型別定義 (已移動至 @/types/industries)
// SECTION 2: 功能模組介面 (已移動至 @/types/industries)
// SECTION 3: 核心介面 (已移動至 @/types/industries)

import { 
    BusinessModule, 
    CategoryFolder, 
    IndustryCategory, 
    QuotationItemTemplate 
} from '@/types/industries';

// Re-export types for consumers who import from @/config/industries
export type { BusinessModule, CategoryFolder, IndustryCategory, QuotationItemTemplate };


// ============================================================
// SECTION 4: 五大類資料夾定義
// ============================================================

export const CATEGORY_FOLDERS: Record<string, CategoryFolder> = {

    web: {
        id: 'web',
        name: '網頁與數位產品',
        description: '網站建置、APP 開發、軟體系統、系統整合',
        icon: 'Layout',
        color: '#6366f1',
        moduleIds: ['web_development', 'software_outsourcing', 'system_integration'],
        workflow: {
            diagram: `graph LR
    A[收到訂金] --> B[需求分析]
    B --> C[架構設計]
    C --> D[開發階段]
    D --> E[測試驗收]
    E --> F[上線交付]`,
            milestones: ['收到訂金', '需求分析', '架構設計', '開發', '測試', '上線交付'],
        },
    },

    marketing: {
        id: 'marketing',
        name: '數位行銷與推廣',
        description: '社群經營、廣告投放、SEO 優化、KOL 媒合',
        icon: 'Megaphone',
        color: '#f59e0b',
        moduleIds: ['social_media', 'ad_management', 'seo', 'influencer_marketing', 'pr_agency'],
        workflow: {
            diagram: `graph LR
    A[收到訂金] --> B[策略規劃]
    B --> C[內容製作]
    C --> D[多渠道執行]
    D --> E[數據監測]
    E --> F[成效報告]`,
            milestones: ['收到訂金', '策略規劃', '內容製作', '執行', '監測', '成效報告'],
        },
    },

    design: {
        id: 'design',
        name: '視覺設計與創意',
        description: '品牌設計、影片製作、社群視覺、攝影服務',
        icon: 'Palette',
        color: '#ec4899',
        moduleIds: ['brand_design', 'ui_ux_design', 'video_production', 'social_visual', 'photography'],
        workflow: {
            diagram: `graph LR
    A[收到訂金] --> B[風格企劃]
    B --> C[創意提案]
    C --> D[設計製作]
    D --> E[修改確認]
    E --> F[交付結案]`,
            milestones: ['收到訂金', '風格企劃', '創意提案', '製作', '修改確認', '交付'],
        },
    },

    space: {
        id: 'space',
        name: '空間與活動企劃',
        description: '室內裝修、活動婚禮、展場設計',
        icon: 'Hammer',
        color: '#10b981',
        moduleIds: ['interior_design', 'event_planning', 'exhibition_design'],
        workflow: {
            diagram: `graph LR
    A[收到訂金] --> B[現場勘查]
    B --> C[設計規劃]
    C --> D[客戶確認]
    D --> E[施工佈置]
    E --> F[驗收結案]`,
            milestones: ['收到訂金', '現場勘查', '設計規劃', '確認', '施工', '驗收'],
        },
    },

    consulting: {
        id: 'consulting',
        name: '專業服務與顧問',
        description: '企業顧問、企業培訓、策略規劃',
        icon: 'Briefcase',
        color: '#8b5cf6',
        moduleIds: ['business_consulting', 'corporate_training', 'strategy_planning', 'ai_agent_consultant'],
        workflow: {
            diagram: `graph LR
    A[收到訂金] --> B[現況訪談]
    B --> C[分析診斷]
    C --> D[策略規劃]
    D --> E[提案確認]
    E --> F[導入執行]`,
            milestones: ['收到訂金', '現況訪談', '分析診斷', '策略規劃', '確認', '執行'],
        },
    },

    // 預留擴充位置：
    pro_service: {
        id: 'pro_service',
        name: '知識產出與專業職人',
        description: '線上課程、整理收納、智慧財產權代理',
        icon: 'Award',
        color: '#0ea5e9',
        moduleIds: ['online_course_prod', 'home_organizer', 'ip_agent'],
        workflow: {
            diagram: `graph LR
    A[收到訂金] --> B[專業訪談]
    B --> C[方案規劃]
    C --> D[施作/製作]
    D --> E[審閱確認]
    E --> F[結案交付]`,
            milestones: ['收到訂金', '專業訪談', '方案規劃', '施作/製作', '確認', '結案交付'],
        },
    },

    // 🏆 新類別：商務開發與競標
    business_dev: {
        id: 'business_dev',
        name: '商務開發與競標',
        description: '政府標案投標策略、補助計畫申請、提案文件撰寫',
        icon: 'Trophy',
        color: '#f59e0b',
        moduleIds: ['government_tender', 'grant_subsidy'],
        workflow: {
            diagram: `graph LR
    A[機會識別] --> B[資格審查]
    B --> C[策略規劃]
    C --> D[文件撰寫]
    D --> E[提案送件]
    E --> F[得標/獲補]`,
            milestones: ['機會識別', '資格審查', '策略規劃', '文件撰寫', '送件', '得標/獲補'],
        },
    },
};

export const CATEGORY_GRADIENTS: Record<string, string> = {
    web: "from-indigo-500 to-blue-600",
    marketing: "from-orange-400 to-rose-500",
    design: "from-pink-500 to-purple-600",
    space: "from-emerald-400 to-teal-500",
    consulting: "from-violet-500 to-fuchsia-600",
    pro_service: "from-sky-500 to-blue-500",
    business_dev: "from-amber-400 to-orange-500"
};

// ============================================================
// SECTION 5: 17 個商業模組定義 (Imported)
// ============================================================

import { MODULE_WEB_DEVELOPMENT } from './modules/web/web_development';
import { MODULE_SOFTWARE_OUTSOURCING } from './modules/web/software_outsourcing';
import { MODULE_SYSTEM_INTEGRATION } from './modules/web/system_integration';

import { MODULE_SOCIAL_MEDIA } from './modules/marketing/social_media';
import { MODULE_AD_MANAGEMENT } from './modules/marketing/ad_management';
import { MODULE_SEO } from './modules/marketing/seo';
import { MODULE_INFLUENCER_MARKETING } from './modules/marketing/influencer_marketing';
import { MODULE_PR_AGENCY } from './modules/marketing/pr_agency';

import { MODULE_BRAND_DESIGN } from './modules/design/brand_design';
import { MODULE_VIDEO_PRODUCTION } from './modules/design/video_production';
import { MODULE_SOCIAL_VISUAL } from './modules/design/social_visual';
import { MODULE_PHOTOGRAPHY } from './modules/design/photography';
import { MODULE_UI_UX } from './modules/design/ui_ux';

import { MODULE_INTERIOR_DESIGN } from './modules/space/interior_design';
import { MODULE_EVENT_PLANNING } from './modules/space/event_planning';
import { MODULE_EXHIBITION_DESIGN } from './modules/space/exhibition_design';

import { MODULE_BUSINESS_CONSULTING } from './modules/consulting/business_consulting';
import { MODULE_CORPORATE_TRAINING } from './modules/consulting/corporate_training';
import { MODULE_STRATEGY_PLANNING } from './modules/consulting/strategy_planning';
import { MODULE_ONLINE_COURSE } from './modules/consulting/online_course';
import { MODULE_HOME_ORGANIZER } from './modules/consulting/home_organizer';
import { MODULE_IP_AGENT } from './modules/consulting/ip_agent';
import { MODULE_AI_AGENT_CONSULTANT } from './modules/consulting/ai_agent_consulting';

import { MODULE_GOVERNMENT_TENDER } from './modules/business_dev/government_tender';
import { MODULE_GRANT_SUBSIDY } from './modules/business_dev/grant_subsidy';

// Re-export for direct access if needed
export {
    MODULE_WEB_DEVELOPMENT, MODULE_SOFTWARE_OUTSOURCING, MODULE_SYSTEM_INTEGRATION,
    MODULE_SOCIAL_MEDIA, MODULE_AD_MANAGEMENT, MODULE_SEO, MODULE_INFLUENCER_MARKETING,
    MODULE_BRAND_DESIGN, MODULE_VIDEO_PRODUCTION, MODULE_SOCIAL_VISUAL, MODULE_PHOTOGRAPHY, MODULE_UI_UX,
    MODULE_INTERIOR_DESIGN, MODULE_EVENT_PLANNING, MODULE_EXHIBITION_DESIGN,
    MODULE_BUSINESS_CONSULTING, MODULE_CORPORATE_TRAINING, MODULE_STRATEGY_PLANNING,
    MODULE_ONLINE_COURSE, MODULE_HOME_ORGANIZER, MODULE_IP_AGENT, MODULE_PR_AGENCY,
    MODULE_AI_AGENT_CONSULTANT,
    MODULE_GOVERNMENT_TENDER, MODULE_GRANT_SUBSIDY
};

// ============================================================
// SECTION 6: 模組登錄表 — 所有 17 個模組的索引
// ============================================================

export const BUSINESS_MODULES: Record<string, BusinessModule> = {
    // 🟢 網頁與數位產品
    web_development: MODULE_WEB_DEVELOPMENT,
    software_outsourcing: MODULE_SOFTWARE_OUTSOURCING,
    system_integration: MODULE_SYSTEM_INTEGRATION,

    // 🟡 數位行銷與推廣
    social_media: MODULE_SOCIAL_MEDIA,
    ad_management: MODULE_AD_MANAGEMENT,
    seo: MODULE_SEO,
    influencer_marketing: MODULE_INFLUENCER_MARKETING,
    pr_agency: MODULE_PR_AGENCY,

    // 🔵 視覺設計與創意
    brand_design: MODULE_BRAND_DESIGN,
    ui_ux_design: MODULE_UI_UX,
    video_production: MODULE_VIDEO_PRODUCTION,
    social_visual: MODULE_SOCIAL_VISUAL,
    photography: MODULE_PHOTOGRAPHY,

    // 🟠 空間與活動企劃
    interior_design: MODULE_INTERIOR_DESIGN,
    event_planning: MODULE_EVENT_PLANNING,
    exhibition_design: MODULE_EXHIBITION_DESIGN,

    // 🟣 專業服務與顧問
    business_consulting: MODULE_BUSINESS_CONSULTING,
    corporate_training: MODULE_CORPORATE_TRAINING,
    strategy_planning: MODULE_STRATEGY_PLANNING,
    online_course_prod: MODULE_ONLINE_COURSE,
    home_organizer: MODULE_HOME_ORGANIZER,
    ip_agent: MODULE_IP_AGENT,
    ai_agent_consultant: MODULE_AI_AGENT_CONSULTANT,

    // 🏆 商務開發與競標
    government_tender: MODULE_GOVERNMENT_TENDER,
    grant_subsidy: MODULE_GRANT_SUBSIDY,
};

// ============================================================
// SECTION 7: 向後相容層 — 維持舊版 INDUSTRY_CATEGORIES 介面
// ============================================================

function buildLegacyCategory(folder: CategoryFolder): IndustryCategory {
    return {
        id: folder.id,
        name: folder.name,
        description: folder.description,
        icon: folder.icon,
        items: folder.moduleIds.map(id => BUSINESS_MODULES[id]).filter(Boolean),
        workflow: folder.workflow,
    };
}

export const INDUSTRY_CATEGORIES: Record<string, IndustryCategory> = Object.fromEntries(
    Object.entries(CATEGORY_FOLDERS).map(([key, folder]) => [key, buildLegacyCategory(folder)])
);

export const DEFAULT_CATEGORY = INDUSTRY_CATEGORIES.web;

// ============================================================
// SECTION 8: 工具函數
// ============================================================

/** 根據模組 ID 取得模組 */
export function getModuleById(moduleId: string): BusinessModule | undefined {
    return BUSINESS_MODULES[moduleId];
}

/** 根據模組 ID 取得所屬資料夾 */
export function getCategoryByModuleId(moduleId: string): CategoryFolder | undefined {
    const mod = BUSINESS_MODULES[moduleId];
    if (!mod) return undefined;
    return CATEGORY_FOLDERS[mod.categoryId];
}

/** 取得某資料夾下的所有模組 */
export function getModulesByCategory(categoryId: string): BusinessModule[] {
    const folder = CATEGORY_FOLDERS[categoryId];
    if (!folder) return [];
    return folder.moduleIds.map(id => BUSINESS_MODULES[id]).filter(Boolean);
}

/** 取得所有模組（扁平化） */
export function getAllModules(): BusinessModule[] {
    return Object.values(BUSINESS_MODULES);
}

/** 取得所有資料夾 */
export function getAllCategories(): CategoryFolder[] {
    return Object.values(CATEGORY_FOLDERS);
}

// 向後相容函數
export function getCategoryByItemId(itemId: string): IndustryCategory | undefined {
    const folder = getCategoryByModuleId(itemId);
    if (!folder) return undefined;
    return INDUSTRY_CATEGORIES[folder.id];
}

export function getItemById(itemId: string): BusinessModule | undefined {
    return getModuleById(itemId);
}

export function getAllItems(): BusinessModule[] {
    return getAllModules();
}

/** 新增模組到指定資料夾（執行時動態擴充用） */
export function registerModule(module: BusinessModule): void {
    BUSINESS_MODULES[module.id] = module;
    const folder = CATEGORY_FOLDERS[module.categoryId];
    if (folder && !folder.moduleIds.includes(module.id)) {
        folder.moduleIds.push(module.id);
    }
}

/** 新增資料夾（執行時動態擴充用） */
export function registerCategory(folder: CategoryFolder): void {
    CATEGORY_FOLDERS[folder.id] = folder;
    INDUSTRY_CATEGORIES[folder.id] = buildLegacyCategory(folder);
}
