import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    lastName: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false,
        validate: {
            validator: function(password) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password);
            },
            message: 'Password must contain uppercase, lowercase, number and special character'
        }
    },
    role: {
        type: String,
        enum: ['Admin', 'Job Seeker', 'Employer'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    profileCompleted: {
        type: Boolean,
        default: false
    },
    // Security
    loginAttempts: {
        type: Number,
        default: 0
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    lockUntil: Date,
    lastLogin: {
        type: Date
    },
    // Email Verification
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,

    // Password Reset
    passwordResetToken: String,
    passwordResetExpires: Date
}, {
    timestamps: true
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateEmailVerificationToken = function() {
    this.emailVerificationToken = crypto.randomBytes(32).toString('hex');
    this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    return this.emailVerificationToken;
};

userSchema.methods.generatePasswordResetToken = function() {
    this.passwordResetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    return this.passwordResetToken;
};

userSchema.methods.incrementLoginAttempts = function() {
    if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
        this.lockUntil = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
    }
    this.loginAttempts += 1;
    return this.save();
};

userSchema.methods.resetLoginAttempts = function() {
    this.loginAttempts = 0;
    this.lockUntil = undefined;
    this.lastLogin = new Date();
    return this.save();
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.emailVerificationToken;
    delete userObject.passwordResetToken;
    delete userObject.loginAttempts;
    delete userObject.lockUntil;
    return userObject;
};

export default mongoose.model('User', userSchema);