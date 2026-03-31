import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sparkles, AlertTriangle, MessageCircle, CalendarDays, Key, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default async function PremiumReportPage({ params }: { params: { id: string } }) {
  // TODO: Check auth and payment status here
  
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('kyk_results')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !data || !data.full_report_json) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-brand-white p-8 text-center text-slate-500">
        리포트를 찾을 수 없거나 아직 생성되지 않았습니다.<br/>
        결제가 제대로 완료되었는지 확인해주세요.
      </div>
    )
  }

  const report = data.full_report_json

  return (
    <div className="min-h-[100dvh] bg-brand-white text-brand-black pb-24">
      {/* Premium Header */}
      <div className="bg-brand-red2 text-white pt-16 pb-20 px-6 text-center rounded-b-[40px] shadow-xl relative overflow-hidden">
        <div className="absolute top-10 right-10 opacity-20 text-brand-yellow">
          <Sparkles size={120} />
        </div>
        <div className="inline-flex items-center justify-center bg-brand-yellow/20 text-brand-yellow px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-brand-yellow/30">
          <Key size={16} className="mr-2" />
          VVIP 프리미엄 리포트 언락 방
        </div>
        <h1 className="text-3xl lg:text-5xl font-black mb-4 tracking-tight leading-snug">
          우리아이 {data.result_type}<br/>맞춤형 4주 솔루션
        </h1>
        <p className="text-brand-white/80 max-w-md mx-auto text-sm lg:text-base font-medium">
          부모님께서 가장 고민하시는 "{data.concern}" 영역을 중점적으로 분석했습니다.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-5 lg:px-0 -mt-10 relative z-10 space-y-8">
        
        {/* 1. Deep Analysis */}
        <Card className="p-8 border-2 border-brand-red1/20 shadow-2xl bg-white rounded-3xl">
          <h2 className="text-2xl font-bold text-brand-red1 mb-4 flex items-center gap-2 tracking-tight">
            <Sparkles /> 심층 성향 분석
          </h2>
          <p className="text-slate-700 text-[15px] lg:text-lg leading-relaxed break-keep font-medium">
            {report.deepAnalysis}
          </p>
        </Card>

        {/* 2. Risk Scenarios */}
        <Card className="p-8 border-0 shadow-lg bg-brand-red1/5 rounded-3xl">
          <h2 className="text-xl font-bold text-brand-red2 mb-6 flex items-center gap-2 tracking-tight">
            <AlertTriangle /> 반드시 피해야 할 마찰 시나리오 TOP 3
          </h2>
          <ul className="space-y-4">
            {report.riskScenarios.map((risk: string, i: number) => (
              <li key={i} className="flex gap-4 bg-white p-4 lg:p-5 rounded-2xl shadow-sm border border-brand-red1/10 items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-brand-red2 text-white rounded-full flex items-center justify-center font-bold text-sm">{i+1}</span>
                <p className="text-slate-700 font-medium pt-1 text-[15px] leading-snug break-keep">{risk}</p>
              </li>
            ))}
          </ul>
        </Card>

        {/* 3. Situation Responses */}
        <div className="space-y-6 pt-4">
          <h2 className="text-2xl font-bold text-slate-800 ml-2 tracking-tight">상황별 100점짜리 부모 대처법</h2>
          {report.situationResponses.map((sr: any, i: number) => (
            <Card key={i} className="p-6 lg:p-8 border-l-4 border-l-brand-red1 shadow-md bg-white rounded-2xl">
              <div className="mb-3 text-brand-red2 font-bold text-sm tracking-wide">직면할 수 있는 상황 {i+1}</div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-4 break-keep leading-snug">{sr.situation}</h3>
              <div className="bg-brand-yellow/15 p-5 rounded-xl text-slate-800 border border-brand-yellow/30">
                <p className="flex items-start gap-3 font-medium leading-relaxed break-keep text-[15px]">
                  <CheckCircle2 className="text-brand-orange shrink-0 mt-0.5" size={20} />
                  {sr.response}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* 4. Magic Sentences */}
        <Card className="p-8 border-0 shadow-[0_10px_40px_rgba(250,180,30,0.15)] bg-gradient-to-b from-brand-yellow/20 to-brand-yellow/5 rounded-3xl mt-12">
          <h2 className="text-xl font-bold text-brand-orange mb-6 flex items-center gap-2 tracking-tight justify-center">
            <MessageCircle /> 당장 써먹는 마법의 대화 주문 5가지
          </h2>
          <div className="flex flex-col gap-3">
            {report.exactSentences.map((sentence: string, i: number) => (
              <div key={i} className="bg-white px-5 py-4 lg:py-5 rounded-2xl shadow-sm border border-brand-yellow/40 text-slate-800 font-bold text-[16px] lg:text-lg text-center break-keep">
                "{sentence}"
              </div>
            ))}
          </div>
        </Card>

        {/* 5. 4 Week Action Plan */}
        <Card className="mt-12 p-8 lg:p-10 border-2 border-brand-navy/20 shadow-2xl bg-white rounded-[32px] overflow-hidden">
          <div className="bg-brand-navy text-white -mt-10 -mx-10 px-10 py-8 mb-10 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold flex items-center justify-center gap-2 mb-2 tracking-tight">
              <CalendarDays /> 4주 기적의 액션 플랜
            </h2>
            <p className="text-brand-lightblue/80 text-sm lg:text-base font-medium">이번 달, 꾸준한 실천으로 관계의 밀도를 확 높이세요.</p>
          </div>
          
          <div className="relative border-l-2 border-brand-lightblue/30 ml-4 space-y-10 pb-4">
            {report.fourWeekPlan.map((plan: any, i: number) => (
              <div key={i} className="relative pl-8">
                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-brand-lightblue border-4 border-white shadow-sm" />
                <div className="text-brand-navy font-black mb-2 text-lg tracking-tight">{plan.week}주차: {plan.focus}</div>
                <p className="text-slate-600 font-medium leading-relaxed break-keep">{plan.action}</p>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  )
}
