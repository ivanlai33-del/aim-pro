import { useProject } from '@/context/ProjectContext';
import { PRICING_CONFIG, SubscriptionTier } from '@/config/subscription';

type FeatureKey = keyof typeof PRICING_CONFIG['professional']['features'];
type LimitKey = keyof typeof PRICING_CONFIG['professional']['limits'];

interface FeatureGate {
    canAccess: (feature: FeatureKey) => boolean;
    getLimit: (limit: LimitKey) => number;
    checkLimit: (limit: LimitKey, currentUsage: number) => boolean;
    tierConfig: typeof PRICING_CONFIG[SubscriptionTier];
}

/**
 * Hook to check feature access and limits based on the current user's subscription tier.
 */
export function useFeatureGate(): FeatureGate {
    const { userTier, devMode } = useProject();

    // In dev mode, default to professional tier for testing if not specified
    const activeTier = devMode && userTier === 'free' ? 'professional' : userTier;
    const tierConfig = PRICING_CONFIG[activeTier] || PRICING_CONFIG['free'];

    const canAccess = (feature: FeatureKey): boolean => {
        if (devMode) return true;
        return tierConfig.features[feature] || false;
    };

    const getLimit = (limit: LimitKey): number => {
        return tierConfig.limits[limit];
    };

    const checkLimit = (limit: LimitKey, currentUsage: number): boolean => {
        if (devMode) return true;
        const max = tierConfig.limits[limit];

        // -1 indicates unlimited
        if (max === -1) return true;

        return currentUsage < max;
    };

    return {
        canAccess,
        getLimit,
        checkLimit,
        tierConfig
    };
}
