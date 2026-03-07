import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { priceId, userId, email } = body

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?success=1`,
    cancel_url: `${process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?canceled=1`,
    metadata: { userId }
  })

  return { url: session.url }
})
