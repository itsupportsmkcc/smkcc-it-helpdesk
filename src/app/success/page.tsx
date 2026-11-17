import Link from "next/link";
import { CheckCircle2, MessageSquare, ArrowLeft } from "lucide-react";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ticketId?: string }>;
}) {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">ส่งเรื่องเรียบร้อยแล้ว</h1>
        <p className="text-sm text-slate-600 mt-2">
          เจ้าหน้าที่ไอที (คุณเอกพงศ์) ได้รับเรื่องของท่านเรียบร้อยแล้ว และกำลังจัดคิวเพื่อดำเนินการให้โดยเร็วที่สุด
        </p>

        <div className="my-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-left">
          <div className="flex items-start gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 leading-relaxed">
              <span className="font-semibold block mb-0.5">ระบบแจ้งเตือนผ่าน LINE อัตโนมัติ:</span>
              เมื่อเจ้าหน้าที่เริ่มดำเนินการ หรือปิดงาน คุณจะได้รับการแจ้งเตือนผ่านแชท LINE ของคุณทันที
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับหน้าหลัก
        </Link>
      </div>
    </main>
  );
}
