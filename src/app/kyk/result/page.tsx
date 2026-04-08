import { Sparkles, CheckCircle2, AlertCircle, HeartHandshake } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { KID_PROFILES, KidType, MBTI_TO_TCI } from '@/lib/kyk/scoring'
import { CoachChat } from '@/components/AI/CoachChat'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getLocalizedProfiles } from '@/lib/kyk/scoring-i18n'
import { TCIRadarChart } from '@/components/ui/TCIRadarChart'
import { ResultCaptureCard } from '@/components/ui/ResultCaptureCard'

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

export default async function ResultPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/kyk/gate')
  }

  const cookieStore = await cookies()
  const lang = cookieStore.get('kyk-lang')?.value || 'en'
  const localizedProfiles = getLocalizedProfiles(lang)

  const { data: resultData } = await supabase
    .from('kyk_results')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!resultData) {
    redirect('/kyk/step1')
  }

  const resultType = resultData.result_type as KidType
  const profile = localizedProfiles[resultType]
  const tciScores = MBTI_TO_TCI[resultType]

  if (!profile) redirect('/kyk/step1')

  const tciData = tciScores ? Object.entries(tciScores).map(([key, score]) => ({
    subject: TCI_DIMENSION_LABELS[key],
    score: score,
    fullMark: 4
  })) : []

  return (
    <div className="min-h-[100dvh] bg-white">
      <div className="max-w-5xl mx-auto lg:flex lg:gap-8 lg:px-8 lg:pt-8 lg:pb-12">

        {/* ── Left: Analysis Cards ── */}
        <div className="flex-1 flex flex-col">

          {/* Hero Capture Wrapper */}
          <ResultCaptureCard>
            <div className="bg-brand-red2 text-brand-white pt-12 pb-24 px-6 lg:px-10 rounded-b-[40px] lg:rounded-[40px] relative overflow-hidden shadow-xl h-full">
              <div className="absolute top-8 right-8 opacity-15 text-brand-yellow">
                <Sparkles size={100} />
              </div>
              <p className="text-brand-white/70 text-sm font-medium mb-2 tracking-wide uppercase">KYK 분석 결과</p>
              <h1 className="text-3xl lg:text-4xl font-extrabold mb-3 leading-tight">
                우리 아이는<br/>
                <span className="text-brand-yellow">{profile.title}</span> 유형!
              </h1>
              <p className="text-brand-white/90 text-[14.5px] lg:text-base leading-relaxed max-w-[88%] break-keep">
                {profile.summary}
              </p>
            </div>
          </ResultCaptureCard>

          {/* Cards */}
          <div className="px-5 lg:px-0 -mt-2 relative z-10 space-y-4 pb-8">

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
            {tciData.length > 0 && (
              <Card className="p-6 border-0 shadow-md bg-white rounded-3xl overflow-hidden">
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-brand-red1/10 flex items-center justify-center text-brand-red1">
                    <Sparkles size={16} />
                  </div>
                  <h3 className="font-bold text-[17px] text-slate-800">타고난 성향 (TCI)</h3>
                </div>
                <div className="-mx-4 -mt-2 mb-[-24px] relative z-0">
                   <TCIRadarChart data={tciData} />
                </div>
              </Card>
            )}

            {/* Mobile: AI Chat inline */}
            <div className="lg:hidden">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 px-1">AI 코치에게 물어보기</p>
              <CoachChat profile={profile} concern={resultData.concern || '양육 고민'} kidId={resultData.id} />
            </div>

          </div>
        </div>

        {/* ── Right: AI Coach Sticky (PC only) ── */}
        <div className="hidden lg:flex lg:flex-col w-[380px] shrink-0">
          <div className="sticky top-8">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">AI 코치에게 물어보기</p>
            <CoachChat profile={profile} concern={resultData.concern || '양육 고민'} kidId={resultData.id} />
          </div>
        </div>

      </div>
    </div>
  )
}
