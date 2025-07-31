// Fixed EducationForm.jsx - Resolves typing issues
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    GraduationCap,
    Plus,
    Edit,
    Trash2,
    CheckCircle,
    Calendar,
    School
} from 'lucide-react';
import { toast } from 'react-toastify';
import EducationFormComponent from './EducationFormComponent';

const EducationForm = ({ initialData, onSave, isLoading }) => {
    const [educations, setEducations] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const emptyEducation = {
        degree: '',
        fieldOfStudy: '',
        university: '',
        startYear: '',
        endYear: '',
        currentlyStudying: false,
        gpa: ''
    };

    const [currentEducation, setCurrentEducation] = useState(emptyEducation);

    useEffect(() => {
        if (initialData?.educations) {
            setEducations([...initialData.educations]);
        }
    }, [initialData]);

    // Fixed handleInputChange - handles all input types properly
    const handleInputChange = (field, value) => {
        setCurrentEducation(prev => ({
            ...prev,
            [field]: value // Store raw value, convert only when needed
        }));
    };

    const handleSwitchChange = (checked) => {
        setCurrentEducation(prev => ({
            ...prev,
            currentlyStudying: checked,
            endYear: checked ? '' : prev.endYear
        }));
    };

    const validateEducation = (education) => {
        const errors = [];
        if (!education.degree.trim()) errors.push('Degree is required');
        if (!education.fieldOfStudy.trim()) errors.push('Field of study is required');
        if (!education.university.trim()) errors.push('University/Institution is required');
        if (!education.startYear) errors.push('Start year is required');
        if (!education.currentlyStudying && !education.endYear) errors.push('End year is required');

        const currentYear = new Date().getFullYear();

        // Convert to numbers only for validation
        const startYearNum = education.startYear ? parseInt(education.startYear) : null;
        const endYearNum = education.endYear ? parseInt(education.endYear) : null;
        const gpaNum = education.gpa ? parseFloat(education.gpa) : null;

        if (startYearNum && (startYearNum < 1950 || startYearNum > currentYear)) {
            errors.push('Invalid start year');
        }
        if (endYearNum && (endYearNum < 1950 || endYearNum > currentYear + 10)) {
            errors.push('Invalid end year');
        }
        if (startYearNum && endYearNum && startYearNum > endYearNum) {
            errors.push('Start year cannot be greater than end year');
        }
        if (gpaNum && (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4)) {
            errors.push('GPA must be between 0 and 4');
        }

        return errors;
    };

    const addEducation = () => {
        const errors = validateEducation(currentEducation);
        if (errors.length > 0) {
            toast.error(errors[0]);
            return;
        }

        // Convert string values to appropriate types before saving
        const newEducation = {
            ...currentEducation,
            id: Date.now(),
            startYear: currentEducation.startYear ? parseInt(currentEducation.startYear) : null,
            endYear: currentEducation.endYear ? parseInt(currentEducation.endYear) : null,
            gpa: currentEducation.gpa ? parseFloat(currentEducation.gpa) : null
        };

        setEducations([...educations, newEducation]);
        setCurrentEducation(emptyEducation);
        setShowAddForm(false);
        toast.success('Education added');
    };

    const updateEducation = () => {
        const errors = validateEducation(currentEducation);
        if (errors.length > 0) {
            toast.error(errors[0]);
            return;
        }

        // Convert string values to appropriate types before saving
        const updatedEducation = {
            ...currentEducation,
            startYear: currentEducation.startYear ? parseInt(currentEducation.startYear) : null,
            endYear: currentEducation.endYear ? parseInt(currentEducation.endYear) : null,
            gpa: currentEducation.gpa ? parseFloat(currentEducation.gpa) : null
        };

        setEducations(educations.map(edu =>
            edu._id === isEditing ? updatedEducation : edu
        ));
        setIsEditing(null);
        setCurrentEducation(emptyEducation);
        toast.success('Education updated');
    };

    const deleteEducation = (id) => {
        setEducations(educations.filter(edu => edu.id !== id));
        toast.success('Education deleted');
    };

    const startEdit = (education) => {
        // Convert numbers back to strings for form inputs
        setCurrentEducation({
            ...education,
            startYear: education.startYear ? education.startYear.toString() : '',
            endYear: education.endYear ? education.endYear.toString() : '',
            gpa: education.gpa ? education.gpa.toString() : ''
        });

        console.log('Editing education:', education);
        setIsEditing(education._id);
        setShowAddForm(false);
        
    };

    const cancelEdit = () => {
        setIsEditing(null);
        setShowAddForm(false);
        setCurrentEducation(emptyEducation);
    };

    const handleSave = async () => {
        try {
            // Convert string values to appropriate types and remove temporary IDs
            const educationsToSave = educations.map(edu => {
                const { id, ...educationData } = edu;
                return {
                    ...educationData,
                    startYear: educationData.startYear || undefined,
                    endYear: educationData.endYear || undefined,
                    gpa: educationData.gpa || undefined
                };
            });

            await onSave({ educations: educationsToSave });
            toast.success('Education updated successfully');
        } catch (error) {
            toast.error('Failed to update education');
        }
    };

    const EducationCard = ({ education, index }) => (
        <Card key={education.id || index} className="relative">
            <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h4 className="font-semibold text-lg">{education.degree}</h4>
                        <p className="text-blue-600 font-medium">{education.fieldOfStudy}</p>
                        <p className="text-gray-600">{education.university}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {education.startYear} - {education.currentlyStudying ? 'Present' : education.endYear}
                            </span>
                            {education.gpa && (
                                <span>GPA: {education.gpa}/4.0</span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(education)}
                            className="gap-1"
                        >
                            <Edit className="h-3 w-3" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteEducation(education.id)}
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
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <GraduationCap className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Education</CardTitle>
                            <CardDescription>
                                Add your academic background and qualifications
                            </CardDescription>
                        </div>
                    </div>
                    {!showAddForm && !isEditing && (
                        <Button onClick={() => setShowAddForm(true)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Education
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Existing Education */}
                {educations.length > 0 ? (
                    <div className="space-y-4">
                        {educations.map((education, index) => (
                            <EducationCard key={education.id || index} education={education} index={index} />
                        ))}
                    </div>
                ) : (
                    <Alert>
                        <School className="h-4 w-4" />
                        <AlertDescription>
                            No education records added yet. Add your academic background to improve your profile.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Add New Education Form */}
                {showAddForm && !isEditing && (
                    <EducationFormComponent
                        currentEducation={currentEducation}
                        handleInputChange={handleInputChange}
                        handleSwitchChange={handleSwitchChange}
                        onSubmit={addEducation}
                        onCancel={cancelEdit}
                        submitText="Add Education"
                    />
                )}

                {/* Edit Education Form */}
                {isEditing && (
                    <EducationFormComponent
                        currentEducation={currentEducation}
                        handleInputChange={handleInputChange}
                        handleSwitchChange={handleSwitchChange}
                        onSubmit={updateEducation}
                        onCancel={cancelEdit}
                        submitText="Update Education"
                    />
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
                                Save Education
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default EducationForm;