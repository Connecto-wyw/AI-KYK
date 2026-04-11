'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { XCircle } from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { dictionaries } from '@/lib/i18n/dictionaries'

function PaymentFailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language } = useLanguageStore()
  // @ts-ignore
  const dict = dictionaries[language] || dictionaries.en

  const errorMsg = searchParams.get('message') || searchParams.get('code') || ''

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] gap-8 px-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
          <XCircle className="w-12 h-12 text-red-400" />
        </div>
        <div>
          <h2 className="text-[22px] font-black text-slate-900 mb-2">
            {dict.paymentFailTitle || '결제가 취소되었습니다'}
          </h2>
          {errorMsg && (
            <p className="text-[13px] text-slate-400 mt-1">{errorMsg}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-[320px]">
        <button
          onClick={() => router.back()}
          className="w-full bg-[#8A2627] text-white font-extrabold text-[15px] py-[16px] rounded-[20px]"
        >
          {dict.paymentRetry || '다시 시도하기'}
        </button>
        <button
          onClick={() => router.push('/kyk/shop')}
          className="w-full bg-slate-100 text-slate-700 font-bold text-[14px] py-[14px] rounded-[20px]"
        >
          {dict.paymentGoShop || '쇼핑 계속하기'}
        </button>
      </div>
    </div>
  )
}

export default function PaymentFailPage() {
  return (
    <Suspense>
      <PaymentFailContent />
    </Suspense>
  )
}
