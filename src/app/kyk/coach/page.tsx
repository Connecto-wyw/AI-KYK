import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { KID_PROFILES, KidType } from '@/lib/kyk/scoring'
import { CoachChat } from '@/components/AI/CoachChat'

export default async function CoachPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let kidData = null

  if (user) {
    const { data } = await supabase
      .from('kids')
      .select('*')
      .eq('parent_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
      
    kidData = data
  }

  const isUntested = !kidData
  const profileTitle = kidData ? KID_PROFILES[kidData.kyk_result_type as KidType]?.title : '우리 아이'
  
  // Mock a safe profile object to pass TypeScript
  const profile = kidData ? KID_PROFILES[kidData.kyk_result_type as KidType] : {
    title: profileTitle,
    mbti: '', animalType: '', summary: '', strengths: [], carePoints: [], approaches: []
  } as unknown as any // Bypass strict typing for untested dummy profile

  const concern = kidData?.main_concern || '양육 고민'

  return (
    <div className="flex flex-col min-h-screen bg-white p-4 lg:p-8 overflow-hidden relative pb-[100px] lg:pb-8">
      <div className="w-full max-w-2xl mx-auto pt-4 lg:pt-8 h-full flex flex-col flex-1">
        <h1 className="text-[14px] lg:text-base font-bold text-slate-400 mb-4 px-2 tracking-tight">
          AI 코치에게 물어보기
        </h1>
        
        <div className="flex-1 w-full relative z-10 flex flex-col">
          <CoachChat profile={profile} concern={concern} kidId={kidData?.id} isUntested={isUntested} />
        </div>
      </div>
    </div>
  )
}
