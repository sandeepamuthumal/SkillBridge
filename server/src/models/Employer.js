import mongoose from 'mongoose';

const employerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
        maxlength: 100
    },
    companyDescription: {
        type: String,
        trim: true,
        maxlength: 2000
    },
    companyWebsite: {
        type: String,
        trim: true
    },
    logoUrl: {
        type: String,
        trim: true
    },
    industry: {
        type: String,
        required: true,
        trim: true
    },
    companySize: {
        type: String,
        enum: ['startup', 'small', 'medium', 'large'],
        required: true
    },
    foundedYear: {
        type: Number,
        min: 1800,
        max: new Date().getFullYear()
    },
    contactPersonName: {
        type: String,
        trim: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationDocuments: [{
        type: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    contactInfo: {
        phone: String,
        address: String,
        cityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'City'
        }
    },
    socialLinks: {
        linkedin: String,
        twitter: String,
        facebook: String
    }
}, {
    timestamps: true
});

export default mongoose.model('Employer', employerSchema);