import { Zap, TrendingUp, ShieldCheck, FileCheck } from 'lucide-react';

const FEATURES = [
    {
        title: '全球百大專家矩陣',
        desc: '不只是單純的 AI 對話。我們整合了全球跨領域的專業思維，從技術架構到行銷佈局，共同為您的專案精準把關。',
        icon: Zap,
        color: 'text-yellow-400',
    },
    {
        title: '法、財、稅基因植入',
        desc: '報價單自動內建專業免責條款與財務預估，降低法律風險並確保每一筆專案都能實質獲利。',
        icon: ShieldCheck,
        color: 'text-blue-400',
    },
    {
        title: '虛擬經營總部 (HQ)',
        desc: '一人公司也能擁有百人企業的營運高度。雲端備份、權限分立，讓您的專業形象瞬間提升。',
        icon: TrendingUp,
        color: 'text-green-400',
    },
    {
        title: '成交驅動 (Closing)',
        desc: '別把生命浪費在文書。用極致專業的企劃書贏得客戶信任，大幅提升 2-3 倍的成交機率。',
        icon: FileCheck,
        color: 'text-purple-400',
    },
];

export default function Features() {
    return (
        <section className="py-24 bg-slate-900 border-y border-white/5">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        不只是工具，是你的 <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">獲利引擎</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        我們將頂尖接案者的經驗，濃縮成這套系統。
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {FEATURES.map((feat, i) => (
                        <div key={i} className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 hover:bg-slate-800 transition-colors">
                            <div className={`w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-6 ${feat.color}`}>
                                <feat.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">{feat.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                {feat.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
