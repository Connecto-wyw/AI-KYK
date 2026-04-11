'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { dictionaries } from '@/lib/i18n/dictionaries'

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language } = useLanguageStore()
  // @ts-ignore
  const dict = dictionaries[language] || dictionaries.en

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const [teamId, setTeamId] = useState<string | null>(null)

  useEffect(() => {
    const gateway = searchParams.get('gateway')
    const orderId = searchParams.get('orderId')

    async function confirm() {
      try {
        if (gateway === 'toss') {
          const paymentKey = searchParams.get('paymentKey')
          const amount = searchParams.get('amount')

          const res = await fetch('/api/payments/toss/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error)
          setTeamId(data.teamId)
          setStatus('success')
        } else if (gateway === 'stripe') {
          const sessionId = searchParams.get('session_id')

          const res = await fetch('/api/payments/stripe/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, orderId }),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error)
          setTeamId(data.teamId)
          setStatus('success')
        } else {
          throw new Error('Unknown gateway')
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Payment confirmation failed'
        setErrorMsg(message)
        setStatus('error')
      }
    }

    confirm()
  }, [searchParams])

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] gap-4">
        <Loader2 className="w-10 h-10 text-brand-red1 animate-spin" />
        <p className="text-[15px] font-bold text-slate-600">{dict.paymentConfirming || '결제 확인 중...'}</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] gap-6 px-8 text-center">
        <XCircle className="w-16 h-16 text-red-500" />
        <div>
          <h2 className="text-[22px] font-black text-slate-900 mb-2">{dict.paymentErrorTitle || '결제 확인 실패'}</h2>
          <p className="text-[14px] text-slate-500">{errorMsg}</p>
        </div>
        <button
          onClick={() => router.push('/kyk/shop')}
          className="bg-slate-900 text-white font-bold px-8 py-4 rounded-[16px]"
        >
          {dict.paymentGoShop || '쇼핑 계속하기'}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] gap-8 px-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <div>
          <h2 className="text-[24px] font-black text-slate-900 mb-2">
            {dict.paymentSuccessTitle || '결제가 완료되었습니다!'}
          </h2>
          <p className="text-[14px] text-slate-500 leading-relaxed">
            {dict.paymentSuccessDesc || '팀이 결성되면 알림을 드릴게요.'}
          </p>
        </div>
      </div>

      <button
        onClick={() => teamId ? router.push(`/kyk/shop/team/${teamId}`) : router.push('/kyk/shop')}
        className="w-full max-w-[320px] bg-[#8A2627] text-white font-extrabold text-[15px] py-[16px] rounded-[20px] shadow-lg shadow-red-900/20"
      >
        {dict.paymentGoTeam || '팀 대시보드로 이동'}
      </button>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[100dvh]">
        <Loader2 className="w-10 h-10 text-brand-red1 animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
