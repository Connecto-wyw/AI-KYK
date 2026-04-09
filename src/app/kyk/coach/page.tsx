import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { KID_PROFILES, KidType } from '@/lib/kyk/scoring'
import { CoachChat } from '@/components/AI/CoachChat'
import { cookies } from 'next/headers'
import { dictionaries } from '@/lib/i18n/dictionaries'

export default async function CoachPage() {
  const cookieStore = await cookies()
  const langValue = cookieStore.get('kyk-lang')?.value || 'ko'
  const langKey = Object.keys(dictionaries).includes(langValue) ? (langValue as keyof typeof dictionaries) : 'ko'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dict = dictionaries[langKey as keyof typeof dictionaries] as any

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let kidData = null

  if (user) {
    const { data } = await supabase
      .from('kyk_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
      
    kidData = data
  }

  const isUntested = !kidData
  const profileTitle = kidData ? KID_PROFILES[kidData.result_type as KidType]?.title : '우리 아이'
  
  // Mock a safe profile object to pass TypeScript
  const profile = kidData ? KID_PROFILES[kidData.result_type as KidType] : {
    title: profileTitle,
    mbti: '', animalType: '', summary: '', strengths: [], carePoints: [], approaches: []
  } as unknown as any // Bypass strict typing for untested dummy profile

  const concern = kidData?.concern || '양육 고민'

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 lg:bg-slate-100 overflow-hidden relative pb-[80px] lg:pb-8 w-full font-sans">
      <div className="w-full max-w-2xl mx-auto h-full flex flex-col flex-1 px-5 lg:px-4 pt-4 lg:pt-8 space-y-8 pb-4 lg:pb-0">
        <div className="px-1">
          <p className="text-[11px] font-bold text-brand-red1 tracking-widest uppercase mb-1">{dict.coachEditorial}</p>
          <h2 className="text-[32px] font-extrabold text-slate-900 tracking-tight">{dict.coachTitle}</h2>
        </div>
        <div className="flex-1 w-full relative z-10 flex flex-col min-h-0 bg-white rounded-[40px] shadow-sm overflow-hidden mb-4">
          <CoachChat profile={profile} concern={concern} kidId={kidData?.id} isUntested={isUntested} />
        </div>
      </div>
    </div>
  )
}
