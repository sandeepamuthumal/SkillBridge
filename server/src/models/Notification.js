import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: [
            'application_status_update',
            'new_job_match',
            'interview_scheduled',
            'message_received',
            'profile_viewed',
            'job_deadline_reminder',
            'system_announcement'
        ],
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed // For storing additional data like job IDs, etc.
    },
    read: {
        type: Boolean,
        default: false
    },
    readAt: Date
}, {
    timestamps: true
});

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);