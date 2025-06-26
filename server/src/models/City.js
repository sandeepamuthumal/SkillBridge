import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    countryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    stateProvince: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    coordinates: {
        latitude: Number,
        longitude: Number
    }
}, {
    timestamps: true
});

// Compound index for unique city per country
citySchema.index({ name: 1, countryId: 1 }, { unique: true });

export default mongoose.model('City', citySchema);