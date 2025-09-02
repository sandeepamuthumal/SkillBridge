import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  User,
  MapPin,
  Building2,
  Calendar,
  Eye,
  Star,
  Github,
  Linkedin,
  ExternalLink,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Code,
  AlertCircle,
  Loader2,
  Filter,
  Search,
  Users,
  TrendingUp
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'react-toastify';
import { jobPostAPI } from '@/services/jobPostAPI.js';
const serverUrl = import.meta.env.VITE_SERVER_URL;

const SeekerSuggestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [jobPost, setJobPost] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load job suggestions data
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        setIsLoading(true);
        const result = await jobPostAPI.getSeekerSuggestions(id);
        const jobResult = await jobPostAPI.getJobById(id);
        
        if (result.success) {
          setJobPost(jobResult.data);
          setSuggestions(result.data || []);
        } else {
          toast.error("Failed to load suggestions");
          navigate('/employer/jobs');
        }
      } catch (error) {
        toast.error("Error loading suggestions");
        console.error("Load error:", error);
        navigate('/employer/jobs');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadSuggestions();
    }
  }, [id, navigate]);


  // Get match label and color
  const getMatchInfo = (similarity) => {
    const score = similarity || 0;
    if (score >= 80) return { label: 'Excellent match', color: 'bg-green-500', variant: 'default' };
    if (score >= 60) return { label: 'Good match', color: 'bg-blue-500', variant: 'secondary' };
    if (score >= 40) return { label: 'Fair match', color: 'bg-yellow-500', variant: 'outline' };
    return { label: 'Poor match', color: 'bg-gray-400', variant: 'secondary' };
  };

  // Get user initials
  const getUserInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Handle view full profile
  const handleViewProfile = (seekerId) => {
    navigate(`/seeker-profile/${seekerId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading candidate suggestions...</span>
        </div>
      </div>
    );
  }

  if (!jobPost) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Job post not found</h3>
        <p className="text-gray-600 mb-4">The job post you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/employer/jobs')}>
          Back to Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/employer/jobs')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Candidate Suggestions</h1>
            <p className="text-gray-600">{jobPost.title}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Found</div>
          <div className="text-2xl font-bold text-blue-600">{suggestions.length}</div>
          <div className="text-sm text-gray-600">candidates</div>
        </div>
      </div>

      {/* Job Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">{jobPost.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {jobPost.cityId?.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {jobPost.categoryId?.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {jobPost.experienceLevel}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate(`/employer/jobs/view/${id}`)}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              View Job
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {suggestions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No candidates found</h3>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map((seeker) => {
            const matchInfo = getMatchInfo(seeker.similarity);
            return (
              <Card key={seeker._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={serverUrl + seeker.profilePictureUrl} />
                        <AvatarFallback>
                          {getUserInitials(seeker.userId?.firstName, seeker.userId?.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">
                          {seeker.userId?.firstName} {seeker.userId?.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {seeker.statementHeader || seeker.fieldOfStudy}
                        </p>
                      </div>
                    </div>
                    <Badge variant={matchInfo.variant} className="gap-1">
                      <Star className="h-3 w-3" />
                      {Math.round(seeker.similarity || 0)}%
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Match Score */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Match Score</span>
                      <span className="font-medium">{matchInfo.label}</span>
                    </div>
                    <Progress value={seeker.similarity || 0} className="h-2" />
                  </div>

                  {/* Basic Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <GraduationCap className="h-4 w-4" />
                      <span>{seeker.university}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{seeker.cityId || 'Location not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Eye className="h-4 w-4" />
                      <span>{seeker.profileViews || 0} profile views</span>
                    </div>
                    {seeker.availability && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Available {seeker.availability}</span>
                      </div>
                    )}
                  </div>

                  {/* Experience */}
                  {seeker.experiences && seeker.experiences.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 text-sm font-medium mb-2">
                        <Briefcase className="h-4 w-4" />
                        Experience ({seeker.experiences.length})
                      </div>
                      <div className="text-sm text-gray-600">
                        {seeker.experiences[0].title} at {seeker.experiences[0].company}
                        {seeker.experiences.length > 1 && (
                          <span className="text-blue-600"> +{seeker.experiences.length - 1} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {seeker.skills && seeker.skills.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 text-sm font-medium mb-2">
                        <Code className="h-4 w-4" />
                        Skills ({seeker.skills.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {seeker.skills.slice(0, 4).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {seeker.skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{seeker.skills.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Match Details */}
                  {seeker.details && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Match Breakdown:</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Skills:</span>
                          <span className="font-medium">{Math.round(seeker.details.skills || 0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Experience:</span>
                          <span className="font-medium">{Math.round(seeker.details.experience || 0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Projects:</span>
                          <span className="font-medium">{Math.round(seeker.details.projects || 0)}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  {(seeker.socialLinks?.linkedin || seeker.socialLinks?.github) && (
                    <div className="flex items-center gap-2">
                      {seeker.socialLinks.linkedin && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(seeker.socialLinks.linkedin, '_blank');
                          }}
                        >
                          <Linkedin className="h-4 w-4" />
                        </Button>
                      )}
                      {seeker.socialLinks.github && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(seeker.socialLinks.github, '_blank');
                          }}
                        >
                          <Github className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      className="flex-1 gap-2"
                      onClick={() => handleViewProfile(seeker.userId?._id)}
                    >
                      <User className="h-4 w-4" />
                      View Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => window.open(`mailto:${seeker.userId.email}`, '_blank')}
                    >
                      <Mail className="h-4 w-4" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SeekerSuggestion;