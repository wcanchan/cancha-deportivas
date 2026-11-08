import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
})

export async function POST(request: NextRequest) {
  try {
    const { email, nombre } = await request.json()

    if (!email || !nombre) {
      return NextResponse.json(
        { error: 'Email y nombre son requeridos' },
        { status: 400 }
      )
    }

    // Buscar cliente existente
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    })

    let customerId: string

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id
    } else {
      // Crear nuevo cliente
      const customer = await stripe.customers.create({
        email,
        name: nombre,
      })
      customerId = customer.id
    }

    return NextResponse.json({ customerId }, { status: 200 })
  } catch (error) {
    console.error('Error en create-customer:', error)
    return NextResponse.json(
      { error: 'Error al crear cliente' },
      { status: 500 }
    )
  }
}
