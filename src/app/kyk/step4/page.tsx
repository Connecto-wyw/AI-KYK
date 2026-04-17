'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useKYKStore } from '@/store/useKYKStore'
import { useLanguageStore } from '@/store/useLanguageStore'
import { dictionaries } from '@/lib/i18n/dictionaries'
import { cn } from '@/lib/utils'

export default function Step4Page() {
  const router = useRouter()
  const { step4Answers, setStep4 } = useKYKStore()
  const { language } = useLanguageStore()
  const dict = dictionaries[language]

  const [parentValues, setParentValues] = useState<string[]>([])
  const [childLevels, setChildLevels] = useState<Record<string, number>>({})
  const [parentStyle, setParentStyle] = useState<string>('')

  useEffect(() => {
    if (step4Answers?.parentValues) setParentValues(step4Answers.parentValues)
    if (step4Answers?.childLevels) setChildLevels(step4Answers.childLevels)
    if (step4Answers?.parentStyle) setParentStyle(step4Answers.parentStyle)
  }, [step4Answers])

  const toggleParentValue = (val: string) => {
    setParentValues(prev => {
      if (prev.includes(val)) return prev.filter(x => x !== val)
      if (prev.length >= 2) return prev
      return [...prev, val]
    })
  }

  const setLevel = (subjectId: string, levelIndex: number) => {
    setChildLevels(prev => ({ ...prev, [subjectId]: levelIndex }))
  }

  const isLevelComplete = dict.step4Q2Subjects?.every((subj: any) => childLevels[subj.id] !== undefined)
  const isComplete = parentValues.length > 0 && isLevelComplete && !!parentStyle

  const handleNext = () => {
    if (isComplete) {
      setStep4({ parentValues, childLevels, parentStyle })
      router.push('/kyk/saving')
    }
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-white w-full max-w-md lg:max-w-2xl mx-auto relative lg:transform lg:translate-x-0">
      <header className="sticky top-0 z-10 flex items-center bg-white px-4 lg:px-8 h-14 lg:h-16 shadow-sm shadow-slate-100/50">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <Image src="/symbol.png" alt="KYK" width={24} height={24} className="ml-1 object-contain opacity-80" />
        <div className="flex-1 px-3">
          <Progress value={100} className="h-2" />
        </div>
        <div className="w-8 text-xs text-right font-medium text-slate-400">4/4</div>
      </header>

      <main className="flex-1 px-5 lg:px-12 py-8 pb-36 space-y-10">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2 leading-snug whitespace-pre-line">
            {dict.step4Title}
          </h1>
          <p className="text-slate-500 text-sm lg:text-base">
            {dict.step4Subtitle}
          </p>
        </div>

        {/* Q1. Parent Values */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-base font-bold text-slate-800">{dict.step4Q1Title}</h2>
            <span className="text-xs text-brand-red1 font-bold bg-brand-red1/5 px-2.5 py-1 rounded-full whitespace-nowrap ml-2">
              {dict.step4Q1Max}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {dict.step4Q1Options?.map((opt: any) => {
              const isSelected = parentValues.includes(opt.id)
              const isDisabled = !isSelected && parentValues.length >= 2
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleParentValue(opt.id)}
                  disabled={isDisabled}
                  className={cn(
                    "text-left p-4 rounded-xl border-2 transition-all duration-200 flex flex-col",
                    isSelected
                      ? "border-brand-red1 bg-brand-red1/5 shadow-sm"
                      : "border-slate-100 bg-white hover:border-slate-200",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span className={cn("font-bold text-[15px] mb-1", isSelected ? "text-brand-red1" : "text-slate-800")}>{opt.p1}</span>
                  <span className="text-sm text-slate-500">{opt.p2}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Q2. Child Levels */}
        <section>
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-800 leading-tight">{dict.step4Q2Title}</h2>
          </div>
          <div className="space-y-6 bg-slate-50 border border-slate-100 p-5 rounded-2xl">
            {dict.step4Q2Subjects?.map((subj: any) => (
              <div key={subj.id} className="space-y-3">
                <h3 className="text-[15px] font-bold text-slate-700">{subj.name}</h3>
                <div className="flex flex-col gap-2">
                  {subj.levels.map((lvl: string, idx: number) => {
                    const isSelected = childLevels[subj.id] === idx
                    return (
                      <button
                        key={idx}
                        onClick={() => setLevel(subj.id, idx)}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border",
                          isSelected
                            ? "bg-white border-brand-red1 text-brand-red1 shadow-sm ring-1 ring-brand-red1/20"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                        )}
                      >
                        {lvl}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Q3. Parent Style */}
        <section>
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-800">{dict.step4Q3Title}</h2>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {dict.step4Q3Options?.map((opt: any) => {
              const isSelected = parentStyle === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => setParentStyle(opt.id)}
                  className={cn(
                    "text-left p-4 rounded-xl border-2 transition-all duration-200 flex flex-col",
                    isSelected
                      ? "border-brand-red1 bg-brand-red1/5 shadow-sm"
                      : "border-slate-100 bg-white hover:border-slate-200"
                  )}
                >
                  <span className={cn("font-bold text-[15px] mb-1", isSelected ? "text-brand-red1" : "text-slate-800")}>{opt.p1}</span>
                  <span className="text-sm text-slate-500">{opt.p2}</span>
                </button>
              )
            })}
          </div>
        </section>

      </main>

      <footer className="fixed lg:absolute bottom-0 left-0 right-0 mx-auto w-full max-w-md lg:max-w-none bg-gradient-to-t from-white via-white to-transparent pt-12 p-4 lg:px-12 pb-8 z-10 border-t-0 lg:border-t lg:border-slate-50 lg:bg-white lg:pt-4">
        <Button
          size="lg"
          className="w-full h-14 text-lg rounded-2xl transition-all bg-brand-red1 hover:bg-brand-red2 text-white shadow-lg shadow-brand-red1/20"
          disabled={!isComplete}
          onClick={handleNext}
        >
          {dict.step4Submit || "결과 확인하기"}
        </Button>
      </footer>
    </div>
  )
}
