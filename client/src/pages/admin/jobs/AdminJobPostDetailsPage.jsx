import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  CheckCircle, 
  ArrowLeft, 
  XCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  Briefcase,
  Award,
  Target,
  Star,
  Building2,
  Globe
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';

const AdminJobPostDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminFetchJobPostById, adminApproveJobPost } = useAuth();
  const [jobPost, setJobPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadJobPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await adminFetchJobPostById(id);
        if (response.success) {
          setJobPost(response.data);
        } else {
          setError(response.error || 'Failed to load job post details.');
          toast.error(response.error || 'Failed to load job post details.');
        }
      } catch (err) {
        console.error('Error fetching job post details:', err);
        setError('An unexpected error occurred while loading job post details.');
        toast.error('An unexpected error occurred while loading job post details.');
      } finally {
        setLoading(false);
      }
    };

    loadJobPost();
  }, [id, adminFetchJobPostById]);

  const handleApproveJob = async () => {
    if (!jobPost || jobPost.isApproved) return;

    setApproving(true);
    try {
      const result = await adminApproveJobPost(jobPost._id);
      if (result.success) {
        toast.success(result.message);
        setJobPost(prev => ({ ...prev, isApproved: true, status: 'Published' })); 
      } else {
        toast.error(result.error || 'Failed to approve job post.');
      }
    } catch (err) {
      console.error('Error approving job post:', err);
      toast.error('An error occurred while approving job post.');
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-blue-200 opacity-20"></div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Loading Job Post</h3>
              <p className="text-gray-600">Please wait while we fetch the details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 text-center max-w-md">
          <div className="relative mb-6">
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <div className="absolute inset-0 h-16 w-16 mx-auto animate-pulse rounded-full bg-red-200 opacity-30"></div>
          </div>
          <h2 className="text-2xl font-bold text-red-700 mb-3">Something went wrong</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
          <Button 
            onClick={() => navigate(-1)} 
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Job Management
          </Button>
        </div>
      </div>
    );
  }

  if (!jobPost) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center max-w-md">
          <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-700 mb-3">Job Post Not Found</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">The requested job post could not be found in our system.</p>
          <Button 
            onClick={() => navigate(-1)} 
            className="bg-gradient-to-r from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700 text-white shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Job Management
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
          <Button 
            onClick={() => navigate('/admin/jobs')} 
            className="bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to All Job Posts
          </Button>
          {!jobPost.isApproved && (
            <Button
              onClick={handleApproveJob}
              disabled={approving}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {approving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" /> Approve Job Post
                </>
              )}
            </Button>
          )}
        </div>

        {/* Main Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <CardTitle className="text-4xl font-bold mb-3 leading-tight">{jobPost.title}</CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-3 text-blue-100 text-lg">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    <span>{jobPost.employerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{jobPost.cityName}, {jobPost.cityCountry}</span>
                  </div>
                </CardDescription>
              </div>
              <div className="flex flex-col gap-3">
                <Badge
                  className={`text-sm px-4 py-2 font-medium shadow-lg ${
                    jobPost.status === 'Paused' && !jobPost.isApproved ? 'bg-yellow-500 text-white hover:bg-yellow-600' :
                    jobPost.isApproved ? 'bg-green-500 text-white hover:bg-green-600' : 
                    'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {jobPost.isApproved ? '✓ Approved' : '⏳ Pending Approval'}
                </Badge>
                <div className="flex items-center gap-2 text-blue-100">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Posted {new Date(jobPost.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700">
                  <Briefcase className="h-5 w-5" />
                  <span className="font-medium">Experience</span>
                </div>
                <p className="text-lg font-bold text-blue-900 mt-1">{jobPost.experienceLevel}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <DollarSign className="h-5 w-5" />
                  <span className="font-medium">Salary</span>
                </div>
                <p className="text-lg font-bold text-green-900 mt-1">
                  {jobPost.salaryRange.currency} {jobPost.salaryRange.min}k - {jobPost.salaryRange.max}k
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center gap-2 text-purple-700">
                  <Globe className="h-5 w-5" />
                  <span className="font-medium">Work Type</span>
                </div>
                <p className="text-lg font-bold text-purple-900 mt-1">{jobPost.workArrangement}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                <div className="flex items-center gap-2 text-orange-700">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">Deadline</span>
                </div>
                <p className="text-lg font-bold text-orange-900 mt-1">
                  {new Date(jobPost.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-100 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                <Target className="h-5 w-5 text-blue-600" />
                Job Description
              </h3>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{jobPost.description}</p>
              </div>
            </div>

            {/* Responsibilities */}
            {jobPost.responsibilities && jobPost.responsibilities.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-800">
                  <Users className="h-5 w-5 text-blue-600" />
                  Key Responsibilities
                </h3>
                <ul className="space-y-2">
                  {jobPost.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {jobPost.requirements && jobPost.requirements.length > 0 && (
              <div className="bg-gradient-to-br from-red-50 to-pink-100 p-6 rounded-xl border border-red-200">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-800">
                  <Award className="h-5 w-5 text-red-600" />
                  Requirements
                </h3>
                <ul className="space-y-2">
                  {jobPost.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preferred Skills */}
            {jobPost.preferredSkills && jobPost.preferredSkills.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border border-green-200">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-800">
                  <Star className="h-5 w-5 text-green-600" />
                  Preferred Skills
                </h3>
                <div className="flex flex-wrap gap-3">
                  {jobPost.preferredSkills.map((skill, i) => (
                    <Badge 
                      key={i} 
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Job Details */}
              <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                  <Briefcase className="h-5 w-5 text-slate-600" />
                  Job Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Experience Level:</span>
                    <span className="font-semibold text-gray-800">{jobPost.experienceLevel}</span>
                  </div>
                  {jobPost.experienceYears && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Years Required:</span>
                      <span className="font-semibold text-gray-800">{jobPost.experienceYears.min} - {jobPost.experienceYears.max} years</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Category:</span>
                    <span className="font-semibold text-gray-800">{jobPost.categoryName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Type:</span>
                    <span className="font-semibold text-gray-800">{jobPost.typeName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Work Arrangement:</span>
                    <span className="font-semibold text-gray-800">{jobPost.workArrangement}</span>
                  </div>
                </div>
              </div>

              {/* Salary & Benefits */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-100 p-6 rounded-xl border border-yellow-200">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-orange-800">
                  <DollarSign className="h-5 w-5 text-orange-600" />
                  Compensation & Benefits
                </h3>
                <div className="space-y-3">
                  <div className="bg-white/50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-lg font-bold text-orange-900">
                      {jobPost.salaryRange.currency} {jobPost.salaryRange.min} - {jobPost.salaryRange.max}
                      {jobPost.salaryRange.negotiable && (
                        <Badge className="ml-2 bg-green-500 text-white">Negotiable</Badge>
                      )}
                    </p>
                  </div>
                  {jobPost.benefits && jobPost.benefits.length > 0 && (
                    <div>
                      <p className="font-medium mb-2 text-orange-800">Benefits Package:</p>
                      <ul className="space-y-1">
                        {jobPost.benefits.map((b, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-700">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-gradient-to-r from-gray-50 to-slate-100 p-6 flex justify-end">
            {!jobPost.isApproved && (
              <Button
                onClick={handleApproveJob}
                disabled={approving}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 text-lg"
              >
                {approving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Approving Job Post...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" /> Approve This Job Post
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminJobPostDetailsPage;