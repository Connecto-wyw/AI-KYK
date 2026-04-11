import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(request: Request) {
  try {
    const { sessionId, orderId } = await request.json()

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    const service = createServiceClient()

    const { data: order } = await service
      .from('orders')
      .select('id, team_id, user_id, status')
      .eq('id', orderId)
      .single()

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // 중복 처리 방지
    if (order.status === 'paid') {
      return NextResponse.json({ success: true, teamId: order.team_id })
    }

    const amountCents = session.amount_total || 0

    await service.from('payments').insert({
      order_id: orderId,
      gateway: 'stripe',
      gateway_payment_id: session.payment_intent as string,
      gateway_order_id: sessionId,
      amount: amountCents,
      currency: 'USD',
      status: 'paid',
      raw_response: session as unknown as Record<string, unknown>,
      confirmed_at: new Date().toISOString(),
    })

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

    return NextResponse.json({ success: true, teamId: order.team_id })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
