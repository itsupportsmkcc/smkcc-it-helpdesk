import { TicketForm } from "@/features/tickets/components/ticket-form";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f2f0eb] px-3 py-6 sm:py-10 flex flex-col justify-center items-center">
      <TicketForm />
      <footer className="mt-6 text-center text-xs text-[rgba(0,0,0,0.58)] font-medium">
        ฝ่ายเทคโนโลยีสารสนเทศ วิทยาลัยชุมชนสมุทรสาคร (SMKCC)
      </footer>
    </main>
  );
}
