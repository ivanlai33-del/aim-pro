'use client';

import Sidebar from '@/components/Sidebar';
import UpgradeModal from '@/components/landing/UpgradeModal';
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
            
            <UpgradeModal 
                isOpen={isUpgradeModalOpen} 
                onClose={() => setUpgradeModalOpen(false)} 
                planName="" 
                tierId=""
            />
        </div>
    );
}
