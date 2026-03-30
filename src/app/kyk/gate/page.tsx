'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sparkles, Lock, ArrowRight } from 'lucide-react'
import { useKYKStore } from '@/store/useKYKStore'
import { calculateKYKResult, KYKResultData } from '@/lib/kyk/scoring'

export default function GatePage() {
  const { step2Answers } = useKYKStore()
  const [result, setResult] = useState<KYKResultData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (Object.keys(step2Answers).length > 0) {
      setResult(calculateKYKResult(step2Answers))
    }
  }, [step2Answers])

  const handleGoogleLogin = async () => {
    // TODO: Google Cloud ID 발급 후 아래 OAuth 코드로 교체
    // setIsLoading(true)
    // const supabase = createClient()
    // await supabase.auth.signInWithOAuth({
    //   provider: 'google',
    //   options: { redirectTo: `${window.location.origin}/api/auth/callback` }
    // })
    router.push('/kyk/result')
  }

  if (!result) return null

  return (
    <div className="flex flex-col min-h-[100dvh] bg-brand-white p-6 items-center justify-center relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-20%] w-[140%] h-[50%] bg-gradient-to-b from-blue-100 to-transparent rounded-b-full opacity-60 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md lg:max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Title */}
        <div className="mb-6 lg:mb-10 text-center flex flex-col items-center">
          <div className="mb-4 lg:mb-6 p-4 bg-white rounded-full text-amber-500 shadow-xl border border-orange-50 animate-bounce-slight inline-flex">
            <Sparkles size={36} fill="currentColor" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            분석이 완료되었습니다!
          </h1>
          <p className="mt-2 text-slate-500 text-sm lg:text-base hidden lg:block">
            아이의 특별한 성향과 맞춤형 양육 가이드를 준비했어요.
          </p>
        </div>

        {/* Unified Split Card */}
        <div className="w-full flex flex-col lg:flex-row bg-white lg:rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden rounded-3xl">
          
          {/* Left: Teaser (Red Area) */}
          <div className="w-full lg:w-[55%] bg-brand-red2 text-brand-white pt-10 pb-12 px-6 lg:px-12 relative overflow-hidden flex flex-col justify-center text-left">
            <div className="absolute -top-4 -right-4 opacity-10 text-brand-yellow rotate-12 pointer-events-none">
              <Sparkles size={160} />
            </div>
            <p className="text-brand-white/70 text-sm font-medium mb-3 tracking-wide">KYK 분석 결과</p>
            <h1 className="text-[28px] lg:text-3xl font-extrabold mb-4 leading-tight tracking-tight">
              우리 아이는<br/>
              <span className="text-brand-yellow break-keep">{result.title}</span> 유형!
            </h1>
            <p className="text-brand-white/85 text-[15px] lg:text-base leading-relaxed max-w-[90%] break-keep">
              {result.summary}
            </p>
            <div className="mt-8 pt-5 border-t border-white/20 filter blur-[3.5px] opacity-60">
              <p className="text-sm text-white/90 leading-relaxed font-medium">
                강점 분석, 주의 포인트, 추천 접근법 등 맞춤형 양육 가이드라인이 상세 분석 리포트에 포함되어 있습니다.
              </p>
            </div>
          </div>

          {/* Right: Login gate (White Area) */}
          <div className="w-full lg:w-[45%] p-8 lg:p-12 flex flex-col justify-center items-center bg-white">
            <div className="flex items-center justify-center gap-2 mb-4 text-slate-600">
              <Lock size={18} />
              <h3 className="font-medium lg:text-lg">로그인하고 모든 결과 확인하기</h3>
            </div>

            <p className="text-sm text-slate-500 text-center mb-8 break-keep leading-relaxed hidden lg:block">
              나의 분석 결과를 안전하게 저장하고 AI 코치의 맞춤형 가이드를 시작하세요.
            </p>

            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              size="lg"
              className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-md text-lg transition-transform hover:scale-[1.02]"
            >
              {isLoading ? '연결 중...' : 'Google 계정으로 계속'}
              {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
            </Button>

            <p className="mt-4 text-[11px] text-slate-400 text-center">
              로그인 시 분석 결과가 안전하게 저장되며, AI 코치와 연동되어 개인화된 양육 가이드를 받을 수 있습니다.
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}
