import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
    Camera,
    Upload,
    User,
    Save,
    CheckCircle,
    AlertCircle,
    X,
    Plus,
    Edit3,
    MapPin,
    GraduationCap,
    Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { seekerProfileAPI } from '@/services/jobseeker/seekerProfileAPI';

// Validation schema using Zod
const personalInfoSchema = z.object({
    firstName: z.string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name cannot exceed 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'First name should only contain letters and spaces'),

    lastName: z.string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name cannot exceed 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Last name should only contain letters and spaces'),

    email: z.string()
        .email('Please enter a valid email address'),

    statementHeader: z.string()
        .max(100, 'Statement header cannot exceed 100 characters')
        .optional()
        .or(z.literal('')),

    statement: z.string()
        .max(500, 'Statement cannot exceed 500 characters')
        .optional()
        .or(z.literal('')),

    university: z.string()
        .min(2, 'University name is required')
        .max(100, 'University name cannot exceed 100 characters'),

    fieldOfStudy: z.string()
        .min(2, 'Field of study is required')
        .max(100, 'Field of study cannot exceed 100 characters'),

    cityId: z.string().optional(),

    availability: z.enum(['Immediately', 'Within 2 weeks', 'Within 1 month', 'Within 3 months'])
        .default('Within 1 month'),

    profileVisibility: z.enum(['Public', 'Private', 'Limited'])
        .default('Public'),

    profilePictureUrl: z.string().optional()
});

