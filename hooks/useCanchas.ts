import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { Cancha } from '@/lib/types'

const supabase = createClient()

async function fetchCanchas(localidad?: string): Promise<Cancha[]> {
  let query = supabase
    .from('canchas')
    .select('*')
    .eq('disponible', true)

  if (localidad) {
    query = query.ilike('localidad', `%${localidad}%`)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export function useCanchas(localidad?: string) {
  const { data, error, isLoading } = useSWR(
    ['canchas', localidad],
    () => fetchCanchas(localidad),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  return {
    canchas: data || [],
    isLoading,
    error,
  }
}
