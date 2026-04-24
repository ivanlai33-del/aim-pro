import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, FileText, ArrowLeft, ShieldCheck, Palette, Check, Sparkles, Plus, Trash2 } from 'lucide-react';
import { QuotationItem } from '../context/ProjectContext';
import { cn, generateId } from '@/lib/utils';

interface ContractGeneratorProps {
    quotationItems: QuotationItem[];
    totalAmount: number;
    projectName: string;
    clientName?: string;
    providerInfo?: any;
    industryId?: string;
    projectTypeId?: string; // 17種專案類型 ID
    onBack: () => void;
}

// ============================================================
// 付款模式定義（8 種，對應 17 種專案類型）
// ============================================================
export type PaymentMode = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';

export interface PaymentStage {
    label: string;
    percentage: number;
    trigger: string; // 付款觸發條件
}

export const PAYMENT_MODES: Record<PaymentMode, { name: string; stages: PaymentStage[] }> = {
    // 模式 A：三段式（小型設計、攝影）
    A: {
        name: '三段式付款',
        stages: [
            { label: '簽約訂金', percentage: 30, trigger: '於簽約時支付' },
            { label: '期中進度', percentage: 40, trigger: '於確認設計初稿後支付' },
            { label: '驗收尾款', percentage: 30, trigger: '於專案交付前支付' },
        ]
    },
    // 模式 B：四段式里程碑（網站/APP、系統整合）
    B: {
        name: '四段式里程碑付款',
        stages: [
            { label: '簽約訂金', percentage: 20, trigger: '於簽約時支付' },
            { label: '設計確認款', percentage: 30, trigger: '於設計稿確認後支付' },
            { label: '開發完成款', percentage: 30, trigger: '於系統開發完成並交付測試後支付' },
            { label: '驗收上線款', percentage: 20, trigger: '於系統正式上線/驗收通過後支付' },
        ]
    },
    // 模式 C：五段式迭代（大型軟體外包）
    C: {
        name: '五段式迭代付款',
        stages: [
            { label: '簽約訂金', percentage: 20, trigger: '於簽約時支付' },
            { label: '需求確認款', percentage: 20, trigger: '於需求規格書確認後支付' },
            { label: '第一階段款', percentage: 20, trigger: '於第一階段功能開發完成後支付' },
            { label: '第二階段款', percentage: 20, trigger: '於第二階段功能開發完成後支付' },
            { label: '驗收尾款', percentage: 20, trigger: '於系統驗收通過後支付' },
        ]
    },
    // 模式 D：月費制（社群、廣告、SEO）
    D: {
        name: '月費制付款',
        stages: [
            { label: '首月服務費', percentage: 100, trigger: '於簽約時預付首月服務費，後續每月月初支付當月費用' },
        ]
    },
    // 模式 E：工程進度制（室內設計、展場）
    E: {
        name: '工程進度付款',
        stages: [
            { label: '簽約訂金', percentage: 10, trigger: '於簽約時支付' },
            { label: '設計確認款', percentage: 20, trigger: '於設計圖確認後支付' },
            { label: '開工款', percentage: 30, trigger: '於工程開工時支付' },
            { label: '工程中期款', percentage: 20, trigger: '於工程進度達 60% 時支付' },
            { label: '完工驗收款', percentage: 20, trigger: '於完工驗收通過後支付' },
        ]
    },
    // 模式 F：活動前付清（活動、婚禮統籌）
    F: {
        name: '活動前付清',
        stages: [
            { label: '簽約訂金', percentage: 30, trigger: '於簽約時支付' },
            { label: '活動前 60 天款', percentage: 40, trigger: '於活動日前 60 天支付' },
            { label: '活動前 30 天尾款', percentage: 30, trigger: '於活動日前 30 天支付（活動前必須付清）' },
        ]
    },
    // 模式 G：顧問月費制（企業顧問、策略規劃）
    G: {
        name: '顧問月費制',
        stages: [
            { label: '簽約訂金', percentage: 30, trigger: '於簽約時支付' },
            { label: '每月顧問費', percentage: 60, trigger: '每月月初支付當月顧問費（依合約月數分期）' },
            { label: '結案報告款', percentage: 10, trigger: '於結案報告交付並確認後支付' },
        ]
    },
    // 模式 H：交付制（品牌設計、影片、攝影）
    H: {
        name: '交付制付款',
        stages: [
            { label: '簽約訂金', percentage: 30, trigger: '於簽約時支付' },
            { label: '初稿確認款', percentage: 30, trigger: '於初稿提案確認後支付' },
            { label: '最終交付款', percentage: 40, trigger: '於最終成果交付前支付' },
        ]
    },
};

// 17 種專案類型對應的付款模式
export const PROJECT_TYPE_PAYMENT_MODE: Record<string, PaymentMode> = {
    web_development: 'B',
    software_outsourcing: 'C',
    system_integration: 'B',
    social_media: 'D',
    ad_management: 'D',
    seo: 'D',
    influencer_marketing: 'A',
    brand_design: 'H',
    video_production: 'H',
    social_visual: 'A',
    photography: 'A',
    interior_design: 'E',
    event_planning: 'F',
    exhibition_design: 'E',
    business_consulting: 'G',
    corporate_training: 'A',
    strategy_planning: 'G',
};

