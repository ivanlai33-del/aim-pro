'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from 'react';
import { useProject } from '@/context/ProjectContext';
import { useAgiHealthCheck, AgiHealthReport } from '@/hooks/useAgiHealthCheck';

export type AgiTab = 'health' | 'meeting' | 'onboarding';

export type AdvisorId = 'boss' | 'gm' | 'cfo' | 'clo' | 'cso';

export interface AdvisorMessage {
    id: string;
    advisorId: AdvisorId | 'user' | 'system';
    content: string;
    timestamp: Date;
}

export interface AgiContextValue {
    // Window state
    isOpen: boolean;
    activeTab: AgiTab;
    openWindow: (tab?: AgiTab) => void;
    closeWindow: () => void;
    setActiveTab: (tab: AgiTab) => void;

    // Health
    healthReport: AgiHealthReport;

    // Meeting room
    messages: AdvisorMessage[];
    activeAdvisor: AdvisorId | 'all';
    setActiveAdvisor: (id: AdvisorId | 'all') => void;
    sendMessage: (content: string) => void;
    isAdvisorTyping: boolean;

    // Onboarding
    onboardingItems: OnboardingItem[];
    completedItems: Set<string>;
    markComplete: (id: string) => void;

    // RBAC
    allowedIds: string[];
}

export interface OnboardingItem {
    id: string;
    label: string;
    description: string;
    priority: 'red' | 'yellow' | 'green';
    actionLabel: string;
    actionPath: string;
}

const AgiContext = createContext<AgiContextValue | null>(null);

// ─────────────────────────────────────────────
//  Role-based Permissions Mapping
// ─────────────────────────────────────────────
const ROLE_PERMISSIONS: Record<string, string[]> = {
    owner: ['finance', 'legal', 'sales', 'execution', 'brand', 'tech', 'boss', 'gm', 'cfo', 'clo', 'cso'],
    admin: ['finance', 'legal', 'sales', 'execution', 'brand', 'tech', 'boss', 'gm', 'cfo', 'clo', 'cso'],
    accountant: ['finance', 'legal', 'boss', 'cfo', 'clo'],
    member: ['sales', 'execution', 'brand', 'tech', 'gm', 'cso'], // Strict isolation for members
};

