-- ==========================================
-- Supabase Schema Fix Script
-- Resolve: user_events missing user_agent column
-- Resolve: subscriptions table accessibility (406 error)
-- ==========================================

-- 1. Ensure user_events table exists and has user_agent column
CREATE TABLE IF NOT EXISTS public.user_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add user_agent if it's missing (defensive)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_events' AND column_name='user_agent') THEN
        ALTER TABLE public.user_events ADD COLUMN user_agent TEXT;
    END IF;
END $$;

-- Enable RLS and setup policy
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can insert their own events" ON public.user_events;
CREATE POLICY "Users can insert their own events" ON public.user_events 
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 2. Ensure subscriptions table exists
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT, -- e.g. 'starter', 'professional', 'enterprise'
    status TEXT DEFAULT 'active', -- 'active', 'canceled', 'expired'
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cleanup duplicates before adding constraint (Keep the latest one)
DELETE FROM public.subscriptions a USING (
      SELECT MIN(ctid) as ctid, user_id
      FROM public.subscriptions 
      GROUP BY user_id HAVING COUNT(*) > 1
    ) b
    WHERE a.user_id = b.user_id 
    AND a.ctid <> b.ctid;

-- Add unique constraint to prevent future 406 errors with maybeSingle()
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subscriptions_user_id_key') THEN
        ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- Enable RLS and setup policy
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions 
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 3. Fix platform_revenue (used in injectMockData)
CREATE TABLE IF NOT EXISTS public.platform_revenue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    plan_type TEXT NOT NULL,
    currency TEXT DEFAULT 'TWD',
    status TEXT DEFAULT 'pending',
    description TEXT,
    needs_invoice BOOLEAN DEFAULT FALSE,
    invoice_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to platform_revenue if needed
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='platform_revenue' AND column_name='currency') THEN
        ALTER TABLE public.platform_revenue ADD COLUMN currency TEXT DEFAULT 'TWD';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='platform_revenue' AND column_name='needs_invoice') THEN
        ALTER TABLE public.platform_revenue ADD COLUMN needs_invoice BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='platform_revenue' AND column_name='invoice_info') THEN
        ALTER TABLE public.platform_revenue ADD COLUMN invoice_info JSONB;
    END IF;
END $$;

ALTER TABLE public.platform_revenue ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own revenue" ON public.platform_revenue;
CREATE POLICY "Users can view their own revenue" ON public.platform_revenue 
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 4. Reload Schema Cache
NOTIFY pgrst, 'reload schema';
