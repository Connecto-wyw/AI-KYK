import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook error'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.orderId

    if (!orderId) return NextResponse.json({ received: true })

    const service = createServiceClient()

    const { data: order } = await service
      .from('orders')
      .select('id, team_id, user_id, status')
      .eq('id', orderId)
      .single()

    if (!order || order.status === 'paid') {
      return NextResponse.json({ received: true })
    }

    await service.from('payments').upsert({
      order_id: orderId,
      gateway: 'stripe',
      gateway_payment_id: session.payment_intent as string,
      gateway_order_id: session.id,
      amount: session.amount_total || 0,
      currency: 'USD',
      status: 'paid',
      raw_response: session as unknown as Record<string, unknown>,
      confirmed_at: new Date().toISOString(),
    }, { onConflict: 'gateway_order_id' })

    await service.from('orders').update({ status: 'paid' }).eq('id', orderId)

    if (order.team_id) {
      await service.from('team_members').upsert({
        team_id: order.team_id,
        user_id: order.user_id,
        role: 'member',
      }, { onConflict: 'team_id,user_id' })

      const { data: team } = await service
        .from('teams')
        .select('current_count, target_count')
        .eq('id', order.team_id)
        .single()

      if (team) {
        const newCount = (team.current_count || 0) + 1
        await service.from('teams').update({
          current_count: newCount,
          status: newCount >= team.target_count ? 'full' : 'open',
        }).eq('id', order.team_id)
      }
    }
  }

  return NextResponse.json({ received: true })
}