export function AgiProvider({ children }: { children: ReactNode }) {
    const { activeProject, userTier, currentPersona } = useProject();
    const userRole = currentPersona?.role || 'member';
    const allowedIds = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS.member;

    // Window state
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<AgiTab>('health');

    // Health report — reads formData from active project
    const fallbackData = {
        moduleId: 'web_development',
        projectType: 'website',
        projectName: '',
        description: '',
        features: '',
    };
    const rawHealthReport = useAgiHealthCheck(activeProject?.data ?? fallbackData);

    // Filter dimensions based on role
    const healthReport = useMemo(() => ({
        ...rawHealthReport,
        dimensions: rawHealthReport.dimensions.filter(d => allowedIds.includes(d.id))
    }), [rawHealthReport, allowedIds]);

    // Meeting room state
    const [messages, setMessages] = useState<AdvisorMessage[]>([]);
    const [activeAdvisor, setActiveAdvisor] = useState<AdvisorId | 'all'>('boss');
    const [isAdvisorTyping, setIsAdvisorTyping] = useState(false);

    // Reset messages when switching projects to maintain context purity
    useEffect(() => {
        setMessages([
            {
                id: 'welcome',
                advisorId: 'system',
                content: activeProject 
                    ? `已載入專案：【${activeProject.data?.projectName || '未命名專案'}】。目前的權限級別：${userRole === 'owner' || userRole === 'admin' ? '最高權限' : '限制存取'}。`
                    : `尚未選擇專案。目前的權限級別：${userRole === 'owner' || userRole === 'admin' ? '最高權限' : '限制存取'}。`,
                timestamp: new Date(),
            }
        ]);
        // Reset to default advisor for the role
        setActiveAdvisor(userRole === 'accountant' ? 'cfo' : (userRole === 'member' ? 'gm' as any : 'boss'));
    }, [activeProject?.id, userRole]);

    const openWindow = useCallback((tab?: AgiTab) => {
        if (tab) setActiveTab(tab);
        setIsOpen(true);
    }, []);

    const closeWindow = useCallback(() => setIsOpen(false), []);

    // Onboarding items — derived from project context
    const onboardingItems: OnboardingItem[] = [
        {
            id: 'company_info',
            label: '公司基本資料',
            description: '填寫公司名稱、統一編號與地址，這是所有商業文件的法律基礎。',
            priority: 'red',
            actionLabel: '前往設定',
            actionPath: '/dashboard/profile',
        },
        {
            id: 'payment_info',
            label: '匯款帳戶資訊',
            description: '設定收款銀行帳戶，確保每份報價單都能正確附上匯款資訊。',
            priority: 'red',
            actionLabel: '前往設定',
            actionPath: '/dashboard/profile',
        },
        {
            id: 'first_client',
            label: '建立第一筆客戶資料',
            description: '在客戶管理中建立第一個客戶，後續提案可自動帶入客戶資訊。',
            priority: 'yellow',
            actionLabel: '前往客戶管理',
            actionPath: '/dashboard/customers',
        },
        {
            id: 'subscription',
            label: '訂閱方案確認',
            description: '確認目前的訂閱方案符合您的使用需求。',
            priority: userTier === 'free' ? 'yellow' : 'green',
            actionLabel: '查看方案',
            actionPath: '/dashboard/settings',
        },
        {
            id: 'first_project',
            label: '建立第一個專案',
            description: '點擊頂部「+」建立第一個估價專案，開始使用職人模組。',
            priority: activeProject ? 'green' : 'yellow',
            actionLabel: '建立專案',
            actionPath: '/dashboard',
        },
    ];

    const [completedItems, setCompletedItems] = useState<Set<string>>(
        activeProject ? new Set(['first_project']) : new Set()
    );

    const markComplete = useCallback((id: string) => {
        setCompletedItems(prev => new Set([...Array.from(prev), id]));
    }, []);

    const sendMessage = useCallback((content: string) => {
        const userMsg: AdvisorMessage = {
            id: `msg_${Date.now()}`,
            advisorId: 'user',
            content,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMsg]);

        // Simulate advisor response (rule-engine, no AI quota)
        setIsAdvisorTyping(true);
        setTimeout(() => {
            const response = generateRuleResponse(content, activeAdvisor, activeProject?.data, allowedIds);
            setMessages(prev => [...prev, ...response]);
            setIsAdvisorTyping(false);
        }, 800 + Math.random() * 600);
    }, [activeAdvisor, activeProject?.data, allowedIds]);

    return (
        <AgiContext.Provider value={{
            isOpen, activeTab, openWindow, closeWindow, setActiveTab,
            healthReport,
            messages, activeAdvisor, setActiveAdvisor, sendMessage, isAdvisorTyping,
            onboardingItems, completedItems, markComplete,
            allowedIds,
        }}>
            {children}
        </AgiContext.Provider>
    );
}

export function useAgi() {
    const ctx = useContext(AgiContext);
    if (!ctx) throw new Error('useAgi must be used within AgiProvider');
    return ctx;
}

// ─────────────────────────────────────────────
//  Rule-engine response generator (no AI quota)
// ─────────────────────────────────────────────

