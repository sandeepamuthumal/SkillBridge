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
        maxlength: [100, 'Statement header cannot exceed 100 characters']
    },
    statement: {
        type: String,
        trim: true,
        maxlength: [500, 'Statement cannot exceed 500 characters']
    },
    contactNumber: {
        type: String,
        trim: true,
        match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
    },
    university: {
        type: String,
        required: true,
        trim: true
    },
    fieldOfStudy: {
        type: String,
        required: true,
        trim: true
    },
    // Documents
    resumeUrl: {
        type: String,
        trim: true
    },
    profilePictureUrl: {
        type: String,
        trim: true
    },
    skills: [String],
    educations: [{
        degree: {
            type: String,
            trim: true
        },
        fieldOfStudy: {
            type: String,
            trim: true
        },
        university: {
            type: String,
            trim: true
        },
        startYear: {
            type: Number,
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
            trim: true
        },
        startDate: {
            type: Date,
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
    },
    // Profile Statistics
    profileViews: {
        type: Number,
        default: 0
    },
    profileCompleteness: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    profileVisibility: {
        type: String,
        enum: ['Public', 'Private', 'Limited'],
        default: 'Public'
    },
}, {
    timestamps: true
});

// Virtual to populate user data
jobSeekerSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});

jobSeekerSchema.virtual('city', {
    ref: 'City',
    localField: 'cityId',
    foreignField: '_id',
    justOne: true
});

jobSeekerSchema.methods.calculateProfileCompleteness = function() {
    let completeness = 0;
    const fields = [
        'statementHeader', 'statement', 'resumeUrl', 'skills',
        'educations', 'experiences', 'projects', 'socialLinks.linkedin'
    ];

    fields.forEach(field => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            if (this[parent] && this[parent][child]) completeness += (100 / fields.length);
        } else {
            if (this[field] && (Array.isArray(this[field]) ? this[field].length > 0 : true)) {
                completeness += (100 / fields.length);
            }
        }
    });

    console.log('Profile completeness:', completeness);

    this.profileCompleteness = Math.round(completeness);
    return this.profileCompleteness;
};

// Pre-save middleware to calculate profile completeness
jobSeekerSchema.pre('save', function(next) {
    this.calculateProfileCompleteness();
    next();
});

export default mongoose.model('JobSeeker', jobSeekerSchema);