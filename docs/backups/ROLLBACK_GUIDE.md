# 🚨 緊急災難復原與版本回滾操作手冊 (Rollback Guide)

本手冊記載 `aim-pro` (Project Estimator V3) 專案在實施「SaaS 多租戶 HTML 保密防禦報價與合約系統」大改版前的緊急回滾與檔案還原步驟。

---

## 方式一：Git Tag 秒級回滾 (建議首選)

本專案在改版前已打上 Git 標籤 `v3-pre-proposal-upgrade`。若線上環境出現任何重大頁面故障，請直接於 shell 執行以下指令：

```bash
cd /Volumes/512M.2/ivan_GihHub/aim-pro

# 1. 強制重置本地庫至改版前之標籤狀態
git reset --hard v3-pre-proposal-upgrade

# 2. 強制推送至遠端 github main 分支觸發 Vercel 自動還原
git push origin main --force
```

---

## 方式二：檔案層級手動還原 (`/docs/backups/`)

改版前之原始組件已完整備份於 `docs/backups/pre_proposal_upgrade_backup/` 目錄中：

- `QuotationBuilder.tsx.bak`
- `ContractGenerator.tsx.bak`
- `ReportView.tsx.bak`
- `ProjectContext.tsx.bak`

如需單獨還原特定檔案，請執行：

```bash
cd /Volumes/512M.2/ivan_GihHub/aim-pro

cp docs/backups/pre_proposal_upgrade_backup/QuotationBuilder.tsx.bak src/components/QuotationBuilder.tsx
cp docs/backups/pre_proposal_upgrade_backup/ContractGenerator.tsx.bak src/components/ContractGenerator.tsx
cp docs/backups/pre_proposal_upgrade_backup/ReportView.tsx.bak src/components/ReportView.tsx
cp docs/backups/pre_proposal_upgrade_backup/ProjectContext.tsx.bak src/context/ProjectContext.tsx
```

---

## 方式三：Vercel 雲端主機 1-Click Rollback

1. 登入 Vercel 主控台並點選 `aim-pro` 專案。
2. 進入 `Deployments` 頁面。
3. 找到大改版前的 Deployment 紀錄。
4. 點擊右側 `[...] -> Promote to Production`。
5. 雲端伺服器將在 5 秒內還原全站！

---
備份時間點：2026-07-26
Git Tag: `v3-pre-proposal-upgrade`
