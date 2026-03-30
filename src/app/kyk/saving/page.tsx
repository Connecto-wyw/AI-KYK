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
      // Small delay just for UX processing magic
      await new Promise(r => setTimeout(r, 1500))

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
    <div className="flex flex-col min-h-[100dvh] bg-white p-6 items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="w-12 h-12 text-brand-lightblue animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-800">결과 분석 중입니다...</h2>
        <p className="text-sm text-slate-500 mt-2">아이의 성향과 맞춤형 가이드라인을 생성하고 있어요.</p>
      </div>
    </div>
  )
}
