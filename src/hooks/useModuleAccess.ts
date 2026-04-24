import { useProject } from '@/context/ProjectContext';

type AccessStatus = {
    hasAccess: boolean;
    reason: 'subscription' | 'dev_mode' | 'locked';
};

/**
 * Hook to check if the current user has access to a specific business module.
 * @param moduleId Optional. If provided, returns the status for that specific module.
 */
export function useModuleAccess(moduleId: string): AccessStatus;
export function useModuleAccess(): { checkAccess: (id: string) => boolean };
export function useModuleAccess(moduleId?: string) {
    const { currentPersona, devMode, tempHiddenModules } = useProject();

    const checkAccess = (id: string): boolean => {
        // 0. Manual Hidden Override (Highest Priority for Dev Testing)
        if (tempHiddenModules && tempHiddenModules.includes(id)) return false;

        // 1. Developer Mode Override
        if (devMode) return true;

        // 2. Persona Check
        if (!currentPersona) return false;

        // 3. Subscription Check
        // Company tier unlocks everything (usually handled by data, but good as fallback)
        if (currentPersona.tier === 'enterprise') return true;

        // specific unlocks (Base Plan + Add-ons)
        return (
            currentPersona.unlockedModules.includes(id) ||
            (currentPersona.addOnModules && currentPersona.addOnModules.includes(id))
        );
    };

    if (moduleId) {
        const hasAccess = checkAccess(moduleId);
        const reason: AccessStatus['reason'] = devMode
            ? 'dev_mode'
            : (hasAccess ? 'subscription' : 'locked');

        return { hasAccess, reason };
    }

    return { checkAccess };
}
