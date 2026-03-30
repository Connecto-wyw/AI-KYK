import { createOpenAI } from '@ai-sdk/openai'
import { streamText, convertToModelMessages, createUIMessageStreamResponse, createUIMessageStream } from 'ai'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { summarizeChatMemory } from '@/lib/ai/summary'
import { KID_PROFILES, KidType } from '@/lib/kyk/scoring'

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
    let profileDetails = "프로필 정보 없음"

    if (kidId) {
      supabase = await createClient()
      
      const { data: record } = await supabase.from('kyk_results').select('*').eq('id', kidId).single()
      if (record) {
        const profile = KID_PROFILES[record.result_type as KidType]
        const ageGroup = record.answers?.step3?.ageGroup || '미상'
        
        profileDetails = `
- Child Age: ${ageGroup}
- Personality Type: Base(${record.base_type}), Sub(${record.sub_type})
- Animal Title: ${profile?.title || 'Unknown'}
- Strengths: ${profile?.strengths?.join(', ') || 'None'}
- Care Points (Risks): ${profile?.carePoints?.join(', ') || 'None'}
- Parent's Main Concern: ${record.concern || 'General parenting'}
`
      }

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

    const systemPrompt = `You are the KYK AI Parenting Coach, an experienced, highly personalized child behavior expert. All responses MUST be in Korean.

CORE POSITIONING:
- Be emotionally aware but calm, clear, practical, and action-oriented.
- DO NOT use long textbook answers. DO NOT use numbered lists. Be conversational but authoritative.

CHILD'S TEMPERAMENT PROFILE:
${profileDetails}

PAST MEMORY (RAG):
${memoryContext ? memoryContext : 'No past interactions yet.'}

PERSONALIZATION RULE (CRITICAL):
Every response MUST be explicitly grounded in the child's temperament. Connect the behavior to their specific traits. Explain *why* the child reacts this way based on their KYK profile. 

RESPONSE STRUCTURE (Keep it concise, 3-4 sentences total):
1. Empathy: 1 short sentence acknowledging the parent.
2. Interpretation: Explain the behavior linked to the temperament.
3. Action: Give exactly ONE practical action to take.
4. Script: Give exactly ONE example sentence the parent can actually say.
(Rotate your style between Action coaching, Pattern insight, and Situation interpretation so you don't sound robotic).

SAFETY RULES:
- Never make medical diagnoses. Never blame the parent. No absolute statements.

CONVERSION-AWARE COACHING (CRITICAL):
You are part of a funnel.
- For simple/early questions, give excellent practical advice.
- When the parent asks deeper follow-ups, if the problem repeats, or the situation is complex: DO NOT give a full structured solution.
- Instead, gently indicate that a "맞춤형 양육 전략(Personalized parenting strategy/report)" would help break this pattern deeply, while offering a tiny immediate tip. DO NOT hard sell or mention price. Make them want structured help.`

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
