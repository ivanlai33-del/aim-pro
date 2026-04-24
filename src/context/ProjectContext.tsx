'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProjectData } from '@/types/project';
import { toast } from 'sonner';
import { INDUSTRY_CATEGORIES, DEFAULT_CATEGORY, IndustryCategory, BUSINESS_MODULES } from '@/config/industries';
import { generateId } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';

// --- Interfaces ---

export interface ChatMessage {
    id: string;
    role: 'user' | 'ai' | 'system';
    content: string;
    timestamp: number;
}

export interface Customer {
    id: string;
    teamId?: string;
    name: string;
    company: string;
    taxId: string;
    email: string;
    phone: string;
    address: string;
    tags: string[];
    createdAt: number;
}

export interface QuotationItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
}

export interface Expense {
    id: string;
    date: string;
    description: string;
    amount: number;
    taxType: 'inclusive' | 'exclusive' | 'none';
    invoiceNumber?: string;
    category: 'office' | 'travel' | 'meal' | 'freelancer' | 'software' | 'other';
    withholdingTax?: number;
    nhiFee?: number;
}

export interface TimeLog {
    id: string;
    date: string;
    duration: number;
    note: string;
}

export interface ExecutionTask {
    id: string;
    quoteItemId?: string;
    name: string;
    description: string;
    type: 'internal' | 'outsourced' | 'external';
    assignee: string;
    status: 'pending' | 'in_progress' | 'completed' | 'verified';
    cost: number;
    depositPaid: number;
    contractDate?: string;
    taxDeduction?: number;
    timeLogs?: TimeLog[];
    // --- Split Accounting Fields ---
    splitType?: 'fixed' | 'percentage' | 'unit';
    splitValue?: number; // The rate (e.g. 0.4 for 40%) or unit price
    quantity?: number; // For unit-based
    budgetStatus?: 'pending_approval' | 'approved' | 'rejected'; // Approval workflow
    payoutStatus?: 'pending' | 'invoice_received' | 'paid';
    payoutDate?: string;
}

export interface Milestone {
    id: string;
    label: string;
    isCompleted: boolean;
}

export interface ProjectFlow {
    currentMilestoneId?: string;
    milestones: Milestone[];
}

export interface PaymentSchedule {
    id: string;
    label: string;
    amount: number;
    isPaid: boolean;
    dueDate?: string;
}

export interface Project {
    id: string;
    teamId?: string;
    name: string;
    data: ProjectData;
    reportContent?: string;
    chatHistory: ChatMessage[];
    createdAt: number;
    quotationItems?: QuotationItem[];
    quotationSettings?: {
        taxMode: 'exclusive' | 'inclusive' | 'none';
        riskLevel: 'low' | 'medium' | 'high';
    };
    invoiceStatus?: 'unbilled' | 'billed' | 'paid';
    invoiceNumber?: string;
    invoiceDate?: string;
    executionTasks?: ExecutionTask[];
    paymentSchedule?: PaymentSchedule[];
    projectFlow?: ProjectFlow;
    industries?: string[];
    modules: string[]; // List of active module IDs
}

export interface Team {
    id: string;
    name: string;
    role: string;
}

export interface BankInfo {
    id: string;
    bankName: string;
    branch: string;
    accountName: string;
    accountNumber: string;
}