function generateRuleResponse(
    query: string,
    advisor: AdvisorId | 'all',
    projectData?: any,
    allowedIds: string[] = []
): AdvisorMessage[] {
    const q = query.toLowerCase();
    const now = new Date();

    const makeMsg = (advisorId: AdvisorId, content: string): AdvisorMessage => ({
        id: `resp_${advisorId}_${Date.now()}_${Math.random()}`,
        advisorId,
        content,
        timestamp: now,
    });

    if (advisor === 'all') {
        const msgs: AdvisorMessage[] = [];
        
        if (allowedIds.includes('boss')) {
            msgs.push(makeMsg('boss', projectData?.budget
                ? `整體策略風險：時程與預算是否匹配，建議優先確認這個案子的驗收標準。`
                : `目前還沒有預算資訊，我沒辦法給整體意見。先把預算填進去。`));
        }

        if (allowedIds.includes('cfo')) {
            msgs.push(makeMsg('cfo', projectData?.budget
                ? `預算 ${projectData.budget}，請確認毛利是否達到 20% 以上。若包含外包，記得扣除相關成本。`
                : `缺少預算資料，帳目無法評估。`));
        }

        if (allowedIds.includes('clo')) {
            msgs.push(makeMsg('clo', `確認合約中是否有驗收期條款（建議 30 天）與著作權歸屬聲明，這是最常見的糾紛來源。`));
        }

        if (allowedIds.includes('cso')) {
            msgs.push(makeMsg('cso', projectData?.description?.length > 50
                ? `提案描述充分，建議補充「客戶預期 ROI」數據，增加說服力。`
                : `專案描述太少，競爭力不足。至少補充 100 字的需求說明。`));
        }

        if (allowedIds.includes('gm')) {
            msgs.push(makeMsg('gm', `建議先確認需求邊界，避免範疇蔓延。送出正式提案前，請客戶簽署需求確認書。`));
        }

        return msgs;
    }

    // Check if single advisor is allowed
    if (!allowedIds.includes(advisor)) {
        return [makeMsg('boss', '抱歉，您目前的權限等級無法諮詢該位顧問。')];
    }

    // Single advisor responses
    const responses: Record<AdvisorId, string[]> = {
        boss: [
            projectData?.timeline ? `時程 ${projectData.timeline} 看起來合理，但記得預留 20% 緩衝時間。` : `你沒填時程，我不知道這案子要跑多久。`,
            `這案子最大的風險是什麼？你有想過最壞的情況嗎？`,
            `別把精力放在細節上。先確認客戶付得起、願意付，再談做什麼。`,
        ],
        gm: [
            `從策略角度看，這個案子能幫你打開哪個市場？別只想著這一單。`,
            `建議分析三個競爭對手的報價區間，再決定你的定位是「品質優先」還是「速度優先」。`,
            projectData?.description ? `你的描述有提到解決方案，但沒說清楚你的差異化優勢。` : `需求描述太空洞，建議重寫。`,
        ],
        cfo: [
            projectData?.budget ? `${projectData.budget} 的預算，你的人力成本大概佔多少比例？記得算進去。` : `沒有預算我什麼都算不了。`,
            `付款條件建議：簽約 30%、交稿 50%、驗收 20%。這樣現金流最健康。`,
            `外包項目記得加上 10-15% 的管理費，這是您應得的協調成本。`,
        ],
        clo: [
            `合約一定要寫清楚「修改次數上限」，否則無限修改是最常見的糾紛。`,
            `著作權在交件並收到尾款後才轉移，這個要明確寫在合約裡。`,
            projectData?.clientTaxId ? `客戶資料有統編，可以開立合法發票。` : `缺少客戶統編，請確認客戶是否需要統一發票。`,
        ],
        cso: [
            `你的報價比市場低嗎？低價不一定拿得到案子，還可能讓客戶覺得品質有問題。`,
            `建議在提案中加入「成功案例」，三個具體的過去作品比任何說明都有說服力。`,
            `客戶最在意的是什麼？是時間、品質、還是價格？搞清楚這個，提案重點就不同了。`,
        ],
    };

    const pool = responses[advisor] || responses.boss;
    const content = pool[Math.floor(Math.random() * pool.length)];
    return [makeMsg(advisor, content)];
}
