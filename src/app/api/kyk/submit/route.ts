import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateKYKResult } from '@/lib/kyk/scoring'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { deviceId, step1Answers, step2Answers, step3Answers } = body

    if (!step2Answers || Object.keys(step2Answers).length === 0) {
      return NextResponse.json({ error: 'Missing step 2 answers' }, { status: 400 })
    }

    // Server-side logical scoring to prevent client tampering
    const result = calculateKYKResult(step2Answers)

    const insertPayload: any = {
      user_id: user.id,
      device_id: deviceId,
      answers: { step1: step1Answers, step2: step2Answers, step3: step3Answers },
      result_type: result.mbtiType,
      base_type: result.mbtiType.slice(0, 2),
      sub_type: result.mbtiType,
      concern: step3Answers?.concern || null,
      result_summary: result.summary,
      result_detail: result.axisScores,
    }

    const { error: dbError } = await supabase
      .from('kyk_results')
      .insert([insertPayload])

    if (dbError) {
      console.error('DB Insert Error:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ success: true, resultType: result.animalType })
  } catch (err) {
    console.error('Submit API Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
