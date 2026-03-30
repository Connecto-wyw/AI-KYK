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
      const partial: Record<string, number> = {}
      QUESTIONS.forEach(q => {
        if (step2Answers[q.id] !== undefined) partial[q.id] = step2Answers[q.id]
      })
      setAnswers(partial)
    }
  }, [step2Answers])

  const handleSelect = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (Object.keys(answers).length === QUESTIONS.length) {
      setStep2({ ...step2Answers, ...answers })
      router.push('/kyk/step2b')
    }
  }

  const progressCount = Object.keys(answers).length
  const isComplete = progressCount === QUESTIONS.length

  return (
    <div className="flex flex-col min-h-[100dvh] bg-white w-full max-w-md lg:max-w-2xl mx-auto relative lg:transform lg:translate-x-0">
      <header className="sticky top-0 z-10 flex items-center bg-white px-4 lg:px-8 h-14 lg:h-16">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <Image src="/symbol.png" alt="KYK" width={24} height={24} className="ml-1 object-contain opacity-80" />
        <div className="flex-1 px-3">
          <Progress value={50} className="h-2" />
        </div>
        <div className="w-8 text-xs text-right font-medium text-slate-400">2/4</div>
      </header>

      <main className="flex-1 px-6 lg:px-12 py-8 pb-32">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-8 leading-snug">
          우리 아이의 평소 모습에<br/>가장 가까운 것을 선택해주세요
        </h1>

        <div className="space-y-6">
          {QUESTIONS.map((q, idx) => (
            <div key={q.id} className="py-4 border-b border-slate-100 last:border-0">
              <div className="flex gap-3 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-yellow/20 text-brand-red1 text-xs font-bold shrink-0">
                  {idx + 1}
                </span>
                <p className="text-slate-800 font-medium leading-relaxed">{q.text}</p>
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
                      <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 group-active:scale-95",
                        isSelected 
                        ? "bg-brand-navy border-brand-navy text-white scale-110 shadow-md"
                        : "bg-white border-slate-200 text-slate-400 group-hover:border-brand-lightblue/50"
                      )}>
                        {opt.value}
                      </div>
                      <span className={cn("mt-3 sm:mt-4 text-xs sm:text-sm transition-colors",
                        isSelected ? "text-brand-navy font-bold" : "text-slate-400"
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

      <footer className="fixed lg:absolute bottom-0 left-0 right-0 mx-auto w-full max-w-md lg:max-w-none bg-white p-4 lg:px-12 pb-8 z-10 border-t border-slate-50 lg:border-t-0">
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-sm font-medium text-slate-500">응답 완료</span>
          <span className={cn("text-sm font-bold", isComplete ? "text-brand-red1" : "text-slate-400")}>
            {progressCount} / {QUESTIONS.length}
          </span>
        </div>
        <Button
          size="lg"
          className="w-full h-14 text-lg rounded-2xl transition-all bg-brand-red1 hover:bg-brand-red2 text-white"
          disabled={!isComplete}
          onClick={handleNext}
        >
          다음으로
        </Button>
      </footer>
    </div>
  )
}
