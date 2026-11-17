export interface FeedbackItem {
  id: string;
  ticketId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
}
