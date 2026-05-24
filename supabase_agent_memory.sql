-- ==========================================
-- AgentMemory Schema Setup
-- Creates tables for Cross-Project and Per-Project AI memory
-- ==========================================

-- 1. Create professional_memory (Cross-Project Memory)
CREATE TABLE IF NOT EXISTS public.professional_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- e.g., 'pricing', 'style_preference', 'avoid_client_type', 'payment_terms'
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and setup policy for professional_memory
ALTER TABLE public.professional_memory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own professional memory" ON public.professional_memory;
CREATE POLICY "Users can view their own professional memory" ON public.professional_memory 
    FOR SELECT TO authenticated USING (
        auth.uid() = user_id OR 
        team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can insert their own professional memory" ON public.professional_memory;
CREATE POLICY "Users can insert their own professional memory" ON public.professional_memory 
    FOR INSERT TO authenticated WITH CHECK (
        auth.uid() = user_id OR 
        team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can update their own professional memory" ON public.professional_memory;
CREATE POLICY "Users can update their own professional memory" ON public.professional_memory 
    FOR UPDATE TO authenticated USING (
        auth.uid() = user_id OR 
        team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
    );


-- 2. Create project_memory (Per-Project Short-term Memory)
-- Assuming 'projects' table exists and has 'id' as UUID
CREATE TABLE IF NOT EXISTS public.project_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and setup policy for project_memory
ALTER TABLE public.project_memory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own project memory" ON public.project_memory;
CREATE POLICY "Users can view their own project memory" ON public.project_memory 
    FOR SELECT TO authenticated USING (
        auth.uid() = user_id OR 
        team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can insert their own project memory" ON public.project_memory;
CREATE POLICY "Users can insert their own project memory" ON public.project_memory 
    FOR INSERT TO authenticated WITH CHECK (
        auth.uid() = user_id OR 
        team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
    );

-- 3. Reload Schema Cache
NOTIFY pgrst, 'reload schema';
