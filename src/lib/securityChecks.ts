// src/lib/securityChecks.ts
// 整合所有安全檢查的輔助函數

import { validateEmailForRegistration } from './emailValidation';
import { getDeviceFingerprint, checkDeviceRegistrationLimit, trackDeviceOnSignup } from './deviceFingerprint';
import { checkIPRegistrationLimit, trackIPOnSignup } from './ipTracking';
import { trackUserAction, detectSuspiciousBehavior, isAccountFlagged } from './behaviorAnalysis';
import { canStartTrial, recordTrialStart, createTrialSubscription } from './trialValidation';

export interface SecurityCheckResult {
    allowed: boolean;
    errors: string[];
    warnings: string[];
    deviceId?: string;
}

/**
 * 執行完整的註冊前安全檢查
 */
export async function performRegistrationSecurityChecks(
    email: string,
    ipAddress: string
): Promise<SecurityCheckResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    let deviceId: string | undefined;

    // 1. Email 驗證
    const emailCheck = validateEmailForRegistration(email);
    if (!emailCheck.valid && emailCheck.error) {
        errors.push(emailCheck.error);
    }

    // 2. 裝置指紋檢查
    try {
        deviceId = await getDeviceFingerprint();
        const deviceCheck = await checkDeviceRegistrationLimit(deviceId);
        if (!deviceCheck.allowed && deviceCheck.message) {
            errors.push(deviceCheck.message);
        } else if (deviceCheck.count > 1) {
            warnings.push(`此裝置已註冊 ${deviceCheck.count} 個帳號`);
        }
    } catch (error) {
        console.error('Device fingerprint check failed:', error);
        warnings.push('裝置識別失敗，已略過此檢查');
    }

    // 3. IP 檢查
    if (ipAddress && ipAddress !== 'unknown') {
        const ipCheck = await checkIPRegistrationLimit(ipAddress);
        if (!ipCheck.allowed && ipCheck.message) {
            errors.push(ipCheck.message);
        } else if (ipCheck.count > 2) {
            warnings.push(`此 IP 7 天內已註冊 ${ipCheck.count} 個帳號`);
        }
    }

    return {
        allowed: errors.length === 0,
        errors,
        warnings,
        deviceId
    };
}

/**
 * 註冊後追蹤（在成功註冊後呼叫）
 */
export async function trackSuccessfulRegistration(
    userId: string,
    deviceId: string,
    ipAddress: string
): Promise<void> {
    await Promise.all([
        trackDeviceOnSignup(userId, deviceId),
        trackIPOnSignup(userId, ipAddress),
        trackUserAction(userId, 'user_registered', { ip: ipAddress })
    ]);
}

/**
 * 檢查試用資格（整合所有檢查）
 */
export async function checkTrialEligibility(
    userId: string,
    email: string,
    moduleId: string,
    ipAddress: string
): Promise<{ eligible: boolean; reason?: string; deviceId?: string }> {
    // 1. 檢查帳號是否被標記
    const isFlagged = await isAccountFlagged(userId);
    if (isFlagged) {
        return { eligible: false, reason: '此帳號已被標記為可疑，無法使用試用功能' };
    }

    // 2. 獲取裝置指紋
    let deviceId: string;
    try {
        deviceId = await getDeviceFingerprint();
    } catch (error) {
        console.error('Failed to get device fingerprint:', error);
        return { eligible: false, reason: '無法識別裝置，請稍後再試' };
    }

    // 3. 檢查試用歷史
    const trialCheck = await canStartTrial(email, deviceId, ipAddress, moduleId);
    if (!trialCheck.allowed) {
        return { eligible: false, reason: trialCheck.reason, deviceId };
    }

    return { eligible: true, deviceId };
}

/**
 * 啟動試用（整合所有步驟）
 */
export async function startTrial(
    userId: string,
    email: string,
    moduleId: string,
    deviceId: string,
    ipAddress: string,
    trialDays: number = 7
): Promise<{ success: boolean; error?: string }> {
    // 1. 記錄試用歷史
    await recordTrialStart(email, deviceId, ipAddress, moduleId);

    // 2. 創建試用訂閱
    const result = await createTrialSubscription(userId, moduleId, trialDays);
    if (!result.success) {
        return result;
    }

    // 3. 記錄用戶行為
    await trackUserAction(userId, 'start_trial', {
        module_id: moduleId,
        trial_days: trialDays,
        device_id: deviceId,
        ip: ipAddress
    });

    return { success: true };
}

// 匯出所有子模組的函數，方便直接使用
export {
    validateEmailForRegistration,
    getDeviceFingerprint,
    trackUserAction,
    detectSuspiciousBehavior,
    isAccountFlagged
};