const PersonalInfoForm = ({ initialData = {}, onSave, isLoading = false }) => {
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    const { user } = useAuth();
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(initialData.profilePictureUrl ? serverUrl + initialData.profilePictureUrl : "");
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [cities, setCities] = useState([]);

    // Initialize form with react-hook-form
    const form = useForm({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            firstName: initialData.firstName || user?.firstName || '',
            lastName: initialData.lastName || user?.lastName || '',
            email: initialData.email || user?.email || '',
            statementHeader: initialData.statementHeader || '',
            statement: initialData.statement || '',
            university: initialData.university || user?.university || '',
            fieldOfStudy: initialData.fieldOfStudy || user?.fieldOfStudy || '',
            cityId: initialData.cityId || '',
            availability: initialData.availability || 'Within 1 month',
            profileVisibility: initialData.profileVisibility || 'Public',
            profilePictureUrl: initialData.profilePictureUrl || ''
        }
    });

    const { handleSubmit, control, watch, setValue, formState: { errors, isValid, isDirty } } = form;

    // Watch form values for progress calculation
    const watchedValues = watch();

    // Mock data - replace with actual API calls
    const availabilityOptions = [
        'Immediately',
        'Within 2 weeks',
        'Within 1 month',
        'Within 3 months'
    ];

    const visibilityOptions = [
        { value: 'Public', label: 'Public', description: 'Visible to all employers' },
        { value: 'Limited', label: 'Limited', description: 'Visible to matched employers' },
        { value: 'Private', label: 'Private', description: 'Only visible to you' }
    ];

    // Mock cities - replace with actual API call
    useEffect(() => {
        (async () => {
            try {
                const citiesRes = await seekerProfileAPI.getCities();
                setCities(citiesRes.data);
            } catch (err) {
                console.error("City load failed", err);
            }
        })();
    }, []);

    // Update form values when initialData changes
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            Object.keys(initialData).forEach(key => {
                if (form.getValues(key) !== initialData[key]) {
                    setValue(key, initialData[key] || '');
                }
            });
            
            setImagePreview(`${serverUrl}${initialData.profilePictureUrl}` || '');
        }
    }, [initialData, setValue, form]);

    const handleImageUpload = async (file) => {
        if (!file) return;

        // Validate file type and size
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload a valid image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error('Image size should be less than 5MB');
            return;
        }

        setUploadingImage(true);

        try {
            // Create FormData for file upload
            const uploadData = new FormData();
            uploadData.append('profileImage', file);
            const result = await seekerProfileAPI.uploadProfileImage(uploadData);

            // For now, create a preview URL
            const previewUrl = serverUrl + result.imageUrl || URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setValue("profilePictureUrl", result.imageUrl);

            toast.success('Profile image uploaded successfully');
        } catch (error) {
            toast.error('Failed to upload image');
            console.error('Image upload error:', error);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const removeImage = () => {
        setImagePreview('');
        setValue('profilePictureUrl', '');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getInitials = () => {
        const first = watchedValues.firstName?.charAt(0) || '';
        const last = watchedValues.lastName?.charAt(0) || '';
        return `${first}${last}`.toUpperCase();
    };

    const calculateCompletion = () => {
        const requiredFields = ['firstName', 'lastName', 'email', 'university', 'fieldOfStudy'];
        const optionalFields = ['statementHeader', 'statement', 'profilePictureUrl', 'cityId'];

        const requiredCompleted = requiredFields.filter(field =>
            watchedValues[field] && watchedValues[field].toString().trim()
        ).length;

        const optionalCompleted = optionalFields.filter(field =>
            watchedValues[field] && watchedValues[field].toString().trim()
        ).length;

        const totalFields = requiredFields.length + optionalFields.length;
        const completedFields = requiredCompleted + optionalCompleted;

        return Math.round((completedFields / totalFields) * 100);
    };

    const onSubmit = async (data) => {
        try {
            await onSave?.(data);
        } catch (error) {
            toast.error('Failed to save personal information');
            console.error('Save error:', error);
        }
    };

    const completion = calculateCompletion();

    return (
        <div className="space-y-6">
            {/* Progress Section */}
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-600" />
                                <span className="font-medium">Personal Information</span>
                            </div>
                            <Badge variant={completion > 70 ? "default" : "secondary"}>
                                {completion}% Complete
                            </Badge>
                        </div>
                        <Progress value={completion} className="h-2" />
                        <p className="text-sm text-muted-foreground">
                            Complete your personal information to improve your profile visibility
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Main Form */}
            <Card>
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {/* Profile Picture Section */}
                            <div className="space-y-4">
                                <Label className="text-base font-semibold">Profile Picture</Label>
                                <div className="flex items-start gap-6">
                                    <div className="relative">
                                        <Avatar className="h-24 w-24 border-4 border-gray-100">
                                            <AvatarImage src={imagePreview} alt="Profile" />
                                            <AvatarFallback className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                                {getInitials()}
                                            </AvatarFallback>
                                        </Avatar>
                                        {imagePreview && (
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        <div
                                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragOver
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                        >
                                            <div className="space-y-3">
                                                <div className="flex justify-center">
                                                    {uploadingImage ? (
                                                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                                    ) : (
                                                        <Camera className="h-8 w-8 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        Drop your image here, or{' '}
                                                        <button
                                                            type="button"
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="text-blue-600 hover:text-blue-500 underline"
                                                        >
                                                            browse
                                                        </button>
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        PNG, JPG up to 5MB
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-lg font-semibold">Basic Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    First Name <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your first name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Last Name <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your last name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Email Address <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="Enter your email address" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Professional Statement */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <Edit3 className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-lg font-semibold">Professional Statement</h3>
                                </div>

                                <div className="space-y-4">
                                    <FormField
                                        control={control}
                                        name="statementHeader"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Statement Header</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g., Passionate Full-Stack Developer"
                                                        maxLength={100}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    {watchedValues.statementHeader?.length || 0}/100 characters
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="statement"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Professional Statement</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Write a brief professional statement about yourself..."
                                                        rows={4}
                                                        maxLength={500}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    {watchedValues.statement?.length || 0}/500 characters
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Education Information */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-lg font-semibold">Education</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="university"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    University <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your university" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="fieldOfStudy"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Field of Study <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Computer Science" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Location & Preferences */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-lg font-semibold">Location & Preferences</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="cityId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Location</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select your city" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {cities.map((city) => (
                                                            <SelectItem key={city._id} value={city._id}>
                                                                {city.name}, {city.country}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="availability"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Availability</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select availability" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {availabilityOptions.map((option) => (
                                                            <SelectItem key={option} value={option}>
                                                                {option}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={control}
                                    name="profileVisibility"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Profile Visibility</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select visibility" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {visibilityOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            <div>
                                                                <div className="font-medium">{option.label}</div>
                                                                <div className="text-xs text-muted-foreground">{option.description}</div>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-end gap-4 pt-6 border-t">
                                <Button
                                    type="submit"
                                    disabled={isLoading || !isDirty}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Personal Info
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default PersonalInfoForm;