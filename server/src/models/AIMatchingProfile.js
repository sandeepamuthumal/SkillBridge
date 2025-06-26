import mongoose from 'mongoose';

const aiMatchingProfileSchema = new mongoose.Schema({
    jobSeekerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobSeeker',
        required: true,
        unique: true
    },
    skillsVector: [Number], // For AI vector matching
    preferences: {
        jobTypes: [String],
        categories: [String],
        salaryRange: {
            min: Number,
            max: Number
        },
        location: String,
        remoteWork: Boolean
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model('AIMatchingProfile', aiMatchingProfileSchema);