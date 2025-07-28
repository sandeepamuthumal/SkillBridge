import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
    Upload,
    FileText,
    Download,
    CheckCircle,
    AlertCircle,
    Sparkles,
    Eye,
    Trash2,
    RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';
import { cvUploadAPI } from '@/services/jobseeker/cvUploadAPI';

const AICVUpload = ({
    profileData,
    onProfileUpdate,
    onMoveToNextSection,
    loadProfileData
}) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [extractedData, setExtractedData] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    

    // Check if user already has a CV uploaded
    const hasExistingCV = profileData?.resumeUrl;

    const handleFileSelect = useCallback(async (file) => {
        if (!file) return;

        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Please upload a PDF, DOC, or DOCX file');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        await uploadAndProcessCV(file);
    }, []);

    const uploadAndProcessCV = async (file) => {
        setUploading(true);
        setUploadProgress(0);
        setShowResults(false);

        try {
            // Upload and process CV
            const result = await cvUploadAPI.uploadAndParseCV(file, (progress) => {
                setUploadProgress(progress);
            });

            if (result.success) {
                setExtractedData(result.data);
                setShowResults(true);
                toast.success('CV processed successfully! Review the extracted data below.');
            } else {
                toast.error(result.message || 'Failed to process CV');
            }
        } catch (error) {
            console.error('CV upload error:', error);
            toast.error('Failed to upload and process CV. Please try again.');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    }, [handleFileSelect]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    }, []);

    const handleFileInputChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    }, [handleFileSelect]);

    const applyExtractedData = async () => {
        if (!extractedData) return;

        try {
            // Update profile with extracted data and existing data
            const updatedProfileData = {
                ...profileData,
                ...extractedData.extractedData,
            };

            console.log('Applying extracted data:', updatedProfileData);

            await onProfileUpdate(updatedProfileData);

            // Move to skills section
            setTimeout(() => {
                onMoveToNextSection('skills');
                toast.success('Profile updated! Moved to Skills section.');
            }, 1000);

        } catch (error) {
            console.error('Error applying extracted data:', error);
            toast.error('Failed to update profile with extracted data');
        }
    };

    const downloadSampleCV = () => {
        // Create a sample CV download link
        window.open('/sample-cv-template.pdf', '_blank');
    };

    const removeExistingCV = async () => {
        try {
            await cvUploadAPI.removeCV();
            loadProfileData();
            toast.success('CV removed successfully');
        } catch (error) {
            console.error('Error removing CV:', error);
            toast.error('Failed to remove CV');
        }
    };

    const viewExistingCV = () => {
        if (hasExistingCV) {
            window.open(serverUrl +profileData.resumeUrl, '_blank');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                            <Sparkles className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">AI-Powered CV Upload</CardTitle>
                            <CardDescription>
                                Upload your CV to automatically extract and fill your profile sections.
                                Get better job matches with AI-powered profile completion.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Existing CV Display */}
            {hasExistingCV && !showResults && (
                <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="font-medium text-green-800">CV Already Uploaded</p>
                                    <p className="text-sm text-green-600">Your CV has been processed and applied to your profile</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={viewExistingCV}
                                    className="gap-2"
                                >
                                    <Eye className="h-4 w-4" />
                                    View
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={removeExistingCV}
                                    className="gap-2 text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Upload Section */}
            {!showResults && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upload Area */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="h-5 w-5" />
                                Upload Your CV
                            </CardTitle>
                            <CardDescription>
                                Drag and drop your CV or click to browse. Supports PDF, DOC, and DOCX files.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!uploading ? (
                                <div
                                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${dragActive
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileInputChange}
                                        className="hidden"
                                    />

                                    <div className="space-y-4">
                                        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Upload className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-medium">Drop your CV here</p>
                                            <p className="text-sm text-gray-500">or click to browse files</p>
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            <Badge variant="secondary">PDF</Badge>
                                            <Badge variant="secondary">DOC</Badge>
                                            <Badge variant="secondary">DOCX</Badge>
                                        </div>
                                        <p className="text-xs text-gray-400">Maximum file size: 5MB</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 py-8">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-medium">Processing your CV...</p>
                                            <p className="text-sm text-gray-500">This may take a few seconds</p>
                                        </div>
                                        <div className="w-full max-w-xs">
                                            <Progress value={uploadProgress} className="h-2" />
                                            <p className="text-xs text-center mt-1 text-gray-500">{uploadProgress}%</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Sample CV Template */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Need a CV Template?
                            </CardTitle>
                            <CardDescription>
                                Download our sample CV template to see the best format for AI extraction.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center gap-3 mb-3">
                                        <FileText className="h-8 w-8 text-red-600" />
                                        <div>
                                            <p className="font-medium">Sample CV Template</p>
                                            <p className="text-sm text-gray-600">Professional format optimized for AI parsing</p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={downloadSampleCV}
                                        className="w-full gap-2"
                                        variant="outline"
                                    >
                                        <Download className="h-4 w-4" />
                                        Download Template
                                    </Button>
                                </div>

                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="text-sm">
                                        <strong>Tips for best results:</strong>
                                        <ul className="mt-2 space-y-1 text-xs">
                                            <li>• Use clear section headers (Skills, Experience, Education)</li>
                                            <li>• Include full dates (Jan 2020 - Dec 2022)</li>
                                            <li>• List skills with commas (Python, JavaScript, React)</li>
                                            <li>• Include LinkedIn and GitHub URLs</li>
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Extraction Results */}
            {showResults && extractedData && (
                <Card className="border-green-200">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                                <div>
                                    <CardTitle className="text-green-800">CV Processed Successfully!</CardTitle>
                                    <CardDescription>
                                        Review the extracted information below and apply it to your profile.
                                    </CardDescription>
                                </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                                {extractedData.profileCompleteness}% Profile Completion
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Extraction Summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {extractedData.extractedData.skills?.length > 0 && (
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <p className="text-2xl font-bold text-blue-600">
                                        {extractedData.extractedData.skills.length}
                                    </p>
                                    <p className="text-sm text-blue-800">Skills Found</p>
                                </div>
                            )}
                            {extractedData.extractedData.educations?.length > 0 && (
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <p className="text-2xl font-bold text-purple-600">
                                        {extractedData.extractedData.educations.length}
                                    </p>
                                    <p className="text-sm text-purple-800">Education Records</p>
                                </div>
                            )}
                            {extractedData.extractedData.experiences?.length > 0 && (
                                <div className="text-center p-4 bg-orange-50 rounded-lg">
                                    <p className="text-2xl font-bold text-orange-600">
                                        {extractedData.extractedData.experiences.length}
                                    </p>
                                    <p className="text-sm text-orange-800">Work Experiences</p>
                                </div>
                            )}
                            {extractedData.extractedData.projects?.length > 0 && (
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-600">
                                        {extractedData.extractedData.projects.length}
                                    </p>
                                    <p className="text-sm text-green-800">Projects Found</p>
                                </div>
                            )}
                        </div>

                      
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                            <Button
                                onClick={applyExtractedData}
                                className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                size="lg"
                            >
                                <Sparkles className="h-4 w-4" />
                                Apply to Profile & Continue
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowResults(false)}
                                className="gap-2"
                                size="lg"
                            >
                                <Upload className="h-4 w-4" />
                                Upload Different CV
                            </Button>
                        </div>

                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                You can review and edit all extracted information in the respective sections after applying.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AICVUpload;