// src/lib/dataMigration.ts
import { supabase } from './supabaseClient';
import { Project, Customer } from '@/context/ProjectContext';
import { toast } from 'sonner';

/**
 * 將 LocalStorage 資料遷移到 Supabase
 * @param userId 當前登入的 User ID
 */
export async function migrateDataToSupabase(userId: string) {
    console.log('Starting data migration for user:', userId);

    // 1. 讀取 LocalStorage 資料
    const localProjectsStr = localStorage.getItem('project-estimator-v2');
    const localCustomersStr = localStorage.getItem('customers-v1');
    const localProviderInfoStr = localStorage.getItem('provider-info-v1');

    // 標記是否已遷移 (避免重複執行)
    const isMigrated = localStorage.getItem(`migrated_to_supabase_${userId}`);
    if (isMigrated) {
        console.log('Data already migrated for this user.');
        return;
    }

    try {
        // --- 遷移客戶資料 (Clients) ---
        if (localCustomersStr) {
            const customers: Customer[] = JSON.parse(localCustomersStr);
            if (customers.length > 0) {
                console.log(`Migrating ${customers.length} customers...`);

                // 轉換格式以符合 Supabase Table
                const dbCustomers = customers.map(c => ({
                    id: c.id,
                    user_id: userId,
                    company_name: c.company || c.name, // Fallback
                    tax_id: c.taxId,
                    contact_person: c.name,
                    email: c.email,
                    phone: c.phone,
                    address: c.address,
                    tags: c.tags,
                    status: 'active', // Default
                    created_at: new Date(c.createdAt).toISOString()
                }));

                const { error } = await supabase.from('clients').insert(dbCustomers);
                if (error) throw error;
                console.log('Customers migrated successfully.');
            }
        }

        // --- 遷移專案資料 (Projects) ---
        if (localProjectsStr) {
            const projects: Project[] = JSON.parse(localProjectsStr);
            if (projects.length > 0) {
                console.log(`Migrating ${projects.length} projects...`);

                // 轉換格式
                const dbProjects = projects.map(p => ({
                    user_id: userId,
                    name: p.name,
                    status: 'draft',
                    data: p.data, // JSONB 直接存
                    created_at: new Date(p.createdAt).toISOString(),
                    is_active: true
                    // 注意：這裡簡化了，實際專案關聯 client_id 需要更複雜的邏輯，
                    // 但為了 MVP，我們先將所有資料存入 projects table，
                    // 詳細欄位 (quotationItems, etc) 都包含在 data 或需要擴充 columns
                }));

                // 修正：我們的 Supabase projects table 目前只有 basic columns + data (jsonb)
                // 我們需要確保 Project interface 的所有屬性都塞進 data 欄位，或者擴充 table
                // 目前策略：將完整 Project 物件存入 `data` 欄位，以便還原

                const { error } = await supabase.from('projects').insert(
                    projects.map(p => ({
                        id: p.id,
                        user_id: userId,
                        name: p.name,
                        status: 'draft',
                        data: p, // Store full object for full fidelity
                        created_at: new Date(p.createdAt).toISOString()
                    }))
                );

                if (error) throw error;
                console.log('Projects migrated successfully.');
            }
        }

        // --- 遷移公司資訊 (Provider Info) ---
        if (localProviderInfoStr) {
            console.log('Migrating provider info...');
            const { error } = await supabase.auth.updateUser({
                data: { provider_info: JSON.parse(localProviderInfoStr) }
            });
            if (error) throw error;
            console.log('Provider info migrated successfully.');
        }

        // 標記遷移完成
        localStorage.setItem(`migrated_to_supabase_${userId}`, 'true');

        // 選項：遷移後是否清除 LocalStorage? 
        // 建議保留作為備份，或詢問用戶。這裡先保留。
        toast.success('🎉 資料已成功同步到雲端！');

    } catch (error) {
        console.error('Migration failed:', error);
        toast.error('資料同步失敗，請聯繫客服');
    }
}
