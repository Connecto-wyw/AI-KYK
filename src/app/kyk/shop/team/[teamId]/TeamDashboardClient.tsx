'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Reply, Share2, Copy, Check, Clock, UserCheck, AlertCircle, ShoppingBag } from 'lucide-react'

export default function TeamDashboardClient({ teamId, isNew }: { teamId: string, isNew: boolean }) {
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60 - 1) // roughly 24 hours
  const [showCelebration, setShowCelebration] = useState(isNew)
  
  // Mock Data
  const isCaptain = true
  const currentCount = 1
  const targetCount = 3
  const isFull = currentCount >= targetCount
  const teamTitle = "우리 아이 첫 공동구매, 같이 할인받아요!"
  const product = { name: '데일리 프리미엄 에센셜 워시 세트', originalPrice: 65000, teamPrice: 39000, img: '/img/items/item-1.png' }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.warn("Failed to copy", err)
    }
  }

  const handleKakaoShare = () => {
    alert("카카오톡 공유 API가 호출됩니다.") // placeholder
  }

  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#f7f8f9] relative w-full max-w-[600px] mx-auto border-x border-slate-50 font-sans pb-[100px]">
      
      {/* 1. Header Navigation */}
      <div className="flex items-center justify-between px-5 py-4 bg-[#f7f8f9] z-40 sticky top-0">
        <Link href="/kyk/shop" className="text-slate-800 hover:opacity-80 transition-opacity">
          <Reply size={20} className="scale-x-[-1]" />
        </Link>
        <h1 className="text-[15px] font-extrabold text-slate-900 tracking-widest">
          TEAM 구매 현황
        </h1>
        <div className="w-5" /> 
      </div>

      {/* 2. Main Dashboard Panel */}
      <div className="px-5 pt-3 pb-8 flex flex-col gap-5">
        
        {/* Team Status Card */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex flex-col items-center relative overflow-hidden">
          {/* Background decorator */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red1/5 rounded-bl-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center w-full">
            {isCaptain && (
              <span className="bg-[#1a1a1a] text-white text-[10px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4 shadow-sm inline-flex items-center gap-1.5">
                <UserCheck size={12} className="text-brand-yellow" />
                내가 캡틴
              </span>
            )}
            
            <h2 className="text-[20px] font-black text-slate-900 leading-[1.3] mb-6 px-4">
              "{teamTitle}"
            </h2>

            {/* Product Summary */}
            <div className="w-full bg-slate-50 rounded-[20px] p-4 flex gap-4 text-left border border-slate-100 mb-6">
               <div className="w-[60px] h-[60px] rounded-2xl bg-white border border-slate-100 relative overflow-hidden shrink-0 shadow-sm">
                 <Image src={product.img} alt="product" fill className="object-cover" />
               </div>
               <div className="flex flex-col flex-1 justify-center">
                 <h3 className="text-[13px] font-bold text-slate-800 leading-tight mb-2 truncate">{product.name}</h3>
                 <div className="flex items-end gap-1.5">
                    <span className="text-[15px] font-black text-brand-red1">{product.teamPrice.toLocaleString()}원</span>
                    <span className="text-[11px] font-semibold text-slate-400 line-through pb-[1px]">{product.originalPrice.toLocaleString()}원</span>
                 </div>
               </div>
            </div>

            {/* Target Progress */}
            <div className="w-full">
              <div className="flex justify-between items-end mb-2.5 px-1">
                <span className="text-[13px] font-bold text-slate-700">모집 현황</span>
                <span className="text-[15px] font-black text-brand-red1">
                  {currentCount} <span className="text-slate-400 text-[13px]">/ {targetCount}명</span>
                </span>
              </div>
              
              <div className="w-full h-[14px] bg-slate-100 rounded-full overflow-hidden flex items-center p-0.5">
                <div 
                  className="h-full bg-brand-red1 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: \`\${(currentCount / targetCount) * 100}%\` }}
                />
              </div>
              <p className="text-[12px] font-extrabold text-slate-500 mt-3 bg-brand-red1/5 text-brand-red2 py-2 px-3 rounded-xl inline-block">
                {targetCount - currentCount}명만 더 모이면 <span className="underline underline-offset-2">40% 할인 성공!</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Priority / Giant Share Buttons */}
        <div className="bg-white rounded-[32px] p-6 shadow-lg shadow-brand-red1/5 border-2 border-brand-red1/10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-yellow/20 text-brand-yellowgreen flex items-center justify-center mb-3">
             <Share2 size={24} className="text-brand-forestgreen ml-[-2px]" />
          </div>
          <h3 className="text-[18px] font-black text-slate-900 mb-2">할인까지 이제 얼마 안 남았어요!</h3>
          <p className="text-[13px] text-slate-500 font-medium text-center mb-6 leading-relaxed">
            원하는 곳으로 팀 초대 링크를 공유하세요.<br/>최소 인원이 달성되면 자동 결제됩니다.
          </p>

          <div className="w-full flex flex-col gap-3">
            <button 
              onClick={handleKakaoShare}
              className="w-full bg-[#fae100] hover:bg-[#eed500] text-[#371d1e] font-black text-[15px] h-[58px] rounded-[20px] transition-all flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.98]"
            >
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4c-4.97 0-9 3.18-9 7.1 0 2.54 1.7 4.76 4.2 5.96-.2.72-.75 2.68-.78 2.87-.04.22.12.22.25.13.1-.07 3.08-2.02 4.3-2.84.66.1 1.33.15 2.03.15 4.97 0 9-3.18 9-7.1S16.97 4 12 4Z"/></svg>
              버튼 하나로 카카오톡 조르기
            </button>
            <button 
              onClick={handleCopyLink}
              className={\`w-full border-2 h-[58px] rounded-[20px] font-black text-[15px] flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] \${
                copied ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }\`}
            >
              {copied ? <Check size={18} className="text-brand-yellow" /> : <Copy size={18} />}
              {copied ? '링크가 클립보드에 복사되었습니다.' : '내 전용 초대 링크 복사하기'}
            </button>
          </div>
        </div>

        {/* Warning / Fail safe views */}
        {isFull && (
          <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-[20px] p-5 flex gap-3 mt-2">
             <AlertCircle className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
             <div className="flex flex-col gap-2 relative z-10 w-full">
                <span className="text-[14px] font-bold text-slate-900">이 팀은 벌써 혜택 달성 성공!</span>
                <span className="text-[12px] font-medium text-slate-600 leading-relaxed">
                  늦게 도착하셨군요!<br/>나도 바로 똑같은 조건으로 새 팀 오픈하고 똑같은 40% 할인을 받아볼까요?
                </span>
                <Link href="/kyk/shop/bundle" className="mt-2 text-[12px] font-extrabold bg-white text-brand-blue px-4 py-2.5 rounded-xl shadow-sm text-center">나만의 팀 새로 만들기</Link>
             </div>
          </div>
        )}

      </div>

      {/* Floating Bottom Timeout */}
      <div className="fixed bottom-0 z-40 w-full max-w-[600px] bg-slate-900 text-white pt-4 pb-6 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-[24px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-brand-yellow" />
            <span className="text-[13px] font-bold text-slate-300">목표 마감까지 남은 시간</span>
          </div>
          <div className="text-[20px] font-black tracking-widest tabular-nums text-white bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* First Time Celebration Dialog */}
      {showCelebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md">
          <div className="relative bg-white w-full max-w-[340px] rounded-[32px] overflow-hidden text-center shadow-2xl animate-in zoom-in-95 fade-in duration-300">
            {/* Header Red Ribbon */}
            <div className="bg-brand-red1 pt-8 pb-10 px-6 w-full text-white">
              <span className="text-[40px] inline-block mb-2">🎉</span>
              <h2 className="text-[22px] font-black tracking-tight leading-tight mb-2 text-[#ffecd2]">나만의 팀이<br/>성공적으로 열렸어요!</h2>
            </div>
            
            <div className="bg-white p-6 -mt-4 rounded-t-[24px] relative">
              <p className="text-[14px] font-medium text-slate-600 mb-6 leading-relaxed">
                현재 <strong className="text-slate-900">참여 인원 1명 (캡틴)</strong>!<br/>
                지금 바로 친구에게 링크를 공유하고<br/>목표 인원을 채워보세요.
              </p>
              
              <button 
                onClick={() => setShowCelebration(false)}
                className="w-full bg-[#8A2627] hover:bg-[#7A1F26] text-[#ffecd2] font-black text-[15px] h-[54px] rounded-[18px] transition-colors shadow-lg shadow-red-900/20 active:scale-[0.98]"
              >
                공유하러 가기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
