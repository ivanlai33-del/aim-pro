'use client';

import { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { 
    Users, 
    UserPlus, 
    Shield, 
    Mail, 
    Trash2, 
    CheckCircle2, 
    AlertCircle,
    Crown,
    Briefcase,
    DollarSign,
    Calculator,
    User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type TeamMember = {
    id: string;
    name: string;
    email: string;
    role: 'owner' | 'admin' | 'sales' | 'accountant' | 'member';
    status: 'active' | 'pending';
};

export default function TeamManagement() {
    const { currentTeamRole, currentTeamId } = useProject();
    
    // In a real app, these would come from the database/context
    const [members, setMembers] = useState<TeamMember[]>([
        { id: '1', name: '老闆本人', email: 'owner@studio.tw', role: 'owner', status: 'active' },
        { id: '2', name: '資深 PM 小華', email: 'pm@studio.tw', role: 'admin', status: 'active' },
        { id: '3', name: '業務經理小明', email: 'sales@studio.tw', role: 'sales', status: 'active' },
        { id: '4', name: '財務莉莉', email: 'finance@studio.tw', role: 'accountant', status: 'active' },
    ]);

    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<TeamMember['role']>('member');

    const canManageTeam = ['owner', 'admin'].includes(currentTeamRole);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail || !currentTeamId) return;
        
        try {
            const response = await fetch('/api/invite/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teamId: currentTeamId,
                    email: inviteEmail,
                    role: inviteRole
                })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error);

            const inviteLink = `${window.location.origin}/invite?token=${data.invitation.token}`;
            
            // Add to local list for immediate UI feedback
            const newMember: TeamMember = {
                id: data.invitation.id,
                name: inviteEmail.split('@')[0],
                email: inviteEmail,
                role: inviteRole,
                status: 'pending'
            };
            
            setMembers([newMember, ...members]);
            setInviteEmail('');
            
            toast.success(`邀請信已建立！`, {
                description: `邀請連結已產生，請複製給員工：${inviteLink}`,
                duration: 10000,
                action: {
                    label: "複製連結",
                    onClick: () => {
                        navigator.clipboard.writeText(inviteLink);
                        toast.success("連結已複製到剪貼簿");
                    }
                }
            });
        } catch (error: any) {
            toast.error(`邀請失敗: ${error.message}`);
        }
    };

    const getRoleIcon = (role: TeamMember['role']) => {
        switch (role) {
            case 'owner': return <Crown className="w-4 h-4 text-amber-500" />;
            case 'admin': return <Shield className="w-4 h-4 text-cyan-500" />;
            case 'sales': return <Briefcase className="w-4 h-4 text-emerald-500" />;
            case 'accountant': return <Calculator className="w-4 h-4 text-orange-500" />;
            default: return <User className="w-4 h-4 text-slate-400" />;
        }
    };

    const getRoleBadge = (role: TeamMember['role']) => {
        const styles = {
            owner: "bg-amber-50 text-amber-700 border-amber-200",
            admin: "bg-cyan-50 text-cyan-700 border-cyan-200",
            sales: "bg-emerald-50 text-emerald-700 border-emerald-200",
            accountant: "bg-orange-50 text-orange-700 border-orange-200",
            member: "bg-slate-50 text-slate-700 border-slate-200"
        };
        
        const labels = {
            owner: "最高權限老闆",
            admin: "專案經理 (Admin)",
            sales: "業務開發 (Sales)",
            accountant: "財務會計",
            member: "團隊成員"
        };

        return (
            <span className={cn("px-2.5 py-1 rounded-lg text-[11px] font-black border uppercase tracking-wider", styles[role])}>
                {labels[role]}
            </span>
        );
    };

    if (!canManageTeam) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <Shield className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-xl font-black text-slate-800">權限不足</h3>
                <p className="text-slate-500 font-bold">只有老闆或管理員可以管理團隊成員</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 flex items-center">
                        <Users className="w-8 h-8 mr-3 text-cyan-600" />
                        團隊成員管理
                    </h2>
                    <p className="text-slate-500 font-bold mt-1">管理職位權限、發送邀請與成員汰換</p>
                </div>
                <div className="bg-cyan-50 px-4 py-2 rounded-2xl border border-cyan-100 flex items-center">
                    <Crown className="w-4 h-4 text-cyan-600 mr-2" />
                    <span className="text-xs font-black text-cyan-700 uppercase tracking-widest">Pro+ 團隊版方案</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Invite Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-black/10 overflow-hidden">
                        <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-b border-black/10">
                            <h3 className="font-black text-lg text-slate-800 flex items-center">
                                <UserPlus className="w-5 h-5 mr-2 text-cyan-600" />
                                邀請新成員
                            </h3>
                        </div>
                        <form onSubmit={handleInvite} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">電子郵件</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="email" 
                                        required
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        placeholder="employee@studio.tw"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-black/10 rounded-xl font-bold focus:ring-4 focus:ring-cyan-100 focus:bg-white transition-all outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">賦予職位</label>
                                <select 
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value as any)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-black/10 rounded-xl font-black text-slate-700 focus:ring-4 focus:ring-cyan-100 focus:bg-white transition-all outline-none appearance-none"
                                >
                                    <option value="admin">專案經理 (Admin)</option>
                                    <option value="sales">業務開發 (Sales)</option>
                                    <option value="accountant">財務會計</option>
                                    <option value="member">團隊成員 (Member)</option>
                                </select>
                                <p className="mt-2 text-[10px] text-slate-400 font-bold leading-relaxed px-1">
                                    * 系統將根據職位自動套用 RBAC 權限，隔離財務敏感資訊。
                                </p>
                            </div>
                            <button 
                                type="submit"
                                className="w-full bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 text-white font-black py-4 rounded-xl shadow-lg shadow-cyan-100 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center mt-4 border border-white/20"
                            >
                                <UserPlus className="w-5 h-5 mr-2" />
                                發送邀請
                            </button>
                        </form>
                    </div>
                </div>

                {/* Member List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-black/10 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                    <th className="px-8 py-5 border-b border-black/10">成員資訊</th>
                                    <th className="px-6 py-5 border-b border-black/10">職位權限</th>
                                    <th className="px-6 py-5 border-b border-black/10">狀態</th>
                                    <th className="px-6 py-5 border-b border-black/10 text-right">管理</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {members.map((member) => (
                                    <tr key={member.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-black text-sm mr-4 border-2 border-white shadow-sm">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-800 leading-none mb-1">{member.name}</p>
                                                    <p className="text-xs text-slate-400 font-bold">{member.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2">
                                                {getRoleIcon(member.role)}
                                                {getRoleBadge(member.role)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            {member.status === 'active' ? (
                                                <span className="flex items-center text-emerald-500 text-[11px] font-black uppercase tracking-widest">
                                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-amber-500 text-[11px] font-black uppercase tracking-widest animate-pulse">
                                                    <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            {member.role !== 'owner' && (
                                                <button className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Permissions Matrix Mini-Guide */}
            <div className="bg-gradient-to-br from-slate-900 via-[#1a2a3a] to-slate-800 rounded-3xl p-8 text-white shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Shield className="w-64 h-64" />
                </div>
                <div className="relative z-10">
                    <h4 className="text-xl font-black mb-6 flex items-center text-white">
                        <Shield className="w-6 h-6 mr-3 text-cyan-400" />
                        權限矩陣概覽 (RBAC Quick Guide)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                            <p className="text-amber-400 font-black text-sm mb-2 flex items-center uppercase tracking-widest">
                                <Crown className="w-4 h-4 mr-2" /> Owner
                            </p>
                            <p className="text-xs text-slate-300 font-bold leading-relaxed">最高權限，可管理團隊成員、訂閱方案與公司級財務報表。</p>
                        </div>
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                            <p className="text-cyan-400 font-black text-sm mb-2 flex items-center uppercase tracking-widest">
                                <Shield className="w-4 h-4 mr-2" /> PM (Admin)
                            </p>
                            <p className="text-xs text-slate-300 font-bold leading-relaxed">管理專案、發包任務、設定成本預算。預算需經由 Owner 簽核。</p>
                        </div>
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                            <p className="text-emerald-400 font-black text-sm mb-2 flex items-center uppercase tracking-widest">
                                <Briefcase className="w-4 h-4 mr-2" /> Sales
                            </p>
                            <p className="text-xs text-slate-300 font-bold leading-relaxed">開發客戶、建立報價單。可看專案營收，但看不見外包成本與利潤。</p>
                        </div>
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                            <p className="text-orange-400 font-black text-sm mb-2 flex items-center uppercase tracking-widest">
                                <Calculator className="w-4 h-4 mr-2" /> Accountant
                            </p>
                            <p className="text-xs text-slate-300 font-bold leading-relaxed">財務唯讀。管理款項撥付 (Payout)、稅務處理與發票開立。</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
