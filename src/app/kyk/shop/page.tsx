import Image from 'next/image'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { dictionaries } from '@/lib/i18n/dictionaries'
import { Sparkles } from 'lucide-react'

export default async function ShopFrontPage() {
  const cookieStore = await cookies()
  const langValue = cookieStore.get('kyk-lang')?.value || 'en'
  const langKey = Object.keys(dictionaries).includes(langValue) ? (langValue as keyof typeof dictionaries) : 'en'
  const dict = dictionaries[langKey]

  return (
    <div className="flex flex-col min-h-screen bg-white relative overflow-hidden pb-32 lg:pb-12 pt-16 px-6 lg:px-12 w-full max-w-4xl mx-auto">
      <div className="mb-8 mt-4">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-wider">{dict.shopTitle}</h1>
      </div>

      <div className="flex flex-col gap-8">
        {/* Featured Item */}
        <Link href="/kyk/shop/1" className="flex flex-col lg:flex-row gap-6 w-full group cursor-pointer">
          {/* Image Side */}
          <div className="w-full lg:w-[45%] relative rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-square lg:aspect-[4/5] bg-slate-50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex-shrink-0">
            {/* Top Badge Overlay */}
            <div className="absolute top-0 left-0 w-full bg-slate-600/90 py-2.5 z-10">
              <span className="block text-center text-[10px] md:text-xs font-bold text-white tracking-widest uppercase">
                {dict.shopFeaturedBadge}
              </span>
            </div>

            <Image 
              src="/img/items/item-1.png" 
              alt="Korean Daily Care Essential Shampoo" 
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Bottom Target Tag Overlay */}
            <div className="absolute bottom-0 left-0 w-full bg-[#EA678C]/90 py-3 z-10 backdrop-blur-sm">
              <span className="block text-center text-xs md:text-sm font-extrabold text-white tracking-wide">
                {dict.shopFreeGift}
              </span>
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-[55%] flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h2 className="text-[22px] md:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                {dict.shopItem1Name}
              </h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 whitespace-nowrap">
                {dict.shopJoinedCount.replace('{count}', '1')}
              </span>
            </div>
            
            <p className="text-sm md:text-[15px] text-slate-500 leading-relaxed break-keep mb-5">
              {dict.shopItem1Desc}
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-blue-50 text-blue-500 text-xs font-bold rounded-lg tracking-wide">
                {dict.shopTagKoreanMom}
              </span>
              <span className="px-3 py-1.5 bg-blue-50 text-blue-500 text-xs font-bold rounded-lg tracking-wide">
                {dict.shopTagFreeGift}
              </span>
            </div>
          </div>
        </Link>

        {/* Divider */}
        <hr className="w-full border-t border-slate-100/80 my-2" />

        {/* Sub Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 pb-12">
          
          {/* Sub Item 1 */}
          <Link href="/kyk/shop/2" className="flex flex-col group cursor-pointer border border-slate-100 rounded-[20px] overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all">
            <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden bg-slate-50">
              <Image 
                src="/img/items/item-2.png" 
                alt="Postpartum Care Starter Kit" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 sm:p-5 flex flex-col">
              <h3 className="text-[13px] sm:text-[15px] font-bold text-slate-900 mb-2 truncate leading-tight">
                {dict.shopItem2Name}
              </h3>
              <div className="mb-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
                  {dict.shopJoinedCount.replace('{count}', '9')}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                <span className="px-2 py-1 bg-blue-50 text-[#3b82f6] text-[10px] sm:text-[11px] font-bold rounded flex-shrink-0 flex items-center justify-center">
                  {dict.shopTagPostpartum}
                </span>
                <span className="px-2 py-1 bg-blue-50 text-[#3b82f6] text-[10px] sm:text-[11px] font-bold rounded flex-shrink-0 flex items-center justify-center">
                  {dict.shopTagRecovery}
                </span>
              </div>
            </div>
          </Link>

          {/* Sub Item 2 */}
          <Link href="/kyk/shop/3" className="flex flex-col group cursor-pointer border border-slate-100 rounded-[20px] overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all">
            <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden bg-slate-50">
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-1 shadow-sm z-10">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {dict.shopTagPicks}
              </div>
              <Image 
                src="/img/items/item-3.png" 
                alt="K-Kids Silicone Tableware Set" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 sm:p-5 flex flex-col">
              <h3 className="text-[13px] sm:text-[15px] font-bold text-slate-900 mb-2 truncate leading-tight">
                {dict.shopItem3Name}
              </h3>
              <div className="mb-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
                  {dict.shopJoinedCount.replace('{count}', '5')}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                <span className="px-2 py-1 bg-blue-50 text-[#3b82f6] text-[10px] sm:text-[11px] font-bold rounded flex-shrink-0 flex items-center justify-center">
                  {dict.shopTagTableware}
                </span>
                <span className="px-2 py-1 bg-blue-50 text-[#3b82f6] text-[10px] sm:text-[11px] font-bold rounded flex-shrink-0 flex items-center justify-center">
                  {dict.shopTagSafeMeal}
                </span>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </div>
  )
}
