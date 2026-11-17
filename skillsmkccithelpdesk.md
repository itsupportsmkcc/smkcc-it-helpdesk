# System Requirements Specification (SRS)
**Project Name:** SMKCC IT Helpdesk (ระบบแจ้งซ่อมและบริการด้านไอที วิทยาลัยชุมชนสมุทรสาคร)
**Platform:** Standalone Web Application + LINE LIFF
**Database:** Supabase (PostgreSQL)

---

## 1. System Overview (ภาพรวมของระบบ)
- **Architecture:** เป็น Web Application ที่แยกอิสระ (Standalone) ออกจากระบบเดิม (SMKCC-AssetX) อย่างสิ้นเชิง เพื่อไม่ให้โครงสร้างฐานข้อมูลซับซ้อน
- **UI/UX Design:** เน้น Mobile-First 100% ออกแบบให้ใช้งานง่าย ปุ่มใหญ่ ฟอร์มสั้น รองรับการเปิดผ่าน In-App Browser ของแอปพลิเคชัน LINE
- **Authentication:** **ไม่มีระบบ Login** (Frictionless) ผู้ใช้ไม่ต้องใช้ Email/Password แต่จะใช้เทคโนโลยี **LINE LIFF** ในการดึง `LINE User ID` เบื้องหลังแบบเงียบๆ เพื่อใช้ระบุตัวตนและส่งการแจ้งเตือนกลับ

## 2. User Features (ส่วนของผู้ใช้งาน - นักศึกษาและบุคลากร)
ผู้ใช้งานจะเข้าถึงระบบผ่านลิงก์บน Rich Menu ของ LINE OA (ผ่าน LIFF URL)

### 2.1 Ticket Creation Form (ฟอร์มแจ้งปัญหา)
ข้อมูลที่ผู้ใช้ต้องกรอกเพื่อสร้าง Ticket มีดังนี้:
- **ชื่อ-นามสกุล** (Required)
- **เบอร์โทรศัพท์ติดต่อกลับ** (Required)
- **กลุ่มผู้ใช้งาน:** Dropdown หรือ Radio Button เลือก "นักศึกษา" หรือ "บุคลากร" (Required)
- **หัวข้อการแจ้งเรื่อง:** เช่น แจ้งซ่อมคอมพิวเตอร์, ขอสร้างห้อง Zoom, ลืมรหัสผ่าน (Required)
- **สถานที่/ห้อง:** ระบุอาคารหรือห้องที่เกิดปัญหา (Required)
- **ระดับความรุนแรง (Priority):** ให้ผู้ใช้เลือกผลกระทบ เช่น สูง (กระทบการสอน), กลาง, ต่ำ เพื่อใช้ประเมิน SLA (Required)
- **รายละเอียดปัญหา:** Text area สำหรับอธิบายเพิ่มเติม (Optional)
- **ไฟล์แนบ (Image Upload):** รองรับการแนบรูปภาพภาพหน้าจอหรือสภาพปัญหา 1-2 รูป (Optional)

*หมายเหตุ: ไม่มีการบังคับกรอกรหัสนักศึกษา/พนักงาน และไม่มีหน้ารวม FAQ กรองปัญหาก่อนแจ้ง*

## 3. Admin Features (ส่วนของผู้ดูแลระบบ)
ออกแบบมาเพื่อแอดมินทำงานคนเดียว (นายเอกพงศ์) โดยเน้นความรวดเร็วและลดภาระ

### 3.1 Admin Dashboard
- **Authentication:** มีระบบ Login เฉพาะแอดมิน (เช่น Username/Password หรือ Google Auth ฝั่ง Admin)
- **Ticket Management:** หน้าตาราง/บอร์ด แสดงรายการ Ticket ทั้งหมดที่แจ้งเข้ามา
- **Auto-Assignment:** ระบบจะกำหนดผู้รับผิดชอบ (Assignee) เป็นแอดมินโดยอัตโนมัติทุกเคส
- **Status Workflow:** แอดมินสามารถอัปเดตสถานะของ Ticket ได้ตามลำดับ ดังนี้:
  1. `New` (งานใหม่ที่เพิ่งแจ้งเข้ามา)
  2. `In Progress` (แอดมินรับเรื่องแล้ว / กำลังดำเนินการ)
  3. `Pending` (ติดปัญหา / รออะไหล่ / รอสอบถามข้อมูลเพิ่ม)
  4. `Resolved` (ดำเนินการเสร็จสิ้น / ปิดงาน)

## 4. Notifications & Feedback (ระบบแจ้งเตือนและประเมินผล)

### 4.1 LINE Messaging Notification
- **Trigger:** เมื่อแอดมินทำการเปลี่ยนสถานะของ Ticket ในหน้า Admin Dashboard (เช่น จาก New -> In Progress หรือ -> Resolved)
- **Action:** ระบบ (ผ่าน Backend/Webhook) จะนำ `LINE User ID` ที่เก็บไว้ตอนสร้าง Ticket มาใช้ส่งข้อความแจ้งเตือนสถานะกลับไปยังแชท LINE ของผู้แจ้งแบบรายบุคคล (Personalized Message)

### 4.2 Satisfaction Rating (การประเมินความพึงพอใจ)
- **Trigger:** เมื่อ Ticket ถูกเปลี่ยนสถานะเป็น `Resolved`
- **Action:** ในข้อความ LINE แจ้งเตือนปิดงาน จะแนบลิงก์สำหรับ "ประเมินความพึงพอใจ" ไปด้วย
- **Feedback Form:** หน้าเว็บสั้นๆ ให้ผู้ใช้กดให้คะแนน (เช่น 1-5 ดาว) เพื่อบันทึกลง Database สำหรับแอดมินนำไปทำรายงานสถิติผลการปฏิบัติงาน

## 5. Database Schema Guidance (ข้อเสนอแนะโครงสร้างฐานข้อมูลเบื้องต้น)
สำหรับ Supabase (PostgreSQL) ควรมีตารางหลักๆ อย่างน้อยดังนี้:
1. `tickets`
   - id (UUID, PK)
   - line_user_id (String)
   - full_name (String)
   - phone (String)
   - user_type (Enum: student, staff)
   - issue_type (String)
   - location (String)
   - priority (Enum: low, medium, high)
   - description (Text)
   - image_url (String, nullable)
   - status (Enum: new, in_progress, pending, resolved)
   - assignee (String, default: 'admin_id')
   - created_at (Timestamp)
   - updated_at (Timestamp)
2. `feedbacks`
   - id (UUID, PK)
   - ticket_id (UUID, FK)
   - rating (Integer 1-5)
   - comment (Text, nullable)
   - created_at (Timestamp)