// ============================================================
// 17 種專案類型條款庫
// ============================================================
const PROJECT_TYPE_CONTRACT_TEMPLATES: Record<string, {
    title: string;
    clauses: { id: string; title: string; content: string }[];
    aiClausePlaceholder: string;
}> = {
    // ---- 1. 網站/APP 開發 ----
    web_development: {
        title: '網站暨應用程式開發合約書',
        aiClausePlaceholder: '例如：需每週五回報進度、需提供測試帳號、需 Google Analytics 設定...',
        clauses: [
            { id: 'wd-1', title: '系統驗收標準', content: '雙方同意以報價單所列之功能規格為驗收標準。甲方應於系統交付後 10 個工作日內完成測試，若無重大 Bug（功能無法正常運作）則視為驗收通過。' },
            { id: 'wd-2', title: '主機與原始碼', content: '本專案費用不包含伺服器與網域租賃費。結案後乙方應交付完整原始碼 (Source Code) 及相關文件予甲方，並協助部署至甲方指定主機。' },
            { id: 'wd-3', title: '保固維護', content: '乙方提供驗收後 30 日之免費 Bug 修復服務（不含新功能開發）。新增需求或功能變更需另行報價，並簽訂補充協議。' },
            { id: 'wd-4', title: '瀏覽器相容性', content: '本網站保證在 Chrome、Safari、Firefox、Edge 最新版本正常顯示，並支援 iOS 及 Android 主流行動裝置。' },
            { id: 'wd-5', title: '智慧財產權', content: '本專案所開發之程式碼及設計，於甲方付清全款後，其智慧財產權歸屬甲方。開發過程中使用之開源套件，依各套件授權條款辦理。' },
        ]
    },
    // ---- 2. 軟體外包與 SaaS ----
    software_outsourcing: {
        title: '軟體開發暨維護合約書',
        aiClausePlaceholder: '例如：需每兩週 Sprint Review、需提供 API 文件、需通過資安測試...',
        clauses: [
            { id: 'so-1', title: '需求變更管理', content: '需求規格書確認後，若甲方提出變更需求，乙方應評估影響範圍並提供變更報價。雙方確認後方可執行，並調整時程與費用。' },
            { id: 'so-2', title: 'SLA 服務等級', content: '系統上線後，乙方承諾提供 99.5% 月可用率。若因乙方因素導致系統中斷超過 4 小時，乙方應提供相應補償方案。' },
            { id: 'so-3', title: '原始碼版本控管', content: '開發過程中，乙方應使用 Git 進行版本控管，並於結案時將完整 Repository 移交予甲方，包含完整提交記錄。' },
            { id: 'so-4', title: '資料所有權', content: '甲方之所有業務資料、使用者資料均屬甲方所有。乙方不得將甲方資料用於任何商業目的，並應採取適當措施保護資料安全。' },
            { id: 'so-5', title: '保密協議 (NDA)', content: '乙方對於本專案涉及之商業機密、技術方案、客戶資料等，負有永久保密義務，不得揭露予任何第三方。' },
        ]
    },
    // ---- 3. 系統整合 ----
    system_integration: {
        title: '系統整合服務合約書',
        aiClausePlaceholder: '例如：需提供整合測試報告、需確保資料遷移完整性、需提供 API 文件...',
        clauses: [
            { id: 'si-1', title: '資料遷移責任', content: '乙方應確保資料遷移之完整性與正確性。遷移前應進行完整備份，遷移後應提供資料比對報告，確認無資料遺失。' },
            { id: 'si-2', title: '現有系統相容性', content: '乙方應於整合前充分了解甲方現有系統架構。若因甲方系統版本過舊或文件不完整導致整合困難，雙方應協議調整範圍或費用。' },
            { id: 'si-3', title: 'API 串接測試', content: '所有 API 串接應通過功能測試、壓力測試及異常處理測試。測試報告應提交甲方確認後，方視為驗收通過。' },
            { id: 'si-4', title: '整合失敗應變', content: '若整合過程中發生重大問題，乙方應立即通知甲方並提出應變方案。若需回滾至原始狀態，乙方應協助執行並不另收費。' },
        ]
    },
    // ---- 4. 社群經營與內容 ----
    social_media: {
        title: '社群媒體經營委任合約書',
        aiClausePlaceholder: '例如：需每週提供內容行事曆、需在特定時間發文、需回覆留言...',
        clauses: [
            { id: 'sm-1', title: '內容著作權', content: '乙方為本專案創作之文字、圖片、影片等內容，於甲方付清費用後，著作財產權歸屬甲方。乙方保留著作人格權。' },
            { id: 'sm-2', title: '帳號管理權限', content: '乙方以甲方授權之帳號進行操作，不得擅自更改帳號密碼或移除甲方管理員權限。合約終止後，乙方應立即移除自身存取權限。' },
            { id: 'sm-3', title: 'KPI 目標值', content: '雙方同意之成效指標（如粉絲成長數、觸及率）為目標值而非保證值，實際成效受平台演算法、市場環境及甲方配合度影響。' },
            { id: 'sm-4', title: '內容審核流程', content: '乙方應於發文前 3 個工作日提交內容草稿予甲方審核。甲方應於 2 個工作日內回覆意見，逾期視為同意發布。' },
        ]
    },
    // ---- 5. 廣告投放與優化 ----
    ad_management: {
        title: '廣告代操服務合約書',
        aiClausePlaceholder: '例如：需每週提供廣告成效報告、需在特定時段投放、廣告素材需甲方審核...',
        clauses: [
            { id: 'am-1', title: '廣告帳戶所有權', content: '廣告帳戶由甲方持有，廣告費用由甲方信用卡直接扣款。乙方僅收取代操服務費，不墊付廣告費用。' },
            { id: 'am-2', title: 'KPI 免責聲明', content: '廣告成效受市場競爭、季節性因素及平台演算法影響，乙方不保證特定 ROAS 或 CPA 數值，但承諾持續優化。' },
            { id: 'am-3', title: '廣告素材授權', content: '甲方應提供合法授權之產品圖片、影片及文案素材。若因素材侵權導致廣告帳戶受限或法律糾紛，由甲方自行負責。' },
            { id: 'am-4', title: '平台政策變動', content: '若因廣告平台政策變動導致帳戶受限或廣告被拒，乙方應盡力協助申訴，但不負賠償責任。' },
        ]
    },
    // ---- 6. SEO 與搜尋策略 ----
    seo: {
        title: 'SEO 優化服務合約書',
        aiClausePlaceholder: '例如：需每月提供關鍵字排名報告、需優化特定頁面、需建立外部連結...',
        clauses: [
            { id: 'seo-1', title: '排名保證排除', content: 'SEO 為長期優化過程，受 Google 演算法更新影響，乙方不保證特定關鍵字之絕對排名位置與達成時程。' },
            { id: 'seo-2', title: '白帽 SEO 保證', content: '乙方承諾採用符合 Google 搜尋品質指南之正規優化手法，不使用黑帽技術（如購買連結、關鍵字堆砌），以保護甲方網站安全。' },
            { id: 'seo-3', title: '內容著作權', content: '乙方產出之 SEO 文章、Meta 描述及優化內容，於結案後著作財產權歸甲方所有。' },
            { id: 'seo-4', title: '競爭對手資料保密', content: '乙方於服務過程中取得之甲方競爭分析資料，負有保密義務，不得用於服務其他同業競爭客戶。' },
        ]
    },
    // ---- 7. KOL/網紅媒合 ----
    influencer_marketing: {
        title: 'KOL 媒合服務合約書',
        aiClausePlaceholder: '例如：需提供 KOL 候選名單供甲方選擇、需審核內容後才發布、需追蹤成效 30 天...',
        clauses: [
            { id: 'kol-1', title: '內容審核權', content: '甲方有權於 KOL 發布前審核合作內容。若內容不符品牌形象，甲方得要求修改，KOL 應配合調整（以合約約定次數為限）。' },
            { id: 'kol-2', title: 'KOL 違約責任', content: '若 KOL 未依約發布內容或發布後自行刪除，乙方應協助追討或尋找替代 KOL，但不負責 KOL 個人行為之賠償。' },
            { id: 'kol-3', title: '品牌安全條款', content: '若 KOL 於合作期間發生負面事件（如公關危機），甲方得要求暫停或終止合作，已支付之 KOL 費用依實際執行比例退還。' },
            { id: 'kol-4', title: '成效追蹤', content: '乙方應於內容發布後 30 日內提供成效報告，包含觸及率、互動率、點擊率等數據。' },
        ]
    },
    // ---- 8. 品牌識別與平面設計 ----
    brand_design: {
        title: '品牌設計委任契約書',
        aiClausePlaceholder: '例如：需提供 AI 原始檔、需包含中英文版本、需提供品牌使用規範手冊...',
        clauses: [
            { id: 'bd-1', title: '修改次數限制', content: '本專案包含初稿提案（2 個方向）與 3 次細節修改。超過次數之修改，乙方得按工時另行計費（NT$3,000/小時）。' },
            { id: 'bd-2', title: '智慧財產權轉讓', content: '乙方交付之最終設計稿，其著作財產權於甲方付清全款後正式移轉予甲方。提案過程中未被選用之設計方案，著作權仍屬乙方。' },
            { id: 'bd-3', title: '授權範圍', content: '本設計授權甲方用於其商業活動之全媒體應用。未經乙方書面同意，甲方不得將設計轉售或授權第三方使用。' },
            { id: 'bd-4', title: '字型授權聲明', content: '若設計中使用商業字型，甲方應自行購買相應授權。乙方可提供字型建議，但不負責甲方字型授權之取得。' },
        ]
    },
    // ---- 9. 影片與動態影像 ----
    video_production: {
        title: '影視製作承攬契約書',
        aiClausePlaceholder: '例如：需提供 4K 原始檔、需包含字幕製作、需在特定平台格式交付...',
        clauses: [
            { id: 'vp-1', title: '腳本確認', content: '甲方確認分鏡腳本後，若於拍攝現場臨時變更需求，衍生之器材、場地及人事費用由甲方負擔，並調整時程。' },
            { id: 'vp-2', title: '剪輯修改次數', content: '後期製作包含 2 次完整修改（A Copy、B Copy）。若需重新拍攝或大幅更動影片架構，視為新案另行報價。' },
            { id: 'vp-3', title: '著作權歸屬', content: '影片著作財產權於甲方付清全款後歸屬甲方。乙方保留將本作品列入作品集之展示權利（不含商業二次利用）。' },
            { id: 'vp-4', title: '肖像與音樂版權', content: '若甲方提供之演員、音樂或素材涉及第三方版權，甲方應自行取得合法授權。若因此產生法律糾紛，由甲方自行負責。' },
        ]
    },
    // ---- 10. 社群視覺設計 ----
    social_visual: {
        title: '社群視覺設計委任契約書',
        aiClausePlaceholder: '例如：需提供可編輯的 Canva 模板、需包含動態版本、需符合品牌色系...',
        clauses: [
            { id: 'sv-1', title: '模板著作權', content: '乙方交付之設計模板，著作財產權於甲方付清款項後歸屬甲方，僅限甲方自身使用，不得轉售或授權他人。' },
            { id: 'sv-2', title: '修改次數', content: '每款模板包含 2 次修改。若需大幅更動設計方向，視為新設計另行計費。' },
            { id: 'sv-3', title: '檔案格式交付', content: '乙方應交付 PNG/JPG 成品檔及可編輯之原始檔（如 Figma、Illustrator）。若甲方需特定格式，應於簽約前告知。' },
        ]
    },
    // ---- 11. 攝影服務 ----
    photography: {
        title: '商業攝影服務合約書',
        aiClausePlaceholder: '例如：需提供 RAW 原始檔、需在特定時間完成精修、需包含去背處理...',
        clauses: [
            { id: 'ph-1', title: '著作權授權', content: '本次拍攝之照片著作財產權歸乙方所有，乙方授權甲方用於本合約約定之商業用途。若需完整著作財產權轉讓，需另行議定費用。' },
            { id: 'ph-2', title: '精修張數定義', content: '本合約精修張數以雙方確認之挑選清單為準。精修包含基礎調色、曝光修正，不含大幅修圖（如移除人物、改變背景）。' },
            { id: 'ph-3', title: '模特兒與場地授權', content: '若拍攝涉及第三方模特兒或特定場地，甲方應自行取得肖像授權及場地使用許可，乙方不負相關法律責任。' },
            { id: 'ph-4', title: '原始檔保存', content: '乙方保存原始檔 (RAW) 至交付後 30 日。逾期後乙方得自行處理，甲方如需原始檔應於期限內提出。' },
        ]
    },
    // ---- 12. 室內空間設計與裝修 ----
    interior_design: {
        title: '室內設計暨工程承攬合約書',
        aiClausePlaceholder: '例如：需使用特定品牌材料、工程期間需每日清潔、需提供 3D 模擬圖...',
        clauses: [
            { id: 'id-1', title: '施工規範', content: '乙方應依據雙方確認之施工圖說及材料規格進行施作。若遇現場結構條件無法施工，雙方應協議變更設計，費用另計。' },
            { id: 'id-2', title: '工程保固', content: '本工程自驗收合格日起，提供一年工程保固（消耗品、人為損壞及天災除外）。保固期內乙方應免費修繕。' },
            { id: 'id-3', title: '工期展延', content: '因天災、管委會限制、材料缺貨或不可歸責於乙方之事由致工期延誤，完工日期得順延，不視為違約。' },
            { id: 'id-4', title: '追加工程', content: '施工過程中若甲方要求追加工程項目，乙方應提供追加報價，雙方書面確認後方可施作，並調整工期與費用。' },
            { id: 'id-5', title: '設計圖著作權', content: '乙方提供之設計圖及施工圖，著作財產權歸乙方所有。甲方僅取得本工程之使用授權，不得用於其他工程或轉讓第三方。' },
        ]
    },
    // ---- 13. 活動與婚禮統籌 ----
    event_planning: {
        title: '活動統籌承攬契約書',
        aiClausePlaceholder: '例如：需提供場地勘查報告、需安排彩排、需提供緊急應變計畫...',
        clauses: [
            { id: 'ep-1', title: '不可抗力條款', content: '若遇颱風、地震等天災或政府命令致活動無法舉行，已發生之代墊款項（場地費、設備訂金等）由甲方負擔，乙方服務費依執行比例退還。' },
            { id: 'ep-2', title: '人數變動', content: '最終與會人數應於活動前 14 日確認。若現場人數超出預估 10% 以上，衍生之餐飲、座位等費用由甲方照價支付。' },
            { id: 'ep-3', title: '取消與延期', content: '活動取消或延期應提前書面通知：30 日前通知退還 50% 服務費；14 日前通知退還 20%；14 日內通知不予退還。' },
            { id: 'ep-4', title: '設備損壞責任', content: '若因甲方、賓客或第三方不當使用致租賃設備損壞，甲方應負賠償責任，費用以設備市價為準。' },
        ]
    },
    // ---- 14. 展場與特展企劃 ----
    exhibition_design: {
        title: '展場設計工程合約書',
        aiClausePlaceholder: '例如：需提供 3D 展場模擬圖、需符合展館消防規定、需在展後提供拆除報告...',
        clauses: [
            { id: 'ex-1', title: '進撤場規範', content: '乙方應配合展覽館規定時間進場與撤場。若因甲方延遲提供展品或確認設計致工時延誤，加班費由甲方支付。' },
            { id: 'ex-2', title: '水電申請費用', content: '展位之水電氣申請規費由甲方負擔，乙方負責代為規劃、申請與送件，規費實報實銷。' },
            { id: 'ex-3', title: '場地恢復原狀', content: '撤展後乙方應將展位恢復至展館要求之狀態。大型廢棄物清運費用已包含於報價中，甲方展品需自行安排運回。' },
            { id: 'ex-4', title: '展品損壞責任', content: '乙方應妥善保管施工期間之甲方展品。若因乙方疏失導致展品損壞，乙方應負賠償責任。' },
        ]
    },
    // ---- 15. 企業管理顧問 ----
    business_consulting: {
        title: '企業管理顧問委任合約書',
        aiClausePlaceholder: '例如：需每月提交顧問報告、需參與董事會議、需提供競爭對手分析...',
        clauses: [
            { id: 'bc-1', title: '顧問報告著作權', content: '乙方提供之顧問報告、分析文件及建議書，著作財產權歸乙方所有。甲方取得內部使用授權，不得對外公開或轉讓。' },
            { id: 'bc-2', title: '保密協議 (NDA)', content: '乙方對於本專案涉及之商業機密、財務資料、客戶名單等，負有永久保密義務，不得揭露予任何第三方，包括乙方其他客戶。' },
            { id: 'bc-3', title: '建議採納免責', content: '乙方提供之建議基於現有資訊與專業判斷，甲方採納與否為其自主決策。若因甲方執行方式不當導致損失，乙方不負賠償責任。' },
            { id: 'bc-4', title: '利益衝突聲明', content: '乙方承諾於本合約期間，不同時為甲方之直接競爭對手提供相同性質之顧問服務。' },
        ]
    },
    // ---- 16. 企業培訓與教練 ----
    corporate_training: {
        title: '企業培訓服務合約書',
        aiClausePlaceholder: '例如：需提供課前問卷、需錄製課程影片、需提供課後作業批改...',
        clauses: [
            { id: 'ct-1', title: '課程著作權', content: '乙方提供之課程教材、簡報及相關資料，著作財產權歸乙方所有。甲方取得學員內部學習使用授權，不得錄製、複製或對外販售。' },
            { id: 'ct-2', title: '錄影錄音限制', content: '未經乙方書面同意，甲方及學員不得錄製課程影音。違反者乙方得要求立即刪除並請求損害賠償。' },
            { id: 'ct-3', title: '課程取消政策', content: '課程取消應提前通知：14 日前通知退還 80% 費用；7 日前通知退還 50%；7 日內通知不予退還（已發生備課成本）。' },
            { id: 'ct-4', title: '成效評估免責', content: '培訓成效受學員個人投入程度、組織環境等因素影響，乙方不保證特定績效提升結果，但承諾提供專業且高品質之課程內容。' },
        ]
    },
    // ---- 17. 策略規劃 ----
    strategy_planning: {
        title: '策略規劃顧問合約書',
        aiClausePlaceholder: '例如：需每季提交策略檢討報告、需參與年度規劃會議、需提供市場進入分析...',
        clauses: [
            { id: 'sp-1', title: '策略報告著作權', content: '乙方提供之策略報告、市場分析及規劃文件，著作財產權歸乙方所有。甲方取得內部決策使用授權，不得對外公開。' },
            { id: 'sp-2', title: '保密協議 (NDA)', content: '乙方對於甲方之商業計畫、財務預測、市場策略等機密資訊，負有永久保密義務，不得用於服務其他客戶或對外揭露。' },
            { id: 'sp-3', title: '執行結果免責', content: '乙方之策略建議基於現有市場資訊與專業分析，市場環境變化可能影響策略成效。甲方執行策略之結果由甲方自行承擔。' },
            { id: 'sp-4', title: '競業禁止', content: '乙方承諾於本合約期間及結束後 6 個月內，不為甲方之直接競爭對手提供相同策略規劃服務。' },
        ]
    },
};

