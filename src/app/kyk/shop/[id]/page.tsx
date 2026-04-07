'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Share, Check, Reply, ThumbsUp, Heart, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

export default function ShopItemPage() {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.warn("Failed to copy", err)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white relative overflow-hidden pb-32 lg:pb-12 pt-8 w-full max-w-[600px] mx-auto border-x border-slate-50">
      
      {/* Top Header & Context */}
      <div className="px-6 mb-6">
        <h1 className="text-[22px] font-extrabold text-slate-900 tracking-tight mb-2">Team</h1>
        <p className="text-[13px] text-slate-500 font-medium">
          Trending K-Parenting goods parents love. Join together, unlock better prices. Beta now.
        </p>
      </div>

      <hr className="border-t border-slate-100/60 w-[calc(100%-3rem)] mx-auto mb-6" />

      {/* Main Image Banner */}
      <div className="w-[calc(100%-3rem)] mx-auto relative rounded-[20px] overflow-hidden aspect-[4/5] sm:aspect-square bg-slate-50 shadow-sm border border-slate-100 flex-shrink-0 mb-6 group">
        
        {/* Top Badge Overlay */}
        <div className="absolute top-0 left-0 w-full bg-[#4S5A8A]/90 bg-slate-600/90 py-3 z-10">
          <span className="block text-center text-[12px] font-bold text-white tracking-widest uppercase">
            INDIANBOB Picks : Loved by Korean Moms
          </span>
        </div>

        <Image 
          src="/img/items/item-1.png" 
          alt="Korean Daily Care Essential Shampoo" 
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
        
        {/* Bottom Target Tag Overlay */}
        <div className="absolute bottom-0 left-0 w-full bg-[#EA678C]/90 py-3 z-10 backdrop-blur-sm">
          <span className="block text-center text-[15px] font-extrabold text-white tracking-widest">
            FREE GIFT
          </span>
        </div>
      </div>

      {/* Main Title and Descriptors */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <h2 className="text-[24px] font-bold text-slate-900 tracking-tight leading-tight">
            Korean Daily Care Essential
          </h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
            Joined 1
          </span>
        </div>
        
        <p className="text-[14px] text-slate-600 leading-relaxed font-medium mb-4">
          Inspired by the gentle care routines trusted by Korean moms, this all-in-one shampoo and body wash offers a simple and practical solution for everyday family cleansing. A convenient choice for soft, comfortable care from head to toe.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1.5 bg-blue-50 text-blue-500 text-[11px] font-extrabold rounded-md tracking-wide">
            #KoreanMomPick
          </span>
          <span className="px-3 py-1.5 bg-blue-50 text-blue-500 text-[11px] font-extrabold rounded-md tracking-wide">
            #FreeGift
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-5">
          <span className="text-[12px] font-medium text-slate-500">
            Share this team with friends
          </span>
          <button 
            onClick={handleShare}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 py-2 text-[12px] font-bold flex items-center gap-1.5 transition-colors active:scale-95"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Share size={14} />}
            {copied ? 'Copied' : 'Share'}
          </button>
        </div>
      </div>

      {/* Team Buy Challenge UI */}
      <div className="px-6 mb-8">
        <div className="bg-[#38bdf8] rounded-2xl p-6 flex flex-col items-center justify-center text-center text-white shadow-xl shadow-sky-500/10 border border-sky-400 relative overflow-hidden">
          {/* subtle background glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          
          <span className="text-[11px] font-bold tracking-widest uppercase mb-1 opacity-90">Team Buy Discount</span>
          <h3 className="text-2xl font-extrabold tracking-tight mb-2">Up to 40% OFF</h3>
          
          <div className="w-full bg-white/20 rounded-xl p-3 my-4 backdrop-blur-sm border border-white/10 flex flex-col gap-2 relative z-10 text-left">
            <div className="flex justify-between text-xs font-bold w-full">
              <span>Goal: 5 Buyers</span>
              <span>Joined: 4</span>
            </div>
            
            <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-300 rounded-full w-[80%] shadow-[0_0_10px_rgba(253,224,71,0.5)]" />
            </div>
            
            <p className="text-center text-[10.5px] mt-1 font-semibold opacity-90">Only 1 more participant needed for the max discount!</p>
          </div>

          <button className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-[15px] max-w-[200px] w-full py-3 rounded-full shadow-lg transition-transform active:scale-95 relative z-10">
            Join the Team
          </button>
        </div>
      </div>

      {/* Feature List block */}
      <div className="px-6 mb-8">
        <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="bg-slate-50 border-b border-slate-100 p-5">
            <span className="text-[10px] font-extrabold text-slate-500 tracking-wider uppercase mb-1 block">Trending & Premium from Korea</span>
            <h3 className="text-[17px] font-extrabold text-slate-900 leading-snug">Discover the most trending and premium products from South Korea — carefully curated for you.</h3>
          </div>

          <div className="p-5 flex items-center gap-4 border-b border-slate-50">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-red-500">
              {/* Fake icon for shampoo */}
              <span className="text-lg">🧴</span>
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-slate-900">Korean Daily Care Essential</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">One bottle, head-to-toe comfort — inspired by Korean moms' gentle daily routines.</p>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-3 bg-white">
            
            {/* Feature Row 1 */}
            <div className="border border-slate-100 rounded-xl p-4 flex gap-3 hover:bg-slate-50 transition-colors">
              <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</div>
              <div>
                <h5 className="text-[13px] font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  All-in-One, No Guesswork 
                  <span className="text-xs">✅</span>
                </h5>
                <p className="text-[11px] text-slate-500 leading-relaxed">A simple, practical solution for everyday family cleansing: shampoo + body wash in one. Less clutter, fewer steps — easier routines for busy mornings and tired nights.</p>
              </div>
            </div>

            {/* Feature Row 2 */}
            <div className="border border-slate-100 rounded-xl p-4 flex gap-3 hover:bg-slate-50 transition-colors">
              <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</div>
              <div>
                <h5 className="text-[13px] font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  Soft, Comfortable Daily Care
                  <span className="text-xs">☁️</span>
                </h5>
                <p className="text-[11px] text-slate-500 leading-relaxed">Inspired by the gentle care routines trusted by Korean moms. Designed to feel comfortable for everyday use — clean, fresh, and never fussy.</p>
              </div>
            </div>

            {/* Feature Row 3 */}
            <div className="border border-slate-100 rounded-xl p-4 flex gap-3 hover:bg-slate-50 transition-colors">
              <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</div>
              <div>
                <h5 className="text-[13px] font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  Family-Friendly for Daily Use
                  <span className="text-xs">👨‍👩‍👧</span>
                </h5>
                <p className="text-[11px] text-slate-500 leading-relaxed">A practical choice for shared bathrooms and family travel. Easy to reach for, easy to finish, and easy to restock — the "default pick" you'll keep coming back to.</p>
              </div>
            </div>

            {/* Bottom check highlight box */}
            <div className="mt-3 bg-[#f8fbfa] border border-[#e8f5ed] rounded-xl p-5">
              <h5 className="text-[12px] font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                Why Families Love It
              </h5>
              <ul className="text-[11px] text-slate-600 space-y-2 font-medium">
                <li className="flex items-center gap-2"><Check size={12} className="text-green-500" /> One bottle for hair + body</li>
                <li className="flex items-center gap-2"><Check size={12} className="text-green-500" /> Simple routines for busy families</li>
                <li className="flex items-center gap-2"><Check size={12} className="text-green-500" /> Great for shared bathrooms & travel</li>
                <li className="flex items-center gap-2"><Check size={12} className="text-green-500" /> Inspired by Korean moms' practical daily care</li>
              </ul>
              <p className="mt-4 pt-4 border-t border-[#e8f5ed] text-[11px] font-bold text-slate-800">
                Simple, Gentle, Everyday — the Korean way.
              </p>
            </div>

          </div>
        </div>
      </div>

      <div className="px-6 pb-8">
        <Link href="/kyk/shop" className="text-[12px] font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1.5 transition-colors">
          <Reply size={14} className="scale-x-[-1]" />
          Back to TEAM
        </Link>
      </div>

    </div>
  )
}
