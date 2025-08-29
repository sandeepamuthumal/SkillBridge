import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  Briefcase,
  Award,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';


const ApplicationForm = () => {
  // Validation schema using Zod
  const PostJobSchema = z.object({
    title: z.string()
      .min(1, "Job title is required")
      .max(100, "Job title cannot exceed 100 characters"),

    description: z.string()
      .min(1, "Job description is required")
      .max(5000, "Job description cannot exceed 5000 characters"),

    responsibilities: z.array(z.string()).optional(),

    requirements: z.array(
      z.string().min(1, "Requirement is required")
    ).nonempty("At least one requirement is required"),

    preferredSkills: z.array(z.string()).optional(),

    experienceLevel: z.enum(["Entry Level", "Mid Level", "Senior Level", "Executive"], {
      errorMap: () => ({ message: "Experience level is required" }),
    }),

    experienceYears: z.object({
      min: z.number().min(0, "Minimum years cannot be negative").max(50, "Minimum years cannot exceed 50").optional(),
      max: z.number().min(0, "Maximum years cannot be negative").max(50, "Maximum years cannot exceed 50").optional(),
    }).partial(),

    salaryRange: z.object({
      min: z.number({ invalid_type_error: "Salary minimum is required" }),
      max: z.number({ invalid_type_error: "Salary maximum is required" }),
      currency: z.string().default("USD"),
      negotiable: z.boolean().default(false),
    }),

    benefits: z.array(z.string()).optional(),

    workArrangement: z.enum(["On-site", "Remote", "Hybrid"]).default("On-site"),

    deadline: z.preprocess(
      (val) => {
        if (typeof val === "string" || typeof val === "number") {
          return new Date(val);
        }
        return undefined;
      },
      z.date({ required_error: "Deadline is required" })
    ),

    maxApplications: z.number().default(100),

    tags: z.array(z.string()).optional(),
  });

  const form = useForm({
    resolver: zodResolver(PostJobSchema)
  });

  const { control, handleSubmit, watch, setValue, formState: { errors, isValid, isDirty } } = form;


  const watchedValues = watch();

  const onSubmit = async (data) => {
    try {
      // await onSave?.(data);
      toast.success('Post successfully submitted for admin review');
    } catch (error) {
      toast.error('Failed to submit post');
      console.error('Save error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Company Information */}
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <h4 className="text-lg font-semibold">Job Information</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <FormField
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Company Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your company name"
                          maxLength={100} {...field} />
                      </FormControl>
                      {/* <FormDescription>
                        {watchedValues.title?.length || 0}/100 characters
                      </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ApplicationForm


// import { employerProfileAPI } from '@/services/employer/employerProfileAPI';