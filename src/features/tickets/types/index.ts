export type UserType = "student" | "staff";
export type Priority = "low" | "medium" | "high";
export type TicketStatus = "new" | "in_progress" | "pending" | "resolved";

export interface TicketItem {
  id: string;
  lineUserId: string;
  fullName: string;
  phone: string;
  userType: UserType;
  issueType: string;
  location: string;
  priority: Priority;
  description?: string | null;
  imageUrl?: string | null;
  status: TicketStatus;
  assignee: string;
  createdAt: string;
  updatedAt: string;
}

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
