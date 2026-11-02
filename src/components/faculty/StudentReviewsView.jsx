import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Loader2,
  AlertCircle,
  FileText,
  User,
  Users,
  Building,
  GraduationCap,
  ExternalLink,
  Edit3,
  Trash2,
  X,
  Plus,
  Quote,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import api from "../../services/api";
import { useToast } from "../Toast";
import Avatar from "../shared/Avatar";
import { useScrollLock } from "../../hooks/useScrollLock";
import { auth } from "../../utils/auth";

const RATING_DESCRIPTIONS = {
  1: "Needs Significant Improvement",
  2: "Developing / Fair Performance",
  3: "Good / Meets Expectations",
  4: "Very Good / Strong Performance",
  5: "Exceptional / Outstanding",
};

export const StudentReviewsView = ({ onBackToFeed }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const currentUser = auth.getCurrentUser();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "needs_review" | "reviewed"

  // Modal State
  const [selectedStudentForReview, setSelectedStudentForReview] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Review Form State
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [formFeedback, setFormFeedback] = useState("");
  const [formSkills, setFormSkills] = useState([]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [formDesignation, setFormDesignation] = useState("");
  const [savingReview, setSavingReview] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  useScrollLock(isReviewModalOpen);

  // Fetch eligible mentored students
  const fetchEligibleStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/mentor-reviews/students");
      if (res.data?.success && res.data.data) {
        setStudents(res.data.data.students || []);
      }
    } catch (err) {
      console.error("Error fetching mentored students for review:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load mentored students. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEligibleStudents();
  }, [fetchEligibleStudents]);

  // Derived metrics
  const totalStudents = students.length;
  const reviewedCount = students.filter((s) => s.hasReview).length;
  const pendingCount = totalStudents - reviewedCount;

  // Filtered & Searched student list
  const filteredStudents = useMemo(() => {
    return students.filter((entry) => {
      const student = entry.student || {};
      const matchesSearch =
        searchQuery.trim() === "" ||
        student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.branch?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.college?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tasks?.some((t) =>
          t.title?.toLowerCase().includes(searchQuery.toLowerCase())
        );

      if (!matchesSearch) return false;

      if (activeFilter === "needs_review") return !entry.hasReview;
      if (activeFilter === "reviewed") return entry.hasReview;
      return true;
    });
  }, [students, searchQuery, activeFilter]);

  // Open Write / Edit Review Modal
  const handleOpenReviewModal = (entry) => {
    setSelectedStudentForReview(entry);
    const existingReview = entry.review;

    if (existingReview) {
      // Edit mode: prefill existing review data
      setFormRating(existingReview.rating || 5);
      setFormFeedback(existingReview.feedback || "");
      setFormSkills(Array.isArray(existingReview.skills) ? [...existingReview.skills] : []);
      setFormDesignation(existingReview.designation || "");
    } else {
      // New review mode: defaults
      setFormRating(5);
      setFormFeedback("");
      setFormSkills([]);
      const defaultTitle = [
        currentUser?.Profile?.position,
        currentUser?.Profile?.InstituteName,
      ]
        .filter(Boolean)
        .join(" • ") || "Faculty Mentor";
      setFormDesignation(defaultTitle);
    }

    setCustomSkillInput("");
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    if (savingReview) return;
    setIsReviewModalOpen(false);
    setSelectedStudentForReview(null);
  };

  // Skill tags management in form
  const handleToggleStudentSkill = (skillName) => {
    if (!skillName) return;
    const trimmed = skillName.trim();
    if (formSkills.includes(trimmed)) {
      setFormSkills((prev) => prev.filter((s) => s !== trimmed));
    } else {
      if (formSkills.length >= 8) {
        toast.info("Maximum 8 skills can be highlighted.");
        return;
      }
      setFormSkills((prev) => [...prev, trimmed]);
    }
  };

  const handleAddCustomSkill = (e) => {
    if (e) e.preventDefault();
    if (!customSkillInput.trim()) return;
    const trimmed = customSkillInput.trim();
    if (formSkills.includes(trimmed)) {
      setCustomSkillInput("");
      return;
    }
    if (formSkills.length >= 8) {
      toast.info("Maximum 8 skills can be highlighted.");
      return;
    }
    setFormSkills((prev) => [...prev, trimmed]);
    setCustomSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  // Submit Review (Create or Update)
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedStudentForReview) return;
    const studentId = selectedStudentForReview.student?._id;

    if (!formRating || formRating < 1 || formRating > 5) {
      toast.error("Please select a rating between 1 and 5 stars.");
      return;
    }

    if (!formFeedback.trim() || formFeedback.trim().length < 5) {
      toast.error("Please provide written feedback of at least 5 characters.");
      return;
    }

    try {
      setSavingReview(true);
      const payload = {
        studentId,
        rating: formRating,
        feedback: formFeedback.trim(),
        skills: formSkills,
        designation: formDesignation.trim(),
      };

      const res = await api.post("/mentor-reviews", payload);
      if (res.data?.success) {
        const savedReview = res.data.data;
        // Update local state smoothly
        setStudents((prev) =>
          prev.map((entry) =>
            entry.student?._id === studentId
              ? { ...entry, hasReview: true, review: savedReview }
              : entry
          )
        );
        toast.success(
          selectedStudentForReview.hasReview
            ? "Mentor review updated successfully!"
            : "Mentor review published to Virtual CV!"
        );
        setIsReviewModalOpen(false);
        setSelectedStudentForReview(null);
      }
    } catch (err) {
      console.error("Error submitting mentor review:", err);
      toast.error(
        err.response?.data?.message || "Failed to save mentor review. Please try again."
      );
    } finally {
      setSavingReview(false);
    }
  };

  // Delete Review
  const handleDeleteReview = async (entry) => {
    const reviewId = entry.review?._id;
    if (!reviewId) return;

    const studentName = entry.student?.name || "this student";
    const confirmed = await toast.confirm({
      title: "Delete Mentor Review?",
      message: `Are you sure you want to remove your review for ${studentName}? This will remove your testimonial from their Virtual CV.`,
      confirmText: "Delete Review",
      danger: true,
    });

    if (!confirmed) return;

    try {
      setDeletingReviewId(reviewId);
      await api.delete(`/mentor-reviews/${reviewId}`);
      setStudents((prev) =>
        prev.map((item) =>
          item.student?._id === entry.student?._id
            ? { ...item, hasReview: false, review: null }
            : item
        )
      );
      toast.success(`Removed review for ${studentName}`);
    } catch (err) {
      console.error("Error deleting mentor review:", err);
      toast.error(err.response?.data?.message || "Failed to delete review");
    } finally {
      setDeletingReviewId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Header Section */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-[#E1E8F2] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F2ECFF] text-[#6D3DF5] border border-[#E9E1FF] flex items-center justify-center shrink-0">
              <Star size={24} className="fill-[#6D3DF5]/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-[#172554] tracking-tight">
                  Student Reviews & Feedback
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F3EEFF] text-[#6D3DF5] border border-[#E9E1FF]">
                  <ShieldCheck size={12} />
                  Verified Mentorship
                </span>
              </div>
              <p className="text-xs text-[#64748B] font-medium mt-0.5">
                Evaluate your accepted mentees and publish verified testimonials to their Virtual CVs
              </p>
            </div>
          </div>

          {onBackToFeed && (
            <button
              onClick={onBackToFeed}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F8FAFC] hover:bg-[#F2ECFF] text-xs font-bold text-[#475569] hover:text-[#6D3DF5] border border-[#E2E8F0] transition-colors cursor-pointer self-start sm:self-auto"
            >
              <ArrowLeft size={14} />
              <span>Back to Feed</span>
            </button>
          )}
        </div>

        {/* 2. Stat Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-5 pt-5 border-t border-[#F1F5F9]">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-0.5">
                Total Mentees
              </span>
              <span className="text-2xl font-black text-[#172554] tracking-tight">
                {totalStudents}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] text-[#6D3DF5] flex items-center justify-center">
              <User size={18} />
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-0.5">
                Feedback Published
              </span>
              <span className="text-2xl font-black text-emerald-600 tracking-tight">
                {reviewedCount}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-0.5">
                Awaiting Feedback
              </span>
              <span className="text-2xl font-black text-amber-600 tracking-tight">
                {pendingCount}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search and Filters Toolbar */}
      <div className="bg-white rounded-2xl p-3.5 border border-[#E1E8F2] shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          />
          <input
            type="text"
            placeholder="Search by student name, branch, or task..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs md:text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#6D3DF5] focus:bg-white focus:ring-2 focus:ring-[#6D3DF5]/15 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === "all"
                ? "bg-[#6D3DF5] text-white shadow-xs"
                : "bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
            }`}
          >
            All Students ({totalStudents})
          </button>
          <button
            onClick={() => setActiveFilter("needs_review")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeFilter === "needs_review"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
            }`}
          >
            <Clock size={12} />
            Needs Review ({pendingCount})
          </button>
          <button
            onClick={() => setActiveFilter("reviewed")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeFilter === "reviewed"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
            }`}
          >
            <CheckCircle2 size={12} />
            Reviewed ({reviewedCount})
          </button>
        </div>
      </div>

      {/* 4. Student List Content */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 border border-[#E1E8F2] flex flex-col items-center justify-center text-center shadow-xs">
          <Loader2 size={32} className="text-[#6D3DF5] animate-spin mb-3" />
          <p className="text-sm font-bold text-[#172554]">Loading mentored students...</p>
          <p className="text-xs text-[#64748B] mt-1">Retrieving verified mentorship records</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-3xl p-12 border border-red-100 text-center shadow-xs max-w-lg mx-auto">
          <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
          <h3 className="font-bold text-base text-[#172554] mb-1">Failed to load students</h3>
          <p className="text-xs text-[#64748B] mb-4">{error}</p>
          <button
            onClick={fetchEligibleStudents}
            className="px-4 py-2 bg-[#6D3DF5] hover:bg-[#5B2FD6] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Retry Loading
          </button>
        </div>
      ) : totalStudents === 0 ? (
        <div className="bg-white rounded-3xl p-16 border border-[#E1E8F2] text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-[#F2ECFF] text-[#6D3DF5] border border-[#E9E1FF] flex items-center justify-center mx-auto mb-4">
            <Users size={28} />
          </div>
          <h3 className="text-lg font-bold text-[#172554] mb-1.5">No Mentored Students Yet</h3>
          <p className="text-xs text-[#64748B] max-w-md mx-auto leading-relaxed mb-6">
            Students whose mentorship requests you have accepted will automatically appear here.
            You can then provide feedback and publish verified mentor highlights to their Virtual CV.
          </p>
          <button
            onClick={() => {
              if (onBackToFeed) onBackToFeed();
              navigate("/dashboard/faculty?view=mentorship");
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6D3DF5] hover:bg-[#5B2FD6] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <User size={14} />
            <span>View Mentorship Requests</span>
          </button>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-[#E1E8F2] text-center shadow-xs">
          <Search size={28} className="text-[#94A3B8] mx-auto mb-3" />
          <h4 className="font-bold text-sm text-[#172554] mb-1">No matching students found</h4>
          <p className="text-xs text-[#64748B] mb-4">
            No students found matching "{searchQuery}" with filter "{activeFilter}".
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveFilter("all");
            }}
            className="px-3.5 py-1.5 bg-[#F8FAFC] hover:bg-[#F2ECFF] text-[#6D3DF5] text-xs font-bold rounded-xl border border-[#E2E8F0] transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {filteredStudents.map((entry) => {
            const student = entry.student || {};
            const studentId = student._id;
            const review = entry.review;
            const hasReview = entry.hasReview;

            return (
              <div
                key={studentId}
                className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  hasReview
                    ? "border-[#E1E8F2] shadow-xs"
                    : "border-amber-200/90 bg-gradient-to-b from-amber-50/20 to-white shadow-xs"
                }`}
              >
                <div>
                  {/* Top row: Avatar & Info */}
                  <div className="flex items-start gap-3.5 mb-3.5">
                    <Avatar
                      name={student.name || "Student"}
                      src={student.avatar}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#F1F5F9] shrink-0"
                      initialsClassName="text-sm font-bold text-white"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-sm text-[#0F172A] truncate">
                          {student.name || "Student"}
                        </h3>
                        {hasReview ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                            <Star size={10} className="fill-emerald-600 text-emerald-600" />
                            <span>{review?.rating}.0</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                            <Clock size={10} />
                            <span>Needs Feedback</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#64748B] truncate mt-0.5 font-medium">
                        {student.branch || "General Engineering"}
                        {student.yearOfStudy && student.yearOfStudy !== "N/A"
                          ? ` • ${student.yearOfStudy}`
                          : ""}
                      </p>
                      <p className="text-[11px] text-[#94A3B8] truncate mt-0.5 flex items-center gap-1">
                        <Building size={11} className="shrink-0" />
                        <span>{student.college || "VIBE Institute of Technology"}</span>
                      </p>
                    </div>
                  </div>

                  {/* Tasks mentored badge list */}
                  {entry.tasks && entry.tasks.length > 0 && (
                    <div className="mb-3.5 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1">
                        Mentored In:
                      </span>
                      <p className="font-bold text-[#172554] truncate text-xs">
                        {entry.tasks[0]?.title || "Mentorship Challenge"}
                      </p>
                      {entry.tasks.length > 1 && (
                        <span className="text-[10px] text-[#6D3DF5] font-semibold mt-0.5 block">
                          +{entry.tasks.length - 1} more accepted {entry.tasks.length - 1 === 1 ? "task" : "tasks"}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Review Excerpt (if already reviewed) */}
                  {hasReview && review && (
                    <div className="mb-3.5 p-3 rounded-xl bg-[#FAF5FF] border border-[#E9D5FF] text-xs space-y-2">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <Star
                            key={starVal}
                            size={12}
                            className={
                              starVal <= review.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200 fill-slate-200"
                            }
                          />
                        ))}
                        <span className="text-[11px] font-bold text-[#172554] ml-1">
                          {RATING_DESCRIPTIONS[review.rating] || `${review.rating} Stars`}
                        </span>
                      </div>
                      <p className="text-xs text-[#475569] italic line-clamp-2 leading-relaxed">
                        "{review.feedback}"
                      </p>
                      {Array.isArray(review.skills) && review.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {review.skills.slice(0, 3).map((sk, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-white border border-[#E9D5FF] text-[10px] font-semibold text-[#6D3DF5]"
                            >
                              {sk}
                            </span>
                          ))}
                          {review.skills.length > 3 && (
                            <span className="text-[10px] text-[#94A3B8]">
                              +{review.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-[#F1F5F9] flex items-center gap-2">
                  <button
                    onClick={() => handleOpenReviewModal(entry)}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                      hasReview
                        ? "bg-white hover:bg-[#F3EEFF] text-[#6D3DF5] border border-[#E9E1FF]"
                        : "bg-[#6D3DF5] hover:bg-[#5B2FD6] text-white shadow-[#6D3DF5]/20"
                    }`}
                  >
                    {hasReview ? <Edit3 size={13} /> : <Star size={13} className="fill-white" />}
                    <span>{hasReview ? "Edit Review" : "Write Review"}</span>
                  </button>

                  {hasReview && (
                    <button
                      onClick={() => handleDeleteReview(entry)}
                      disabled={deletingReviewId === review?._id}
                      title="Delete review"
                      aria-label="Delete review"
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-colors cursor-pointer shrink-0"
                    >
                      {deletingReviewId === review?._id ? (
                        <Loader2 size={14} className="animate-spin text-red-500" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => navigate(`/profile/${studentId}`)}
                    title="View Student Profile"
                    className="p-2 rounded-xl text-slate-400 hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-slate-200 transition-colors cursor-pointer shrink-0"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Review Form Modal */}
      <AnimatePresence>
        {isReviewModalOpen && selectedStudentForReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-modal="true"
              className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl border border-[#E1E8F2] overflow-hidden overscroll-contain"
            >
              {/* Modal Header */}
              <div className="p-5 md:p-6 border-b border-[#F1F5F9] flex items-center justify-between bg-gradient-to-r from-[#FAF8FF] to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#F2ECFF] text-[#6D3DF5] border border-[#E9E1FF] flex items-center justify-center shrink-0">
                    <Star size={20} className="fill-[#6D3DF5]/30" />
                  </div>
                  <div>
                    <h2 className="text-base md:text-lg font-black text-[#172554] tracking-tight">
                      {selectedStudentForReview.hasReview
                        ? "Edit Mentor Feedback"
                        : "Submit Mentor Review"}
                    </h2>
                    <p className="text-xs text-[#64748B]">
                      Verified evaluation for {selectedStudentForReview.student?.name}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseReviewModal}
                  className="p-1.5 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-xl transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Form Body */}
              <form onSubmit={handleSubmitReview} className="p-5 md:p-6 overflow-y-auto space-y-5 flex-1">
                {/* Mentee summary snippet */}
                <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-3">
                  <Avatar
                    name={selectedStudentForReview.student?.name || "Student"}
                    src={selectedStudentForReview.student?.avatar}
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                    initialsClassName="text-xs font-bold text-white"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-[#0F172A] truncate">
                      {selectedStudentForReview.student?.name}
                    </p>
                    <p className="text-[11px] text-[#64748B] truncate">
                      {selectedStudentForReview.student?.branch || "Engineering"} •{" "}
                      {selectedStudentForReview.student?.college || "Institute"}
                    </p>
                  </div>
                </div>

                {/* 1. Rating Selector (1-5 stars) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">
                    Overall Performance Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-[#FAF5FF] p-2 rounded-2xl border border-[#E9D5FF]/80">
                      {[1, 2, 3, 4, 5].map((starVal) => {
                        const isFilled =
                          formHoverRating > 0
                            ? starVal <= formHoverRating
                            : starVal <= formRating;

                        return (
                          <button
                            key={starVal}
                            type="button"
                            onClick={() => setFormRating(starVal)}
                            onMouseEnter={() => setFormHoverRating(starVal)}
                            onMouseLeave={() => setFormHoverRating(0)}
                            className="p-1 text-slate-300 hover:scale-115 transition-transform cursor-pointer focus:outline-none"
                            aria-label={`Rate ${starVal} stars`}
                          >
                            <Star
                              size={24}
                              className={`transition-colors ${
                                isFilled
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-300 fill-slate-100"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs font-bold text-[#172554] px-2.5 py-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      {RATING_DESCRIPTIONS[formHoverRating || formRating]}
                    </span>
                  </div>
                </div>

                {/* 2. Written Feedback */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#475569]">
                      Written Feedback & Endorsement <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-[#94A3B8]">
                      {formFeedback.length} characters (min 5)
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={formFeedback}
                    onChange={(e) => setFormFeedback(e.target.value)}
                    placeholder="Highlight the student's technical abilities, problem solving, delivery quality, team communication, and growth areas..."
                    className="w-full p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-xs sm:text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#6D3DF5] focus:bg-white focus:ring-2 focus:ring-[#6D3DF5]/15 transition-all resize-y"
                    required
                  />
                  <p className="text-[11px] text-[#64748B] mt-1">
                    This evaluation will appear under "Mentor Highlights" on the student's verified Virtual CV.
                  </p>
                </div>

                {/* 3. Observed Skills & Strengths */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                    Observed Strengths & Skills <span className="text-[#94A3B8] font-normal lowercase">(optional)</span>
                  </label>

                  {/* Student profile skills suggestion chips */}
                  {selectedStudentForReview.student?.skills?.length > 0 && (
                    <div className="mb-2.5">
                      <span className="text-[10px] font-semibold text-[#94A3B8] block mb-1.5">
                        Click student's profile skills to endorse:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedStudentForReview.student.skills.map((sk, idx) => {
                          const isSelected = formSkills.includes(sk);
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleToggleStudentSkill(sk)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#6D3DF5] text-white shadow-xs"
                                  : "bg-[#F8FAFC] text-[#475569] hover:bg-[#F2ECFF] hover:text-[#6D3DF5] border border-[#E2E8F0]"
                              }`}
                            >
                              {isSelected ? "✓ " : "+ "}
                              {sk}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Add custom skill input */}
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Or type a custom strength (e.g. Code Optimization)..."
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCustomSkill();
                        }
                      }}
                      className="flex-1 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#6D3DF5] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSkill}
                      className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F2ECFF] text-[#6D3DF5] border border-[#E2E8F0] text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Selected skills chips */}
                  {formSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {formSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF5FF] border border-[#E9D5FF] text-xs font-semibold text-[#6D3DF5]"
                        >
                          <span>{sk}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(sk)}
                            className="text-[#6D3DF5] hover:text-red-500 rounded-full p-0.5"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Reviewer Context / Designation */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                    Your Title & Institution Context
                  </label>
                  <input
                    type="text"
                    value={formDesignation}
                    onChange={(e) => setFormDesignation(e.target.value)}
                    placeholder="e.g. Professor & HOD, Computer Science • VIBE Institute"
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#6D3DF5] focus:bg-white transition-all"
                  />
                  <p className="text-[11px] text-[#94A3B8] mt-1">
                    Pre-filled from your faculty profile. Displays beside your name on the student's Virtual CV.
                  </p>
                </div>

                {/* Modal Footer */}
                <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseReviewModal}
                    disabled={savingReview}
                    className="px-4 py-2 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs font-bold text-slate-600 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingReview || !formFeedback.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#6D3DF5] hover:bg-[#5B2FD6] text-white text-xs font-bold shadow-md shadow-[#6D3DF5]/20 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {savingReview ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={14} />
                        <span>
                          {selectedStudentForReview.hasReview
                            ? "Update Review"
                            : "Publish Review"}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentReviewsView;
