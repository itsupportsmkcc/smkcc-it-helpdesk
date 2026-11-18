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
      <div className="w-full max-w-md mx-auto bg-white rounded-[2px] border border-[#e0e0e0] p-8 text-center">
        <div className="w-14 h-14 bg-[#ebebec] text-[#009262] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-[#1d1d1f]">
          ขอบพระคุณสำหรับการประเมิน
        </h2>
        <p className="text-xs text-[#666666] mt-2 leading-relaxed">
          ความคิดเห็นของท่านมีคุณค่าอย่างยิ่งในการพัฒนาและยกระดับการให้บริการไอทีของวิทยาลัยชุมชนสมุทรสาคร
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-[2px] border border-[#e0e0e0] p-6 sm:p-7">
      <div className="text-center mb-6">
        {/* Logo */}
        <div className="relative w-16 h-16 mx-auto mb-3 rounded-[2px] overflow-hidden border border-[#e0e0e0] bg-white">
          <Image
            src="/logo.jpg"
            alt="SMKCC IT Support Logo"
            fill
            className="object-cover"
          />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-[#ebebec] text-[#1d1d1f] border border-[#e0e0e0] text-xs font-medium mb-2">
          แบบประเมินความพึงพอใจ
        </span>
        <h1 className="text-lg font-bold tracking-tight text-[#1d1d1f]">
          ประเมินการให้บริการไอที
        </h1>
        {issueType && (
          <p className="text-xs text-[#666666] mt-1 font-normal">
            เรื่อง: {issueType}
          </p>
        )}
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-white border border-[#7f0019] text-[#7f0019] rounded-[2px] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#7f0019]" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div className="text-center">
          <label className="block text-xs font-medium text-[#1d1d1f] uppercase tracking-wider mb-3">
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
                  className="p-1.5 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      active
                        ? "text-[#ffa826] fill-[#ffa826]"
                        : "text-[#c4c4c6] stroke-[1.5]"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <p className="text-xs text-[#1d1d1f] mt-2 font-medium">
            {rating === 5 && "ดีเยี่ยม / พึงพอใจมากที่สุด"}
            {rating === 4 && "ดีมาก / พึงพอใจมาก"}
            {rating === 3 && "ปานกลาง"}
            {rating === 2 && "พอใช้ / ควรปรับปรุง"}
            {rating === 1 && "ไม่พึงพอใจ"}
          </p>
        </div>

        {/* Comment textarea */}
        <div>
          <label className="block text-xs font-medium text-[#1d1d1f] uppercase tracking-wider mb-1.5">
            ข้อเสนอแนะเพิ่มเติม (ถ้ามี)
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="คำแนะนำหรือข้อเสนอแนะเพื่อการปรับปรุงการบริการ..."
            className="w-full px-4 py-2.5 rounded-[2px] border border-[#c4c4c6] text-sm text-[#1d1d1f] bg-white focus:outline-none focus:border-[#1d1d1f] transition-colors resize-none placeholder-[#9d9da0]"
          />
        </div>

        {/* 2px Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 rounded-[2px] bg-[#1d1d1f] hover:bg-[#3c3c43] text-white font-medium text-xs tracking-[-0.16px] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
