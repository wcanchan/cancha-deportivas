import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function middleware(request: NextRequest) {
  // Rutas que requieren autenticación
  const protectedRoutes = ['/admin', '/reservas']
  
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Obtener token de la cookie de sesión
    const token = request.cookies.get('sb-access-token')?.value
    
    // Si no hay token, redirigir a inicio
    if (!token) {
      return NextResponse.redirect(new URL('/?auth=required', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/reservas/:path*'],
}
