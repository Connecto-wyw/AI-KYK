import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createOpenAI } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
})

const reportSchema = z.object({
  deepAnalysis: z.string(),
  riskScenarios: z.array(z.string()),
  situationResponses: z.array(z.object({ situation: z.string(), response: z.string() })),
  exactSentences: z.array(z.string()),
  fourWeekPlan: z.array(z.object({ week: z.number(), focus: z.string(), action: z.string() }))
})

export async function POST(request: Request) {
  try {
    const { id } = await request.json()

    // Use Service Role to bypass RLS for updating the JSON report
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1. Fetch user data record bridging
    const { data: record, error: fetchError } = await supabase
      .from('kyk_results')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !record) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key missing in environment' }, { status: 500 })
    }

    // 2. Generate Object using LLM
    const { object: report } = await generateObject({
      model: openai('gpt-4o'),
      schema: reportSchema,
      prompt: `다음 정보를 바탕으로 프리미엄 자녀 양육 분석 리포트를 작성해주세요.
아이 성향: ${record.result_type} (기본형: ${record.base_type}, 상세형: ${record.sub_type})
부모님의 가장 큰 고민: ${record.concern || '전반적인 발달과 양육 방향'}
연령대/기타 답변: ${JSON.stringify(record.answers)}

반드시 명시된 스키마에 맞춰 JSON 데이터만 엄격하게 반환하세요.
1. deepAnalysis: 성향에 대한 심층 분석 (1문단)
2. riskScenarios: 가장 위험하거나 갈등이 생기기 쉬운 시나리오 3개
3. situationResponses: 특정 상황과 부모의 이상적 대처법 3개
4. exactSentences: 아이에게 즉시 사용할 수 있는 공감/훈육 마법의 문장 5개
5. fourWeekPlan: 주차별 목표와 실행 행동을 담은 4주치 액션 플랜결과`
    })

    // 3. Update DB
    const { error: updateError } = await supabase
      .from('kyk_results')
      .update({ full_report_json: report })
      .eq('id', id)

    if (updateError) {
      throw new Error('Failed to write report to database')
    }

    return NextResponse.json({ success: true, report })

  } catch (error) {
    console.error('Generate Report Route Error:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
