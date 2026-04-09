import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle, ArrowRight, BookOpen, BarChart2, Bell, Settings, AlertCircle, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { KID_PROFILES, KidType } from '@/lib/kyk/scoring'
import { cookies } from 'next/headers'
import { dictionaries } from '@/lib/i18n/dictionaries'

export default async function MyPage() {
  const cookieStore = await cookies()
  const langValue = cookieStore.get('kyk-lang')?.value || 'ko'
  const langKey = Object.keys(dictionaries).includes(langValue) ? (langValue as keyof typeof dictionaries) : 'ko'
  const dict = dictionaries[langKey]

  const CURATED_LINKS = [
    {
      title: dict.myCuratedTitle1,
      author: dict.myCuratedAuthor1,
      category: dict.myCuratedCat1,
      colorUrl: 'bg-brand-yellow/20',
      image: '/img/curated/my_1.png',
      url: '#'
    },
    {
      title: dict.myCuratedTitle2,
      author: dict.myCuratedAuthor2,
      category: dict.myCuratedCat2,
      colorUrl: 'bg-brand-blue/20',
      image: '/img/curated/my_2.png',
      url: '#'
    },
    {
      title: dict.myCuratedTitle3,
      author: dict.myCuratedAuthor3,
      category: dict.myCuratedCat3,
      colorUrl: 'bg-brand-yellowgreen/20',
      image: '/img/curated/my_3.png',
      url: '#'
    }
  ]

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/kyk/gate')
  }

  const { data: kidData } = await supabase
    .from('kyk_results')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: memory } = kidData ? await supabase
    .from('kid_memories')
    .select('summary_context')
    .eq('kid_id', kidData.id)
    .maybeSingle() : { data: null }

  const hasMemory = !!memory?.summary_context
  const memorySummary = memory?.summary_context || dict.myMemoryFallback

  let profile = null
  let childName = dict.myDefaultChild
  let subTitle = dict.myDefaultSubtitle
  let currentConcern = dict.myNoDiag

  if (kidData) {
    profile = KID_PROFILES[kidData.result_type as KidType]
    childName = profile.title

    const birthYear = kidData.answers?.step3?.birthYear
    const currentYear = new Date().getFullYear()
    const age = birthYear ? `${currentYear - parseInt(birthYear) + 1}${dict.myAgeSuffix}` : ''

    const genderRaw = kidData.answers?.step3?.gender
    const genderDisplay =
      [dict.step3Boy, '남아'].includes(genderRaw) ? dict.myChildBoy :
      [dict.step3Girl, '여아'].includes(genderRaw) ? dict.myChildGirl :
      ''

    const username = user.email?.split('@')[0] || ''
    subTitle = `${dict.mySubtitleOf.replace('{name}', username)} ${age ? `· ${age}` : ''} ${genderDisplay ? `· ${genderDisplay}` : ''}`.trim()

    const concernRaw = kidData.answers?.step3?.concern
    currentConcern = concernRaw && concernRaw !== dict.concernDefault && concernRaw !== '특별한 고민은 없어요'
      ? concernRaw
      : dict.concernFallback
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-slate-50 lg:bg-slate-100 pb-[100px] lg:pb-12 w-full font-sans">
      <div className="w-full max-w-2xl mx-auto px-5 lg:px-4 pt-4 lg:pt-8 space-y-8 flex-1">
        
        <div className="px-1">
          <p className="text-[11px] font-bold text-brand-red1 tracking-widest uppercase mb-1">{dict.myPageEditorial}</p>
          <h2 className="text-[32px] font-extrabold text-slate-900 tracking-tight">{dict.myPageTitle}</h2>
        </div>

        {/* ==============================================
            SECTION 1: Profile & Current Concern
            ============================================== */}
        <section className="relative w-full bg-white rounded-[40px] shadow-sm overflow-hidden p-6 lg:p-8 mt-4">
          {/* Top Right Blob / Premium Badge Area */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red1/5 rounded-bl-full pointer-events-none" />
          <div className="absolute top-6 right-6 px-3 py-1 bg-brand-red1/10 text-brand-red1 text-[11px] font-extrabold tracking-wider rounded-full flex items-center gap-1">
            {dict.myPremium}
          </div>

          <div className="relative z-10 pt-2 mb-6">
            <h1 className="text-[26px] font-extrabold text-slate-900 tracking-tight leading-tight mb-1">
              {childName}
            </h1>
            <p className="text-[14px] font-medium text-slate-500">
              {subTitle}
            </p>
          </div>

          {kidData ? (
            <div className="bg-slate-50/80 rounded-3xl p-5 border border-slate-100/50">
              <div className="flex items-center gap-1.5 mb-2.5">
                <AlertCircle className="w-3.5 h-3.5 text-brand-red2" />
                <span className="text-[11px] font-extrabold text-brand-red2 tracking-wide uppercase">
                  {dict.myRecentConcern}
                </span>
              </div>
              <p className="text-[16px] font-bold text-slate-800 leading-snug break-keep mb-5">
                {currentConcern}
              </p>
              
              <div className="flex items-center gap-2 mt-2">
                <Link 
                  href="/kyk/result" 
                  className="w-full h-[46px] bg-slate-900 hover:bg-slate-800 text-white font-bold text-[14px] rounded-2xl shadow-sm transition-all flex items-center justify-center flex-1"
                >
                  {dict.myReviewResult}
                </Link>
                <Link 
                  href="/kyk/step1" 
                  className="w-full h-[46px] bg-white border border-slate-200 text-slate-700 font-bold text-[14px] rounded-2xl shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center flex-1"
                >
                  {dict.myRetakeTest}
                </Link>
              </div>
            </div>
          ) : (
             <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-100/50 text-center">
              <p className="text-[14px] font-medium text-slate-600 mb-4">{dict.myNoRecord}</p>
              <Link 
                href="/kyk/step1" 
                className="w-full h-[48px] bg-brand-red1 hover:bg-brand-red2 text-white font-bold text-[14.5px] rounded-full shadow-sm transition-all flex items-center justify-center"
              >
                {dict.myTakeTest}
              </Link>
            </div>
          )}
        </section>

        {/* ==============================================
            SECTION 2: AI Coach Note (Bubble)
            ============================================== */}
        <section className="px-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-[32px] h-[32px] rounded-xl bg-brand-lightblue flex items-center justify-center shrink-0 shadow-sm border-2 border-slate-50">
              <Sparkles className="w-4 h-4 text-brand-blue" />
            </div>
            <h3 className="text-[16px] font-extrabold text-slate-900">
              {dict.myAiCoachNote}
            </h3>
          </div>
          
          <div className="bg-brand-lightblue/10 rounded-[32px] rounded-tl-xl p-6 relative">
            <p className="text-[15px] text-slate-800 leading-[1.6] font-medium italic break-keep mb-5">
              "{memorySummary}"
            </p>
            <div className="flex justify-end">
              <Link
                href="/kyk/coach"
                className="inline-flex items-center text-[13.5px] font-bold text-brand-blue hover:opacity-80 transition-opacity"
              >
                {hasMemory ? dict.myContinueChat : dict.myStartChat} 
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* ==============================================
            SECTION 3: Curated Content List
            ============================================== */}
        <section>
          <div className="flex items-end justify-between px-1 mb-4">
            <h3 className="text-[20px] font-extrabold text-slate-900">
              {dict.myArticle}
            </h3>
            <button className="text-[13px] font-semibold text-slate-400 hover:text-slate-600">
              {dict.myViewAll}
            </button>
          </div>
          
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar -mx-5 px-5 lg:-mx-1 lg:px-1">
            {CURATED_LINKS.map((link, i) => (
              <a key={i} href={link.url} className="shrink-0 w-[240px] snap-center">
                <div className="bg-white rounded-[32px] overflow-hidden shadow-sm h-full flex flex-col active:scale-[0.98] transition-transform">
                  <div className={`w-full h-[140px] relative ${link.colorUrl} flex items-center justify-center shrink-0 overflow-hidden`}>
                    {link.image ? (
                      <Image src={link.image} alt={link.title} fill className="object-cover" />
                    ) : (
                      <Image src="/symbol.png" alt="thumbnail" width={40} height={40} className="opacity-20 mix-blend-multiply" />
                    )}
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <span className="w-fit mb-3 px-2.5 py-1 bg-brand-lightblue/20 text-brand-blue text-[10px] font-extrabold tracking-widest rounded-full uppercase">
                      {link.category}
                    </span>
                    <h4 className="text-[15.5px] font-bold text-slate-900 leading-[1.3] break-keep mb-4 flex-1">
                      {link.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-auto">
                      <div className="w-5 h-5 rounded-full bg-slate-200" />
                      <span className="text-[11px] font-medium text-slate-500">{link.author}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ==============================================
            SECTION 4: Utilities / Settings List
            ============================================== */}
        <section className="bg-white rounded-[32px] shadow-sm overflow-hidden divide-y divide-slate-50 p-2">
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-[42px] h-[42px] rounded-full bg-brand-lightblue/10 flex items-center justify-center group-hover:bg-brand-blue/10 transition-colors">
                <BookOpen className="w-[18px] h-[18px] text-brand-blue" />
              </div>
              <span className="text-[16px] font-bold text-slate-800">{dict.myMenuPremium}</span>
            </div>
            <ArrowRight className="w-[18px] h-[18px] text-slate-300 group-hover:text-brand-blue" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-[42px] h-[42px] rounded-full bg-brand-yellowgreen/10 flex items-center justify-center group-hover:bg-brand-yellowgreen/20 transition-colors">
                <BarChart2 className="w-[18px] h-[18px] text-brand-forestgreen" />
              </div>
              <span className="text-[16px] font-bold text-slate-800">{dict.myMenuPast}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-brand-blue text-white text-[11px] font-bold">
                1
              </span>
              <ArrowRight className="w-[18px] h-[18px] text-slate-300 group-hover:text-brand-forestgreen" />
            </div>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-[42px] h-[42px] rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                <Bell className="w-[18px] h-[18px] text-slate-600" />
              </div>
              <span className="text-[16px] font-bold text-slate-800">{dict.myMenuAlert}</span>
            </div>
            <ArrowRight className="w-[18px] h-[18px] text-slate-300 group-hover:text-slate-600" />
          </button>

          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-[42px] h-[42px] rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                <Settings className="w-[18px] h-[18px] text-slate-600" />
              </div>
              <span className="text-[16px] font-bold text-slate-800">{dict.myMenuSetting}</span>
            </div>
            <ArrowRight className="w-[18px] h-[18px] text-slate-300 group-hover:text-slate-600" />
          </button>
          
        </section>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  )
}
