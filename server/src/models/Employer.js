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
    businessEmail: {
        type: String,
        required: [true, 'Business email is required'],
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    website: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: 2000
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
        enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
        required: true
    },
    foundedYear: {
        type: Number,
        min: 1800,
        max: new Date().getFullYear()
    },
    headquarters: {
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