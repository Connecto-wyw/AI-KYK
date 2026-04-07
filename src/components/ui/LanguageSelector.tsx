'use client'

import { useEffect, useState } from 'react'
import { Language, useLanguageStore } from '@/store/useLanguageStore'
import { Globe, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'ms', label: 'Bahasa Melayu' },
  { code: 'id', label: 'B. Indonesia' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'th', label: 'ไทย' },
]

export function LanguageSelector({ className }: { className?: string }) {
  const { language, setLanguage, initialize } = useLanguageStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    initialize()
    setMounted(true)
  }, [initialize])

  if (!mounted) {
    return <div className="h-[48px] opacity-0" />
  }

  return (
    <div className={cn("relative flex items-center justify-center gap-2", className)}>
      <div className="relative group flex items-center bg-white/50 hover:bg-white border border-slate-200 rounded-full py-2 px-4 shadow-sm hover:shadow transition-all">
        <Globe className="w-4 h-4 text-slate-500 mr-2" />
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="appearance-none bg-transparent hover:cursor-pointer outline-none text-[13px] font-semibold text-slate-700 pr-4 focus:ring-0"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
      </div>
    </div>
  )
}
