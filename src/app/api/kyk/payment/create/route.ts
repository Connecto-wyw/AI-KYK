import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { resultId, amount } = await request.json()

    if (!resultId || !amount) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 })
    }

    const orderId = `kyk_${uuidv4().replace(/-/g, '').substring(0, 16)}`

    const { error: insertError } = await supabase
      .from('kyk_payments')
      .insert({
        result_id: resultId,
        user_id: user.id,
        order_id: orderId,
        amount: amount,
        status: 'ready'
      })

    if (insertError) throw insertError

    return NextResponse.json({ success: true, orderId })
  } catch (err: any) {
    console.error('Payment create error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
