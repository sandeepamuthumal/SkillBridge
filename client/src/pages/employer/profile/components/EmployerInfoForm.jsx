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
    Linkedin,
    Twitter,
    Facebook,
    Upload,
    User,
    Save,
    CheckCircle,
    AlertCircle,
    X,
    Paperclip,
    Plus,
    Edit3,
    MapPin,
    GraduationCap,
    Loader2,
    Building2,
    Contact
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { employerProfileAPI } from '@/services/employer/employerProfileAPI';

// Validation schema using Zod
const EmployerInfoSchema = z.object({
    companyName: z.string()
        .min(1, 'Company name is required')
        .max(100, 'Company name cannot exceed 100 characters')
        .regex(/^[a-zA-Z0-9\s]+$/, 'Company name should only contain letters, numbers, and spaces'),

    industry: z.string()
        .min(1, 'Industry is required'),

    companyDescription: z.string()
        .max(2000, 'Company Description cannot exceed 2000 characters')
        .optional()
        .or(z.literal('')),

    companyWebsite: z.string()
        .url("Please enter a valid URL")
        .optional(),

    foundedYear: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number()
        .min(1800, 'Founded year cannot be before 1800')
        .max(new Date().getFullYear(), `Founded year cannot be after ${new Date().getFullYear()}`)),

    companySize: z.enum(['startup', 'small', 'medium', 'large'])
        .default("startup"),

    contactPersonName: z.string()
        .regex(/^[a-zA-Z\s]+$/, 'Contact Person name should only contain letters, and spaces')
        .optional(),

    phone: z.string()
        .regex(/^\+\d{1,3}\d{1,15}$/, "Phone number must include country code and doesn't contain space")
        .optional(),

    address: z.string()
        .regex(/^[a-zA-Z0-9\s,./-]+$/, "Address can only contain letters, numbers, spaces, and , . / -")
        .optional(),
        
    logoUrl: z.string().optional(),    

    linkedin: z.string()
        .regex(/^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/,"Please enter a valid LinkedIn URL")
        .optional()
        .or(z.literal('')),
    
    twitter: z.string()
        .regex(/^https?:\/\/(www\.)?twitter\.com\/[A-Za-z0-9_]+\/?$/, "Please enter a valid Twitter URL")
        .optional()
        .or(z.literal('')),

    facebook: z.string()
        .regex(/^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9.]+\/?$/, "Please enter a valid Facebook URL")
        .optional()
        .or(z.literal('')),
});

