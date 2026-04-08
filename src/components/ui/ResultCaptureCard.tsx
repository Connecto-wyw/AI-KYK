'use client'

import React, { useRef } from 'react'
import html2canvas from 'html2canvas'
import { Download, Sparkles } from 'lucide-react'

export function ResultCaptureCard({ children }: { children: React.ReactNode }) {
  const targetRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (!targetRef.current) return
    
    // Add a temporary subtle flash for feedback
    targetRef.current.style.opacity = '0.7'
    setTimeout(() => {
      if (targetRef.current) targetRef.current.style.opacity = '1'
    }, 150)

    try {
      const canvas = await html2canvas(targetRef.current, {
        scale: 2, 
        useCORS: true,
        backgroundColor: null,
      })
      const link = document.createElement('a')
      link.download = 'kyk_profile_card.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Failed to capture image:', err)
      alert("이미지 저장에 실패했습니다.")
    }
  }

  return (
    <div className="relative group antialiased">
       <div 
         ref={targetRef} 
         className="transition-opacity duration-200"
       >
          {children}
          
          {/* Invisible watermark that only shows in snapshot (we force visibility via CSS if needed, but here we just overlay it inside the card permanently so it looks like part of the design) */}
          <div className="absolute top-6 left-6 opacity-30 flex items-center gap-1 cursor-default pointer-events-none">
            <Sparkles size={12} className="text-white" />
            <span className="text-white text-[10px] font-black tracking-widest uppercase">KYK.AI PRO</span>
          </div>
       </div>

       {/* Download Trigger */}
       <div className="absolute -bottom-5 right-6 z-20">
         <button 
           onClick={handleDownload}
           className="bg-white hover:bg-slate-50 text-slate-800 shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_25px_rgba(255,94,94,0.2)] rounded-full px-5 py-2.5 text-[13px] font-bold flex items-center gap-2 transition-all active:scale-95 border-2 border-transparent hover:border-brand-red1"
         >
           <Download size={16} className="text-brand-red1" />
           이미지 저장
         </button>
       </div>
    </div>
  )
}
