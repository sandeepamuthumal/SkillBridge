import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, User, Briefcase, Calendar, XCircle, Building2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { adminReportAPI } from '@/services/adminReportAPI';

const AdminApplicationDetailView = ({ application, onBack }) => {

    if (!application) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <XCircle className="h-12 w-12 text-red-500" />
                <h2 className="text-2xl font-bold text-gray-800">Application not found</h2>
                <Button onClick={onBack} variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Report
                </Button>
            </div>
        );
    }

    const handleDownload = async () => {
        const result = await adminReportAPI.downloadApplicationFile(application._id);
        if (!result.success) {
            toast.error(result.error || 'Failed to download file.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Button onClick={onBack} variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Report
                </Button>
                <div className="flex space-x-2">
                    <Button onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" /> Download Resume
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader><CardTitle>Application Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500">Job Seeker</p>
                            <div className="flex items-center space-x-2">
                                <User className="h-5 w-5 text-gray-500" />
                                <p className="font-semibold">{application.jobSeekerId.userId.firstName} {application.jobSeekerId.userId.lastName}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500">Job Title</p>
                            <div className="flex items-center space-x-2">
                                <Briefcase className="h-5 w-5 text-gray-500" />
                                <p className="font-semibold">{application.jobPostId.title}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500">Employer</p>
                            <div className="flex items-center space-x-2">
                                <Building2 className="h-5 w-5 text-gray-500" />
                                <p className="font-semibold">{application.jobPostId.employerId.companyName}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500">Applied On</p>
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-5 w-5 text-gray-500" />
                                <p className="font-semibold">{new Date(application.appliedDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500">Status</p>
                            <div className="flex items-center space-x-2">
                                <Badge variant={
                                    application.status === 'Shortlisted' ? 'success' :
                                    application.status === 'Rejected' ? 'destructive' :
                                    application.status === 'Interview Scheduled' ? 'warning' : 'secondary'
                                }>
                                    {application.status}
                                </Badge>
                            </div>
                        </div>
                        {application.additionalNotes && (
                             <div className="space-y-2 lg:col-span-3">
                                 <p className="text-sm text-gray-500">Additional Notes</p>
                                 <p className="text-gray-800">{application.additionalNotes}</p>
                             </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminApplicationDetailView;