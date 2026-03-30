import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, MessageCircle, BarChart2, ShieldCheck } from 'lucide-react'

export default function KYKLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-white relative overflow-hidden pb-32 lg:pb-12">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-[-20%] w-[140%] h-[600px] bg-gradient-to-b from-brand-yellow/20 via-brand-red1/5 to-transparent rounded-b-[100%] opacity-80 pointer-events-none" />
      <div className="absolute top-20 right-0 w-64 h-64 bg-brand-red1/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-16 lg:pt-24 pb-12 px-6 text-center w-full max-w-4xl mx-auto">
        <div className="mb-6 relative group cursor-pointer">
          <div className="absolute inset-0 bg-brand-yellow blur-xl rounded-full opacity-60 animate-pulse group-hover:opacity-80 transition-opacity" />
          <div className="relative w-28 h-28 lg:w-32 lg:h-32 bg-white rounded-[32px] shadow-2xl flex items-center justify-center border-4 border-white overflow-hidden p-4 transform transition-transform group-hover:scale-105">
            <Image src="/symbol.png" alt="KYK 심볼" width={100} height={100} className="w-full h-full object-contain" priority />
          </div>
          <div className="absolute -top-3 -right-3 bg-brand-red1 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg rotate-12 animate-bounce-slight">
            NEW
          </div>
        </div>

        <h1 className="text-[34px] md:text-5xl lg:text-[56px] font-extrabold tracking-tight mb-5 text-slate-900 leading-[1.2]">
          우리 아이 숨겨진 솔직한 마음,<br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red1 to-[#FF6B5C]">AI가 찾아줍니다</span>
        </h1>

        <p className="text-slate-500 mb-10 text-[16px] md:text-lg lg:text-xl leading-relaxed max-w-xl break-keep">
          3분 만에 알아보는 16가지 동물 기질 유형.<br className="hidden md:block"/>
          아이의 성향에 딱 맞는 1:1 양육 코칭을 경험하세요.
        </p>

        <div className="w-full max-w-sm md:max-w-md hidden lg:block">
          <Link
            href="/kyk/step1"
            className="group flex items-center justify-center w-full text-xl h-[64px] bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-xl transition-all hover:scale-[1.02]"
          >
            <Sparkles className="mr-2 w-5 h-5 text-brand-yellow" />
            무료 기질 분석 시작하기
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-4 text-[13px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} className="text-green-500" />
            100% 무료 · 가입 없이 먼저 결과 확인 가능
          </p>
        </div>
      </section>

      {/* Features Teasing Section */}
      <section className="relative z-10 px-6 py-12 w-full max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-xs lg:text-sm font-bold text-brand-red1 tracking-wider uppercase mb-2">Connecto App Features</h2>
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">단순한 검사, 그 이상.</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-50 hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-brand-yellow/10 rounded-2xl flex items-center justify-center mb-6 text-brand-yellow">
              <ShieldCheck size={14} className="text-brand-forestgreen" />
            </div>
            <span className="text-[13px] font-bold text-slate-700 tracking-wide">3분이면 충분해요</span>
            <p className="text-[14.5px] text-slate-500 leading-relaxed font-medium break-keep">
              최신 아동 심리학과 MBTI를 결합하여 아이의 찐 성향과 양육 가이드를 동물 캐릭터로 재미있게 알아봅니다.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden group">
            <div className="absolute top-5 right-5 bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              Coming Soon
            </div>
            <div className="w-14 h-14 bg-brand-lightblue/10 rounded-2xl flex items-center justify-center mb-6 text-brand-lightblue">
              <MessageCircle size={26} strokeWidth={1.5} />
            </div>
            <h4 className="text-[19px] font-bold text-slate-900 mb-3 tracking-tight">1:1 전담 AI 코치</h4>
            <p className="text-[14.5px] text-slate-500 leading-relaxed font-medium break-keep">
              우리 아이의 기질 데이터와 나이, 성별을 모두 기억하는 똑똑한 AI 코치에게 언제든 육아 고민을 상담하세요.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden group">
            <div className="absolute top-5 right-5 bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              Coming Soon
            </div>
            <div className="w-14 h-14 bg-brand-yellowgreen/10 rounded-2xl flex items-center justify-center mb-6 text-brand-yellowgreen">
              <BarChart2 size={26} strokeWidth={1.5} />
            </div>
            <h4 className="text-[19px] font-bold text-slate-900 mb-3 tracking-tight">스케줄 성장 리포트</h4>
            <p className="text-[14.5px] text-slate-500 leading-relaxed font-medium break-keep">
              아이의 학습/놀이 스케줄을 기록하면, 동년배 평균 데이터와 비교하여 객관적인 성장 평가 리포트를 제공합니다.
            </p>
          </div>
        </div>
      </section>
      
      {/* Bottom Sticky CTA for Mobile */}
      <div className="fixed bottom-[72px] lg:hidden left-0 right-0 p-4 bg-gradient-to-t from-brand-white via-brand-white to-transparent pointer-events-none z-40 flex flex-col items-center">
        <Link
          href="/kyk/step1"
          className="pointer-events-auto flex items-center justify-center w-full max-w-sm h-14 bg-slate-900 text-white font-semibold text-[17px] rounded-2xl shadow-xl active:scale-[0.98] transition-transform"
        >
          <Sparkles className="mr-2 w-4 h-4 text-brand-yellow" />
          무료 기질 분석 시작하기
        </Link>
        <p className="pointer-events-auto mt-2.5 text-[11px] text-slate-500 font-medium">
          가입 없이 빠르게 확인해 보세요!
        </p>
      </div>

    </div>
  )
}
