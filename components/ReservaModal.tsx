'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Cancha } from '@/lib/types'
import { supabase } from '@/lib/supabase/client'
import { loadStripe } from '@stripe/stripe-js'
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

interface ReservaModalProps {
  isOpen: boolean
  onClose: () => void
  cancha: Cancha
  selectedDate: string
  selectedTime: string
}

export default function ReservaModal({
  isOpen,
  onClose,
  cancha,
  selectedDate,
  selectedTime,
}: ReservaModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reservar Cancha</DialogTitle>
        </DialogHeader>
        <Elements stripe={stripePromise}>
          <ReservaForm
            cancha={cancha}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onClose={onClose}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  )
}

interface ReservaFormProps {
  cancha: Cancha
  selectedDate: string
  selectedTime: string
  onClose: () => void
}

function ReservaForm({
  cancha,
  selectedDate,
  selectedTime,
  onClose,
}: ReservaFormProps) {
  const stripe = useStripe()
  const elements = useElements()

  const [email, setEmail] = useState('')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [horarioInicio, horarioFin] = selectedTime.split('-')
  const precioTotal = cancha.precio_por_hora

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setError('Stripe no está cargado')
      return
    }

    if (!email || !nombre || !telefono) {
      setError('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    setError('')

    try {
      // 1. Crear cliente Stripe si no existe
      const customerResponse = await fetch('/api/stripe/create-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nombre }),
      })

      if (!customerResponse.ok) {
        throw new Error('Error creando cliente')
      }

      const { customerId } = await customerResponse.json()

      // 2. Crear Payment Intent
      const paymentResponse = await fetch(
        '/api/stripe/create-payment-intent',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Math.round(precioTotal * 100),
            customerId,
          }),
        }
      )

      if (!paymentResponse.ok) {
        throw new Error('Error creando pago')
      }

      const { clientSecret } = await paymentResponse.json()

      // 3. Confirmar pago con tarjeta
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error('Card element no disponible')
      }

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: nombre,
              email: email,
              phone: telefono,
            },
          },
        })

      if (stripeError) {
        throw new Error(stripeError.message)
      }

      if (paymentIntent?.status !== 'succeeded') {
        throw new Error('El pago no fue completado')
      }

      // 4. Crear usuario en Supabase (si no existe)
      const { data: userData } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).slice(-12), // Contraseña temporal
      })

      // 5. Crear registro de usuario en tabla users
      if (userData.user) {
        await supabase.from('users').insert({
          id: userData.user.id,
          email,
          full_name: nombre,
          phone: telefono,
        })
      }

      // 6. Crear reserva en base de datos
      const { error: reservaError } = await supabase
        .from('reservas')
        .insert({
          cancha_id: cancha.id,
          usuario_id: userData.user?.id,
          fecha: selectedDate,
          hora_inicio: horarioInicio,
          hora_fin: horarioFin,
          nombre_contacto: nombre,
          email_contacto: email,
          telefono_contacto: telefono,
          precio_total: precioTotal,
          estado: 'confirmada',
          stripe_payment_id: paymentIntent.id,
          stripe_customer_id: customerId,
        })

      if (reservaError) {
        throw new Error('Error guardando reserva')
      }

      setSuccess(true)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error en la reserva'
      )
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AlertDialog open={success}>
        <AlertDialogContent>
          <AlertDialogTitle>¡Reserva Confirmada!</AlertDialogTitle>
          <AlertDialogDescription>
            Tu reserva ha sido confirmada exitosamente.
            <br />
            <br />
            <strong>Detalles:</strong>
            <br />
            Cancha: {cancha.name}
            <br />
            Día: {selectedDate}
            <br />
            Hora: {selectedTime}
            <br />
            Total: ${precioTotal}
            <br />
            <br />
            Se ha enviado una confirmación a tu email.
          </AlertDialogDescription>
          <AlertDialogAction
            onClick={() => {
              onClose()
              window.location.reload()
            }}
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Resumen */}
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-gray-600">Cancha</p>
        <p className="font-bold text-gray-900">{cancha.name}</p>
        <p className="text-sm text-gray-600 mt-2">{selectedDate} - {selectedTime}</p>
        <p className="text-2xl font-bold text-blue-600 mt-2">${precioTotal}</p>
      </div>

      {/* Formulario de registro */}
      <FieldGroup>
        <FieldLabel>Nombre Completo</FieldLabel>
        <Input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </FieldGroup>

      <FieldGroup>
        <FieldLabel>Email</FieldLabel>
        <Input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </FieldGroup>

      <FieldGroup>
        <FieldLabel>Teléfono</FieldLabel>
        <Input
          type="tel"
          placeholder="+56 9 XXXX XXXX"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />
      </FieldGroup>

      {/* Tarjeta de crédito */}
      <FieldGroup>
        <FieldLabel>Tarjeta de Crédito</FieldLabel>
        <div className="border rounded-lg p-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </FieldGroup>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading || !stripe}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Spinner className="h-4 w-4" />
              Confirmando...
            </div>
          ) : (
            `Pagar $${precioTotal}`
          )}
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Al reservar aceptas los términos y condiciones
      </p>
    </form>
  )
}
