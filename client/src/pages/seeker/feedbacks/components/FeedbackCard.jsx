import { Award, Building2, Calendar, Star } from "lucide-react";

const FeedbackCard = ({ feedback }) => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">{rating}/5</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={serverUrl + feedback.employerId.logoUrl}
            alt={feedback.employerId.companyName}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{feedback.employerId.companyName}</h3>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Building2 size={14} />
              {feedback.jobTitle}
            </p>
          </div>
        </div>
        <div className="text-right">
          <StarRating rating={feedback.rating} />
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <Calendar size={12} />
            {new Date(feedback.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{feedback.feedback}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {feedback.skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {feedback.wouldRecommend && (
            <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
              <Award size={14} />
                Recommended
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;