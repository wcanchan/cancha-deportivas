import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createSupabaseClient(supabaseUrl, supabaseKey)

/**
 * Devuelve el cliente Supabase compartido (singleton).
 * Se exporta como función para que los componentes puedan llamarlo
 * sin crear una conexión nueva en cada render.
 */
export function createClient() {
  return supabase
}
