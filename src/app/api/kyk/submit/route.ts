import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateKYKResult, KID_PROFILES, KidType } from '@/lib/kyk/scoring'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { step1Answers, step2Answers, step3Answers, step4Answers } = body

    if (!step2Answers || Object.keys(step2Answers).length === 0) {
      return NextResponse.json({ error: 'Missing step 2 answers' }, { status: 400 })
    }

    const result = calculateKYKResult(step2Answers)
    const profile = KID_PROFILES[result.mbtiType as KidType]

    let analysisReport = null
    if (step4Answers && process.env.OPENAI_API_KEY) {
      const parentValues = step4Answers.parentValues?.join(', ') || '알 수 없음'
      const parentStyle = step4Answers.parentStyle || '알 수 없음'
      const childLevelsStr = Object.entries(step4Answers.childLevels || {}).map(([k,v]) => `${k}:레벨${v}`).join(', ') || '알 수 없음'
      
      const analysisPrompt = `당신은 KYK 아동 발달/양육 전문가입니다.
아이의 기질 특성:
- 기질 타입: ${profile?.title || result.mbtiType}
- 주된 강점: ${profile?.strengths?.join(', ') || ''}
- 취약점/주의점: ${profile?.carePoints?.join(', ') || ''}

부모님의 양육 상황 및 의도:
- 지향하는 가치관: ${parentValues}
- 양육 속도/스타일: ${parentStyle}
- 현재 아이의 각 영역별 학습 수준: ${childLevelsStr}

[중요 분석 로직]
1. 부모 vs 아이 "격차 분석": 부모가 '성취지향형'이거나 '선행/경쟁 대비형'인데 아이의 학습 수준이 초기(① 아직 시작 전, 등)라면 "속도 과부하 위험"을 반드시 짚으세요.
2. 스타일 충돌 분석: 부모 스타일이 '밀착 리드형'인데 지향 가치가 '행복/스트레스 최소형'이거나 '자율 존중형' 등 충돌이 있다면 "말과 행동 불일치(목표와 방식의 충돌)"가 있음을 지적하세요.

위 정보를 바탕으로, 다음 세 가지 항목을 각각 명확한 마크다운 헤더(## 1. 현재 상태 진단, ## 2. 위험 신호, ## 3. 추천 전략) 형식으로 작성하세요. 각 항목은 3-4문장씩 뼈대만 간결하고 명확하게 작성하며, 구체적인 근거를 들어 서술하세요.
1. "현재 상태 진단" (부모 기대 대비 아이의 기질/수준 분석)
2. "위험 신호" (과부하, 방임, 불균형 등의 우려 여부를 파악, 발견된 충돌이나 격차를 명시)
3. "추천 양육 전략 3가지" (충돌과 격차를 해소하기 위한 현실적인 우선 접근법)`

      try {
        const aiRes = await generateText({
          model: openai('gpt-4o-mini'),
          prompt: analysisPrompt,
        })
        analysisReport = aiRes.text
      } catch (err) {
        console.error('OpenAI step4 generation error:', err)
      }
    }

    const insertPayload = {
      user_id: user.id,
      result_type: result.mbtiType,
      base_type: result.mbtiType.slice(0, 2),
      sub_type: result.mbtiType.slice(2, 4),
      concern: step3Answers?.concern || null,
      answers: { step1: step1Answers, step2: step2Answers, step3: step3Answers, step4: step4Answers, step4_analysis: analysisReport },
    }

    const { data: insertedRecord, error: dbError } = await supabase
      .from('kyk_results')
      .insert([insertPayload])
      .select('id')
      .single()

    if (dbError) {
      console.error('DB Insert Error:', dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, kidId: insertedRecord.id })
  } catch (err: any) {
    console.error('Submit API Error:', err)
    return NextResponse.json({ error: err?.message || 'Internal Server Error' }, { status: 500 })
  }
}
