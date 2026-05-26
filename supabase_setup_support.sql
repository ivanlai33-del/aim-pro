-- ==========================================
-- 建立客服對話系統 (Support Ticketing System) 資料表
-- ==========================================

-- 1. 建立 support_tickets (客服工單)
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    status TEXT DEFAULT 'open', -- 'open', 'replied', 'closed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. 建立 ticket_messages (對話紀錄泡泡)
CREATE TABLE IF NOT EXISTS public.ticket_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 啟用 RLS 安全機制
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

-- 4. 設定安全規則 (Policies)
-- 用戶只能看到自己的工單，管理員能看到所有人的
CREATE POLICY "Users can view own tickets" 
    ON public.support_tickets FOR SELECT 
    USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM users_profile WHERE id = auth.uid() AND system_role = 'superadmin'));

CREATE POLICY "Users can create own tickets" 
    ON public.support_tickets FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update tickets" 
    ON public.support_tickets FOR UPDATE 
    USING (EXISTS (SELECT 1 FROM users_profile WHERE id = auth.uid() AND system_role = 'superadmin'));

-- 用戶只能看到自己工單內的訊息，管理員能看到所有人的
CREATE POLICY "Users can view own ticket messages" 
    ON public.ticket_messages FOR SELECT 
    USING (
        EXISTS (SELECT 1 FROM support_tickets WHERE id = ticket_id AND user_id = auth.uid()) OR 
        EXISTS (SELECT 1 FROM users_profile WHERE id = auth.uid() AND system_role = 'superadmin')
    );

CREATE POLICY "Users can send messages to own tickets" 
    ON public.ticket_messages FOR INSERT 
    WITH CHECK (
        auth.uid() = sender_id AND (
            EXISTS (SELECT 1 FROM support_tickets WHERE id = ticket_id AND user_id = auth.uid()) OR 
            EXISTS (SELECT 1 FROM users_profile WHERE id = auth.uid() AND system_role = 'superadmin')
        )
    );

-- 5. 更新快取
NOTIFY pgrst, 'reload schema';
