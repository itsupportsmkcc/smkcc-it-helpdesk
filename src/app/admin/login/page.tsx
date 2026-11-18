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
    <main className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-[2px] border border-[#e0e0e0] p-8">
        <div className="text-center mb-6">
          {/* Logo */}
          <div className="relative w-20 h-20 mx-auto mb-3 rounded-[2px] overflow-hidden border border-[#e0e0e0] bg-white">
            <Image
              src="/logo.jpg"
              alt="SMKCC IT Support Logo"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="bg-[#7f0019] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] tracking-wider uppercase">
              ADMIN
            </span>
          </div>
          <h1 className="text-base font-bold tracking-tight text-[#1d1d1f]">
            ผู้ดูแลระบบ (Admin)
          </h1>
          <p className="text-xs text-[#666666] mt-1">
            IT SUPPORT SMKCC Management
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-white border border-[#7f0019] text-[#7f0019] rounded-[2px] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#7f0019]" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#1d1d1f] uppercase tracking-wider mb-1.5">
              ชื่อผู้ใช้งาน (Username)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8f8f8f] absolute left-3.5 top-3" />
              <input
                type="text"
                name="username"
                required
                defaultValue="admin"
                placeholder="admin"
                className="w-full pl-10 pr-4 py-2 rounded-[2px] border border-[#c4c4c6] text-sm text-[#1d1d1f] bg-white focus:outline-none focus:border-[#1d1d1f] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1d1d1f] uppercase tracking-wider mb-1.5">
              รหัสผ่าน (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8f8f8f] absolute left-3.5 top-3" />
              <input
                type="password"
                name="password"
                required
                defaultValue="smkcc@2025"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 rounded-[2px] border border-[#c4c4c6] text-sm text-[#1d1d1f] bg-white focus:outline-none focus:border-[#1d1d1f] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-[2px] bg-[#1d1d1f] hover:bg-[#3c3c43] active:bg-black text-white font-medium text-xs tracking-[-0.16px] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
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
