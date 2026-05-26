-- ==========================================
-- Step 1: Upgrade platform_revenue for Bank Transfers
-- 執行方式：貼入 Supabase Dashboard > SQL Editor 執行
-- ==========================================

-- 1. Add transfer_last_5 column to platform_revenue
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='platform_revenue' AND column_name='transfer_last_5') THEN
        ALTER TABLE public.platform_revenue ADD COLUMN transfer_last_5 TEXT;
    END IF;
END $$;

-- 2. Update RLS policies to ensure authenticated users can INSERT into platform_revenue
-- (Previously they could only SELECT)
DROP POLICY IF EXISTS "Users can insert their own revenue" ON public.platform_revenue;
CREATE POLICY "Users can insert their own revenue" ON public.platform_revenue 
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 3. Ensure users can view their own revenue (already exists but just to be safe)
DROP POLICY IF EXISTS "Users can view their own revenue" ON public.platform_revenue;
CREATE POLICY "Users can view their own revenue" ON public.platform_revenue 
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 4. Reload Schema Cache
NOTIFY pgrst, 'reload schema';
