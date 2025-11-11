import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  throw new Error(
    `Missing Supabase environment variables: ${missingVars.join(', ')}\n\n` +
    `Please create a .env.local file in the NovaOCC directory with:\n` +
    `NEXT_PUBLIC_SUPABASE_URL=your_project_url\n` +
    `NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key\n\n` +
    `Get these values from: Supabase Dashboard → Settings → API`
  );
}

// Validate URL format
if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  // Check if it looks like a JWT token (starts with eyJ)
  const looksLikeJWT = supabaseUrl.startsWith('eyJ');
  const errorMessage = looksLikeJWT
    ? `❌ ERROR: Your environment variables are SWAPPED!\n\n` +
      `The NEXT_PUBLIC_SUPABASE_URL contains a JWT token (your anon key) instead of a URL.\n\n` +
      `🔧 FIX: In your .env.local file, swap the values:\n` +
      `   - NEXT_PUBLIC_SUPABASE_URL should be: https://xxxxx.supabase.co\n` +
      `   - NEXT_PUBLIC_SUPABASE_ANON_KEY should be: ${supabaseUrl.substring(0, 50)}...\n\n` +
      `Get the correct values from: Supabase Dashboard → Settings → API\n` +
      `   - Project URL → goes to NEXT_PUBLIC_SUPABASE_URL\n` +
      `   - anon public key → goes to NEXT_PUBLIC_SUPABASE_ANON_KEY`
    : `Invalid Supabase URL format. Expected HTTP or HTTPS URL.\n\n` +
      `Current value: ${supabaseUrl.substring(0, 50)}...\n\n` +
      `Please check your NEXT_PUBLIC_SUPABASE_URL in .env.local.\n` +
      `It should start with https:// and look like: https://xxxxx.supabase.co`;
  
  throw new Error(errorMessage);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test DB connection helper
export async function testDBConnection() {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Database connection error:', error);
      return { success: false, error };
    }
    
    console.log('Database connection successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Database connection failed:', error);
    return { success: false, error };
  }
}

