import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { resultId, amount } = await request.json()

    if (!resultId || !amount) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 })
    }

    // Verify result existence using user client (ensure ownership)
    const { data: resultRecord, error: fetchErr } = await supabase
      .from('kyk_results')
      .select('id')
      .eq('id', resultId)
      .single()

    if (fetchErr || !resultRecord) {
      return NextResponse.json({ success: false, error: 'Invalid result record' }, { status: 400 })
    }

    const orderId = `kyk_${uuidv4().replace(/-/g, '').substring(0, 16)}`

    // Use admin client to insert because user client is restricted by RLS from inserting
    const { error: insertError } = await supabaseAdmin
      .from('kyk_payments')
      .insert({
        result_id: resultId,
        user_id: user.id,
        order_id: orderId,
        amount: amount,
        status: 'ready'
      })

    if (insertError) {
      console.error('Payment intent insert error:', insertError)
      return NextResponse.json({ success: false, error: 'Failed to create payment intent' }, { status: 500 })
    }

    return NextResponse.json({ success: true, orderId })
  } catch (err: any) {
    console.error('Payment create error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error while creating payment' }, { status: 500 })
  }
}

