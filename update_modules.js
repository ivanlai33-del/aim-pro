const fs = require('fs');
const path = require('path');

const moduleUpdates = {
    web_development: { name: '網站/APP 開發', tagline: '告別無底洞修改！用規格化防禦機制保障雙方權益' },
    software_outsourcing: { name: '軟體外包與 SaaS', tagline: '防禦合約陷阱，確保每一筆外包費用的 ROI 最大化' },
    system_integration: { name: '系統整合', tagline: '打通資訊孤島，精準釐清 API 責任歸屬與資安規格' },
    social_media: { name: '社群經營與內容行銷', tagline: '量化無形成本！讓你的每一分內容創作都有清晰報價' },
    ad_management: { name: '廣告投放與優化', tagline: '破除 ROAS 迷思，把隱藏的設定與測試成本具象化' },
    seo: { name: 'SEO 與搜尋策略', tagline: '拒絕無效保證，用白帽策略建立長效的 SEO 專案規範' },
    influencer_marketing: { name: 'KOL/網紅媒合', tagline: '避免合作爭議，從審稿到授權提供完整的防禦規範' },
    pr_agency: { name: '公關公司與活動行銷', tagline: '精準定義公關危機處理與媒體曝光的服務邊界' },
    brand_design: { name: '品牌設計與 CIS', tagline: '終結主觀修改！把抽象美感轉化為可量化的設計規範' },
    video_production: { name: '腳本企劃與影片製作', tagline: '從分鏡到後製，建立防禦無止盡修改的標準工作流' },
    social_visual: { name: '社群視覺與模板', tagline: '統一視覺規範，精準估算大量社群素材的產製成本' },
    photography: { name: '商業攝影', tagline: '明確修圖標準與授權範圍，保護你的攝影專業著作權' },
    ui_ux_design: { name: 'UI/UX 介面設計', tagline: '拒絕通靈設計！透過 wireframe 與設計系統防禦需求變更' },
    interior_design: { name: '室內設計與裝潢', tagline: '避免工程糾紛，建立透明且具防禦力的裝潢報價體系' },
    event_planning: { name: '活動企劃與執行', tagline: '應對突發狀況，用嚴謹的 SLA 保護你的活動企劃心血' },
    exhibition_design: { name: '展場設計與佈置', tagline: '確保進退場順利，防禦各種展場施工與法規變更風險' },
    business_consulting: { name: '企業管理顧問', tagline: '將無形顧問價值具象化，確立清晰的顧問服務邊界' },
    corporate_training: { name: '企業內訓與講師', tagline: '杜絕超時授課，精準定義教材版權與講師鐘點費用' },
    strategy_planning: { name: '品牌策略與企劃', tagline: '把策略思考轉化為可收費的階段性產出，保護你的腦力' },
    online_course: { name: '線上課程製作', tagline: '從腳本到上架，完整防護課程製作過程中的版權與變更' },
    home_organizer: { name: '居家整理顧問', tagline: '保護你的體力與專業，明確定義服務時數與廢棄物清運責任' },
    ip_agent: { name: '商標與智財代理', tagline: '防禦申請駁回風險，建立透明的智財代辦收費標準' },
    ai_agent_consulting: { name: 'AI 導入與培訓', tagline: '拒絕神話 AI，用具體的概念驗證(PoC)保護雙方期待' },
    real_estate_agent: { name: '房地產代銷', tagline: '確保法規合規，建立安全可靠的代銷合約與銷售規範' },
    government_tender: { name: '政府標案', tagline: '應對繁雜政府規格，確保標案執行過程不會虧損超支' },
    grant_subsidy: { name: '補助案申請', tagline: '釐清核銷責任，防禦補助款被追回或請款失敗的風險' },
    ui_ux: { name: 'UI/UX 介面設計', tagline: '拒絕通靈設計！透過 wireframe 與設計系統防禦需求變更' } // alternate file name
};

function walkDir(dir) {
    let files = [];
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        if (fs.statSync(fullPath).isDirectory()) {
            files = files.concat(walkDir(fullPath));
        } else if (fullPath.endsWith('.ts')) {
            files.push(fullPath);
        }
    }
    return files;
}

const moduleDir = path.join(__dirname, 'src', 'config', 'modules');
const files = walkDir(moduleDir);

for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    const baseName = path.basename(file, '.ts');
    
    let idMatch = content.match(/id:\s*'([^']+)'/);
    if (!idMatch) continue;
    let id = idMatch[1];
    
    let update = moduleUpdates[id] || moduleUpdates[baseName];
    if (update) {
        const newName = update.name.includes('職人模組') ? update.name : update.name + ' 職人模組';
        
        content = content.replace(/name:\s*'[^']+',/, "name: '" + newName + "',");
        
        if (content.match(/tagline:\s*'[^']*',/)) {
            content = content.replace(/tagline:\s*'[^']*',/, "tagline: '" + update.tagline + "',");
        } else if (content.match(/description:\s*'[^']+',/)) {
            content = content.replace(/(description:\s*'[^']+',)/, "$1\n    tagline: '" + update.tagline + "',");
        }
        
        fs.writeFileSync(file, content);
        console.log("Updated " + file);
    }
}
