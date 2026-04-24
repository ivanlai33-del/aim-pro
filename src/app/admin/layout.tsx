'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkAdminAccess } from '@/lib/adminAuth';
import Link from 'next/link';
import { Shield, Users, BarChart3, Settings } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [adminUser, setAdminUser] = useState<any>(null);

    useEffect(() => {
        async function verifyAdmin() {
            const { authorized, redirect, user } = await checkAdminAccess();

            if (!authorized && redirect) {
                router.push(redirect);
                return;
            }

            setAdminUser(user);
            setLoading(false);
        }

        verifyAdmin();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">驗證管理員權限...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505]">
            {/* 所有的 UI 現在由子頁面內部自己控制，這裡只提供最底層的黑色背景容器 */}
            <main className="w-full h-full">
                {children}
            </main>
        </div>
    );
}
