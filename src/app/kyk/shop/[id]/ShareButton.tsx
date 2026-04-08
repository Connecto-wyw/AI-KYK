'use client'

import { useState } from 'react'
import { Share, Check } from 'lucide-react'

export function ShareButton({ btnText, copiedText }: { btnText: string, copiedText: string }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.warn("Failed to copy", err)
    }
  }

  return (
    <button 
      onClick={handleShare}
      className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 py-2 text-[12px] font-bold flex items-center gap-1.5 transition-colors active:scale-95"
    >
      {copied ? <Check size={14} className="text-green-400" /> : <Share size={14} />}
      {copied ? copiedText : btnText}
    </button>
  )
}
