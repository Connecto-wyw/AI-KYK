'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LockIcon, PlayCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PaywallOverlayProps {
  kidId: string
  lang?: string
  onUnlockSuccess?: () => void
}

const DICT: Record<string, any> = {
  ko: {
    title: "프리미엄 심층 진단이 준비되었습니다!",
    desc: "우리 아이와 부모님의 양육 성향을 비교한 <strong class='text-brand-red1'>격차 분석</strong>과 즉각 실행 가능한 <strong class='text-brand-red1'>맞춤형 전략</strong>을 확인해보세요.",
    adButton: "광고 보고 1회 무료 확인",
    payButton: "프리미엄 리포트 영구 소장 (2,900원)",
    note: "영구 소장 시 이전 진단 기록까지 모두 열람할 수 있습니다.",
    loadingAd: "광고 처리 중 오류가 발생했습니다.",
    payAlert: "결제 창이 열립니다. (구현 예정)",
    errorAlert: "오류가 발생했습니다. 다시 시도해주세요."
  },
  en: {
    title: "Your Premium Deep Analysis is Ready!",
    desc: "Check out the <strong class='text-brand-red1'>gap analysis</strong> comparing your child with your parenting style, and discover immediately actionable <strong class='text-brand-red1'>custom strategies</strong>.",
    adButton: "Watch an Ad to Unlock Free (1x)",
    payButton: "Keep Premium Report Forever ($1.99)",
    note: "Keeping it forever gives you access to all past diagnosis records.",
    loadingAd: "An error occurred while processing the ad.",
    payAlert: "Payment window will open. (To be implemented)",
    errorAlert: "An error occurred. Please try again."
  },
  ms: {
    title: "Analisis Mendalam Premium Anda Sudah Sedia!",
    desc: "Semak <strong class='text-brand-red1'>analisis jurang</strong> antara anak anda dengan bimbingan anda, dan temui <strong class='text-brand-red1'>strategi disesuaikan</strong> tindakan segera.",
    adButton: "Tonton Iklan & Buka Percuma",
    payButton: "Akses Tanpa Had Laporan ($1.99)",
    note: "Terbuka selamanya dan dapat akses rekod lama diagnosis anda.",
    loadingAd: "Ralat berlaku semasa memproses iklan.",
    payAlert: "Tetingkap bayaran akan dibuka. (Akan dilaksanakan)",
    errorAlert: "Ralat telah berlaku. Sila cuba lagi."
  },
  id: {
    title: "Analisis Mendalam Premium Anda Sudah Siap!",
    desc: "Cek <strong class='text-brand-red1'>analisis kesenjangan</strong> antara anak Anda dengan gaya asuh Anda, dan temukan <strong class='text-brand-red1'>strategi khusus</strong> yang bisa langsung dilakukan.",
    adButton: "Tonton Iklan untuk Buka Gratis (1x)",
    payButton: "Simpan Laporan Premium Selamanya ($1.99)",
    note: "Menyimpannya selamanya memberi Anda akses ke semua riwayat diagnosis.",
    loadingAd: "Terjadi kesalahan saat memproses iklan.",
    payAlert: "Jendela pembayaran akan terbuka. (Segera hadir)",
    errorAlert: "Terjadi kesalahan. Silakan coba lagi."
  },
  vi: {
    title: "Báo Cáo Phân Tích Chuyên Sâu Đã Sẵn Sàng!",
    desc: "Xem <strong class='text-brand-red1'>phân tích khoảng cách</strong> giữa tính cách của trẻ và cách nuôi dạy của bạn, cùng <strong class='text-brand-red1'>chiến lược tùy chỉnh</strong> có thể áp dụng ngay.",
    adButton: "Xem Quảng Cáo Mở Miễn Phí (1x)",
    payButton: "Lưu Báo Cáo Premium Mãi Mãi ($1.99)",
    note: "Lưu mãi mãi cho phép bạn xem lại tất cả hồ sơ chẩn đoán cũ.",
    loadingAd: "Có lỗi khi tải quảng cáo.",
    payAlert: "Cửa sổ thanh toán sẽ mở. (Sắp ra mắt)",
    errorAlert: "Đã xảy ra lỗi. Vui lòng thử lại."
  },
  th: {
    title: "บทวิเคราะห์เชิงลึกแบบพรีเมียมของคุณพร้อมแล้ว!",
    desc: "ตรวจสอบ <strong class='text-brand-red1'>การวิเคราะห์ช่องว่าง</strong> ระหว่างเด็กกับสไตล์การเลี้ยงดูของคุณ และพบกับ <strong class='text-brand-red1'>กลยุทธ์ที่ปรับแต่งได้</strong> ที่นำไปใช้ได้ทันที",
    adButton: "ดูโฆษณาเพื่อปลดล็อกฟรี (1x)",
    payButton: "เก็บรายงานพรีเมียมถาวร ($1.99)",
    note: "การเก็บไว้ถาวรทำให้คุณเข้าถึงประวัติการวินิจฉัยทั้งหมดได้",
    loadingAd: "เกิดข้อผิดพลาดขณะโหลดโฆษณา",
    payAlert: "หน้าต่างการชำระเงินจะเปิดขึ้น (เร็วๆ นี้)",
    errorAlert: "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง"
  }
}

export function PaywallOverlay({ kidId, lang = 'en', onUnlockSuccess }: PaywallOverlayProps) {
  const router = useRouter()
  const [isLoadingAd, setIsLoadingAd] = useState(false)
  const [isLoadingPay, setIsLoadingPay] = useState(false)
  
  const text = DICT[lang] || DICT['en']

  const handleWatchAd = async () => {
    setIsLoadingAd(true)
    // 테스트용 강제 언락 바이패스 (다른 분들 확인용)
    router.push('?unlocked=true')
    setIsLoadingAd(false)
  }

  const handlePayment = async () => {
    setIsLoadingPay(true)
    // 테스트용 강제 언락 바이패스
    router.push('?unlocked=true')
    setIsLoadingPay(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-5 bg-slate-900/40 backdrop-blur-sm">
      <Card className="relative w-full max-w-md p-6 bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl text-center border-0">
        <div className="mx-auto w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4 shadow-inner ring-4 ring-white">
          <LockIcon size={24} className="text-brand-red1" />
        </div>
        
        <h2 className="text-xl font-bold text-slate-800 mb-2">{text.title}</h2>
        <p className="text-[14px] text-slate-600 mb-6 break-keep" dangerouslySetInnerHTML={{ __html: text.desc }} />

        <div className="space-y-3">
          {/* 광고 유도 버튼 (강조) */}
          <Button
            onClick={handleWatchAd}
            disabled={isLoadingAd || isLoadingPay}
            className="w-full h-14 rounded-2xl bg-brand-red1 hover:bg-brand-red1/90 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all flex border border-brand-red1 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
            {isLoadingAd ? <Loader2 className="animate-spin mr-2" /> : <PlayCircle className="mr-2" size={20} />}
            {text.adButton}
            <span className="absolute -top-3 -right-2 bg-brand-yellow text-brand-red1 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm rotate-12">BEST</span>
          </Button>

          {/* 결제 버튼 (서브) */}
          <Button
            onClick={handlePayment}
            disabled={isLoadingAd || isLoadingPay}
            variant="outline"
            className="w-full h-14 rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-all whitespace-normal h-auto py-3"
          >
            {isLoadingPay ? <Loader2 className="animate-spin mr-2" /> : null}
            {text.payButton}
          </Button>
        </div>
        
        <p className="text-[11px] text-slate-400 mt-5 font-medium">{text.note}</p>
      </Card>
    </div>
  )
}

