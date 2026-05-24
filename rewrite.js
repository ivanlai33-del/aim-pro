const fs = require('fs');

const path = './src/components/InputForm.tsx';
let content = fs.readFileSync(path, 'utf-8');

// 1. Update FormCard UI
content = content.replace(
    /bg-white p-8 rounded-\[24px\] border border-black\/20 shadow-sm hover:shadow-md transition-all duration-300/,
    'bg-white p-8 rounded-[24px] border border-slate-200/60 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)] transition-all duration-500'
);

// 2. Update OptionButton UI
content = content.replace(
    /border-transparent \$\{activeBg\} text-white shadow-lg shadow-primary\/20/,
    'border-transparent ${activeBg} text-white shadow-xl shadow-primary/30 ring-2 ring-primary/20 ring-offset-2'
);
content = content.replace(
    /border-black\/20 bg-white text-slate-500 hover:border-primary\/50 hover:bg-slate-50 hover:text-primary hover:shadow-md/,
    'border-slate-200 bg-white text-slate-500 hover:border-primary/40 hover:bg-slate-50 hover:text-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300'
);

// 3. Document Analyzer Custom Gradient & Highlight
content = content.replace(
    /title="文件解析器 \(Document Analyzer\)"\s+className="col-span-12"/,
    'title="文件解析器 (Document Analyzer)"\n                className="col-span-12 bg-gradient-to-br from-indigo-50/40 via-white to-blue-50/40 border-indigo-100/50"'
);

// 4. Input Fields UI
// Changing text-[22px] to text-[16px] for a more elegant Apple-like form
content = content.replace(/text-\[22px\]/g, 'text-[16px]');
content = content.replace(/p-\[15px\]/g, 'px-4 py-3');
content = content.replace(/border-black\/20/g, 'border-slate-200');
content = content.replace(/focus:ring-primary\/10 focus:border-primary/g, 'focus:ring-sky-500/20 focus:border-sky-400');
content = content.replace(/bg-slate-50\/50/g, 'bg-slate-50/80');

// 5. Client Info Layout tightening (gap-y-[50px] to gap-y-6)
content = content.replace(/gap-y-\[50px\]/g, 'gap-y-6');

// 6. Re-order sections
// We need to move Document Analyzer before Industry Category.
// Find boundaries of Document Analyzer
const docAnalyzerStart = content.indexOf('{/* 📎 文件解析器 */}');
const docAnalyzerEndStr = '            </FormCard>\n\n            {/* 3. Description Section */}';
const docAnalyzerEnd = content.indexOf(docAnalyzerEndStr);

if (docAnalyzerStart > -1 && docAnalyzerEnd > -1) {
    const docAnalyzerBlock = content.substring(docAnalyzerStart, docAnalyzerEnd + '            </FormCard>\n\n'.length);
    // Remove it from current position
    content = content.replace(docAnalyzerBlock, '');
    
    // Find where to insert it: right after <form ...>
    const formStartTag = '<form id="project-setup-form" onSubmit={handleSubmit} className="grid grid-cols-12 gap-8 pb-20">\n';
    const insertPos = content.indexOf(formStartTag) + formStartTag.length;
    
    // Insert
    content = content.slice(0, insertPos) + '\n            ' + docAnalyzerBlock + content.slice(insertPos);
}

fs.writeFileSync(path, content, 'utf-8');
console.log('Rewrite done');
