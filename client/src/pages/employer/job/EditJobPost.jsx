import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from "@/components/ui/checkbox";
import {
    Briefcase,
    Braces,
    CheckCircle,
    Wallet,
    BookText,
    MapPin,
    Building2,
    Users,
    ArrowLeft,
    Save,
    Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { jobPostAPI } from '@/services/jobPostAPI.js';
import { seekerProfileAPI } from '@/services/jobseeker/seekerProfileAPI.js';
import ArrayInputField from './Components/ArrayInputField';
import Swal from 'sweetalert2';

const EditJobPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Same validation schema as create form
    const PostJobSchema = z.object({
        title: z.string()
            .min(1, "Job title is required")
            .max(100, "Job title cannot exceed 100 characters"),

        description: z.string()
            .min(1, "Job description is required")
            .max(5000, "Job description cannot exceed 5000 characters"),

        city: z.string()
            .min(1, "City is required"),

        jobCategory: z.string()
            .min(1, "Job category is required"),

        jobType: z.string()
            .min(1, "Job type is required"),

        responsibilities: z.array(
            z.string().min(1, "Responsibility is required")
        ).nonempty("At least one Responsibility is required"),

        requirements: z.array(
            z.string().min(1, "Requirement is required")
        ).nonempty("At least one requirement is required"),

        preferredSkills: z.array(z.string()).optional(),

        experienceLevel: z.enum(["Entry Level", "Mid Level", "Senior Level", "Executive"], {
            errorMap: () => ({ message: "Experience level is required" }),
        }),

        experienceYears: z.object({
            min: z.preprocess(
                (val) => (val === "" || val === undefined ? undefined : Number(val)), z.number({
                    required_error: "Experience years is required",
                    invalid_type_error: "Experience years must be a number"
                }).min(0, "Experience years cannot be negative").max(50, "Experience years cannot exceed 50")),
            max: z.preprocess(
                (val) => (val === "" || val === undefined ? undefined : Number(val)), z.number({
                    required_error: "Experience years is required",
                    invalid_type_error: "Experience years must be a number"
                }).min(0, "Experience years cannot be negative").max(50, "Experience years cannot exceed 50"))
        }),

        salaryRange: z.object({
            min: z.preprocess(
                (val) => (val === "" || val === undefined ? undefined : Number(val)), z.number({
                    required_error: "Salary minimum is required",
                    invalid_type_error: "Salary minimum invalid"
                })),
            max: z.preprocess(
                (val) => (val === "" || val === undefined ? undefined : Number(val)), z.number({
                    required_error: "Salary maximum is required",
                    invalid_type_error: "Salary maximum invalid"
                })),
            currency: z.enum(["USD", "LKR", "INR", "EUR"], {
                errorMap: () => ({ message: "Currency is required" }),
            }),
            negotiable: z.boolean().default(false),
        }),

        benefits: z.array(z.string()).optional(),

        workArrangement: z.enum(["On-site", "Remote", "Hybrid"],
            { errorMap: () => ({ message: "Work Arrangement is required" }) }),

        deadline: z.preprocess(
            (val) => {
                if (val instanceof Date && !isNaN(val.getTime())) {
                    return val;
                }
                if (typeof val === 'string' && val) {
                    const date = new Date(val);
                    return !isNaN(date.getTime()) ? date : undefined;
                }
                return undefined;
            },
            z.date({ required_error: "Deadline is required" })
        ),

        maxApplications: z.preprocess(
            (val) => (val === "" || val === undefined ? undefined : Number(val)), z.number().default(100)),

        tags: z.array(z.string()).optional(),
    });

    const form = useForm({
        resolver: zodResolver(PostJobSchema),
        defaultValues: {
            title: "",
            description: "",
            city: "",
            jobCategory: "",
            jobType: "",
            responsibilities: [],
            requirements: [],
            preferredSkills: [],
            tags: [],
            experienceLevel: "",
            experienceYears: {
                min: undefined,
                max: undefined,
            },
            benefits: [],
            salaryRange: {
                min: undefined,
                max: undefined,
                currency: "",
                negotiable: false,
            },
            workArrangement: "",
            deadline: "",
            maxApplications: undefined
        }
    });

    const experienceLevelOptions = ["Entry Level", "Mid Level", "Senior Level", "Executive"];
    const currencyOptions = ["USD", "LKR", "INR", "EUR"];
    const workArrangementOptions = ["On-site", "Remote", "Hybrid"];

    const [cities, setCities] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [jobCategories, setJobCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [jobPostData, setJobPostData] = useState(null);

    // Load dropdown data and job post data
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoadingData(true);

                // Load dropdown data
                const [citiesRes, jobTypesRes, jobCategoriesRes, jobPostRes] = await Promise.all([
                    seekerProfileAPI.getCities(),
                    seekerProfileAPI.getJobTypes(),
                    seekerProfileAPI.getJobCategories(),
                    jobPostAPI.getJobById(id)
                ]);

                setCities(citiesRes.data);
                setJobTypes(jobTypesRes.data);
                setJobCategories(jobCategoriesRes.data);

                if (jobPostRes.success) {
                    const jobPost = jobPostRes.data;
                    setJobPostData(jobPost);

                    // Populate form with existing data
                    form.reset({
                        title: jobPost.title || "",
                        description: jobPost.description || "",
                        city: jobPost.cityId?._id || "",
                        jobCategory: jobPost.categoryId?._id || "",
                        jobType: jobPost.typeId?._id || jobPost.jobType || "",
                        responsibilities: jobPost.responsibilities || [],
                        requirements: jobPost.requirements || [],
                        preferredSkills: jobPost.preferredSkills || [],
                        tags: jobPost.tags || [],
                        experienceLevel: jobPost.experienceLevel || "",
                        experienceYears: {
                            min: jobPost.experienceYears?.min || 0,
                            max: jobPost.experienceYears?.max || 0,
                        },
                        benefits: jobPost.benefits || [],
                        salaryRange: {
                            min: jobPost.salaryRange?.min || undefined,
                            max: jobPost.salaryRange?.max || undefined,
                            currency: jobPost.salaryRange?.currency || "",
                            negotiable: jobPost.salaryRange?.negotiable || false,
                        },
                        workArrangement: jobPost.workArrangement || "",
                        deadline: jobPost.deadline ? new Date(jobPost.deadline) : "",
                        maxApplications: jobPost.maxApplications || undefined
                    });
                } else {
                    toast.error("Failed to load job post data");
                    navigate('/employer/jobs');
                }
            } catch (err) {
                toast.error("Failed to load data");
                console.error("Data load failed", err);
                navigate('/employer/jobs');
            } finally {
                setIsLoadingData(false);
            }
        };

        if (id) {
            loadData();
        }
    }, [id, form, navigate]);

    const { control, handleSubmit, watch, formState: { errors, isDirty } } = form;
    const watchedValues = watch();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const result = await jobPostAPI.updateJobPost(id, data);

            if (result.success) {
                toast.success(result.message || "Job post updated successfully");
                navigate('/employer/jobs');
            } else {
                toast.error(result.error || "Failed to update job post");
            }
        } catch (error) {
            toast.error("Unexpected error occurred");
            console.error("Update error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoBack = () => {
        if (isDirty) {
            // Confirm navigation if there are unsaved changes using swal
            Swal.fire({
                title: "Are you sure?",
                text: "You have unsaved changes. Are you sure you want to leave?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, leave!",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/employer/jobs');
                }
            });
        } else {
            navigate('/employer/jobs');
        }
    };

    if (isLoadingData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading job post data...</span>
                </div>
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
                        onClick={handleGoBack}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Jobs
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Job Post</h1>
                        <p className="text-gray-600">Update your job posting details</p>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                        {jobPostData?.title || "Edit Job Post"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {/* Job Information */}
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-blue-600" />
                                <h4 className="text-lg font-semibold">Job Information</h4>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <FormField
                                        control={control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Job Title <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your job title"
                                                        maxLength={100} {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    {watchedValues.title?.length || 0}/100 characters
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Location & Category Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    City <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select City" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {cities.map((city) => (
                                                                <SelectItem key={city._id || city.id} value={city._id || city.id}>
                                                                    {city.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="jobCategory"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Job Category <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {jobCategories.map((category) => (
                                                                <SelectItem key={category._id || category.id} value={category._id || category.id}>
                                                                    {category.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="jobType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Job Type <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Job Type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {jobTypes.map((type) => (
                                                                <SelectItem key={type._id || type.id} value={type._id || type.id}>
                                                                    {type.name}
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

                                <div className="grid grid-cols-1 gap-4">
                                    <FormField
                                        control={control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Job Description <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe the job role..."
                                                        rows={4}
                                                        maxLength={5000}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    {watchedValues.description?.length || 0}/5000 characters
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <FormField
                                        control={control}
                                        name="responsibilities"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Responsibilities <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <ArrayInputField
                                                        values={field.value || []}
                                                        onChange={field.onChange}
                                                        placeholder="Add Responsibilities & Press Enter"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <FormField
                                        control={control}
                                        name="requirements"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Requirements <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <ArrayInputField
                                                        values={field.value || []}
                                                        onChange={field.onChange}
                                                        placeholder="Add Requirements & Press Enter"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="preferredSkills"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Preferred Skills
                                                </FormLabel>
                                                <FormControl>
                                                    <ArrayInputField
                                                        values={field.value || []}
                                                        onChange={field.onChange}
                                                        placeholder="Add Preferred Skills & Press Enter"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="tags"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Tags
                                                </FormLabel>
                                                <FormControl>
                                                    <ArrayInputField
                                                        values={field.value || []}
                                                        onChange={field.onChange}
                                                        placeholder="Add Tags & Press Enter"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Experience Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Braces className="h-5 w-5 text-blue-600" />
                                    <h4 className="text-lg font-semibold">Experience Requirements</h4>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <FormField
                                        control={control}
                                        name="experienceLevel"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Experience Level <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Experience Level" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {experienceLevelOptions.map((option) => (
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

                                    <FormField
                                        control={control}
                                        name="experienceYears.min"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Minimum Experience <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="number"
                                                        placeholder="Min" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="experienceYears.max"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Maximum Experience <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="number"
                                                        placeholder="Max" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Compensation Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Wallet className="h-5 w-5 text-blue-600" />
                                    <h4 className="text-lg font-semibold">Compensation & Benefits</h4>
                                </div>

                                <div className="grid grid-cols-4 gap-4">
                                    <FormField
                                        control={control}
                                        name="salaryRange.currency"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Currency <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Currency" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {currencyOptions.map((option) => (
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

                                    <FormField
                                        control={control}
                                        name="salaryRange.min"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Minimum Salary <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="number"
                                                        placeholder="Min" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="salaryRange.max"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Maximum Salary <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="number"
                                                        placeholder="Max" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex items-center">
                                        <FormField
                                            control={control}
                                            name="salaryRange.negotiable"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center gap-2">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>Negotiable</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <FormField
                                        control={control}
                                        name="benefits"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Benefits
                                                </FormLabel>
                                                <FormControl>
                                                    <ArrayInputField
                                                        values={field.value || []}
                                                        onChange={field.onChange}
                                                        placeholder="Add Benefits & Press Enter"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Application Details */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <BookText className="h-5 w-5 text-blue-600" />
                                    <h4 className="text-lg font-semibold">Application Details</h4>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <FormField
                                        control={control}
                                        name="workArrangement"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Work Arrangement <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Work Arrangement" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {workArrangementOptions.map((option) => (
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

                                    <FormField
                                        control={control}
                                        name="maxApplications"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Max Applications
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="number"
                                                        placeholder="Add Max Applications" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="deadline"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col gap-2">
                                                <FormLabel>
                                                    Deadline <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a Deadline</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={(date) => field.onChange(date ?? undefined)}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleGoBack}
                                    className="gap-2"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={isLoading || !isDirty}
                                    className="gap-2"
                                    size="lg"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            Update Job Post
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default EditJobPost