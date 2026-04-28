
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { join } from 'path';

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

async function findUser() {
    console.log('Searching for ivan@ycideas.com...');
    const { data, error } = await supabase
        .from('users_profile')
        .select('id, email, tier')
        .eq('email', 'ivan@ycideas.com')
        .single();
    
    if (error) {
        console.error('Error finding user:', error.message);
        // Try selecting all
        const { data: all, error: err2 } = await supabase.from('users_profile').select('id, email');
        if (all) {
            console.log('Available users:', all);
        } else {
             console.error('Error selecting all:', err2?.message);
        }
    } else {
        console.log('Found user:', data);
    }
}

findUser();
