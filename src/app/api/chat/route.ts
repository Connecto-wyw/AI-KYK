import { createOpenAI } from '@ai-sdk/openai'
import { streamText, convertToModelMessages, createUIMessageStreamResponse, createUIMessageStream } from 'ai'
import { NextResponse } from 'next/server'

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      const stream = createUIMessageStream({
        execute: ({ writer }) => {
          writer.write({ type: 'text-start', id: 'fallback' })
          writer.write({ type: 'text-delta', id: 'fallback', delta: 'API 키가 설정되지 않았습니다. 실제 환경에서는 AI 코치가 구체적인 피드백을 실시간으로 답변합니다.' })
          writer.write({ type: 'text-end', id: 'fallback' })
        }
      })
      return createUIMessageStreamResponse({ stream })
    }

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: `당신은 육아 전문가 'KYK 수석 코치' 입니다.
부모님의 답변을 바탕으로 1~2문장의 간결하고 전문적인 조언을 건네주세요. 질문으로 답변을 마무리하여 대화를 유도하세요.
말투는 다정하지만 확신에 찬 전문가 톤입니다.`,
      messages: await convertToModelMessages(messages),
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 })
  }
}
