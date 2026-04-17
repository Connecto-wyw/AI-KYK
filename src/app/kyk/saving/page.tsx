'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useKYKStore } from '@/store/useKYKStore'
import { createClient } from '@/lib/supabase/client'
import { useLanguageStore } from '@/store/useLanguageStore'
import { dictionaries } from '@/lib/i18n/dictionaries'

export default function SavingPage() {
  const router = useRouter()
  const store = useKYKStore()
  const { language } = useLanguageStore()
  const dict = dictionaries[language]

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
          step4Answers: currentStore.step4Answers,
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

  // Calculate dynamic teaser
  const computeSpeedLabel = () => {
    const { parentStyle, childLevels } = store.step4Answers || {};
    if (!parentStyle || !childLevels) return language === 'ko' ? '빠를' : 'fast';

    let totalLevel = 0;
    let count = 0;
    for (const key in childLevels) {
      totalLevel += childLevels[key];
      count++;
    }
    const avg = count > 0 ? totalLevel / count : 0;

    // parentStyle: lead (fast), nature (slow), respect, coach
    if (parentStyle === 'lead' && avg < 1.0) return language === 'ko' ? '빠를' : 'fast';
    if (parentStyle === 'nature' && avg >= 2.0) return language === 'ko' ? '느릴' : 'slow'; 
    if (parentStyle === 'lead' && avg >= 1.5) return language === 'ko' ? '알맞을' : 'well-paced';
    return language === 'ko' ? '다를' : 'different';
  }

  const speedStr = computeSpeedLabel();
  const teaserText = dict.savingTeaser ? dict.savingTeaser.replace('{speed}', speedStr) : `지금 양육 방향은\n아이에게 조금 ${speedStr} 수 있어요`;

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
        
        <div className="space-y-4 mt-8 text-center max-w-sm">
          <p className="text-[17px] font-bold text-white whitespace-pre-line animate-[fade-in-up_400ms_ease-out_forwards] bg-white/10 p-5 rounded-2xl border border-white/20 shadow-xl backdrop-blur-md">
            {teaserText}
          </p>
          <div className="space-y-2 mt-4 pt-4">
            <p className="text-[13px] text-slate-500 animate-[fade-in-up_400ms_ease-out_800ms_forwards] opacity-0" style={{ animationDelay: '1.2s' }}>
              부모님의 기대치와 아이의 기질을 결합하고 있습니다...
            </p>
            <p className="text-[13px] text-brand-yellow/80 animate-[fade-in-up_400ms_ease-out_2400ms_forwards] opacity-0 font-bold" style={{ animationDelay: '2.4s' }}>
              분석이 거의 완료되었어요!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
