import Link from "next/link";
import { TicketForm } from "@/features/tickets/components/ticket-form";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f2f0eb] px-3 py-6 sm:py-10 flex flex-col justify-center items-center">
      <TicketForm />
      <footer className="mt-6 text-center text-xs text-[rgba(0,0,0,0.58)] font-medium space-y-1">
        <div>ฝ่ายเทคโนโลยีสารสนเทศ วิทยาลัยชุมชนสมุทรสาคร (SMKCC)</div>
        <div>
          <Link
            href="/admin/login"
            className="text-[rgba(0,0,0,0.38)] hover:text-[#1E3932] transition-colors underline decoration-dotted"
          >
            เข้าสู่ระบบผู้ดูแล (Admin)
          </Link>
        </div>
      </footer>
    </main>
  );
}