interface ProjectContextType {
    teams: Team[];
    currentTeamId: string | null;
    currentTeamRole: string;
    switchTeam: (teamId: string) => void;
    projects: Project[];
    activeProjectId: string | null;
    createProject: () => void;
    selectProject: (id: string) => void;
    updateProjectData: (id: string, data: Partial<ProjectData>) => void;
    updateProjectReport: (id: string, report: string) => void;
    updateProjectQuotation: (id: string, items: QuotationItem[], settings: { taxMode: any, riskLevel: any }) => void;
    updateProjectInvoiceStatus: (id: string, status: 'unbilled' | 'billed' | 'paid', invoiceNumber?: string, invoiceDate?: string) => void;
    updateProjectExecution: (id: string, tasks: ExecutionTask[], schedule?: PaymentSchedule[], flow?: ProjectFlow) => void;
    addProjectIndustry: (projectId: string, industryId: string) => void;
    addProjectModule: (projectId: string, moduleId: string) => void;
    addChatMessage: (id: string, message: ChatMessage) => void;
    deleteProject: (id: string) => void;
    importProject: (project: Project) => void;
    activeProject: Project | undefined;
    providerInfo: {
        name: string;
        taxId: string;
        phone: string;
        address: string;
        contact: string;
        bankAccounts: BankInfo[];
        primaryBankId: string;
    };
    setProviderInfo: (info: {
        name: string;
        taxId: string;
        phone: string;
        address: string;
        contact: string;
        bankAccounts: BankInfo[];
        primaryBankId: string;
    }) => void;
    expenses: Expense[];
    importExpenses: (expenses: Expense[]) => void;
    addExpense: (expense: Omit<Expense, 'id'>) => void;
    updateExpense: (id: string, expense: Partial<Expense>) => void;
    deleteExpense: (id: string) => void;
    currentIndustry: IndustryCategory;
    switchIndustry: (id: string) => void;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    customers: Customer[];
    addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
    updateCustomer: (id: string, customer: Partial<Customer>) => void;
    deleteCustomer: (id: string) => void;
    userRole: string;
    setUserRole: (role: string) => void;
    userTier: SubscriptionTier;
    setUserTier: (tier: SubscriptionTier) => void;
    aiQuota: number;
    setAiQuota: (quota: number) => void;
    // --- Subscription & Persona Management ---
    currentPersona: UserPersona;
    setPersona: (persona: UserPersona) => void;
    devMode: boolean;
    setDevMode: (enabled: boolean) => void;
    tempHiddenModules: string[];
    toggleModuleVisibility: (id: string) => void;
    resetModuleVisibility: () => void;
    consumeAiQuota: () => Promise<boolean>;
    isUpgradeModalOpen: boolean;
    setUpgradeModalOpen: (open: boolean) => void;
    isSyncing: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

import { UserPersona, MOCK_PERSONAS, SubscriptionTier } from '@/config/subscription';

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    const [teams, setTeams] = useState<Team[]>([]);
    const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [currentIndustry, setCurrentIndustry] = useState<IndustryCategory>(DEFAULT_CATEGORY);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [session, setSession] = useState<any>(null);

    const [userRole, setUserRole] = useState<string>('general');
    const [userTier, setUserTier] = useState<SubscriptionTier>('free');
    const [aiQuota, setAiQuota] = useState<number>(10);

    // Subscription & Dev Mode State
    const [currentPersona, setCurrentPersona] = useState<UserPersona>(MOCK_PERSONAS[0]);
    const [devMode, setDevMode] = useState(false);
    const [tempHiddenModules, setTempHiddenModules] = useState<string[]>([]);
    const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const consumeAiQuota = async (): Promise<boolean> => {
        if (!session?.user) {
            // For local guests, just decrease local count
            if (aiQuota <= 0) {
                setUpgradeModalOpen(true);
                return false;
            }
            setAiQuota(prev => prev - 1);
            return true;
        }

        try {
            // Call Supabase function to decrement quota safely
            const { data, error } = await supabase.rpc('decrement_ai_quota', { 
                user_id: session.user.id 
            });

            if (error) {
                if (error.message.includes('quota')) {
                    setUpgradeModalOpen(true);
                    return false;
                }
                throw error;
            }

            // Sync local state
            setAiQuota(data);
            return true;
        } catch (err) {
            console.error('Error consuming AI quota:', err);
            toast.error('無法扣除 AI 額度，請稍後再試');
            return false;
        }
    };

    // Load devMode from localStorage on mount
    useEffect(() => {
        const storedDevMode = localStorage.getItem('dev_mode');
        setDevMode(storedDevMode === 'true');
    }, []);

    // Sync devMode to localStorage
    const handleSetDevMode = (enabled: boolean) => {
        setDevMode(enabled);
        localStorage.setItem('dev_mode', String(enabled));
    };

    const handleSetPersona = (persona: UserPersona) => {
        setCurrentPersona(persona);
        setUserTier(persona.tier); // Sync tier from persona
    };

