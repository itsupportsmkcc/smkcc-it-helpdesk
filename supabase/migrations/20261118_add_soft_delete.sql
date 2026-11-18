-- ========================================================
-- Migration: Add Soft Delete Support to Tickets
-- เพิ่มฟิลด์ is_deleted และ deleted_at สำหรับระบบถังขยะและกู้คืนเคส
-- ========================================================

ALTER TABLE public.tickets 
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.tickets 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_tickets_is_deleted ON public.tickets (is_deleted);
