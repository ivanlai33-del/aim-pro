'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import { TAIWAN_BANKS, Bank, BankBranch } from '@/config/taiwan-banks';
import { cn } from '@/lib/utils';

interface BankBranchSelectorProps {
    bankName: string;
    branch: string;
    onBankChange: (value: string) => void;
    onBranchChange: (value: string) => void;
    className?: string;
}

export default function BankBranchSelector({
    bankName,
    branch,
    onBankChange,
    onBranchChange,
    className
}: BankBranchSelectorProps) {
    const [isBankOpen, setIsBankOpen] = useState(false);
    const [isBranchOpen, setIsBranchOpen] = useState(false);
    const [bankSearch, setBankSearch] = useState('');
    const [branchSearch, setBranchSearch] = useState('');
    
    const bankRef = useRef<HTMLDivElement>(null);
    const branchRef = useRef<HTMLDivElement>(null);

    // Filter banks based on search
    const filteredBanks = useMemo(() => {
        if (!bankSearch) return TAIWAN_BANKS.slice(0, 50); // Show top 50 by default
        const search = bankSearch.toLowerCase();
        return TAIWAN_BANKS.filter(bank => 
            bank.name.toLowerCase().includes(search) || 
            bank.code.includes(search)
        );
    }, [bankSearch]);

    // Find current selected bank to get its branches
    const selectedBank = useMemo(() => {
        // Extract bank code if present in the string (e.g., "台新銀行 (812)")
        const codeMatch = bankName.match(/\((\d+)\)/);
        const code = codeMatch ? codeMatch[1] : null;
        if (code) {
            return TAIWAN_BANKS.find(b => b.code === code);
        }
        // Fallback: search by name
        return TAIWAN_BANKS.find(b => bankName.includes(b.name) || b.name.includes(bankName));
    }, [bankName]);

    const filteredBranches = useMemo(() => {
        if (!selectedBank) return [];
        if (!branchSearch) return selectedBank.branches.slice(0, 50);
        const search = branchSearch.toLowerCase();
        return selectedBank.branches.filter(br => 
            br.name.toLowerCase().includes(search) || 
            br.code.includes(search)
        );
    }, [selectedBank, branchSearch]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (bankRef.current && !bankRef.current.contains(event.target as Node)) {
                setIsBankOpen(false);
            }
            if (branchRef.current && !branchRef.current.contains(event.target as Node)) {
                setIsBranchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleBankSelect = (bank: Bank) => {
        onBankChange(`${bank.name} (${bank.code})`);
        setBankSearch('');
        setIsBankOpen(false);
    };

    const handleBranchSelect = (br: BankBranch) => {
        onBranchChange(`${br.name} (${br.code})`);
        setBranchSearch('');
        setIsBranchOpen(false);
    };

    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>
            {/* Bank Selector */}
            <div className="relative" ref={bankRef}>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">銀行名稱</label>
                <div className="relative group">
                    <input
                        value={isBankOpen ? bankSearch : bankName}
                        onChange={(e) => {
                            if (isBankOpen) {
                                setBankSearch(e.target.value);
                            } else {
                                onBankChange(e.target.value);
                            }
                        }}
                        onFocus={() => setIsBankOpen(true)}
                        placeholder="搜尋或輸入銀行"
                        className="w-full text-sm bg-transparent border-none p-0 focus:ring-0 font-medium text-gray-900 pr-8"
                    />
                    <button 
                        onClick={() => setIsBankOpen(!isBankOpen)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-colors"
                    >
                        <ChevronDown className={cn("w-4 h-4 transition-transform", isBankOpen && "rotate-180")} />
                    </button>
                </div>

                <AnimatePresence>
                    {isBankOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-[100] mt-2 w-full max-h-60 overflow-y-auto bg-white rounded-xl shadow-xl border border-gray-100 py-2 custom-scrollbar"
                        >
                            {filteredBanks.length > 0 ? (
                                filteredBanks.map((bank) => (
                                    <button
                                        key={bank.code}
                                        onClick={() => handleBankSelect(bank)}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-cyan-50 flex items-center justify-between group"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{bank.name}</span>
                                            <span className="text-[10px] text-gray-400 group-hover:text-cyan-600 transition-colors">{bank.code}</span>
                                        </div>
                                        {bankName.includes(bank.code) && <Check className="w-4 h-4 text-cyan-500" />}
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-2 text-sm text-gray-500 italic">找不到匹配的銀行</div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Branch Selector */}
            <div className="relative" ref={branchRef}>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">分行/代碼</label>
                <div className="relative group">
                    <input
                        value={isBranchOpen ? branchSearch : branch}
                        onChange={(e) => {
                            if (isBranchOpen) {
                                setBranchSearch(e.target.value);
                            } else {
                                onBranchChange(e.target.value);
                            }
                        }}
                        onFocus={() => setIsBranchOpen(true)}
                        placeholder={selectedBank ? "搜尋或輸入分行" : "請先選擇銀行"}
                        className="w-full text-sm bg-transparent border-none p-0 focus:ring-0 font-medium text-gray-900 pr-8"
                    />
                    <button 
                        onClick={() => setIsBranchOpen(!isBranchOpen)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-colors"
                    >
                        <ChevronDown className={cn("w-4 h-4 transition-transform", isBranchOpen && "rotate-180")} />
                    </button>
                </div>

                <AnimatePresence>
                    {isBranchOpen && selectedBank && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-[100] mt-2 w-full max-h-60 overflow-y-auto bg-white rounded-xl shadow-xl border border-gray-100 py-2 custom-scrollbar"
                        >
                            {filteredBranches.length > 0 ? (
                                filteredBranches.map((br) => (
                                    <button
                                        key={br.code}
                                        onClick={() => handleBranchSelect(br)}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-cyan-50 flex items-center justify-between group"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{br.name}</span>
                                            <span className="text-[10px] text-gray-400 group-hover:text-cyan-600 transition-colors">{br.code}</span>
                                        </div>
                                        {branch.includes(br.code) && <Check className="w-4 h-4 text-cyan-500" />}
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-2 text-sm text-gray-500 italic">找不到匹配的分行</div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
