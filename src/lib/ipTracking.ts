// src/lib/ipTracking.ts
// IP 追蹤與註冊限制

import { supabase } from './supabaseClient';

/**
 * 註冊時記錄 IP 地址
 */
export async function trackIPOnSignup(userId: string, ipAddress: string): Promise<void> {
    const { error } = await supabase.from('ip_tracking').insert({
        user_id: userId,
        ip_address: ipAddress,
        created_at: new Date().toISOString()
    });

    if (error) {
        console.error('Failed to track IP:', error);
    }
}

/**
 * 檢查 IP 是否已註冊過多帳號
 */
export async function checkIPRegistrationLimit(ipAddress: string): Promise<{ allowed: boolean; count: number; message?: string }> {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
        .from('ip_tracking')
        .select('user_id')
        .eq('ip_address', ipAddress)
        .gte('created_at', sevenDaysAgo);

    if (error) {
        console.error('Failed to check IP limit:', error);
        return { allowed: true, count: 0 }; // 發生錯誤時允許註冊
    }

    const count = data?.length || 0;
    const limit = 5; // 同一 IP 7 天內最多註冊 5 個帳號

    return {
        allowed: count < limit,
        count: count,
        message: count >= limit ? `此 IP 已達註冊上限 (7 天內 ${limit} 個帳號)` : undefined
    };
}

/**
 * 從 Request 中獲取客戶端 IP
 * (需要在 API Route 中使用)
 */
export function getClientIP(headers: Headers): string {
    return (
        headers.get('x-forwarded-for')?.split(',')[0] ||
        headers.get('x-real-ip') ||
        'unknown'
    );
}
