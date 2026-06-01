// ============================================================
// designEngine.ts — Open Design (Full Craft Mode V10)
// ============================================================

import { ProjectData } from '@/types/project';

export type DesignPhilosophy = 'apple' | 'estate' | 'cruise' | 'rural' | 'cyber' | 'gallery' | 'magazine' | 'ink' | 'indigo' | 'forest' | 'dune' | 'ikb';
export type DesignSkill = 'prototype' | 'presentation' | 'dashboard' | 'brand_spec' | 'flowchart' | 'html_ppt' | 'swipe_deck';

export interface DesignBrief {
  projectName: string;
  skill: DesignSkill;
  philosophy: DesignPhilosophy;
  reportSummary: string;
  briefContent: string;
}

export function getFullCraftCSS(philosophy: DesignPhilosophy): string {
    const palettes: Record<DesignPhilosophy, string> = {
        apple: `--bg: #000; --text: #fff; --accent: #0071e3; --secondary: #1d1d1f; --font: 'Inter'; --accent-gradient: linear-gradient(135deg, #0071e3 0%, #00d4ff 100%);`,
        estate: `--bg: #0c0a09; --text: #faf9f7; --accent: #c9a84c; --secondary: #1c1917; --font: 'Playfair Display'; --accent-gradient: linear-gradient(90deg, #bf953f, #fcf6ba, #b38728);`,
        cruise: `--bg: #020c1b; --text: #e8dcc8; --accent: #d4af6a; --secondary: #0d2137; --font: 'Cormorant Garamond'; --accent-gradient: linear-gradient(180deg, #d4af6a 0%, #8a6d3b 100%);`,
        rural: `--bg: #fdf8f0; --text: #3d2b1f; --accent: #7c4a1e; --secondary: #f4ece2; --font: 'Noto Serif TC'; --accent-gradient: linear-gradient(to right, #7c4a1e, #a67c52);`,
        cyber: `--bg: #020617; --text: #e2e8f0; --accent: #10b981; --secondary: #0f172a; --font: 'Space Mono'; --accent-gradient: linear-gradient(90deg, #10b981, #3b82f6);`,
        gallery: `--bg: #ffffff; --text: #000; --accent: #e63946; --secondary: #f5f5f0; --font: 'Outfit'; --accent-gradient: linear-gradient(45deg, #e63946, #000);`,
                magazine: `--bg: #fafafa; --text: #111111; --accent: #ff4500; --secondary: #f0f0f0; --font: 'Helvetica Neue', Helvetica; --accent-gradient: linear-gradient(135deg, #ff4500 0%, #ff8c00 100%);`,
        ink: `--bg: #f1efea; --text: #0a0a0b; --accent: #8c8c8c; --secondary: #e6e4df; --font: 'Noto Serif TC', serif; --accent-gradient: linear-gradient(135deg, #0a0a0b 0%, #333 100%);`,
        indigo: `--bg: #0a1f3d; --text: #f1f3f5; --accent: #4da6ff; --secondary: #132a4f; --font: 'Inter', sans-serif; --accent-gradient: linear-gradient(135deg, #4da6ff 0%, #0a1f3d 100%);`,
        forest: `--bg: #1a2e1f; --text: #f5f1e8; --accent: #66b277; --secondary: #233b29; --font: 'Playfair Display', serif; --accent-gradient: linear-gradient(135deg, #66b277 0%, #1a2e1f 100%);`,
        dune: `--bg: #1f1a14; --text: #f0e6d2; --accent: #d4a04a; --secondary: #2a241c; --font: 'Outfit', sans-serif; --accent-gradient: linear-gradient(135deg, #d4a04a 0%, #1f1a14 100%);`,
        ikb: `--bg: #ffffff; --text: #000000; --accent: #002FA7; --secondary: #f5f5f5; --font: 'Helvetica Neue', Helvetica, sans-serif; --accent-gradient: linear-gradient(135deg, #002FA7 0%, #001f70 100%);`
    };

    return `
    :root {
        ${palettes[philosophy]}
        color-scheme: ${['gallery', 'rural', 'magazine', 'ink', 'ikb'].includes(philosophy) ? 'light' : 'dark'} !important;
        --glass: blur(40px) saturate(200%);
        --shadow-xl: 0 40px 100px -20px rgba(0,0,0,0.6);
        --border-glass: rgba(255,255,255,0.08);
        --curve: cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-font-smoothing: antialiased; }
    
    body { 
        background: var(--bg); color: var(--text); font-family: var(--font), sans-serif; 
        line-height: 1.4; overflow-x: hidden; scroll-behavior: smooth;
    }

    /* 高級排版原子 */
    h1 { font-size: clamp(60px, 12vw, 140px); font-weight: 900; letter-spacing: -0.06em; line-height: 0.85; margin-bottom: 0.2em; }
    h2 { font-size: clamp(32px, 5vw, 72px); font-weight: 800; letter-spacing: -0.04em; margin-bottom: 0.5em; }
    .text-gradient { background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .caps { font-size: 11px; font-weight: 900; letter-spacing: 0.3em; text-transform: uppercase; opacity: 0.5; margin-bottom: 1.5em; display: block; }
    
    /* 佈局模組原子 */
    section { min-height: 100vh; padding: 120px 80px; position: relative; display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
    .container { max-width: 1300px; margin: 0 auto; width: 100%; position: relative; z-index: 10; }
    
    .bento-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 20px; width: 100%; }
    .card-premium { 
        background: var(--secondary); border: 1px solid var(--border-glass); border-radius: 32px; padding: 48px;
        transition: transform 0.8s var(--curve), border-color 0.8s var(--curve), box-shadow 0.8s var(--curve);
        position: relative; overflow: hidden;
    }
    .card-premium:hover { transform: translateY(-12px) scale(1.02); border-color: var(--accent); box-shadow: var(--shadow-xl); }
    
    /* 裝飾性原子 */
    .bg-glow { position: absolute; top: -10%; left: -10%; width: 50%; height: 50%; background: var(--accent); opacity: 0.05; filter: blur(150px); border-radius: 50%; pointer-events: none; }
    .divider { height: 1px; width: 100%; background: var(--border-glass); margin: 40px 0; }

    /* 動態原子 */
    @keyframes reveal-up { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); } }
    .reveal { animation: reveal-up 1.4s var(--curve) forwards; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 10px; }
    `;
}

