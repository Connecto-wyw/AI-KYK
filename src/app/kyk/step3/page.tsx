'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useKYKStore } from '@/store/useKYKStore'

const CONCERNS = [
  '학교 적응이 걱정돼요',
  '친구 관계가 어려워 보여요',
  '자신감이 부족한 것 같아요',
  '집중력이 짧은 편이에요',
  '감정 조절이 힘들어 보여요',
  '진로나 미래가 걱정돼요',
  '학습 동기가 낮아요',
  '기타 고민이 있어요',
]

export default function Step3Page() {
  const router = useRouter()
  const { step3Answers, setStep3 } = useKYKStore()
  const [selected, setSelected] = useState<string>('')

  useEffect(() => {
    if (step3Answers?.concern) {
      setSelected(step3Answers.concern)
    }
  }, [step3Answers])

  const handleNext = () => {
    if (selected) {
      setStep3({ concern: selected })
      router.push('/kyk/saving')
    }
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-brand-white w-full max-w-md lg:max-w-4xl mx-auto shadow-2xl lg:shadow-none border-x border-slate-100 lg:border-x-0 relative">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center bg-white px-4 lg:px-8 h-14 lg:h-16 border-b border-slate-100 shadow-sm">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <Image src="/symbol.png" alt="KYK" width={24} height={24} className="ml-1 object-contain opacity-80" />
        <div className="flex-1 px-3">
          <Progress value={100} className="h-2" />
        </div>
        <div className="w-8 text-xs text-right font-medium text-slate-400">3/3</div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 lg:px-12 py-8 pb-32">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2 leading-snug">
          요즘 가장 걱정되는<br/>부분이 무엇인가요?
        </h1>
        <p className="text-slate-500 mb-8 text-sm lg:text-base">
          아이에게 가장 잘 맞는 가이드를 드리기 위해 필요해요.
        </p>

        <div className="space-y-3">
          {CONCERNS.map((concern) => {
            const isSelected = selected === concern
            return (
              <button
                key={concern}
                onClick={() => setSelected(concern)}
                className={`w-full text-left px-5 py-4 rounded-2xl border-2 text-[15px] font-medium transition-all duration-200 ${
                  isSelected
                    ? 'border-brand-red1 bg-brand-red1/5 text-brand-red1'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                {concern}
              </button>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md lg:max-w-4xl bg-white border-t border-slate-100 p-4 lg:px-12 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <Button
          size="lg"
          className="w-full h-14 text-lg rounded-2xl transition-all bg-brand-red1 hover:bg-brand-red2 text-white"
          disabled={!selected}
          onClick={handleNext}
        >
          결과 확인하기
        </Button>
      </footer>
    </div>
  )
}
