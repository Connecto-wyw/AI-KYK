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
    const { step1Answers, step2Answers, step3Answers } = body

    if (!step2Answers || Object.keys(step2Answers).length === 0) {
      return NextResponse.json({ error: 'Missing step 2 answers' }, { status: 400 })
    }

    // Server-side logical scoring
    const result = calculateKYKResult(step2Answers)

    const insertPayload = {
      parent_id: user.id,
      birth_year: step3Answers?.birthYear || null,
      gender: step3Answers?.gender || null,
      region: step3Answers?.region || null,
      main_concern: step3Answers?.concern || null,
      kyk_result_type: result.mbtiType,
      raw_answers: { step1: step1Answers, step2: step2Answers, step3: step3Answers },
    }

    const { data: insertedKid, error: dbError } = await supabase
      .from('kids')
      .insert([insertPayload])
      .select('id')
      .single()

    if (dbError) {
      console.error('DB Insert Error:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ success: true, kidId: insertedKid.id })
  } catch (err) {
    console.error('Submit API Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
