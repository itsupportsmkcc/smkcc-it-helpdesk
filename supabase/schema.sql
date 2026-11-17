-- ========================================================
-- SMKCC IT Helpdesk - Supabase Database Schema
-- ระบบแจ้งซ่อมและบริการด้านไอที วิทยาลัยชุมชนสมุทรสาคร
-- ========================================================

-- 1. สร้างตาราง tickets
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    line_user_id TEXT NOT NULL,
    line_display_name TEXT,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    user_type TEXT NOT NULL CHECK (user_type IN ('student', 'staff')),
    issue_type TEXT NOT NULL,
    location TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    description TEXT,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'pending', 'resolved')),
    assignee TEXT NOT NULL DEFAULT 'นายเอกพงศ์ (IT Admin)',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index สำหรับค้นหาและจัดเรียง
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets (status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON public.tickets (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_line_user_id ON public.tickets (line_user_id);

-- Trigger อัปเดต updated_at อัตโนมัติ
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_tickets_updated_at ON public.tickets;
CREATE TRIGGER trigger_update_tickets_updated_at
BEFORE UPDATE ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 2. สร้างตาราง feedbacks (ประเมินความพึงพอใจ)
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_feedbacks_ticket_id ON public.feedbacks (ticket_id);

-- 3. Row Level Security (RLS) Configuration
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- ผู้ใช้ทั่วไปผ่าน LINE LIFF สามารถสร้าง Ticket ได้
CREATE POLICY "Allow public insert to tickets"
ON public.tickets FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ผู้ใช้และแอดมินสามารถอ่านข้อมูล Ticket ได้ (หรือใช้ Service Role ใน Server Actions)
CREATE POLICY "Allow read tickets"
ON public.tickets FOR SELECT
TO anon, authenticated
USING (true);

-- แอดมินสามารถอัปเดต Ticket ได้
CREATE POLICY "Allow update tickets"
ON public.tickets FOR UPDATE
TO anon, authenticated
USING (true);

-- ผู้ใช้สามารถส่งผลประเมิน feedback ได้
CREATE POLICY "Allow public insert to feedbacks"
ON public.feedbacks FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- อ่านผลการประเมิน
CREATE POLICY "Allow read feedbacks"
ON public.feedbacks FOR SELECT
TO anon, authenticated
USING (true);

-- 4. ตั้งค่า Storage Bucket สำหรับรูปภาพปัญหา
-- รันคำสั่งนี้หรือสร้าง Bucket ชื่อ 'ticket-attachments' ใน Supabase Dashboard -> Storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('ticket-attachments', 'ticket-attachments', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public upload to ticket-attachments"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'ticket-attachments');

CREATE POLICY "Allow public read from ticket-attachments"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'ticket-attachments');

-- อัปเดตโครงสร้างเพิ่มเติม: รองรับการเก็บชื่อโปรไฟล์ LINE ไว้หลังบ้าน
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS line_display_name TEXT;
