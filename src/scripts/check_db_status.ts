import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://znmaewkznmwsqjnndqrw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpubWFld2t6bm13c3Fqbm5kcXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMDk4NjQsImV4cCI6MjA4Njg4NTg2NH0.54PEYPiToZGuA3gVsnMtxVA1JFkjEaQXJfyIFv9J4Ec';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
    console.log('Checking tables and duplicates...');
    
    // Test specific failing query
    const targetUserId = '8d0b9a20-13cb-4f7c-9bc3-79656157b0e0';
    console.log(`Testing maybeSingle for user: ${targetUserId}`);
    const { data: testData, error: testError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', targetUserId)
        .maybeSingle();
    
    if (testError) {
        console.error('maybeSingle TEST ERROR:', testError.code, testError.message, testError);
    } else {
        console.log('maybeSingle TEST SUCCESS:', testData);
    }

    const tables = ['user_events', 'subscriptions', 'platform_revenue', 'users_profile'];
    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.error(`Table ${table} error:`, error.code, error.message);
        } else {
            console.log(`Table ${table} is accessible.`);
        }
    }
}

checkTables();
