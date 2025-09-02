import { Award, MessageSquare, Star } from "lucide-react";

const FeedbackStats = ({ feedbacks }) => {
  const averageRating = feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;
  const totalFeedbacks = feedbacks.length;
  const completedProjects = feedbacks.filter(f => f.wouldRecommend).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Average Rating</p>
            <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
          </div>
          <Star className="text-yellow-300" size={24} />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">Total Feedbacks</p>
            <p className="text-2xl font-bold">{totalFeedbacks}</p>
          </div>
          <MessageSquare className="text-green-100" size={24} />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm">Recommended Feedbacks</p>
            <p className="text-2xl font-bold">{completedProjects}</p>
          </div>
          <Award className="text-purple-100" size={24} />
        </div>
      </div>
    </div>
  );
};

export default FeedbackStats;