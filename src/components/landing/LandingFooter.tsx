import Link from 'next/link';
import { Layout } from 'lucide-react';

export default function LandingFooter() {
    return (
        <footer className="bg-slate-950 border-t border-white/5 py-12 text-slate-400 text-sm">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <Layout className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-bold text-lg">捷報 Estimator</span>
                    </div>

                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-white transition-colors">隱私權政策</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">服務條款</Link>
                        <a href="mailto:info@ycideas.com" className="hover:text-white transition-colors">聯絡我們</a>
                    </div>

                    <div className="text-slate-500">
                        &copy; {new Date().getFullYear()} Prime Business Suite. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
