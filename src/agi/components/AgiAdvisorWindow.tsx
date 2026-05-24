'use client';

import { useAgi } from '../context/AgiContext';
import { ShieldCheck, Users, CheckSquare, X, GripHorizontal, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AgiHealthTab from '../tabs/AgiHealthTab';
import AgiMeetingTab from '../tabs/AgiMeetingTab';
import AgiOnboardingTab from '../tabs/AgiOnboardingTab';
import type { AgiTab } from '../context/AgiContext';

const TABS: { id: AgiTab; label: string; icon: React.ReactNode }[] = [
    { id: 'health', label: '健診', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'meeting', label: '顧問室', icon: <Users className="w-4 h-4" /> },
    { id: 'onboarding', label: '建置提醒', icon: <CheckSquare className="w-4 h-4" /> },
];

export default function AgiAdvisorWindow() {
    const { isOpen, closeWindow, activeTab, setActiveTab, healthReport, onboardingItems, completedItems } = useAgi();
    const router = useRouter();

    // Draggable state
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const dragging = useRef(false);
    const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });

    const onMouseDown = useCallback((e: React.MouseEvent) => {
        dragging.current = true;
        dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };

        const onMove = (ev: MouseEvent) => {
            if (!dragging.current) return;
            setPos({
                x: dragStart.current.px + (ev.clientX - dragStart.current.mx),
                y: dragStart.current.py + (ev.clientY - dragStart.current.my),
            });
        };
        const onUp = () => {
            dragging.current = false;
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    }, [pos]);

    if (!isOpen) return null;

    // Alert counts for tab badges
    const healthAlerts = healthReport.blockingCount + healthReport.warningCount;
    const onboardingAlerts = onboardingItems.filter(
        i => i.priority !== 'green' && !completedItems.has(i.id)
    ).length;

    return (
        <div
            className="fixed flex flex-col rounded-3xl shadow-[0_30px_100px_0_rgba(0,0,0,0.6)] border-2 border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-900 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300"
            style={{
                width: 380,
                height: 560,
                bottom: `calc(1.5rem + ${-pos.y}px)`,
                right: `calc(1.5rem + ${-pos.x}px)`,
                zIndex: 999999, // Absolute top priority
                opacity: 1,
            }}
        >
            {/* Title bar — drag handle */}
            <div
                onMouseDown={onMouseDown}
                className="flex items-center gap-2 px-5 py-4 bg-gradient-to-r from-cyan-400 via-cyan-500 to-emerald-500 cursor-grab active:cursor-grabbing select-none shrink-0"
            >
                <GripHorizontal className="w-4 h-4 text-white/50" />
                <span className="text-sm font-black text-white flex-1 tracking-wide">🏢 AGI 顧問室</span>
                <button
                    onClick={() => {
                        router.push('/dashboard/agi-office');
                        closeWindow();
                    }}
                    className="p-1.5 rounded-lg text-slate-900/60 hover:text-slate-900 hover:bg-black/5 transition-all mr-1"
                    title="進入完整辦公室"
                >
                    <Maximize2 className="w-4 h-4" />
                </button>
                <button
                    onClick={closeWindow}
                    className="p-1.5 rounded-lg text-slate-900/60 hover:text-slate-900 hover:bg-black/5 transition-all"
                    title="關閉顧問室"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Tab bar */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0">
                {TABS.map((tab) => {
                    const alertCount = tab.id === 'health' ? healthAlerts : tab.id === 'onboarding' ? onboardingAlerts : 0;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold transition-all relative",
                                activeTab === tab.id
                                    ? "text-cyan-600 dark:text-cyan-400 border-b-2 border-emerald-500 bg-white dark:bg-slate-900"
                                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            )}
                        >
                            {tab.icon}
                            {tab.label}
                            {alertCount > 0 && (
                                <span className="absolute top-1.5 right-2 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[8px] font-black">
                                    {alertCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-hidden">
                {activeTab === 'health' && <AgiHealthTab />}
                {activeTab === 'meeting' && <AgiMeetingTab />}
                {activeTab === 'onboarding' && <AgiOnboardingTab />}
            </div>
        </div>
    );
}
