export interface ProjectData {
    moduleId: string;
    projectType: string;
    projectName: string;
    description: string;
    features: string;
    budget?: string;
    timeline?: string;
    existingTech?: string; // Only for 'web'
    websiteUrl?: string;   // Only for 'web'
    optimizationGoals?: string;
    styleReferences?: string; // New field for non-web projects
    // Client Data
    clientCompany?: string;
    clientTaxId?: string;
    clientContact?: string;
    clientPhone?: string;
    clientAddress?: string;
}
