// components/ExperienceForm.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Briefcase,
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    CheckCircle,
    Calendar,
    Building,
    Clock
} from 'lucide-react';
import { toast } from 'react-toastify';

const ExperienceForm = ({ initialData, onSave, isLoading }) => {
    const [experiences, setExperiences] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const emptyExperience = {
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
        description: ''
    };

    const [currentExperience, setCurrentExperience] = useState(emptyExperience);

    const jobTitleSuggestions = [
        'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
        'Mobile Developer', 'Data Scientist', 'DevOps Engineer', 'UI/UX Designer', 'Product Manager',
        'Project Manager', 'Business Analyst', 'Quality Assurance Engineer', 'Database Administrator',
        'System Administrator', 'Network Engineer', 'Cybersecurity Analyst', 'Technical Lead',
        'Senior Software Engineer', 'Junior Developer', 'Intern', 'Freelancer', 'Consultant'
    ];

    useEffect(() => {
        if (initialData?.experiences) {
            // Convert date objects to date strings for form inputs
            const formattedExperiences = initialData.experiences.map(exp => ({
                ...exp,
                id: exp._id || Date.now() + Math.random(),
                startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
                endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''
            }));
            setExperiences(formattedExperiences);
        }
    }, [initialData]);

    const handleInputChange = (field, value) => {
        setCurrentExperience(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSwitchChange = (checked) => {
        setCurrentExperience(prev => ({
            ...prev,
            currentlyWorking: checked,
            endDate: checked ? '' : prev.endDate
        }));
    };

    const validateExperience = (experience) => {
        const errors = [];
        if (!experience.title.trim()) errors.push('Job title is required');
        if (!experience.company.trim()) errors.push('Company name is required');
        if (!experience.startDate) errors.push('Start date is required');
        if (!experience.currentlyWorking && !experience.endDate) errors.push('End date is required');

        if (experience.startDate && experience.endDate) {
            const startDate = new Date(experience.startDate);
            const endDate = new Date(experience.endDate);
            if (startDate > endDate) {
                errors.push('Start date cannot be after end date');
            }
        }

        const currentDate = new Date();
        if (experience.startDate && new Date(experience.startDate) > currentDate) {
            errors.push('Start date cannot be in the future');
        }
        if (experience.endDate && new Date(experience.endDate) > currentDate) {
            errors.push('End date cannot be in the future');
        }

        return errors;
    };

    const addExperience = () => {
        const errors = validateExperience(currentExperience);
        if (errors.length > 0) {
            toast.error(errors[0]);
            return;
        }

        const newExperience = { ...currentExperience, id: Date.now() };
        setExperiences([...experiences, newExperience]);
        setCurrentExperience(emptyExperience);
        setShowAddForm(false);
        toast.success('Experience added');
    };

    const updateExperience = () => {
        const errors = validateExperience(currentExperience);
        if (errors.length > 0) {
            toast.error(errors[0]);
            return;
        }

        setExperiences(experiences.map(exp =>
            exp.id === isEditing ? currentExperience : exp
        ));
        setIsEditing(null);
        setCurrentExperience(emptyExperience);
        toast.success('Experience updated');
    };

    const deleteExperience = (id) => {
        setExperiences(experiences.filter(exp => exp.id !== id));
        toast.success('Experience deleted');
    };

    const startEdit = (experience) => {
        setCurrentExperience({ ...experience });
        setIsEditing(experience.id);
        setShowAddForm(false);
    };

    const cancelEdit = () => {
        setIsEditing(null);
        setShowAddForm(false);
        setCurrentExperience(emptyExperience);
    };

    const handleSave = async () => {
        try {
            // Convert date strings back to Date objects and remove temporary IDs
            const experiencesToSave = experiences.map(exp => {
                const { id, ...experienceData } = exp;
                return {
                    ...experienceData,
                    startDate: experienceData.startDate ? new Date(experienceData.startDate) : undefined,
                    endDate: experienceData.endDate ? new Date(experienceData.endDate) : undefined
                };
            });

            await onSave({ experiences: experiencesToSave });
            toast.success('Experience updated successfully');
        } catch (error) {
            console.error('Error updating experience:', error);
            toast.error('Failed to update experience');
        }
    };

    const formatDuration = (startDate, endDate, currentlyWorking) => {
        const start = new Date(startDate);
        const end = currentlyWorking ? new Date() : new Date(endDate);

        const diffTime = Math.abs(end - start);
        const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));

        if (diffMonths < 12) {
            return `${diffMonths} month${diffMonths !== 1 ? 's' : ''}`;
        } else {
            const years = Math.floor(diffMonths / 12);
            const months = diffMonths % 12;
            return `${years} year${years !== 1 ? 's' : ''}${months > 0 ? ` ${months} month${months !== 1 ? 's' : ''}` : ''}`;
        }
    };

    const ExperienceCard = ({ experience, index }) => (
        <Card key={experience.id || index} className="relative">
            <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h4 className="font-semibold text-lg">{experience.title}</h4>
                        <p className="text-blue-600 font-medium flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            {experience.company}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(experience.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {' '}
                                {experience.currentlyWorking ? 'Present' : new Date(experience.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatDuration(experience.startDate, experience.endDate, experience.currentlyWorking)}
                            </span>
                        </div>
                        {experience.description && (
                            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                                {experience.description}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2 ml-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(experience)}
                            className="gap-1"
                        >
                            <Edit className="h-3 w-3" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteExperience(experience.id)}
                            className="gap-1 text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="h-3 w-3" />
                            Delete
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );


    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Briefcase className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Work Experience</CardTitle>
                            <CardDescription>
                                Add your professional work history and achievements
                            </CardDescription>
                        </div>
                    </div>
                    {!showAddForm && !isEditing && (
                        <Button onClick={() => setShowAddForm(true)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Experience
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Existing Experience */}
                {experiences.length > 0 ? (
                    <div className="space-y-4">
                        {experiences
                            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate)) // Sort by newest first
                            .map((experience, index) => (
                                <ExperienceCard key={experience.id || index} experience={experience} index={index} />
                            ))}
                    </div>
                ) : (
                    <Alert>
                        <Briefcase className="h-4 w-4" />
                        <AlertDescription>
                            No work experience added yet. Add your professional experience to showcase your background.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Add New Experience Form */}
                {showAddForm && !isEditing && (
                    <ExperienceFormComponent
                        currentExperience={currentExperience}
                        handleInputChange={handleInputChange}
                        handleSwitchChange={handleSwitchChange}
                        onSave={handleSave}
                        onSubmit={addExperience}
                        onCancel={cancelEdit}
                        submitText="Add Experience"
                    />
                )}

                {/* Edit Experience Form */}
                {isEditing && (
                    <ExperienceFormComponent
                        currentExperience={currentExperience}
                        handleInputChange={handleInputChange}
                        handleSwitchChange={handleSwitchChange}
                        onSubmit={updateExperience}
                        onCancel={cancelEdit}
                        submitText="Update Experience"
                    />
                )}

                {/* Tips */}
                {(showAddForm || isEditing) && (
                    <Alert>
                        <Briefcase className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Tips for writing experience:</strong>
                            <ul className="mt-2 space-y-1 text-xs">
                                <li>• Use action verbs (developed, managed, implemented, led)</li>
                                <li>• Include specific technologies and tools you used</li>
                                <li>• Quantify achievements (increased efficiency by 20%, managed team of 5)</li>
                                <li>• Focus on results and impact, not just responsibilities</li>
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t">
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="gap-2"
                        size="lg"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-4 w-4" />
                                Save Experience
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

const ExperienceFormComponent = ({ currentExperience, handleInputChange, handleSwitchChange, onSubmit, onCancel, submitText }) => (
    <Card className="border-orange-200">
        <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <div className="relative">
                        <Input
                            id="title"
                            placeholder="e.g., Software Engineer"
                            value={currentExperience.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                        />

                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="company">Company *</Label>
                    <Input
                        id="company"
                        placeholder="e.g., Google Inc."
                        value={currentExperience.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                        id="startDate"
                        type="date"
                        value={currentExperience.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                        id="endDate"
                        type="date"
                        value={currentExperience.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        disabled={currentExperience.currentlyWorking}
                    />
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    id="currentlyWorking"
                    checked={currentExperience.currentlyWorking}
                    onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="currentlyWorking">I currently work here</Label>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                    id="description"
                    placeholder="Describe your responsibilities, achievements, and key projects..."
                    value={currentExperience.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="resize-none"
                />
                <p className="text-xs text-gray-500">
                    Tip: Include specific achievements, technologies used, and quantifiable results
                </p>
            </div>

            <div className="flex gap-2 pt-4">
                <Button onClick={onSubmit} className="gap-2">
                    <Save className="h-4 w-4" />
                    {submitText}
                </Button>
                <Button variant="outline" onClick={onCancel} className="gap-2">
                    <X className="h-4 w-4" />
                    Cancel
                </Button>
            </div>
        </CardContent>
    </Card>
);

export default ExperienceForm;