import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

const PRODUCTS: Record<number, { krw: number; usd: number; name: string }> = {
  1: { krw: 39000, usd: 2900, name: 'Korean Daily Care Essence' },
  2: { krw: 74400, usd: 5600, name: 'K-Postpartum Starter Kit' },
  3: { krw: 27000, usd: 2000, name: 'Kids Silicone Tableware Set' },
}

// GET /api/teams/[teamId] - 팀 정보 조회
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params
    const service = createServiceClient()

    const { data: team, error } = await service
      .from('teams')
      .select('*, products(name_ko, name_en, img, original_price, team_price)')
      .eq('id', teamId)
      .single()

    if (error || !team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    const { data: members } = await service
      .from('team_members')
      .select('user_id, role, joined_at')
      .eq('team_id', teamId)

    return NextResponse.json({ team, members: members || [] })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/teams/[teamId] - 팀 합류 (결제 전 주문 생성)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { gateway } = await request.json()
    const service = createServiceClient()

    const { data: team, error: teamError } = await service
      .from('teams')
      .select('id, product_id, current_count, target_count, status, expires_at')
      .eq('id', teamId)
      .single()

    if (teamError || !team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }
    if (team.status !== 'open') {
      return NextResponse.json({ error: 'Team is not open' }, { status: 400 })
    }
    if (new Date(team.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Team has expired' }, { status: 400 })
    }

    const { data: existing } = await service
      .from('team_members')
      .select('id')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Already a member' }, { status: 400 })
    }

    const product = PRODUCTS[team.product_id as number]
    if (!product) {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 })
    }

    const isKrw = gateway === 'toss'
    const amount = isKrw ? product.krw : product.usd
    const currency = isKrw ? 'KRW' : 'USD'

    const { data: order, error: orderError } = await service
      .from('orders')
      .insert({
        user_id: user.id,
        team_id: teamId,
        product_id: team.product_id,
        amount,
        currency,
        payment_gateway: gateway,
      })
      .select('id')
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    return NextResponse.json({
      orderId: order.id,
      teamId,
      amount,
      currency,
      productName: product.name,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
