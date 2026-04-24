-- 1. 補齊 platform_revenue 缺少的欄位
ALTER TABLE public.platform_revenue ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'TWD';
ALTER TABLE public.platform_revenue ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.platform_revenue ADD COLUMN IF NOT EXISTS needs_invoice BOOLEAN DEFAULT FALSE;
ALTER TABLE public.platform_revenue ADD COLUMN IF NOT EXISTS invoice_info JSONB;

-- 2. 放寬 RLS 以便測試注入 (或是給予 Service Role 權限)
-- 這裡我們簡單點，允許所有認證用戶寫入事件 (因為前端本來就要寫入)
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.user_events;
CREATE POLICY "Enable insert for authenticated users" ON public.user_events FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. 確保管理員可以看到所有數據
DROP POLICY IF EXISTS "Admins can view all events" ON public.user_events;
CREATE POLICY "Admins can view all events" ON public.user_events FOR SELECT USING (EXISTS (SELECT 1 FROM public.users_profile WHERE id = auth.uid() AND is_admin = TRUE));

DROP POLICY IF EXISTS "Admins can view all revenue" ON public.platform_revenue;
CREATE POLICY "Admins can view all revenue" ON public.platform_revenue FOR SELECT USING (EXISTS (SELECT 1 FROM public.users_profile WHERE id = auth.uid() AND is_admin = TRUE));
