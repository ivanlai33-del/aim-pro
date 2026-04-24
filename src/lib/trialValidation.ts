// src/lib/trialValidation.ts
// 試用期資格檢查與防濫用

import { supabase } from './supabaseClient';

/**
 * Hash Email (使用簡單的 hash 函數，瀏覽器環境可用)
 */
function hashEmail(email: string): string {
    // 簡單的 hash 函數 (生產環境建議使用 crypto-js 或類似庫)
    let hash = 0;
    const str = email.toLowerCase();
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
}

/**
 * 檢查是否可以開始試用 (使用 Secure RPC)
 */
export async function canStartTrial(
    email: string,
    deviceId: string,
    ipAddress: string,
    moduleId: string
): Promise<{ allowed: boolean; reason?: string }> {
    const emailHash = hashEmail(email);

    // 呼叫 RPC 函數進行安全檢查
    const { data: result, error } = await supabase.rpc('check_trial_eligibility', {
        p_email_hash: emailHash,
        p_device_fingerprint: deviceId,
        p_ip_address: ipAddress,
        p_module_id: moduleId
    });

    if (error) {
        console.error('Failed to check trial eligibility via RPC:', error);
        // 安全起見，如果 RPC 失敗，我們應該記錄錯誤但不阻擋使用者（或者阻擋，視策略而定）
        // 這裡選擇允許，避免系統故障導致無法試用
        return { allowed: true };
    }

    // RPC 回傳格式為 jsonb: { allowed: boolean, reason?: string }
    // 需要轉型
    const checkResult = result as { allowed: boolean; reason?: string };

    if (!checkResult.allowed) {
        return {
            allowed: false,
            reason: checkResult.reason
        };
    }

    return { allowed: true };
}

/**
 * 記錄試用開始 (使用 Secure RPC)
 */
export async function recordTrialStart(
    email: string,
    deviceId: string,
    ipAddress: string,
    moduleId: string
): Promise<void> {
    const emailHash = hashEmail(email);

    const { error } = await supabase.rpc('record_trial_start', {
        p_email_hash: emailHash,
        p_device_fingerprint: deviceId,
        p_ip_address: ipAddress,
        p_module_id: moduleId
    });

    if (error) {
        console.error('Failed to record trial start via RPC:', error);
    }
}

/**
 * 創建試用訂閱
 */
export async function createTrialSubscription(
    userId: string,
    moduleId: string,
    trialDays: number = 7
): Promise<{ success: boolean; error?: string }> {
    const endDate = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000);

    const { error } = await supabase.from('subscriptions').insert({
        user_id: userId,
        module_id: moduleId,
        plan_type: 'trial',
        start_date: new Date().toISOString(),
        end_date: endDate.toISOString(),
        status: 'active',
        amount_paid: 0,
        is_trial: true
    });

    if (error) {
        console.error('Failed to create trial subscription:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}
