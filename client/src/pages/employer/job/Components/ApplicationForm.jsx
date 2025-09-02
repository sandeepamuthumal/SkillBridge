import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
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
  Users
} from 'lucide-react';
import { toast } from 'react-toastify';
import ArrayInputField from './ArrayInputField.jsx';
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

const ApplicationForm = () => {
  // Enhanced validation schema with new fields
  const PostJobSchema = z.object({
    title: z.string()
      .min(1, "Job title is required")
      .max(100, "Job title cannot exceed 100 characters"),

    description: z.string()
      .min(1, "Job description is required")
      .max(5000, "Job description cannot exceed 5000 characters"),

    // New required fields
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

    experienceYears: z.preprocess(
      (val) => (val === "" || val === undefined ? undefined : Number(val)),
      z
        .number({
          required_error: "Experience years is required",
          invalid_type_error: "Experience years must be a number",
        })
        .min(0, "Experience years cannot be negative")
        .max(50, "Experience years cannot exceed 50")
    ),

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
      experienceYears: undefined,
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

  useEffect(() => {
    (async () => {
      try {
        const citiesRes = await seekerProfileAPI.getCities();
        setCities(citiesRes.data);
        const jobTypesRes = await seekerProfileAPI.getJobTypes();
        setJobTypes(jobTypesRes.data);
        const jobCategoriesRes = await seekerProfileAPI.getJobCategories();
        setJobCategories(jobCategoriesRes.data);
      } catch (err) {
        toast.error("Failed to load data");
        console.error("Data load failed", err);
      }
    })();
  }, []);

  const { control, handleSubmit, watch, setValue, formState: { errors, isValid, isDirty } } = form;

  const watchedValues = watch();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await jobPostAPI.createJobPost(data);

      if (result.success) {
        toast.success(result.message || "Post successfully submitted for admin review");
        form.reset();
      } else {
        toast.error(result.error || "Failed to submit post");
      }
    } catch (error) {
      toast.error("Unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
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

                {/* New Location & Category Fields */}
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
                <div className="grid grid-cols-2 gap-4">
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
                    name="experienceYears"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Experience Years <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="number"
                            placeholder="Add Experience Years" {...field} />
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

              {/* Submit Button */}
              <div className="space-y-2">
                <div className="flex justify-end pt-4 border-t">
                  <Button
                    type="submit"
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
                        Post Job
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ApplicationForm