'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useKYKStore } from '@/store/useKYKStore'
import { cn } from '@/lib/utils'
import { useLanguageStore } from '@/store/useLanguageStore'
import { dictionaries } from '@/lib/i18n/dictionaries'

export default function Step1Page() {
  const router = useRouter()
  const { step1Answers, setStep1 } = useKYKStore()
  const { language } = useLanguageStore()
  const dict = dictionaries[language]
  const KOR_ADJECTIVES = dictionaries['ko'].step1Adjectives
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    if (step1Answers.length > 0) {
      setSelected(step1Answers)
    }
  }, [step1Answers])

  const toggleAdjective = (korWord: string) => {
    setSelected((prev: string[]) => {
      if (prev.includes(korWord)) return prev.filter((w: string) => w !== korWord)
      if (prev.length >= 5) return prev
      return [...prev, korWord]
    })
  }

  const handleNext = () => {
    if (selected.length === 5) {
      setStep1(selected)
      router.push('/kyk/step2')
    }
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-white w-full max-w-md lg:max-w-2xl mx-auto relative lg:transform lg:translate-x-0">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center bg-brand-white lg:bg-white px-4 lg:px-8 h-14 lg:h-16">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <Image src="/symbol.png" alt="KYK" width={24} height={24} className="ml-1 object-contain opacity-80" />
        <div className="flex-1 px-3">
          <Progress value={33} className="h-2" />
        </div>
        <div className="w-8 text-xs text-right font-medium text-slate-400">{dict.step1Steps}</div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 lg:px-12 py-8 pb-32">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2 whitespace-pre-wrap">
          {dict.step1Title}
        </h1>
        <p className="text-slate-500 mb-8 text-sm lg:text-base">
          {dict.step1Subtitle}
        </p>

        <div className="flex flex-wrap gap-3 lg:gap-4">
          {dict.step1Adjectives.map((word, index) => {
            const korWord = KOR_ADJECTIVES[index]
            const isSelected = selected.includes(korWord)
            const isMaxReached = selected.length >= 5 && !isSelected
            return (
              <button
                key={korWord}
                onClick={() => toggleAdjective(korWord)}
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
      <footer className="fixed lg:absolute bottom-0 left-0 right-0 mx-auto w-full max-w-md lg:max-w-none bg-white p-4 lg:px-12 pb-8 z-10 border-t border-slate-50 lg:border-t-0">
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-sm font-medium text-slate-500">{dict.step1Count}</span>
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
          {dict.step1Next}
        </Button>
      </footer>
    </div>
  )
}