// 向後相容：舊的 industryId 對應到預設的 projectTypeId
const INDUSTRY_TO_DEFAULT_PROJECT_TYPE: Record<string, string> = {
    web: 'web_development',
    graphic: 'brand_design',
    video: 'video_production',
    renovation: 'interior_design',
    marketing: 'social_media',
    ads: 'ad_management',
    seo: 'seo',
    event: 'event_planning',
    exhibition: 'exhibition_design',
    discord: 'social_media',
};

export default function ContractGenerator({
    quotationItems,
    totalAmount,
    projectName,
    clientName = "_________________",
    providerInfo,
    industryId = 'web',
    projectTypeId,
    onBack
}: ContractGeneratorProps) {
    const contractRef = useRef<HTMLDivElement>(null);
    const currentDate = new Date().toLocaleDateString('zh-TW');
    const [contractStyle, setContractStyle] = useState<'formal' | 'concise' | 'modern' | 'standard' | 'detailed'>('formal');

    // 解析 projectTypeId：優先使用 projectTypeId，否則從 industryId 推斷
    const resolvedProjectTypeId = projectTypeId ||
        INDUSTRY_TO_DEFAULT_PROJECT_TYPE[industryId] ||
        'web_development';

    // 載入對應的條款模板
    const template = PROJECT_TYPE_CONTRACT_TEMPLATES[resolvedProjectTypeId] ||
        PROJECT_TYPE_CONTRACT_TEMPLATES.web_development;

    // 載入對應的付款模式
    const paymentModeKey = PROJECT_TYPE_PAYMENT_MODE[resolvedProjectTypeId] || 'B';
    const paymentMode = PAYMENT_MODES[paymentModeKey];

    const initialClauses = [
        ...template.clauses,
        { id: 'common-conf', title: '保密條款', content: '雙方應對本專案涉及之商業機密負保密義務，未經他方同意不得揭露予第三人。' },
        { id: 'common-term', title: '合約終止', content: '若任一方違反合約規範，他方得限期改善；屆期未改善者得終止合約並請求損害賠償。' }
    ];

    const [selectedClauses, setSelectedClauses] = useState<string[]>(initialClauses.map(c => c.id));
    const [clauses, setClauses] = useState(initialClauses);

    const [customPrompt, setCustomPrompt] = useState('');
    const [aiDraft, setAiDraft] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [customClauses, setCustomClauses] = useState<{ id: string; title: string; content: string }[]>([]);

    const handleGenerateAICause = () => {
        if (!customPrompt.trim()) return;
        setIsGenerating(true);

        // Simulating AI Generation Delay
        setTimeout(() => {
            const cleanPrompt = customPrompt.trim();
            const formalContent = `雙方同意針對「${cleanPrompt}」事項約定如下：\n` +
                `若涉及${cleanPrompt.includes('款') ? '款项支付' : '執行細節'}，應以誠信原則協商。` +
                `${cleanPrompt.replace(/我要|我們想|希望/g, '甲方得請求').replace(/對方|你/g, '乙方')}。` +
                `此約定具備法律效力，雙方應共同遵守。`;

            setAiDraft(formalContent);
            setIsGenerating(false);
        }, 1500);
    };

    const handleAddCustomClause = () => {
        if (!aiDraft.trim()) return;
        const newId = `custom-${generateId()}`;
        const newClause = {
            id: newId,
            title: '特別約定事項',
            content: aiDraft
        };
        // Add to main clauses list
        setClauses(prev => [...prev, newClause]);
        // Auto-select the new clause
        setSelectedClauses(prev => [...prev, newId]);

        setAiDraft('');
        setCustomPrompt('');
    };

    const handleDeleteClause = (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent toggling selection when deleting
        if (confirm('確定要刪除此條款嗎？')) {
            setClauses(prev => prev.filter(c => c.id !== id));
            setSelectedClauses(prev => prev.filter(cId => cId !== id));
        }
    };

    const handleDownloadPDF = () => {
        window.print();
    };

    // 動態計算付款金額（根據付款模式）
    const paymentAmounts = paymentMode.stages.map(stage => ({
        ...stage,
        amount: Math.round(totalAmount * stage.percentage / 100)
    }));

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header Actions */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-black/20 shadow-sm sticky top-0 z-10 print:hidden">
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    返回報價單
                </button>
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg border border-black/20 mr-2">
                        <Palette className="w-4 h-4 ml-2 text-slate-400" />
                        <select
                            value={contractStyle}
                            onChange={(e) => setContractStyle(e.target.value as any)}
                            className="bg-transparent text-sm font-bold text-slate-700 focus:outline-none py-1.5 px-2 cursor-pointer outline-none"
                            title="選擇合約樣式"
                        >
                            <option value="formal">樣式：正式嚴謹 (Formal)</option>
                            <option value="concise">樣式：精簡便捷 (Concise)</option>
                            <option value="modern">樣式：現代商務 (Modern)</option>
                            <option value="standard">樣式：標準通用 (Standard)</option>
                            <option value="detailed">樣式：詳細完整 (Detailed)</option>
                        </select>
                    </div>
                    <span className="text-[10px] font-black text-amber-900 bg-gradient-to-r from-amber-50 to-yellow-100 px-4 py-2 rounded-full border border-amber-200 flex items-center shadow-sm tracking-widest uppercase">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                        已啟用防禦條款
                    </span>
                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center px-7 py-3 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-2xl hover:brightness-110 transition-all shadow-[0_8px_20px_-4px_rgba(79,70,229,0.4)] font-black text-sm active:scale-95 h-12"
                    >
                        <Download className="w-5 h-5 mr-2" />
                        匯出 PDF
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Left Panel: Controls */}
                <div className="w-full lg:w-80 bg-white p-6 rounded-2xl border border-black/20 shadow-sm space-y-8 shrink-0 print:hidden">
                    <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">條款庫 (Clauses)</h4>
                        <div className="space-y-3">
                            {clauses.map(clause => (
                                <div key={clause.id} className="relative group">
                                    <button
                                        onClick={() => {
                                            if (selectedClauses.includes(clause.id)) {
                                                setSelectedClauses(selectedClauses.filter(id => id !== clause.id));
                                            } else {
                                                setSelectedClauses([...selectedClauses, clause.id]);
                                            }
                                        }}
                                        className={cn(
                                            "w-full text-left p-3 rounded-lg text-sm border transition-all flex items-baseline relative z-0",
                                            selectedClauses.includes(clause.id)
                                                ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
                                                : "bg-white border-transparent hover:bg-slate-50 text-slate-500"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-4 h-4 rounded border mr-3 flex items-center justify-center shrink-0 transition-colors",
                                            selectedClauses.includes(clause.id) ? "bg-emerald-500 border-emerald-500" : "border-black/20 bg-white"
                                        )}>
                                            {selectedClauses.includes(clause.id) && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <div>
                                            <span className={cn(
                                                "font-bold block mb-1",
                                                selectedClauses.includes(clause.id) ? "text-slate-800" : "text-slate-600"
                                            )}>{clause.title}</span>
                                            <p className="text-xs opacity-70 line-clamp-2 text-slate-500">{clause.content}</p>
                                        </div>
                                    </button>
                                    {/* Delete button for custom clauses */}
                                    {clause.id.startsWith('custom-') && (
                                        <button
                                            onClick={(e) => handleDeleteClause(clause.id, e)}
                                            className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 print:hidden"
                                            title="刪除此自訂條款"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                        <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1 flex items-center">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            防禦力評估
                        </p>
                        <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className={cn("h-1 flex-1 rounded-full", i <= selectedClauses.length ? "bg-amber-500" : "bg-amber-200")} />
                            ))}
                        </div>
                        <p className="text-[10px] text-amber-600 font-bold">
                            {selectedClauses.length >= 4 ? "合約極度穩健，建議使用。" : "建議至少包含修改與智慧財產權條款。"}
                        </p>
                    </div>

                    {/* AI Custom Clause Panel */}
                    <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="bg-indigo-100 p-1.5 rounded-lg">
                                <Sparkles className="w-4 h-4 text-indigo-600" />
                            </div>
                            <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest">AI 智慧條款生成</h4>
                        </div>

                        <textarea
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            placeholder={template.aiClausePlaceholder}
                            className="w-full text-xs p-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-200 outline-none resize-none bg-white h-20"
                        />

                        {aiDraft ? (
                            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                                <textarea
                                    value={aiDraft}
                                    onChange={(e) => setAiDraft(e.target.value)}
                                    className="w-full text-xs p-3 rounded-xl border-2 border-indigo-500 bg-white h-32 focus:outline-none"
                                    title="AI 生成條款內容"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setAiDraft('')}
                                        className="flex-1 py-2 text-xs font-black text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        取消
                                    </button>
                                    <button
                                        onClick={handleAddCustomClause}
                                        className="flex-1 py-2 bg-indigo-600 text-white text-xs font-black rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center"
                                    >
                                        <Plus className="w-3 h-3 mr-1" />
                                        加入合約
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleGenerateAICause}
                                disabled={!customPrompt.trim() || isGenerating}
                                className="w-full py-3 bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs font-black rounded-xl hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group shadow-[0_4px_12px_-2px_rgba(79,70,229,0.3)]"
                            >
                                {isGenerating ? (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                                        AI 撰寫中...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                        AI 自動撰寫條款
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Panel: Preview */}
                <div className="flex-1 w-full overflow-x-auto bg-slate-100 p-4 md:p-10 rounded-3xl border border-black/20 shadow-inner flex justify-center print:p-0 print:m-0 print:bg-white print:border-none print:shadow-none print:overflow-visible print:w-full print:max-w-none">
                    <div
                        ref={contractRef}
                        className={cn(
                            "bg-white shadow-xl mx-auto transition-all duration-300 print:shadow-none print:w-full print:max-w-none print:m-0 print:border-none",
                            contractStyle === 'formal' && "max-w-4xl p-16 font-serif text-slate-900 border-2 border-slate-900 print:p-16",
                            contractStyle === 'concise' && "max-w-3xl p-12 font-sans text-slate-800 border-t-8 border-indigo-600 bg-slate-50 print:bg-white print:p-12",
                            contractStyle === 'modern' && "max-w-4xl p-16 font-sans text-slate-800 bg-white border border-black/20 rounded-3xl print:rounded-none print:p-16",
                            contractStyle === 'standard' && "max-w-4xl p-12 font-serif text-slate-900 print:p-12",
                            contractStyle === 'detailed' && "max-w-5xl p-16 font-sans text-slate-800 bg-white border-l-4 border-slate-900 print:p-16"
                        )}
                    >
                        {/* Watermark - Lighter */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
                            <div className="transform -rotate-45 text-8xl font-black text-slate-800 tracking-[1em]">
                                CONTRACT
                            </div>
                        </div>

                        {/* Title */}
                        {/* Title Section */}
                        {contractStyle === 'modern' ? (
                            <div className="mb-16 border-b border-black/20 pb-8">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">Service Agreement</p>
                                <h1 className="text-5xl font-black text-slate-800 tracking-tight mb-2">{template.title}</h1>
                                <p className="text-sm font-medium text-slate-500">
                                    Agreement Date: <span className="text-slate-800">{currentDate}</span>
                                </p>
                            </div>
                        ) : contractStyle === 'detailed' ? (
                            <div className="mb-16 text-center">
                                <div className="inline-block border-b-2 border-slate-900 pb-2 mb-2">
                                    <h1 className="text-3xl font-bold font-serif tracking-widest text-slate-900">{template.title}</h1>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">PROFESSIONAL SERVICES CONTRACT</p>
                            </div>
                        ) : contractStyle === 'concise' ? (
                            <div className="mb-10 flex items-end justify-between border-b border-black/20 pb-4">
                                <div>
                                    <h1 className="text-2xl font-black text-slate-800">{template.title}</h1>
                                    <p className="text-xs text-slate-400 mt-1">Project Agreement</p>
                                </div>
                                <p className="text-xs font-bold text-slate-400">{currentDate}</p>
                            </div>
                        ) : (
                            // Standard & Formal
                            <div className="text-center mb-16 space-y-2">
                                <h1 className="text-3xl font-bold tracking-widest text-slate-900">{template.title}</h1>
                                <p className="text-[10px] text-slate-400 uppercase tracking-[0.5em]">Service Agreement</p>
                            </div>
                        )}

                        {/* Parties */}
                        {/* Parties Section */}
                        {contractStyle === 'concise' ? (
                            <div className="bg-slate-50 p-6 rounded-xl mb-10 text-sm leading-relaxed border border-black/20 text-slate-600">
                                <p>
                                    <strong>立合約人：</strong><br />
                                    甲方 (Client): <strong>{clientName}</strong><br />
                                    乙方 (Provider): <strong>{providerInfo?.name}</strong><br />
                                    <span className="text-xs text-slate-400 mt-2 block">雙方同意就 <strong>{projectName}</strong> 專案進行合作，並遵守以下條款。</span>
                                </p>
                            </div>
                        ) : contractStyle === 'modern' ? (
                            <div className="flex gap-12 mb-20">
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">CLIENT (甲方)</p>
                                    <p className="text-xl font-black text-slate-900 mb-2">{clientName}</p>
                                    <div className="h-px w-12 bg-slate-200"></div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">PROVIDER (乙方)</p>
                                    <p className="text-xl font-black text-slate-900 mb-2">{providerInfo?.name}</p>
                                    <p className="text-xs text-slate-500 font-medium">{providerInfo?.taxId && `Tax ID: ${providerInfo.taxId}`}</p>
                                </div>
                            </div>
                        ) : (
                            // Standard / Formal / Detailed
                            <div className={cn(
                                "mb-16 space-y-6 text-base",
                                contractStyle === 'detailed' && "px-8"
                            )}>
                                <div className="flex items-baseline border-b border-black/20 pb-2">
                                    <span className="w-32 font-bold text-slate-500 text-sm uppercase tracking-wider">Client (甲方)</span>
                                    <span className="flex-1 font-bold text-slate-900 text-lg px-4">{clientName}</span>
                                </div>
                                <div className="flex items-baseline border-b border-black/20 pb-2">
                                    <span className="w-32 font-bold text-slate-500 text-sm uppercase tracking-wider">Provider (乙方)</span>
                                    <span className="flex-1 font-bold text-slate-900 text-lg px-4">{providerInfo?.name || '（您的工作室名稱）'}</span>
                                </div>
                                {providerInfo?.taxId && (
                                    <div className="flex items-baseline border-b border-black/20 pb-2">
                                        <span className="w-32 font-bold text-slate-500 text-sm uppercase tracking-wider">Tax ID (統編)</span>
                                        <span className="flex-1 font-medium text-slate-700 px-4 font-sans">{providerInfo.taxId}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Main Content */}
                        <div className={cn(
                            "space-y-8 text-sm text-justify",
                            contractStyle === 'concise' && "space-y-4 text-xs",
                            contractStyle === 'detailed' && "space-y-12"
                        )}>
                            {contractStyle !== 'concise' && (
                                <p>
                                    茲因甲方委託乙方進行 <strong>{projectName}</strong> 之設計與製作專案（以下簡稱本專案），
                                    雙方同意訂立本契約，並約定條款如下，以此為憑：
                                </p>
                            )}

                            <section className="mb-8 break-inside-avoid">
                                <h3 className={cn(
                                    "font-bold text-lg mb-4 flex items-center text-slate-800",
                                    contractStyle === 'modern' && "text-xl font-black mb-6",
                                    contractStyle === 'formal' && "justify-center mb-6 text-xl tracking-widest",
                                )}>
                                    {contractStyle === 'modern' && <span className="text-indigo-500 mr-2 text-sm">01.</span>}
                                    {contractStyle === 'formal' ? "第一條 專案內容與費用" : "第一條、專案內容與費用"}
                                </h3>
                                <div className="pl-4 border-l border-black/20">
                                    <p className="mb-2 text-slate-700">1. 本專案之執行內容詳見附件報價單。</p>
                                    <p className="text-slate-700">2. 本專案總金額為新台幣 <strong className="font-sans text-slate-900">{totalAmount.toLocaleString()} 元整</strong> (含稅)。</p>
                                </div>
                            </section>

                            <section className="mb-8 break-inside-avoid">
                                <h3 className={cn(
                                    "font-bold text-lg mb-4 flex items-center text-slate-800",
                                    contractStyle === 'modern' && "text-xl font-black mb-6",
                                    contractStyle === 'formal' && "justify-center mb-6 text-xl tracking-widest",
                                )}>
                                    {contractStyle === 'modern' && <span className="text-indigo-500 mr-2 text-sm">02.</span>}
                                    {contractStyle === 'formal' ? "第二條 付款辦法" : "第二條、付款辦法"}
                                </h3>
                                <div className="pl-4 border-l border-black/20">
                                    <p className="mb-1 text-xs text-slate-400 font-bold uppercase tracking-wider">付款模式：{paymentMode.name}</p>
                                    <p className="mb-3 text-slate-700">甲方應依下列階段支付款項予乙方：</p>
                                    <ul className="list-none space-y-2">
                                        {paymentAmounts.map((stage, index) => (
                                            <li key={index} className="flex items-baseline">
                                                <span className="w-2 h-2 rounded-full bg-slate-200 mr-3 shrink-0"></span>
                                                <span>
                                                    第{['一', '二', '三', '四', '五'][index]}期（{stage.label}）：新台幣 <strong>{stage.amount.toLocaleString()}</strong> 元 ({stage.percentage}%)，{stage.trigger}。
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            {selectedClauses.map((id, index) => {
                                const clause = clauses.find(c => c.id === id);
                                if (!clause) return null;
                                return (
                                    <section key={id} className="mb-6 break-inside-avoid">
                                        <h3 className={cn(
                                            "font-bold text-lg mb-2 flex items-center text-slate-800",
                                            contractStyle === 'modern' && "text-xl font-black mb-4",
                                            contractStyle === 'formal' && "justify-center mb-4 text-xl tracking-widest",
                                        )}>
                                            {contractStyle === 'modern' && <span className="text-indigo-500 mr-2 text-sm">{String(index + 3).padStart(2, '0')}.</span>}
                                            {contractStyle === 'formal' ? `第 ${index + 3} 條 ${clause.title}` : `第 ${index + 3} 條、${clause.title}`}
                                        </h3>
                                        <p className="leading-relaxed pl-4 border-l-2 border-slate-50 text-slate-700">{clause.content}</p>
                                    </section>
                                );
                            })}

                            {/* Render Custom Clauses */}
                            {customClauses.map((clause, index) => (
                                <section key={clause.id} className="relative group/clause">
                                    <h3 className={cn(
                                        "font-bold text-base mb-2 border-l-4 border-slate-800 pl-2",
                                        contractStyle === 'modern' && "text-xl font-black border-none pl-0 text-slate-900 flex items-center",
                                        contractStyle === 'concise' && "text-sm mb-1"
                                    )}>
                                        {contractStyle === 'modern' && <Check className="w-5 h-5 mr-2 text-indigo-600" />}
                                        第 {selectedClauses.length + 3 + index} 條、{clause.title}
                                    </h3>
                                    <p className="leading-relaxed whitespace-pre-wrap">{clause.content}</p>
                                    <button
                                        onClick={() => setCustomClauses(customClauses.filter(c => c.id !== clause.id))}
                                        className="absolute -right-8 top-0 text-slate-300 hover:text-rose-500 opacity-0 group-hover/clause:opacity-100 transition-all p-2"
                                        title="移除此條款"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </section>
                            ))}

                            <section>
                                <h3 className={cn(
                                    "font-bold text-base mb-2 border-l-4 border-slate-800 pl-2",
                                    contractStyle === 'modern' && "text-xl font-black border-none pl-0 text-slate-900 flex items-center",
                                    contractStyle === 'concise' && "text-sm mb-1"
                                )}>
                                    {contractStyle === 'modern' && <Check className="w-5 h-5 mr-2 text-indigo-600" />}
                                    第 {selectedClauses.length + 3 + customClauses.length} 條、其他
                                </h3>
                                <p>本契約一式兩份，甲乙雙方各執一份為憑。若有未盡事宜，依中華民國法律辦理。</p>
                            </section>
                        </div>

                        {/* Signatures */}
                        <div className={cn(
                            "mt-24 grid gap-16 pt-12 border-t border-black/30",
                            contractStyle === 'concise' ? "grid-cols-2 mt-12 gap-8" : "grid-cols-2"
                        )}>
                            <div>
                                <p className="font-bold mb-12 text-slate-900 text-lg">甲方簽章 (Client):</p>
                                <div className="h-px w-full bg-slate-400 mb-4"></div>
                                <div className="flex justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                                    <span>Authorized Signature</span>
                                    <span>Date: {currentDate}</span>
                                </div>
                            </div>
                            <div>
                                <p className="font-bold mb-2 text-slate-900 text-lg">乙方簽章 (Studio):</p>
                                <div className="text-xs text-slate-500 mb-8 font-medium">
                                    <p>{providerInfo?.name}</p>
                                </div>
                                <div className="h-px w-full bg-slate-400 mb-4"></div>
                                <div className="flex justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                                    <span>Authorized Signature</span>
                                    <span>Date: {currentDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
