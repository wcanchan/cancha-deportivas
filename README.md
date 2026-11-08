# CanchApp - Plataforma de Reserva de Canchas de Fútbol 7

Una plataforma moderna para buscar y reservar canchas de fútbol 7 con búsqueda rápida por localidad, integración de pagos con Stripe y registro al momento de la reserva.

## Características

- **Búsqueda Rápida**: Busca canchas por localidad con sugerencias autocompletas
- **Detalle Completo**: Información detallada de cada cancha (fotos, amenidades, ubicación GPS, teléfono)
- **Disponibilidad en Tiempo Real**: Ve los horarios disponibles de cada cancha
- **Reserva sin Fricciones**: Registro y pago integrados en un solo flujo
- **Pagos Seguros**: Integración con Stripe para procesar pagos
- **Panel Admin**: Gestiona canchas, horarios y reservas
- **Historial de Reservas**: Los usuarios pueden ver su historial de reservas

## Instalación y Configuración

### Requisitos Previos

- Node.js 18+ y pnpm
- Cuenta de Supabase
- Cuenta de Stripe

### Paso 1: Clonar e Instalar

```bash
git clone <repository-url>
cd cancha-app
pnpm install
```

### Paso 2: Configurar Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto
2. Copia tu `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` de los settings del proyecto
3. Las tablas ya están creadas en la migración

### Paso 3: Configurar Stripe

1. Ve a [stripe.com](https://stripe.com) y crea una cuenta
2. En el dashboard, obtén tu `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` y `STRIPE_SECRET_KEY`
3. Asegúrate de que Stripe esté configurado en modo test

### Paso 4: Configurar Variables de Ambiente

Copia el archivo `.env.example` a `.env.local` y completa los valores:

```bash
cp .env.example .env.local
```

Luego actualiza `.env.local` con tus claves:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Paso 5: Ejecutar la Aplicación

```bash
pnpm dev
```

Accede a [http://localhost:3000](http://localhost:3000)

## Estructura del Proyecto

```
├── app/
│   ├── page.tsx                 # Página de búsqueda principal
│   ├── cancha/[id]/page.tsx     # Detalle de cancha
│   ├── admin/page.tsx           # Panel de administración
│   └── api/
│       ├── stripe/              # Endpoints para Stripe
│       └── reservas/            # Endpoints para reservas
├── components/
│   ├── Header.tsx               # Encabezado principal
│   ├── SearchBar.tsx            # Barra de búsqueda
│   ├── CanchaCard.tsx           # Tarjeta de cancha
│   └── ReservaModal.tsx         # Modal de reserva
├── hooks/
│   └── useCanchas.ts            # Hook para obtener canchas
├── lib/
│   ├── supabase/
│   │   └── client.ts            # Cliente Supabase
│   └── types.ts                 # Tipos TypeScript
└── scripts/
    ├── setup-database.sql       # Script para crear schema
    └── seed-demo-data.sql       # Datos de ejemplo
```

## Flujo de Reserva

1. **Búsqueda**: Usuario busca canchas por localidad
2. **Selección**: Selecciona una cancha para ver detalles
3. **Disponibilidad**: Selecciona fecha y horario disponible
4. **Reserva**: Abre modal con:
   - Datos de contacto (email, nombre, teléfono)
   - Información de tarjeta de crédito
   - Resumen de la reserva
5. **Pago**: Paga mediante Stripe (sin guardar tarjeta)
6. **Confirmación**: Se registra el usuario y se guarda la reserva
7. **Email**: Se envía confirmación al email del usuario

## Base de Datos

### Tablas Principales

- **canchas**: Información de las canchas (nombre, localidad, amenidades, precio, etc.)
- **horarios_disponibles**: Horarios abiertos para cada cancha (día, hora inicio, hora fin)
- **reservas**: Registro de todas las reservas con estado de pago
- **users**: Perfiles de usuarios (extendido de auth.users)

### Row Level Security (RLS)

- Usuarios pueden ver su propia información
- Cualquiera puede ver canchas disponibles
- Usuarios pueden crear y ver sus propias reservas
- Admins pueden gestionar todo (futura implementación)

## API Endpoints

### Stripe

- `POST /api/stripe/create-customer` - Crear cliente en Stripe
- `POST /api/stripe/create-payment-intent` - Crear intento de pago

### Reservas

- `GET /api/reservas` - Obtener reservas del usuario actual
- `POST /api/reservas` - Crear nueva reserva (usado por modal)

## Seguridad

- Contraseñas hasheadas con bcrypt
- Sessions con HTTP-only cookies
- RLS habilitado en todas las tablas
- Datos de tarjeta procesados por Stripe (nunca se almacenan localmente)
- Validación de entrada en servidor
- CSRF protection

## Deployment

### Desplegar en Vercel

1. Conecta tu repositorio GitHub a Vercel
2. En Settings → Environment Variables, añade todas tus claves
3. Vercel automáticamente detectará Next.js y compilará

```bash
git push origin main
```

### Desplegar en otro servidor

```bash
pnpm build
pnpm start
```

## Troubleshooting

### Error de Supabase

- Verifica que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` sean correctos
- Asegúrate de que las tablas existan en Supabase
- Revisa los logs en Supabase Dashboard

### Error de Stripe

- Verifica estar en modo Test
- Usa números de tarjeta de prueba: `4242 4242 4242 4242`
- Fecha futura: `12/25`
- CVC cualquier 3 números

### Modal no abre

- Asegúrate que `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` sea válido
- Revisa la consola del navegador para errores

## Próximas Características

- [ ] Autenticación con Google/GitHub
- [ ] Notificaciones por WhatsApp
- [ ] Sistema de reseñas y ratings
- [ ] Cancelación de reservas con reembolso
- [ ] Historial detallado de transacciones
- [ ] Dashboard del propietario de cancha
- [ ] Estadísticas de ocupación

## Licencia

MIT
