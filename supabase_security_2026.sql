-- ==========================================
-- Supabase Data API 安全更新 (2026 標準)
-- 專案：Project Estimator V3
-- 目標：明確授權 API 存取權限，避免 42501 錯誤
-- ==========================================

-- 1. 授權函數執行 (針對 AI 額度扣除等 RPC)
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- 2. 針對現有資料表進行明確授權
-- 包含：users_profile, user_events, subscriptions, platform_revenue, projects, clients, teams, team_members
DO $$ 
DECLARE
    t text;
    tables text[] := ARRAY[
        'users_profile', 'user_events', 'subscriptions', 
        'platform_revenue', 'projects', 'clients', 
        'teams', 'team_members'
    ];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        -- 授權給已登入使用者 (前端 supabase-js 主要對象)
        EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
        
        -- 授權給管理者權限 (後台操作)
        EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
        
        -- 確保 RLS 已開啟
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    END LOOP;
END $$;

-- 3. 授權序列 (防止 ID 自動遞增噴錯)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- 4. 重新整理 Schema 快取
NOTIFY pgrst, 'reload schema';

-- [確認訊息]
-- 執行完畢後，請檢查 Supabase Dashboard 的 Security Advisor 是否還有遺漏。
