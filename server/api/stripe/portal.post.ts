import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userId } = body

  if (!userId) {
    throw createError({ statusCode: 401, message: '認証が必要です' })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single()

  if (!profile?.stripe_customer_id) {
    throw createError({ statusCode: 400, message: 'Stripeの顧客情報が見つかりません' })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const returnUrl = `${process.env.NUXT_PUBLIC_APP_URL || 'https://autosns-umber.vercel.app'}/pricing`

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: returnUrl
  })

  return { url: session.url }
})
