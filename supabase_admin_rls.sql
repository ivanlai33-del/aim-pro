-- 開通 Super Admin 的「天眼通」權限 (Bypass RLS for admins)

-- 1. 允許 Super Admin 查看所有人的 user_profile
CREATE POLICY "Admins can view all profiles" 
    ON public.users_profile FOR SELECT 
    USING (EXISTS (SELECT 1 FROM users_profile WHERE id = auth.uid() AND system_role = 'superadmin'));

-- 2. 允許 Super Admin 查看所有人的匯款單 (platform_revenue / subscription_requests)
-- 假設您使用的是 subscription_requests
CREATE POLICY "Admins can view all subscription requests" 
    ON public.subscription_requests FOR SELECT 
    USING (EXISTS (SELECT 1 FROM users_profile WHERE id = auth.uid() AND system_role = 'superadmin'));

-- 3. 允許 Super Admin 更新所有人的匯款單
CREATE POLICY "Admins can update all subscription requests" 
    ON public.subscription_requests FOR UPDATE 
    USING (EXISTS (SELECT 1 FROM users_profile WHERE id = auth.uid() AND system_role = 'superadmin'));

-- 4. 允許 Super Admin 更改別人的 profile (用來開通權限)
CREATE POLICY "Admins can update all profiles" 
    ON public.users_profile FOR UPDATE 
    USING (EXISTS (SELECT 1 FROM users_profile WHERE id = auth.uid() AND system_role = 'superadmin'));
