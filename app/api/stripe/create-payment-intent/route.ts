import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
})

export async function POST(request: NextRequest) {
  try {
    const { amount, customerId } = await request.json()

    if (!amount || !customerId) {
      return NextResponse.json(
        { error: 'Monto y customerId son requeridos' },
        { status: 400 }
      )
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Cantidad en centavos
      currency: 'clp', // Cambiar según tu país
      customer: customerId,
      payment_method_types: ['card'],
    })

    return NextResponse.json(
      { clientSecret: paymentIntent.client_secret },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en create-payment-intent:', error)
    return NextResponse.json(
      { error: 'Error al crear intención de pago' },
      { status: 500 }
    )
  }
}
