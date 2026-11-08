-- Crear tabla de usuarios (extiende la tabla auth.users de Supabase)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de canchas
CREATE TABLE IF NOT EXISTS canchas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  localidad TEXT NOT NULL,
  descripcion TEXT,
  direccion TEXT NOT NULL,
  latitude FLOAT,
  longitude FLOAT,
  telefono TEXT,
  capacidad INTEGER DEFAULT 14,
  precio_por_hora DECIMAL(10, 2) NOT NULL,
  amenidades TEXT[], -- Array JSON: ["vestuarios", "estacionamiento", "bar"]
  fotos TEXT[], -- Array de URLs de imágenes
  disponible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de horarios disponibles
CREATE TABLE IF NOT EXISTS horarios_disponibles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cancha_id UUID NOT NULL REFERENCES canchas(id) ON DELETE CASCADE,
  dia_semana TEXT NOT NULL, -- 'lunes', 'martes', etc.
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  disponible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de reservas
CREATE TABLE IF NOT EXISTS reservas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cancha_id UUID NOT NULL REFERENCES canchas(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES users(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  nombre_contacto TEXT NOT NULL,
  email_contacto TEXT NOT NULL,
  telefono_contacto TEXT NOT NULL,
  precio_total DECIMAL(10, 2) NOT NULL,
  estado TEXT DEFAULT 'pendiente', -- 'pendiente', 'confirmada', 'cancelada'
  stripe_payment_id TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para optimizar búsquedas
CREATE INDEX idx_canchas_localidad ON canchas(localidad);
CREATE INDEX idx_reservas_usuario ON reservas(usuario_id);
CREATE INDEX idx_reservas_cancha ON reservas(cancha_id);
CREATE INDEX idx_reservas_fecha ON reservas(fecha);
CREATE INDEX idx_horarios_cancha ON horarios_disponibles(cancha_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE canchas ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios_disponibles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;

-- Política RLS para users: cada usuario solo ve su propio perfil
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Política RLS para canchas: todos pueden ver canchas disponibles
CREATE POLICY "Anyone can view available canchas" ON canchas
  FOR SELECT USING (disponible = true);

-- Política RLS para horarios: todos pueden ver
CREATE POLICY "Anyone can view available schedules" ON horarios_disponibles
  FOR SELECT USING (true);

-- Política RLS para reservas: usuarios ven solo sus reservas
CREATE POLICY "Users can view their own reservations" ON reservas
  FOR SELECT USING (auth.uid() = usuario_id OR usuario_id IS NULL);

CREATE POLICY "Users can insert their own reservations" ON reservas
  FOR INSERT WITH CHECK (true); -- Sin restricción al crear para reservas sin usuario autenticado

CREATE POLICY "Users can update their own reservations" ON reservas
  FOR UPDATE USING (auth.uid() = usuario_id OR usuario_id IS NULL);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers para updated_at
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER canchas_updated_at BEFORE UPDATE ON canchas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER reservas_updated_at BEFORE UPDATE ON reservas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
