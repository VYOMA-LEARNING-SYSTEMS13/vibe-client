import React, { useState, useEffect, useCallback } from "react";
import { Quote, Star, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import api from "../../services/api";
import Avatar from "../shared/Avatar";

export const MentorHighlightsSection = ({ studentId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [totalReviews, setTotalReviews] = useState(0);

  const fetchReviews = useCallback(async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/mentor-reviews/student/${studentId}`);
      if (res.data?.success && res.data.data) {
        setReviews(res.data.data.reviews || []);
        setAverageRating(res.data.data.averageRating || null);
        setTotalReviews(res.data.data.totalReviews || 0);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.warn("Could not load student mentor reviews:", err);
      setError("Failed to load mentor reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#E1E8F2] shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-6">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-2">
          <Quote size={16} className="text-[#6D3DF5]" />
          <h3 className="font-bold text-sm uppercase tracking-wider text-[#64748B]">
            Mentor Highlights
          </h3>
          {reviews.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#F2ECFF] text-[#6D3DF5] border border-[#E9E1FF]">
              {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
            </span>
          )}
        </div>

        {reviews.length > 0 && averageRating && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-900 text-xs font-bold self-start sm:self-auto shadow-2xs">
            <Star size={13} className="text-amber-500 fill-amber-400" />
            <span>{averageRating} / 5.0</span>
            <span className="text-[11px] text-amber-700 font-normal">Rating</span>
          </div>
        )}
      </div>

      {/* Content States */}
      {loading ? (
        <div className="py-10 text-center flex flex-col items-center justify-center">
          <Loader2 size={24} className="text-[#6D3DF5] animate-spin mb-2.5" />
          <p className="text-xs text-[#64748B] font-medium">Loading mentor highlights...</p>
        </div>
      ) : error ? (
        <div className="py-8 text-center flex flex-col items-center justify-center">
          <AlertCircle size={24} className="text-rose-500 mb-2" />
          <p className="text-xs text-rose-600 font-medium mb-3">{error}</p>
          <button
            type="button"
            onClick={fetchReviews}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#F8FAFC] border border-rose-200 text-rose-700 hover:bg-rose-50 transition-all cursor-pointer shadow-xs"
          >
            Retry
          </button>
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-10 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-[#F2ECFF] text-[#6D3DF5] border border-[#E9E1FF] flex items-center justify-center mb-3">
            <Quote size={20} />
          </div>
          <h4 className="font-bold text-sm text-[#0F172A]">Mentor Highlights</h4>
          <p className="text-xs text-[#64748B] mt-1 max-w-sm leading-relaxed">
            No mentor reviews yet. Feedback from your mentors will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => {
            const facultyName = review.faculty?.name || "Faculty Mentor";
            const facultyAvatar = review.faculty?.ImageUrl || review.faculty?.avatar;
            const facultyDesignation =
              review.designation ||
              review.faculty?.Profile?.Department ||
              "Faculty Mentor";

            return (
              <div
                key={review._id}
                className="p-4 md:p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#D1D5DB] hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between gap-3.5"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar
                        name={facultyName}
                        src={facultyAvatar}
                        size="md"
                        variant="emerald"
                        className="w-10 h-10 rounded-xl shrink-0"
                      />
                      <div className="min-w-0">
                        <h5 className="font-bold text-[#0F172A] text-xs sm:text-sm truncate">
                          {facultyName}
                        </h5>
                        <p className="text-[11px] text-[#64748B] truncate font-medium">
                          {facultyDesignation}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/50">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          className={
                            star <= review.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-200 fill-slate-200"
                          }
                        />
                      ))}
                      <span className="text-xs font-bold text-amber-900 ml-1">
                        {review.rating}.0
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#475569] italic leading-relaxed">
                    "{review.feedback}"
                  </p>

                  {Array.isArray(review.skills) && review.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {review.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#F2ECFF] text-[#6D3DF5] text-[10px] font-semibold border border-[#E9E1FF]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#94A3B8]">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
                    <ShieldCheck size={12} />
                    <span>Verified Faculty Mentor</span>
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
