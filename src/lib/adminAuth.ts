import { supabase } from './supabaseClient';

/**
 * 檢查當前用戶是否為管理員
 * @returns {Promise<{authorized: boolean, redirect?: string, user?: any}>}
 */
export async function checkAdminAccess() {
    try {
        // 1. 檢查是否已登入
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return {
                authorized: false,
                redirect: '/login'
            };
        }

        // 2. 檢查用戶角色
        const { data: profile, error: profileError } = await supabase
            .from('users_profile')
            .select('is_admin, email')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            console.error('Error fetching profile:', profileError);
            return {
                authorized: false,
                redirect: '/dashboard'
            };
        }

        // 3. 驗證是否為 admin
        if (!profile.is_admin) {
            return {
                authorized: false,
                redirect: '/dashboard'
            };
        }

        // 4. 授權成功
        return {
            authorized: true,
            user: {
                id: user.id,
                email: user.email,
                role: 'admin'
            }
        };

    } catch (error) {
        console.error('Admin access check error:', error);
        return {
            authorized: false,
            redirect: '/login'
        };
    }
}

/**
 * 檢查用戶是否為管理員（僅返回 boolean）
 * @returns {Promise<boolean>}
 */
export async function isAdmin(): Promise<boolean> {
    const { authorized } = await checkAdminAccess();
    return authorized;
}

/**
 * 獲取當前管理員資訊
 * @returns {Promise<{id: string, email: string, role: string} | null>}
 */
export async function getAdminUser() {
    const { authorized, user } = await checkAdminAccess();
    return authorized ? user : null;
}
