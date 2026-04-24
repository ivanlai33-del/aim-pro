import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://znmaewkznmwsqjnndqrw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpubWFld2t6bm13c3Fqbm5kcXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMDk4NjQsImV4cCI6MjA4Njg4NTg2NH0.54PEYPiToZGuA3gVsnMtxVA1JFkjEaQXJfyIFv9J4Ec';
const supabase = createClient(supabaseUrl, supabaseKey);

const MOCK_USER_ID = '8d0b9a20-13cb-4f7c-9bc3-79656157b0e0';

async function injectData() {
    console.log('Injecting mock data...');

    // 1. Inject Revenue
    const { error: revError } = await supabase.from('platform_revenue').insert([
        { user_id: MOCK_USER_ID, amount: 2980, plan_type: 'professional', currency: 'TWD', status: 'completed', description: '月費訂閱' },
        { user_id: MOCK_USER_ID, amount: 15000, plan_type: 'enterprise', currency: 'TWD', status: 'pending', description: '專案定製方案 (待開發票)', needs_invoice: true, invoice_info: { title: '科技股份有限公司', taxId: '12345678' } }
    ]);
    if (revError) console.error('Rev Error:', revError);

    // 2. Inject Events
    const { error: eventError } = await supabase.from('user_events').insert([
        { user_id: MOCK_USER_ID, event_type: 'GENERATE_REPORT', metadata: { project_name: 'AI 商務中心', duration: 12.5 } },
        { user_id: MOCK_USER_ID, event_type: 'UPGRADE_CLICK', metadata: { source: 'dashboard_banner' } },
        { user_id: MOCK_USER_ID, event_type: 'AI_CHAT', metadata: { tokens: 450, query: '幫我優化報價單' } }
    ]);
    if (eventError) console.error('Event Error:', eventError);

    console.log('Mock data injected successfully!');
}

injectData();
