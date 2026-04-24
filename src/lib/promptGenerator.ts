import { ProjectData } from '@/types/project';

export const generatePrompt = (data: ProjectData) => {
    // Determine Role and Context based on projectType
    let roleDescription = "";
    let specifics = "";

    switch (data.projectType) {
        case 'home':
        case 'commercial':
            roleDescription = "你是一位擁有 20 年經驗的資深室內設計師與裝修工程顧問。你擅長空間規劃、風格設計、材質選用與工程報價。";
            specifics = `
- **風格偏好**：${data.styleReferences || "未指定"}
- **優化/改造目標**：${data.optimizationGoals || "未指定"}
            `;
            break;
        case 'social':
        case 'ads':
            roleDescription = "你是一位資深的數位行銷策略總監。你擅長社群經營、廣告投放、SEO 與數據分析。";
            specifics = `
- **風格/品牌調性**：${data.styleReferences || "未指定"}
- **行銷目標**：${data.optimizationGoals || "未指定"}
            `;
            break;
        case 'wedding':
        case 'corporate':
            roleDescription = "你是一位專業的活動統籌與婚禮顧問。你擅長活動流程設計、場地佈置、預算控制與供應商管理。";
            specifics = `
- **活動風格/主題**：${data.styleReferences || "未指定"}
- **活動目標/預期效益**：${data.optimizationGoals || "未指定"}
            `;
            break;
        case 'web':
        case 'design':
        default:
            roleDescription = "你是一位擁有 20 年經驗的資深技術專案經理、產品架構師與商務顧問。你擅長全方位的專案評估，從底層技術開發到實際落地的商業流程。";
            specifics = `
- **現有網站網址**：${data.websiteUrl || "無"}
- **優化目標**：${data.optimizationGoals || "無"}
- **現有技術/備註**：${data.existingTech || "無"}
- **風格參考**：${data.styleReferences || "未指定"}
            `;
            break;
    }

    // Determine Detail Level
    const totalLength = (data.description?.length || 0) + (data.features?.length || 0) + (data.optimizationGoals?.length || 0);
    let detailInstruction = "";

    if (totalLength < 100) {
        detailInstruction = `
### ⚠️ 特別指令：精簡模式 (Concise Mode)
客戶提供的資訊較少，請 **"極度精簡"** 地輸出報告。
1. **省略前言廢話**：直接進入重點分析。
2. **條列式呈現**：能用列點就不要寫長句。
3. **篇幅控制**：報告總長度請控制在一般標準的 50% 以內。
        `;
    } else if (totalLength > 500) {
        detailInstruction = `
### ⚠️ 特別指令：詳細模式 (Detailed Mode)
客戶提供了非常詳盡的需求，請 **"深度分析"** 並提供完整報告。
1. **針對性回應**：請仔細引用客戶提到的每一個需求點進行回應。
2. **擴充技術細節**：在執行流程與技術架構上多著墨。
3. **完整性優先**：不要擔心篇幅過長，重點是完整覆蓋所有細節。
        `;
    }

    return `
${detailInstruction}

# Role: ${roleDescription}

## Profile
${roleDescription} 你的強項在於精準拆解需求，並提供具體的成本、時程與執行建議。

## Constraints & Rules
1. **不執行程式碼/實際操作**：此階段僅進行「規劃」、「評估」與「報價」。
2. **區分 AI 與人力**：必須明確標示哪些環節可由 AI 自動化（或工具輔助），哪些環節必須由真人執行。
3. **數據化分析**：報價與工時需基於市場行情。
4. **繁體中文回答**：所有輸出內容請使用繁體中文。

## Task
請針對以下【專案需求】，依照以下架構產出一份完整的《專案執行與報價評估報告》：

### 專案需求
- **專案名稱**：${data.projectName}
- **專案類型**：${data.projectType}
- **描述**：${data.description}
- **主要功能/製作項目**：${data.features}
- **預算範圍**：${data.budget || "未指定，請依行情估算"}
- **預期時程**：${data.timeline || "未指定，請依合理工期估算"}
${specifics}

### 報告架構

### 1. 專案計畫與階段拆解 (Project Plan & Phasing)
- **總體目標摘要**：定義專案核心價值與預期成果。
- **執行階段 (WBS)**：
    - 將專案拆解為數個里程碑。
    - **[關鍵標示]**：在每個任務後方標註執行者。

### 2. 需求分析與建議 (Analysis & Recommendations)
- **現況分析**：針對客戶描述的需求與痛點進行分析。
- **解決方案**：提出具體的改善建議（設計風格、行銷策略、技術選型等）。

### 3. 執行流程說明 (Execution Process)
- 請列出關鍵的執行步驟，包含前置作業、設計/開發/規劃、測試/驗收、交付/結案。
- 特別說明需要客戶配合的事項（如：提供素材、確認設計稿）。

### 4. 預期產出 (Deliverables)
- 列出最終會交付給客戶的具體項目（例如：設計圖、程式碼、結案報告、活動流程表）。

### 5. 執行報價 (Execution Quotation)
**⚠️ 重要格式規範 (Strict Formatting Rules)**：
1.  **表格必須換行**：每一列必須是獨立的一行。
2.  **完整分隔線**：表格標題與內容之間必須有 \`| --- |\` 分隔線。

請以表格列出費用，並包含：
- **細項名稱** (Item)
- **數量** (Qty)
- **單價** (Unit Price)
- **總價** (Total)
- **備註** (Note)

### 6. 效益總結 (Conclusion)
- 總結本專案預期帶來的效益（如：提升品牌形象、增加營收、改善客體驗）。
`;
};
