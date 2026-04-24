// src/lib/deviceFingerprint.ts
// 裝置指紋識別與追蹤

import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { supabase } from './supabaseClient';

let fpPromise: Promise<any> | null = null;

/**
 * 獲取裝置指紋 ID
 */
export async function getDeviceFingerprint(): Promise<string> {
    if (!fpPromise) {
        fpPromise = FingerprintJS.load();
    }
    const fp = await fpPromise;
    const result = await fp.get();
    return result.visitorId;
}

/**
 * 註冊時記錄裝置指紋
 */
export async function trackDeviceOnSignup(userId: string, deviceId?: string): Promise<string> {
    const finalDeviceId = deviceId || await getDeviceFingerprint();

    const { error } = await supabase.from('device_tracking').insert({
        user_id: userId,
        device_fingerprint: finalDeviceId,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        created_at: new Date().toISOString()
    });

    if (error) {
        console.error('Failed to track device:', error);
    }

    return finalDeviceId;
}

/**
 * 檢查裝置是否已註冊過多帳號
 */
export async function checkDeviceRegistrationLimit(deviceId: string): Promise<{ allowed: boolean; count: number; message?: string }> {
    const { data, error } = await supabase
        .from('device_tracking')
        .select('user_id')
        .eq('device_fingerprint', deviceId);

    if (error) {
        console.error('Failed to check device limit:', error);
        return { allowed: true, count: 0 }; // 發生錯誤時允許註冊
    }

    const count = data?.length || 0;
    const limit = 3; // 同一裝置最多註冊 3 個帳號

    return {
        allowed: count < limit,
        count: count,
        message: count >= limit ? `此裝置已達註冊上限 (${limit} 個帳號)` : undefined
    };
}
