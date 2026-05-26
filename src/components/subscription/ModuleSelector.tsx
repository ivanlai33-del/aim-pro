'use client';

import { useState } from 'react';
import { Check, Info } from 'lucide-react';
import { BusinessModule } from '@/types/industries';
import { BUSINESS_MODULES } from '@/config/industries';
import Link from 'next/link';

interface ModuleSelectorProps {
    maxSelection: number;
    initialSelected?: string[];
    onSelectionChange: (selectedIds: string[]) => void;
    addOnCost: number;
}

export default function ModuleSelector({
    maxSelection,
    initialSelected = [],
    onSelectionChange,
    addOnCost
}: ModuleSelectorProps) {
    const [selected, setSelected] = useState<string[]>(initialSelected);

    const toggleModule = (moduleId: string) => {
        const newSelected = selected.includes(moduleId)
            ? selected.filter(id => id !== moduleId)
            : [...selected, moduleId];

        setSelected(newSelected);
        onSelectionChange(newSelected);
    };

    const modules = Object.values(BUSINESS_MODULES);

    const includedCount = Math.min(selected.length, maxSelection);
    const addOnCount = Math.max(0, selected.length - maxSelection);
    const totalExtraCost = addOnCount * addOnCost;

    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 dark:bg-cyan-900/20 p-4 rounded-lg flex items-start gap-3 border border-transparent dark:border-cyan-500/20">
                <Info className="w-5 h-5 text-indigo-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold text-indigo-900 dark:text-cyan-100 text-sm">模組選擇說明</h4>
                    <p className="text-sm text-indigo-700 dark:text-cyan-300">
                        您的方案包含 <span className="font-bold text-indigo-900 dark:text-white">{maxSelection} 個免費模組</span>。
                        若選擇超過 {maxSelection} 個，第 {maxSelection + 1} 個起將收取加購費 <span className="font-bold text-indigo-900 dark:text-white">+${addOnCost}/個</span>。
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {modules.map((mod) => {
                    const isSelected = selected.includes(mod.id);
                    const isIncludedInPlan = isSelected && selected.indexOf(mod.id) < maxSelection;
                    const isAddOn = isSelected && !isIncludedInPlan;

                    return (
                        <div
                            key={mod.id}
                            onClick={() => toggleModule(mod.id)}
                            className={`
                                relative p-4 rounded-xl border-2 cursor-pointer transition-all
                                ${isSelected
                                    ? 'border-indigo-600 bg-indigo-50/50 dark:border-cyan-400 dark:bg-slate-800/80 dark:shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                                    : 'border-black/30 hover:border-black/40 bg-white dark:border-slate-700 dark:hover:border-slate-500 dark:bg-slate-900/50'
                                }
                            `}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h5 className="font-bold text-slate-900 dark:text-white">{mod.name}</h5>
                                <div className={`
                                    w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                    ${isSelected
                                        ? 'border-indigo-600 bg-indigo-600 dark:border-cyan-400 dark:bg-cyan-400'
                                        : 'border-black/30 dark:border-slate-600'
                                    }
                                `}>
                                    {isSelected && <Check className="w-3 h-3 text-white dark:text-slate-900" />}
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
                                {mod.description}
                            </p>
                            
                            <div className="flex justify-end mt-2">
                                <Link
                                    href={`/personas/${mod.id}`}
                                    target="_blank"
                                    onClick={(e) => e.stopPropagation()} // 避免觸發卡片的點擊選取
                                    className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline dark:text-cyan-400 dark:hover:text-cyan-300"
                                >
                                    <Info className="w-3 h-3" />
                                    了解詳情
                                </Link>
                            </div>

                            {/* Badge */}
                            {isSelected && (
                                <div className="absolute top-2 right-2">
                                    {isIncludedInPlan ? (
                                        <span className="text-[10px] font-bold bg-green-100 text-green-700 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border dark:border-emerald-500/30 px-2 py-0.5 rounded-full">
                                            方案包含
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 dark:bg-amber-500/20 dark:text-amber-400 dark:border dark:border-amber-500/30 px-2 py-0.5 rounded-full">
                                            +${addOnCost} 加購
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Selection Summary */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-black/30 dark:border-slate-700/50 mt-8">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">已選模組：</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selected.length} 個</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 dark:text-slate-500">
                        (內含 {includedCount} 個 + 加購 {addOnCount} 個)
                    </span>
                    {addOnCount > 0 && (
                        <span className="font-bold text-indigo-600 dark:text-cyan-400">
                            加購費：+${totalExtraCost}/月
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