const EmployerInfoForm = ({ initialData = {}, onSave, isLoading = false }) => {
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    const { user } = useAuth();
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(initialData.logoUrl ? serverUrl + initialData.logoUrl : "");
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Initialize form with react-hook-form
    const form = useForm({
        resolver: zodResolver(EmployerInfoSchema),
        defaultValues: {
            companyName: initialData.companyName || user?.companyName || '',
            industry: initialData.industry || user?.industry || '',
            companyDescription: initialData.companyDescription || user?.companyDescription || '',
            companyWebsite: initialData.companyWebsite || user?.companyWebsite || '',
            foundedYear: initialData.foundedYear || user?.foundedYear || '',
            companySize: initialData.companySize || user?.companySize || 'startup',
            contactPersonName: initialData.contactPersonName || user?.contactPersonName || '',
            phone: initialData.contactInfo?.phone || user?.contactInfo?.phone || '',
            address: initialData.contactInfo?.address || user?.contactInfo?.address || '',
            logoUrl: initialData.logoUrl || user?.logoUrl || '',
            facebook: initialData.socialLinks?.facebook || user?.socialLinks?.facebook || '',
            twitter: initialData.socialLinks?.twitter || user?.socialLinks?.twitter || '',
            linkedin: initialData.socialLinks?.linkedin || user?.socialLinks?.linkedin || '',
            verified: initialData.verified || user?.verified || '',
            verificationDocuments: initialData.verificationDocuments || user?.verificationDocuments || '',
        }
    });

    const { handleSubmit, control, watch, setValue, formState: { errors, isValid, isDirty } } = form;

    // Watch form values for progress calculation
    const watchedValues = watch();

    // Update form values when initialData changes
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            Object.keys(initialData).forEach(key => {
                if (form.getValues(key) !== initialData[key]) {
                    setValue(key, initialData[key] || '');
                }
            });

            setImagePreview(`${serverUrl}${initialData.logoUrl}` || '');
        }
    }, [initialData, setValue, form]);

    const companySizeOptions = [
        "startup",
        "small",
        "medium",
        "large",
    ];

    const handleImageUpload = async (file) => {
        if (!file) return;

        // Validate file type and size
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload a valid Logo file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error('Logo size should be less than 5MB');
            return;
        }

        setUploadingImage(true);

        try {
            // Create FormData for file upload
            const uploadData = new FormData();
            uploadData.append('logoImage', file);
            const result = await employerProfileAPI.uploadLogo(uploadData);

            // For now, create a preview URL
            const previewUrl = result.logoUrl ? serverUrl + result.logoUrl : URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setValue("logoUrl", result.logoUrl);

            toast.success('Logo uploaded successfully');
        } catch (error) {
            toast.error('Failed to upload Logo');
            console.error('Logo upload error:', error);
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
        setValue('logoUrl', '');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getInitials = () => {
        const splittedCompanyName = watchedValues.companyName.split(' ');
        const first = splittedCompanyName[0]?.charAt(0) || '';
        const last = splittedCompanyName[1]?.charAt(0) || '';
        return `${first}${last}`.toUpperCase();
    };

    const calculateCompletion = () => {
        const requiredFields = ['companyName', 'industry', 'companySize'];
        const optionalFields = ['companyDescription', 'companyWebsite', 'foundedYear', 
            'contactPersonName', 'phone', 'address', 'facebook', 'linkedin', 'twitter'];

        const requiredCompleted = requiredFields.filter(field =>
            watchedValues[field] && watchedValues[field].toString().trim()
        ).length;

        const optionalCompleted = optionalFields.filter(field =>
            watchedValues[field] && watchedValues[field].toString().trim()
        ).length;

        let totalFields = requiredFields.length + optionalFields.length;
        let completedFields = requiredCompleted + optionalCompleted;

        if (watchedValues.verified) {
            const extraPoints = 10; 
            completedFields += extraPoints;
            totalFields += extraPoints; 
        }

        return Math.round((completedFields / totalFields) * 100);
    };


    const onSubmit = async (data) => {
        try {
            await onSave?.(data);
            toast.success('Company information saved successfully');
        } catch (error) {
            toast.error('Failed to save company information');
            console.error('Save error:', error);
        }
    };

    const overallCompletion = calculateCompletion();

    return (
        <div className="space-y-6">
            {/* Progress Bar */}
            <Card>
                <CardContent className="pt-6">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Profile Completion</span>
                    <span className="text-muted-foreground">{overallCompletion}%</span>
                    </div>
                    <Progress value={overallCompletion} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                    Complete your company profile to increase visibility to top candidates.
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

                            {/* Company Information */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-lg font-semibold">Company Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="companyName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Company Name <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your company name" 
                                                    maxLength={100} {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    {watchedValues.companyName?.length || 0}/100 characters
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="industry"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Industry <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="E.g., Information Technology, Healthcare, Finance" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-1 gap-4'>

                                    <FormField
                                        control={control}
                                        name="companyDescription"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Company Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Briefly describe your company, its mission, and vision..."
                                                        rows={4}
                                                        maxLength={2000}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    {watchedValues.companyDescription?.length || 0}/2000 characters
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                    <FormField
                                        control={control}
                                        name="companyWebsite"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Company Website 
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="url" 
                                                    placeholder="https://www.example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="foundedYear"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Founded Year 
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="number"
                                                    placeholder="E.g., 2010" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                    control={control}
                                    name="companySize"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Company Size</FormLabel>
                                        <FormControl>
                                            <Select
                                            {...field} 
                                            onValueChange={(value) => field.onChange(value)} 
                                            value={field.value || ''} 
                                            >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select company size" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {companySizeOptions.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option}
                                                </SelectItem>
                                                ))}
                                            </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                </div>
                            </div>

                            {/* Contact Person Information */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <Contact className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-lg font-semibold">Contact Person Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="contactPersonName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Contact Person Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter full name of the contact person" 
                                                    {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Phone 
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="E.g., +94771234567" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                    <FormField
                                        control={control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Address
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your company address, e.g., 123 Main St, Colombo" 
                                                    {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Social Media Information */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <Paperclip className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-lg font-semibold">Social Links</h3>
                                </div>

                                <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={control}
                                        name="linkedin"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    <div className="flex items-center gap-2">
                                                    <Linkedin className="h-5 w-5 text-blue-600" />
                                                    <span className="text-sm font-medium">LinkedIn</span>
                                                    </div>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://www.linkedin.com/in/username" 
                                                    {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                  Add your LinkedIn profile URL
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="twitter"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    <div className="flex items-center gap-2">
                                                    <Twitter className="h-5 w-5 text-blue-600" />
                                                    <span className="text-sm font-medium">Twitter</span>
                                                    </div>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://twitter.com/usernam" 
                                                    {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                  Add your Twitter profile URL
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="facebook"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    <div className="flex items-center gap-2">
                                                    <Facebook className="h-5 w-5 text-blue-600" />
                                                    <span className="text-sm font-medium">Facebook</span>
                                                    </div>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://www.facebook.com/username" 
                                                    {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                  Add your Facebook profile URL
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end pt-4 border-t">
                                <Button
                                    type="submit"
                                    disabled={isLoading || !isDirty}
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
                                            Save Info
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

export default EmployerInfoForm;