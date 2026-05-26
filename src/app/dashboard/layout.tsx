'use client';

import Sidebar from '@/components/Sidebar';
import SubscriptionModal from '@/components/subscription/SubscriptionModal';
import { useProject } from '@/context/ProjectContext';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isUpgradeModalOpen, setUpgradeModalOpen } = useProject();

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <main className="flex-1 overflow-y-auto relative h-screen bg-muted/30">
                <div className="w-full h-full animate-in fade-in duration-500">
                    {children}
                </div>
            </main>
            
            <SubscriptionModal 
                isOpen={isUpgradeModalOpen} 
                onClose={() => setUpgradeModalOpen(false)} 
            />
        </div>
    );
}
