import { BUSINESS_MODULES } from './industries';

export type SubscriptionTier = 'free' | 'starter' | 'professional' | 'pro_plus' | 'enterprise';

export type PricingPeriod = 'monthly' | 'yearly';

export interface PricingPlan {
    id: SubscriptionTier;
    name: string;
    price: {
        monthly: number;
        yearly: number;
        original?: number; // Original price for anchor effect
    };
    description: string;
    limits: {
        maxProjectsMonthly: number; // -1 for unlimited
        includedGeneralModules: number;
        includedHeavyModules: number;
        maxSeats: number;
        aiCreditsMonthly: number;
        dailyAiCreditsCap: number; 
    };
    rateLimit: {
        requestsPerMinute: number;
    };
    features: {
        noWatermark: boolean;
        cloudStorage: boolean;
        customBranding: boolean; // Custom Logo for Pro+
        financeModule: boolean;
        teamCollaboration: boolean;
        apiAccess: boolean;
    };
    addOnPrices: {
        generalModule: number;
        heavyModule: number;
    };
}

export const PRICING_CONFIG: Record<SubscriptionTier, PricingPlan> = {
    free: {
        id: 'free',
        name: '訪客體驗版 (Free)',
        price: { monthly: 0, yearly: 0 },
        description: '適合新手體驗職人大腦，限一般模組(14選1)，選定後鎖定',
        limits: {
            maxProjectsMonthly: 3,
            includedGeneralModules: 1,
            includedHeavyModules: 0,
            maxSeats: 1,
            aiCreditsMonthly: 50,
            dailyAiCreditsCap: 5
        },
        rateLimit: { requestsPerMinute: 2 },
        features: {
            noWatermark: false,
            cloudStorage: false,
            customBranding: false,
            financeModule: false,
            teamCollaboration: false,
            apiAccess: false
        },
        addOnPrices: {
            generalModule: 500,
            heavyModule: 1500
        }
    },
    starter: {
        id: 'starter',
        name: '個人啟航版 (Starter)',
        price: { monthly: 990, yearly: 9000, original: 1500 },
        description: '小資職人首選，移除浮水印並支援雲端備份',
        limits: {
            maxProjectsMonthly: 10,
            includedGeneralModules: 1,
            includedHeavyModules: 0,
            maxSeats: 1,
            aiCreditsMonthly: 300,
            dailyAiCreditsCap: 30
        },
        rateLimit: { requestsPerMinute: 10 },
        features: {
            noWatermark: true,
            cloudStorage: true,
            customBranding: false,
            financeModule: false,
            teamCollaboration: false,
            apiAccess: false
        },
        addOnPrices: {
            generalModule: 500,
            heavyModule: 1500
        }
    },
    professional: {
        id: 'professional',
        name: '專業職人版 (Pro)',
        price: { monthly: 2900, yearly: 24000, original: 3600 },
        description: '核心主力方案，解鎖財務模組與無限專案數',
        limits: {
            maxProjectsMonthly: -1,
            includedGeneralModules: 2,
            includedHeavyModules: 0,
            maxSeats: 1,
            aiCreditsMonthly: 2000,
            dailyAiCreditsCap: 200
        },
        rateLimit: { requestsPerMinute: 30 },
        features: {
            noWatermark: true,
            cloudStorage: true,
            customBranding: false,
            financeModule: true,
            teamCollaboration: false,
            apiAccess: false
        },
        addOnPrices: {
            generalModule: 500,
            heavyModule: 1500
        }
    },
    pro_plus: {
        id: 'pro_plus',
        name: 'Pro+ 團隊協作版',
        price: { monthly: 8800, yearly: 88000, original: 12000 },
        description: '工作室升級首選，包含 4 席位與品牌客製化',
        limits: {
            maxProjectsMonthly: -1,
            includedGeneralModules: 3,
            includedHeavyModules: 0,
            maxSeats: 4,
            aiCreditsMonthly: 10000,
            dailyAiCreditsCap: 1000
        },
        rateLimit: { requestsPerMinute: 60 },
        features: {
            noWatermark: true,
            cloudStorage: true,
            customBranding: true,
            financeModule: true,
            teamCollaboration: true,
            apiAccess: false
        },
        addOnPrices: {
            generalModule: 500,
            heavyModule: 1500
        }
    },
    enterprise: {
        id: 'enterprise',
        name: '企業旗艦版 (Enterprise)',
        price: { monthly: 18000, yearly: 180000, original: 25000 },
        description: '中大型代理商規格，含重型模組與 API 串接',
        limits: {
            maxProjectsMonthly: -1,
            includedGeneralModules: 5,
            includedHeavyModules: 2,
            maxSeats: 15,
            aiCreditsMonthly: 50000,
            dailyAiCreditsCap: 5000
        },
        rateLimit: { requestsPerMinute: 120 },
        features: {
            noWatermark: true,
            cloudStorage: true,
            customBranding: true,
            financeModule: true,
            teamCollaboration: true,
            apiAccess: true
        },
        addOnPrices: {
            generalModule: 500,
            heavyModule: 1500
        }
    }
};

export interface UserPersona {
    id: string;
    name: string;
    email: string;
    tier: SubscriptionTier;
    billingPeriod: PricingPeriod;
    unlockedModules: string[]; 
    addOnModules: string[]; 
    teamId?: string;
    role: 'owner' | 'admin' | 'member' | 'accountant';
    usage: {
        projectsCount: number;
        aiGenerations: number;
    };
}

export const MOCK_PERSONAS: UserPersona[] = [
    {
        id: 'user_free',
        name: '訪客小王 (Free)',
        email: 'wang@free.tw',
        tier: 'free',
        billingPeriod: 'monthly',
        unlockedModules: ['web_development'],
        addOnModules: [],
        role: 'owner',
        usage: { projectsCount: 1, aiGenerations: 5 }
    },
    {
        id: 'user_starter',
        name: '新手小張 (Starter)',
        email: 'zhang@starter.tw',
        tier: 'starter',
        billingPeriod: 'monthly',
        unlockedModules: ['web_development'],
        addOnModules: [],
        role: 'owner',
        usage: { projectsCount: 4, aiGenerations: 12 }
    },
    {
        id: 'user_pro',
        name: '設計師小陳 (Pro)',
        email: 'chen@pro.tw',
        tier: 'professional',
        billingPeriod: 'monthly',
        unlockedModules: ['brand_design', 'social_visual'],
        addOnModules: [],
        role: 'owner',
        usage: { projectsCount: 12, aiGenerations: 85 }
    },
    {
        id: 'user_pro_plus',
        name: '工作室小李 (Pro+)',
        email: 'lee@proplus.tw',
        tier: 'pro_plus',
        billingPeriod: 'yearly',
        unlockedModules: ['brand_design', 'ui_ux_design', 'video_production'],
        addOnModules: ['social_media'],
        role: 'owner',
        usage: { projectsCount: 45, aiGenerations: 1250 }
    },
    {
        id: 'user_enterprise',
        name: '代理商老王 (Enterprise)',
        email: 'wang@enterprise.tw',
        tier: 'enterprise',
        billingPeriod: 'yearly',
        unlockedModules: ['web_development', 'software_outsourcing', 'system_integration', 'ad_management', 'seo'],
        addOnModules: ['influencer_marketing', 'pr_agency'],
        role: 'owner',
        usage: { projectsCount: 128, aiGenerations: 15600 }
    }
];
