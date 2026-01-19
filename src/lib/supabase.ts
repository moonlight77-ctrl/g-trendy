import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Mettez "export const" au lieu de juste "const" ou "export default"
export const supabase = createClient(supabaseUrl, supabaseKey);