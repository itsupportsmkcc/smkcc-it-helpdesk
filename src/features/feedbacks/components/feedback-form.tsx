"use client";

import { useState } from "react";
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
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">ขอบพระคุณสำหรับการประเมิน</h2>
        <p className="text-sm text-slate-600 mt-2">
          ความคิดเห็นของท่านมีคุณค่าอย่างยิ่งในการพัฒนาและปรับปรุงการให้บริการด้านไอทีของวิทยาลัยชุมชนสมุทรสาคร
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          แบบประเมินความพึงพอใจ
        </span>
        <h1 className="text-lg font-bold text-slate-800">
          ประเมินการให้บริการไอที
        </h1>
        {issueType && (
          <p className="text-xs text-slate-500 mt-1">เรื่อง: {issueType}</p>
        )}
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div className="text-center">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
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
                  className="p-1.5 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-9 h-9 ${
                      active
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-300 stroke-[1.5]"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            {rating === 5 && "⭐ ดีเยี่ยม / พึงพอใจมากที่สุด"}
            {rating === 4 && "⭐ ดีมาก / พึงพอใจมาก"}
            {rating === 3 && "⭐ ปานกลาง"}
            {rating === 2 && "⭐ พอใช้ / ควรปรับปรุง"}
            {rating === 1 && "⭐ ไม่พึงพอใจ"}
          </p>
        </div>

        {/* Comment textarea */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            ข้อเสนอแนะเพิ่มเติม (ถ้ามี)
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="คำแนะนำหรือข้อเสนอแนะเพื่อการปรับปรุงการบริการ..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              กำลังบันทึก...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              ส่งผลประเมิน
            </>
          )}
        </button>
      </form>
    </div>
  );
}
