import { TicketForm } from "@/features/tickets/components/ticket-form";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100/70 p-3 sm:p-6 flex flex-col justify-center items-center">
      <TicketForm />
      <footer className="mt-4 text-center text-[11px] text-slate-400">
        ฝ่ายเทคโนโลยีสารสนเทศ วิทยาลัยชุมชนสมุทรสาคร
      </footer>
    </main>
  );
}
