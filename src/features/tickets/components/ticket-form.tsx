"use client";

import { useState, useEffect } from "react";
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

  // Initialize LIFF
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
          if (!fullName) {
            setFullName(profile.displayName);
          }
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
  }, [fullName]);

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
      {/* Main Container Card: Warm Clean Café Aesthetic */}
      <div className="bg-white rounded-[16px] shadow-[0_0_1px_rgba(0,0,0,0.14),0_2px_8px_rgba(0,0,0,0.08)] border border-[#e7e7e7] overflow-hidden">
        {/* Feature Band: Starbucks House Green (#1E3932) */}
        <div className="bg-[#1E3932] px-6 py-7 text-white text-center relative">
          {/* Logo Badge */}
          <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden shadow-lg ring-4 ring-white/15 bg-white">
            <Image
              src="/logo.jpg"
              alt="SMKCC IT Support Logo"
              fill
              priority
              className="object-cover"
            />
          </div>

          <h1 className="text-xl font-bold tracking-[-0.16px] text-white">
            บริการไอที วิทยาลัยชุมชนสมุทรสาคร
          </h1>
          <p className="text-xs text-[#d4e9e2] font-medium mt-1">
            IT SUPPORT SMKCC • Helpdesk Service
          </p>

          {lineProfileName && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-[#faf6ee] backdrop-blur-sm border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#00754A] ring-2 ring-emerald-300"></span>
              ผู้ใช้งาน LINE: {lineProfileName}
            </div>
          )}
        </div>

        {/* Notices */}
        {liffError && (
          <div className="mx-6 mt-4 p-3 bg-[#faf6ee] border border-[#dfc49d] text-[#1E3932] rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#cba258]" />
            <span>{liffError}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-[#c82014] rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Ticket Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          {/* User Type: Starbucks Pill Toggle */}
          <div>
            <label className="block text-xs font-semibold text-[rgba(0,0,0,0.87)] uppercase tracking-wider mb-2">
              กลุ่มผู้ใช้งาน <span className="text-[#c82014]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setUserType("student")}
                className={`py-2.5 px-4 rounded-full text-xs font-semibold tracking-[-0.16px] transition-all duration-200 active:scale-[0.95] flex items-center justify-center gap-1.5 border ${
                  userType === "student"
                    ? "bg-[#00754A] text-white border-[#00754A] shadow-sm"
                    : "bg-[#f2f0eb] text-[rgba(0,0,0,0.87)] border-[#d6dbde] hover:bg-[#edebe9]"
                }`}
              >
                {userType === "student" && <Check className="w-3.5 h-3.5" />}
                นักศึกษา (Student)
              </button>
              <button
                type="button"
                onClick={() => setUserType("staff")}
                className={`py-2.5 px-4 rounded-full text-xs font-semibold tracking-[-0.16px] transition-all duration-200 active:scale-[0.95] flex items-center justify-center gap-1.5 border ${
                  userType === "staff"
                    ? "bg-[#00754A] text-white border-[#00754A] shadow-sm"
                    : "bg-[#f2f0eb] text-[rgba(0,0,0,0.87)] border-[#d6dbde] hover:bg-[#edebe9]"
                }`}
              >
                {userType === "staff" && <Check className="w-3.5 h-3.5" />}
                บุคลากร / อาจารย์ (Staff)
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[rgba(0,0,0,0.87)] uppercase tracking-wider mb-1.5">
              ชื่อ-นามสกุล ผู้แจ้ง <span className="text-[#c82014]">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[rgba(0,0,0,0.38)] absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="เช่น นายสมชาย ใจดี"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#d6dbde] text-sm focus:outline-none focus:ring-2 focus:ring-[#00754A]/30 focus:border-[#00754A] transition-all bg-[#faf9f7] focus:bg-white"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-[rgba(0,0,0,0.87)] uppercase tracking-wider mb-1.5">
              เบอร์โทรศัพท์ติดต่อกลับ <span className="text-[#c82014]">*</span>
            </label>
            <div className="relative">
              <PhoneCall className="w-4 h-4 text-[rgba(0,0,0,0.38)] absolute left-3.5 top-3.5" />
              <input
                type="tel"
                required
                pattern="0[0-9]{8,9}"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="เช่น 0812345678"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#d6dbde] text-sm focus:outline-none focus:ring-2 focus:ring-[#00754A]/30 focus:border-[#00754A] transition-all bg-[#faf9f7] focus:bg-white font-mono"
              />
            </div>
            <p className="text-[11px] text-[rgba(0,0,0,0.45)] mt-1">
              เบอร์โทรศัพท์ 9-10 หลักสำหรับติดต่อประสานงาน
            </p>
          </div>

          {/* Issue Type */}
          <div>
            <label className="block text-xs font-semibold text-[rgba(0,0,0,0.87)] uppercase tracking-wider mb-1.5">
              หัวข้อการแจ้งเรื่อง / ประเภทปัญหา <span className="text-[#c82014]">*</span>
            </label>
            <div className="relative">
              <Wrench className="w-4 h-4 text-[rgba(0,0,0,0.38)] absolute left-3.5 top-3.5 pointer-events-none" />
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#d6dbde] text-sm focus:outline-none focus:ring-2 focus:ring-[#00754A]/30 focus:border-[#00754A] transition-all bg-[#faf9f7] focus:bg-white"
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
                className="mt-2 w-full px-4 py-2.5 rounded-xl border border-[#d6dbde] text-sm focus:outline-none focus:ring-2 focus:ring-[#00754A]/30"
              />
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-[rgba(0,0,0,0.87)] uppercase tracking-wider mb-1.5">
              สถานที่ / อาคาร / ห้องที่เกิดปัญหา <span className="text-[#c82014]">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[rgba(0,0,0,0.38)] absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="เช่น อาคาร 1 ห้องปฏิบัติการคอมพิวเตอร์ 102"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#d6dbde] text-sm focus:outline-none focus:ring-2 focus:ring-[#00754A]/30 focus:border-[#00754A] transition-all bg-[#faf9f7] focus:bg-white"
              />
            </div>
          </div>

          {/* Priority: Starbucks Pill Selectors */}
          <div>
            <label className="block text-xs font-semibold text-[rgba(0,0,0,0.87)] uppercase tracking-wider mb-2">
              ระดับความเร่งด่วน (Impact / Priority) <span className="text-[#c82014]">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority("high")}
                className={`py-2 px-3 rounded-full text-xs font-semibold transition-all duration-200 active:scale-[0.95] border text-center ${
                  priority === "high"
                    ? "bg-[#c82014] text-white border-[#c82014] shadow-sm"
                    : "bg-[#f2f0eb] text-[rgba(0,0,0,0.87)] border-[#d6dbde] hover:bg-[#edebe9]"
                }`}
              >
                🔴 สูง (กระทบสอน)
              </button>
              <button
                type="button"
                onClick={() => setPriority("medium")}
                className={`py-2 px-3 rounded-full text-xs font-semibold transition-all duration-200 active:scale-[0.95] border text-center ${
                  priority === "medium"
                    ? "bg-[#00754A] text-white border-[#00754A] shadow-sm"
                    : "bg-[#f2f0eb] text-[rgba(0,0,0,0.87)] border-[#d6dbde] hover:bg-[#edebe9]"
                }`}
              >
                🟠 ปานกลาง
              </button>
              <button
                type="button"
                onClick={() => setPriority("low")}
                className={`py-2 px-3 rounded-full text-xs font-semibold transition-all duration-200 active:scale-[0.95] border text-center ${
                  priority === "low"
                    ? "bg-[#1E3932] text-white border-[#1E3932] shadow-sm"
                    : "bg-[#f2f0eb] text-[rgba(0,0,0,0.87)] border-[#d6dbde] hover:bg-[#edebe9]"
                }`}
              >
                🟢 ทั่วไป / ต่ำ
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[rgba(0,0,0,0.87)] uppercase tracking-wider mb-1.5">
              รายละเอียดเพิ่มเติม (Description)
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-[rgba(0,0,0,0.38)] absolute left-3.5 top-3.5" />
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ระบุอาการ เช่น เปิดเครื่องแล้วจอดำ, ต่อสัญญาณโปรเจกเตอร์ไม่ขึ้น..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#d6dbde] text-sm focus:outline-none focus:ring-2 focus:ring-[#00754A]/30 focus:border-[#00754A] transition-all bg-[#faf9f7] focus:bg-white resize-none"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-[rgba(0,0,0,0.87)] uppercase tracking-wider mb-1.5">
              รูปภาพประกอบปัญหา (ถ้ามี)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#00754A] text-[#00754A] hover:bg-[#d4e9e2]/30 cursor-pointer text-xs font-semibold transition-all active:scale-[0.95]">
                <Camera className="w-4 h-4 text-[#00754A]" />
                <span>ถ่ายภาพ / เลือกรูปภาพ</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imageFile && (
                <span className="text-xs text-[rgba(0,0,0,0.6)] truncate max-w-[170px]">
                  {imageFile.name}
                </span>
              )}
            </div>

            {previewUrl && (
              <div className="mt-3 relative w-28 h-28 rounded-xl overflow-hidden border border-[#d6dbde] shadow-sm">
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
                  className="absolute top-1 right-1 bg-[#c82014] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md active:scale-90"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Primary CTA Button: Starbucks 50px Full-Pill with scale(0.95) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[50px] rounded-full bg-[#00754A] hover:bg-[#006241] active:scale-[0.95] text-white font-semibold text-sm tracking-[-0.16px] shadow-[0_2px_6px_rgba(0,117,74,0.3)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Signature Floating Frap-style Button: 56px circular floating quick contact */}
      <a
        href="tel:034427500"
        title="โทรติดต่อด่วนฝ่ายไอที"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#00754A] text-white shadow-[0_0_6px_rgba(0,0,0,0.24),0_8px_12px_rgba(0,0,0,0.14)] active:scale-[0.95] transition-all duration-200 flex items-center justify-center z-40 hover:bg-[#006241]"
      >
        <PhoneCall className="w-6 h-6" />
      </a>
    </div>
  );
}
