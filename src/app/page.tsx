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
        <main className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-indigo-500/30">

            {/* Navbar (Internal to allow simple composition) */}
            <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg shadow-lg shadow-indigo-500/20 animate-pulse">
                            <Layout className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg text-white tracking-tight">捷報 Estimator</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="#pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden md:block">
                            方案價格
                        </a>
                        <Link
                            href="/login"
                            className="px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors shadow-lg shadow-white/10"
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
