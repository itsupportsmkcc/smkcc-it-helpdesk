"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createTicket } from "../actions/ticket-actions";
import { UserType, Priority } from "../types";
import { supabase } from "@/lib/supabase";
import {
  AlertCircle,
  Camera,
  Loader2,
  Send,
  PhoneCall,
  MapPin,
  FileText,
  User,
  Wrench,
  Check,
} from "lucide-react";

const COMMON_ISSUES = [
  "แจ้งซ่อมคอมพิวเตอร์ / เปิดไม่ติด",
  "ปัญหาอินเทอร์เน็ต / Wi-Fi",
  "ขอเลขห้อง Zoom",
  "ลืมรหัสผ่าน / บัญชีผู้ใช้",
  "เครื่องพิมพ์ (Printer) ขัดข้อง",
  "อื่นๆ (ระบุในรายละเอียด)",
];

export function TicketForm() {
  const router = useRouter();
  const [lineUserId, setLineUserId] = useState<string>("");
  const [lineProfileName, setLineProfileName] = useState<string>("");
  const [isLiffReady, setIsLiffReady] = useState<boolean>(false);
  const [liffError, setLiffError] = useState<string>("");

  // Form states
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [userType, setUserType] = useState<UserType>("student");
  const [issueType, setIssueType] = useState<string>("");
  const [customIssue, setCustomIssue] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [description, setDescription] = useState<string>("");

  // File Upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // ป้องกันการรีเซ็ตชื่อซ้ำเมื่อผู้ใช้กดลบเพื่อพิมพ์ชื่อใหม่
  const hasAutoFilledNameRef = useRef<boolean>(false);

  // Initialize LIFF (รันเพียงครั้งเดียวเมื่อหน้าเว็บโหลด)
  useEffect(() => {
    async function initLiff() {
      const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
      if (!liffId) {
        console.warn("LIFF ID not configured. Using local dev identity.");
        setLineUserId("local-dev-user-001");
        setLineProfileName("ผู้ทดสอบระบบ");
        setIsLiffReady(true);
        return;
      }

      try {
        const liff = (await import("@line/liff")).default;
        await liff.init({ liffId });

        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          setLineUserId(profile.userId);
          setLineProfileName(profile.displayName);
        } else {
          liff.login();
        }
        setIsLiffReady(true);
      } catch (err) {
        console.error("LIFF Init Error:", err);
        setLiffError("เปิดในบราวเซอร์ทั่วไป (ระบบจำลองโหมดทดสอบ)");
        setLineUserId("guest-fallback-user");
        setIsLiffReady(true);
      }
    }

    initLiff();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("ขนาดไฟล์ภาพต้องไม่เกิน 5MB");
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    try {
      const ext = file.name.split(".").pop();
      const fileName = `ticket-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabase.storage
        .from("ticket-attachments")
        .upload(filePath, file);

      if (error) {
        console.warn("Supabase Storage upload warning:", error.message);
        return null;
      }

      const { data: publicUrlData } = supabase.storage
        .from("ticket-attachments")
        .getPublicUrl(data.path);

      return publicUrlData.publicUrl;
    } catch (e) {
      console.warn("Upload exception:", e);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const selectedIssue = issueType === "อื่นๆ (ระบุในรายละเอียด)" ? customIssue : issueType;
    if (!selectedIssue || selectedIssue.trim() === "") {
      setErrorMessage("กรุณาเลือกหรือระบุหัวข้อปัญหา");
      return;
    }

    if (!location.trim()) {
      setErrorMessage("กรุณาระบุสถานที่หรือห้องที่เกิดปัญหา");
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedImageUrl: string | undefined = undefined;
      if (imageFile) {
        const url = await uploadImageToSupabase(imageFile);
        if (url) uploadedImageUrl = url;
      }

      const result = await createTicket({
        lineUserId: lineUserId || "line-user-unknown",
        lineDisplayName: lineProfileName || undefined,
        fullName: fullName.trim(),
        phone: phone.trim(),
        userType,
        issueType: selectedIssue,
        location: location.trim(),
        priority,
        description: description.trim() || undefined,
        imageUrl: uploadedImageUrl,
      });

      if (!result.success) {
        setErrorMessage(result.error);
        setIsSubmitting(false);
        return;
      }

      router.push(`/success?ticketId=${result.data.id}`);
    } catch (err) {
      setErrorMessage("เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Main Container Card: MUJI Two-Tier Radius & Paper-White Canvas */}
      <div className="bg-white rounded-[2px] border border-[#e0e0e0] overflow-hidden">
        {/* Header Band: MUJI Surface Secondary (#ebebec) */}
        <div className="bg-[#ebebec] px-6 py-7 text-center relative border-b border-[#e0e0e0]">
          {/* Logo Badge */}
          <div className="relative w-20 h-20 mx-auto mb-3 rounded-[2px] overflow-hidden border border-[#c4c4c6] bg-white">
            <Image
              src="/logo.jpg"
              alt="SMKCC IT Support Logo"
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="bg-[#7f0019] text-white text-[11px] font-bold px-2 py-0.5 rounded-[2px] tracking-wider uppercase">
              SMKCC IT HELPDESK
            </span>
          </div>

          <h1 className="text-xl font-bold tracking-tight text-[#1d1d1f]">
            บริการแจ้งซ่อมไอที วิทยาลัยชุมชนสมุทรสาคร
          </h1>
          <p className="text-xs text-[#666666] font-normal mt-1">
            ฝ่ายเทคโนโลยีสารสนเทศ • บริการช่วยเหลือและสนับสนุนงานระบบ
          </p>

          {lineProfileName && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs text-[#3c3c43] border border-[#c4c4c6]">
              <span className="w-2 h-2 rounded-full bg-[#009262]"></span>
              ผู้ใช้งาน LINE: {lineProfileName}
            </div>
          )}
        </div>

        {/* Notices */}
        {liffError && (
          <div className="mx-6 mt-4 p-3 bg-[#ebebec] border border-[#c4c4c6] text-[#3c3c43] rounded-[2px] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#666666]" />
            <span>{liffError}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-white border border-[#7f0019] text-[#7f0019] rounded-[2px] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#7f0019]" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Ticket Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          {/* User Type: MUJI 9999px Pill Toggle */}
          <div>
            <label className="block text-xs font-medium text-[#1d1d1f] uppercase tracking-wider mb-2">
              กลุ่มผู้ใช้งาน <span className="text-[#7f0019]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setUserType("student")}
                className={`py-2 px-4 rounded-full text-xs font-medium tracking-[-0.16px] transition-colors flex items-center justify-center gap-1.5 border ${
                  userType === "student"
                    ? "bg-[#1d1d1f] text-white border-[#1d1d1f]"
                    : "bg-[#ebebec] text-[#666666] border-[#e0e0e0] hover:bg-[#e0e0e0]"
                }`}
              >
                {userType === "student" && <Check className="w-3.5 h-3.5" />}
                นักศึกษา (Student)
              </button>
              <button
                type="button"
                onClick={() => setUserType("staff")}
                className={`py-2 px-4 rounded-full text-xs font-medium tracking-[-0.16px] transition-colors flex items-center justify-center gap-1.5 border ${
                  userType === "staff"
                    ? "bg-[#1d1d1f] text-white border-[#1d1d1f]"
                    : "bg-[#ebebec] text-[#666666] border-[#e0e0e0] hover:bg-[#e0e0e0]"
                }`}
              >
                {userType === "staff" && <Check className="w-3.5 h-3.5" />}
                บุคลากร / อาจารย์ (Staff)
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-[#1d1d1f] uppercase tracking-wider mb-1.5">
              ชื่อ-นามสกุล ผู้แจ้ง <span className="text-[#7f0019]">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8f8f8f] absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="กรุณากรอกชื่อ-นามสกุลจริง เช่น นายสมชาย ใจดี"
                className="w-full pl-10 pr-4 py-2.5 rounded-[2px] border border-[#c4c4c6] text-sm text-[#1d1d1f] bg-white focus:outline-none focus:border-[#1d1d1f] transition-colors placeholder-[#9d9da0]"
              />
            </div>
            <p className="text-[11px] text-[#8f8f8f] mt-1">
              กรุณาระบุชื่อ-นามสกุลจริงเพื่อความถูกต้องในการติดตามงาน
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-[#1d1d1f] uppercase tracking-wider mb-1.5">
              เบอร์โทรศัพท์ติดต่อกลับ <span className="text-[#7f0019]">*</span>
            </label>
            <div className="relative">
              <PhoneCall className="w-4 h-4 text-[#8f8f8f] absolute left-3.5 top-3.5" />
              <input
                type="tel"
                required
                pattern="0[0-9]{8,9}"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="เช่น 0812345678"
                className="w-full pl-10 pr-4 py-2.5 rounded-[2px] border border-[#c4c4c6] text-sm text-[#1d1d1f] bg-white focus:outline-none focus:border-[#1d1d1f] transition-colors font-mono placeholder-[#9d9da0]"
              />
            </div>
            <p className="text-[11px] text-[#8f8f8f] mt-1">
              เบอร์โทรศัพท์ 9-10 หลักสำหรับติดต่อประสานงาน
            </p>
          </div>

          {/* Issue Type */}
          <div>
            <label className="block text-xs font-medium text-[#1d1d1f] uppercase tracking-wider mb-1.5">
              หัวข้อการแจ้งเรื่อง / ประเภทปัญหา <span className="text-[#7f0019]">*</span>
            </label>
            <div className="relative">
              <Wrench className="w-4 h-4 text-[#8f8f8f] absolute left-3.5 top-3.5 pointer-events-none" />
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-[2px] border border-[#c4c4c6] text-sm text-[#1d1d1f] bg-white focus:outline-none focus:border-[#1d1d1f] transition-colors"
              >
                <option value="">-- เลือกประเภทปัญหา --</option>
                {COMMON_ISSUES.map((issue) => (
                  <option key={issue} value={issue}>
                    {issue}
                  </option>
                ))}
              </select>
            </div>
            {issueType === "อื่นๆ (ระบุในรายละเอียด)" && (
              <input
                type="text"
                required
                value={customIssue}
                onChange={(e) => setCustomIssue(e.target.value)}
                placeholder="กรุณาระบุหัวข้อเรื่อง..."
                className="mt-2 w-full px-4 py-2 rounded-[2px] border border-[#c4c4c6] text-sm text-[#1d1d1f] bg-white focus:outline-none focus:border-[#1d1d1f]"
              />
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-medium text-[#1d1d1f] uppercase tracking-wider mb-1.5">
              สถานที่ / อาคาร / ห้องที่เกิดปัญหา <span className="text-[#7f0019]">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#8f8f8f] absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="เช่น อาคาร 1 ห้องปฏิบัติการคอมพิวเตอร์ 102"
                className="w-full pl-10 pr-4 py-2.5 rounded-[2px] border border-[#c4c4c6] text-sm text-[#1d1d1f] bg-white focus:outline-none focus:border-[#1d1d1f] transition-colors placeholder-[#9d9da0]"
              />
            </div>
          </div>

          {/* Priority: MUJI 9999px Pill Selectors */}
          <div>
            <label className="block text-xs font-medium text-[#1d1d1f] uppercase tracking-wider mb-2">
              ระดับความเร่งด่วน (Impact / Priority) <span className="text-[#7f0019]">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority("high")}
                className={`py-2 px-3 rounded-full text-xs font-medium transition-colors border text-center ${
                  priority === "high"
                    ? "bg-[#7f0019] text-white border-[#7f0019]"
                    : "bg-white text-[#7f0019] border-[#c4c4c6] hover:bg-[#ebebec]"
                }`}
              >
                สูง (กระทบสอน)
              </button>
              <button
                type="button"
                onClick={() => setPriority("medium")}
                className={`py-2 px-3 rounded-full text-xs font-medium transition-colors border text-center ${
                  priority === "medium"
                    ? "bg-[#1d1d1f] text-white border-[#1d1d1f]"
                    : "bg-[#ebebec] text-[#3c3c43] border-[#e0e0e0] hover:bg-[#e0e0e0]"
                }`}
              >
                ปานกลาง
              </button>
              <button
                type="button"
                onClick={() => setPriority("low")}
                className={`py-2 px-3 rounded-full text-xs font-medium transition-colors border text-center ${
                  priority === "low"
                    ? "bg-[#666666] text-white border-[#666666]"
                    : "bg-[#ebebec] text-[#666666] border-[#e0e0e0] hover:bg-[#e0e0e0]"
                }`}
              >
                ทั่วไป
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-[#1d1d1f] uppercase tracking-wider mb-1.5">
              รายละเอียดเพิ่มเติม (Description)
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-[#8f8f8f] absolute left-3.5 top-3.5" />
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ระบุอาการ เช่น เปิดเครื่องแล้วจอดำ, ต่อสัญญาณโปรเจกเตอร์ไม่ขึ้น..."
                className="w-full pl-10 pr-4 py-2.5 rounded-[2px] border border-[#c4c4c6] text-sm text-[#1d1d1f] bg-white focus:outline-none focus:border-[#1d1d1f] transition-colors resize-none placeholder-[#9d9da0]"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-medium text-[#1d1d1f] uppercase tracking-wider mb-1.5">
              รูปภาพประกอบปัญหา (ถ้ามี)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3.5 py-2 rounded-[2px] border border-[#c4c4c6] bg-white hover:bg-[#ebebec] text-[#1d1d1f] cursor-pointer text-xs font-medium transition-colors">
                <Camera className="w-4 h-4 text-[#666666]" />
                <span>เลือกรูปภาพ</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imageFile && (
                <span className="text-xs text-[#666666] truncate max-w-[170px]">
                  {imageFile.name}
                </span>
              )}
            </div>

            {previewUrl && (
              <div className="mt-3 relative w-24 h-24 rounded-[2px] overflow-hidden border border-[#c4c4c6]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-1 right-1 bg-[#1d1d1f] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Primary CTA Button: MUJI 2px Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-[2px] bg-[#1d1d1f] hover:bg-[#3c3c43] active:bg-black text-white font-medium text-sm tracking-[-0.16px] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  กำลังส่งข้อมูลแจ้งเรื่อง...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  ส่งเรื่องแจ้งซ่อมไอที
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Floating Quick Contact */}
      <a
        href="tel:034427500"
        title="โทรติดต่อด่วนฝ่ายไอที"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-[2px] bg-[#1d1d1f] text-white border border-[#1d1d1f] hover:bg-[#3c3c43] transition-colors flex items-center justify-center z-40"
      >
        <PhoneCall className="w-5 h-5" />
      </a>
    </div>
  );
}
