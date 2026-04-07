import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BottomNavigation } from '@/components/layout/BottomNavigation'
import { LanguageSelector } from '@/components/ui/LanguageSelector'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KYK | AI 부모 코치',
  description: '우리아이 맞춤형 분석 KYK 엔진',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.className} min-h-[100dvh] bg-white text-brand-black antialiased`}>
        <div className="flex w-full min-h-[100dvh]">
          <BottomNavigation />
          <main className="flex-1 w-full bg-white min-h-[100dvh] overflow-x-hidden relative flex flex-col lg:pl-64">
            <div className="flex-1 shrink-0 w-full h-full flex flex-col">
              {children}
            </div>
            <footer className="w-full flex justify-center py-6 pb-[100px] lg:pb-8 bg-white border-t border-slate-50 relative z-20">
              <LanguageSelector />
            </footer>
          </main>
        </div>
      </body>
    </html>
  )
}
