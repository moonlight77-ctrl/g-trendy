import { createClient } from '@supabase/supabase-js'

// Récupération des variables avec valeurs par défaut
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Création du client Supabase
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
)

// Export par défaut aussi (au cas où)
export default supabase