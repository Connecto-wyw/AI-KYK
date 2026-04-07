'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, type UIMessage } from 'ai'
import { Send } from 'lucide-react'
import { KidProfile } from '@/lib/kyk/scoring'
import { useLanguageStore } from '@/store/useLanguageStore'
import { dictionaries } from '@/lib/i18n/dictionaries'

interface CoachChatProps {
  profile: KidProfile
  concern: string
  kidId?: string
  isUntested?: boolean
}


export function CoachChat({ profile, concern, kidId, isUntested }: CoachChatProps) {
  const router = useRouter()
  const { language } = useLanguageStore()
  const dict = dictionaries[language]
  
  const [inputValue, setInputValue] = useState('')
  const [hasInteracted, setHasInteracted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const KOR_CONCERNS = [
    '말이 늦거나 표현이 부족해요',
    '밥을 잘 안 먹거나 편식이 심해요',
    '형제자매 혹은 다른 아이와 자주 싸워요',
    '주의력이 부족하고 산만해서 다칠까봐 걱정돼요',
    '친구들과 잘 어울리지 못하고 겉도는 것 같아요',
    '어린이집이나 유치원 가기를 너무 싫어해요',
    '짜증이나 화를 참지 못하고 심하게 부려요'
  ]

  let localizedConcern = concern
  KOR_CONCERNS.forEach((korStr, idx) => {
    if (dict.step3ConcernList && dict.step3ConcernList[idx]) {
      localizedConcern = localizedConcern.replace(korStr, dict.step3ConcernList[idx])
    }
  })

  // Handle NO concern string
  if (localizedConcern.includes('특별한 고민은 없어요')) {
    localizedConcern = localizedConcern.replace('특별한 고민은 없어요', dict.concernFallback)
  }

  const QUICK_REPLIES = [
    dict.coachQuickRep1,
    dict.coachQuickRep2,
    dict.coachQuickRep3,
    dict.coachQuickRep4,
  ]

  const concernText = localizedConcern.includes(dict.concernFallback)
    ? dict.concernFallback
    : `'${localizedConcern}'`

  let initialMessage = ''
  if (isUntested) {
    initialMessage = dict.greetingUntested
  } else {
    initialMessage = dict.greetingp1
      .replace('{title}', profile.title)
      .replace('{concern}', concernText)
      .replace('{strength}', profile.strengths[0] || '')
      .replace('{carePoint}', profile.carePoints[0] || '')
  }

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ 
      api: '/api/chat',
      headers: {
        'x-kid-id': kidId || '',
        'x-kid-title': encodeURIComponent(profile.title),
        'x-kid-concern': encodeURIComponent(localizedConcern),
        'x-kid-language': language
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
      if (window.confirm(dict.coachAlertUntested)) {
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
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-50 bg-white/80 backdrop-blur-md shrink-0 z-20 shadow-sm relative">
        <div className="relative shrink-0">
          <div className="w-[42px] h-[42px] rounded-2xl bg-brand-lightblue/20 border border-slate-50 flex items-center justify-center overflow-hidden p-2 shadow-sm">
            <img src="/symbol.png" alt="AI 코치" className="w-full h-full object-contain" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-[14px] h-[14px] rounded-full bg-brand-yellowgreen border-[3px] border-white" />
        </div>
        <div>
          <p className="font-extrabold text-slate-900 text-[16px] leading-tight mb-0.5">{dict.coachTitle}</p>
          <p className="text-[12px] text-brand-blue font-bold tracking-wide">{dict.coachStatus}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 bg-slate-50/30">
        {messages.map((m) => {
          const text = getMessageText(m)
          if (!text) return null
          const isUser = m.role === 'user'
          return (
            <div key={m.id} className={`flex gap-3 max-w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-[36px] h-[36px] rounded-[14px] bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 mt-1 p-1.5 shadow-sm">
                  <img src="/symbol.png" alt="AI 코치" className="w-full h-full object-contain" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-5 py-4 text-[15px] leading-relaxed break-keep font-medium shadow-sm ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-[24px] rounded-tr-md'
                    : 'bg-brand-lightblue/10 text-slate-800 rounded-[28px] rounded-tl-md border border-brand-lightblue/20'
                }`}
              >
                {text}
              </div>
            </div>
          )
        })}

        {/* Typing indicator */}
        {isStreaming && (
          <div className="flex items-start gap-3 justify-start max-w-full">
            <div className="w-[36px] h-[36px] rounded-[14px] bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 mt-1 p-1.5 shadow-sm">
              <img src="/symbol.png" alt="AI 코치" className="w-full h-full object-contain" />
            </div>
            <div className="bg-brand-lightblue/10 border border-brand-lightblue/20 rounded-[24px] rounded-tl-md px-5 py-4 shadow-sm flex items-center">
              <span className="inline-flex gap-1.5 items-center h-4">
                <span className="w-2 h-2 bg-brand-blue/40 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-brand-blue/40 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-brand-blue/40 rounded-full animate-bounce [animation-delay:300ms]" />
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
      <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-4 border-t border-slate-50 bg-white shrink-0 z-20">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={dict.coachInputPlaceholder}
          disabled={isStreaming}
          className="flex-1 bg-slate-50 border border-slate-100 text-slate-800 rounded-full pl-5 pr-5 h-[52px] text-[15px] font-medium focus:outline-none focus:border-brand-blue/30 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isStreaming}
          className="w-[52px] h-[52px] rounded-full bg-slate-900 text-white flex items-center justify-center disabled:opacity-30 disabled:bg-slate-300 transition-all hover:bg-slate-800 shrink-0 shadow-md"
        >
          <Send size={20} className="-ml-0.5" />
        </button>
      </form>
    </div>
  )
}
