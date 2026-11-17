"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginAdmin } from "../actions";
import { Lock, User, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAdmin(formData);

    if (result.success) {
      router.push("/admin/dashboard");
      router.refresh();
      return;
    }

    setErrorMessage(result.error || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-[#f2f0eb] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-[16px] shadow-[0_0_1px_rgba(0,0,0,0.14),0_2px_8px_rgba(0,0,0,0.08)] border border-[#e7e7e7] p-8">
        <div className="text-center mb-6">
          {/* Logo */}
          <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden shadow-md ring-4 ring-[#d4e9e2] bg-white">
            <Image
              src="/logo.jpg"
              alt="SMKCC IT Support Logo"
              fill
              priority
              className="object-cover"
            />
          </div>
          <h1 className="text-lg font-bold tracking-[-0.16px] text-[#1E3932]">
            ผู้ดูแลระบบ (Admin)
          </h1>
          <p className="text-xs text-[rgba(0,0,0,0.58)] mt-1">
            IT SUPPORT SMKCC Management
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-[#c82014] rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[rgba(0,0,0,0.87)] uppercase tracking-wider mb-1.5">
              ชื่อผู้ใช้งาน (Username)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[rgba(0,0,0,0.38)] absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="username"
                required
                defaultValue="admin"
                placeholder="admin"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#d6dbde] text-sm focus:outline-none focus:ring-2 focus:ring-[#00754A]/30 focus:border-[#00754A] bg-[#faf9f7] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[rgba(0,0,0,0.87)] uppercase tracking-wider mb-1.5">
              รหัสผ่าน (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[rgba(0,0,0,0.38)] absolute left-3.5 top-3.5" />
              <input
                type="password"
                name="password"
                required
                defaultValue="smkcc@2025"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#d6dbde] text-sm focus:outline-none focus:ring-2 focus:ring-[#00754A]/30 focus:border-[#00754A] bg-[#faf9f7] focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[48px] rounded-full bg-[#00754A] hover:bg-[#006241] text-white font-semibold text-xs tracking-[-0.16px] transition-all duration-200 active:scale-[0.95] flex items-center justify-center gap-2 disabled:opacity-50 mt-2 shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                กำลังตรวจสอบ...
              </>
            ) : (
              "เข้าสู่ระบบ"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
