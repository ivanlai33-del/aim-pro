'use client';

import Link from 'next/link';
import { Layout } from 'lucide-react';
import Hero from '@/components/landing/Hero';
import RoleSegmentation from '@/components/landing/RoleSegmentation';
import Features from '@/components/landing/Features';
import Pricing from '@/components/landing/Pricing';
import LandingFooter from '@/components/landing/LandingFooter';

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500/30">
            {/* Navbar (Internal to allow simple composition) */}
            <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/20 bg-white/10 backdrop-blur-xl shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <img src="/Logo.png" alt="Aim.pro Icon" className="w-10 h-10 object-contain" />
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="#pricing" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors hidden md:block">
                            方案價格
                        </a>
                        <Link
                            href="/login"
                            className="px-6 py-2 bg-gradient-to-br from-cyan-500/90 to-emerald-500/90 backdrop-blur-md text-white rounded-xl text-sm font-bold hover:from-cyan-500 hover:to-emerald-500 transition-all shadow-lg shadow-cyan-500/20 border border-white/20"
                        >
                            開始使用
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="pt-16">
                <Hero />
                <RoleSegmentation />
                <Features />
                <Pricing />
            </div>

            <LandingFooter />
        </main>
    );
}
