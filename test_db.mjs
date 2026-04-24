
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Manually load .env.local
const envPath = join(__dirname, '.env.local');
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

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase URL or Anon Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('--- Supabase DB Diagnostic Tool ---');
  console.log(`URL: ${supabaseUrl}`);
  
  console.log('\n1. Testing "projects" table...');
  try {
    const { data, error, count } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Error querying "projects" table:', JSON.stringify(error, null, 2));
      if (error.code === 'PGRST116') {
        console.log('👉 Diagnosis: Table "projects" might not exist.');
      } else if (error.code === '42P01') {
        console.log('👉 Diagnosis: Relation "projects" does not exist.');
      }
    } else {
      console.log('✅ "projects" table is accessible.');
      console.log(`Count: ${count}`);
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }

  console.log('\n2. Testing "clients" table...');
  try {
    const { data, error, count } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Error querying "clients" table:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ "clients" table is accessible.');
      console.log(`Count: ${count}`);
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }

  console.log('\n3. Testing "users_profile" table...');
  try {
    const { data, error, count } = await supabase
      .from('users_profile')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Error querying "users_profile" table:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ "users_profile" table is accessible.');
      console.log(`Count: ${count}`);
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }

  console.log('\n4. Testing "users" (Auth) connection...');
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('❌ Auth error:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ Auth service is reachable.');
    }
  } catch (err) {
    console.error('❌ Unexpected Auth error:', err.message);
  }

  console.log('\n4. Testing non-existent table "non_existent"...');
  try {
    const { error } = await supabase.from('non_existent').select('*', { count: 'exact', head: true });
    console.log('Error for non-existent table:', JSON.stringify(error, null, 2));
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }

  console.log('\n----------------------------------');
}

testConnection();
