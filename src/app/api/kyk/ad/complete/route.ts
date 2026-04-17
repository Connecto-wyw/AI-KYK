import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { resultId } = body

    if (!resultId) {
      return NextResponse.json({ success: false, error: 'Missing resultId' }, { status: 400 })
    }

    // 1. kyk_unlock_events 기록
    const { error: eventError } = await supabase
      .from('kyk_unlock_events')
      .insert({
        result_id: resultId,
        user_id: user.id,
        source: 'ad',
        status: 'completed',
        completed_at: new Date().toISOString()
      })

    if (eventError) throw eventError

    // 2. kyk_results 업데이트 (is_unlocked)
    const { error: updateError } = await supabase
      .from('kyk_results')
      .update({
        is_unlocked: true,
        unlock_type: 'ad_once',
        unlocked_at: new Date().toISOString()
      })
      .eq('id', resultId)
      .eq('user_id', user.id)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Ad complete error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
