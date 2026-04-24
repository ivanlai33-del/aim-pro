// src/types/industries.ts
// 核心型別定義，避免循環引用

export interface QuotationItemTemplate {
    description: string;
    unitPrice: number;
    quantity: number;
}

export interface BusinessModule {
    id: string;
    name: string;
    description: string;
    categoryId: 'web' | 'marketing' | 'design' | 'space' | 'consulting' | 'pro_service' | string;
    tagline?: string;
    targetUser?: string;
    painPoints?: string[];
    corePrompt: string;
    formConfig: {
        descriptionPlaceholder: string;
        timelineLabel: string;
        timelinePlaceholder: string;
        stylePlaceholder: string;
        deliverablesLabel: string;
        deliverablesPlaceholder: string;
        customFields: any[];
    };
    aiPrompts: {
        reportGeneration: string;
        customerChat: string;
        quotationSuggestion: string;
    };
    reportTemplate: {
        structure: string;
        terminology: Record<string, string>;
        analysisDimensions: string[];
    };
    contractHighlights: {
        mustHaveClauses: string[];
        industrySpecificClauses: string[];
        acceptanceCriteria: string[];
        paymentMilestones: { stage: string, percentage: number, trigger: string }[];
    };
    quotationConfig: {
        categoryName: string;
        unit: string;
        terminology: Record<string, string>;
        defaultItems: any[];
    };
    communicationScripts?: {
        opening: string;
        discoveryQuestions: string[];
        objectionHandling: Record<string, string>;
        closing: string;
    };
    taskConfig?: {
        typicalTasks: { name: string, type: string, duration: string, assignee: string }[];
        milestones: { label: string, order: number }[];
        workflow: {
            diagram: string;
            description: string;
        };
    };
    defaultItems: QuotationItemTemplate[];
    projectTypes: { id: string, label: string, description: string }[];
}

export interface CategoryFolder {
    id: string;
    name: string;
    description: string;
    icon: any;
    moduleIds: string[];
    workflow: any;
}

export interface IndustryCategory {
    id: string;
    name: string;
    description: string;
    icon: any;
    items: BusinessModule[];
    workflow: any;
}
