import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { KID_PROFILES, KidType } from '@/lib/kyk/scoring'
import { CoachChat } from '@/components/AI/CoachChat'

export default async function CoachPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/kyk/gate')
  }

  // Fetch the latest kid profile for this parent
  const { data: kidData } = await supabase
    .from('kids')
    .select('*')
    .eq('parent_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!kidData) {
    // If no kid found, they must take the test
    redirect('/kyk/step1')
  }

  const resultType = kidData.kyk_result_type as KidType
  const profile = KID_PROFILES[resultType]

  return (
    <div className="flex flex-col min-h-screen bg-brand-white p-4 lg:p-8 overflow-hidden relative pb-[100px] lg:pb-8">
      <div className="w-full max-w-2xl mx-auto pt-4 lg:pt-8 h-full flex flex-col flex-1">
        <h1 className="text-[14px] lg:text-base font-bold text-slate-400 mb-4 px-2 tracking-tight">
          AI 코치에게 물어보기
        </h1>
        
        <div className="flex-1 w-full relative z-10 flex flex-col">
          <CoachChat profile={profile} concern={kidData.main_concern || '양육 고민'} kidId={kidData.id} />
        </div>
      </div>
    </div>
  )
}
