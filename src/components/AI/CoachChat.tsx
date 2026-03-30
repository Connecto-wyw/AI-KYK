'use client'

import { useState, useEffect, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, type UIMessage } from 'ai'
import { Send } from 'lucide-react'
import { KidProfile } from '@/lib/kyk/scoring'

interface CoachChatProps {
  profile: KidProfile
  concern: string
  kidId?: string
}

const QUICK_REPLIES = [
  '고집 부릴 때 어떻게 해요?',
  '어떤 칭찬이 효과적인가요?',
  '또래 관계가 걱정돼요',
  '훈육은 어떻게 하나요?',
]

export function CoachChat({ profile, concern, kidId }: CoachChatProps) {
  const [inputValue, setInputValue] = useState('')
  const [hasInteracted, setHasInteracted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const initialMessage = `${profile.title} 유형 아이들은 독특한 강점이 있어요. 요즘 육아하면서 가장 어렵게 느껴지는 순간이 언제인가요?`

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
    <div className="flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-white">
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-brand-red1 flex items-center justify-center text-white font-black text-sm">
            K
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-brand-yellowgreen border-2 border-white" />
        </div>
        <div>
          <p className="font-bold text-slate-900 text-sm leading-tight">KYK 코치</p>
          <p className="text-xs text-brand-forestgreen font-medium">온라인 · 지금 바로 답변해요</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-[300px] max-h-[420px] overflow-y-auto px-4 py-5 space-y-4 bg-slate-50/40">
        {messages.map((m) => {
          const text = getMessageText(m)
          if (!text) return null
          const isUser = m.role === 'user'
          return (
            <div key={m.id} className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-7 h-7 rounded-full bg-brand-red1 flex items-center justify-center text-white font-black text-xs shrink-0 mb-0.5">
                  K
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
            <div className="w-7 h-7 rounded-full bg-brand-red1 flex items-center justify-center text-white font-black text-xs shrink-0">
              K
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
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-slate-100 bg-white">
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
