'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Reply, Zap, Lock, Globe, Gift, AlertCircle } from 'lucide-react'

// Dummy DB products for the form
const BUNDLE_PRODUCTS = [
  { id: 1, name: '데일리 프리미엄 에센셜 워시 세트', originalPrice: 65000, teamPrice: 39000, img: '/img/items/item-1.png', limit: 3, discountRate: 40 },
  { id: 2, name: '우리아이 산후조리 스타터 키트', originalPrice: 124000, teamPrice: 74400, img: '/img/items/item-2.png', limit: 3, discountRate: 40 },
  { id: 3, name: '안심 실리콘 유아용 식기 세트', originalPrice: 45000, teamPrice: 27000, img: '/img/items/item-3.png', limit: 3, discountRate: 40 },
]

export default function TeamShopBundlePage() {
  const router = useRouter()
  
  // Form State
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [teamName, setTeamName] = useState('')
  const [description, setDescription] = useState('')
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public')
  
  // UX State
  const [errorShake, setErrorShake] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateTeam = () => {
    // 1. Validate Form
    if (!selectedProduct) {
      setToastMsg('어떤 상품으로 진행할지 먼저 골라주세요!')
      setErrorShake(true)
      setTimeout(() => setErrorShake(false), 600)
      
      // Auto-hide toast after 3s
      setTimeout(() => setToastMsg(''), 3000)
      return
    }

    // 2. Intercept Login (Simulated)
    // To properly simulate, we check if logged in. For now, simulate hitting login gateway.
    const isMockLoggedIn = false // Toggle logic here or hook to actual auth store
    
    if (!isMockLoggedIn && !document.cookie.includes('supabase-auth-token')) {
       // In a real app we'd trigger actual Auth Modal. 
       // For this MVP UX, we'll show our mock modal.
       setShowLoginModal(true)
       return
    }

    submitForm()
  }

  const submitForm = async () => {
    setIsSubmitting(true)

    // Simul processing delay
    await new Promise(r => setTimeout(r, 1200))
    // Generate mock DB team id
    const mockTeamId = `team-${Date.now()}`
    
    // In actual implementation, we do supabase insert here.
    // supabase.from('shop_teams').insert({ product_id, title, ...})
    
    router.push(`/kyk/shop/team/${mockTeamId}?new=true`)
  }

  // Active product derived state
  const activeProd = BUNDLE_PRODUCTS.find(p => p.id === selectedProduct)

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#fdfdfd] relative w-full max-w-[600px] mx-auto border-x border-slate-50 font-sans pb-[120px]">
      
      {/* 1. Header Navigation */}
      <div className="flex items-center justify-between px-5 py-4 bg-white/90 backdrop-blur-md z-40 sticky top-0 border-b border-slate-100">
        <Link href="/kyk/shop" className="text-[#AB3628] hover:opacity-80 transition-opacity">
          <Reply size={20} className="scale-x-[-1]" />
        </Link>
        <h1 className="text-[15px] font-extrabold text-[#AB3628] tracking-widest">
          TEAM 쇼핑 만들기
        </h1>
        <div className="w-5" /> 
      </div>

      {/* 2. Hero Motivation Section */}
      <section className="bg-gradient-to-br from-[#8A2627] to-[#C53324] px-6 py-10 relative overflow-hidden text-center shadow-inner">
        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-white/20 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-4 shadow-sm border border-white/10">
            <Gift size={14} className="text-[#ffecd2]" />
            <span className="text-[#ffecd2] text-[10px] items-center font-extrabold tracking-widest uppercase">팀장 단독 혜택</span>
          </div>
          <h2 className="text-[26px] font-black text-white leading-[1.25] tracking-tight mb-3 drop-shadow-md whitespace-pre-line">
            {"내가 먼저 팀을 열면\n가장 큰 할인율 + 시크릿 리워드!"}
          </h2>
          <p className="text-white/85 text-[14px] font-medium leading-relaxed max-w-[280px]">
            버튼 하나로 내 팀을 만들고, 친구 3명만 모으면 40% 할인이 즉시 확정됩니다.
          </p>
        </div>
        {/* Glow Effects */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
      </section>

      {/* 3. Form Sections */}
      <section className="px-5 py-8 flex flex-col gap-8">
        
        {/* Product Selection */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-black">1</div>
            <h3 className="text-[17px] font-extrabold text-slate-800">어떤 상품을 원하시나요? <span className="text-brand-red1">*</span></h3>
          </div>
          <p className="text-[13px] text-slate-500 font-medium pl-7 mb-2">원하는 상품을 선택하고 목표 인원을 확인하세요.</p>
          
          <div className="flex flex-col gap-4 pl-1">
            {BUNDLE_PRODUCTS.map((prod) => (
              <label 
                key={prod.id} 
                className={`relative flex items-center gap-4 p-4 rounded-[20px] border-2 cursor-pointer transition-all active:scale-[0.98] ${
                  selectedProduct === prod.id ? 'border-brand-red1 bg-red-50/30 shadow-md shadow-red-900/5' : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <input 
                  type="radio" 
                  name="productSelection" 
                  className="hidden" 
                  checked={selectedProduct === prod.id}
                  onChange={() => setSelectedProduct(prod.id)}
                />
                <div className="relative w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100 shadow-inner">
                  <Image src={prod.img} alt={prod.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-extrabold text-brand-red1 bg-brand-red1/10 px-2py-0.5 rounded-md leading-none h-4 flex items-center">{prod.limit}명 모집</span>
                    <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md leading-none h-4 flex items-center">{prod.discountRate}% 할인 ↓</span>
                  </div>
                  <h4 className="text-[14px] font-bold text-slate-800 leading-tight truncate">{prod.name}</h4>
                  <div className="flex items-end gap-1.5 mt-1">
                    <span className="text-[15px] font-black text-brand-red1">{prod.teamPrice.toLocaleString()}원</span>
                    <span className="text-[11px] font-semibold text-slate-400 line-through pb-[1px]">{prod.originalPrice.toLocaleString()}원</span>
                  </div>
                </div>

                {/* Check Icon */}
                <div className={`absolute top-1/2 -translate-y-1/2 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedProduct === prod.id ? 'bg-brand-red1 border-brand-red1' : 'border-slate-200 bg-slate-50'
                }`}>
                  {selectedProduct === prod.id && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-slate-100" />

        {/* Setup Options */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-black">2</div>
            <h3 className="text-[17px] font-extrabold text-slate-800">팀 정보 입력</h3>
          </div>
          
          <div className="pl-1 space-y-5">
            <div className="space-y-2">
              <label className="text-[12px] font-extrabold text-slate-600 ml-1">팀 이름 <span className="text-brand-red1">*</span></label>
              <input 
                type="text" 
                placeholder="우리 아이 첫 공동구매, 같이 할인받아요!" 
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-[16px] px-5 py-4 text-[14px] font-medium placeholder:text-slate-400 focus:outline-none focus:border-brand-red1 focus:ring-1 focus:ring-brand-red1 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[12px] font-extrabold text-slate-600 ml-1">한줄 안내 (선택)</label>
              <textarea 
                placeholder="어린이집 친구 엄마들 환영해요 😊" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-[16px] px-5 py-4 text-[14px] font-medium placeholder:text-slate-400 focus:outline-none focus:border-brand-red1 focus:ring-1 focus:ring-brand-red1 transition-all h-24 resize-none"
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-[12px] font-extrabold text-slate-600 ml-1">공개 범위 설정</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setPrivacy('public')}
                  className={`flex flex-col items-center justify-center gap-2 py-4 rounded-[16px] border-2 transition-all ${
                    privacy === 'public' ? 'border-slate-800 bg-slate-50 text-slate-900' : 'border-slate-100 hover:border-slate-200 text-slate-400'
                  }`}
                >
                  <Globe size={22} className={privacy === 'public' ? 'text-brand-blue' : ''} />
                  <span className="text-[13px] font-bold">전체 공개</span>
                </button>
                <button 
                  onClick={() => setPrivacy('private')}
                  className={`flex flex-col items-center justify-center gap-2 py-4 rounded-[16px] border-2 transition-all ${
                    privacy === 'private' ? 'border-slate-800 bg-slate-50 text-slate-900' : 'border-slate-100 hover:border-slate-200 text-slate-400'
                  }`}
                >
                  <Lock size={22} />
                  <span className="text-[13px] font-bold">링크 있는 사람만</span>
                </button>
              </div>
              <p className="text-[11px] font-medium text-slate-400 mt-2 px-2">
                {privacy === 'public' ? '쇼핑 메인 페이지에 노출되어 모르는 사람도 팀에 참가할 수 있습니다.' : '초대 링크를 전달받은 지인들만 팀에 참가할 수 있습니다.'}
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 z-50 w-full max-w-[600px] bg-white pt-4 pb-6 px-6 border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.06)] rounded-t-[24px]">
        {/* Expected Results Hint */}
        {activeProd && (
          <div className="flex justify-between items-center mb-3 px-1">
            <span className="text-[12px] font-extrabold text-slate-500">예상 할인 혜택</span>
            <div className="flex items-center gap-2">
               <span className="text-[12px] font-bold text-slate-400 line-through">{activeProd.originalPrice.toLocaleString()}원</span>
               <span className="text-[15px] font-black text-brand-red1">{activeProd.teamPrice.toLocaleString()}원 달성!</span>
            </div>
          </div>
        )}

        <button 
          onClick={handleCreateTeam}
          className={`relative overflow-hidden w-full bg-[#8A2627] text-white rounded-[20px] py-[16px] flex items-center justify-center gap-2 font-extrabold text-[15px] shadow-lg shadow-red-900/25 transition-all outline-none ${
            errorShake ? 'animate-[shake_0.4s_ease-in-out_1]' : 'active:scale-[0.98] hover:bg-[#7A1F26]'
          }`}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Zap size={18} strokeWidth={2.5} className="fill-current text-[#ffecd2]" />
              이 조건으로 팀 열고 40% 할인받기
            </>
          )}
        </button>
      </div>

      {/* Error Toast Notification */}
      <div className={`fixed bottom-[110px] left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[13px] font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-xl transition-all duration-300 z-50 ${
        toastMsg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <AlertCircle size={16} className="text-brand-red1" />
        {toastMsg}
      </div>

      {/* Intercept Login Mock Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-5">
           <div className="bg-white w-full max-w-[340px] rounded-[32px] p-7 flex flex-col items-center text-center shadow-2xl scale-[1] animate-in fade-in zoom-in duration-200">
             <div className="w-16 h-16 bg-brand-red1/10 rounded-full flex items-center justify-center mb-5">
                <Lock className="w-7 h-7 text-brand-red1" />
             </div>
             <h3 className="text-[20px] font-black text-slate-900 mb-2 leading-tight">로그인하고<br/>최대 할인을 챙기세요!</h3>
             <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-6">
                안전한 공동구매 진행과 결제 정보 확인을 위해 로그인이 필요합니다.
             </p>
             <button 
                onClick={() => {
                   setShowLoginModal(false)
                   document.cookie = "supabase-auth-token=mock; path=/"
                   submitForm()
                }}
                className="w-full bg-[#fae100] hover:bg-[#eed500] text-[#371d1e] font-extrabold text-[15px] py-[15px] rounded-[18px] transition-colors flex items-center justify-center gap-2 shadow-sm"
             >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4c-4.97 0-9 3.18-9 7.1 0 2.54 1.7 4.76 4.2 5.96-.2.72-.75 2.68-.78 2.87-.04.22.12.22.25.13.1-.07 3.08-2.02 4.3-2.84.66.1 1.33.15 2.03.15 4.97 0 9-3.18 9-7.1S16.97 4 12 4Z"/></svg>
                카카오로 3초 만에 계속하기
             </button>
             <button 
                onClick={() => setShowLoginModal(false)}
                className="mt-4 text-[13px] font-bold text-slate-400 hover:text-slate-600 underline underline-offset-2"
             >
                다음에 할게요
             </button>
           </div>
        </div>
      )}

      {/* Global Style for Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}} />

    </div>
  )
}
