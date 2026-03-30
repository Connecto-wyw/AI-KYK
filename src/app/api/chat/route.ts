import { createOpenAI } from '@ai-sdk/openai'
import { streamText, convertToModelMessages, createUIMessageStreamResponse, createUIMessageStream } from 'ai'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { summarizeChatMemory } from '@/lib/ai/summary'

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const kidId = req.headers.get('x-kid-id')
    const kidTitle = decodeURIComponent(req.headers.get('x-kid-title') || '')
    const kidConcern = decodeURIComponent(req.headers.get('x-kid-concern') || '')

    let memoryContext = ""
    let supabase = null

    if (kidId) {
      supabase = await createClient()
      const { data: memory } = await supabase.from('kid_memories').select('summary_context').eq('kid_id', kidId).single()
      if (memory) memoryContext = memory.summary_context

      // Save the latest user message to DB
      const userMessage = messages[messages.length - 1]
      if (userMessage?.role === 'user') {
        const textContent = typeof userMessage.content === 'string' 
          ? userMessage.content 
          : (userMessage.parts?.find((p: any) => p.type === 'text')?.text || '')

        await supabase.from('coach_chats').insert([
          { kid_id: kidId, role: 'user', content: textContent }
        ])
      }
    }

    if (!process.env.OPENAI_API_KEY) {
      const stream = createUIMessageStream({
        execute: ({ writer }) => {
          writer.write({ type: 'text-start', id: 'fallback' })
          writer.write({ type: 'text-delta', id: 'fallback', delta: 'API 키가 설정되지 않았습니다. 실제 환경에서는 AI 코치가 이 맥락을 바탕으로 구체적인 피드백을 답변합니다.' })
          writer.write({ type: 'text-end', id: 'fallback' })
        }
      })
      return createUIMessageStreamResponse({ stream })
    }

    const systemPrompt = `당신은 육아 전문가 'KYK 수석 코치' 입니다.
아이는 '${kidTitle}' 성향을 가졌으며, 부모님의 주요 고민은 '${kidConcern}' 입니다.
과거 상담 내역 요약: ${memoryContext ? memoryContext : '아직 상담 내역이 없습니다.'}

위 정보를 바탕으로 부모님의 질문에 1~2문장의 간결하고 전문적인 조언을 건네주세요. 질문으로 답변을 마무리하여 대화를 유도하세요.
말투는 다정하지만 확신에 찬 전문가 톤입니다.`

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      onFinish: async ({ text }) => {
        // Save assistant message to DB when stream finishes
        if (kidId && supabase) {
          await supabase.from('coach_chats').insert([
            { kid_id: kidId, role: 'assistant', content: text }
          ])

          // Trigger background summarization every N messages
          if (messages.length >= 4 && messages.length % 4 === 0) {
            // Fire and forget, don't await to avoid delaying the response closing
            summarizeChatMemory(kidId, memoryContext).catch(console.error)
          }
        }
      }
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 })
  }
}
