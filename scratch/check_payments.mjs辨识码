
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envPath = '.env.local';
const envConfig = fs.readFileSync(envPath, 'utf8')
  .split('\n')
  .filter(line => line.trim() && !line.startsWith('#'))
  .reduce((acc, line) => {
    const [key, ...value] = line.split('=');
    acc[key.trim()] = value.join('=').trim();
    return acc;
  }, {});

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function findInPayments() {
    console.log('Searching in payments table...');
    const { data, error } = await supabase
        .from('payments')
        .select('user_id, status')
        .limit(10);
    
    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Payments:', data);
    }
}

findInPayments();
