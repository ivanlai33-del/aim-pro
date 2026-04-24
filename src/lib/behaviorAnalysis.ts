// src/lib/behaviorAnalysis.ts
// 用戶行為追蹤與異常偵測

import { supabase } from './supabaseClient';

/**
 * 記錄用戶行為
 */
export async function trackUserAction(
    userId: string,
    action: string,
    metadata?: Record<string, any>
): Promise<void> {
    const { error } = await supabase.from('user_activity_logs').insert({
        user_id: userId,
        action: action,
        metadata: metadata || null,
        created_at: new Date().toISOString()
    });

    if (error) {
        console.error('Failed to track user action:', error);
    }
}

/**
 * 偵測可疑行為
 */
export async function detectSuspiciousBehavior(userId: string): Promise<{
    suspicious: boolean;
    reason?: string;
    severity?: 'low' | 'medium' | 'high';
}> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data: recentLogs, error } = await supabase
        .from('user_activity_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', oneHourAgo);

    if (error || !recentLogs) {
        console.error('Failed to fetch activity logs:', error);
        return { suspicious: false };
    }

    // 異常模式 1：1 小時內生成超過 20 份報告
    const reportCount = recentLogs.filter(l => l.action === 'generate_report').length;
    if (reportCount > 20) {
        return {
            suspicious: true,
            reason: '異常高頻使用 AI 生成功能 (1 小時內 20+ 次)',
            severity: 'high'
        };
    }

    // 異常模式 2：1 小時內創建超過 15 個專案
    const projectCount = recentLogs.filter(l => l.action === 'create_project').length;
    if (projectCount > 15) {
        return {
            suspicious: true,
            reason: '異常高頻創建專案 (1 小時內 15+ 個)',
            severity: 'medium'
        };
    }

    // 異常模式 3：註冊後 5 分鐘內就大量使用
    const { data: user } = await supabase.auth.getUser();
    if (user?.user) {
        const accountAge = Date.now() - new Date(user.user.created_at).getTime();
        if (accountAge < 5 * 60 * 1000 && recentLogs.length > 10) {
            return {
                suspicious: true,
                reason: '新帳號立即大量使用 (註冊 5 分鐘內 10+ 次操作)',
                severity: 'high'
            };
        }
    }

    return { suspicious: false };
}

/**
 * 標記可疑帳號
 */
export async function flagSuspiciousAccount(
    userId: string,
    reason: string
): Promise<void> {
    const { error } = await supabase
        .from('users_profile')
        .update({
            is_flagged: true,
            flag_reason: reason,
            flagged_at: new Date().toISOString()
        })
        .eq('id', userId);

    if (error) {
        console.error('Failed to flag account:', error);
    }
}

/**
 * 檢查帳號是否被標記
 */
export async function isAccountFlagged(userId: string): Promise<boolean> {
    const { data, error } = await supabase
        .from('users_profile')
        .select('is_flagged')
        .eq('id', userId)
        .single();

    if (error || !data) {
        return false;
    }

    return data.is_flagged === true;
}
