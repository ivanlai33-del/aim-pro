'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from 'react';
import { useProject } from '@/context/ProjectContext';
import { useAgiHealthCheck, AgiHealthReport } from '@/hooks/useAgiHealthCheck';
import { getProfessionalMemory, getProjectMemory, ProfessionalMemory, ProjectMemory } from '@/lib/memoryService';

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
    const { activeProject, userTier, currentPersona, currentTeamId } = useProject();
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

    // Memory state
    const [profMemory, setProfMemory] = useState<ProfessionalMemory[]>([]);
    const [projMemory, setProjMemory] = useState<ProjectMemory[]>([]);

    // Fetch memory
    useEffect(() => {
        const fetchMemories = async () => {
            const userId = currentPersona?.id;
            const projectId = activeProject?.id;
            const teamId = currentTeamId;
            
            if (userId && userId !== 'guest') {
                const pMem = await getProfessionalMemory(userId, teamId);
                setProfMemory(pMem);
            }
            if (projectId && userId && userId !== 'guest') {
                const pProj = await getProjectMemory(projectId, userId, teamId);
                setProjMemory(pProj);
            }
        };
        fetchMemories();
    }, [currentPersona?.id, activeProject?.id, currentTeamId]);

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

    const sendMessage = useCallback(async (content: string) => {
        const userMsg: AdvisorMessage = {
            id: `msg_${Date.now()}`,
            advisorId: 'user',
            content,
            timestamp: new Date(),
        };

        setMessages(prev => {
            const updated = [...prev, userMsg];
            // Immediately start AI fetch with the new history
            fetchAiResponse(updated);
            return updated;
        });

        const fetchAiResponse = async (history: AdvisorMessage[]) => {
            setIsAdvisorTyping(true);
            try {
                // Determine which advisors to ask
                const targetAdvisors = activeAdvisor === 'all' 
                    ? ['boss', 'gm', 'cfo', 'clo', 'cso'].filter(id => allowedIds.includes(id))
                    : (allowedIds.includes(activeAdvisor) ? [activeAdvisor] : []);

                if (targetAdvisors.length === 0) {
                    setMessages(prev => [...prev, {
                        id: `resp_sys_${Date.now()}`,
                        advisorId: 'boss',
                        content: '抱歉，您目前的權限等級無法諮詢該位顧問。',
                        timestamp: new Date(),
                    }]);
                    setIsAdvisorTyping(false);
                    return;
                }

                // Prepare short history to send
                const historyPayload = history.map(msg => ({
                    sender: msg.advisorId === 'user' ? 'user' : 'ai',
                    content: msg.content
                }));

                // Fetch real AI responses in parallel
                const promises = targetAdvisors.map(async (advisorId) => {
                    const res = await fetch('/api/agi-chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            message: content,
                            advisorId: advisorId,
                            projectData: activeProject?.data || null,
                            history: historyPayload,
                            profMemory,
                            projMemory
                        })
                    });
                    
                    if (!res.ok) {
                        const errData = await res.json().catch(() => ({}));
                        throw new Error(errData.error || `API request failed for ${advisorId}`);
                    }
                    const data = await res.json();
                    
                    return {
                        id: `resp_${advisorId}_${Date.now()}_${Math.random()}`,
                        advisorId: advisorId as AdvisorId,
                        content: data.content,
                        timestamp: new Date(),
                    };
                });

                const responses = await Promise.all(promises);
                
                setMessages(prev => [...prev, ...responses]);
            } catch (error) {
                console.error("AGI Chat Error:", error);
                setMessages(prev => [...prev, {
                    id: `resp_err_${Date.now()}`,
                    advisorId: 'system' as AdvisorId | 'system',
                    content: '連線至 AGI 伺服器失敗，請稍後再試。',
                    timestamp: new Date(),
                }]);
            } finally {
                setIsAdvisorTyping(false);
            }
        };

    }, [activeAdvisor, activeProject?.data, allowedIds, profMemory, projMemory]);

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

// (The mock rule-engine has been removed as the system is now fully integrated with Gemini AI)
