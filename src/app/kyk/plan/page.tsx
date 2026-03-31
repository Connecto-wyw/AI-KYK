import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, CheckCircle2, MessageCircle, Lock, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { KID_PROFILES, KidType } from '@/lib/kyk/scoring'
import { Card } from '@/components/ui/card'

export default async function GrowthPlanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/kyk/gate')
  }

  const { data: kidData } = await supabase
    .from('kyk_results')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!kidData) {
    return (
      <div className="flex flex-col h-[100dvh] bg-slate-50 lg:bg-white overflow-hidden relative pb-[80px] lg:pb-8">
        <div className="w-full max-w-2xl mx-auto h-full flex flex-col items-center justify-center p-6 text-center lg:pt-8 lg:px-4">
          <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center border border-slate-100 p-3 mb-4">
            <Image src="/symbol.png" alt="KYK Logo" width={40} height={40} className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">아직 진단 결과가 없어요</h2>
          <p className="text-slate-500 mb-8 break-keep text-[14.5px]">AI 맞춤형 성장 플랜을 받으려면 무료 성향 진단을 먼저 진행해주세요.</p>
          <Link
            href="/kyk/step1"
            className="flex items-center justify-center w-full max-w-sm h-14 bg-brand-red1 hover:bg-brand-red2 text-white font-bold text-[15px] rounded-2xl shadow-md transition-all active:scale-[0.98]"
          >
            성향 진단 시작하기
          </Link>
        </div>
      </div>
    )
  }

  const profile = KID_PROFILES[kidData.result_type as KidType]
  const titleParts = profile.title.split(' ')
  const animalName = titleParts.slice(1).join(' ') || profile.title
  const modifier = titleParts[0] || ''

  const birthYear = kidData.answers?.step3?.birthYear
  const currentYear = new Date().getFullYear()
  const ageString = birthYear ? `${currentYear - parseInt(birthYear) + 1}세` : null
  const gender = kidData.answers?.step3?.gender || ''
  
  // Format top string "9세 · 남아 · 이상적인 나비"
  const demogs = [ageString, gender === '남아' ? '남자아이' : gender === '여아' ? '여자아이' : gender].filter(Boolean)
  const topText = demogs.length > 0 ? `${demogs.join(' · ')} · ${profile.title}` : profile.title

  const concernRaw = kidData.answers?.step3?.concern || ''
  const currentConcern = concernRaw && concernRaw !== '특별한 고민은 없어요'
    ? concernRaw
    : '전반적인 발달 방향'

  const { data: memory } = await supabase
    .from('kid_memories')
    .select('summary_context')
    .eq('kid_id', kidData.id)
    .single()

  const hasMemory = !!memory?.summary_context
  const memorySummary = memory?.summary_context
    || '아직 코치와 나눈 깊은 대화가 없어요. AI 코치에게 아이에 대한 사소한 고민이라도 털어놔 보세요.'

  const todayAction = profile.approaches[0] || '하원 후 스마트폰을 내려놓고 눈을 맞추며 이야기해주세요.'
  const weeklyDo = profile.approaches[1] || '긍정적인 강점을 구체적으로 칭찬하기'
  const weeklyDont = profile.carePoints[0] || '감정이 앞선 상태에서 훈육 피하기'
  
  // Key insight line
  const insightLine = profile.approaches[2] || '지금은 작은 성공 경험을 쌓는 것이 가장 중요한 시기입니다'

  return (
    <div className="flex flex-col min-h-[100dvh] bg-slate-50 lg:bg-white pb-[80px] lg:pb-8 w-full">
      {/* Container matched to Coach (max-w-2xl) */}
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-5 lg:px-4 pt-6 lg:pt-8 space-y-6 lg:space-y-8 flex-1">

        {/* ==============================================
            SECTION 1: Child Status Summary
            ============================================== */}
        <section>
          <Card className="p-6 border-0 shadow-sm bg-white rounded-3xl lg:border lg:border-slate-100 lg:shadow-md overflow-hidden relative">
            {/* Soft background glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-red1/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-[60px] h-[60px] rounded-[20px] bg-brand-red1/5 flex items-center justify-center shrink-0 border border-brand-red1/10 p-2 mb-3">
                <Image src="/symbol.png" alt="Profile" width={32} height={32} className="object-contain" />
              </div>
              
              <h2 className="text-[18px] font-extrabold text-slate-900 tracking-tight leading-snug mb-2">
                {topText}
              </h2>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg mb-4">
                <span className="text-[11px] font-bold text-slate-500">현재 고민</span>
                <span className="text-[13px] font-semibold text-slate-800 break-keep">{currentConcern}</span>
              </div>

              <div className="w-full h-px bg-slate-100 mb-4" />

              <p className="text-[14px] font-bold text-brand-blue leading-snug break-keep px-2">
                "{insightLine}"
              </p>
            </div>
          </Card>
        </section>

        {/* ==============================================
            SECTION 2: Today's Action (Primary Behavior)
            ============================================== */}
        <section>
          <div className="bg-brand-red1 text-white rounded-3xl lg:rounded-[32px] p-6 lg:p-8 shadow-[0_12px_30px_rgba(255,107,92,0.25)] relative overflow-hidden group active:scale-[0.98] transition-transform">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 mb-3 opacity-90">
                <Sparkles className="w-4 h-4 text-brand-yellow" />
                <span className="text-[12px] font-extrabold tracking-widest uppercase">오늘의 액션</span>
              </div>
              
              <p className="text-[18px] font-extrabold leading-snug break-keep drop-shadow-sm flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{todayAction}</span>
              </p>
            </div>
          </div>
        </section>

        {/* ==============================================
            SECTION 3: Weekly Guide (Simplified)
            ============================================== */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
            {/* DO Card */}
            <Card className="p-5 border-0 lg:border lg:border-slate-100 shadow-sm bg-white rounded-3xl flex flex-col h-full">
              <span className="inline-flex items-center w-fit px-2 py-0.5 bg-brand-lightblue/10 text-brand-blue text-[11px] font-extrabold rounded-md mb-3 tracking-wider">
                DO
              </span>
              <p className="text-[14.5px] font-bold text-slate-700 leading-snug break-keep">
                {weeklyDo}
              </p>
            </Card>
            
            {/* DON'T Card */}
            <Card className="p-5 border-0 lg:border lg:border-slate-100 shadow-sm bg-white rounded-3xl flex flex-col h-full">
              <span className="inline-flex items-center w-fit px-2 py-0.5 bg-brand-red1/10 text-brand-red1 text-[11px] font-extrabold rounded-md mb-3 tracking-wider">
                DON'T
              </span>
              <p className="text-[14.5px] font-bold text-slate-700 leading-snug break-keep">
                {weeklyDont}
              </p>
            </Card>
          </div>
        </section>

        {/* ==============================================
            SECTION 4: AI Coach Memory Summary
            ============================================== */}
        <section>
          <Link href="/kyk/coach" className="block">
            <Card className="p-6 border border-brand-lightblue/20 shadow-sm bg-brand-lightblue/5 rounded-3xl hover:bg-brand-lightblue/10 transition-colors active:scale-[0.98]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-brand-blue" />
                  <h3 className="text-[12px] font-extrabold text-brand-blue uppercase tracking-widest">AI 코치의 기억</h3>
                </div>
              </div>
              
              <p className="text-[14px] text-slate-700 leading-relaxed font-medium break-keep mb-4">
                "{memorySummary}"
              </p>
              
              <div className="flex items-center text-[13px] font-bold text-brand-blue">
                {hasMemory ? 'AI 코치 이어서 대화하기' : 'AI 코치에게 고민 털어놓기'} 
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Card>
          </Link>
        </section>

        {/* ==============================================
            SECTION 5: Premium Strategy Trigger
            ============================================== */}
        <section className="pt-2 lg:pt-4">
          <Card className="p-6 lg:p-8 border border-slate-200 bg-white shadow-md rounded-3xl">
            <div className="flex flex-col mb-5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-slate-50 rounded-[14px] flex items-center justify-center shrink-0 text-slate-600 border border-slate-100">
                  <Lock className="w-4 h-4" />
                </div>
              </div>
              
              {/* Problem reinforcement */}
              <p className="text-[14px] font-bold text-slate-500 break-keep mb-1.5">
                혹시 이 상황이 반복되고 있나요?
              </p>
              
              {/* Solution promise */}
              <h3 className="text-[18px] font-extrabold text-slate-900 leading-snug break-keep mb-4">
                현재 고민과 아이 성향을 반영한 100% 맞춤형 대응 전략 가이드
              </h3>

              {/* What's included */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 mb-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
                  <span className="text-[13px] font-semibold text-slate-700 break-keep">상황별 부모 대화 예시 (스크립트)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
                  <span className="text-[13px] font-semibold text-slate-700 break-keep">갈등 상황 원인 분석 및 대처법</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
                  <span className="text-[13px] font-semibold text-slate-700 break-keep">초개인화 4주 실행 플랜</span>
                </div>
              </div>
            </div>

            <button className="w-full h-[56px] bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[15.5px] rounded-2xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              지금 해결 방법 확인하기
            </button>
          </Card>
        </section>

      </div>
    </div>
  )
}
