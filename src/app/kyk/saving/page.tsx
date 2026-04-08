'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useKYKStore } from '@/store/useKYKStore'
import { createClient } from '@/lib/supabase/client'

export default function SavingPage() {
  const router = useRouter()
  const store = useKYKStore()

  useEffect(() => {
    async function submitData() {
      // Simulate heavy AI processing for psychological impact (3.8 seconds)
      await new Promise(r => setTimeout(r, 3800))

      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          router.replace('/kyk/gate')
          return
        }

        const currentStore = useKYKStore.getState()
        const payload = {
          deviceId: currentStore.deviceId,
          step1Answers: currentStore.step1Answers,
          step2Answers: currentStore.step2Answers,
          step3Answers: currentStore.step3Answers,
        }

        const res = await fetch('/api/kyk/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || 'Failed to submit data')
        }

        store.resetAll()
        router.replace('/kyk/result')
      } catch (err: any) {
        console.error(err)
        alert(`결과 저장 중 오류가 발생했습니다: \n${err.message}`)
        router.replace('/kyk/step1')
      }
    }

    submitData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col min-h-[100dvh] bg-slate-900 text-white p-6 items-center justify-center relative overflow-hidden">
      {/* Background ambient FX */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-yellow/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-red1/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="flex flex-col items-center relative z-10 w-full max-w-sm">
        {/* Core Animation Circle */}
        <div className="relative w-32 h-32 mb-10 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-slate-800 animate-[spin_4s_linear_infinite]" />
          <div className="absolute inset-0 rounded-full border-t-4 border-brand-red1 animate-[spin_1.5s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border-2 border-brand-yellow/30 animate-[spin_3s_linear_infinite_reverse]" />
          
          <img src="/symbol.png" alt="KYK AI Enginer" className="w-12 h-12 object-contain filter invert opacity-80 animate-pulse" />
        </div>
        
        <h2 className="text-2xl font-extrabold text-white text-center mb-3 animate-[pulse_2s_ease-in-out_infinite]">
          AI 분석 엔진 가동 중...
        </h2>
        
        <div className="space-y-2 mt-4 text-center">
          <p className="text-sm font-medium text-slate-400 animate-[fade-in-up_400ms_ease-out_forwards]">
            수만 건의 아동 발달 데이터를 매칭하는 중입니다.
          </p>
          <p className="text-[13px] text-slate-500 animate-[fade-in-up_400ms_ease-out_800ms_forwards] opacity-0" style={{ animationDelay: '1.2s' }}>
            부모님의 고민을 기반으로 맞춤형 TCI 기질을 추출합니다.
          </p>
          <p className="text-[13px] text-brand-yellow/80 animate-[fade-in-up_400ms_ease-out_2400ms_forwards] opacity-0 font-bold" style={{ animationDelay: '2.4s' }}>
            거의 다 완성되었어요!
          </p>
        </div>
      </div>
    </div>
  )
}
