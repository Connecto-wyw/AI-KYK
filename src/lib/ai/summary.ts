import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { createClient } from '@/lib/supabase/server'

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
})

/**
 * Background routine to summarize chat history and update the kid_memories table.
 * This runs periodically to compress Context window and save token costs.
 */
export async function summarizeChatMemory(kidId: string, currentMemory: string) {
  try {
    const supabase = await createClient()

    // 1. Fetch recent chats for this kid
    const { data: recentChats } = await supabase
      .from('coach_chats')
      .select('role, content, created_at')
      .eq('kid_id', kidId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (!recentChats || recentChats.length === 0) return

    // Reverse to chronological order
    const chatLog = recentChats.reverse().map(c => `${c.role === 'user' ? '부모' : 'AI코치'}: ${c.content}`).join('\n')

    const prompt = `
당신은 AI 요약 에이전트입니다. 부모와 AI 코치 간의 대화 로그를 읽고, 기존 기억(Memory)을 최신화해주세요.
아이의 발달 상황, 부모의 주요 고민 트렌드, 코치가 권장했던 솔루션의 경과 등을 3~4문장으로 압축해야 합니다.

[기존 기억]
${currentMemory || '기존 기억 없음'}

[최근 대화 로그 10건]
${chatLog}

위 내용을 바탕으로 앞으로 AI 코치가 참고해야 할 핵심 컨텍스트 요약본만 반환하세요.
결과는 불필요한 서론/결론 없이 요약된 텍스트 자체만 출력하세요.
`

    if (!process.env.OPENAI_API_KEY) {
      console.log('Skipping summarize due to missing API KEY')
      return
    }

    const { text: newMemory } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
    })

    // 2. Upsert into kid_memories
    const { error } = await supabase.from('kid_memories').upsert({
      kid_id: kidId,
      summary_context: newMemory.trim(),
      updated_at: new Date().toISOString()
    }, { onConflict: 'kid_id' })

    if (error) {
      console.error('Failed to upsert kid memory:', error)
    }

  } catch (error) {
    console.error('Error generating chat memory summary:', error)
  }
}
