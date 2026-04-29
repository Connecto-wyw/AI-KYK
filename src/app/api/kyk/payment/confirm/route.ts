import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { paymentKey, orderId, amount } = await request.json()
    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json({ success: false, error: 'Missing payment parameters' }, { status: 400 })
    }

    // 1. Verify existence of the ready order (safe to use user client for SELECT)
    const { data: paymentRecord, error: fetchErr } = await supabase
      .from('kyk_payments')
      .select('*')
      .eq('order_id', orderId)
      .eq('user_id', user.id)
      .single()

    if (fetchErr || !paymentRecord) {
      return NextResponse.json({ success: false, error: 'Invalid order' }, { status: 400 })
    }

    if (paymentRecord.amount !== amount) {
      return NextResponse.json({ success: false, error: 'Amount mismatch' }, { status: 400 })
    }

    // 2. Call Toss confirm API
    const secretKey = process.env.TOSS_SECRET_KEY || ''
    const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString('base64')

    const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encryptedSecretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paymentKey, orderId, amount })
    })

    const tossData = await tossRes.json()

    if (!tossRes.ok) {
      // Failed payment: Use supabaseAdmin to update since client cannot update
      await supabaseAdmin.from('kyk_payments').update({
        status: 'failed',
        raw_response: tossData
      }).eq('order_id', orderId)
      return NextResponse.json({ success: false, error: 'Payment processing failed with provider' }, { status: 400 })
    }

    // 3. Mark successful in DB: Use supabaseAdmin
    await supabaseAdmin.from('kyk_payments').update({
      status: 'paid',
      payment_key: paymentKey,
      raw_response: tossData,
      confirmed_at: new Date().toISOString()
    }).eq('order_id', orderId)

    // 4. Record the unlock event (진실의 원천 업데이트): Use supabaseAdmin
    await supabaseAdmin.from('kyk_unlock_events').insert({
      result_id: paymentRecord.result_id,
      user_id: user.id,
      source: 'payment',
      status: 'completed',
      completed_at: new Date().toISOString()
    })

    // 5. Update cached kyk_results unlock state: Use supabaseAdmin
    await supabaseAdmin.from('kyk_results').update({
      is_unlocked: true,
      unlock_type: 'paid',
      paid_order_id: orderId,
      unlocked_at: new Date().toISOString()
    }).eq('id', paymentRecord.result_id)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Payment confirm error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error during payment confirmation' }, { status: 500 })
  }
}

