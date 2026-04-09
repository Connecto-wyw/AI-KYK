import Image from 'next/image'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { dictionaries } from '@/lib/i18n/dictionaries'
import { Zap } from 'lucide-react'

export default async function ShopFrontPage() {
  const cookieStore = await cookies()
  const langValue = cookieStore.get('kyk-lang')?.value || 'en'
  const langKey = Object.keys(dictionaries).includes(langValue) ? (langValue as keyof typeof dictionaries) : 'en'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dict = dictionaries[langKey as keyof typeof dictionaries] as any

  return (
    <div className="flex flex-col min-h-[100dvh] bg-slate-50 lg:bg-slate-100 pb-[100px] lg:pb-12 w-full font-sans">
      <div className="w-full max-w-2xl mx-auto px-5 lg:px-4 pt-4 lg:pt-8 flex flex-col gap-12 flex-1">
        
        {/* Editorial Choice / Best Sellers Hero */}
        <section>
          <div className="mb-6">
            <p className="text-[11px] font-bold text-brand-red1 tracking-widest uppercase mb-1">{dict.shopFrontEditorial}</p>
            <h2 className="text-[32px] font-extrabold text-slate-900 tracking-tight">{dict.shopFrontBest}</h2>
          </div>

          <div className="relative w-full rounded-[30px] overflow-hidden bg-[#0a2e2c] flex flex-col md:flex-row shadow-xl group">
            {/* Background Illustration / Image */}
            <div className="absolute top-0 right-0 bottom-0 left-0 md:left-1/3 z-0">
               <div className="w-full h-full relative opacity-90 md:opacity-100">
                  <Image 
                    src="/img/items/item-1.png" 
                    alt="Essence Background" 
                    fill 
                    className="object-cover object-right md:object-right-top mix-blend-screen"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a2e2c] via-[#0a2e2c]/90 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a2e2c] via-transparent to-transparent md:hidden"></div>
               </div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 w-full md:w-[60%] p-8 md:p-14 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full mb-6 w-max border border-white/10">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                <span className="text-[10px] font-bold text-white tracking-widest uppercase">{dict.shopFrontPopular}</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-black text-white leading-[1.1] tracking-tight mb-5 drop-shadow-md whitespace-pre-line">
                {dict.shopFrontCard1Title}
              </h3>
              
              <p className="text-white/80 text-[15px] md:text-base leading-relaxed mb-10 max-w-md font-medium tracking-wide">
                {dict.shopFrontCard1Desc}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mt-auto">
                <Link href="/kyk/shop/1" className="bg-brand-red1 hover:bg-brand-red2 text-white font-bold text-xs px-6 py-4 w-[84px] h-[84px] flex items-center justify-center rounded-full text-center transition-all shadow-lg hover:shadow-brand-red1/30 shrink-0">
                  <span className="whitespace-pre-line block leading-tight break-keep">{dict.shopFrontView}</span>
                </Link>
                
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    <div className="w-9 h-9 rounded-full border-2 border-[#0a2e2c] bg-slate-300 z-30"></div>
                    <div className="w-9 h-9 rounded-full border-2 border-[#0a2e2c] bg-slate-400 z-20"></div>
                    <div className="w-9 h-9 rounded-full border-2 border-[#0a2e2c] bg-brand-red1 text-white text-[10px] font-bold flex items-center justify-center z-10 shadow-sm">
                      +42
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-white/90 whitespace-pre-line">{dict.shopFrontJoinedWeek}</span>
                </div>
              </div>
            </div>
            
            {/* Top Right "Explore Full Collection" Link */}
            <Link href="/kyk/shop" className="absolute top-8 right-8 z-20 hidden md:flex items-center gap-2 text-brand-red1 font-extrabold text-sm hover:opacity-80 transition-opacity bg-white/90 backdrop-blur px-5 py-2.5 rounded-full shadow-sm">
              {dict.shopFrontExplore} 
              <span className="text-lg leading-none">→</span>
            </Link>
          </div>
        </section>

        {/* New Arrivals */}
        <section>
          <div className="flex items-center gap-5 mb-8">
            <h2 className="text-[26px] font-extrabold text-slate-900 tracking-tight shrink-0">{dict.shopFrontNew}</h2>
            <div className="h-[1px] w-full bg-slate-200"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Item 1: Postpartum Starter Kit */}
            <Link href="/kyk/shop/2" className="group flex flex-col">
              <div className="relative rounded-[24px] overflow-hidden aspect-[4/5] bg-[#F4EFEB] mb-4">
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                  <span className="bg-white text-slate-700 text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">{dict.shopFrontPremium}</span>
                  <span className="bg-[#4A7D94] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">{dict.shopFrontEco}</span>
                </div>
                <Image 
                  src="/img/items/item-2.png" 
                  alt="Postpartum Starter Kit" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex justify-between items-start gap-4 mb-2 px-1">
                <h3 className="text-lg font-bold text-slate-900 leading-tight whitespace-pre-line"><span className="block whitespace-pre-line">{dict.shopFrontPostpartum}</span></h3>
                <span className="text-lg font-black text-slate-900">$124.00</span>
              </div>
              <div className="flex items-center gap-2 px-1 text-slate-500">
                <UsersIcon className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{dict.shopFrontJoinedTeam12}</span>
              </div>
            </Link>

            {/* Item 2: Kids Silicone Tableware Set */}
            <Link href="/kyk/shop/3" className="group flex flex-col">
              <div className="relative rounded-[24px] overflow-hidden aspect-[4/5] bg-[#7acac2] mb-4">
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-white text-[#7acac2] text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">{dict.shopFrontBpa}</span>
                </div>
                <Image 
                  src="/img/items/item-3.png" 
                  alt="Kids Silicone Tableware Set" 
                  fill
                  className="object-cover scale-90 group-hover:scale-100 transition-transform duration-500"
                />
              </div>
              <div className="flex justify-between items-start gap-4 mb-2 px-1">
                <h3 className="text-lg font-bold text-slate-900 leading-tight whitespace-pre-line"><span className="block whitespace-pre-line">{dict.shopFrontKidsSet}</span></h3>
                <span className="text-lg font-black text-slate-900">$45.00</span>
              </div>
              <div className="flex items-center gap-2 px-1 text-slate-500">
                <UsersIcon className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{dict.shopFrontJoinedTeam9}</span>
              </div>
            </Link>

            {/* Item 3: Promotional Card */}
            <div className="rounded-[24px] bg-brand-red1 overflow-hidden p-6 lg:p-7 flex flex-col h-full shadow-lg shadow-brand-red1/10 relative border border-brand-red2">
              <div className="relative z-10 flex flex-col h-full">
                <span className="text-white/80 text-[10px] font-extrabold tracking-widest uppercase mb-3 block">{dict.shopFrontLimited}</span>
                <h3 className="text-2xl font-black text-white leading-[1.2] mb-3 tracking-tight drop-shadow-sm whitespace-pre-line">
                  {dict.shopFrontBundleTitle}
                </h3>
                <p className="text-white/90 text-[13px] font-medium leading-relaxed mb-4 hidden sm:block">
                  {dict.shopFrontBundleDesc}
                </p>
                <div className="mt-auto pt-2">
                  <Link href="/kyk/shop/bundle" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-white text-brand-red1 hover:bg-slate-50 font-black text-[13px] px-5 py-3 rounded-[20px] transition-transform hover:-translate-y-0.5 shadow-md">
                    {dict.shopFrontBundleBtn}
                    <Zap className="w-4 h-4 text-brand-red1 fill-current" />
                  </Link>
                </div>
              </div>
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 blur-xl"></div>
            </div>

          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-[#EDEDED] rounded-[40px] p-8 md:p-14 mt-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">{dict.shopFrontNewsletterTitle}</h2>
            <p className="text-slate-600 text-[15px] font-medium leading-relaxed max-w-sm">
              {dict.shopFrontNewsletterDesc}
            </p>
          </div>
          
          <div className="md:w-1/2 w-full flex flex-col items-start md:items-end gap-3">
             <div className="relative w-full max-w-[420px] flex">
                 <input 
                   type="email" 
                   placeholder={dict.shopFrontNewsletterPlaceholder}
                   className="w-full bg-white border-0 rounded-l-full py-4 pl-6 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-red1/20 transition-all placeholder:text-slate-400"
                 />
                 <button className="bg-[#1A1A1A] hover:bg-black text-white font-bold text-sm px-8 rounded-r-full transition-colors whitespace-nowrap">
                   {dict.shopFrontNewsletterBtn}
                 </button>
             </div>
             <p className="text-[#a0a0a0] text-[10px] md:text-center w-full max-w-[420px] px-4">
               {dict.shopFrontNewsletterTerms}
             </p>
          </div>
        </section>

      </div>
    </div>
  )
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
