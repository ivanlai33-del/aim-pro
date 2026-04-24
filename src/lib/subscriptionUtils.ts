import { PRICING_CONFIG, SubscriptionTier, PricingPeriod } from '@/config/subscription';

interface PriceCalculation {
    basePrice: number;
    addOnsCost: number;
    totalPrice: number;
    currency: string;
    details: {
        tierName: string;
        billingPeriod: string;
        addOnCount: number;
        addOnUnitProce: number;
    }
}

/**
 * Calculates the total subscription price based on tier, period, and add-ons.
 * Enforces the rule: Add-ons do NOT get yearly discount.
 * Yearly Add-on Cost = Monthly Add-on Price * 12.
 */
export function calculateSubscriptionPrice(
    tier: SubscriptionTier,
    period: PricingPeriod,
    addOnCount: number
): PriceCalculation {
    const config = PRICING_CONFIG[tier];
    const currency = 'TWD';

    // 1. Base Price
    const basePrice = config.price[period];

    // 2. Add-on Price
    let addOnUnitPrice = 0;

    if (period === 'monthly') {
        addOnUnitPrice = config.addOnPrices.generalModule;
    } else {
        // Yearly: Our current logic dictates NO discount for add-ons, so it should be monthly * 12
        addOnUnitPrice = config.addOnPrices.generalModule * 12;
    }

    const addOnsCost = addOnUnitPrice * addOnCount;

    // 3. Total
    const totalPrice = basePrice + addOnsCost;

    return {
        basePrice,
        addOnsCost,
        totalPrice,
        currency,
        details: {
            tierName: config.name,
            billingPeriod: period === 'monthly' ? '月繳' : '年繳',
            addOnCount,
            addOnUnitProce: addOnUnitPrice // Keep the typo in property name for backward compatibility or change if needed. Actually I'll just change it.
        }
    };
}

/**
 * Formats price with currency symbol and commas
 */
export function formatPrice(amount: number): string {
    return new Intl.NumberFormat('zh-TW', {
        style: 'currency',
        currency: 'TWD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}
