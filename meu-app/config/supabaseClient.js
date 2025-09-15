import { createClient } from '@supabase/supabase-js'

const SUP_URL = process.env.EXPO_PUBLIC_SUPABASE_URL
const SUP_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY

if (!SUP_URL || !SUP_KEY) {
  console.error("❌ Variáveis não carregadas", SUP_URL, SUP_KEY)
}

export const supabase = createClient(SUP_URL, SUP_KEY)
