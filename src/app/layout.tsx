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
            <div className="flex-1 shrink-0 w-full flex flex-col items-center pb-[80px] lg:pb-0 relative z-10 w-full overflow-hidden">
              {children}
            </div>
            
            <footer className="w-full flex justify-center py-6 pb-24 lg:pb-12 bg-transparent absolute bottom-0 left-0 right-0 z-0 select-none pointer-events-none">
              <div className="pointer-events-auto">
                <LanguageSelector />
              </div>
            </footer>
          </main>
        </div>
      </body>
    </html>
  )
}
