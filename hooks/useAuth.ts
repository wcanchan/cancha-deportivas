import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Usuario } from '@/lib/types'

export function useAuth() {
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Verificar sesión actual
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) throw error
        
        if (session?.user) {
          // Obtener datos adicionales del usuario
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          if (userError && userError.code !== 'PGRST116') throw userError
          
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: userData?.full_name,
            phone: userData?.phone,
            created_at: userData?.created_at || new Date().toISOString(),
            updated_at: userData?.updated_at || new Date().toISOString(),
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error checking session')
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: userData?.full_name,
            phone: userData?.phone,
            created_at: userData?.created_at || new Date().toISOString(),
            updated_at: userData?.updated_at || new Date().toISOString(),
          })
        } else {
          setUser(null)
        }
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      setUser(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error signing out')
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signOut,
  }
}
