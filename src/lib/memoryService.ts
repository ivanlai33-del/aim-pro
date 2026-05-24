import { supabase } from './supabaseClient';

export interface ProfessionalMemory {
    id: string;
    user_id: string;
    team_id?: string;
    category: string;
    content: string;
    created_at: string;
}

export interface ProjectMemory {
    id: string;
    project_id: string;
    user_id: string;
    team_id?: string;
    content: string;
    created_at: string;
}

/**
 * 取得職人的跨案件記憶 (支援團隊共享)
 */
export async function getProfessionalMemory(userId: string, teamId?: string | null): Promise<ProfessionalMemory[]> {
    if (!userId || userId === 'guest') return [];
    
    try {
        let query = supabase.from('professional_memory').select('*');
        
        if (teamId) {
            query = query.eq('team_id', teamId);
        } else {
            query = query.eq('user_id', userId);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
            
        if (error) throw error;
        return data || [];
    } catch (e) {
        console.error('Error fetching professional memory:', e);
        return [];
    }
}

/**
 * 取得本案的短期記憶 (決策脈絡)
 */
export async function getProjectMemory(projectId: string, userId: string, teamId?: string | null): Promise<ProjectMemory[]> {
    if (!projectId || !userId || userId === 'guest') return [];
    
    try {
        let query = supabase.from('project_memory').select('*').eq('project_id', projectId);
        
        if (teamId) {
            query = query.eq('team_id', teamId);
        } else {
            query = query.eq('user_id', userId);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
            
        if (error) throw error;
        return data || [];
    } catch (e) {
        console.error('Error fetching project memory:', e);
        return [];
    }
}

/**
 * 儲存新的跨案件職人記憶 (支援團隊)
 */
export async function saveProfessionalMemory(userId: string, category: string, content: string, teamId?: string | null) {
    if (!userId || userId === 'guest') return null;
    
    try {
        const payload: any = { user_id: userId, category, content };
        if (teamId) payload.team_id = teamId;

        const { data, error } = await supabase
            .from('professional_memory')
            .insert(payload)
            .select()
            .single();
            
        if (error) throw error;
        return data;
    } catch (e) {
        console.error('Error saving professional memory:', e);
        return null;
    }
}

/**
 * 儲存本案的新短期記憶
 */
export async function saveProjectMemory(projectId: string, userId: string, content: string, teamId?: string | null) {
    if (!projectId || !userId || userId === 'guest') return null;
    
    try {
        const payload: any = { project_id: projectId, user_id: userId, content };
        if (teamId) payload.team_id = teamId;

        const { data, error } = await supabase
            .from('project_memory')
            .insert(payload)
            .select()
            .single();
            
        if (error) throw error;
        return data;
    } catch (e) {
        console.error('Error saving project memory:', e);
        return null;
    }
}
