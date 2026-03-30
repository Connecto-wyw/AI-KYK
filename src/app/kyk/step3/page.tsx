'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useKYKStore } from '@/store/useKYKStore'
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
  '특별한 고민은 없어요',
]

export default function Step3Page() {
  const router = useRouter()
  const { step3Answers, setStep3 } = useKYKStore()

  const [birthYear, setBirthYear] = useState('')
  const [gender, setGender] = useState('')
  const [region, setRegion] = useState('')
  const [concern, setConcern] = useState('')

  useEffect(() => {
    if (step3Answers?.birthYear) setBirthYear(step3Answers.birthYear)
    if (step3Answers?.gender) setGender(step3Answers.gender)
    if (step3Answers?.region) setRegion(step3Answers.region)
    if (step3Answers?.concern) setConcern(step3Answers.concern)
  }, [step3Answers])

  const isComplete = !!birthYear && !!gender && !!region && !!concern

  const handleNext = () => {
    if (isComplete) {
      setStep3({ birthYear, gender, region, concern })
      router.push('/kyk/saving')
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
          <Progress value={100} className="h-2" />
        </div>
        <div className="w-8 text-xs text-right font-medium text-slate-400">4/4</div>
      </header>

      <main className="flex-1 px-6 lg:px-12 py-8 pb-36">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2 leading-snug">
          아이에 대해<br/>조금 더 알려주세요
        </h1>
        <p className="text-slate-500 mb-8 text-sm lg:text-base">
          더 정확한 분석을 위해 필요해요.
        </p>

        {/* 출생년도 */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">아이 출생년도</h2>
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
                {year}년
              </button>
            ))}
          </div>
        </section>

        {/* 성별 */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">성별</h2>
          <div className="flex gap-3">
            {['남아', '여아'].map((g) => (
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
                {g}
              </button>
            ))}
          </div>
        </section>

        {/* 지역 */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">현재 사는 지역</h2>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r) => (
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
                {r}
              </button>
            ))}
          </div>
        </section>

        {/* 고민 */}
        <section className="mb-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">요즘 가장 걱정되는 부분</h2>
          <div className="space-y-2.5">
            {CONCERNS.map((c) => (
              <button
                key={c}
                onClick={() => setConcern(c)}
                className={cn(
                  "w-full text-left px-5 py-4 rounded-2xl border-2 text-[15px] font-medium transition-all duration-200",
                  concern === c
                    ? "border-brand-red1 bg-brand-red1/5 text-brand-red1"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                )}
              >
                {c}
              </button>
            ))}
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
          결과 확인하기
        </Button>
      </footer>
    </div>
  )
}
