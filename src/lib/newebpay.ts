import crypto from 'crypto';

const MERCHANT_ID = process.env.NEXT_PUBLIC_NEWEBPAY_MERCHANT_ID || '';
const HASH_KEY = process.env.NEWEBPAY_HASH_KEY || '';
const HASH_IV = process.env.NEWEBPAY_HASH_IV || '';

/**
 * Encrypt TradeInfo for NewebPay
 * Uses AES-256-CBC with PKCS7 padding
 */
export function encryptTradeInfo(data: any): string {
    // 1. Convert object to URL query string
    const params = new URLSearchParams();
    Object.keys(data).forEach(key => {
        params.append(key, data[key]);
    });
    const queryString = params.toString();

    // 2. Padding logic (PKCS7) - Node's crypto handles this by default for block ciphers
    const cipher = crypto.createCipheriv('aes-256-cbc', HASH_KEY, HASH_IV);
    let encrypted = cipher.update(queryString, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
}

/**
 * Decrypt TradeInfo from NewebPay
 */
export function decryptTradeInfo(encryptedHex: string): any {
    const decipher = crypto.createDecipheriv('aes-256-cbc', HASH_KEY, HASH_IV);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    // Remove padding characters if any (PKCS7)
    // Node's decipher.final handles this automatically usually.
    
    // Parse query string back to object
    const params = new URLSearchParams(decrypted);
    const result: any = {};
    params.forEach((value, key) => {
        result[key] = value;
    });

    return result;
}

/**
 * Generate TradeSha
 * SHA256(HashKey + TradeInfo + HashIV)
 */
export function generateTradeSha(tradeInfoHex: string): string {
    const shaString = `HashKey=${HASH_KEY}&${tradeInfoHex}&HashIV=${HASH_IV}`;
    return crypto.createHash('sha256').update(shaString).digest('hex').toUpperCase();
}

/**
 * Helper to generate order data based on plan
 */
export function generateOrderData(
    userId: string,
    tier: string,
    amount: number,
    itemDesc: string,
    clientBackUrl: string,
    notifyUrl: string
) {
    const timestamp = Math.floor(Date.now() / 1000);
    const orderNumber = `ORD_${timestamp}_${userId.substring(0, 8)}`;

    return {
        MerchantID: MERCHANT_ID,
        RespondType: 'JSON',
        TimeStamp: timestamp.toString(),
        Version: '2.0',
        MerchantOrderNo: orderNumber,
        Amt: amount,
        ItemDesc: itemDesc,
        Email: '', // Optional, but recommended
        LoginType: 0,
        NotifyURL: notifyUrl,
        ReturnURL: clientBackUrl,
        ClientBackURL: clientBackUrl,
        OrderComment: `Upgrade to ${tier} plan`,
    };
}
