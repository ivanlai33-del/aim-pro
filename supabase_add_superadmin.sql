-- ==========================================
-- Step: Add Super Admin Role
-- 執行方式：貼入 Supabase Dashboard > SQL Editor 執行
-- ==========================================

-- 1. 新增 system_role 欄位到 users_profile 表中
ALTER TABLE public.users_profile 
ADD COLUMN IF NOT EXISTS system_role TEXT DEFAULT 'user';

-- 2. （重要）將您的帳號設為最高管理員
-- 請將下方的 email 替換成您用來登入的老闆帳號 Email
UPDATE public.users_profile 
SET system_role = 'superadmin' 
WHERE email = '您的Email@example.com';
