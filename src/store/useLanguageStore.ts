import { create } from 'zustand'

export type Language = 'ko' | 'en' | 'ms' | 'id' | 'vi' | 'th'

interface LanguageState {
  language: Language
  isInitialized: boolean
  setLanguage: (lang: Language) => void
  initialize: () => void
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: 'ko', // default
  isInitialized: false,
  setLanguage: (lang) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kyk-language', lang)
    }
    set({ language: lang })
  },
  initialize: () => {
    if (get().isInitialized || typeof window === 'undefined') return
    
    const stored = localStorage.getItem('kyk-language') as Language
    if (stored && ['ko', 'en', 'ms', 'id', 'vi', 'th'].includes(stored)) {
      set({ language: stored, isInitialized: true })
      return
    }

    // Auto detect from browser
    const navLang = navigator.language.toLowerCase()
    let detected: Language = 'ko'
    if (navLang.startsWith('en')) detected = 'en'
    else if (navLang.startsWith('ms')) detected = 'ms'
    else if (navLang.startsWith('id')) detected = 'id'
    else if (navLang.startsWith('vi')) detected = 'vi'
    else if (navLang.startsWith('th')) detected = 'th'
    
    set({ language: detected, isInitialized: true })
    localStorage.setItem('kyk-language', detected)
  }
}))
