// utils/validationSchemas.js
import { z } from 'zod';

// University domains for validation
const UNIVERSITY_DOMAINS = [
    'uoc.lk', 'eng.pdn.ac.lk', 'mrt.ac.lk', 'kln.ac.lk',
    'sjp.ac.lk', 'ruh.ac.lk', 'sab.ac.lk', 'nsbm.ac.lk', 'sliit.lk'
];

// Business email blacklist
const FREE_EMAIL_DOMAINS = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com'
];

// Job Seeker validation schema
export const jobSeekerSchema = z.object({
    firstName: z
        .string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name cannot exceed 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),

    lastName: z
        .string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name cannot exceed 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),

    email: z
        .string()
        .email('Please enter a valid email address')
        .refine((value) => value.endsWith('.ac.lk'), {
            message: 'Please use your official university email ending with .ac.lk',
        }),

    university: z.string().min(1, 'Please select your university'),

    fieldOfStudy: z
        .string()
        .min(2, 'Field of study must be at least 2 characters')
        .max(100, 'Field of study cannot exceed 100 characters'),

    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Password must contain uppercase, lowercase, number and special character'
        ),

    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Employer validation schema
export const employerSchema = z.object({
    companyName: z
        .string()
        .min(2, 'Company name must be at least 2 characters')
        .max(100, 'Company name cannot exceed 100 characters'),

    contactPersonName: z
        .string()
        .min(2, 'Contact name must be at least 2 characters')
        .max(100, 'Contact name cannot exceed 100 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Contact name can only contain letters and spaces'),

    businessEmail: z
        .string()
        .email('Please enter a valid email address')
        // .refine((email) => {
        //     const domain = email.split('@')[1];
        //     return !FREE_EMAIL_DOMAINS.includes(domain);
        // }, 'Please use your business email address, not a personal email')
        ,

    companySize: z.string().min(1, 'Please select company size'),

    industry: z.string().min(1, 'Please select industry'),

    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Password must contain uppercase, lowercase, number and special character'
        ),

    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

//login validation schema
export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});