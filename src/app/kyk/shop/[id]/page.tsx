import Image from 'next/image'
import Link from 'next/link'
import { Reply, ShoppingBag, Heart, CheckCircle2, Check } from 'lucide-react'
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

  const itemName = isPostpartum ? dict.shopItem2Name : isTableware ? dict.shopItem3Name : dict.shopItem1Name;
  const itemDesc = isPostpartum ? dict.shopItem2Sub : isTableware ? dict.shopItem3Sub : dict.shopItem1Desc;

  const trendTitle = isPostpartum ? dict.shopItem2TrendTitle : isTableware ? dict.shopItem3TrendTitle : dict.shopDetailTrendTitle;

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8F9] relative overflow-x-hidden pb-[100px] w-full max-w-[600px] mx-auto border-x border-slate-50 font-sans">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between px-5 py-4 bg-white z-50 sticky top-0">
        <Link href="/kyk/shop" className="text-[#AB3628] hover:opacity-80 transition-opacity">
          <Reply size={20} className="scale-x-[-1]" />
        </Link>
        <h1 className="text-[14px] font-extrabold text-[#AB3628] tracking-wide">
          TEAM 쇼핑 (BETA)
        </h1>
        <div className="w-5" /> {/* placeholder for right balance */}
      </div>

      {/* Main Image Section */}
      <div className="relative bg-[#F47C62] aspect-[4/3] max-h-[400px] w-full overflow-hidden">
        <Image 
          src={isPostpartum ? "/img/items/item-2.png" : isTableware ? "/img/items/item-3.png" : "/img/items/item-1.png"} 
          alt={itemName}
          fill
          className="object-cover"
        />
        
        {/* Bottom Target Tag Overlay from Original */}
        <div className="absolute bottom-0 left-0 w-full bg-[#EA678C]/90 py-3 z-10 backdrop-blur-sm">
          <span className="block text-center text-[15px] font-extrabold text-white tracking-widest">
            {dict.shopTagTarget}
          </span>
        </div>
      </div>

      {/* Product Details Card */}
      <div className="px-5 -mt-10 relative z-20">
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100">
          <div className="inline-block bg-[#8A2627] text-white text-[9px] font-extrabold px-3 py-1.5 rounded-full mb-4 tracking-widest uppercase shadow-sm">
            {dict.shopFeaturedBadge || "BEST SELLER"}
          </div>
          
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <h2 className="text-[22px] font-extrabold text-slate-900 leading-tight tracking-tight">
              {itemName}
            </h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
              {dict.shopJoinedCount.replace('{count}', '1')}
            </span>
          </div>

          <p className="text-[14px] text-slate-600 leading-relaxed font-medium mb-4">
            {itemDesc}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1.5 bg-blue-50 text-blue-500 text-[11px] font-extrabold rounded-md tracking-wide">
              {isPostpartum ? "# Postpartum" : isTableware ? "K-Kids Tableware" : dict.shopTagKoreanMom}
            </span>
            <span className="px-3 py-1.5 bg-blue-50 text-blue-500 text-[11px] font-extrabold rounded-md tracking-wide">
              {isPostpartum ? "Recovery Kit" : isTableware ? "Safe Mealtime" : dict.shopTagFreeGift}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-5 mb-4">
            <div className="flex items-baseline gap-2.5">
              <span className="text-[22px] font-extrabold text-[#AB3628]">$42.00</span>
              <span className="text-[14px] text-slate-300 font-bold line-through">$70.00</span>
            </div>
            <span className="text-[11px] font-extrabold text-[#436CA9] tracking-wider uppercase">
              {dict.shopTeamDiscount}
            </span>
          </div>
          
          {/* Restored Share Functionality inside Card */}
          <div className="flex items-center justify-between border-t border-slate-50 pt-4">
            <span className="text-[12px] font-extrabold text-slate-900">
              {dict.shopShareShare}
            </span>
            <ShareButton btnText={dict.shopShareBtn} copiedText={dict.shopShareCopied} />
          </div>
        </div>
      </div>

      {/* Team Deal Status */}
      <div className="px-5 mt-4">
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[13px] font-bold text-slate-900">{dict.shopTeamLabel}</span>
            <span className="px-2.5 py-1 bg-red-50 text-[#8A2627] text-[10px] font-extrabold rounded-md uppercase tracking-wider">Active</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full mb-3 overflow-hidden shadow-inner">
            <div className="h-full bg-[#8A2627] rounded-full w-[80%] relative overflow-hidden">
               <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
            </div>
          </div>
          <div className="flex justify-between items-center text-[11px] font-bold mb-5">
            <span className="text-slate-500">{dict.shopTeamCurrent}</span>
            <span className="text-[#8A2627]">{dict.shopTeamGoal}</span>
          </div>
          
          {/* Avatar Row */}
          <div className="flex items-center gap-0">
            {[
              { bg: '#FFCDB2', fg: '#8A4030' },
              { bg: '#B5D5C5', fg: '#2D6A4F' },
              { bg: '#C9B8E8', fg: '#5C4B8A' },
              { bg: '#F7DCB4', fg: '#8A6030' },
            ].map((color, i) => (
              <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center${i > 0 ? ' -ml-2' : ''} shadow-sm`} style={{ zIndex: 10 - i, backgroundColor: color.bg }}>
                <svg viewBox="0 0 24 24" fill={color.fg} className="w-4 h-4">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 -ml-2 shadow-sm z-0">
              +1
            </div>
          </div>
        </div>
      </div>

      {/* Feature List block (Restored Original Content node mapping) */}
      <div className="px-5 mt-8 mb-8">
        <div className="border border-slate-100 rounded-[20px] overflow-hidden shadow-sm bg-white">
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
                {trendTitle}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 max-w-[240px] leading-relaxed">
                {isPostpartum ? dict.shopItem2TrendDesc : isTableware ? dict.shopItem3TrendDesc : "One bottle, head-to-toe comfort — inspired by Korean moms' gentle daily routines."}
              </p>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-3">
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

      <div className="px-6 pb-28">
        <Link href="/kyk/shop" className="text-[12px] font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1.5 transition-colors">
          <Reply size={14} className="scale-x-[-1]" />
          {dict.shopBackToTeam}
        </Link>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-[50%] -translate-x-[50%] z-50 w-full max-w-[600px] bg-white pt-4 pb-6 px-6 border-t border-slate-100 flex items-center justify-between gap-5 shadow-[0_-10px_40px_rgba(0,0,0,0.06)] rounded-t-[24px]">
        <div className="flex flex-col items-center justify-center gap-1.5 min-w-[70px]">
          {/* Changed this back to standard sharing or kept static info */}
          <Heart size={24} className="text-[#999999]" strokeWidth={2}/>
          <span className="text-[8px] font-extrabold text-[#999999] uppercase tracking-wider text-center">
            LIKE
          </span>
        </div>
        <button className="flex-1 bg-[#8A2627] text-white rounded-[20px] py-[15px] flex items-center justify-center gap-2.5 font-extrabold text-[14px] shadow-lg shadow-red-900/25 active:scale-[0.98] transition-all hover:bg-[#7A1F26] uppercase">
          <ShoppingBag size={18} strokeWidth={2.5}/>
          {dict.shopTeamJoin || "ADD TO TEAM BAG"}
        </button>
      </div>

    </div>
  )
}
