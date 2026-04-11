import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(request: Request) {
  try {
    const { paymentKey, orderId, amount } = await request.json()

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 토스페이먼츠 결제 승인 API 호출
    const secretKey = process.env.TOSS_SECRET_KEY!
    const encoded = Buffer.from(`${secretKey}:`).toString('base64')

    const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encoded}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    })

    const tossData = await tossRes.json()

    if (!tossRes.ok) {
      console.error('Toss confirm error:', tossData)
      return NextResponse.json({ error: tossData.message || 'Payment confirmation failed' }, { status: 400 })
    }

    const service = createServiceClient()

    // orders 테이블의 orderId(UUID)로 조회
    const { data: order, error: orderError } = await service
      .from('orders')
      .select('id, team_id, user_id')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // payments 기록
    await service.from('payments').insert({
      order_id: orderId,
      gateway: 'toss',
      gateway_payment_id: paymentKey,
      gateway_order_id: orderId,
      amount,
      currency: 'KRW',
      status: 'paid',
      raw_response: tossData,
      confirmed_at: new Date().toISOString(),
    })

    // order 상태 업데이트
    await service.from('orders').update({ status: 'paid' }).eq('id', orderId)

    // 팀원 추가 + 팀 카운트 증가
    if (order.team_id) {
      await service.from('team_members').upsert({
        team_id: order.team_id,
        user_id: order.user_id,
        role: 'member',
      }, { onConflict: 'team_id,user_id' })

      const { data: team } = await service
        .from('teams')
        .select('current_count, target_count, captain_id')
        .eq('id', order.team_id)
        .single()

      if (team) {
        const newCount = (team.current_count || 0) + 1
        const isCaptain = team.captain_id === order.user_id

        if (!isCaptain) {
          // 팀장은 팀 생성 시 이미 captain으로 추가됨
          await service.from('team_members').upsert({
            team_id: order.team_id,
            user_id: order.user_id,
            role: 'member',
          }, { onConflict: 'team_id,user_id' })
        }

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
