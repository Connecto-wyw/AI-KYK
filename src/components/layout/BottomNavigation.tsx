'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, MessageCircle, BarChart2, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const NAV_ITEMS = [
  { name: 'KYK 진단', href: '/kyk', icon: Sparkles },
  { name: 'AI 코치', href: '/kyk/coach', icon: MessageCircle, disabled: false },
  { name: '성장 플랜', href: '#report', icon: BarChart2, disabled: true },
  { name: '마이', href: '#my', icon: User, disabled: true }
]

export function BottomNavigation() {
  const pathname = usePathname()
  
  // Hide mobile bottom nav on survey step pages or specific flows (Distraction-free Focus Mode)
  const isSurveyFlow = pathname?.includes('/step') || pathname?.includes('/gate') || pathname?.includes('/saving')

  const handleDisabledClick = (e: React.MouseEvent) => {
    e.preventDefault()
    alert('곧 출시될 예정입니다! 기대해 주세요 🚀')
  }

  return (
    <>
      {/* Mobile Bottom Navigation (Hidden during surveys) */}
      {!isSurveyFlow && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-brand-red1 pb-[env(safe-area-inset-bottom)] lg:hidden shadow-[0_-5px_25px_rgba(0,0,0,0.15)]">
          <div className="flex items-center justify-around h-16 w-full max-w-md mx-auto px-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = item.href === '/kyk' ? pathname === '/kyk' : pathname?.startsWith(item.href)
              
              if (item.disabled) {
                return (
                  <button
                    key={item.name}
                    onClick={handleDisabledClick}
                    className="flex flex-col items-center justify-center w-full h-full space-y-1 text-white/50 hover:text-white/70 transition-colors"
                  >
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
                  </button>
                )
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 relative",
                    isActive ? "text-white" : "text-white/60 hover:text-white/90"
                  )}
                >
                  {isActive && (
                    <span className="absolute -top-[17px] w-12 h-1.5 rounded-b-full bg-white shadow-sm" />
                  )}
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={cn(isActive && "drop-shadow-sm")} />
                  <span className={cn("text-[10px] tracking-wide", isActive ? "font-bold" : "font-medium")}>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </nav>
      )}

      {/* PC Side Navigation (Always visible, Colored) */}
      <div className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 bg-brand-red1 flex-col z-50 text-white shadow-2xl">
        <div className="p-8 pb-6">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6 p-2 ring-4 ring-white/10">
            <img src="/symbol.png" alt="KYK Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">KYK</h2>
          <p className="text-[13px] font-bold text-white/70 mb-6 tracking-wider uppercase">Know Your Kids</p>
        </div>
        
        <div className="flex-1 px-4 space-y-2.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = item.href === '/kyk' ? pathname === '/kyk' : pathname?.startsWith(item.href)
            
            if (item.disabled) {
              return (
                <button
                  key={item.name}
                  onClick={handleDisabledClick}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-white/50 hover:bg-white/5 transition-colors text-left"
                >
                  <Icon size={20} />
                  <span className="font-semibold text-[15px]">{item.name}</span>
                  <span className="ml-auto text-[10px] font-bold bg-white/10 text-white/70 px-2.5 py-1 rounded-full uppercase tracking-wider">Soon</span>
                </button>
              )
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200",
                  isActive 
                    ? "bg-white text-brand-red1 shadow-lg font-bold" 
                    : "text-white/70 hover:bg-white/10 hover:text-white font-medium"
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[15px]">
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>
        
        {/* Footer info on sidebar */}
        <div className="p-6 text-white/40 text-[11px] font-medium tracking-wide">
          <p>© 2026 KYK Platform</p>
          <p className="mt-1 opacity-70">Powered by Connecto</p>
        </div>
      </div>
    </>
  )
}
