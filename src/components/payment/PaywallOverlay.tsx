'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LockIcon, PlayCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PaywallOverlayProps {
  kidId: string
  onUnlockSuccess?: () => void
}

export function PaywallOverlay({ kidId, onUnlockSuccess }: PaywallOverlayProps) {
  const router = useRouter()
  const [isLoadingAd, setIsLoadingAd] = useState(false)
  const [isLoadingPay, setIsLoadingPay] = useState(false)

  const handleWatchAd = async () => {
    setIsLoadingAd(true)
    try {
      // Mockup 흐름: 바로 완료 처리 (실제 연동 전 퍼널 테스트용)
      const res = await fetch('/api/kyk/ad/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultId: kidId, action: 'mock_ad_watch' })
      })

      const data = await res.json()
      if (data.success) {
        if (onUnlockSuccess) onUnlockSuccess()
        router.refresh()
      } else {
        alert('광고 처리 중 오류가 발생했습니다.')
      }
    } catch (e) {
      alert('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoadingAd(false)
    }
  }

  const handlePayment = async () => {
    setIsLoadingPay(true)
    try {
      // 차후 Toss Payments 연동을 위한 진입점
      alert('결제 창이 열립니다. (구현 예정)')
      // Toss 호출 로직 들어갈 자리...
    } catch (e) {
      alert('오류가 발생했습니다.')
    } finally {
      setIsLoadingPay(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-5 bg-slate-900/40 backdrop-blur-sm">
      <Card className="relative w-full max-w-md p-6 bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl text-center border-0">
        <div className="mx-auto w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4 shadow-inner ring-4 ring-white">
          <LockIcon size={24} className="text-brand-red1" />
        </div>
        
        <h2 className="text-xl font-bold text-slate-800 mb-2">프리미엄 심층 진단이 준비되었습니다!</h2>
        <p className="text-[14px] text-slate-600 mb-6 break-keep">
          우리 아이와 부모님의 양육 성향을 비교한 <strong className="text-brand-red1">격차 분석</strong>과 즉각 실행 가능한 <strong className="text-brand-red1">맞춤형 전략</strong>을 확인해보세요.
        </p>

        <div className="space-y-3">
          {/* 광고 유도 버튼 (강조) */}
          <Button
            onClick={handleWatchAd}
            disabled={isLoadingAd || isLoadingPay}
            className="w-full h-14 rounded-2xl bg-brand-red1 hover:bg-brand-red1/90 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all flex border border-brand-red1 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
            {isLoadingAd ? <Loader2 className="animate-spin mr-2" /> : <PlayCircle className="mr-2" size={20} />}
            광고 보고 1회 무료 확인
            <span className="absolute -top-3 -right-2 bg-brand-yellow text-brand-red1 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm rotate-12">BEST</span>
          </Button>

          {/* 결제 버튼 (서브) */}
          <Button
            onClick={handlePayment}
            disabled={isLoadingAd || isLoadingPay}
            variant="outline"
            className="w-full h-14 rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-all"
          >
            {isLoadingPay ? <Loader2 className="animate-spin mr-2" /> : null}
            프리미엄 리포트 영구 소장 (2,900원)
          </Button>
        </div>
        
        <p className="text-[11px] text-slate-400 mt-5 font-medium">영구 소장 시 이전 진단 기록까지 모두 열람할 수 있습니다.</p>
      </Card>
    </div>
  )
}
