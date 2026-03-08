import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  const body = await readRawBody(event)
  const sig = getHeader(event, 'stripe-signature')

  let stripeEvent: Stripe.Event

  try {
    stripeEvent = stripe.webhooks.constructEvent(body!, sig!, webhookSecret!)
  } catch (e: any) {
    throw createError({ statusCode: 400, message: `Webhook error: ${e.message}` })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object as Stripe.CheckoutSession
    const userId = session.metadata?.userId
    const customerId = session.customer as string
    const subscriptionId = session.subscription as string

    if (userId && subscriptionId) {
      // price IDからプランを判定
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const priceId = subscription.items.data[0]?.price.id
      const plan = priceId === process.env.STARTER_PRICE_ID ? 'starter' : 'pro'

      await supabase.from('profiles').update({
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        plan
      }).eq('id', userId)
    }
  }

  if (stripeEvent.type === 'customer.subscription.deleted') {
    const subscription = stripeEvent.data.object as Stripe.Subscription
    const customerId = subscription.customer as string

    await supabase.from('profiles')
      .update({ plan: 'free', stripe_subscription_id: null })
      .eq('stripe_customer_id', customerId)
  }

  return { received: true }
})
