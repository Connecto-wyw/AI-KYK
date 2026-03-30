'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useKYKStore } from '@/store/useKYKStore'
import { cn } from '@/lib/utils'

const ADJECTIVES = [
  '차분한', '똑똑한', '유연한', '상상력이 풍부한', '꼼꼼한',
  '세심한', '똑 부러진', '요령있는', '말재주 있는', '의젓한',
  '친구 많은', '에너지넘치는', '겁 없는', '밝은', '긍정 뿜뿜',
  '호기심 많은', '착한마음씨', '듬직한', '내 의견 확실한', '몸으로 배우는',
  '믿음직한', '포기 안 하는', '자기 색 뚜렷한', '몰입 잘 하는', '조용히 생각하는'
]

export default function Step1Page() {
  const router = useRouter()
  const { step1Answers, setStep1 } = useKYKStore()
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    if (step1Answers.length > 0) {
      setSelected(step1Answers)
    }
  }, [step1Answers])

  const toggleAdjective = (word: string) => {
    setSelected(prev => {
      if (prev.includes(word)) return prev.filter(w => w !== word)
      if (prev.length >= 5) return prev
      return [...prev, word]
    })
  }

  const handleNext = () => {
    if (selected.length === 5) {
      setStep1(selected)
      router.push('/kyk/step2')
    }
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-brand-white w-full max-w-md lg:max-w-3xl mx-auto shadow-2xl lg:shadow-none border-x border-slate-100 lg:border-x-0 relative">
      {/* Header */}
      <header className="flex items-center px-4 lg:px-8 h-14 lg:h-16 border-b border-slate-100 bg-white">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <Image src="/symbol.png" alt="KYK" width={24} height={24} className="ml-1 object-contain opacity-80" />
        <div className="flex-1 px-3">
          <Progress value={33} className="h-2" />
        </div>
        <div className="w-8 text-xs text-right font-medium text-slate-400">1/3</div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 lg:px-12 py-8 pb-32">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
          아이를 가장 잘 설명하는<br/>단어 5개를 골라주세요
        </h1>
        <p className="text-slate-500 mb-8 text-sm lg:text-base">
          평소 아이의 모습과 가장 가까운 것을 직관적으로 선택해주세요.
        </p>

        <div className="flex flex-wrap gap-3 lg:gap-4">
          {ADJECTIVES.map((word) => {
            const isSelected = selected.includes(word)
            const isMaxReached = selected.length >= 5 && !isSelected
            return (
              <button
                key={word}
                onClick={() => toggleAdjective(word)}
                disabled={isMaxReached}
                className={cn(
                  "px-4 py-2.5 lg:px-5 lg:py-3 rounded-full text-[15px] lg:text-base font-medium transition-all duration-200",
                  isSelected
                    ? "bg-brand-red1 text-white shadow-md scale-105"
                    : "bg-brand-white text-slate-600 hover:bg-slate-100 border border-slate-200",
                  isMaxReached && "opacity-40 cursor-not-allowed"
                )}
              >
                {word}
              </button>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md lg:max-w-3xl bg-white border-t border-slate-100 p-4 lg:px-12 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-sm font-medium text-slate-500">선택된 단어</span>
          <span className={cn(
            "text-sm font-bold",
            selected.length === 5 ? "text-brand-red1" : "text-slate-400"
          )}>
            {selected.length} / 5
          </span>
        </div>
        <Button
          size="lg"
          className="w-full h-14 text-lg rounded-2xl bg-brand-red1 hover:bg-brand-red2 text-white"
          disabled={selected.length !== 5}
          onClick={handleNext}
        >
          다음으로
        </Button>
      </footer>
    </div>
  )
}
