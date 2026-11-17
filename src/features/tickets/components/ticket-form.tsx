"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createTicket } from "../actions/ticket-actions";
import { UserType, Priority } from "../types";
import { supabase } from "@/lib/supabase";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Computer,
  Loader2,
  Send,
  Upload,
} from "lucide-react";

const COMMON_ISSUES = [
  "แจ้งซ่อมคอมพิวเตอร์ / เปิดไม่ติด",
  "ปัญหาอินเทอร์เน็ต / Wi-Fi",
  "ขอสร้างห้องเรียน Zoom",
  "ลืมรหัสผ่าน / บัญชีผู้ใช้",
  "เครื่องพิมพ์ (Printer) ขัดข้อง",
  "โปรเจกเตอร์ / จอภาพ",
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
        // Fallback สำหรับกรณีทดสอบ Localhost
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
          // หากเปิดใน LINE Browser ปกติจะ auto-login แต่ถ้าไม่ ให้ redirect login
          liff.login();
        }
        setIsLiffReady(true);
      } catch (err) {
        console.error("LIFF Init Error:", err);
        setLiffError("ไม่สามารถเชื่อมต่อ LINE ได้ กรุณาเปิดผ่านแอปพลิเคชัน LINE");
        // Fallback เพื่อให้ทดสอบได้
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

      // นำทางไปยังหน้าสำเร็จ
      router.push(`/success?ticketId=${result.data.id}`);
    } catch (err) {
      setErrorMessage("เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 mb-3 backdrop-blur-sm">
          <Computer className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">ระบบแจ้งซ่อมและบริการไอที</h1>
        <p className="text-xs text-blue-100 mt-1">วิทยาลัยชุมชนสมุทรสาคร (SMKCC IT Helpdesk)</p>
        {lineProfileName && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            LINE: {lineProfileName}
          </div>
        )}
      </div>

      {liffError && (
        <div className="m-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{liffError}</span>
        </div>
      )}

      {errorMessage && (
        <div className="m-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* กลุ่มผู้ใช้งาน */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            กลุ่มผู้ใช้งาน <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setUserType("student")}
              className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                userType === "student"
                  ? "bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-500/20"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              🎓 นักศึกษา
            </button>
            <button
              type="button"
              onClick={() => setUserType("staff")}
              className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                userType === "staff"
                  ? "bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-500/20"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              💼 บุคลากร / อาจารย์
            </button>
          </div>
        </div>

        {/* ชื่อ-นามสกุล */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            ชื่อ-นามสกุล ผู้แจ้ง <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="เช่น นายสมชาย ใจดี"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm"
          />
        </div>

        {/* เบอร์โทรศัพท์ */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            เบอร์โทรศัพท์ติดต่อกลับ <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            pattern="0[0-9]{8,9}"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="เช่น 0812345678"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm"
          />
          <p className="text-[11px] text-slate-400 mt-1">เบอร์โทร 9-10 หลัก เพื่อให้เจ้าหน้าที่ติดต่อสะดวก</p>
        </div>

        {/* หัวข้อปัญหา */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            หัวข้อการแจ้งเรื่อง <span className="text-red-500">*</span>
          </label>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm bg-white"
          >
            <option value="">-- เลือกประเภทปัญหา --</option>
            {COMMON_ISSUES.map((issue) => (
              <option key={issue} value={issue}>
                {issue}
              </option>
            ))}
          </select>
          {issueType === "อื่นๆ (ระบุในรายละเอียด)" && (
            <input
              type="text"
              required
              value={customIssue}
              onChange={(e) => setCustomIssue(e.target.value)}
              placeholder="กรุณาระบุหัวข้อเรื่อง..."
              className="mt-2 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          )}
        </div>

        {/* สถานที่/ห้อง */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            สถานที่ / อาคาร / ห้อง <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="เช่น อาคาร 1 ห้องคอมพิวเตอร์ 102"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm"
          />
        </div>

        {/* ระดับความรุนแรง (Priority) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            ระดับผลกระทบ (Priority) <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPriority("high")}
              className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                priority === "high"
                  ? "bg-red-50 border-red-500 text-red-700 ring-2 ring-red-400/20 font-bold"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              🔴 สูง (กระทบการสอน)
            </button>
            <button
              type="button"
              onClick={() => setPriority("medium")}
              className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                priority === "medium"
                  ? "bg-orange-50 border-orange-500 text-orange-700 ring-2 ring-orange-400/20 font-bold"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              🟠 ปานกลาง
            </button>
            <button
              type="button"
              onClick={() => setPriority("low")}
              className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                priority === "low"
                  ? "bg-slate-100 border-slate-400 text-slate-700 ring-2 ring-slate-400/20 font-bold"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              🟢 ทั่วไป / ต่ำ
            </button>
          </div>
        </div>

        {/* รายละเอียดเพิ่มเติม */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            รายละเอียดปัญหาเพิ่มเติม (ถ้ามี)
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="อธิบายอาการ เช่น หน้าจอฟ้า, ต่อโปรเจกเตอร์ไม่ติด, สายหลุด..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm resize-none"
          />
        </div>

        {/* แนบรูปภาพ */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            แนบรูปภาพปัญหา (ถ้ามี)
          </label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer text-sm font-medium transition-colors">
              <Camera className="w-4 h-4 text-slate-500" />
              <span>เลือกหรือถ่ายภาพ</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {imageFile && (
              <span className="text-xs text-slate-500 truncate max-w-[180px]">
                {imageFile.name}
              </span>
            )}
          </div>
          {previewUrl && (
            <div className="mt-3 relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
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
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* ปุ่มส่งข้อมูล */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              กำลังส่งข้อมูล...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              ส่งเรื่องแจ้งซ่อม
            </>
          )}
        </button>
      </form>
    </div>
  );
}
