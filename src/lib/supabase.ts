import { createClient } from '@supabase/supabase-js';

// On récupère les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// On exporte directement la variable "supabase" que vos pages attendent
export const supabase = createClient(supabaseUrl, supabaseKey);