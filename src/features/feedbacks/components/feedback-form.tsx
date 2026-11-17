"use client";

import { useState } from "react";
import Image from "next/image";
import { createFeedback } from "../actions/feedback-actions";
import { Star, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface FeedbackFormProps {
  ticketId: string;
  issueType?: string;
}

export function FeedbackForm({ ticketId, issueType }: FeedbackFormProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const result = await createFeedback({
      ticketId,
      rating,
      comment: comment.trim() || undefined,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error);
      return;
    }

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-[16px] shadow-[0_0_1px_rgba(0,0,0,0.14),0_2px_8px_rgba(0,0,0,0.08)] border border-[#e7e7e7] p-8 text-center">
        <div className="w-16 h-16 bg-[#d4e9e2] text-[#00754A] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h2 className="text-xl font-bold tracking-[-0.16px] text-[rgba(0,0,0,0.87)]">
          ขอบพระคุณสำหรับการประเมิน
        </h2>
        <p className="text-xs text-[rgba(0,0,0,0.58)] mt-2 leading-relaxed">
          ความคิดเห็นของท่านมีคุณค่าอย่างยิ่งในการพัฒนาและยกระดับการให้บริการไอทีของวิทยาลัยชุมชนสมุทรสาคร
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-[16px] shadow-[0_0_1px_rgba(0,0,0,0.14),0_2px_8px_rgba(0,0,0,0.08)] border border-[#e7e7e7] p-6 sm:p-7">
      <div className="text-center mb-6">
        {/* Logo */}
        <div className="relative w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden shadow-sm ring-2 ring-[#d4e9e2] bg-white">
          <Image
            src="/logo.jpg"
            alt="SMKCC IT Support Logo"
            fill
            className="object-cover"
          />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-[#faf6ee] text-[#cba258] border border-[#dfc49d] text-xs font-semibold mb-2">
          ★ แบบประเมินความพึงพอใจ
        </span>
        <h1 className="text-lg font-bold tracking-[-0.16px] text-[rgba(0,0,0,0.87)]">
          ประเมินการให้บริการไอที
        </h1>
        {issueType && (
          <p className="text-xs text-[rgba(0,0,0,0.58)] mt-1 font-medium">
            เรื่อง: {issueType}
          </p>
        )}
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-[#c82014] rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating using Starbucks Gold (#cba258) */}
        <div className="text-center">
          <label className="block text-xs font-semibold text-[rgba(0,0,0,0.87)] uppercase tracking-wider mb-3">
            ระดับความพึงพอใจโดยรวม
          </label>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1.5 focus:outline-none transition-transform hover:scale-125 active:scale-95"
                >
                  <Star
                    className={`w-9 h-9 transition-colors ${
                      active
                        ? "text-[#cba258] fill-[#cba258] drop-shadow-sm"
                        : "text-[#d6dbde] stroke-[1.5]"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <p className="text-xs text-[#00754A] mt-2 font-semibold">
            {rating === 5 && "⭐ ดีเยี่ยม / พึงพอใจมากที่สุด"}
            {rating === 4 && "⭐ ดีมาก / พึงพอใจมาก"}
            {rating === 3 && "⭐ ปานกลาง"}
            {rating === 2 && "⭐ พอใช้ / ควรปรับปรุง"}
            {rating === 1 && "⭐ ไม่พึงพอใจ"}
          </p>
        </div>

        {/* Comment textarea */}
        <div>
          <label className="block text-xs font-semibold text-[rgba(0,0,0,0.87)] uppercase tracking-wider mb-1.5">
            ข้อเสนอแนะเพิ่มเติม (ถ้ามี)
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="คำแนะนำหรือข้อเสนอแนะเพื่อการปรับปรุงการบริการ..."
            className="w-full px-4 py-3 rounded-xl border border-[#d6dbde] text-sm focus:outline-none focus:ring-2 focus:ring-[#00754A]/30 focus:border-[#00754A] bg-[#faf9f7] focus:bg-white resize-none"
          />
        </div>

        {/* 50px Full-Pill Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[50px] rounded-full bg-[#00754A] hover:bg-[#006241] text-white font-semibold text-xs tracking-[-0.16px] transition-all duration-200 active:scale-[0.95] flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              กำลังบันทึกผลการประเมิน...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              ส่งผลการประเมิน
            </>
          )}
        </button>
      </form>
    </div>
  );
}
