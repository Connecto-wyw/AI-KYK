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

const BIRTH_YEARS = Array.from({ length: 9 }, (_, i) => String(2016 + i)) // 2016~2024 (2~10세)

const REGIONS = [
  '서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종',
  '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
]

const CONCERNS = [
  '말이 늦거나 표현이 부족해요',
  '감정 조절이 어렵고 떼를 써요',
  '밥을 잘 안 먹거나 편식이 심해요',
  '낯가림이 심하거나 새 환경에 적응을 못해요',
  '또래 친구와 잘 어울리지 못해요',
  '집중력이 짧고 산만한 편이에요',
  '잠들기가 어렵거나 수면 문제가 있어요',
  '형제자매 혹은 다른 아이와 자주 싸워요',
  '새로운 것에 도전하길 두려워해요',
  '한글·숫자 등 학습에 흥미가 없어요',
]

export default function Step3Page() {
  const router = useRouter()
  const { step3Answers, setStep3 } = useKYKStore()
  const { language } = useLanguageStore()
  const dict = dictionaries[language]

  const [birthYear, setBirthYear] = useState('')
  const [gender, setGender] = useState('')
  const [region, setRegion] = useState('')
  const [concerns, setConcerns] = useState<string[]>([])
  const [customConcern, setCustomConcern] = useState('')

  useEffect(() => {
    if (step3Answers?.birthYear) setBirthYear(step3Answers.birthYear)
    if (step3Answers?.gender) setGender(step3Answers.gender)
    if (step3Answers?.region) setRegion(step3Answers.region)
    if (step3Answers?.concern) {
      if (step3Answers.concern.includes('특별한 고민은 없어요')) {
        setConcerns(['특별한 고민은 없어요'])
      } else {
        const parts = step3Answers.concern.split(',').map(s => s.trim())
        const standard = parts.filter(p => CONCERNS.includes(p))
        const custom = parts.filter(p => !CONCERNS.includes(p))
        setConcerns(standard)
        if (custom.length) setCustomConcern(custom.join(', '))
      }
    }
  }, [step3Answers])

  const toggleConcern = (c: string) => {
    if (c === '특별한 고민은 없어요') {
      setConcerns(['특별한 고민은 없어요'])
      setCustomConcern('')
      return
    }
    
    setConcerns(prev => {
      const withoutNoConcern = prev.filter(x => x !== '특별한 고민은 없어요')
      if (withoutNoConcern.includes(c)) return withoutNoConcern.filter(x => x !== c)
      if (withoutNoConcern.length >= 3) return withoutNoConcern
      return [...withoutNoConcern, c]
    })
  }

  const isComplete = !!birthYear && !!gender && !!region && (concerns.length > 0 || customConcern.trim().length > 0)

  const handleNext = () => {
    if (isComplete) {
      const finalConcerns = [...concerns]
      if (customConcern.trim()) {
        finalConcerns.push(customConcern.trim())
      }
      setStep3({ birthYear, gender, region, concern: finalConcerns.join(', ') })
      router.push('/kyk/step4')
    }
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-white w-full max-w-md lg:max-w-2xl mx-auto relative lg:transform lg:translate-x-0">
      <header className="sticky top-0 z-10 flex items-center bg-white px-4 lg:px-8 h-14 lg:h-16">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <Image src="/symbol.png" alt="KYK" width={24} height={24} className="ml-1 object-contain opacity-80" />
        <div className="flex-1 px-3">
          <Progress value={75} className="h-2" />
        </div>
        <div className="w-8 text-xs text-right font-medium text-slate-400">3/4</div>
      </header>

      <main className="flex-1 px-6 lg:px-12 py-8 pb-36">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2 leading-snug whitespace-pre-line">
          {dict.step3Title}
        </h1>
        <p className="text-slate-500 mb-8 text-sm lg:text-base">
          {dict.step3Subtitle}
        </p>

        {/* 출생년도 */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">{dict.step3BirthYear}</h2>
          <div className="flex flex-wrap gap-2">
            {BIRTH_YEARS.map((year) => (
              <button
                key={year}
                onClick={() => setBirthYear(year)}
                className={cn(
                  "px-4 py-2.5 rounded-full text-sm font-medium border-2 transition-all duration-200",
                  birthYear === year
                    ? "border-brand-red1 bg-brand-red1/5 text-brand-red1 font-bold"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                )}
              >
                {year}{dict.step3YearSuffix}
              </button>
            ))}
          </div>
        </section>

        {/* 성별 */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">{dict.step3Gender}</h2>
          <div className="flex gap-3">
            {['남아', '여아'].map((g, idx) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={cn(
                  "flex-1 py-3.5 rounded-2xl text-base font-semibold border-2 transition-all duration-200",
                  gender === g
                    ? "border-brand-red1 bg-brand-red1/5 text-brand-red1"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                )}
              >
                {idx === 0 ? dict.step3Boy : dict.step3Girl}
              </button>
            ))}
          </div>
        </section>

        {/* 지역 */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">{dict.step3Region}</h2>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r, idx) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={cn(
                  "px-4 py-2.5 rounded-full text-sm font-medium border-2 transition-all duration-200",
                  region === r
                    ? "border-brand-red1 bg-brand-red1/5 text-brand-red1 font-bold"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                )}
              >
                {dict.step3RegionList[idx]}
              </button>
            ))}
          </div>
        </section>

        {/* 고민 */}
        <section className="mb-4">
          <div className="flex justify-between items-end mb-3">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{dict.step3ConcernTitle}</h2>
            <span className="text-xs text-brand-red1 font-medium bg-brand-red1/5 px-2 py-0.5 rounded-full">{dict.step3ConcernMax}</span>
          </div>
          <div className="space-y-2.5">
            {CONCERNS.map((c, idx) => (
              <button
                key={c}
                onClick={() => toggleConcern(c)}
                className={cn(
                  "w-full text-left px-5 py-4 rounded-2xl border-2 text-[15px] font-medium transition-all duration-200",
                  concerns.includes(c)
                    ? "border-brand-red1 bg-brand-red1/5 text-brand-red1"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                )}
              >
                {dict.step3ConcernList[idx]}
              </button>
            ))}

            {/* Custom Concern Input */}
            <div className={cn(
               "w-full p-4 rounded-2xl border-2 transition-all duration-200 bg-white",
               customConcern.length > 0 ? "border-brand-red1" : "border-slate-200 hover:border-slate-300"
            )}>
              <div className="text-[15px] font-medium text-slate-700 mb-2">{dict.step3CustomTitle}</div>
              <input 
                type="text" 
                placeholder={dict.step3CustomPlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red1/20 focus:border-brand-red1 transition-all"
                value={customConcern}
                onChange={(e) => {
                  setCustomConcern(e.target.value)
                  if (concerns.includes('특별한 고민은 없어요')) {
                    setConcerns(prev => prev.filter(x => x !== '특별한 고민은 없어요'))
                  }
                }}
              />
            </div>

            <button
              onClick={() => toggleConcern('특별한 고민은 없어요')}
              className={cn(
                "w-full text-left px-5 py-4 rounded-2xl border-2 text-[15px] font-medium transition-all duration-200",
                concerns.includes('특별한 고민은 없어요')
                  ? "border-brand-red1 bg-brand-red1/5 text-brand-red1"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              )}
            >
              {dict.step3NoConcern}
            </button>
          </div>
        </section>
      </main>

      <footer className="fixed lg:absolute bottom-0 left-0 right-0 mx-auto w-full max-w-md lg:max-w-none bg-white p-4 lg:px-12 pb-8 z-10 border-t border-slate-50 lg:border-t-0">
        <Button
          size="lg"
          className="w-full h-14 text-lg rounded-2xl transition-all bg-brand-red1 hover:bg-brand-red2 text-white"
          disabled={!isComplete}
          onClick={handleNext}
        >
          {dict.step3Next || "다음"}
        </Button>
      </footer>
    </div>
  )
}
