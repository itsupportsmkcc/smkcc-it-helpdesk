import { getTicketById } from "@/features/tickets/actions/ticket-actions";
import { FeedbackForm } from "@/features/feedbacks/components/feedback-form";

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  const ticketRes = await getTicketById(ticketId);
  const issueType = ticketRes.success ? ticketRes.data.issueType : undefined;

  return (
    <main className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <FeedbackForm ticketId={ticketId} issueType={issueType} />
    </main>
  );
}
