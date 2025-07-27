import mongoose from 'mongoose';

const jobPostSchema = new mongoose.Schema({
    employerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: [true, 'Job description is required'],
        trim: true,
        maxlength: 5000
    },
    responsibilities: [String],
    requirements: [{
        type: String,
        required: true,
        trim: true
    }],
    preferredSkills: [String],
    experienceLevel: {
        type: String,
        enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
        required: true
    },
    experienceYears: {
        min: {
            type: Number,
            min: 0
        },
        max: {
            type: Number,
            max: 50
        }
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobCategory',
        required: true
    },
    typeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobType',
        required: true
    },
    cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    salaryRange: {
        min: {
            type: Number,
            required: true
        },
        max: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'USD'
        },
        negotiable: {
            type: Boolean,
            default: false
        }
    },
    benefits: [String],
    workArrangement: {
        type: String,
        enum: ['On-site', 'Remote', 'Hybrid'],
        default: 'On-site'
    },
    deadline: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Draft', 'Published', 'Paused', 'Closed', 'Expired'],
        default: 'Draft'
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: Date,
    maxApplications: {
        type: Number,
        default: 100
    },
    applicationCount: {
        type: Number,
        default: 0
    },
    viewCount: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    tags: [String],
    isActive: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});


// Index for AI matching and search
jobPostSchema.index({ requirements: 1, categoryId: 1, typeId: 1 });
jobPostSchema.index({ status: 1, isApproved: 1, deadline: 1 });

export default mongoose.model('JobPost', jobPostSchema);