
import React, {  useState } from "react";
import {  X, AlertCircle, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const StatusUpdateModal = ({
  isOpen,
  onClose,
  currentStatus,
  onUpdateStatus,
  isLoading = false,
}) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [comment, setComment] = useState("");

  // Define possible next statuses based on current status
  const getNextStatuses = (current) => {
    const statusFlow = {
      Applied: ["Under Review", "Rejected"],
      "Under Review": ["Shortlisted", "Rejected"],
      Shortlisted: ["Interview Scheduled", "Rejected"],
      "Interview Scheduled": ["Interview Completed", "Rejected"],
      "Interview Completed": [
        "Assessment Pending",
        "Offer Extended",
        "Rejected",
      ],
      "Assessment Pending": ["Reference Check", "Offer Extended", "Rejected"],
      "Reference Check": ["Offer Extended", "Rejected"],
      "Offer Extended": ["Offer Accepted", "Offer Declined"],
      "Offer Accepted": [],
      "Offer Declined": [],
      Rejected: [],
      Withdrawn: [],
    };
    return statusFlow[current] || [];
  };

  const nextStatuses = getNextStatuses(currentStatus);

  const handleSubmit = () => {
    if (!selectedStatus) return;

    onUpdateStatus({
      status: selectedStatus,
      comment: comment.trim(),
    });

    // Reset form
    setSelectedStatus("");
    setComment("");
  };

  const handleClose = () => {
    setSelectedStatus("");
    setComment("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Update Application Status
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Status 
            </label>
            <Badge className="bg-blue-100 text-blue-800">{currentStatus}</Badge>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status *
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            >
              <option value="">Select new status</option>
              {nextStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment/Notes
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Add any notes or feedback for this status update..."
              disabled={isLoading}
            />
          </div>

          {nextStatuses.length === 0 && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
              <AlertCircle size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">
                No further status updates available for this application.
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedStatus || isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Send size={16} />
                Update Status
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
