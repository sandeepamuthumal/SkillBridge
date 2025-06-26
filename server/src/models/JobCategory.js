import mongoose from 'mongoose';

const jobCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    icon: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobCategory'
    },
    skillKeywords: [String] // For AI matching
}, {
    timestamps: true
});

export default mongoose.model('JobCategory', jobCategorySchema);