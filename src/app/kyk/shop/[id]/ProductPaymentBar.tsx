'use client'

import { useState } from 'react'
import { ShoppingBag, Heart, Lock } from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { dictionaries } from '@/lib/i18n/dictionaries'
import { createClient } from '@/lib/supabase/client'

const PRODUCT_NAMES: Record<number, { ko: string; en: string }> = {
  1: { ko: '코리안 데일리 케어 에센스', en: 'Korean Daily Care Essence' },
  2: { ko: 'K-산후조리 스타터 키트', en: 'K-Postpartum Starter Kit' },
  3: { ko: '키즈 실리콘 식기 세트', en: 'Kids Silicone Tableware Set' },
}

export default function ProductPaymentBar({ productId }: { productId: number }) {
  const { language } = useLanguageStore()
  // @ts-ignore
  const dict = dictionaries[language] || dictionaries.en

  const [isPaying, setIsPaying] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [error, setError] = useState('')

  const handlePay = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setShowLoginModal(true)
      return
    }
    await startPayment(user.id)
  }

  const startPayment = async (userId: string) => {
    setIsPaying(true)
    setError('')
    try {
      const gateway = language === 'ko' ? 'toss' : 'stripe'
      const product = PRODUCT_NAMES[productId]
      const defaultTeamName = language === 'ko'
        ? `${product.ko} 팀`
        : `${product.en} Team`

      // 팀 + 주문 생성
      const res = await fetch('/api/teams/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          teamName: defaultTeamName,
          description: '',
          privacy: 'public',
          gateway,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      const { orderId, amount, productName, teamId } = data

      if (gateway === 'toss') {
        const { loadTossPayments } = await import('@tosspayments/tosspayments-sdk')
        const tossPayments = await loadTossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!)
        const payment = tossPayments.payment({ customerKey: userId })
        await payment.requestPayment({
          method: 'CARD',
          amount: { currency: 'KRW', value: amount },
          orderId,
          orderName: productName,
          successUrl: `${window.location.origin}/kyk/shop/payment/success?gateway=toss&orderId=${orderId}`,
          failUrl: `${window.location.origin}/kyk/shop/payment/fail?gateway=toss&orderId=${orderId}`,
        })
      } else {
        const stripeRes = await fetch('/api/payments/stripe/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, amount, productName, teamId }),
        })
        const stripeData = await stripeRes.json()
        if (!stripeRes.ok) throw new Error(stripeData.error)
        window.location.href = stripeData.url
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error')
      setIsPaying(false)
    }
  }

  const handleKakaoLogin = () => {
    const supabase = createClient()
    supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: { redirectTo: window.location.href },
    })
  }

  return (
    <>
      {error && (
        <div className="fixed bottom-[100px] left-1/2 -translate-x-1/2 bg-red-600 text-white text-[13px] font-bold px-5 py-3 rounded-full z-50 shadow-lg">
          {error}
        </div>
      )}

      <div className="fixed bottom-0 z-50 w-full max-w-[600px] bg-white pt-4 pb-6 px-6 border-t border-slate-100 flex items-center justify-between gap-5 shadow-[0_-10px_40px_rgba(0,0,0,0.06)] rounded-t-[24px]">
        <div className="flex flex-col items-center justify-center gap-1.5 min-w-[70px]">
          <Heart size={24} className="text-[#999999]" strokeWidth={2} />
          <span className="text-[8px] font-extrabold text-[#999999] uppercase tracking-wider text-center">
            LIKE
          </span>
        </div>
        <button
          onClick={handlePay}
          disabled={isPaying}
          className="flex-1 bg-[#8A2627] text-white rounded-[20px] py-[15px] flex items-center justify-center gap-2.5 font-extrabold text-[14px] shadow-lg shadow-red-900/25 active:scale-[0.98] transition-all hover:bg-[#7A1F26] uppercase disabled:opacity-70"
        >
          {isPaying ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <ShoppingBag size={18} strokeWidth={2.5} />
              {dict.shopTeamJoin || 'JOIN TEAM'}
            </>
          )}
        </button>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="bg-white w-full max-w-[340px] rounded-[32px] p-7 flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-brand-red1/10 rounded-full flex items-center justify-center mb-5">
              <Lock className="w-7 h-7 text-brand-red1" />
            </div>
            <h3 className="text-[20px] font-black text-slate-900 mb-2 leading-tight"
              dangerouslySetInnerHTML={{ __html: dict.bundleLoginTitle?.replace(/\n/g, '<br/>') || '' }}
            />
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-6">
              {dict.bundleLoginDesc}
            </p>
            <button
              onClick={handleKakaoLogin}
              className="w-full bg-[#fae100] hover:bg-[#eed500] text-[#371d1e] font-extrabold text-[15px] py-[15px] rounded-[18px] transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4c-4.97 0-9 3.18-9 7.1 0 2.54 1.7 4.76 4.2 5.96-.2.72-.75 2.68-.78 2.87-.04.22.12.22.25.13.1-.07 3.08-2.02 4.3-2.84.66.1 1.33.15 2.03.15 4.97 0 9-3.18 9-7.1S16.97 4 12 4Z" />
              </svg>
              {dict.bundleLoginKakao}
            </button>
            <button
              onClick={() => setShowLoginModal(false)}
              className="mt-4 text-[13px] font-bold text-slate-400 hover:text-slate-600 underline underline-offset-2"
            >
              {dict.bundleLoginPostpone}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
