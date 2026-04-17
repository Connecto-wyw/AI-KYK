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
import { PaywallOverlay } from '@/components/payment/PaywallOverlay'

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

  // "Result-Lite" Security: 
  const isUnlocked = resultData.is_unlocked === true
  
  // Protect data from DOM inspection if locked
  const safeCarePoints = isUnlocked ? profile.carePoints : ['이 부분은 잠금 해제 후 확인할 수 있습니다.', '이 부분은 잠금 해제 후 확인할 수 있습니다.']
  const safeApproaches = isUnlocked ? profile.approaches : ['이 부분은 잠금 해제 후 확인할 수 있습니다.', '이 부분은 잠금 해제 후 확인할 수 있습니다.']
  const premiumData = resultData.premium_data || null

  return (
    <div className="min-h-[100dvh] bg-white text-slate-800">
      {!isUnlocked && (
        <PaywallOverlay kidId={resultData.id} />
      )}

      <div className={`max-w-5xl mx-auto lg:flex lg:gap-8 lg:px-8 lg:pt-8 lg:pb-12 ${!isUnlocked ? "blur-xl pointer-events-none select-none opacity-40 h-[100vh] overflow-hidden" : ""}`}>

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


                {/* Premium AI Deep Dive */}
                <div className="mt-8 mb-6 ml-2">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-2xl">👑</span> 프리미엄 심층 진단
                  </h2>
                  <p className="text-[13px] text-slate-500 font-medium">작성하신 부모 성향과 아이 발달 상황을 분석한 리포트입니다.</p>
                </div>

                <div className="space-y-4">
                  {/* Gap Analysis */}
                  <Card className="p-6 border-0 shadow-md bg-white rounded-3xl">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <Sparkles size={16} />
                      </div>
                      <h3 className="font-bold text-[17px]">현재 양육 격차 진단</h3>
                    </div>
                    <p className="text-[14.5px] leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-2xl">
                      {isUnlocked && premiumData?.gap_analysis ? premiumData.gap_analysis : "이곳에 부모님의 기대치와 아이의 실제 발달 상황의 격차를 분석한 심층 진단 내용이 자세하게 표기됩니다. 아주 상세하고 객관적인 AI 맞춤 진단입니다."}
                    </p>
                  </Card>

                  {/* Risk Signals */}
                  <Card className="p-6 border border-brand-red1/20 shadow-md bg-red-50/30 rounded-3xl">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-brand-red1/10 flex items-center justify-center text-brand-red1">
                        <AlertCircle size={17} />
                      </div>
                      <h3 className="font-bold text-[17px] text-brand-red1">주의해야 할 위험 신호</h3>
                    </div>
                    <ul className="space-y-3">
                      {(isUnlocked && premiumData?.risk_signals ? premiumData.risk_signals : ["아이의 에너지 부조화 위험", "양육 방향에 대한 잠재적 불일치"]).map((s: string, i: number) => (
                        <li key={i} className="flex gap-3 text-slate-700 text-[14.5px] leading-relaxed font-medium">
                          <span className="text-brand-red1 font-black shrink-0 mt-0.5">!</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </Card>

                  {/* Action Strategies */}
                  <Card className="p-6 border-0 shadow-md bg-brand-navy text-white rounded-3xl">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-brand-yellow">
                        <HeartHandshake size={17} />
                      </div>
                      <h3 className="font-bold text-[17px] text-white">즉각 실행! 추천 방안 3가지</h3>
                    </div>
                    <ul className="space-y-4">
                      {(isUnlocked && premiumData?.action_strategies ? premiumData.action_strategies : ["아이의 속도에 맞춘 환경 재구성", "긍정 피드백 체계 수립하기", "구체적인 루틴 가이드 작성"]).map((s: string, i: number) => (
                        <li key={i} className="flex gap-3 text-white/90 text-[14.5px] leading-relaxed">
                          <span className="bg-white/20 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shrink-0 mt-0.5 font-bold">{i+1}</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>

                <div className="mt-10 mb-6 ml-2">
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight">상세 프로필</h2>
                </div>

                {/* Care Points */}
                <Card className="p-6 border-0 shadow-md bg-white rounded-3xl mb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                      <AlertCircle size={17} />
                    </div>
                    <h3 className="font-bold text-[17px] text-slate-800">성장 특성 상세</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {safeCarePoints.map((s, i) => (
                      <li key={i} className="flex gap-2.5 text-slate-600 text-[14px] leading-relaxed">
                        <span className="text-brand-orange font-black shrink-0 mt-0.5">!</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Approaches */}
                <Card className="p-6 border-0 shadow-md bg-white rounded-3xl mb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-brand-lightblue/10 flex items-center justify-center text-brand-lightblue">
                      <HeartHandshake size={17} />
                    </div>
                    <h3 className="font-bold text-[17px] text-slate-800">기질 맞춤 가이드</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {safeApproaches.map((s, i) => (
                      <li key={i} className="flex gap-2.5 text-slate-600 text-[14px] leading-relaxed">
                        <span className="text-brand-lightblue font-black shrink-0 mt-0.5">→</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* TCI Chart */}
                {tciData.length > 0 && (
                  <Card className="p-6 border-0 shadow-md bg-white rounded-3xl overflow-hidden mb-4">
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
            {isUnlocked && (
              <div className="lg:hidden mt-8">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 px-1">AI 코치에게 물어보기</p>
                <CoachChat profile={profile} concern={resultData.concern || '양육 고민'} kidId={resultData.id} />
              </div>
            )}

          </div>
        </div>

        {/* ── Right: AI Coach Sticky (PC only) ── */}
        {isUnlocked && (
          <div className="hidden lg:flex lg:flex-col w-[380px] shrink-0">
            <div className="sticky top-8">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">AI 코치에게 물어보기</p>
              <CoachChat profile={profile} concern={resultData.concern || '양육 고민'} kidId={resultData.id} />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
