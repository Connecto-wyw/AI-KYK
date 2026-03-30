'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useKYKStore } from '@/store/useKYKStore'
import { cn } from '@/lib/utils'

const QUESTIONS = [
  { id: 'q2', text: '우리 아이는 새로운 친구를 사귀는 것이 어렵지 않다.' },
  { id: 'q3', text: '우리 아이는 혼자서도 조용히 잘 논다.' },
  { id: 'q4', text: '처음 보는 사람 앞에서도 자연스럽게 말한다.' },
  { id: 'q5', text: '우리 아이는 이야기를 들을 때 그 배경이나 이유를 궁금해한다.' },
  { id: 'q6', text: '우리 아이는 그림을 사실적으로 그리는 걸 좋아한다.' },
  { id: 'q7', text: '놀이 중 상상 속 세계나 규칙을 만들어내는 편이다.' },
  { id: 'q8', text: '친구가 울면 함께 공감하려고 한다.' },
  { id: 'q9', text: '우리 아이는 상황을 논리적으로 설명하려 한다.' },
  { id: 'q10', text: '어떤 것이 옳고 그른지를 중요하게 생각한다.' },
  { id: 'q11', text: '우리 아이는 해야 할 일을 미리 계획해서 처리하는 편이다.' },
  { id: 'q12', text: '일정이 바뀌면 당황하거나 싫어한다.' },
  { id: 'q13', text: '하고 싶은 것을 먼저 하고, 싫은 건 나중에 미루는 편이다.' },
]

const LIKERT_OPTIONS = [
  { value: 1, label: '전혀 아님' },
  { value: 2, label: '아님' },
  { value: 3, label: '그렇다' },
  { value: 4, label: '매우 그렇다' }
]

export default function Step2Page() {
  const router = useRouter()
  const { step2Answers, setStep2 } = useKYKStore()
  const [answers, setAnswers] = useState<Record<string, number>>({})

  useEffect(() => {
    if (Object.keys(step2Answers).length > 0) {
      setAnswers(step2Answers)
    }
  }, [step2Answers])

  const handleSelect = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (Object.keys(answers).length === QUESTIONS.length) {
      setStep2(answers)
      router.push('/kyk/step3')
    }
  }

  const progressCount = Object.keys(answers).length
  const totalQuestions = QUESTIONS.length
  const isComplete = progressCount === totalQuestions

  return (
    <div className="flex flex-col min-h-[100dvh] bg-brand-white w-full max-w-md lg:max-w-4xl mx-auto shadow-2xl lg:shadow-none border-x border-slate-100 lg:border-x-0 relative">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center bg-brand-white px-4 lg:px-8 h-14 lg:h-16">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <Image src="/symbol.png" alt="KYK" width={24} height={24} className="ml-1 object-contain opacity-80" />
        <div className="flex-1 px-3">
          <Progress value={(2/3) * 100} className="h-2" />
        </div>
        <div className="w-8 text-xs text-right font-medium text-slate-400">2/3</div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 lg:px-12 py-8 pb-32">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-8 leading-snug">
          우리 아이의 평소 모습에<br/>가장 가까운 것을 선택해주세요
        </h1>

        {/* Mobile: single column / Desktop: 2-column grid */}
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
          {QUESTIONS.map((q, idx) => (
            <div key={q.id} className="py-4">
              <div className="flex gap-3 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-yellow/20 text-brand-red1 text-xs font-bold shrink-0">
                  {idx + 1}
                </span>
                <p className="text-slate-800 font-medium leading-relaxed">
                  {q.text}
                </p>
              </div>

              <div className="flex justify-between items-center gap-1">
                {LIKERT_OPTIONS.map((opt) => {
                  const isSelected = answers[q.id] === opt.value
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(q.id, opt.value)}
                      className="group flex flex-col items-center flex-1"
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 mb-2 border-2",
                        isSelected
                          ? "bg-blue-600 border-blue-600 text-white scale-110 shadow-md"
                          : "bg-white border-slate-200 text-slate-400 group-hover:border-blue-300"
                      )}>
                        {opt.value}
                      </div>
                      <span className={cn(
                        "text-[10px] sm:text-xs font-medium text-center break-keep leading-tight",
                        isSelected ? "text-blue-700 font-bold" : "text-slate-400"
                      )}>
                        {opt.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md lg:max-w-4xl bg-brand-white p-4 lg:px-12 pb-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-sm font-medium text-slate-500">응답 완료</span>
          <span className={cn(
            "text-sm font-bold",
            isComplete ? "text-brand-red1" : "text-slate-400"
          )}>
            {progressCount} / {totalQuestions}
          </span>
        </div>
        <Button
          size="lg"
          className="w-full h-14 text-lg rounded-2xl transition-all bg-brand-red1 hover:bg-brand-red2 text-white"
          disabled={!isComplete}
          onClick={handleNext}
        >
          마지막 단계로
        </Button>
      </footer>
    </div>
  )
}
