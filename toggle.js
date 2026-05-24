const fs = require('fs');

const path = './src/components/InputForm.tsx';
let content = fs.readFileSync(path, 'utf-8');

// 1. Update FormCard signature
content = content.replace(
    /function FormCard\(\{ title, children, className, colSpan = "col-span-12", titleClassName, icon: Icon \}: \{ title\?: string, children: React\.ReactNode, className\?: string, colSpan\?: string, titleClassName\?: string, icon\?: any \}\)/,
    'function FormCard({ title, children, className, colSpan = "col-span-12", titleClassName, icon: Icon, headerRight }: { title?: string, children: React.ReactNode, className?: string, colSpan?: string, titleClassName?: string, icon?: any, headerRight?: React.ReactNode })'
);

// 2. Update FormCard JSX
const oldHeader = `{title && (
                <div className="mb-6 flex items-center gap-4">
                    {Icon && <Icon className="w-10 h-10 text-indigo-600 flex-shrink-0" />}
                    <h3 className={cn("text-[27px] font-bold text-slate-800 tracking-tight flex items-baseline flex-wrap gap-x-2", titleClassName)}>
                        <span>{mainTitle}</span>
                        {subTitle && (
                            <span className="text-[15px] text-slate-400 font-normal">({subTitle})</span>
                        )}
                    </h3>
                </div>
            )}`;
const newHeader = `{title && (
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {Icon && <Icon className="w-10 h-10 text-indigo-600 flex-shrink-0" />}
                        <h3 className={cn("text-[27px] font-bold text-slate-800 tracking-tight flex items-baseline flex-wrap gap-x-2", titleClassName)}>
                            <span>{mainTitle}</span>
                            {subTitle && (
                                <span className="text-[15px] text-slate-400 font-normal">({subTitle})</span>
                            )}
                        </h3>
                    </div>
                    {headerRight && <div>{headerRight}</div>}
                </div>
            )}`;
content = content.replace(oldHeader, newHeader);

// 3. Add state
content = content.replace(
    'const [docExpanded, setDocExpanded] = useState(true);',
    'const [docExpanded, setDocExpanded] = useState(true);\n    const [categoryExpanded, setCategoryExpanded] = useState(false);'
);

// 4. Update FormCard usage for category
const oldCardUsage = `<FormCard title="選擇專案範疇 (Industry Category)" className="col-span-12" icon={LayoutGrid}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">`;

const newCardUsage = `<FormCard 
                title="選擇專案範疇 (Industry Category)" 
                className="col-span-12" 
                icon={LayoutGrid}
                headerRight={
                    <button type="button" onClick={() => setCategoryExpanded(p => !p)} className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium">
                        {categoryExpanded ? '收起' : '展開'} {categoryExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                }
            >
                {categoryExpanded && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">`;

content = content.replace(oldCardUsage, newCardUsage);

// 5. Close the wrapper for the new condition
// Need to find the end of the FormCard for "選擇專案範疇"
// It ends with:
//                     )}
//                 </div>
//             </FormCard>
// 
//             {/* 2. Project Type */}
const oldEnd = `                    )}
                </div>
            </FormCard>

            {/* 2. Project Type */}`;
const newEnd = `                    )}
                    </div>
                )}
            </FormCard>

            {/* 2. Project Type */}`;
content = content.replace(oldEnd, newEnd);

fs.writeFileSync(path, content, 'utf-8');
console.log('Toggle applied');
