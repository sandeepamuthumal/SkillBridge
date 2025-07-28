import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    jobSeekerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobSeeker',
        required: true
    },
    jobPostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobPost',
        required: true
    },
    resumeUrl: {
        type: String,
        required: true,
        trim: true
    },
    coverLetterUrl: {
        type: String,
        trim: true
    },
    additionalNotes: {
        type: String,
        maxlength: 2000
    },
    appliedDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: [
            'Applied',
            'Under Review',
            'Shortlisted',
            'Interview Scheduled',
            'Interview Completed',
            'Assessment Pending',
            'Reference Check',
            'Offer Extended',
            'Offer Accepted',
            'Offer Declined',
            'Rejected',
            'Withdrawn'
        ],
        default: 'Applied'
    },
    statusHistory: [{
        status: String,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        notes: String
    }],
    matchingScore: {
        type: Number,
        min: 0,
        max: 100
    },
    matchingDetails: {
        skillsMatch: Number,
        experienceMatch: Number,
        educationMatch: Number,
        locationMatch: Number
    },
    employerNotes: {
        type: String,
        maxlength: 1000
    },
    interviews: [{
        type: {
            type: String,
            enum: ['Phone', 'Video', 'In-person', 'Technical', 'HR'],
            required: true
        },
        scheduledDate: {
            type: Date,
            required: true
        },
        duration: Number, // in minutes
        interviewer: String,
        notes: String,
        status: {
            type: String,
            enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'],
            default: 'Scheduled'
        }
    }],
    feedback: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback'
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate applications
applicationSchema.index({ jobSeekerId: 1, jobPostId: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);