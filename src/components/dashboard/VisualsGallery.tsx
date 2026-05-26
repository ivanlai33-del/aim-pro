import { useProject } from '@/context/ProjectContext';
import { Palette, ExternalLink, Calendar, Link2 } from 'lucide-react';
import { SKILL_LABELS, PHILOSOPHY_LABELS } from '@/lib/designEngine';
import Link from 'next/link';

export function VisualsGallery() {
    const { activeProject } = useProject();

    if (!activeProject) return null;

    const visuals = activeProject.visualProposals || [];

    return (
        <div className="bg-surface rounded-[24px] border border-border shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-black text-foreground flex items-center">
                        <Palette className="w-5 h-5 mr-2 text-indigo-500" />
                        視覺提案庫
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        由策略大腦與 Visual Studio 生成的設計提案皆會歸檔於此。
                    </p>
                </div>
                <Link
                    href={`/visual-studio?projectId=${activeProject.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all shadow-md active:scale-95"
                >
                    <ExternalLink className="w-4 h-4" />
                    開啟 Visual Studio
                </Link>
            </div>

            {visuals.length === 0 ? (
                <div className="py-20 bg-muted/50 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center">
                    <Palette className="w-12 h-12 text-muted-foreground opacity-20 mb-4" />
                    <p className="text-foreground font-bold">尚無任何視覺提案</p>
                    <p className="text-sm text-muted-foreground mt-1">請點擊上方按鈕前往生成。</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visuals.map((visual) => (
                        <div key={visual.id} className="group bg-muted/30 border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all relative">
                            {/* Preview Frame */}
                            <div className="aspect-[4/3] w-full bg-white relative overflow-hidden border-b border-border">
                                <div className="absolute inset-0 pointer-events-none origin-top-left scale-[0.25] w-[400%] h-[400%]">
                                    <iframe 
                                        srcDoc={visual.htmlPreview} 
                                        className="w-full h-full border-none" 
                                        scrolling="no"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-sm text-foreground line-clamp-1">
                                        {SKILL_LABELS[visual.skill as keyof typeof SKILL_LABELS] || visual.skill}
                                    </h3>
                                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-full font-bold whitespace-nowrap">
                                        {PHILOSOPHY_LABELS[visual.philosophy as keyof typeof PHILOSOPHY_LABELS] || visual.philosophy}
                                    </span>
                                </div>
                                <div className="flex items-center text-[11px] text-muted-foreground mt-3">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(visual.timestamp).toLocaleString()}
                                </div>
                            </div>
                            
                            {/* Action Overlay */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link
                                    href={`/visual-studio?projectId=${activeProject.id}&skill=${visual.skill}&philosophy=${visual.philosophy}`}
                                    className="p-2 bg-white/90 dark:bg-black/90 backdrop-blur rounded-lg shadow-sm text-indigo-600 hover:text-indigo-800 transition-colors flex items-center justify-center border border-black/10"
                                    title="在 Visual Studio 中開啟"
                                >
                                    <Link2 className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
