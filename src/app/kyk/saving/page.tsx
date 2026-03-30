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

        const payload = {
          deviceId: store.deviceId,
          step1Answers: store.step1Answers,
          step2Answers: store.step2Answers,
          step3Answers: store.step3Answers,
        }

        const res = await fetch('/api/kyk/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (!res.ok) {
          throw new Error('Failed to submit data')
        }

        const data = await res.json()
        store.resetAll()
        router.replace(`/kyk/result?kid=${data.kidId}`)
      } catch (err) {
        console.error(err)
        alert('결과 저장 중 오류가 발생했습니다. 다시 시도해주세요.')
        router.replace('/kyk/gate')
      }
    }

    submitData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col min-h-[100dvh] bg-brand-white p-6 items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-800">결과 분석 중입니다...</h2>
        <p className="text-sm text-slate-500 mt-2">아이의 성향과 맞춤형 가이드라인을 생성하고 있어요.</p>
      </div>
    </div>
  )
}
