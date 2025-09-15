import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'

const { supabaseUrl, supabaseKey } = Constants.expoConfig.extra

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Variáveis do Supabase não carregadas", supabaseUrl, supabaseKey)
}

export const supabase = createClient(supabaseUrl, supabaseKey)
