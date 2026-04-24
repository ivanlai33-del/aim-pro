'use client';

import { useState } from 'react';
import { MOCK_PERSONAS, SubscriptionTier } from '@/config/subscription';
import { Search, Filter, MoreHorizontal, CheckCircle, XCircle, Shield, Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState(MOCK_PERSONAS);

    const handleTierChange = (userId: string, newTier: SubscriptionTier) => {
        setUsers(users.map(u =>
            u.id === userId ? { ...u, tier: newTier } : u
        ));
        toast.success(`User ${userId} updated to ${newTier}`);
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-6 max-w-6xl animate-in fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">管理後台 (Admin)</h1>
                    <p className="text-slate-500">User Subscription Management</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                        placeholder="搜尋用戶姓名或 Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full p-2 border border-black/30 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button className="flex items-center px-4 py-2 border border-black/30 rounded-lg hover:bg-slate-50">
                    <Filter className="w-4 h-4 mr-2" />
                    篩選狀態
                </button>
            </div>

            {/* User Table */}
            <div className="bg-white rounded-xl border border-black/30 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-black/30">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">User Info</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Current Tier</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Role</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Usage</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/30">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900">{user.name}</div>
                                            <div className="text-sm text-slate-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`
                                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                        ${user.tier === 'professional' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                            user.tier === 'pro_plus' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                user.tier === 'enterprise' ? 'bg-slate-800 text-white border-slate-700' :
                                                    'bg-gray-100 text-gray-800 border-black/30'}
                                    `}>
                                        {user.tier === 'pro_plus' ? 'Pro+' :
                                            user.tier.charAt(0).toUpperCase() + user.tier.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center text-sm text-slate-600">
                                        <Shield className="w-3 h-3 mr-1 text-slate-400" />
                                        {user.role}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs text-slate-500">
                                        <div>Projects: {user.usage.projectsCount}</div>
                                        <div>AI: {user.usage.aiGenerations}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Active
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <select
                                            className="text-xs border border-black/30 rounded p-1"
                                            value={user.tier}
                                            onChange={(e) => handleTierChange(user.id, e.target.value as SubscriptionTier)}
                                        >
                                            <option value="free">Free</option>
                                            <option value="professional">Professional</option>
                                            <option value="pro_plus">Pro+</option>
                                            <option value="enterprise">Enterprise</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
