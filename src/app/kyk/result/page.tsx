import { Sparkles, CheckCircle2, AlertCircle, HeartHandshake } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { KID_PROFILES, KidType, MBTI_TO_TCI } from '@/lib/kyk/scoring'
import { CoachChat } from '@/components/AI/CoachChat'

const TCI_DIMENSION_LABELS: Record<string, string> = {
  NS: '새로움추구',
  HA: '위해회피',
  RD: '보상의존',
  PS: '지속성',
  SD: '자기지향성',
  CO: '협동성',
  ST: '자기초월성',
}

const TCI_DIMENSION_COLORS: Record<string, string> = {
  NS: 'bg-brand-orange',
  HA: 'bg-brand-navy',
  RD: 'bg-brand-pink',
  PS: 'bg-brand-yellowgreen',
  SD: 'bg-brand-dustypurple',
  CO: 'bg-brand-forestgreen',
  ST: 'bg-brand-lightblue',
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ResultPage({ searchParams }: { searchParams: Promise<{ kid?: string }> }) {
  const { kid } = await searchParams
  const supabase = await createClient()

  if (!kid) {
    redirect('/kyk/gate')
  }

  const { data: kidData } = await supabase
    .from('kids')
    .select('*')
    .eq('id', kid)
    .single()

  if (!kidData) {
    redirect('/kyk/gate')
  }

  const resultType = kidData.kyk_result_type as KidType
  const profile = KID_PROFILES[resultType]
  const tciScores = MBTI_TO_TCI[resultType]

  if (!profile) return null

  return (
    <div className="min-h-[100dvh] bg-white">

      <div className="max-w-5xl mx-auto lg:flex lg:gap-8 lg:px-8 lg:pt-8 lg:pb-12">

        {/* ── Left: Analysis Cards ── */}
        <div className="flex-1 flex flex-col">

          {/* Hero */}
          <div className="bg-brand-red2 text-brand-white pt-12 pb-20 px-6 lg:px-10 rounded-b-[40px] lg:rounded-[40px] relative overflow-hidden shadow-xl">
            <div className="absolute top-8 right-8 opacity-15 text-brand-yellow">
              <Sparkles size={100} />
            </div>
            <p className="text-brand-white/70 text-sm font-medium mb-2 tracking-wide uppercase">KYK 분석 결과</p>
            <h1 className="text-3xl lg:text-4xl font-extrabold mb-3 leading-tight">
              우리 아이는<br/>
              <span className="text-brand-yellow">{profile.title}</span> 유형!
            </h1>
            <p className="text-brand-white/85 text-[15px] lg:text-base leading-relaxed max-w-[88%]">
              {profile.summary}
            </p>
          </div>

          {/* Cards */}
          <div className="px-5 lg:px-0 -mt-10 relative z-10 space-y-4 pb-8">

            {/* Strengths */}
            <Card className="p-6 border-0 shadow-md bg-white rounded-3xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-brand-forestgreen/10 flex items-center justify-center text-brand-forestgreen">
                  <CheckCircle2 size={17} />
                </div>
                <h3 className="font-bold text-[17px] text-slate-800">빛나는 강점</h3>
              </div>
              <ul className="space-y-2.5 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
                {profile.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2.5 text-slate-600 text-[14px] leading-relaxed">
                    <span className="text-brand-forestgreen font-black shrink-0 mt-0.5">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Care Points */}
            <Card className="p-6 border-0 shadow-md bg-white rounded-3xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                  <AlertCircle size={17} />
                </div>
                <h3 className="font-bold text-[17px] text-slate-800">주의 / 성장 특성</h3>
              </div>
              <ul className="space-y-2.5">
                {profile.carePoints.map((s, i) => (
                  <li key={i} className="flex gap-2.5 text-slate-600 text-[14px] leading-relaxed">
                    <span className="text-brand-orange font-black shrink-0 mt-0.5">!</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Approaches */}
            <Card className="p-6 border-0 shadow-md bg-white rounded-3xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-brand-lightblue/10 flex items-center justify-center text-brand-lightblue">
                  <HeartHandshake size={17} />
                </div>
                <h3 className="font-bold text-[17px] text-slate-800">추천 양육 가이드</h3>
              </div>
              <ul className="space-y-2.5">
                {profile.approaches.map((s, i) => (
                  <li key={i} className="flex gap-2.5 text-slate-600 text-[14px] leading-relaxed">
                    <span className="text-brand-lightblue font-black shrink-0 mt-0.5">→</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Card>

            {/* TCI Chart */}
            {tciScores && (
              <Card className="p-6 border-0 shadow-md bg-white rounded-3xl">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-full bg-brand-red1/10 flex items-center justify-center text-brand-red1">
                    <Sparkles size={16} />
                  </div>
                  <h3 className="font-bold text-[17px] text-slate-800">타고난 기질 (TCI)</h3>
                </div>
                <div className="space-y-3.5">
                  {Object.entries(tciScores).map(([key, score]) => (
                    <div key={key} className="flex items-center gap-3">
                      <div className="w-[108px] shrink-0 text-sm font-medium text-slate-600">
                        {TCI_DIMENSION_LABELS[key]}
                      </div>
                      <div className="flex-1 flex gap-1 h-2.5">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`flex-1 rounded-full transition-all ${level <= score ? TCI_DIMENSION_COLORS[key] : 'bg-slate-100'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-400 w-4 text-right">{score}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Mobile: AI Chat inline */}
            <div className="lg:hidden">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 px-1">AI 코치에게 물어보기</p>
              <CoachChat profile={profile} concern={kidData.main_concern || "양육 고민"} kidId={kid} />
            </div>

          </div>
        </div>

        {/* ── Right: AI Coach Sticky (PC only) ── */}
        <div className="hidden lg:flex lg:flex-col w-[380px] shrink-0">
          <div className="sticky top-8">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">AI 코치에게 물어보기</p>
            <CoachChat profile={profile} concern={kidData.main_concern || "양육 고민"} kidId={kid} />
          </div>
        </div>

      </div>
    </div>
  )
}
