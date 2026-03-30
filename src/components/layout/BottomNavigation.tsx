'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, MessageCircle, BarChart2, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const NAV_ITEMS = [
  { name: 'KYK 진단', href: '/kyk', icon: Sparkles },
  { name: 'AI 코치', href: '/kyk/coach', icon: MessageCircle, disabled: false },
  { name: '성장 리포트', href: '#report', icon: BarChart2, disabled: true },
  { name: '마이', href: '#my', icon: User, disabled: true }
]

export function BottomNavigation() {
  const pathname = usePathname()
  
  // Hide navigation on survey step pages or specific flows where we don't want distraction
  if (pathname?.includes('/step') || pathname?.includes('/gate') || pathname?.includes('/saving')) {
    return null
  }

  const handleDisabledClick = (e: React.MouseEvent) => {
    e.preventDefault()
    alert('곧 출시될 예정입니다! 기대해 주세요 🚀')
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 pb-[env(safe-area-inset-bottom)] lg:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-around h-16 w-full max-w-md mx-auto px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            // Match exactly /kyk or starts with /kyk/coach
            const isActive = item.href === '/kyk' ? pathname === '/kyk' : pathname?.startsWith(item.href)
            
            if (item.disabled) {
              return (
                <button
                  key={item.name}
                  onClick={handleDisabledClick}
                  className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-400 hover:text-slate-500 transition-colors"
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
                  isActive ? "text-brand-red1" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {isActive && (
                  <span className="absolute -top-3 w-10 h-1 rounded-full bg-brand-red1" />
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

      {/* PC Side Navigation */}
      <div className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-slate-100 flex-col z-50">
        <div className="p-8 pb-4">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center border border-slate-50 mb-6 p-2">
            <img src="/symbol.png" alt="KYK Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">KYK</h2>
          <p className="text-[13px] font-bold text-slate-400 mb-8 tracking-wider uppercase">Know Your Kids</p>
        </div>
        
        <div className="flex-1 px-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = item.href === '/kyk' ? pathname === '/kyk' : pathname?.startsWith(item.href)
            
            if (item.disabled) {
              return (
                <button
                  key={item.name}
                  onClick={handleDisabledClick}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-400 hover:bg-slate-50 transition-colors text-left"
                >
                  <Icon size={20} />
                  <span className="font-semibold text-[15px]">{item.name}</span>
                  <span className="ml-auto text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">Soon</span>
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
                    ? "bg-brand-red1/5 text-brand-red1" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className={cn("font-semibold text-[15px]", isActive ? "font-bold" : "font-medium")}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
