-- 0. 建立 Users Profile (存放訂閱方案與額度)
CREATE TABLE IF NOT EXISTS users_profile (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    tier TEXT DEFAULT 'free',
    ai_quota INTEGER DEFAULT 10,
    subscription_end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1. 建立 Teams 資料表 (公司/團隊)
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 建立 Team Members 資料表 (權限關聯)
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member', -- 'owner', 'admin', 'sales', 'accountant', 'member'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- 2.1 建立 Team Invitations 資料表 (待處理邀請)
CREATE TABLE IF NOT EXISTS team_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'member',
    inviter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'expired'
    token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- 3. 建立 Clients 資料表 (改綁定 team_id)
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- 紀錄誰建立的
    company_name TEXT,
    tax_id TEXT,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    tags TEXT[],
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 遷移邏輯：如果 clients 已存在但沒 team_id，手動補上
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='team_id') THEN
        ALTER TABLE clients ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 4. 建立 Projects 資料表 (改綁定 team_id)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- 紀錄誰建立的
    name TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    data JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 遷移邏輯：如果 projects 已存在但沒 team_id，手動補上
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='team_id') THEN
        ALTER TABLE projects ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 5. 啟用 RLS
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;

-- 6. 設置 RLS 政策 (Policies) - 先刪除舊的防止報錯
DROP POLICY IF EXISTS "Users can view their own profile" ON users_profile;
DROP POLICY IF EXISTS "Users can view their teams" ON teams;
DROP POLICY IF EXISTS "Users can view team members" ON team_members;
DROP POLICY IF EXISTS "Team members can manage clients" ON clients;
DROP POLICY IF EXISTS "Team members can manage projects" ON projects;
DROP POLICY IF EXISTS "Owners and Admins can manage invitations" ON team_invitations;
DROP POLICY IF EXISTS "Public can view invitation by token" ON team_invitations;

-- Users Profile: 僅限讀取自己
CREATE POLICY "Users can view their own profile" ON users_profile
    FOR SELECT TO authenticated USING (auth.uid() = id);

-- Teams: 團隊成員可以看見自己所屬的團隊
CREATE POLICY "Users can view their teams" ON teams
    FOR SELECT TO authenticated 
    USING (EXISTS (SELECT 1 FROM team_members WHERE team_members.team_id = teams.id AND team_members.user_id = auth.uid()));

-- Team Members: 可以看見同團隊的成員名單
CREATE POLICY "Users can view team members" ON team_members
    FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM team_members tm WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid()));

-- Clients: 團隊成員可以管理團隊的客戶
CREATE POLICY "Team members can manage clients" ON clients
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM team_members WHERE team_members.team_id = clients.team_id AND team_members.user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM team_members WHERE team_members.team_id = clients.team_id AND team_members.user_id = auth.uid()));

-- Projects: 團隊成員可以管理團隊的專案
CREATE POLICY "Team members can manage projects" ON projects
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM team_members WHERE team_members.team_id = projects.team_id AND team_members.user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM team_members WHERE team_members.team_id = projects.team_id AND team_members.user_id = auth.uid()));

-- Team Invitations: 僅限 Owner 與 Admin 管理
CREATE POLICY "Owners and Admins can manage invitations" ON team_invitations
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM team_members 
        WHERE team_members.team_id = team_invitations.team_id 
        AND team_members.user_id = auth.uid() 
        AND team_members.role IN ('owner', 'admin')
    ));

CREATE POLICY "Public can view invitation by token" ON team_invitations
    FOR SELECT TO anon, authenticated
    USING (status = 'pending' AND expires_at > NOW());

-- 7. 安全防護：AI 點數扣除函數 (Atomic Decrement)
CREATE OR REPLACE FUNCTION decrement_ai_quota(user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE users_profile
    SET ai_quota = GREATEST(0, ai_quota - 1),
        updated_at = NOW()
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. 安全防護：設備指紋紀錄 (防止白嫖多開帳號)
CREATE TABLE IF NOT EXISTS device_fingerprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    fingerprint TEXT NOT NULL,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, fingerprint)
);

ALTER TABLE device_fingerprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own device fingerprints" ON device_fingerprints
    FOR ALL TO authenticated USING (auth.uid() = user_id);

-- 9. 建立 Payments 資料表 (追蹤金流)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tier TEXT NOT NULL,
    amount INTEGER NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'success', 'failed'
    order_no TEXT UNIQUE NOT NULL,
    newebpay_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT TO authenticated USING (auth.uid() = user_id);