    const toggleModuleVisibility = (id: string) => {
        setTempHiddenModules(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    const resetModuleVisibility = () => setTempHiddenModules([]);

    const [providerInfo, setProviderInfo] = useState<{
        name: string;
        taxId: string;
        phone: string;
        address: string;
        contact: string;
        bankAccounts: BankInfo[];
        primaryBankId: string;
    }>({
        name: '',
        taxId: '',
        phone: '',
        address: '',
        contact: '',
        bankAccounts: [],
        primaryBankId: ''
    });

    // Auth Listener & Data Loading
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user) {
                handleAuthenticatedUser(session.user.id);
                setUserTier('professional'); // Default for auth users during dev
            } else {
                loadLocalData();
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user) {
                handleAuthenticatedUser(session.user.id);
            } else {
                setUserTier('free');
                loadLocalData();
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleAuthenticatedUser = async (userId: string) => {
        // Trigger migration
        const { migrateDataToSupabase } = await import('@/lib/dataMigration');
        await migrateDataToSupabase(userId);
        // Fetch cloud data
        await fetchCloudData(userId);
    };

    const loadLocalData = () => {
        try {
            const savedTeamId = localStorage.getItem('current_team_id');
            if (savedTeamId) setCurrentTeamId(savedTeamId);

            const savedProjects = localStorage.getItem('project-estimator-v2');
            if (savedProjects) setProjects(JSON.parse(savedProjects));

            const savedCustomers = localStorage.getItem('customers-v1');
            if (savedCustomers) setCustomers(JSON.parse(savedCustomers));

            const savedRole = localStorage.getItem('user_role_v1');
            if (savedRole) setUserRole(savedRole);

            const savedTier = localStorage.getItem('user_tier_v1');
            if (savedTier) setUserTier(savedTier as any);

            const savedInfo = localStorage.getItem('provider-info-v1');
            if (savedInfo) setProviderInfo(JSON.parse(savedInfo));

            const savedExpenses = localStorage.getItem('expenses-v1');
            if (savedExpenses) setExpenses(JSON.parse(savedExpenses));

            const savedIndustry = localStorage.getItem('user_industry_preference');
            if (savedIndustry && INDUSTRY_CATEGORIES[savedIndustry]) {
                setCurrentIndustry(INDUSTRY_CATEGORIES[savedIndustry]);
            }

            const savedSidebarState = localStorage.getItem('sidebar_collapsed');
            if (savedSidebarState) setSidebarCollapsed(savedSidebarState === 'true');
        } catch (e) {
            console.error("Error loading local data:", e);
        } finally {
            setIsInitialized(true);
        }
    };
    const fetchCloudData = async (userId: string) => {
        try {
            // Try to fetch user profile
            try {
                // Fetch with select (not single) to avoid 406 if missing
                const { data: profiles, error: profileError } = await supabase
                    .from('users_profile')
                    .select('id, email, tier, ai_quota')
                    .eq('id', userId);

                let profile = profiles && profiles.length > 0 ? profiles[0] : null;

                // If no profile exists, create one automatically
                if (!profile && !profileError) {
                    const { data: newProfile, error: createError } = await supabase
                        .from('users_profile')
                        .upsert({ 
                            id: userId, 
                            email: session?.user?.email,
                            tier: 'free',
                            ai_quota: 5
                        })
                        .select()
                        .single();
                    
                    if (!createError) profile = newProfile;
                }
                
                if (profile) {
                    setUserTier(profile.tier as SubscriptionTier);
                    setAiQuota(profile.ai_quota || 0);
                }
            } catch (e) {
                console.warn('Failed to fetch user profile:', e);
            }

            // 2. Fetch Teams
            let activeTeamId = currentTeamId;
            try {
                const { data: teamMembers, error: teamsError } = await supabase
                    .from('team_members')
                    .select('role, teams(id, name)')
                    .eq('user_id', userId);

                if (!teamsError && teamMembers && teamMembers.length > 0) {
                    const parsedTeams = teamMembers.map((tm: any) => ({
                        id: tm.teams.id,
                        name: tm.teams.name,
                        role: tm.role
                    }));
                    setTeams(parsedTeams);
                    
                    if (!activeTeamId || !parsedTeams.some(t => t.id === activeTeamId)) {
                        activeTeamId = parsedTeams[0].id;
                        setCurrentTeamId(activeTeamId);
                    }
                } else if (teamMembers && teamMembers.length === 0) {
                    // Create default team for new user
                    try {
                        const { data: newTeam, error: insertError } = await supabase
                            .from('teams')
                            .insert({ name: '個人團隊' })
                            .select()
                            .single();
                            
                        if (insertError) throw insertError;
                        
                        if (newTeam) {
                            await supabase.from('team_members').insert({ 
                                team_id: newTeam.id, 
                                user_id: userId, 
                                role: 'owner' 
                            });
                            activeTeamId = newTeam.id;
                            setCurrentTeamId(activeTeamId);
                            setTeams([{ id: newTeam.id, name: newTeam.name, role: 'owner' }]);
                        }
                    } catch (err: any) {
                        console.error('Failed to create initial team:', err.message);
                    }
                }
            } catch (e) {
                console.warn('Failed to fetch/create teams:', e);
            }

            // 3. Fetch Subscription (Defensive)
            try {
                const { data: subData, error: subError } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', userId)
                    .maybeSingle();

                if (!subError && subData) {
                    setUserTier(subData.plan_id || 'free');
                }
            } catch (e) {
                console.debug('Subscriptions table not ready');
            }

            // 3. Try to fetch projects (scoped by team if available, fallback to user_id)
            try {
                let query = supabase.from('projects').select('*');
                if (activeTeamId) {
                    query = query.eq('team_id', activeTeamId);
                } else {
                    query = query.eq('user_id', userId);
                }
                const { data: cloudProjects, error: projectsError } = await query;

                if (projectsError) {
                    console.warn('Projects table not accessible:', projectsError.message);
                } else if (cloudProjects) {
                    const mappedProjects = cloudProjects.map(p => {
                        if (p.data && p.data.id) return p.data as Project;
                        return {
                            id: p.id,
                            name: p.name,
                            data: p.data,
                            createdAt: new Date(p.created_at).getTime(),
                            chatHistory: [],
                            industries: ['web'],
                            modules: ['web_development'] // Default fallback
                        } as Project;
                    });
                    setProjects(mappedProjects);
                }
            } catch (projectsError) {
                console.warn('Failed to fetch projects:', projectsError);
                // Fall back to local data
                loadLocalData();
            }

            // 4. Try to fetch clients (scoped by team if available, fallback to user_id)
            try {
                let query = supabase.from('clients').select('*');
                if (activeTeamId) {
                    query = query.eq('team_id', activeTeamId);
                } else {
                    query = query.eq('user_id', userId);
                }
                const { data: cloudCustomers, error: customersError } = await query;

                if (customersError) {
                    console.warn('Clients table not accessible:', customersError.message);
                } else if (cloudCustomers) {
                    const mappedCustomers = cloudCustomers.map(c => ({
                        id: c.id,
                        name: c.contact_person || c.company_name,
                        company: c.company_name,
                        taxId: c.tax_id || '',
                        email: c.email || '',
                        phone: c.phone || '',
                        address: c.address || '',
                        tags: c.tags || [],
                        createdAt: new Date(c.created_at).getTime()
                    }));
                    setCustomers(mappedCustomers);
                }
            } catch (customersError) {
                console.warn('Failed to fetch customers:', customersError);
            }
        } catch (error) {
            console.error("Error fetching cloud data:", error);
            // Fall back to local data if cloud fetch fails completely
            loadLocalData();
        } finally {
            setIsInitialized(true);
        }
    };

    // Persistence
    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem('project-estimator-v2', JSON.stringify(projects));
    }, [projects, isInitialized]);

    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem('provider-info-v1', JSON.stringify(providerInfo));
    }, [providerInfo, isInitialized]);

    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem('expenses-v1', JSON.stringify(expenses));
    }, [expenses, isInitialized]);

    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem('sidebar_collapsed', sidebarCollapsed.toString());
    }, [sidebarCollapsed, isInitialized]);

    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem('customers-v1', JSON.stringify(customers));
    }, [customers, isInitialized]);

    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem('user_role_v1', userRole);
    }, [userRole, isInitialized]);

    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem('user_tier_v1', userTier);
    }, [userTier, isInitialized]);

    useEffect(() => {
        if (!isInitialized) return;
        let targetIndustry = 'web';
        if (userRole === 'discord') targetIndustry = 'discord';
        else if (userRole === 'exhibition') targetIndustry = 'exhibition';
        else if (userRole === 'event') targetIndustry = 'event';

        if (INDUSTRY_CATEGORIES[targetIndustry]) {
            setCurrentIndustry(INDUSTRY_CATEGORIES[targetIndustry]);
        }
    }, [userRole, isInitialized]);

    const switchIndustry = (id: string) => {
        if (INDUSTRY_CATEGORIES[id]) {
            setCurrentIndustry(INDUSTRY_CATEGORIES[id]);
            localStorage.setItem('currentIndustry', id);
        }
    };

    const switchTeam = (teamId: string) => {
        setCurrentTeamId(teamId);
        localStorage.setItem('current_team_id', teamId);
        if (session?.user) {
            fetchCloudData(session.user.id);
        }
    };

    const createProject = async () => {
        const newProject: Project = {
            id: generateId(),
            teamId: currentTeamId || undefined,
            name: `未命名專案 ${projects.length + 1}`,
            data: {
                moduleId: currentIndustry.items[0]?.id || 'web_development',
                projectType: currentIndustry.items[0]?.projectTypes?.[0]?.id || 'general',
                projectName: `未命名專案 ${projects.length + 1}`,
                description: '',
                features: '',
            },
            chatHistory: [],
            createdAt: Date.now(),
            quotationItems: currentIndustry.items[0]?.defaultItems?.map(item => ({
                id: generateId(),
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice
            })) || [],
            quotationSettings: {
                taxMode: 'exclusive',
                riskLevel: 'medium'
            },
            invoiceStatus: 'unbilled',
            industries: [currentIndustry.id],
            modules: [currentIndustry.items[0]?.id || 'web_development']
        };

        setProjects([...projects, newProject]);
        setActiveProjectId(newProject.id);

        if (session?.user) {
            try {
                const { error } = await supabase.from('projects').insert({
                    id: newProject.id,
                    user_id: session.user.id,
                    team_id: currentTeamId,
                    name: newProject.name,
                    status: 'draft',
                    data: newProject,
                    created_at: new Date().toISOString()
                });
                if (error) throw error;
            } catch (err) {
                console.warn('Initial cloud sync failed, will retry in background:', err);
            }
        }
    };

    // Centralized Sync Helper
    const syncProjectToCloud = async (id: string, updated: Project) => {
        if (!session?.user) return;
        
        setIsSyncing(true);
        try {
            const { error } = await _applyTeamFilter(supabase.from('projects').update({ 
                name: updated.name, 
                data: updated,
                updated_at: new Date().toISOString()
            })).filter('data->>id', 'eq', id);
            
            if (error) throw error;
        } catch (err) {
            console.warn(`Background sync failed for project ${id}, remains in local cache:`, err);
        } finally {
            // Add a small delay so the user can actually see the "Saved" state
            setTimeout(() => setIsSyncing(false), 800);
        }
    };

    const _applyTeamFilter = (query: any) => {
        return currentTeamId ? query.eq('team_id', currentTeamId) : query.eq('user_id', session?.user?.id);
    };

    const addProjectIndustry = async (projectId: string, industryId: string) => {
        const industryConfig = INDUSTRY_CATEGORIES[industryId];
        if (!industryConfig) return;

        let updated: Project | undefined;
        setProjects(prev => prev.map(p => {
            if (p.id !== projectId) return p;
            if (p.industries?.includes(industryId)) {
                toast.error('該專案已包含此服務類別');
                return p;
            }

            const newItems = industryConfig.items[0]?.defaultItems?.map(item => ({
                id: generateId(),
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice
            })) || [];

            toast.success(`已增加 ${industryConfig.name} 類別`);
            updated = {
                ...p,
                industries: [...(p.industries || []), industryId],
                quotationItems: [...(p.quotationItems || []), ...newItems]
            };
            return updated;
        }));

        if (session?.user && updated) {
            await _applyTeamFilter(supabase.from('projects').update({ data: updated })).filter('data->>id', 'eq', projectId);
        }
    };

    const addProjectModule = async (projectId: string, moduleId: string) => {
        const moduleConfig = BUSINESS_MODULES[moduleId];
        if (!moduleConfig) return;

        let updated: Project | undefined;
        setProjects(prev => prev.map(p => {
            if (p.id !== projectId) return p;
            if (p.modules?.includes(moduleId)) {
                toast.error('該專案已包含此模組');
                return p;
            }

            const newItems = moduleConfig.defaultItems?.map(item => ({
                id: generateId(),
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice
            })) || [];

            toast.success(`已增加 ${moduleConfig.name} 模組`);
            updated = {
                ...p,
                modules: [...(p.modules || []), moduleId],
                quotationItems: [...(p.quotationItems || []), ...newItems]
            };
            return updated;
        }));

        if (session?.user && updated) {
            await _applyTeamFilter(supabase.from('projects').update({ data: updated })).filter('data->>id', 'eq', projectId);
        }
    };

    const selectProject = (id: string) => setActiveProjectId(id);

    const updateProjectData = async (id: string, data: Partial<ProjectData>) => {
        let updated: Project | undefined;
        setProjects(prev => prev.map(p => {
            if (p.id === id) {
                updated = { ...p, name: data.projectName !== undefined ? data.projectName : p.name, data: { ...p.data, ...data } };
                return updated;
            }
            return p;
        }));

        if (session?.user && updated) {
            syncProjectToCloud(id, updated);
        }
    };

    const updateProjectReport = async (id: string, report: string) => {
        let updated: Project | undefined;
        setProjects(prev => prev.map(p => {
            if (p.id === id) {
                updated = { ...p, reportContent: report };
                return updated;
            }
            return p;
        }));

        if (session?.user && updated) {
            syncProjectToCloud(id, updated);
        }
    };

    const updateProjectQuotation = async (id: string, items: QuotationItem[], settings: { taxMode: any, riskLevel: any }) => {
        let updated: Project | undefined;
        setProjects(prev => prev.map(p => {
            if (p.id === id) {
                updated = { ...p, quotationItems: items, quotationSettings: settings };
                return updated;
            }
            return p;
        }));

        if (session?.user && updated) {
            syncProjectToCloud(id, updated);
        }
    };

    const updateProjectInvoiceStatus = async (id: string, status: 'unbilled' | 'billed' | 'paid', invoiceNumber?: string, invoiceDate?: string) => {
        let updated: Project | undefined;
        setProjects(prev => prev.map(p => {
            if (p.id === id) {
                updated = { ...p, invoiceStatus: status, invoiceNumber, invoiceDate };
                return updated;
            }
            return p;
        }));

        if (session?.user && updated) {
            syncProjectToCloud(id, updated);
        }
    };

    const updateProjectExecution = async (id: string, tasks: ExecutionTask[], schedule?: PaymentSchedule[], flow?: ProjectFlow) => {
        let updated: Project | undefined;
        setProjects(prev => prev.map(p => {
            if (p.id === id) {
                updated = { ...p, executionTasks: tasks, paymentSchedule: schedule || p.paymentSchedule, projectFlow: flow || p.projectFlow };
                return updated;
            }
            return p;
        }));

        if (session?.user && updated) {
            syncProjectToCloud(id, updated);
        }
    };

    const addChatMessage = async (id: string, message: ChatMessage) => {
        let updated: Project | undefined;
        setProjects(prev => prev.map(p => {
            if (p.id === id) {
                updated = { ...p, chatHistory: [...p.chatHistory, message] };
                return updated;
            }
            return p;
        }));

        if (session?.user && updated) {
            syncProjectToCloud(id, updated);
        }
    };

    const deleteProject = async (id: string) => {
        setProjects(prev => prev.filter(p => p.id !== id));
        if (activeProjectId === id) setActiveProjectId(null);

        if (session?.user) {
            await _applyTeamFilter(supabase.from('projects').delete()).filter('data->>id', 'eq', id);
        }
    };

    const importProject = async (projectData: Project) => {
        if (!projectData.id || !projectData.name || !projectData.data) {
            toast.error('無效的專案檔案格式');
            return;
        }

        let newId = projectData.id;
        if (projects.some(p => p.id === newId)) {
            newId = generateId();
            projectData.id = newId;
            projectData.name = `${projectData.name} (Imported)`;
        }
        
        projectData.teamId = currentTeamId || undefined;

        setProjects(prev => [...prev, projectData]);
        setActiveProjectId(newId);

        if (session?.user) {
            await supabase.from('projects').insert({
                user_id: session.user.id,
                team_id: currentTeamId,
                name: projectData.name,
                status: 'draft',
                data: projectData
            });
        }
    };

    const addExpense = (expense: Omit<Expense, 'id'>) => {
        setExpenses(prev => [...prev, { ...expense, id: generateId() }]);
    };

    const updateExpense = (id: string, expense: Partial<Expense>) => {
        setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...expense } : e));
    };

    const deleteExpense = (id: string) => {
        setExpenses(prev => prev.filter(e => e.id !== id));
    };

    const addCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>) => {
        const newCustomer: Customer = {
            ...customer,
            id: generateId(),
            teamId: currentTeamId || undefined,
            createdAt: Date.now()
        };

        setCustomers(prev => [...prev, newCustomer]);
        toast.success(`客戶 ${customer.name} 已新增`);

        if (session?.user) {
            await supabase.from('clients').insert({
                id: newCustomer.id,
                user_id: session.user.id,
                team_id: currentTeamId,
                company_name: customer.company,
                contact_person: customer.name,
                tax_id: customer.taxId,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
                tags: customer.tags
            });
        }
    };

    const updateCustomer = async (id: string, customer: Partial<Customer>) => {
        let updated: Customer | undefined;
        setCustomers(prev => prev.map(c => {
            if (c.id === id) {
                updated = { ...c, ...customer };
                return updated;
            }
            return c;
        }));

        if (session?.user && updated) {
            await _applyTeamFilter(supabase.from('clients').update({
                company_name: updated.company,
                contact_person: updated.name,
                tax_id: updated.taxId,
                email: updated.email,
                phone: updated.phone,
                address: updated.address,
                tags: updated.tags
            })).eq('id', id);
        }
    };

    const deleteCustomer = async (id: string) => {
        setCustomers(prev => prev.filter(c => c.id !== id));
        toast.success('客戶資料已刪除');

        if (session?.user) {
            await _applyTeamFilter(supabase.from('clients').delete()).eq('id', id);
        }
    };

    const activeProject = projects.find(p => p.id === activeProjectId);
    const activeTeam = teams.find(t => t.id === currentTeamId);
    const currentTeamRole = activeTeam?.role || 'member';

    return (
        <ProjectContext.Provider value={{
            teams,
            currentTeamId,
            currentTeamRole,
            switchTeam,
            projects,
            activeProjectId,
            createProject,
            selectProject,
            updateProjectData,
            updateProjectReport,
            updateProjectQuotation,
            updateProjectInvoiceStatus,
            updateProjectExecution,
            addProjectIndustry,
            addProjectModule,
            addChatMessage,
            deleteProject,
            importProject,
            activeProject,
            providerInfo,
            setProviderInfo,
            expenses,
            importExpenses: (newExpenses: Expense[]) => setExpenses(prev => [...prev, ...newExpenses]),
            addExpense,
            updateExpense,
            deleteExpense,
            currentIndustry,
            switchIndustry,
            sidebarCollapsed,
            setSidebarCollapsed,
            customers,
            addCustomer,
            updateCustomer,
            deleteCustomer,
            userRole,
            setUserRole,
            userTier,
            setUserTier,
            aiQuota,
            setAiQuota,
            // New Subscription Props
            currentPersona,
            setPersona: handleSetPersona,
            devMode,
            setDevMode: handleSetDevMode,
            tempHiddenModules,
            toggleModuleVisibility,
            resetModuleVisibility,
            consumeAiQuota,
            isUpgradeModalOpen,
            setUpgradeModalOpen,
            isSyncing
        }}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProject() {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
}
