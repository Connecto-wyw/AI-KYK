import Image from 'next/image'
import Link from 'next/link'
import { Check, Reply, Heart, CheckCircle2 } from 'lucide-react'
import { cookies } from 'next/headers'
import { dictionaries } from '@/lib/i18n/dictionaries'
import { ShareButton } from './ShareButton'

export default async function ShopItemPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const isPostpartum = resolvedParams.id === '2'
  const isTableware = resolvedParams.id === '3'
  
  const cookieStore = await cookies()
  const langValue = cookieStore.get('kyk-lang')?.value || 'en'
  const langKey = Object.keys(dictionaries).includes(langValue) ? (langValue as keyof typeof dictionaries) : 'en'
  const dict = dictionaries[langKey]



  return (
    <div className="flex flex-col min-h-screen bg-white relative overflow-hidden pb-32 lg:pb-12 pt-8 w-full max-w-[600px] mx-auto border-x border-slate-50">
      
      {/* Top Header & Context */}
      <div className="px-6 mb-6">
        <h1 className="text-[20px] font-extrabold text-slate-900 tracking-tight leading-snug">
          {dict.shopSubheader}
        </h1>
      </div>

      <hr className="border-t border-slate-100/60 w-[calc(100%-3rem)] mx-auto mb-6" />

      {/* Main Image Banner */}
      <div className="w-[calc(100%-3rem)] mx-auto relative rounded-[20px] overflow-hidden aspect-[4/5] sm:aspect-[4/3] bg-slate-50 shadow-sm border border-slate-100 flex-shrink-0 mb-6 group">
        
        {/* Top Badge Overlay */}
        <div className="absolute top-0 left-0 w-full bg-slate-600/90 py-3 z-10">
          <span className="block text-center text-[12px] font-bold text-white tracking-widest uppercase">
            {dict.shopFeaturedBadge}
          </span>
        </div>

        <Image 
          src={isPostpartum ? "/img/items/item-2.png" : isTableware ? "/img/items/item-3.png" : "/img/items/item-1.png"} 
          alt={isPostpartum ? "Postpartum Care Starter Kit" : isTableware ? "K-Kids Silicone Tableware Set" : "Korean Daily Care Essential Shampoo"} 
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
        
        {/* Bottom Target Tag Overlay */}
        <div className="absolute bottom-0 left-0 w-full bg-[#EA678C]/90 py-3 z-10 backdrop-blur-sm">
          <span className="block text-center text-[15px] font-extrabold text-white tracking-widest">
            {dict.shopTagTarget}
          </span>
        </div>
      </div>

      {/* Main Title and Descriptors */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <h2 className="text-[24px] font-bold text-slate-900 tracking-tight leading-tight">
            {isPostpartum ? dict.shopItem2Name : isTableware ? dict.shopItem3Name : dict.shopItem1Name}
          </h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
            {dict.shopJoinedCount.replace('{count}', '1')}
          </span>
        </div>
        
        <p className="text-[14px] text-slate-600 leading-relaxed font-medium mb-4">
          {isPostpartum ? dict.shopItem2Sub : isTableware ? dict.shopItem3Sub : dict.shopItem1Desc}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1.5 bg-blue-50 text-blue-500 text-[11px] font-extrabold rounded-md tracking-wide">
            {isPostpartum ? "# Postpartum" : isTableware ? "K-Kids Tableware" : dict.shopTagKoreanMom}
          </span>
          <span className="px-3 py-1.5 bg-blue-50 text-blue-500 text-[11px] font-extrabold rounded-md tracking-wide">
            {isPostpartum ? "Recovery Kit" : isTableware ? "Safe Mealtime" : dict.shopTagFreeGift}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-5">
          <span className="text-[12px] font-medium text-slate-500">
            {dict.shopShareShare}
          </span>
          <ShareButton btnText={dict.shopShareBtn} copiedText={dict.shopShareCopied} />
        </div>
      </div>

      {/* Team Buy Challenge UI */}
      <div className="px-6 mb-8">
        <div className="bg-[#38bdf8] rounded-2xl p-6 flex flex-col items-center justify-center text-center text-white shadow-xl shadow-sky-500/10 border border-sky-400 relative overflow-hidden">
          {/* subtle background glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          
          <span className="text-[11px] font-bold tracking-widest uppercase mb-1 opacity-90">{dict.shopTeamLabel}</span>
          <h3 className="text-2xl font-extrabold tracking-tight mb-2">{dict.shopTeamDiscount}</h3>
          
          <div className="w-full bg-white/20 rounded-xl p-3 my-4 backdrop-blur-sm border border-white/10 flex flex-col gap-2 relative z-10 text-left">
            <div className="flex justify-between text-xs font-bold w-full">
              <span>{dict.shopTeamGoal}</span>
              <span>{dict.shopTeamCurrent}</span>
            </div>
            
            <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-300 rounded-full w-[80%] shadow-[0_0_10px_rgba(253,224,71,0.5)]" />
            </div>
            
            <p className="text-center text-[10.5px] mt-1 font-semibold opacity-90">{dict.shopTeamMessage}</p>
          </div>

          <button className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-[15px] max-w-[200px] w-full py-3 rounded-full shadow-lg transition-transform active:scale-95 relative z-10">
            {dict.shopTeamJoin}
          </button>
        </div>
      </div>

      {/* Feature List block */}
      <div className="px-6 mb-8">
        <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="bg-slate-50 border-b border-slate-100 p-5">
            <span className="text-[10px] font-extrabold text-slate-500 tracking-wider uppercase mb-1 block">
              {dict.shopDetailTrendSub}
            </span>
            <h3 className="text-[17px] font-extrabold text-slate-900 leading-snug">
              {dict.shopDetailTrendTitle}
            </h3>
          </div>

          <div className="p-5 flex items-center gap-4 border-b border-slate-50">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-red-500 text-lg">
              {isPostpartum ? "🏩" : isTableware ? "🍽️" : "🧴"}
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-slate-900">
                {isPostpartum ? dict.shopItem2TrendTitle : isTableware ? dict.shopItem3TrendTitle : "Korean Daily Care Essential"}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 max-w-[240px] leading-relaxed">
                {isPostpartum ? dict.shopItem2TrendDesc : isTableware ? dict.shopItem3TrendDesc : "One bottle, head-to-toe comfort — inspired by Korean moms' gentle daily routines."}
              </p>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-3 bg-white">
            
            {/* Dynamic Features Base on Kit Item */}
            {isPostpartum ? (
              <>
                <div className="border border-slate-100 rounded-xl p-4 flex gap-3 hover:bg-slate-50 transition-colors">
                  <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</div>
                  <div>
                    <h5 className="text-[13px] font-bold text-slate-900 mb-1 flex items-center gap-1.5">{dict.shopItem2F1Title}</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{dict.shopItem2F1Desc}</p>
                  </div>
                </div>
                <div className="border border-slate-100 rounded-xl p-4 flex gap-3 hover:bg-slate-50 transition-colors">
                  <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</div>
                  <div>
                    <h5 className="text-[13px] font-bold text-slate-900 mb-1 flex items-center gap-1.5">{dict.shopItem2F2Title}</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{dict.shopItem2F2Desc}</p>
                  </div>
                </div>
                <div className="border border-slate-100 rounded-xl p-4 flex gap-3 hover:bg-slate-50 transition-colors">
                  <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</div>
                  <div>
                    <h5 className="text-[13px] font-bold text-slate-900 mb-1 flex items-center gap-1.5">{dict.shopItem2F3Title}</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{dict.shopItem2F3Desc}</p>
                  </div>
                </div>
                <div className="border border-slate-100 rounded-xl p-4 flex gap-3 hover:bg-slate-50 transition-colors">
                  <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">4</div>
                  <div>
                    <h5 className="text-[13px] font-bold text-slate-900 mb-1 flex items-center gap-1.5">{dict.shopItem2F4Title}</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{dict.shopItem2F4Desc}</p>
                  </div>
                </div>
                <div className="border border-slate-100 rounded-xl p-4 flex gap-3 hover:bg-slate-50 transition-colors">
                  <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">5</div>
                  <div>
                    <h5 className="text-[13px] font-bold text-slate-900 mb-1 flex items-center gap-1.5">{dict.shopItem2F5Title}</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{dict.shopItem2F5Desc}</p>
                  </div>
                </div>
                {/* Bottom highlight box */}
                <div className="mt-3 bg-[#fdfafb] border border-[#fdeaef] rounded-xl p-5">
                  <h5 className="text-[12px] font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Heart size={16} className="text-[#EA678C]" />
                    {dict.shopItem2WhyTitle}
                  </h5>
                  <ul className="text-[11px] text-slate-600 space-y-2 font-medium">
                    <li className="flex items-center gap-2"><Check size={12} className="text-[#EA678C]" /> {dict.shopItem2WhyL1}</li>
                    <li className="flex items-center gap-2"><Check size={12} className="text-[#EA678C]" /> {dict.shopItem2WhyL2}</li>
                    <li className="flex items-center gap-2"><Check size={12} className="text-[#EA678C]" /> {dict.shopItem2WhyL3}</li>
                    <li className="flex items-center gap-2"><Check size={12} className="text-[#EA678C]" /> {dict.shopItem2WhyL4}</li>
                  </ul>
                  <p className="mt-4 pt-4 border-t border-[#fdeaef] text-[11px] font-bold text-slate-800 tracking-wide uppercase">
                    {dict.shopItem2WhyFooter}
                  </p>
                </div>
              </>
            ) : isTableware ? (
              <>
                <div className="border border-slate-100 rounded-xl p-4 flex gap-3 hover:bg-slate-50 transition-colors">
                  <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</div>
                  <div>
                    <h5 className="text-[13px] font-bold text-slate-900 mb-1 flex items-center gap-1.5">{dict.shopItem3F1Title}</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{dict.shopItem3F1Desc}</p>
                  </div>
                </div>
                <div className="border border-slate-100 rounded-xl p-4 flex gap-3 hover:bg-slate-50 transition-colors">
                  <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</div>
                  <div>
                    <h5 className="text-[13px] font-bold text-slate-900 mb-1 flex items-center gap-1.5">{dict.shopItem3F2Title}</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{dict.shopItem3F2Desc}</p>
                  </div>
                </div>
                <div className="border border-slate-100 rounded-xl p-4 flex gap-3 hover:bg-slate-50 transition-colors">
                  <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</div>
                  <div>
                    <h5 className="text-[13px] font-bold text-slate-900 mb-1 flex items-center gap-1.5">{dict.shopItem3F3Title}</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{dict.shopItem3F3Desc}</p>
                  </div>
                </div>
                <div className="border border-slate-100 rounded-xl p-4 flex gap-3 hover:bg-slate-50 transition-colors">
                  <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">4</div>
                  <div>
                    <h5 className="text-[13px] font-bold text-slate-900 mb-1 flex items-center gap-1.5">{dict.shopItem3F4Title}</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{dict.shopItem3F4Desc}</p>
                  </div>
                </div>
                <div className="border border-slate-100 rounded-xl p-4 flex gap-3 hover:bg-slate-50 transition-colors">
                  <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">5</div>
                  <div>
                    <h5 className="text-[13px] font-bold text-slate-900 mb-1 flex items-center gap-1.5">{dict.shopItem3F5Title}</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{dict.shopItem3F5Desc}</p>
                  </div>
                </div>
                {/* Bottom highlight box */}
                <div className="mt-3 bg-[#fdfafb] border border-[#fdeaef] rounded-xl p-5">
                  <h5 className="text-[12px] font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Heart size={16} className="text-[#EA678C]" />
                    {dict.shopItem3WhyTitle}
                  </h5>
                  <ul className="text-[11px] text-slate-600 space-y-2 font-medium">
                    <li className="flex items-center gap-2"><Check size={12} className="text-[#EA678C]" /> {dict.shopItem3WhyL1}</li>
                    <li className="flex items-center gap-2"><Check size={12} className="text-[#EA678C]" /> {dict.shopItem3WhyL2}</li>
                    <li className="flex items-center gap-2"><Check size={12} className="text-[#EA678C]" /> {dict.shopItem3WhyL3}</li>
                    <li className="flex items-center gap-2"><Check size={12} className="text-[#EA678C]" /> {dict.shopItem3WhyL4}</li>
                  </ul>
                  <p className="mt-4 pt-4 border-t border-[#fdeaef] text-[11px] font-bold text-slate-800 tracking-wide uppercase">
                    {dict.shopItem3WhyFooter}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="border border-slate-100 rounded-xl p-4 flex gap-3 hover:bg-slate-50 transition-colors">
                  <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</div>
                  <div>
                    <h5 className="text-[13px] font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                      {dict.shopF1Title}
                      <span className="text-xs">✅</span>
                    </h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{dict.shopF1Desc}</p>
                  </div>
                </div>

                <div className="border border-slate-100 rounded-xl p-4 flex gap-3 hover:bg-slate-50 transition-colors">
                  <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</div>
                  <div>
                    <h5 className="text-[13px] font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                      {dict.shopF2Title}
                      <span className="text-xs">☁️</span>
                    </h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{dict.shopF2Desc}</p>
                  </div>
                </div>

                <div className="border border-slate-100 rounded-xl p-4 flex gap-3 hover:bg-slate-50 transition-colors">
                  <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</div>
                  <div>
                    <h5 className="text-[13px] font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                      {dict.shopF3Title}
                      <span className="text-xs">👨‍👩‍👧</span>
                    </h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{dict.shopF3Desc}</p>
                  </div>
                </div>

                {/* Bottom check highlight box */}
                <div className="mt-3 bg-[#f8fbfa] border border-[#e8f5ed] rounded-xl p-5">
                  <h5 className="text-[12px] font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" />
                    {dict.shopWhyLove}
                  </h5>
                  <ul className="text-[11px] text-slate-600 space-y-2 font-medium">
                    <li className="flex items-center gap-2"><Check size={12} className="text-green-500" /> {dict.shopWhyL1}</li>
                    <li className="flex items-center gap-2"><Check size={12} className="text-green-500" /> {dict.shopWhyL2}</li>
                    <li className="flex items-center gap-2"><Check size={12} className="text-green-500" /> {dict.shopWhyL3}</li>
                    <li className="flex items-center gap-2"><Check size={12} className="text-green-500" /> {dict.shopWhyL4}</li>
                  </ul>
                  <p className="mt-4 pt-4 border-t border-[#e8f5ed] text-[11px] font-bold text-slate-800">
                    {dict.shopWhyFooter}
                  </p>
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      <div className="px-6 pb-8">
        <Link href="/kyk/shop" className="text-[12px] font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1.5 transition-colors">
          <Reply size={14} className="scale-x-[-1]" />
          {dict.shopBackToTeam}
        </Link>
      </div>

    </div>
  )
}
