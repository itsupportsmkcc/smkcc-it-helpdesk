import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, MessageSquare, ArrowLeft } from "lucide-react";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ticketId?: string }>;
}) {
  return (
    <main className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2px] border border-[#e0e0e0] p-8 text-center">
        {/* Logo */}
        <div className="relative w-20 h-20 mx-auto mb-4 rounded-[2px] overflow-hidden border border-[#e0e0e0] bg-white">
          <Image
            src="/logo.jpg"
            alt="SMKCC IT Support Logo"
            fill
            className="object-cover"
          />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebebec] text-[#009262] border border-[#e0e0e0] text-xs font-medium mb-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>บันทึกข้อมูลเรียบร้อยแล้ว</span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-[#1d1d1f]">
          ส่งเรื่องแจ้งซ่อมเรียบร้อยแล้ว
        </h1>
        <p className="text-xs text-[#666666] mt-2 leading-relaxed">
          เจ้าหน้าที่ไอทีได้รับเรื่องของคุณเรียบร้อยแล้ว และกำลังจัดคิวเพื่อเข้าดำเนินการแก้ไขโดยเร็วที่สุด
        </p>

        <div className="my-6 p-4 bg-[#ebebec] border border-[#e0e0e0] rounded-[2px] text-left">
          <div className="flex items-start gap-2.5">
            <MessageSquare className="w-4 h-4 text-[#1d1d1f] shrink-0 mt-0.5" />
            <div className="text-xs text-[#3c3c43] leading-relaxed">
              <span className="font-bold block mb-0.5 text-[#1d1d1f]">ระบบแจ้งเตือนผ่าน LINE:</span>
              เมื่อเจ้าหน้าที่เริ่มดำเนินการ หรือปิดงาน คุณจะได้รับการแจ้งเตือนผ่านข้อความ LINE ทันที
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-[2px] bg-[#1d1d1f] hover:bg-[#3c3c43] text-white font-medium text-xs tracking-[-0.16px] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับหน้าหลัก
        </Link>
      </div>
    </main>
  );
}
