import { useAuth } from '@/context/AuthContext';
import React, { useRef, useState } from 'react';
import {
    CheckCircle,
    X,
    Upload,
    FileText,
    User
} from 'lucide-react';


const ApplicationModal = ({ isOpen, onClose, job, onSubmit }) => {
    const [formData, setFormData] = useState({
        useCurrentResume: true,
        resumeFile: null,
        coverLetterFile: null,
        additionalNotes: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const serverUrl = import.meta.env.VITE_SERVER_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const newFormData = new FormData();
            newFormData.append('jobId', job._id);
            newFormData.append('useCurrentResume', formData.useCurrentResume);
            newFormData.append('cv', formData.resumeFile);
            newFormData.append('coverLetter', formData.coverLetterFile);
            newFormData.append('additionalNotes', formData.additionalNotes);

            newFormData.forEach((value, key) => {
                console.log(`${key}:`, value);
            });
            onSubmit(newFormData);
        } catch (error) {
            console.error('Error submitting application:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCvFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, resumeFile: file }));
    };

    const handleCoverLetterFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, coverLetterFile: file }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-xl flex items-center justify-center text-xl">
                            {job.employerId.logoUrl ? (
                                <img src={serverUrl + job.employerId.logoUrl} alt={job.employerId.companyName} className="w-10 h-10 rounded-full" />
                            ) : (
                                job.employerId.companyName.charAt(0).toUpperCase()
                            )
                            }
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Apply for Position</h2>
                            <p className="text-gray-600">{job.title} at {job.employerId.companyName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Resume Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                            <FileText className="w-5 h-5" />
                            <span>Resume</span>
                        </h3>

                        {user.profile.resumeUrl && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <label className="flex items-start space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="resumeChoice"
                                        checked={formData.useCurrentResume}
                                        onChange={() => setFormData(prev => ({ ...prev, useCurrentResume: true, resumeFile: null }))}
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <CheckCircle className="w-4 h-4 text-blue-600" />
                                            <span className="font-medium text-blue-900">Use Current Resume</span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        )}

                        <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${!formData.useCurrentResume ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-50'
                            }`}>
                            <label className="cursor-pointer">
                                <input
                                    type="radio"
                                    name="resumeChoice"
                                    checked={!formData.useCurrentResume}
                                    onChange={() => setFormData(prev => ({ ...prev, useCurrentResume: false }))}
                                    className="sr-only"
                                />
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600 mb-2">Upload New Resume</p>
                                <p className="text-sm text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                            </label>

                            {!formData.useCurrentResume && (
                                <div className="mt-4">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleCvFileChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-medium hover:file:bg-blue-700"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cover Letter */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                            <User className="w-5 h-5" />
                            <span>Cover Letter (Optional)</span>
                        </h3>

                        <div className="border-2 border-dashed rounded-xl p-6 text-center transition-colors">
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleCoverLetterFileChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-medium hover:file:bg-blue-700"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Additional Notes (Optional)</h3>
                        <textarea
                            value={formData.additionalNotes}
                            onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                            placeholder="Any additional information you'd like to share..."
                            rows={3}
                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            maxLength={500}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || (!formData.useCurrentResume && !formData.resumeFile)}

                            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${isSubmitting || (!formData.useCurrentResume && !formData.resumeFile)
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                                }`}
                        >

                            {isSubmitting ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Submitting...</span>
                                </div>
                            ) : (
                                'Submit Application'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplicationModal;