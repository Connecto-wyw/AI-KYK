import Image from 'next/image'
import Link from 'next/link'
import { Share2, Reply, ShoppingBag, Droplets, ShieldCheck, Leaf } from 'lucide-react'
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

  const f1Title = isPostpartum ? dict.shopItem2F1Title : isTableware ? dict.shopItem3F1Title : dict.shopF1Title;
  const f1Desc = isPostpartum ? dict.shopItem2F1Desc : isTableware ? dict.shopItem3F1Desc : dict.shopF1Desc;
  const f2Title = isPostpartum ? dict.shopItem2F2Title : isTableware ? dict.shopItem3F2Title : dict.shopF2Title;
  const f2Desc = isPostpartum ? dict.shopItem2F2Desc : isTableware ? dict.shopItem3F2Desc : dict.shopF2Desc;
  const f3Title = isPostpartum ? dict.shopItem2F3Title : isTableware ? dict.shopItem3F3Title : dict.shopF3Title;
  const f3Desc = isPostpartum ? dict.shopItem2F3Desc : isTableware ? dict.shopItem3F3Desc : dict.shopF3Desc;

  const trendTitle = isPostpartum ? dict.shopItem2TrendTitle : isTableware ? dict.shopItem3TrendTitle : dict.shopDetailTrendTitle;
  const whyLoveTitle = isPostpartum ? dict.shopItem2WhyTitle : isTableware ? dict.shopItem3WhyTitle : dict.shopWhyLove;

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
        <button className="text-[#AB3628] hover:opacity-80 transition-opacity">
          <Share2 size={20} />
        </button>
      </div>

      {/* Main Image Section */}
      <div className="relative bg-[#F47C62] aspect-[4/3] max-h-[400px] w-full overflow-hidden">
        <Image
          src={isPostpartum ? "/img/items/item-2.png" : isTableware ? "/img/items/item-3.png" : "/img/items/item-1.png"}
          alt={itemName}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Details Card */}
      <div className="px-5 -mt-10 relative z-20">
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100">
          <div className="inline-block bg-[#8A2627] text-white text-[9px] font-extrabold px-3 py-1.5 rounded-full mb-4 tracking-widest uppercase shadow-sm">
            {dict.shopFeaturedBadge || "BEST SELLER"}
          </div>
          <h2 className="text-[22px] font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
            {itemName}
          </h2>
          <div className="flex items-end justify-between pt-1 border-t border-slate-50">
            <div className="flex items-baseline gap-2.5 mt-4">
              <span className="text-[22px] font-extrabold text-[#AB3628]">$42.00</span>
              <span className="text-[14px] text-slate-300 font-bold line-through">$70.00</span>
            </div>
            <span className="text-[11px] font-extrabold text-[#436CA9] tracking-wider uppercase mb-1">
              {dict.shopTeamDiscount}
            </span>
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
            {[1,2,3,4].map((i) => (
              <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-slate-200 relative overflow-hidden ${i > 1 ? '-ml-2' : ''} shadow-sm`} style={{ zIndex: 10 - i }}>
                <Image src={`/img/parents/p${i}.jpg`} alt="avatar" fill className="object-cover" />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 -ml-2 shadow-sm z-0">
              +1
            </div>
          </div>
        </div>
      </div>

      {/* Why Parents Love It */}
      <div className="px-5 mt-8">
        <h3 className="text-[18px] font-extrabold text-slate-900 mb-5 tracking-tight">
          {whyLoveTitle}
        </h3>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Main Feature Box */}
          <div className="bg-[#F6F4F5] p-5 rounded-2xl col-span-2 shadow-sm border border-slate-50 hover:bg-[#F2EFF1] transition-colors">
            <div className="text-[#8A2627] mb-3">
               <ShieldCheck size={20} strokeWidth={2.5}/>
            </div>
            <h4 className="text-[14px] font-extrabold text-slate-900 mb-1.5">{f1Title}</h4>
            <p className="text-[11.5px] text-slate-500 leading-relaxed font-medium">{f1Desc}</p>
          </div>
          
          {/* Minor Feature Box 1 */}
          <div className="bg-[#F6F4F5] p-5 rounded-2xl shadow-sm border border-slate-50 hover:bg-[#F2EFF1] transition-colors">
            <div className="text-[#0A96CD] mb-3">
              <Droplets size={20} strokeWidth={2.5} />
            </div>
            <h4 className="text-[13px] font-extrabold text-slate-900 mb-1.5">{f2Title}</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{f2Desc}</p>
          </div>
          
          {/* Minor Feature Box 2 */}
          <div className="bg-[#F6F4F5] p-5 rounded-2xl shadow-sm border border-slate-50 hover:bg-[#F2EFF1] transition-colors">
            <div className="text-[#96BE28] mb-3">
              <Leaf size={20} strokeWidth={2.5}/>
            </div>
            <h4 className="text-[13px] font-extrabold text-slate-900 mb-1.5">{f3Title}</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{f3Desc}</p>
          </div>
        </div>
      </div>

      {/* Hero Black Block */}
      <div className="px-5 mt-6 mb-8">
        <div className="bg-[#191919] rounded-[20px] p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
          
          <h3 className="text-[22px] font-extrabold italic tracking-tighter leading-[1.1] mb-5 uppercase text-white/95">
            {trendTitle}
          </h3>
          <p className="text-[13px] text-white/70 font-medium leading-relaxed mb-8">
            {isPostpartum ? dict.shopItem2TrendDesc : isTableware ? dict.shopItem3TrendDesc : itemDesc}
          </p>
          
          <div className="flex items-center gap-8 border-t border-white/10 pt-6 mt-4">
            <div>
              <div className="text-[#C53324] font-extrabold text-[20px] tracking-tight">24h</div>
              <div className="text-[9px] font-bold text-white/40 tracking-[0.2em] mt-1">MOISTURE</div>
            </div>
            <div className="w-[1px] h-10 bg-white/10"></div>
            <div>
              <div className="text-[#C53324] font-extrabold text-[20px] tracking-tight">0%</div>
              <div className="text-[9px] font-bold text-white/40 tracking-[0.2em] mt-1">FRAGRANCE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tabs Section */}
      <div className="px-5 mb-8 bg-[#F7F8F9] pt-2 pb-8 mx-0">
        <div className="flex items-center justify-between border-b border-slate-200 mb-5 px-3 w-full">
          <button className="text-[13px] font-extrabold text-slate-900 border-b-[3px] border-slate-900 pb-3 flex-1 text-center -mb-[2px] transition-colors">Description</button>
          <button className="text-[13px] font-bold text-slate-400 pb-3 flex-1 text-center border-b-[3px] border-transparent transition-colors hover:text-slate-600">Ingredients</button>
          <button className="text-[13px] font-bold text-slate-400 pb-3 flex-1 text-center border-b-[3px] border-transparent transition-colors hover:text-slate-600">Reviews</button>
        </div>
        <div className="px-3">
          <p className="text-[12px] text-slate-600 leading-[1.8] font-medium">
            {itemDesc}
          </p>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-[50%] -translate-x-[50%] z-50 w-full max-w-[600px] bg-white pt-4 pb-6 px-6 border-t border-slate-100 flex items-center justify-between gap-5 shadow-[0_-10px_40px_rgba(0,0,0,0.06)] rounded-t-[24px]">
          <div className="flex flex-col items-center justify-center gap-1.5 min-w-[70px] cursor-pointer hover:opacity-70 transition-opacity">
            <Share2 size={24} className="text-[#999999]" strokeWidth={2}/>
            <span className="text-[8px] font-extrabold text-[#999999] uppercase tracking-wider text-center">
              {dict.shopShareShare}
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
