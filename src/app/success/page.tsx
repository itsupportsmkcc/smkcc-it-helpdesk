import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, MessageSquare, ArrowLeft } from "lucide-react";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ticketId?: string }>;
}) {
  return (
    <main className="min-h-screen bg-[#f2f0eb] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[16px] shadow-[0_0_1px_rgba(0,0,0,0.14),0_2px_8px_rgba(0,0,0,0.08)] border border-[#e7e7e7] p-8 text-center">
        {/* Logo */}
        <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden shadow-md ring-4 ring-[#d4e9e2] bg-white">
          <Image
            src="/logo.jpg"
            alt="SMKCC IT Support Logo"
            fill
            className="object-cover"
          />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4e9e2] text-[#00754A] text-xs font-semibold mb-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>บันทึกข้อมูลเรียบร้อยแล้ว</span>
        </div>

        <h1 className="text-xl font-bold tracking-[-0.16px] text-[rgba(0,0,0,0.87)]">
          ส่งเรื่องแจ้งซ่อมเรียบร้อยแล้ว
        </h1>
        <p className="text-xs text-[rgba(0,0,0,0.58)] mt-2 leading-relaxed">
          เจ้าหน้าที่ไอทีได้รับเรื่องของคุณเรียบร้อยแล้ว และกำลังจัดคิวเพื่อเข้าดำเนินการแก้ไขโดยเร็วที่สุด
        </p>

        <div className="my-6 p-4 bg-[#faf6ee] border border-[#dfc49d] rounded-2xl text-left">
          <div className="flex items-start gap-2.5">
            <MessageSquare className="w-4 h-4 text-[#00754A] shrink-0 mt-0.5" />
            <div className="text-xs text-[#1E3932] leading-relaxed">
              <span className="font-bold block mb-0.5 text-[#00754A]">ระบบแจ้งเตือนผ่าน LINE:</span>
              เมื่อเจ้าหน้าที่เริ่มดำเนินการ หรือปิดงาน คุณจะได้รับการแจ้งเตือนผ่านข้อความ LINE ทันที
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full h-[50px] rounded-full bg-[#00754A] hover:bg-[#006241] text-white font-semibold text-xs tracking-[-0.16px] transition-all duration-200 active:scale-[0.95] shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับหน้าหลัก
        </Link>
      </div>
    </main>
  );
}
