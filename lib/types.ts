export interface Cancha {
  id: string
  name: string
  localidad: string
  descripcion?: string
  direccion: string
  latitude?: number
  longitude?: number
  telefono?: string
  capacidad: number
  precio_por_hora: number
  amenidades?: string[]
  fotos?: string[]
  disponible: boolean
  created_at: string
  updated_at: string
}

export interface HorarioDisponible {
  id: string
  cancha_id: string
  dia_semana: string
  hora_inicio: string
  hora_fin: string
  disponible: boolean
}

export interface Reserva {
  id: string
  cancha_id: string
  usuario_id?: string
  fecha: string
  hora_inicio: string
  hora_fin: string
  nombre_contacto: string
  email_contacto: string
  telefono_contacto: string
  precio_total: number
  estado: 'pendiente' | 'confirmada' | 'cancelada'
  stripe_payment_id?: string
  stripe_customer_id?: string
  created_at: string
  updated_at: string
}

export interface Usuario {
  id: string
  email: string
  full_name?: string
  phone?: string
  created_at: string
  updated_at: string
}
