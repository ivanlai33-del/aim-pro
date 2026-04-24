// src/lib/emailValidation.ts
// 臨時信箱域名黑名單

const DISPOSABLE_EMAIL_DOMAINS = [
    'tempmail.com',
    'guerrillamail.com',
    '10minutemail.com',
    'mailinator.com',
    'throwaway.email',
    'yopmail.com',
    'maildrop.cc',
    'getnada.com',
    'temp-mail.org',
    'fakeinbox.com',
    'trashmail.com',
    'sharklasers.com',
    'guerrillamailblock.com',
    'pokemail.net',
    'spam4.me',
    'tempinbox.com',
    'throwawaymail.com',
    'mt2014.com',
    'mt2015.com',
    'thankyou2010.com'
];

/**
 * 檢查是否為臨時信箱
 */
export function isDisposableEmail(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;
    return DISPOSABLE_EMAIL_DOMAINS.includes(domain);
}

/**
 * 驗證 Email 是否符合註冊要求
 */
export function validateEmailForRegistration(email: string): { valid: boolean; error?: string } {
    // 基本格式檢查
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, error: 'Email 格式不正確' };
    }

    // 臨時信箱檢查
    if (isDisposableEmail(email)) {
        return { valid: false, error: '不支援臨時信箱註冊，請使用正式 Email' };
    }

    return { valid: true };
}
