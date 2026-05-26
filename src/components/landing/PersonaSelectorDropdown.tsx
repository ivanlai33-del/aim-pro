'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Sparkles } from 'lucide-react';
import { CATEGORY_FOLDERS, getAllItems } from '@/config/industries';

export default function PersonaSelectorDropdown({ currentId }: { currentId: string }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const modules = getAllItems();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const categories = Object.values(CATEGORY_FOLDERS);
    
    // 找出目前的職人
    const currentModule = modules.find(m => m.id === currentId);

    return (
        <div className="relative z-50" ref={menuRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md rounded-full text-white text-sm font-bold transition-all shadow-sm group"
            >
                <Sparkles className="w-4 h-4 text-amber-300" />
                {currentModule?.name || '探索其他職人'}
                <ChevronDown className={`w-4 h-4 text-white/80 transition-transform ${isOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-3 w-72 max-h-[70vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200 custom-scrollbar">
                    {categories.map((cat) => (
                        <div key={cat.id} className="mb-3 last:mb-0">
                            <div className="px-3 py-2.5 text-[14px] font-black text-slate-300 tracking-wider flex items-center gap-2.5 bg-slate-800/30 rounded-t-lg mb-1">
                                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                                {cat.name}
                            </div>
                            <div className="space-y-0.5">
                                {cat.moduleIds.map(modId => {
                                    const mod = modules.find(m => m.id === modId);
                                    if (!mod) return null;
                                    const isCurrent = mod.id === currentId;
                                    return (
                                        <button
                                            key={mod.id}
                                            onClick={() => {
                                                setIsOpen(false);
                                                router.push(`/personas/${mod.id}`);
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                                                isCurrent 
                                                    ? 'bg-blue-500/20 text-blue-300' 
                                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                            }`}
                                        >
                                            {mod.name}
                                            {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
