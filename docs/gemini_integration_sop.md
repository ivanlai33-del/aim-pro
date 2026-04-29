# Gemini AI 串接與報告視覺化 SOP (v1.0)

本文件歸納了 `project-estimator-v3` 專案中，如何穩定實作 AI 報告生成、Mermaid 圖表渲染以及局部選取修改的核心技術流程。

## 1. 環境變數配置 (Backend Config)
金鑰必須儲存於 `.env.local` 且嚴禁上傳至 Git。
- **變數名稱**：`GEMINI_API_KEY`
- **安全規範**：`.gitignore` 必須包含 `.env*.local`。
- **取得路徑**：[Google AI Studio](https://aistudio.google.com/app/apikey)。

## 2. API 串接標準 (API Standard)
經測試，最穩定的請求配置如下：
- **API 版本**：`v1beta` (提供最新模型支援)。
- **模型名稱**：`gemini-flash-latest` (自動對應至當前最快的預覽版模型)。
- **Endpoint 格式**：
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`

## 3. 視覺化圖表實作 (Visualization)
為了讓報告具備「圖像表達能力」，需遵循以下流程：
- **前端渲染**：引入 `mermaid.js`。
- **AI 指令**：在 System Prompt 中加入：
  > 「當需要解釋複雜流程或時程時，請自動調度 Mermaid 語法輸出圖表代碼塊。」
- **渲染邏輯**：使用 `ReactMarkdown` 的自定義組件攔截 `language-mermaid` 代碼塊，並調用 `mermaid.render()` 輸出 SVG。

## 4. 局部選取修改 (Surgical Refinement)
實作「選哪裡改哪裡」的協作邏輯：
- **偵測**：監聽 `textarea` 的 `selectionStart` 與 `selectionEnd`。
- **請求**：僅發送「選取的文字」+「修改指令」給後端。
- **後端提示詞**：要求 AI 「僅輸出替換內容，不要帶有任何解釋性文字」。
- **替換**：前端使用字串切片 (`substring`) 將新內容精確插回原位置。

## 5. 安全與除錯規範 (Security & Debug)
- **洩漏保護**：前端必須實作自動清理邏輯，偵測到 Leaked Key 時強制執行 `localStorage.removeItem`。
- **數據校正**：AI 輸出表格時，後端應加入指令要求其自動校對「數量 * 單價 = 總價」的邏輯。
- **Turnstile 驗證**：生產環境必須強制驗證 `turnstileToken`，開發環境可設為可選。

## 6. 常見故障排除 (Troubleshooting)
- **400/403 錯誤**：檢查金鑰是否被標記為 Leaked，或 API 版本是否設為 `v1beta`。
- **500 錯誤**：檢查環境變數是否正確載入（建議重啟 `npm run dev`）。
- **圖表不顯示**：檢查 `mermaid.initialize` 是否在 `window` 對象就緒後執行。

---
*文件編撰日期：2026-04-29*
*編撰者：Antigravity AI Assistant*
