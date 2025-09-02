import React, { useState, useEffect } from "react";
import {
  Star,
  Calendar,
  Building2,
  User,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  TrendingUp,
  Award,
  Plus,
  X,
} from "lucide-react";
import AddFeedbackModal from "./components/AddFeedbackModal";
import FeedbackCard from "./components/FeedbackCard";
import FeedbackStats from "../../seeker/feedbacks/components/FeedbackStats";
import { feedbackAPI } from "@/services/feedbackAPI";
import { toast } from "react-toastify";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-700">
        Showing page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <div className="flex gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNumber;
            if (totalPages <= 5) {
              pageNumber = i + 1;
            } else if (currentPage <= 3) {
              pageNumber = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + i;
            } else {
              pageNumber = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`w-8 h-8 text-sm rounded-md transition-colors ${
                  pageNumber === currentPage
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

const CandidateFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const result = await feedbackAPI.getFeedbacks();
      console.log("Feedback response : ", result);
      if (result.success) {
        setFeedbacks(result.data);
      } else {
        console.error("Failed to load jobs:", result.error);
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const feedbacksPerPage = 3;
  const totalPages = Math.ceil(feedbacks.length / feedbacksPerPage);

  const currentFeedbacks = feedbacks.slice(
    (currentPage - 1) * feedbacksPerPage,
    currentPage * feedbacksPerPage
  );

  const handleAddFeedback = async (newFeedback) => {
    try {
      //submit to backend
      console.log("Submitting feedback:", newFeedback);
      const response = await feedbackAPI.createFeedback(newFeedback);

      if (response.success) {
        // Refresh feedback list
        loadFeedbacks();
        setIsModalOpen(false);
        toast.success("Feedback added successfully");
      } else {
        console.error("Failed to add feedback:", response.error);
      }
      setCurrentPage(1); // Reset to first page
    } catch (error) {
      console.error("Error adding feedback:", error);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feedbacks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="text-blue-600" />
              Candidate Feedbacks
            </h1>
            <p className="text-gray-600 mt-1">
              Add feedback for candidates you've worked with
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 from-blue-600 to-purple-600 bg-gradient-to-r text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Add Feedback
            </button>
          </div>
        </div>

        {/* Feedbacks List */}
        <div className="space-y-4">
          {currentFeedbacks.length > 0 ? (
            currentFeedbacks.map((feedback) => (
              <FeedbackCard key={feedback.id} feedback={feedback} />
            ))
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No feedbacks yet
              </h3>
              <p className="text-gray-600">
                Start by adding feedback for candidates you've worked with
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* Add Feedback Modal */}
        <AddFeedbackModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddFeedback}
        />
      </div>
    </div>
  );
};

export default CandidateFeedback;
