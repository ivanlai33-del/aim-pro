-- 1. 建立一個具備超級權限的函數來檢查身分（避免無限迴圈）
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users_profile 
    WHERE id = auth.uid() AND system_role = 'superadmin'
  );
$$;

-- 2. 先刪除剛剛建立的有問題的規則
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users_profile;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.users_profile;
DROP POLICY IF EXISTS "Admins can view all subscription requests" ON public.subscription_requests;
DROP POLICY IF EXISTS "Admins can update all subscription requests" ON public.subscription_requests;

-- 3. 確保用戶至少能看見並更新自己（如果原本沒有這條的話）
CREATE POLICY "Users can view own profile" 
    ON public.users_profile FOR SELECT 
    USING (id = auth.uid());

-- 4. 重新建立安全規則（使用剛才安全的函數）
CREATE POLICY "Admins can view all profiles" 
    ON public.users_profile FOR SELECT 
    USING (public.is_superadmin());

CREATE POLICY "Admins can update all profiles" 
    ON public.users_profile FOR UPDATE 
    USING (public.is_superadmin());

CREATE POLICY "Admins can view all subscription requests" 
    ON public.subscription_requests FOR SELECT 
    USING (public.is_superadmin());

CREATE POLICY "Admins can update all subscription requests" 
    ON public.subscription_requests FOR UPDATE 
    USING (public.is_superadmin());

-- 5. 確保資料刷新
NOTIFY pgrst, 'reload schema';
