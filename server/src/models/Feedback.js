import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    employerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer',
        required: true
    },
    jobSeekerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobSeeker',
        required: true
    },
    jobTitle: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    feedback: {
        type: String,
        required: true,
        maxlength: 1000
    },
    skills: [String],
    wouldRecommend: {
        type: Boolean,
        default: false
    },
    isPublic: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model('Feedback', feedbackSchema);