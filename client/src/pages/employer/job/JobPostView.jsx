import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  Calendar,
  MapPin,
  Building2,
  Briefcase,
  DollarSign,
  Clock,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Share2,
  Download,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'react-toastify';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { jobPostAPI } from '@/services/jobPostAPI.js';

const JobPostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [jobPost, setJobPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load job post data
  useEffect(() => {
    const loadJobPost = async () => {
      try {
        setIsLoading(true);
        const result = await jobPostAPI.getJobById(id);
        
        if (result.success) {
          setJobPost(result.data);
        } else {
          toast.error("Failed to load job post");
          navigate('/employer/jobs');
        }
      } catch (error) {
        toast.error("Error loading job post");
        console.error("Load error:", error);
        navigate('/employer/jobs');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadJobPost();
    }
  }, [id, navigate]);



  // Copy job post link
  const handleShare = () => {
    const jobUrl = `${window.location.origin}/jobs/${id}`;
    navigator.clipboard.writeText(jobUrl).then(() => {
      toast.success("Job post link copied to clipboard");
    }).catch(() => {
      toast.error("Failed to copy link");
    });
  };

  // Get status badge variant
  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { variant: 'default', icon: CheckCircle, text: 'Active' },
      'inactive': { variant: 'secondary', icon: XCircle, text: 'Inactive' },
      'draft': { variant: 'outline', icon: Edit, text: 'Draft' },
      'expired': { variant: 'destructive', icon: AlertCircle, text: 'Expired' }
    };

    const config = statusConfig[status] || statusConfig['draft'];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  // Check if deadline has passed
  const isExpired = jobPost?.deadline ? isPast(new Date(jobPost.deadline)) : false;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading job post...</span>
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
        </div>

        <div className="flex items-center gap-2">
           <Button
                className="w-full gap-2 rounded-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                onClick={() => navigate(`/employer/jobs/seekers/suggestions/${id}`)}
              >
                <Users className="h-4 w-4" />
                View Job Seeker Suggessions
              </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/employer/jobs/edit/${id}`)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Job Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{jobPost.title}</h1>
                {getStatusBadge(isExpired ? 'expired' : jobPost.status)}
              </div>
              
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{jobPost.cityId?.name || 'Location not specified'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  <span>{jobPost.categoryId?.name || 'Category not specified'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{jobPost.typeId?.name || 'Type not specified'}</span>
                </div>
              </div>

              {isExpired && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">This job posting has expired</span>
                </div>
              )}
            </div>

            <div className="text-right space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-4 w-4" />
                <span>{jobPost.applicationCount || 0} Applications</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Eye className="h-4 w-4" />
                <span>{jobPost.viewCount || 0} Views</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{jobPost.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle>Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {jobPost.responsibilities?.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {jobPost.requirements?.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Preferred Skills */}
          {jobPost.preferredSkills && jobPost.preferredSkills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Preferred Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {jobPost.preferredSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Benefits */}
          {jobPost.benefits && jobPost.benefits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {jobPost.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Experience Level</span>
                  <span className="font-medium">{jobPost.experienceLevel}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Experience Years</span>
                  <span className="font-medium">0 years</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Work Arrangement</span>
                  <Badge variant="outline">{jobPost.workArrangement}</Badge>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-600" />
                    <span className="font-medium">Salary Range</span>
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    {jobPost.salaryRange?.currency} {jobPost.salaryRange?.min?.toLocaleString()} - {jobPost.salaryRange?.max?.toLocaleString()}
                    {jobPost.salaryRange?.negotiable && <span className="text-sm text-gray-600 ml-2">(Negotiable)</span>}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="font-medium">Application Deadline</span>
                  </div>
                  <div className={`font-medium ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                    {format(new Date(jobPost.deadline), 'PPP')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {isExpired ? 'Expired' : `${formatDistanceToNow(new Date(jobPost.deadline))} remaining`}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Max Applications</span>
                  <span className="font-medium">{jobPost.maxApplications || 'Unlimited'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Posted</span>
                  <span className="font-medium">{formatDistanceToNow(new Date(jobPost.createdAt))} ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {jobPost.tags && jobPost.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {jobPost.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full gap-2"
                onClick={() => navigate(`/employer/jobs/seekers/suggestions/${id}`)}
              >
                <Users className="h-4 w-4" />
                View Job Seeker Suggessions
              </Button>
              
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => navigate(`/employer/jobs/edit/${id}`)}
              >
                <Edit className="h-4 w-4" />
                Edit Job Post
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobPostView;