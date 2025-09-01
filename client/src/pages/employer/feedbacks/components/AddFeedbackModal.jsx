import { seekerProfileAPI } from "@/services/jobseeker/seekerProfileAPI";
import { Star, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

const AddFeedbackModal = ({ isOpen, onClose, onSubmit }) => {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobSeekers();
  }, []);

  const loadJobSeekers = async () => {
    setLoading(true);
    try {
      const result = await seekerProfileAPI.getAllJobSeekers();
      if (result.success) {
        setJobSeekers(result.data);
      } else {
        console.error("Failed to load job seekers:", result.error);
      }
    } catch (error) {
      console.error("Error loading job seekers:", error);
    } finally {
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      jobSeekerId: "",
      jobTitle: "",
      rating: 5,
      feedback: "",
      skills: "",
      wouldRecommend: false,
    },
  });

  const rating = watch("rating"); // to re-render stars

  const submitHandler = (data) => {
    // process skills as array
    const formattedData = {
      ...data,
      skills: data.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    };

    onSubmit(formattedData);
    onClose();
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job seekers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add Feedback</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="p-6 space-y-4">
          {/* Candidate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Candidate
            </label>
            <select
              {...register("jobSeekerId", {
                required: "Candidate is required",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Select Candidate</option>
              {jobSeekers.map((seeker) => (
                <option key={seeker._id} value={seeker._id}>
                  {seeker.userId.firstName} {seeker.userId.lastName}
                </option>
              ))}
            </select>
            {errors.jobSeekerId && (
              <p className="text-red-500 text-sm">
                {errors.jobSeekerId.message}
              </p>
            )}
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              type="text"
              placeholder="Enter job title"
              {...register("jobTitle", {
                required: "Job Title is required",
                minLength: { value: 3, message: "Min 3 characters" },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.jobTitle && (
              <p className="text-red-500 text-sm">{errors.jobTitle.message}</p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <Controller
              name="rating"
              control={control}
              rules={{ required: "Rating is required" }}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => field.onChange(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={`${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        } hover:text-yellow-400 transition-colors`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
                </div>
              )}
            />
            {errors.rating && (
              <p className="text-red-500 text-sm">{errors.rating.message}</p>
            )}
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback
            </label>
            <textarea
              placeholder="Share your experience..."
              {...register("feedback", {
                required: "Feedback is required",
                minLength: { value: 10, message: "Min 10 characters" },
              })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
            />
            {errors.feedback && (
              <p className="text-red-500 text-sm">{errors.feedback.message}</p>
            )}
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills (comma separated)
            </label>
            <input
              type="text"
              placeholder="React, JavaScript, CSS"
              {...register("skills", { required: "Skills are required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.skills && (
              <p className="text-red-500 text-sm">{errors.skills.message}</p>
            )}
          </div>

          {/* Would Recommend */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("wouldRecommend")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">
              I would recommend this candidate
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFeedbackModal;
