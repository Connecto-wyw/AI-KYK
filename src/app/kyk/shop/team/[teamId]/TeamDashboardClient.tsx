'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Reply, Share2, Copy, Check, Clock, UserCheck, AlertCircle, Zap } from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { dictionaries } from '@/lib/i18n/dictionaries'
import { createClient } from '@/lib/supabase/client'

interface TeamData {
  id: string
  product_id: number
  captain_id: string
  team_name: string
  description: string | null
  privacy: string
  status: string
  current_count: number
  target_count: number
  expires_at: string
  products?: {
    name_ko: string
    name_en: string
    img: string
    original_price: number
    team_price: number
  }
}

interface Member {
  user_id: string
  role: string
}

export default function TeamDashboardClient({ teamId, isNew }: { teamId: string, isNew: boolean }) {
  const { language } = useLanguageStore()
  // @ts-ignore
  const dict = dictionaries[language] || dictionaries.en

  const [copied, setCopied] = useState(false)
  const [showCelebration, setShowCelebration] = useState(isNew)
  const [team, setTeam] = useState<TeamData | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isJoining, setIsJoining] = useState(false)
  const [joinError, setJoinError] = useState('')

  const fetchTeam = useCallback(async () => {
    const res = await fetch(`/api/teams/${teamId}`)
    if (!res.ok) return
    const data = await res.json()
    setTeam(data.team)
    setMembers(data.members)
  }, [teamId])

  useEffect(() => {
    async function init() {
      setIsLoading(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id || null)
      await fetchTeam()
      setIsLoading(false)
    }
    init()
  }, [fetchTeam])

  // 타이머: expires_at 기반
  const [timeLeft, setTimeLeft] = useState(0)
  useEffect(() => {
    if (!team) return
    const calc = () => {
      const diff = Math.max(0, Math.floor((new Date(team.expires_at).getTime() - Date.now()) / 1000))
      setTimeLeft(diff)
    }
    calc()
    const timer = setInterval(calc, 1000)
    return () => clearInterval(timer)
  }, [team])

  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60

  const isMember = members.some(m => m.user_id === currentUserId)
  const isCaptain = team?.captain_id === currentUserId
  const isFull = team ? team.current_count >= team.target_count : false
  const isExpired = team ? new Date(team.expires_at) < new Date() : false

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.warn('Failed to copy', err)
    }
  }

  const handleKakaoShare = () => {
    alert(dict.teamDashKakaoBtn)
  }

  const handleJoinTeam = async () => {
    if (!currentUserId) {
      const supabase = createClient()
      supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: { redirectTo: window.location.href },
      })
      return
    }

    setIsJoining(true)
    setJoinError('')
    try {
      const gateway = language === 'ko' ? 'toss' : 'stripe'

      const res = await fetch(`/api/teams/${teamId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gateway }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      const { orderId, amount, productName } = data

      if (gateway === 'toss') {
        const { loadTossPayments } = await import('@tosspayments/tosspayments-sdk')
        const tossPayments = await loadTossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!)
        const payment = tossPayments.payment({ customerKey: currentUserId })
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
      const message = err instanceof Error ? err.message : 'Error'
      setJoinError(message)
      setIsJoining(false)
    }
  }

  const productName = language === 'ko'
    ? (team?.products?.name_ko || dict.shopItem1Name)
    : (team?.products?.name_en || dict.shopItem1Name)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh]">
        <div className="w-8 h-8 border-2 border-brand-red1/30 border-t-brand-red1 rounded-full animate-spin" />
      </div>
    )
  }

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] gap-4 px-8 text-center">
        <p className="text-[16px] font-bold text-slate-600">{dict.teamNotFound || '팀을 찾을 수 없습니다.'}</p>
        <Link href="/kyk/shop" className="text-brand-red1 font-bold underline">{dict.paymentGoShop || '쇼핑으로 돌아가기'}</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#f7f8f9] relative w-full max-w-[600px] mx-auto border-x border-slate-50 font-sans pb-[100px]">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-[#f7f8f9] z-40 sticky top-0">
        <Link href="/kyk/shop" className="text-slate-800 hover:opacity-80 transition-opacity">
          <Reply size={20} className="scale-x-[-1]" />
        </Link>
        <h1 className="text-[15px] font-extrabold text-slate-900 tracking-widest">
          {dict.teamDashTitle}
        </h1>
        <div className="w-5" />
      </div>

      <div className="px-5 pt-3 pb-8 flex flex-col gap-5">

        {/* Team Status Card */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red1/5 rounded-bl-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center w-full">
            {isCaptain && (
              <span className="bg-[#1a1a1a] text-white text-[10px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4 shadow-sm inline-flex items-center gap-1.5">
                <UserCheck size={12} className="text-brand-yellow" />
                {dict.teamDashCaptain}
              </span>
            )}

            <h2 className="text-[20px] font-black text-slate-900 leading-[1.3] mb-6 px-4">
              &ldquo;{team.team_name}&rdquo;
            </h2>

            {/* Product Summary */}
            <div className="w-full bg-slate-50 rounded-[20px] p-4 flex gap-4 text-left border border-slate-100 mb-6">
               <div className="w-[60px] h-[60px] rounded-2xl bg-white border border-slate-100 relative overflow-hidden shrink-0 shadow-sm">
                 <Image src={team.products?.img || '/img/items/item-1.png'} alt="product" fill className="object-cover" />
               </div>
               <div className="flex flex-col flex-1 justify-center">
                 <h3 className="text-[13px] font-bold text-slate-800 leading-tight mb-2 truncate">{productName}</h3>
                 <div className="flex items-end gap-1.5">
                    <span className="text-[15px] font-black text-brand-red1">{(team.products?.team_price || 0).toLocaleString()}</span>
                    <span className="text-[11px] font-semibold text-slate-400 line-through pb-[1px]">{(team.products?.original_price || 0).toLocaleString()}</span>
                 </div>
               </div>
            </div>

            {/* Progress */}
            <div className="w-full">
              <div className="flex justify-between items-end mb-2.5 px-1">
                <span className="text-[13px] font-bold text-slate-700">{dict.teamDashProgressTitle}</span>
                <span className="text-[15px] font-black text-brand-red1">
                  {team.current_count} <span className="text-slate-400 text-[13px]">/ {team.target_count}{dict.teamDashProgressUnit}</span>
                </span>
              </div>

              <div className="w-full h-[14px] bg-slate-100 rounded-full overflow-hidden flex items-center p-0.5">
                <div
                  className="h-full bg-brand-red1 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(team.current_count / team.target_count) * 100}%` }}
                />
              </div>

              {!isFull && !isExpired && (
                <p className="text-[12px] font-extrabold text-slate-500 mt-3 bg-brand-red1/5 text-brand-red2 py-2 px-3 rounded-xl inline-block">
                  {dict.teamDashMoreNeeded.replace('{diff}', String(team.target_count - team.current_count))} <span className="underline underline-offset-2">{dict.teamDashMoreNeededHighlight}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 팀 합류 버튼 (비회원에게만) */}
        {!isMember && !isFull && !isExpired && (
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
            <h3 className="text-[16px] font-black text-slate-900 mb-2 text-center">
              {dict.teamJoinTitle || '이 팀에 합류하기'}
            </h3>
            <p className="text-[13px] text-slate-500 text-center mb-5">
              {dict.teamJoinDesc || `팀원으로 참여하고 ${team.target_count}명 달성 시 할인 혜택을 받으세요.`}
            </p>
            {joinError && (
              <p className="text-[12px] text-red-500 text-center mb-3">{joinError}</p>
            )}
            <button
              onClick={handleJoinTeam}
              disabled={isJoining}
              className="w-full bg-[#8A2627] text-white rounded-[20px] py-[16px] flex items-center justify-center gap-2 font-extrabold text-[15px] shadow-lg shadow-red-900/25 disabled:opacity-70"
            >
              {isJoining ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Zap size={18} strokeWidth={2.5} className="fill-current text-[#ffecd2]" />
                  {dict.teamJoinBtn || '결제하고 팀 합류'}
                </>
              )}
            </button>
          </div>
        )}

        {/* Share Buttons (팀원에게만) */}
        {isMember && (
          <div className="bg-white rounded-[32px] p-6 shadow-lg shadow-brand-red1/5 border-2 border-brand-red1/10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-brand-yellow/20 text-brand-yellowgreen flex items-center justify-center mb-3">
               <Share2 size={24} className="text-brand-forestgreen ml-[-2px]" />
            </div>
            <h3 className="text-[18px] font-black text-slate-900 mb-2">{dict.teamDashShareActionTitle}</h3>
            <p className="text-[13px] text-slate-500 font-medium text-center mb-6 leading-relaxed"
               dangerouslySetInnerHTML={{ __html: dict.teamDashShareActionDesc.replace(/\\n/g, '<br/>') }}
            />

            <div className="w-full flex flex-col gap-3">
              <button
                onClick={handleKakaoShare}
                className="w-full bg-[#fae100] hover:bg-[#eed500] text-[#371d1e] font-black text-[15px] h-[58px] rounded-[20px] transition-all flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.98]"
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4c-4.97 0-9 3.18-9 7.1 0 2.54 1.7 4.76 4.2 5.96-.2.72-.75 2.68-.78 2.87-.04.22.12.22.25.13.1-.07 3.08-2.02 4.3-2.84.66.1 1.33.15 2.03.15 4.97 0 9-3.18 9-7.1S16.97 4 12 4Z"/></svg>
                {dict.teamDashKakaoBtn}
              </button>
              <button
                onClick={handleCopyLink}
                className={`w-full border-2 h-[58px] rounded-[20px] font-black text-[15px] flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] ${
                  copied ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {copied ? <Check size={18} className="text-brand-yellow" /> : <Copy size={18} />}
                {copied ? dict.teamDashCopied : dict.teamDashCopyBtn}
              </button>
            </div>
          </div>
        )}

        {/* 팀 풀 / 만료 안내 */}
        {isFull && (
          <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-[20px] p-5 flex gap-3 mt-2">
             <AlertCircle className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
             <div className="flex flex-col gap-2 relative z-10 w-full">
                <span className="text-[14px] font-bold text-slate-900">{dict.teamDashFullTitle}</span>
                <span className="text-[12px] font-medium text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: dict.teamDashFullDesc.replace(/\\n/g, '<br/>') }} />
                <Link href="/kyk/shop/bundle" className="mt-2 text-[12px] font-extrabold bg-white text-brand-blue px-4 py-2.5 rounded-xl shadow-sm text-center">{dict.teamDashCreateNew}</Link>
             </div>
          </div>
        )}

      </div>

      {/* Timer */}
      <div className="fixed bottom-0 z-40 w-full max-w-[600px] bg-slate-900 text-white pt-4 pb-6 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-[24px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-brand-yellow" />
            <span className="text-[13px] font-bold text-slate-300">
              {isExpired ? (dict.teamExpired || '팀 기간 만료') : dict.teamDashTimeLeft}
            </span>
          </div>
          <div className="text-[20px] font-black tracking-widest tabular-nums text-white bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">
            {isExpired ? '00:00:00' : `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
          </div>
        </div>
      </div>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md">
          <div className="relative bg-white w-full max-w-[340px] rounded-[32px] overflow-hidden text-center shadow-2xl animate-in zoom-in-95 fade-in duration-300">
            <div className="bg-brand-red1 pt-8 pb-10 px-6 w-full text-white">
              <span className="text-[40px] inline-block mb-2">🎉</span>
              <h2 className="text-[22px] font-black tracking-tight leading-tight mb-2 text-[#ffecd2]" dangerouslySetInnerHTML={{ __html: dict.teamDashCelebTitle.replace(/\\n/g, '<br/>') }} />
            </div>

            <div className="bg-white p-6 -mt-4 rounded-t-[24px] relative">
              <p className="text-[14px] font-medium text-slate-600 mb-6 leading-relaxed">
                {dict.teamDashCelebDesc1}<strong className="text-slate-900">{dict.teamDashCelebDescStrong}</strong><span dangerouslySetInnerHTML={{ __html: dict.teamDashCelebDesc2.replace(/\\n/g, '<br/>') }} />
              </p>

              <button
                onClick={() => setShowCelebration(false)}
                className="w-full bg-[#8A2627] hover:bg-[#7A1F26] text-[#ffecd2] font-black text-[15px] h-[54px] rounded-[18px] transition-colors shadow-lg shadow-red-900/20 active:scale-[0.98]"
              >
                {dict.teamDashCelebBtn}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
