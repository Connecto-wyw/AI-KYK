'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, MessageCircle, BarChart2, ShieldCheck } from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { dictionaries } from '@/lib/i18n/dictionaries'
import { LanguageSelector } from '@/components/ui/LanguageSelector'

export default function KYKLandingPage() {
  const { language } = useLanguageStore()
  const dict = dictionaries[language]

  return (
    <div className="flex flex-col min-h-screen bg-brand-white relative overflow-hidden pb-32 lg:pb-12">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-[-20%] w-[140%] h-[600px] bg-gradient-to-b from-brand-yellow/20 via-brand-red1/5 to-transparent rounded-b-[100%] opacity-80 pointer-events-none" />
      <div className="absolute top-20 right-0 w-64 h-64 bg-brand-red1/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-24 lg:pt-24 pb-12 px-6 text-center w-full max-w-4xl mx-auto">
        
        {/* Mobile Top Header */}
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center border border-slate-100 p-1.5 ring-2 ring-white/50">
            <Image src="/symbol.png" alt="KYK Logo" width={32} height={32} className="w-full h-full object-contain" />
          </div>
          <span className="font-extrabold text-[19px] tracking-tight text-slate-900">KYK</span>
        </div>

        {/* Global Language Selector (Top Right) */}
        <div className="absolute top-6 right-6 z-50">
          <LanguageSelector />
        </div>

        <div className="mb-6 mt-16 lg:mt-6 relative group cursor-pointer">
          <div className="absolute inset-0 bg-brand-yellow blur-xl rounded-full opacity-60 animate-pulse group-hover:opacity-80 transition-opacity" />
          <div className="relative w-28 h-28 lg:w-32 lg:h-32 bg-white rounded-[32px] shadow-2xl flex items-center justify-center border-4 border-white overflow-hidden p-4 transform transition-transform group-hover:scale-105">
            <Image src="/symbol.png" alt="KYK 심볼" width={100} height={100} className="w-full h-full object-contain" priority />
          </div>
          <div className="absolute -top-3 -right-3 bg-brand-red1 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg rotate-12 animate-bounce-slight">
            {dict.badgeNew}
          </div>
        </div>

        <h1 className="text-[34px] md:text-5xl lg:text-[56px] font-extrabold tracking-tight mb-5 text-slate-900 leading-[1.35] break-keep">
          {dict.title1}<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red1 to-[#FF6B5C]">{dict.title2}</span>
        </h1>

        <p className="text-slate-500 mb-10 text-[16px] md:text-lg lg:text-xl leading-relaxed max-w-xl break-keep whitespace-pre-line">
          {dict.subtitle}
        </p>

        <div className="w-full max-w-sm md:max-w-md hidden lg:block">
          <Link
            href="/kyk/step1"
            className="group flex items-center justify-center w-full text-xl h-[64px] bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-xl transition-all hover:scale-[1.02] px-4"
          >
            <Sparkles className="mr-2 w-5 h-5 text-brand-yellow flex-shrink-0" />
            <span className="truncate">{dict.buttonStart}</span>
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Link>
          <p className="mt-4 text-[13px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} className="text-green-500 flex-shrink-0" />
            {dict.buttonCaption}
          </p>
        </div>
      </section>

      {/* Features Teasing Section */}
      <section className="relative z-10 px-6 py-12 w-full max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-xs lg:text-sm font-bold text-brand-red1 tracking-wider uppercase mb-2">{dict.featuresTitle}</h2>
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{dict.featuresSubtitle}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-50 hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-brand-yellow/10 rounded-2xl flex items-center justify-center mb-6 text-brand-yellow">
              <Sparkles size={26} strokeWidth={1.5} />
            </div>
            <h4 className="text-[19px] font-bold text-slate-900 mb-3 tracking-tight">{dict.feature1Title}</h4>
            <p className="text-[14.5px] text-slate-500 leading-relaxed font-medium break-keep">
              {dict.feature1Desc}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden group">
            <div className="absolute top-5 right-5 bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              {dict.badgeSoon}
            </div>
            <div className="w-14 h-14 bg-brand-lightblue/10 rounded-2xl flex items-center justify-center mb-6 text-brand-lightblue">
              <MessageCircle size={26} strokeWidth={1.5} />
            </div>
            <h4 className="text-[19px] font-bold text-slate-900 mb-3 tracking-tight">{dict.feature2Title}</h4>
            <p className="text-[14.5px] text-slate-500 leading-relaxed font-medium break-keep">
              {dict.feature2Desc}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden group">
            <div className="absolute top-5 right-5 bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              {dict.badgeSoon}
            </div>
            <div className="w-14 h-14 bg-brand-yellowgreen/10 rounded-2xl flex items-center justify-center mb-6 text-brand-yellowgreen">
              <BarChart2 size={26} strokeWidth={1.5} />
            </div>
            <h4 className="text-[19px] font-bold text-slate-900 mb-3 tracking-tight">{dict.feature3Title}</h4>
            <p className="text-[14.5px] text-slate-500 leading-relaxed font-medium break-keep">
              {dict.feature3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* Footer / Language Selector removed since it is now in layout.tsx */}
      
      {/* Bottom Sticky CTA for Mobile */}
      <div className="fixed bottom-[72px] lg:hidden left-0 right-0 p-4 bg-gradient-to-t from-brand-white via-brand-white to-transparent pointer-events-none z-40 flex flex-col items-center">
        <Link
          href="/kyk/step1"
          className="pointer-events-auto flex items-center justify-center w-full max-w-sm h-14 bg-slate-900 text-white font-semibold text-[17px] rounded-2xl shadow-xl active:scale-[0.98] transition-transform px-4"
        >
          <Sparkles className="mr-2 w-4 h-4 text-brand-yellow flex-shrink-0" />
          <span className="truncate">{dict.buttonStart}</span>
        </Link>
        <p className="pointer-events-auto mt-2.5 text-[11px] text-slate-500 font-medium">
          {dict.bottomFloatingCaption}
        </p>
      </div>

    </div>
  )
}
