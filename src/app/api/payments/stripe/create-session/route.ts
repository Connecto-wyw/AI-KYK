import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, amount, productName, teamId } = await request.json()

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: productName },
            unit_amount: amount, // cents (e.g., 2900 = $29.00)
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/kyk/shop/payment/success?gateway=stripe&orderId=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/kyk/shop/payment/fail?gateway=stripe&orderId=${orderId}`,
      metadata: { orderId, teamId: teamId || '', userId: user.id },
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
