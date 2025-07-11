import mongoose from 'mongoose';

const jobSeekerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    statementHeader: {
        type: String,
        trim: true,
        maxlength: 100
    },
    statement: {
        type: String,
        trim: true,
        maxlength: 500
    },
    university: {
        type: String,
        trim: true
    },
    fieldOfStudy: {
        type: String,
        trim: true
    },
    resumeUrl: {
        type: String,
        trim: true
    },
    profilePictureUrl: {
        type: String,
        trim: true
    },
    skills: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
            default: 'Beginner'
        },
        yearsOfExperience: {
            type: Number,
            min: 0,
            max: 50
        }
    }],
    educations: [{
        degree: {
            type: String,
            required: true,
            trim: true
        },
        fieldOfStudy: {
            type: String,
            required: true,
            trim: true
        },
        university: {
            type: String,
            required: true,
            trim: true
        },
        startYear: {
            type: Number,
            required: true
        },
        endYear: {
            type: Number
        },
        currentlyStudying: {
            type: Boolean,
            default: false
        },
        gpa: {
            type: Number,
            min: 0,
            max: 4
        }
    }],
    experiences: [{
        title: {
            type: String,
            required: true,
            trim: true
        },
        company: {
            type: String,
            required: true,
            trim: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date
        },
        currentlyWorking: {
            type: Boolean,
            default: false
        },
        description: {
            type: String,
            maxlength: 1000
        }
    }],
    projects: [{
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            maxlength: 1000
        },
        technologies: [String],
        projectUrl: {
            type: String,
            trim: true
        },
        githubUrl: {
            type: String,
            trim: true
        },
        startDate: Date,
        endDate: Date
    }],
    socialLinks: {
        linkedin: {
            type: String,
            trim: true
        },
        github: {
            type: String,
            trim: true
        },
        portfolio: {
            type: String,
            trim: true
        }
    },
    cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    availability: {
        type: String,
        enum: ['Immediately', 'Within 2 weeks', 'Within 1 month', 'Within 3 months'],
        default: 'Within 1 month'
    },
    expectedSalary: {
        min: Number,
        max: Number
    },
    jobPreferences: {
        jobTypes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'JobType'
        }],
        categories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'JobCategory'
        }],
        remoteWork: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true
});

export default mongoose.model('JobSeeker', jobSeekerSchema);