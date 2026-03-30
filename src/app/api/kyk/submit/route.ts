import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { calculateKYKResult } from '@/lib/kyk/scoring'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { step1Answers, step2Answers, step3Answers } = body

    if (!step2Answers || Object.keys(step2Answers).length === 0) {
      return NextResponse.json({ error: 'Missing step 2 answers' }, { status: 400 })
    }

    // Server-side logical scoring
    const result = calculateKYKResult(step2Answers)

    const insertPayload = {
      user_id: user.id,
      result_type: result.mbtiType,
      base_type: result.mbtiType.slice(0, 2),
      sub_type: result.mbtiType.slice(2, 4),
      concern: step3Answers?.concern || null,
      answers: { step1: step1Answers, step2: step2Answers, step3: step3Answers },
    }

    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: insertedRecord, error: dbError } = await serviceClient
      .from('kyk_results')
      .insert([insertPayload])
      .select('id')
      .single()

    if (dbError) {
      console.error('DB Insert Error:', dbError)
      return NextResponse.json({ error: dbError.message || 'Database error', details: dbError }, { status: 500 })
    }

    return NextResponse.json({ success: true, kidId: insertedRecord.id })
  } catch (err: any) {
    console.error('Submit API Error:', err)
    return NextResponse.json({ error: err?.message || 'Internal Server Error' }, { status: 500 })
  }
}
