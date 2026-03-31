'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, type UIMessage } from 'ai'
import { Send } from 'lucide-react'
import { KidProfile } from '@/lib/kyk/scoring'

interface CoachChatProps {
  profile: KidProfile
  concern: string
  kidId?: string
  isUntested?: boolean
}

const QUICK_REPLIES = [
  '고집 부릴 때 어떻게 해요?',
  '어떤 칭찬이 효과적인가요?',
  '또래 관계가 걱정돼요',
  '훈육은 어떻게 하나요?',
]

export function CoachChat({ profile, concern, kidId, isUntested }: CoachChatProps) {
  const router = useRouter()
  const [inputValue, setInputValue] = useState('')
  const [hasInteracted, setHasInteracted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const concernText = concern.includes('특별한 고민은 없어요')
    ? `전반적인 아이 양육과 발달`
    : `'${concern}'`

  const initialMessage = isUntested
    ? `안녕하세요! 부모님의 든든한 육아 파트너 AI 코치입니다. 요즘 아이를 키우시면서 가장 어렵거나 궁금한 점이 있으신가요?`
    : `안녕하세요! '${profile.title}' 성향을 가진 우리 아이 맞춤형 AI 코치입니다. 

검사 결과를 보니 부모님께서 요즘 ${concernText} 문제로 고민이 있으신 것 같아요. 우리 아이는 기본적으로 [${profile.strengths[0]}] 특징이 있지만, 종종 [${profile.carePoints[0]}] 취약점 때문에 부모님이 다루기 까다로울 때가 있을 거예요.

이러한 성향의 아이들은 훈육과 칭찬 방식이 완전히 달라야 합니다. 최근에 구체적으로 어떤 행동이나 상황 때문에 가장 힘드셨나요? 편하게 말씀해주세요.`

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ 
      api: '/api/chat',
      headers: {
        'x-kid-id': kidId || '',
        'x-kid-title': encodeURIComponent(profile.title),
        'x-kid-concern': encodeURIComponent(concern)
      }
    }),
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        parts: [{ type: 'text' as const, text: initialMessage }],
      },
    ] as UIMessage[],
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const isStreaming = status === 'streaming' || status === 'submitted'

  const submit = (text: string) => {
    if (!text.trim() || isStreaming) return

    if (isUntested) {
      if (window.confirm('KYK 진단을 먼저 진행해야 아이 성향에 맞춘 정확한 답변이 가능합니다.\n진단을 시작하시겠어요?')) {
        router.push('/kyk/step1')
      }
      return
    }

    setHasInteracted(true)
    sendMessage({ text })
    setInputValue('')
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    submit(inputValue)
  }

  const getMessageText = (message: (typeof messages)[number]) => {
    const textPart = message.parts?.find((p) => p.type === 'text')
    return textPart && 'text' in textPart ? textPart.text : ''
  }

  return (
    <div className="flex flex-col h-full bg-white lg:rounded-3xl overflow-hidden lg:border lg:border-slate-100 lg:shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-white">
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-[14px] bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden p-1.5 shadow-sm">
            <img src="/symbol.png" alt="AI 코치" className="w-full h-full object-contain" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-brand-yellowgreen border-2 border-white" />
        </div>
        <div>
          <p className="font-bold text-slate-900 text-[15px] leading-tight mb-0.5">AI 코치</p>
          <p className="text-xs text-brand-forestgreen font-medium">온라인 · 지금 바로 답변해요</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-slate-50/40">
        {messages.map((m) => {
          const text = getMessageText(m)
          if (!text) return null
          const isUser = m.role === 'user'
          return (
            <div key={m.id} className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 mb-0.5 p-1 shadow-sm">
                  <img src="/symbol.png" alt="AI 코치" className="w-full h-full object-contain" />
                </div>
              )}
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
                  isUser
                    ? 'bg-brand-red1 text-white rounded-br-sm'
                    : 'bg-white text-slate-800 rounded-bl-sm shadow-sm border border-slate-100'
                }`}
              >
                {text}
              </div>
            </div>
          )
        })}

        {/* Typing indicator */}
        {isStreaming && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 p-1 shadow-sm">
              <img src="/symbol.png" alt="AI 코치" className="w-full h-full object-contain" />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <span className="inline-flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}

        {/* Quick reply chips — 첫 메시지 후, 아직 대화 시작 안 했을 때만 표시 */}
        {!hasInteracted && !isStreaming && (
          <div className="flex flex-wrap gap-2 pt-1">
            {QUICK_REPLIES.map((q) => (
              <button
                key={q}
                onClick={() => submit(q)}
                className="px-3.5 py-2 rounded-full text-[13px] font-medium bg-white border border-brand-red1/30 text-brand-red1 hover:bg-brand-red1/5 hover:border-brand-red1/60 transition-all shadow-sm"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 lg:py-4 border-t border-slate-100 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="궁금한 점을 물어보세요..."
          disabled={isStreaming}
          className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 rounded-full pl-4 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-red1 focus:ring-1 focus:ring-brand-red1/30 transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isStreaming}
          className="w-9 h-9 rounded-full bg-brand-red1 text-white flex items-center justify-center disabled:opacity-40 disabled:bg-slate-300 transition-all hover:bg-brand-red2 shrink-0"
        >
          <Send size={15} className="-ml-0.5" />
        </button>
      </form>
    </div>
  )
}
