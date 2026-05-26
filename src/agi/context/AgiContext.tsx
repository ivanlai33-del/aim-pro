'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from 'react';
import { useProject } from '@/context/ProjectContext';
import { useRouter } from 'next/navigation';
import { useAgiHealthCheck, AgiHealthReport } from '@/hooks/useAgiHealthCheck';
import { getProfessionalMemory, getProjectMemory, saveProjectMemory, ProfessionalMemory, ProjectMemory } from '@/lib/memoryService';
import { toast } from 'sonner';

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

    // Workflow & Multi-Agent Dashboard States
    workflowStatus: 'idle' | 'running' | 'completed' | 'error';
    currentWorkflowStep: number;
    lastDeliverables: Record<AdvisorId, { content: string; tasks?: any[] }>;
    triggerChainAnalysis: (prompt: string) => Promise<void>;
    commitMeetingResolution: (content: string) => Promise<boolean>;
    setMessages: React.Dispatch<React.SetStateAction<AdvisorMessage[]>>;

    // Custom Names
    customNames: Record<AdvisorId, string>;
    setCustomName: (id: AdvisorId, name: string) => void;

    // Action Sync
    syncActionToDashboard: (advisorId: AdvisorId, action: string, data: any) => Promise<boolean>;
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
    const { 
        activeProject, userTier, currentPersona, currentTeamId, consumeAiQuota,
        updateProjectQuotation, updateProjectExecution, updateProjectDocuments, createProjectSnapshot,
        updateProjectClientComms, updateProjectVisuals
    } = useProject();
    const userRole = currentPersona?.role || 'member';
    const allowedIds = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS.member;
    const router = useRouter();

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

    // Workflow & Multi-Agent Dashboard States
    const [workflowStatus, setWorkflowStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
    const [currentWorkflowStep, setCurrentWorkflowStep] = useState<number>(0);
    const [lastDeliverables, setLastDeliverables] = useState<Record<AdvisorId, { content: string; tasks?: any[] }>>({
        boss: { content: '' },
        gm: { content: '' },
        cfo: { content: '' },
        clo: { content: '' },
        cso: { content: '' },
    });

    // Custom Names
    const [customNames, setCustomNamesState] = useState<Record<AdvisorId, string>>({
        boss: '', gm: '', cfo: '', clo: '', cso: ''
    });

    useEffect(() => {
        try {
            const saved = localStorage.getItem('agi_custom_names');
            if (saved) setCustomNamesState(JSON.parse(saved));
        } catch (e) {}
    }, []);

    const setCustomName = useCallback((id: AdvisorId, name: string) => {
        setCustomNamesState(prev => {
            const next = { ...prev, [id]: name };
            localStorage.setItem('agi_custom_names', JSON.stringify(next));
            return next;
        });
    }, []);

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

    // Helper: Parse tasks list from GM markdown content
    const parseTasksFromMarkdown = (text: string): any[] => {
        const tasks: any[] = [];
        const lines = text.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            // Match markdown bullets: "- [ ] task name", "- task name", "1. task name"
            const match = trimmed.match(/^[-*+]\s+(?:\[[\s_xX]\]\s+)?(.*)$/) || trimmed.match(/^\d+\.\s+(.*)$/);
            if (match && match[1]) {
                const taskName = match[1].trim();
                if (taskName && taskName.length > 3 && !taskName.includes('|') && !taskName.includes('---')) {
                    tasks.push({
                        id: `agi_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                        name: taskName,
                        description: '由 AGI 總經理分析專案需求生成',
                        type: 'internal',
                        assignee: 'GM 推薦',
                        status: 'pending',
                        cost: 0,
                        depositPaid: 0,
                        splitType: 'fixed',
                        splitValue: 0,
                        payoutStatus: 'pending'
                    });
                }
            }
        }
        return tasks;
    };

    // Sequential Workflow Chain Analysis (Option B: consumes quota ONCE)
    const triggerChainAnalysis = useCallback(async (taskPrompt: string) => {
        // 1. Consume AI Quota first
        const hasQuota = await consumeAiQuota();
        if (!hasQuota) {
            toast.error('AI 額度不足，無法執行工作流。');
            return;
        }

        setWorkflowStatus('running');
        setCurrentWorkflowStep(0);

        // Sequence of advisors to consult
        const chain: AdvisorId[] = ['cfo', 'clo', 'cso', 'gm'];
        let accumulatedContext = `使用者交辦專案任務：「${taskPrompt}」\n\n`;
        const tempDeliverables = { ...lastDeliverables };

        try {
            for (let i = 0; i < chain.length; i++) {
                const advisorId = chain[i];
                setCurrentWorkflowStep(i + 1); // 1: CFO, 2: CLO, 3: CSO, 4: GM

                // Fetch response
                const res = await fetch('/api/agi-chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: accumulatedContext + `\n請針對上述交辦內容，以你的顧問角色進行深入的經營分析與給出行動建議。如果你是總經理 (GM)，請務必以列表形式 (例如 - 任務名稱) 拆解出具體的專案執行任務清單，方便使用者同步至任務看板。`,
                        advisorId: advisorId,
                        projectData: activeProject?.data || null,
                        history: [], // Let's keep input context clean
                        profMemory,
                        projMemory
                    })
                });

                if (!res.ok) {
                    throw new Error(`API call failed for ${advisorId}`);
                }

                const data = await res.json();
                
                // Parse tasks if GM
                let tasks: any[] = [];
                if (advisorId === 'gm') {
                    tasks = parseTasksFromMarkdown(data.content);
                }

                tempDeliverables[advisorId] = {
                    content: data.content,
                    tasks: tasks.length > 0 ? tasks : undefined
                };

                accumulatedContext += `\n[${advisorId.toUpperCase()} 顧問分析結果]\n${data.content}\n`;
                
                // Keep local updates reactive
                setLastDeliverables({ ...tempDeliverables });

                // Simulate typing / thinking delay
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            setWorkflowStatus('completed');
            toast.success('AGI 辦公室已完成本項任務之連鎖會商分析！');
        } catch (error) {
            console.error("Chain analysis error:", error);
            setWorkflowStatus('error');
            toast.error('工作流會商中斷，請重試。');
        }
    }, [activeProject?.data, consumeAiQuota, lastDeliverables, profMemory, projMemory]);

    const syncActionToDashboard = useCallback(async (advisorId: AdvisorId, action: string, data: any): Promise<boolean> => {
        if (!activeProject?.id) {
            toast.error('找不到作用中的專案，無法同步');
            return false;
        }

        const advisorNames: Record<string, string> = {
            cfo: '會計長',
            clo: '法務',
            gm: '總經理',
            boss: '策略大腦',
            cso: '業務'
        };
        const actorName = customNames[advisorId] || advisorNames[advisorId];

        try {
            await createProjectSnapshot(activeProject.id, `同步 ${actorName} 的 ${action} 更新`);

            switch (action) {
                case 'update_quotation':
                    if (data.items) {
                        const settings = activeProject.quotationSettings || { taxMode: 'exclusive', riskLevel: 'low' };
                        updateProjectQuotation(activeProject.id, data.items, settings);
                    }
                    break;
                case 'update_execution':
                    if (data.tasks) {
                        updateProjectExecution(activeProject.id, data.tasks, activeProject.paymentSchedule, activeProject.projectFlow);
                    }
                    break;
                case 'update_document':
                    if (data.content && data.title) {
                        const newDocs = activeProject.documents ? [...activeProject.documents] : [];
                        const existingIdx = newDocs.findIndex(d => d.title === data.title);
                        if (existingIdx >= 0) {
                            newDocs[existingIdx].content = data.content;
                            newDocs[existingIdx].updatedAt = new Date().toISOString();
                        } else {
                            newDocs.push({
                                id: crypto.randomUUID(),
                                title: data.title,
                                type: data.type || 'contract',
                                content: data.content,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString()
                            });
                        }
                        updateProjectDocuments(activeProject.id, newDocs);
                    }
                    break;
                case 'update_client_comm':
                    if (data.summary) {
                        const newLogs = activeProject.clientCommLogs ? [...activeProject.clientCommLogs] : [];
                        newLogs.push({
                            id: crypto.randomUUID(),
                            timestamp: new Date().toISOString(),
                            summary: data.summary,
                            followUpTasks: data.followUpTasks || []
                        });
                        updateProjectClientComms(activeProject.id, newLogs);
                    }
                    break;
                case 'generate_visual':
                    if (data.skill && data.philosophy) {
                        const newVisuals = activeProject.visualProposals ? [...activeProject.visualProposals] : [];
                        newVisuals.push({
                            id: crypto.randomUUID(),
                            timestamp: new Date().toISOString(),
                            skill: data.skill,
                            philosophy: data.philosophy
                        });
                        updateProjectVisuals(activeProject.id, newVisuals);
                        // 關閉 AGI 視窗並轉跳
                        setIsOpen(false);
                        const params = new URLSearchParams({
                            projectId: activeProject.id,
                            skill: data.skill,
                            philosophy: data.philosophy
                        });
                        router.push(`/visual-studio?${params.toString()}`);
                    }
                    break;
                default:
                    console.warn(`未知的 Action: ${action}`);
                    toast.error(`無法處理未知的行動指令: ${action}`);
                    return false;
            }

            toast.success(`已將 ${actorName} 的提案同步至儀表板`);
            return true;
        } catch (error) {
            console.error('Failed to sync action to dashboard:', error);
            toast.error('同步至儀表板失敗');
            return false;
        }
    }, [activeProject, customNames, createProjectSnapshot, updateProjectQuotation, updateProjectExecution, updateProjectDocuments, updateProjectClientComms, updateProjectVisuals, router]);

    // Save decision resolutions to project memory
    const commitMeetingResolution = useCallback(async (content: string) => {
        const projectId = activeProject?.id;
        const userId = currentPersona?.id;
        const teamId = currentTeamId;

        if (!projectId || !userId || userId === 'guest') {
            toast.warning('請先登入並選定專案以記錄決策。');
            return false;
        }

        try {
            const res = await saveProjectMemory(projectId, userId, content, teamId);
            if (res) {
                // Update local memory state
                setProjMemory(prev => [res, ...prev]);
                // Append system notification message
                setMessages(prev => [...prev, {
                    id: `sys_resol_${Date.now()}`,
                    advisorId: 'system',
                    content: `📋 已成功將本項會議決議記錄至專案歷史備忘錄中：「${content}」`,
                    timestamp: new Date()
                }]);
                toast.success('會議決議已成功存入決策備忘錄！');
                return true;
            }
            return false;
        } catch (e) {
            console.error('Failed to save meeting resolution:', e);
            toast.error('儲存決議失敗，請稍後再試。');
            return false;
        }
    }, [activeProject?.id, currentPersona?.id, currentTeamId]);

    const sendMessage = useCallback(async (content: string) => {
        // 1. Consume AI Quota first (Option B)
        const hasQuota = await consumeAiQuota();
        if (!hasQuota) {
            toast.error('AI 額度已用盡，請升級方案解鎖更多額度。');
            return;
        }

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
                        advisorId: 'system',
                        content: '抱歉，您目前的權限等級無法諮詢該位顧問。',
                        timestamp: new Date(),
                    }]);
                    setIsAdvisorTyping(false);
                    return;
                }

                // Prepare short history to send
                const historyPayload = history.map(msg => ({
                    sender: msg.advisorId === 'user' ? 'user' : 'ai',
                    advisorId: msg.advisorId,
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

    }, [activeAdvisor, activeProject?.data, allowedIds, profMemory, projMemory, consumeAiQuota]);

    return (
        <AgiContext.Provider value={{
            isOpen, activeTab, openWindow, closeWindow, setActiveTab,
            healthReport,
            messages, activeAdvisor, setActiveAdvisor, sendMessage, isAdvisorTyping,
            onboardingItems, completedItems, markComplete,
            allowedIds,
            workflowStatus, currentWorkflowStep, lastDeliverables,
            triggerChainAnalysis, commitMeetingResolution, setMessages,
            customNames, setCustomName, syncActionToDashboard
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
