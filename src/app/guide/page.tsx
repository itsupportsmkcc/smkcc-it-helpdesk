import Image from "next/image";
import Link from "next/link";
import {
  Smartphone,
  ClipboardCheck,
  BellRing,
  Star,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Printer,
  ChevronRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { PrintButton } from "./print-button";

export const metadata = {
  title: "คู่มือการใช้งานระบบแจ้งซ่อมไอที (User Guide) | SMKCC IT Helpdesk",
  description: "คู่มือสรุปวิธีแจ้งซ่อมและบริการด้านไอที วิทยาลัยชุมชนสมุทรสาคร",
};

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-[#f2f0eb] py-6 px-3 sm:px-6 print:p-0 print:bg-white text-[rgba(0,0,0,0.87)] font-sans">
      {/* Top Action Bar (ซ่อนเวลาพิมพ์) */}
      <div className="max-w-4xl mx-auto mb-4 flex items-center justify-between gap-3 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3932] hover:text-[#00754A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้าแจ้งซ่อม</span>
        </Link>
        <div className="flex items-center gap-2">
          <PrintButton />
        </div>
      </div>

      {/* Main Infographic Container: ขนาดพอดี 1 หน้า A4 (Print Friendly) */}
      <article className="max-w-4xl mx-auto bg-white rounded-2xl border border-[#e7e7e7] shadow-lg print:shadow-none print:border-none p-6 sm:p-8 print:p-4 print:max-w-full">
        {/* Header Section */}
        <header className="flex items-center gap-4 border-b-2 border-[#1E3932] pb-4 mb-6">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shrink-0 shadow-md ring-2 ring-[#00754A] bg-white">
            <Image
              src="/logo.jpg"
              alt="SMKCC IT Support Logo"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#d4e9e2] text-[#006241] text-[11px] font-bold tracking-wider uppercase mb-1">
              <Sparkles className="w-3 h-3" />
              SMKCC IT Helpdesk • Quick Guide
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1E3932] tracking-tight leading-tight">
              4 ขั้นตอนง่ายๆ ในการแจ้งซ่อมไอทีผ่าน LINE
            </h1>
            <p className="text-xs sm:text-sm text-[rgba(0,0,0,0.65)] font-medium mt-0.5">
              ฝ่ายเทคโนโลยีสารสนเทศ วิทยาลัยชุมชนสมุทรสาคร (สะดวก รวดเร็ว ไม่ต้องจำรหัสผ่าน)
            </p>
          </div>
        </header>

        {/* 4 Steps Grid: Infographic 2x2 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 print:grid-cols-2 print:gap-3">
          {/* STEP 1 */}
          <div className="bg-[#faf9f7] rounded-xl border border-[#e7e7e7] p-4 flex flex-col justify-between relative overflow-hidden group hover:border-[#00754A] transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#d4e9e2]/40 rounded-bl-full flex items-start justify-end pr-3 pt-2">
              <span className="text-lg font-black text-[#006241]">01</span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#00754A] text-white flex items-center justify-center shadow-sm">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h2 className="text-sm sm:text-base font-bold text-[#1E3932]">
                  เปิดหน้าแจ้งซ่อมผ่าน LINE
                </h2>
              </div>
              <p className="text-xs text-[rgba(0,0,0,0.65)] mb-3 leading-relaxed">
                เข้าแชทบัญชีทางการ <b>SMKCC IT Service</b> เพื่อเข้าสู่ระบบได้ทันที
              </p>

              {/* Visual Mockup Card */}
              <div className="bg-white rounded-lg p-2.5 border border-[#dfc49d] space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-[#1E3932] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#00754A]"></span>
                  <span>บนมือถือ (Smartphone):</span>
                </div>
                <p className="text-[11px] text-[rgba(0,0,0,0.6)] pl-4">
                  กดปุ่มเมนู <b>"แจ้งซ่อมไอที"</b> จาก Rich Menu แถบด้านล่างห้องแชท
                </p>
                <div className="flex items-center gap-2 text-[#1E3932] font-semibold pt-1 border-t border-[#f2f0eb]">
                  <span className="w-2 h-2 rounded-full bg-[#cba258]"></span>
                  <span>บนคอมพิวเตอร์ (LINE PC):</span>
                </div>
                <p className="text-[11px] text-[rgba(0,0,0,0.6)] pl-4">
                  คลิกลิงก์ในข้อความทักทาย หรือพิมพ์คำว่า <b>"แจ้งซ่อม"</b> ในแชท
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#e7e7e7] flex items-center text-[10px] text-[#006241] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#00754A]" />
              ระบบดึงชื่อและ LINE ID ให้ทันทีโดยไม่ต้องลงทะเบียนใหม่
            </div>
          </div>

          {/* STEP 2 */}
          <div className="bg-[#faf9f7] rounded-xl border border-[#e7e7e7] p-4 flex flex-col justify-between relative overflow-hidden group hover:border-[#00754A] transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#faf6ee] border-b border-l border-[#dfc49d] rounded-bl-full flex items-start justify-end pr-3 pt-2">
              <span className="text-lg font-black text-[#8c6b2d]">02</span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#8c6b2d] text-white flex items-center justify-center shadow-sm">
                  <ClipboardCheck className="w-4 h-4" />
                </div>
                <h2 className="text-sm sm:text-base font-bold text-[#1E3932]">
                  กรอกข้อมูลแจ้งปัญหา (1 นาที)
                </h2>
              </div>
              <p className="text-xs text-[rgba(0,0,0,0.65)] mb-3 leading-relaxed">
                กรอกรายละเอียดสั้นๆ เพื่อให้เจ้าหน้าที่เข้าดำเนินการได้ตรงจุด
              </p>

              {/* Visual Mockup Card */}
              <div className="bg-white rounded-lg p-2.5 border border-[#e7e7e7] space-y-1.5 text-xs">
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div className="bg-[#f2f0eb] p-1.5 rounded">
                    <span className="text-[rgba(0,0,0,0.5)] block text-[10px]">1. ข้อมูลผู้แจ้ง:</span>
                    <span className="font-semibold text-[#1E3932]">ชื่อ-สกุล & เบอร์โทร</span>
                  </div>
                  <div className="bg-[#f2f0eb] p-1.5 rounded">
                    <span className="text-[rgba(0,0,0,0.5)] block text-[10px]">2. สถานที่:</span>
                    <span className="font-semibold text-[#1E3932]">ระบุอาคาร / ห้อง</span>
                  </div>
                  <div className="bg-[#f2f0eb] p-1.5 rounded">
                    <span className="text-[rgba(0,0,0,0.5)] block text-[10px]">3. หมวดหมู่:</span>
                    <span className="font-semibold text-[#1E3932]">เน็ต, คอม, ซูม ฯลฯ</span>
                  </div>
                  <div className="bg-[#f2f0eb] p-1.5 rounded">
                    <span className="text-[rgba(0,0,0,0.5)] block text-[10px]">4. แนบภาพ (ถ้ามี):</span>
                    <span className="font-semibold text-[#00754A]">ถ่ายรูปอาการเสีย</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#e7e7e7] flex items-center text-[10px] text-[#8c6b2d] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#8c6b2d]" />
              สามารถเลือกระดับความเร่งด่วน เช่น เร่งด่วนกระทบการเรียนการสอน
            </div>
          </div>

          {/* STEP 3 */}
          <div className="bg-[#faf9f7] rounded-xl border border-[#e7e7e7] p-4 flex flex-col justify-between relative overflow-hidden group hover:border-[#00754A] transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#d4e9e2]/40 rounded-bl-full flex items-start justify-end pr-3 pt-2">
              <span className="text-lg font-black text-[#006241]">03</span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#00754A] text-white flex items-center justify-center shadow-sm">
                  <BellRing className="w-4 h-4" />
                </div>
                <h2 className="text-sm sm:text-base font-bold text-[#1E3932]">
                  รับการแจ้งเตือนสถานะผ่าน LINE
                </h2>
              </div>
              <p className="text-xs text-[rgba(0,0,0,0.65)] mb-3 leading-relaxed">
                ระบบจะส่งข้อความแจ้งเตือนอัตโนมัติเข้าแชท LINE เมื่อช่างรับเรื่อง
              </p>

              {/* Status Flow Badge Card */}
              <div className="bg-white rounded-lg p-2.5 border border-[#e7e7e7] space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between bg-[#faf6ee] p-1.5 rounded border border-[#dfc49d]/60">
                  <span className="font-bold text-[#8c6b2d]">🟡 รับเรื่องแล้ว (New)</span>
                  <span className="text-[10px] text-[rgba(0,0,0,0.55)]">คำขอถึงเจ้าหน้าที่แล้ว</span>
                </div>
                <div className="flex items-center justify-between bg-[#d4e9e2]/50 p-1.5 rounded border border-[#a3d2c1]">
                  <span className="font-bold text-[#006241]">🔵 กำลังดำเนินการ</span>
                  <span className="text-[10px] text-[rgba(0,0,0,0.55)]">ช่างกำลังลงพื้นที่แก้ไข</span>
                </div>
                <div className="flex items-center justify-between bg-[#1E3932] text-white p-1.5 rounded">
                  <span className="font-bold text-[#d4e9e2]">🟢 เสร็จสิ้น (Resolved)</span>
                  <span className="text-[10px] text-white/80">แก้ไขปัญหาเรียบร้อย</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#e7e7e7] flex items-center text-[10px] text-[#006241] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#00754A]" />
              ติดตามความคืบหน้าได้ตลอด 24 ชม. โดยไม่ต้องโทรตามงาน
            </div>
          </div>

          {/* STEP 4 */}
          <div className="bg-[#faf9f7] rounded-xl border border-[#e7e7e7] p-4 flex flex-col justify-between relative overflow-hidden group hover:border-[#00754A] transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#faf6ee] border-b border-l border-[#dfc49d] rounded-bl-full flex items-start justify-end pr-3 pt-2">
              <span className="text-lg font-black text-[#8c6b2d]">04</span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#cba258] text-white flex items-center justify-center shadow-sm">
                  <Star className="w-4 h-4 fill-white" />
                </div>
                <h2 className="text-sm sm:text-base font-bold text-[#1E3932]">
                  ประเมินความพึงพอใจการบริการ
                </h2>
              </div>
              <p className="text-xs text-[rgba(0,0,0,0.65)] mb-3 leading-relaxed">
                เมื่อช่างปิดงาน จะมีลิงก์ส่งมาใน LINE เพื่อให้ผู้ใช้ร่วมประเมิน
              </p>

              {/* Rating Card Mockup */}
              <div className="bg-white rounded-lg p-2.5 border border-[#dfc49d] text-center space-y-1.5">
                <p className="text-[11px] font-semibold text-[#8c6b2d]">
                  ให้คะแนนการให้บริการ (1 ถึง 5 ดาว)
                </p>
                <div className="flex items-center justify-center gap-1 text-[#d97706] py-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-[#d97706]" />
                  ))}
                </div>
                <p className="text-[10px] text-[rgba(0,0,0,0.55)]">
                  พร้อมกล่องพิมพ์ข้อเสนอแนะเพื่อนำไปปรับปรุงการบริการ
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#e7e7e7] flex items-center text-[10px] text-[#8c6b2d] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#8c6b2d]" />
              ทุกคำติชมถูกส่งตรงถึงผู้บริหารและทีมงานไอทีเพื่อพัฒนาคุณภาพ
            </div>
          </div>
        </div>

        {/* Footer Contact Bar */}
        <footer className="mt-6 pt-4 border-t border-[#e7e7e7] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1E3932]">
              ฝ่ายเทคโนโลยีสารสนเทศ วิทยาลัยชุมชนสมุทรสาคร (SMKCC)
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>📍 ศูนย์คอมพิวเตอร์ อาคารวิทยบริการ</span>
            <span className="text-[#00754A] font-semibold">📞 สายตรงไอที: 087-666-2006</span>
          </div>
        </footer>
      </article>

      {/* Print Style Optimization (เฉพาะตอนสั่งพิมพ์ A4) */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page {
              size: A4 portrait;
              margin: 8mm 10mm;
            }
            body {
              background: white !important;
              color: black !important;
              font-size: 11pt !important;
            }
            article {
              padding: 0 !important;
              border: none !important;
              box-shadow: none !important;
            }
          }
        `,
      }} />
    </main>
  );
}
