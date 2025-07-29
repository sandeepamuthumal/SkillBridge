import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
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
      <div className="min-h-[50vh] flex justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <span className="ml-3 text-lg text-gray-700">Loading job post...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col justify-center items-center text-center">
        <XCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Job Management
        </Button>
      </div>
    );
  }

  if (!jobPost) {
    return (
      <div className="min-h-[50vh] flex flex-col justify-center items-center text-center">
        <XCircle className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Job Post Not Found</h2>
        <p className="text-gray-600 mb-4">The requested job post could not be found.</p>
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Job Management
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => navigate('/admin/jobs')} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to All Job Posts
        </Button>
        {!jobPost.isApproved && (
          <Button
            onClick={handleApproveJob}
            disabled={approving}
            className="bg-green-600 hover:bg-green-700 text-white"
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

      <Card className="shadow-lg border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold">{jobPost.title}</CardTitle>
          <CardDescription className="flex items-center space-x-2 text-lg text-gray-600">
            <span>by {jobPost.employerName}</span> 
            <Badge
              className={`ml-2 ${
                jobPost.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {jobPost.isApproved ? 'Approved' : 'Pending Approval'}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Job Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{jobPost.description}</p>
          </div>

          {jobPost.responsibilities && jobPost.responsibilities.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
              <ul className="list-disc list-inside text-gray-700">
                {jobPost.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {jobPost.requirements && jobPost.requirements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Requirements</h3>
              <ul className="list-disc list-inside text-gray-700">
                {jobPost.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {jobPost.preferredSkills && jobPost.preferredSkills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Preferred Skills</h3>
              <div className="flex flex-wrap gap-2">
                {jobPost.preferredSkills.map((skill, i) => (
                  <Badge key={i} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Details</h3>
              <p className="text-gray-700"><strong>Experience Level:</strong> {jobPost.experienceLevel}</p>
              {jobPost.experienceYears && (
                <p className="text-gray-700">
                  <strong>Years of Experience:</strong> {jobPost.experienceYears.min} - {jobPost.experienceYears.max} years
                </p>
              )}
              <p className="text-gray-700"><strong>Category:</strong> {jobPost.categoryName}</p> 
              <p className="text-gray-700"><strong>Type:</strong> {jobPost.typeName}</p> 
              <p className="text-gray-700"><strong>Location:</strong> {jobPost.cityName}, {jobPost.cityCountry}</p> 
              <p className="text-gray-700"><strong>Work Arrangement:</strong> {jobPost.workArrangement}</p>
              <p className="text-gray-700"><strong>Posted On:</strong> {new Date(jobPost.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-700"><strong>Application Deadline:</strong> {new Date(jobPost.deadline).toLocaleDateString()}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Salary & Benefits</h3>
              <p className="text-gray-700">
                <strong>Salary:</strong> {jobPost.salaryRange.currency} {jobPost.salaryRange.min} - {jobPost.salaryRange.max}
                {jobPost.salaryRange.negotiable && ' (Negotiable)'}
              </p>
              {jobPost.benefits && jobPost.benefits.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium mb-1">Benefits:</p>
                  <ul className="list-disc list-inside text-gray-700">
                    {jobPost.benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-4">
          {!jobPost.isApproved && (
            <Button
              onClick={handleApproveJob}
              disabled={approving}
              className="bg-green-600 hover:bg-green-700 text-white"
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
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminJobPostDetailsPage;