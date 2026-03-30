import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default function KYKLandingPage() {
  return (
    <div className="flex flex-col h-full min-h-[100dvh] items-center justify-center p-6 text-center bg-brand-white">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm md:max-w-md lg:max-w-xl mx-auto">

        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-brand-yellow blur-2xl rounded-full opacity-50 animate-pulse" />
          <div className="relative w-28 h-28 lg:w-36 lg:h-36 bg-white rounded-[32px] lg:rounded-[40px] shadow-2xl flex items-center justify-center border-4 border-brand-yellow/30 overflow-hidden p-4">
            <Image src="/symbol.png" alt="KYK 심볼" width={100} height={100} className="w-full h-full object-contain" priority />
          </div>
        </div>

        <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight mb-4 text-brand-black">
          우리 아이<br/>
          <span className="text-brand-red1">진짜 성향 알아보기</span>
        </h1>

        <p className="text-slate-500 mb-10 text-[15px] lg:text-lg leading-relaxed">
          KYK (Know Your Kid) 엔진으로<br/>
          아이에 대해 깊이 이해하고,<br/>
          딱 맞는 맞춤형 육아 솔루션을 만나보세요.
        </p>
      </div>

      <div className="w-full pb-8 pt-4 max-w-sm md:max-w-md lg:max-w-xl mx-auto">
        <Link
          href="/kyk/step1"
          className="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background disabled:pointer-events-none disabled:opacity-50 w-full text-lg lg:text-xl h-14 lg:h-16 bg-brand-red1 hover:bg-brand-red2 text-white rounded-2xl shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl"
        >
          시작하기
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
        <p className="mt-4 text-xs text-slate-400">약 3분 정도 소요됩니다.</p>
      </div>
    </div>
  )
}
