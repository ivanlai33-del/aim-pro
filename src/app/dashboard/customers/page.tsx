'use client';

import { useState } from 'react';
import { useProject, Customer } from '@/context/ProjectContext';
import { Users, Plus, Search, Mail, Phone, MapPin, Building2, Tag, Trash2, Edit2, X, Check, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function CustomersPage() {
    const { customers, addCustomer, updateCustomer, deleteCustomer } = useProject();
    const [isAdding, setIsAdding] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState<Omit<Customer, 'id' | 'createdAt'>>({
        name: '',
        company: '',
        taxId: '',
        email: '',
        phone: '',
        address: '',
        tags: []
    });

    const handleAdd = () => {
        if (!formData.name || !formData.company) {
            toast.error('請填寫客戶名稱與公司名稱');
            return;
        }
        addCustomer(formData);
        setIsAdding(false);
        setFormData({
            name: '',
            company: '',
            taxId: '',
            email: '',
            phone: '',
            address: '',
            tags: []
        });
    };

    const handleUpdate = (id: string) => {
        updateCustomer(id, formData);
        setEditingId(null);
        toast.success('客戶資料已更新');
    };

    const startEditing = (customer: Customer) => {
        setFormData(customer);
        setEditingId(customer.id);
        setIsAdding(false);
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.taxId.includes(searchQuery)
    );

    return (
        <div className="w-full p-6 animate-in fade-in pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">客群與名單</h1>
                    <p className="text-slate-500">客戶關係管理 (CRM Dashboard)</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="搜尋客戶、公司、統編..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-black/30 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 outline-none w-64 transition-all"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setIsAdding(!isAdding);
                            setEditingId(null);
                            setFormData({ name: '', company: '', taxId: '', email: '', phone: '', address: '', tags: [] });
                        }}
                        className="bg-gradient-to-br from-cyan-400 via-cyan-500 to-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center shadow-lg shadow-cyan-600/20 hover:brightness-110 transition-all border border-white/20"
                    >
                        {isAdding ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                        {isAdding ? '取消' : '新增客戶'}
                    </button>
                </div>
            </div>

            {(isAdding || editingId) && (
                <div className="bg-white rounded-2xl border border-black/30 shadow-xl p-8 mb-8 animate-in slide-in-from-top-4 duration-300">
                    <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center">
                        <Building2 className="w-5 h-5 mr-2 text-indigo-500" />
                        {editingId ? '編輯客戶資料' : '輸入新客戶資訊'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">對象姓名 *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-50 border-black/30 rounded-xl px-4 py-3 text-sm focus:bg-white transition-all outline-none border"
                                placeholder="例如：王小明"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">公司全銜 *</label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                                className="w-full bg-slate-50 border-black/30 rounded-xl px-4 py-3 text-sm focus:bg-white transition-all outline-none border"
                                placeholder="例如：捷報設計有限公司"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">統一編號</label>
                            <input
                                type="text"
                                value={formData.taxId}
                                onChange={e => setFormData({ ...formData, taxId: e.target.value })}
                                className="w-full bg-slate-50 border-black/30 rounded-xl px-4 py-3 text-sm focus:bg-white transition-all outline-none border font-mono"
                                placeholder="8 位數字"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">電子郵件</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-slate-50 border-black/30 rounded-xl px-4 py-3 text-sm focus:bg-white transition-all outline-none border"
                                placeholder="example@mail.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">聯絡電話</label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-slate-50 border-black/30 rounded-xl px-4 py-3 text-sm focus:bg-white transition-all outline-none border"
                                placeholder="0911-000-000"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">通訊地址</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                className="w-full bg-slate-50 border-black/30 rounded-xl px-4 py-3 text-sm focus:bg-white transition-all outline-none border"
                                placeholder="台北市..."
                            />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            onClick={() => { setIsAdding(false); setEditingId(null); }}
                            className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all"
                        >
                            取消
                        </button>
                        <button
                            onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}
                            className="bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all"
                        >
                            {editingId ? '儲存變更' : '確定新增'}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCustomers.length === 0 && !isAdding && (
                    <div className="col-span-full py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-black/30 flex flex-col items-center justify-center text-slate-400">
                        <Users className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-bold">尚無客戶資料</p>
                        <p className="text-xs mt-1">點擊上方「新增客戶」開始建立您的名單</p>
                    </div>
                )}

                {filteredCustomers.map(customer => (
                    <div key={customer.id} className="group bg-white rounded-2xl border border-black/30 p-6 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-indigo-500 transition-all" />

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-lg font-black text-slate-900 leading-tight">{customer.company}</h4>
                                <p className="text-sm font-bold text-slate-500 mt-1 flex items-center">
                                    <Users className="w-3 h-3 mr-1.5" />
                                    {customer.name}
                                </p>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEditing(customer)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all" title="編輯">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => deleteCustomer(customer.id)} className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-all" title="刪除">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3 mt-6">
                            {customer.taxId && (
                                <div className="flex items-center text-xs text-slate-600 font-mono bg-slate-50 p-2 rounded-lg">
                                    <Tag className="w-3 h-3 mr-2 text-slate-400" />
                                    統編：{customer.taxId}
                                </div>
                            )}
                            {customer.email && (
                                <div className="flex items-center text-xs text-slate-600">
                                    <Mail className="w-3.5 h-3.5 mr-2 text-slate-400" />
                                    {customer.email}
                                </div>
                            )}
                            {customer.phone && (
                                <div className="flex items-center text-xs text-slate-600">
                                    <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" />
                                    {customer.phone}
                                </div>
                            )}
                            {customer.address && (
                                <div className="flex items-start text-xs text-slate-600">
                                    <MapPin className="w-3.5 h-3.5 mr-2 mt-0.5 text-slate-400 shrink-0" />
                                    <span className="line-clamp-1">{customer.address}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 pt-4 border-t border-slate-50 flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Added {new Date(customer.createdAt).toLocaleDateString()}
                            </span>
                            <button className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest flex items-center group/btn">
                                建立新專案
                                <Check className="w-3 h-3 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
