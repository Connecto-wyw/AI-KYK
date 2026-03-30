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

      <div className="relative z-10 w-full max-w-sm lg:max-w-2xl flex flex-col lg:flex-row lg:items-start lg:gap-12 items-center text-center lg:text-left">

        {/* Left: teaser */}
        <div className="w-full lg:flex-1 flex flex-col lg:items-start items-center">
          <div className="mb-6 p-4 bg-white rounded-full text-amber-500 shadow-xl border border-orange-50 animate-bounce-slight">
            <Sparkles size={36} fill="currentColor" />
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-8 tracking-tight">
            분석이 완료되었습니다!
          </h1>

          <Card className="w-full p-6 bg-white/80 backdrop-blur-md shadow-2xl border-white/40 mb-8 lg:mb-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -z-10" />
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-3">
              <span>아이 성향 요약 미리보기</span>
            </div>
            <p className="text-lg font-bold text-slate-800 leading-snug">
              &quot;{result.summary}&quot;
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100/60 filter blur-[2px] opacity-60">
              <p className="text-sm text-slate-500 line-clamp-2">
                강점 분석, 주의 포인트, 추천 접근법 등 맞춤형 양육 가이드라인이 상세 분석 리포트에 포함되어 있습니다...
              </p>
            </div>
          </Card>
        </div>

        {/* Right: login gate */}
        <div className="w-full lg:w-[360px] lg:shrink-0 bg-white p-6 lg:p-8 rounded-3xl shadow-lg border border-slate-100">
          <div className="flex items-center justify-center gap-2 mb-4 text-slate-600">
            <Lock size={16} />
            <h3 className="font-medium text-sm">로그인하고 모든 결과 확인하기</h3>
          </div>

          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            size="lg"
            className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-md text-lg transition-transform hover:scale-[1.02]"
          >
            {isLoading ? '연결 중...' : 'Google 계정으로 계속'}
            {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
          </Button>

          <p className="mt-4 text-[11px] text-slate-400">
            로그인 시 분석 결과가 안전하게 저장되며, AI 코치와 연동되어 개인화된 양육 가이드를 받을 수 있습니다.
          </p>
        </div>

      </div>
    </div>
  )
}
