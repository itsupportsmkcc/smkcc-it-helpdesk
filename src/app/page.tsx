import Link from "next/link";
import { TicketForm } from "@/features/tickets/components/ticket-form";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f2f0eb] px-3 py-6 sm:py-10 flex flex-col justify-center items-center">
      <TicketForm />
      <footer className="mt-6 text-center text-xs text-[rgba(0,0,0,0.58)] font-medium space-y-2">
        <div>ฝ่ายเทคโนโลยีสารสนเทศ วิทยาลัยชุมชนสมุทรสาคร (SMKCC)</div>
        <div className="flex items-center justify-center gap-3 text-[rgba(0,0,0,0.45)]">
          <Link
            href="/guide"
            className="text-[#00754A] hover:underline font-semibold flex items-center gap-1"
          >
            📖 คู่มือการใช้งาน (Quick Guide)
          </Link>
          <span>•</span>
          <Link
            href="/admin/login"
            className="hover:text-[#1E3932] transition-colors underline decoration-dotted"
          >
            เข้าสู่ระบบผู้ดูแล (Admin)
          </Link>
        </div>
      </footer>
    </main>
  );
}