export const PHILOSOPHY_LABELS: Record<DesignPhilosophy, string> = {
    apple: '極致蘋果 (Apple)', estate: '私人莊園 (Estate)', cruise: '皇家郵輪 (Cruise)', rural: '文青鄉產 (Rural)', cyber: '賽博科技 (Cyber)', gallery: '現代藝廊 (Creative)', magazine: '時尚雜誌 (Magazine)',
  ink: '墨水經典 (Ink Classic)', indigo: '靛藍瓷 (Indigo)', forest: '森林墨 (Forest)', dune: '沙丘 (Dune)', ikb: '瑞士克萊因藍 (IKB)'
};

export const SKILL_LABELS: Record<DesignSkill, string> = {
  prototype: '互動原型', presentation: '提案簡報', dashboard: '數據儀表板', brand_spec: '品牌規範書', flowchart: '流程架構圖', html_ppt: '網頁互動簡報', swipe_deck: '橫向滑動提案'
};

export const PHILOSOPHY_DESCRIPTIONS: Record<DesignPhilosophy, string> = {
  apple: '精品簡約：極大邊距、純淨白/深、極細字體',
  estate: '大氣磅礴：大理石色調、黃金比例、石材質感',
  cruise: '奢華優雅：海軍藍與香檳金、橫向闊氣佈局',
  rural: '純樸溫度：大地暖色、紙質感、手感編排',
  cyber: '未來脈動：發光網格、霓虹對比、科技感介面',
  gallery: '前衛衝擊：不對稱佈局、流體元素、藝術對比',
    magazine: '時尚雜誌：大膽排版、全屏圖片、搶眼字體',
  ink: '墨水經典：暖色紙張、深墨字體、適合商業預設',
  indigo: '靛藍瓷：深邃科技藍、高對比白字、適合科技/AI',
  forest: '森林墨：深邃自然綠、暖色文字、適合永續/非虛構',
  dune: '沙丘：大地暖色調、藝術感排版、適合設計/時尚',
  ikb: '瑞士網格：純淨白底黑字、高純度克萊因藍點綴'
};

export const SKILL_DESCRIPTIONS: Record<DesignSkill, string> = {
  prototype: '產出可互動的 Web UI 原型', presentation: '產出專業標準的 PDF 簡報格式', dashboard: '產出視覺化數據儀表板', brand_spec: '產出完整品牌視覺規範書', flowchart: '產出流程架構圖',
  html_ppt: '產出高流暢度、高互動性的 HTML 網頁簡報', swipe_deck: '產出如數位雜誌般的橫向滑動體驗'
};

export function getRecommendedSkills(moduleId: string): DesignSkill[] {
  const router: Record<string, DesignSkill[]> = {
    web_development: ['prototype', 'presentation'], software_outsourcing: ['prototype', 'presentation'], business_consulting: ['presentation', 'dashboard'], ai_agent_consultant: ['dashboard', 'presentation'],
  };
  return router[moduleId] || ['presentation'];
}

export interface ArtifactRecord {
  id: string; projectId?: string; moduleId: string; skill: DesignSkill; title: string; html: string; generatedAt: string; version: number;
}

export function buildDesignBrief(
  projectData: ProjectData,
  reportContent: string,
  skill: DesignSkill,
  moduleId: string,
  philosophy: DesignPhilosophy = 'apple'
): DesignBrief {
  return {
    projectName: projectData.projectName || '未命名專案',
    skill,
    philosophy,
    reportSummary: reportContent ? reportContent.substring(0, 3000) : '',
    briefContent: ''
  };
}

export function generateArtifactId(): string {
  return `art_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

export function getStoredArtifacts(projectId?: string): ArtifactRecord[] {
  try {
    const raw = localStorage.getItem('visual_studio_artifacts');
    if (!raw) return [];
    const artifacts = JSON.parse(raw) as ArtifactRecord[];
    // 如果有提供 projectId，則過濾該專案的記錄
    return projectId 
      ? artifacts.filter(a => a.projectId === projectId) 
      : artifacts;
  } catch (e) {
    console.error('Failed to get artifacts:', e);
    return [];
  }
}

export function storeArtifact(record: ArtifactRecord): void {
  try {
    const existing = getStoredArtifacts();
    const updated = [record, ...existing].slice(0, 50); // 保留最近 50 筆
    localStorage.setItem('visual_studio_artifacts', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to store artifact:', e);
  }
}

export function deleteArtifact(id: string): void {
  try {
    const existing = getStoredArtifacts();
    const updated = existing.filter(a => a.id !== id);
    localStorage.setItem('visual_studio_artifacts', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete artifact:', e);
  }
}

