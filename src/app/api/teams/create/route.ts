import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

const PRODUCTS: Record<number, { krw: number; usd: number; name: string; targetCount: number }> = {
  1: { krw: 39000, usd: 2900, name: 'Korean Daily Care Essence', targetCount: 3 },
  2: { krw: 74400, usd: 5600, name: 'K-Postpartum Starter Kit', targetCount: 3 },
  3: { krw: 27000, usd: 2000, name: 'Kids Silicone Tableware Set', targetCount: 3 },
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, teamName, description, privacy, gateway } = await request.json()

    const product = PRODUCTS[productId as number]
    if (!product) {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 })
    }

    const service = createServiceClient()

    // 팀 생성
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    const { data: team, error: teamError } = await service
      .from('teams')
      .insert({
        product_id: productId,
        captain_id: user.id,
        team_name: teamName,
        description: description || null,
        privacy: privacy || 'public',
        current_count: 0,
        target_count: product.targetCount,
        expires_at: expiresAt,
      })
      .select('id')
      .single()

    if (teamError || !team) {
      console.error('Team create error:', teamError)
      return NextResponse.json({ error: teamError?.message ?? 'Failed to create team', detail: teamError }, { status: 500 })
    }

    const isKrw = gateway === 'toss'
    const amount = isKrw ? product.krw : product.usd
    const currency = isKrw ? 'KRW' : 'USD'

    // 주문 생성
    const { data: order, error: orderError } = await service
      .from('orders')
      .insert({
        user_id: user.id,
        team_id: team.id,
        product_id: productId,
        amount,
        currency,
        payment_gateway: gateway,
      })
      .select('id')
      .single()

    if (orderError || !order) {
      console.error('Order create error:', orderError)
      return NextResponse.json({ error: orderError?.message ?? 'Failed to create order', detail: orderError }, { status: 500 })
    }

    return NextResponse.json({
      teamId: team.id,
      orderId: order.id,
      amount,
      currency,
      productName: product.name,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
