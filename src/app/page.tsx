import Link from "next/link";
import { TicketForm } from "@/features/tickets/components/ticket-form";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fafafa] px-3 py-6 sm:py-10 flex flex-col justify-center items-center">
      <TicketForm />
      <footer className="mt-6 text-center text-xs text-[#666666] space-y-2">
        <div>ฝ่ายเทคโนโลยีสารสนเทศ วิทยาลัยชุมชนสมุทรสาคร (SMKCC)</div>
        <div className="flex items-center justify-center gap-3 text-[#8f8f8f]">
          <a
            href="/guide.html"
            className="text-[#1d1d1f] hover:text-[#7f0019] hover:underline font-medium"
          >
            คู่มือการใช้งาน (User Guide)
          </a>
          <span>•</span>
          <Link
            href="/admin/login"
            className="text-[#666666] hover:text-[#1d1d1f] transition-colors underline decoration-dotted"
          >
            เข้าสู่ระบบผู้ดูแล (Admin)
          </Link>
        </div>
      </footer>
    </main>
  );
}

