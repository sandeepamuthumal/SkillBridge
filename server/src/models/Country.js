import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        length: 2
    },
    phoneCode: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Country', countrySchema);