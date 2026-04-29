import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { resultId } = body

    if (!resultId) {
      return NextResponse.json({ success: false, error: 'Missing resultId' }, { status: 400 })
    }

    // 1. Verify existence of the result using user's client (ensure they own it)
    const { data: resultRecord, error: fetchErr } = await supabase
      .from('kyk_results')
      .select('id')
      .eq('id', resultId)
      .single()
      
    if (fetchErr || !resultRecord) {
      return NextResponse.json({ success: false, error: 'Invalid result record' }, { status: 400 })
    }

    // 2. kyk_unlock_events 기록 (Use supabaseAdmin because client cannot insert)
    const { error: eventError } = await supabaseAdmin
      .from('kyk_unlock_events')
      .insert({
        result_id: resultId,
        user_id: user.id,
        source: 'ad',
        status: 'completed',
        completed_at: new Date().toISOString()
      })

    if (eventError) {
      console.error('Ad unlock event insert error:', eventError)
      return NextResponse.json({ success: false, error: 'Failed to record unlock event' }, { status: 500 })
    }

    // 3. kyk_results 업데이트 (is_unlocked) (Use supabaseAdmin because client cannot update)
    const { error: updateError } = await supabaseAdmin
      .from('kyk_results')
      .update({
        is_unlocked: true,
        unlock_type: 'ad_once',
        unlocked_at: new Date().toISOString()
      })
      .eq('id', resultId)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Ad unlock result update error:', updateError)
      return NextResponse.json({ success: false, error: 'Failed to update result status' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Ad complete error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error while processing ad completion' }, { status: 500 })
  }
}

