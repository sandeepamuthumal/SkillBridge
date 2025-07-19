import { UNIVERSITY_DOMAINS, BUSINESS_EMAIL_PATTERNS } from "../config/universities.js";
import Joi from 'joi';

// Job Seeker Registration DTO
const jobSeekerSignupDTO = Joi.object({
    firstName: Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/)
        .required()
        .messages({
            'string.min': 'First name must be at least 2 characters',
            'string.max': 'First name cannot exceed 50 characters',
            'string.pattern.base': 'First name can only contain letters and spaces',
            'any.required': 'First name is required'
        }),

    lastName: Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/)
        .required()
        .messages({
            'string.min': 'Last name must be at least 2 characters',
            'string.max': 'Last name cannot exceed 50 characters',
            'string.pattern.base': 'Last name can only contain letters and spaces',
            'any.required': 'Last name is required'
        }),

    email: Joi.string()
        .email()
        .required()
        .custom((value, helpers) => {
            const domain = value.split('@')[1];
            if (!domain || !domain.endsWith('.ac.lk')) {
                return helpers.message('Please use your official university email ending with .ac.lk');
            }
            return value;
        })
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters',
            'string.pattern.base': 'Password must contain uppercase, lowercase, number and special character',
            'any.required': 'Password is required'
        }),

    university: Joi.string()
        .required()
        .messages({
            'any.required': 'University is required'
        }),

    fieldOfStudy: Joi.string()
        .optional(),

    role: Joi.string()
        .valid('Job Seeker')
        .required(),
    termsAccepted: Joi.boolean().required(),
    privacyPolicyAccepted: Joi.boolean().required()
});

// Employer Registration DTO
const employerSignupDTO = Joi.object({
    email: Joi.string()
        .email()
        .required()
        // .custom((value, helpers) => {
        //     const domain = value.split('@')[1];
        //     const isFreeEmail = BUSINESS_EMAIL_PATTERNS.some(pattern => {
        //         if (pattern.startsWith('!')) {
        //             return domain === pattern.substring(1);
        //         }
        //         return false;
        //     });
        //     if (isFreeEmail) {
        //         return helpers.message('Please use your business email address, not a personal email');
        //     }
        //     return value;
        // })
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Business email is required'
        }),

    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters',
            'string.pattern.base': 'Password must contain uppercase, lowercase, number and special character',
            'any.required': 'Password is required'
        }),

    companyName: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Company name must be at least 2 characters',
            'string.max': 'Company name cannot exceed 100 characters',
            'any.required': 'Company name is required'
        }),

    contactPersonName: Joi.string()
        .min(2)
        .max(100)
        .pattern(/^[a-zA-Z\s]+$/)
        .required()
        .messages({
            'string.min': 'Contact person name must be at least 2 characters',
            'string.max': 'Contact person name cannot exceed 100 characters',
            'string.pattern.base': 'Name can only contain letters and spaces',
            'any.required': 'Contact person name is required'
        }),

    companySize: Joi.string()
        .valid('startup', 'small', 'medium', 'large')
        .required()
        .messages({
            'any.only': 'Please select a valid company size',
            'any.required': 'Company size is required'
        }),

    industry: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.min': 'Industry must be at least 2 characters',
            'string.max': 'Industry cannot exceed 50 characters',
            'any.required': 'Industry is required'
        }),

    companyWebsite: Joi.string()
        .uri()
        .optional()
        .allow('')
        .messages({
            'string.uri': 'Please provide a valid website URL'
        }),

    companyDescription: Joi.string()
        .max(500)
        .optional()
        .allow('')
        .messages({
            'string.max': 'Company description cannot exceed 500 characters'
        }),

    role: Joi.string()
        .valid('Employer')
        .required(),

    termsAccepted: Joi.boolean().required(),
    privacyPolicyAccepted: Joi.boolean().required()
});

// Admin Registration DTO
const adminSignupDTO = Joi.object({
    firstName: Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/)
        .required()
        .messages({
            'string.min': 'First name must be at least 2 characters',
            'string.max': 'First name cannot exceed 50 characters',
            'string.pattern.base': 'First name can only contain letters and spaces',
            'any.required': 'First name is required'
        }),

    lastName: Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/)
        .required()
        .messages({
            'string.min': 'Last name must be at least 2 characters',
            'string.max': 'Last name cannot exceed 50 characters',
            'string.pattern.base': 'Last name can only contain letters and spaces',
            'any.required': 'Last name is required'
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters',
            'string.pattern.base': 'Password must contain uppercase, lowercase, number and special character',
            'any.required': 'Password is required'
        }),

    role: Joi.string()
        .valid('Admin')
        .required()
});

// Sign In DTO
const signinDTO = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required'
        }),

    role: Joi.string()
        .valid('Job Seeker', 'Employer', 'Admin')
        .optional()
});

// Forgot Password DTO
const forgotPasswordDTO = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        })
});

// Reset Password DTO
const resetPasswordDTO = Joi.object({
    token: Joi.string()
        .required()
        .messages({
            'any.required': 'Reset token is required'
        }),

    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters',
            'string.pattern.base': 'Password must contain uppercase, lowercase, number and special character',
            'any.required': 'Password is required'
        }),
});

export {
    jobSeekerSignupDTO,
    employerSignupDTO,
    adminSignupDTO,
    signinDTO,
    forgotPasswordDTO,
    resetPasswordDTO
};