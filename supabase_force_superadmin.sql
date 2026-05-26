-- ==========================================
-- 強制賦予 Super Admin 權限 (關閉 USER 觸發器版)
-- ==========================================

-- 1. 確保欄位存在
ALTER TABLE public.users_profile 
ADD COLUMN IF NOT EXISTS system_role TEXT DEFAULT 'user';

-- 2. 暫停資料庫防作弊觸發器 (僅限 USER 自訂觸發器，避開系統底層)
ALTER TABLE public.users_profile DISABLE TRIGGER USER;

-- 3. 強制寫入或更新您的帳號
INSERT INTO public.users_profile (id, email, system_role, tier, ai_quota)
SELECT id, email, 'superadmin', 'enterprise', 9999
FROM auth.users
WHERE email = 'ivan@ycideas.com'
ON CONFLICT (id) DO UPDATE 
SET system_role = 'superadmin', tier = 'enterprise';

-- 4. 重新啟動防作弊觸發器
ALTER TABLE public.users_profile ENABLE TRIGGER USER;

-- 5. 通知資料庫更新快取
NOTIFY pgrst, 'reload schema';
